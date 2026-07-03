# STATUS — Estado Vivo do Projeto

> **Regra:** todo agente lê este arquivo ANTES de trabalhar e o atualiza AO TERMINAR (ver protocolo no `AGENTS.md`).
> Última atualização: **2026-07-03**

## O que está no ar

| Ativo | Estado |
|---|---|
| Site | `paladaresdamantiqueira.com.br` ativo no Netlify (deploy via git) |
| Landings SEO | 14 páginas (cidades/nichos/sazonais) geradas por `scripts/gen-landings.mjs` |
| GA4 | Ativo (`G-42VSMJHHFD`), conversão `solicitar_orcamento` instrumentada. Higiene do painel PENDENTE (dimensões personalizadas, IP interno, Search Console) |
| Google Business Profile | Verificado, categoria "Personal chef service", **incompleto**, **1 avaliação**, fora do Local Pack |
| Instagram | @paladaresdamantiqueira criado, **0 posts**, ícone ainda no header do site |
| WhatsApp | +55 12 99771-0040, pessoal (migração p/ Business pendente) |
| Baseline de leads | 3–8 pedidos de orçamento/mês |

## Frente ativa: PLANO DE CRESCIMENTO E LEADS

**Plano-mestre:** [`docs/12-PLANO-CRESCIMENTO-E-LEADS.md`](docs/12-PLANO-CRESCIMENTO-E-LEADS.md) (criado 2026-07-02, aprovação do Rafael pendente)

**Fase atual:** FASE 1 — Semana 1 (nada iniciado ainda)

### Próximas ações (em ordem)

1. 🧑‍🍳 Rafael: aprovar/ajustar o doc 12.
2. 🧑‍🍳 GBP Sprint de Fundação (doc 12 §1.1) — 2h no painel, textos prontos no Apêndice A.1.
3. 🧑‍🍳 Iniciar blitz de avaliações (§1.2) — 1–2 envios/dia.
4. 🤖 Código (1 deploy): remover ícone IG do header (§1.3) + microcopy sob CTAs (§1.7).
5. 🤖 Gerar planilha-funil modelo (§1.4).
6. 🧑‍🍳 WhatsApp Business + Respostas Rápidas do Apêndice A.3 (§1.5).
7. 🧑‍🍳 Fechar 2 pendências do doc 09 (§1.6) → 🤖 registrar no doc 09.

## Pendências de decisão do Rafael

- Aprovar o doc 12 (ou ajustar fases/itens).
- Doc 09 ⏳: faixas de cancelamento + prazo do saldo (defaults sugeridos no doc 12 §1.6).
- PLANEJAMENTO.md §4: itens 1–5 antigos (nomes, telefones 3003/0800, etc.) — alguns podem estar obsoletos; revisar quando tocar no conteúdo.

## Frente paralela: MELHORIAS TÉCNICAS DO SITE

**Backlog:** [`docs/13-MELHORIAS-TECNICAS-SITE.md`](docs/13-MELHORIAS-TECNICAS-SITE.md) (criado 2026-07-02, aprovação do Rafael pendente) — 4 lotes: mobile crítico, performance 4G, acessibilidade, arquitetura.
**Bug confirmado ao vivo (viewport 375px):** botão "Solicitar" do header sobrepõe o nome da marca em ~90px; filtros de ocasião empilham em 6 linhas; inputs 14px causam zoom no iOS. O Lote 1 do doc 13 **absorve** os itens §1.3 e §1.7 do doc 12 (mesmo deploy).

## Frente retomada: APP DE RECEITAS E OPERAÇÃO

**Controle:** [`docs/portfolio-receitas/README.md`](docs/portfolio-receitas/README.md)

**Estado:** arquitetura funcional e modelos Markdown de ficha técnica, insumos e estoque prontos; nenhum código específico do app foi iniciado. O React/Vite existente é o site público.

**Próximo marco:** validar as premissas `P-FT01` a `P-FT07` e concluir uma receita real com 5–10 insumos, rendimento, peso bruto e custo conferidos. Só então definir stack, banco, autenticação e implantação do app interno.

## Log de sessões

