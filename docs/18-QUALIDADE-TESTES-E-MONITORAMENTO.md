# 18 — Qualidade, testes e monitoramento

Este documento descreve os controles automatizados do site e como executá-los localmente e no CI.

## O que roda e para quê

| Comando | Ferramenta | Protege contra |
|---|---|---|
| `npm run lint` | Biome + `tsc` | Erros de código, acessibilidade básica (a11y) e de tipos |
| `npm run knip` | Knip | Código, arquivos e dependências que ninguém usa mais |
| `npm test` | Node Test Runner + Vitest | Preserva os testes existentes de mensagem/eventos e verifica decisões fechadas (vocabulário, preço público, três portas e capas) |
| `npm run test:e2e` | Playwright | Pedido, mensagem pronta sem envio, detalhe → pedido, modal, sitemap, erros de console e rolagem lateral. Roda em 1440 px e 390 px |
| `npm run commitlint` | Commitlint | Mensagens fora do padrão `tipo: descrição` (ver `AGENTS.md` §8) |
| `npm run check` | lint + knip + testes | Atalho local para verificações estáticas e testes |

O GitHub Actions (`.github/workflows/ci.yml`) roda lint, Knip, testes, build e Playwright em cada Pull Request e em cada push na `main`; o Commitlint valida as mensagens do PR. O deploy continua sendo do Netlify.

Para rodar localmente: `npm ci`, `npm run check`, `npm run build`, `npx playwright install chromium` e `npm run test:e2e`. O Playwright usa `vite preview` e testa o conteúdo construído em `dist/`; os testes não clicam no botão que abre o WhatsApp nem enviam mensagens.

## Monitoramento de erros (Sentry) — opcional e desligado por padrão

- O código está em `src/lib/monitoramento.ts` e só é incluído quando `VITE_SENTRY_DSN` existe no ambiente de build. Sem ela, a saída JavaScript principal é byte a byte igual à base desta implementação: 409.297 bytes, SHA-256 `5580aac7fee0c7d02d6f1686052f5d15bab8af89161241107a9b417a8119d9d7`.
- Com DSN, o bootstrap entra no bundle de entrada e carrega o SDK de forma assíncrona, em um chunk separado, quando o navegador fica ocioso. `sendDefaultPii` está desligado, tracing está desativado, não há Replay e `beforeSend` remove IP e cabeçalhos de cookies. A opção foi exercitada com DSN fictício; nenhum serviço externo foi ativado nem recebeu eventos.
- Para ligar: criar conta gratuita em sentry.io → projeto "Browser JavaScript" → copiar o DSN → Netlify › Site settings › Environment variables › `VITE_SENTRY_DSN` → novo deploy. **Depende do Rafael** (conta e painel).
- Antes de ligar, avaliar se a política de privacidade do site precisa mencionar o serviço (LGPD).

## Pendências conhecidas para a Issue #4

As regras herdadas de acessibilidade e dependências de hooks estão em aviso durante este lote; não foram usadas para alterar componentes existentes. O Biome aponta `useValidAnchor` em `SiteHeader.tsx` para o link `#topo`, interação de clique no backdrop dos modais (`ExperienciaModal.tsx` e `PedidoExperiencia.tsx`) e dependências de hooks em `App.tsx` e `PedidoExperiencia.tsx`. A regra de label não acusa o formulário atual. A Issue #4 deve revisar essas ocorrências e promover as regras aplicáveis para erro depois das correções.

Knip termina com avisos para exports/tipos não usados (`FAIXAS_PESSOAS` em `src/lib/pedido.ts` e tipos em `src/data/experiencias.ts`). `PORTAS` não é reportado. Esses avisos ficam registrados para triagem; nenhum código foi removido neste lote.

## Versões de Node

O CI usa Node 22. Vitest 5 e Commitlint 21 requerem Node 22.12 ou superior; Knip 6 também aceita Node 20.19 ou Node 22.12 ou superior. As verificações locais foram executadas com Node 22.23.3. O Netlify permanece em Node 20 (`netlify.toml`) e executa `npm run build`, sem testes; o build do Netlify não foi validado localmente em Node 20 nesta execução. A mudança da versão do Netlify fica fora deste lote.
