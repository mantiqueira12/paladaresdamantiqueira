# 18 — Qualidade, testes e monitoramento

Este documento descreve os controles automatizados do site e como executá-los localmente e no CI.

## O que roda e para quê

| Comando | Ferramenta | Protege contra |
|---|---|---|
| `npm run lint` | Biome + `tsc` | Erros de código, acessibilidade básica (a11y) e de tipos |
| `npm run knip` | Knip | Código, arquivos e dependências que ninguém usa mais |
| `npm test` | Node Test Runner + Vitest | Preserva os testes existentes de mensagem/eventos e verifica decisões fechadas (vocabulário, preço público, três portas e capas) |
| `npm run test:e2e` | Playwright | Pedido, mensagem pronta sem envio, submit interceptado com evento analítico, detalhe → pedido, modal, sitemap, erros de console e rolagem lateral. Roda em 1440 px e 390 px |
| `npm run commitlint` | Commitlint | Mensagens fora do padrão `tipo: descrição` (ver `AGENTS.md` §8) |
| `npm run check` | lint + knip + testes | Atalho local para verificações estáticas e testes |

O GitHub Actions (`.github/workflows/ci.yml`) roda lint, Knip, testes, build e Playwright em cada Pull Request e em cada push na `main`; o Commitlint valida as mensagens do PR. O deploy continua sendo do Netlify.

Para rodar localmente: `npm ci`, `npm run check`, `npm run build`, `npx playwright install chromium` e `npm run test:e2e`. O Playwright usa `vite preview` e testa o conteúdo construído em `dist/`. Um cenário clica no botão somente depois de interceptar o submit nativo, bloqueando popup e qualquer requisição ao WhatsApp; os demais não clicam no botão. Nenhum teste envia mensagem.

## Monitoramento de erros (Sentry) — opcional e desligado por padrão

- O código está em `src/lib/monitoramento.ts` e só é incluído quando `VITE_SENTRY_DSN` existe no ambiente de build. Na verificação da Issue #2, antes das correções funcionais da Issue #4, sem DSN a saída JavaScript principal tinha 409.297 bytes, SHA-256 `5580aac7fee0c7d02d6f1686052f5d15bab8af89161241107a9b417a8119d9d7`. Esse hash registra a verificação #2; o build #4 tem bundle atualizado.
- Com DSN, o bootstrap entra no bundle de entrada e carrega o SDK de forma assíncrona, em um chunk separado, quando o navegador fica ocioso. `sendDefaultPii` está desligado, tracing está desativado, não há Replay e `beforeSend` remove IP e cabeçalhos de cookies. A opção foi exercitada com DSN fictício; nenhum serviço externo foi ativado nem recebeu eventos.
- Para ligar: criar conta gratuita em sentry.io → projeto "Browser JavaScript" → copiar o DSN → Netlify › Site settings › Environment variables › `VITE_SENTRY_DSN` → novo deploy. **Depende do Rafael** (conta e painel).
- Antes de ligar, avaliar se a política de privacidade do site precisa mencionar o serviço (LGPD).

## Issue #4 — correções de acessibilidade e dependências

Em 06/10/2026, `noStaticElementInteractions`, `useKeyWithClickEvents`, `noLabelWithoutControl`, `useValidAnchor` e `useExhaustiveDependencies` foram promovidas a erro. Os dois backdrops agora são botões nativos fora da ordem de tabulação e da árvore acessível; Escape continua fechando o diálogo e o foco retorna ao acionador. Os campos de `Campo` têm associação explícita por `htmlFor`/`id`. `App.tsx` lê parâmetros da landing sem depender de callback instável; `PedidoExperiencia.tsx` memoriza dados iniciais por valor, evitando repetição do efeito e preservando edições durante renderizações sem mudança dos dados. A confirmação de cópia é invalidada nas ações que editam o pedido.