| Data | O que foi feito | Próxima ação |
|---|---|---|
| 2026-07-02 | Diagnóstico multi-agente (4 auditores + crítico adversarial) → criado `docs/12-PLANO-CRESCIMENTO-E-LEADS.md`; `AGENTS.md` ampliado para o projeto todo; criado este `STATUS.md`; índice `docs/README.md` atualizado | Rafael aprovar doc 12 e executar §1.1–1.2; agente executar §1.3/1.7 (1 deploy) |
| 2026-07-02 (2) | Auditoria técnica multi-agente (mobile, UX/UI/a11y, código/perf) + inspeção ao vivo no preview mobile → criado `docs/13-MELHORIAS-TECNICAS-SITE.md` (36 achados consolidados em 4 lotes) | Rafael aprovar doc 13; agente executar o Lote 1 (inclui doc 12 §1.3/§1.7) e verificar no preview antes do deploy |
| 2026-07-02 (3) | **Lote 1 (doc 13) EXECUTADO e verificado no preview mobile/desktop**: header mobile sem colisão (emblema + botão; IG removido do header = doc 12 §1.3), FAB com safe-area + folga no rodapé, inputs 16px, modais 92dvh, filtros roláveis, scroll-padding 80px, CTAs full-width mobile, colagem do Conceito empilhada, touch targets 44px, microcopy sob CTAs (doc 12 §1.7). Build OK (14 landings regeneradas). | Deploy (push) → Lote 2 (performance) |
| 2026-07-02 (4) | **Lote 2 (doc 13) EXECUTADO e verificado no preview de produção (dist SSG, zero avisos de hidratação)**: vídeo do hero só ≥768px/sem save-data (mobile fica no poster), poster/imagens/fontes 100% self-host (12 Unsplash→WebP local via `scripts/otimizar-imagens.mjs`; chef 499→73KB; logo 109→10KB; 7 woff2 em public/fonts + preload), cache headers no netlify.toml, LazyMotion (bundle 448→400KB, gzip 134→120KB), envio do pedido virou `<a>` nativo com feedback (funciona no webview do Instagram). `.jpg` antigos removidos do public/. | Deploy (push) → Lote 3 (acessibilidade/UX) |
| 2026-07-03 | Retomada do app de receitas: documentação, roadmap, modelos e repositório revisados. Confirmado que ainda não existe implementação do app; criado resumo Agora/Próximo/Depois e registrada a separação em relação ao site público. | Rafael validar `P-FT01` a `P-FT07` e escolher a primeira receita real. |
| 2026-07-03 (2) | Criado `docs/portfolio-receitas/HANDOFF-APP-RECEITAS.md` como contexto autônomo do app; índice e protocolo de continuidade ajustados para não misturar site, marketing ou CRM na nova conversa. | Iniciar nova conversa pelo handoff e validar `P-FT01` a `P-FT07`. |
| 2026-07-02 (5) | **Lote 3 (doc 13) EXECUTADO e verificado no preview**: hook `useModalA11y` (Esc fecha ✓, foco inicial/retorno ✓, focus trap, botão voltar fecha o modal sem sair do site ✓ — testado ao vivo), aria-labelledby nos modais, contraste AA (token `--color-brand-terracotta-light` p/ texto sobre charcoal; microcopy /50→/70), grayscale só em dispositivos com hover, `prefers-reduced-motion` (CSS + MotionConfig), FAQ com aria-expanded/h3, card virou `article` + stretched-link, filtros com aria-pressed + linha "N experiências", eyebrows renumerados 01–05, **FAB agora abre o formulário** (lead qualificado; origem `botao_flutuante` no GA4 via prop). Landings: terracotta-light + grayscale hover no CSS. | Deploy (push) → Lote 4 (arquitetura) |
| 2026-07-03 (2) | **Lote 4 (doc 13) EXECUTADO — DOC 13 CONCLUÍDO (4/4 lotes no ar)**: 7 componentes extraídos de App.tsx p/ `src/components/`, `src/data/tokens.json` como fonte única de cores (landings interpolam de lá), limpeza AI Studio (deps mortas, .env.example, define GEMINI; pacote renomeado; README reescrito), **`tsc --noEmit` agora roda no build** (pegou 1 erro real), cta-band com margem mobile, hero em `svh`. Hidratação verificada no preview do dist: zero avisos. | Rafael: executar a Fase 1 do doc 12 (GBP + avaliações + WhatsApp Business). Site tecnicamente pronto p/ receber o tráfego. |
