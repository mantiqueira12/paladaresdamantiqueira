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

## Versões de Node

O CI usa Node 22. Vitest 5 e Commitlint 21 requerem Node 22.12 ou superior; Knip 6 também aceita Node 20.19 ou Node 22.12 ou superior. As verificações locais foram executadas com Node 22.23.3. O Netlify permanece em Node 20 (`netlify.toml`) e executa `npm run build`, sem testes; o build do Netlify não foi validado localmente em Node 20 nesta execução. A mudança da versão do Netlify fica fora deste lote.