O link `#topo` aponta para um destino existente na home; sua exceção pontual para `useValidAnchor` está documentada junto ao elemento. `PORTAS` permanece exportado e usado por `OccasionDoors`/`porta()`. `FAIXAS_PESSOAS` e os tipos auxiliares reportados pelo Knip deixaram de ser exports públicos. As regras `exports` e `types` do Knip agora são erros.

Verificação local de 06/10: lint e Knip passaram; `npm test` passou com 39 testes Node e 25 Vitest; build passou; e2e passou em desktop 1440 px e mobile 390 px (19 passados, 1 cenário de sitemap mobile pulado). Os testes novos fecham cada modal pelo backdrop, confirmam que clique no conteúdo não fecha e verificam a restauração de foco; outro garante que editar o pedido invalida a confirmação de cópia e atualiza a prévia. Os testes interceptam o envio do formulário; nenhuma mensagem real de WhatsApp é enviada.

## Issue #3 — movimento progressivo e saídas de modais

O lote de 06/10/2026 adiciona skeleton de imagem enquanto a fonte corrente aguarda resposta; a espera termina em carga, erro, fallback ou recurso já em cache. Reveals de cartões e etapas, fio de progresso da leitura e skeleton animado são progressivos: os seletores têm padrão visível/estático, os reveals só são ativados com JavaScript, e as animações de rolagem ficam dentro de `@supports`. O Chromium disponível aceita `animation-timeline: scroll()` e `view()`; a ramificação de navegador sem suporte foi verificada na folha CSS de produção (`.scroll-reveal` inicia com `opacity:1`, `.scroll-progress` com `display:none`, regras de animação dentro dos blocos `@supports`), não em um motor incompatível. O HTML pré-renderizado foi testado com JavaScript desativado em 1440 px e 390 px, incluindo a capa da experiência visível.

As duas saídas de modal usam fade de 180 ms e deixam de animar com `prefers-reduced-motion: reduce`; a abertura também fica imediata nessa preferência. Os testes observam as opacidades do overlay e do diálogo a cada quadro desde o clique nativo: com movimento reduzido, a remoção acontece em até dois quadros sem fade; com movimento normal, ambos mostram opacidade intermediária antes de sair. Os testes cobrem 1440 px e 390 px. O fade da grade ocorre apenas após a primeira mudança efetiva de filtro e termina em 240 ms; o e2e troca três filtros rapidamente e confere seleção, status e quantidade finais.

Verificação local de 06/10 com Node 24.15.0: lint sem erros e com a mesma contagem herdada (25 avisos/3 infos), Knip passou, 39 testes Node e 25 Vitest passaram, build e `verify:build` passaram. Playwright em 1440 px e 390 px: 35 passaram, 1 skip no sitemap mobile. O CI Node 22 e a integração ficam para o PR; a suíte completa local não envia ao WhatsApp.

## Issue #11 — conclusão tardia de cópia

Em 06/10/2026, `PedidoExperiencia` passou a aceitar a resolução ou rejeição de `clipboard.writeText` somente quando a tentativa continua atual e o texto ainda corresponde à prévia. Assim, editar durante a cópia mantém a confirmação invalidada; uma falha antiga não substitui o estado de uma cópia posterior nem seleciona/foca a prévia nova. E2e com promessas controladas cobre edição entre copiar A e resolver A, cópia bem-sucedida de B e rejeição tardia de A após a confirmação de B. Verificação local: lint sem erros (25 avisos/3 infos herdados), 39 testes Node, 25 Vitest, build e Playwright completo em 1440 px e 390 px (39 passaram, 1 skip no sitemap mobile). Nenhuma mensagem real de WhatsApp é enviada.

## Versões de Node

O CI usa Node 22. Vitest 5 e Commitlint 21 requerem Node 22.12 ou superior; Knip 6 também aceita Node 20.19 ou Node 22.12 ou superior. As verificações locais foram executadas com Node 22.23.3. O Netlify permanece em Node 20 (`netlify.toml`) e executa `npm run build`, sem testes; o build do Netlify não foi validado localmente em Node 20 nesta execução. A mudança da versão do Netlify fica fora deste lote.
