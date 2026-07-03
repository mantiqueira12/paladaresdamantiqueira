# 13 · Melhorias Técnicas do Site (UX/UI, Mobile, Performance, Código)

**Paladares da Mantiqueira** | Versão 1.0 | Julho/2026
Fonte: auditoria multi-agente (3 auditores: mobile/responsivo, UX/UI/acessibilidade, código/performance) + **inspeção ao vivo em viewport 375×812** que confirmou os problemas relatados pelo Rafael.

> **Para quem é:** Rafael (aprovar) e agentes (executar).
> **Como executar:** em **lotes** — cada lote é 1 rodada de código + build + verificação no preview mobile + deploy (git push). Marcar `[x]` e registrar no `STATUS.md`. Nunca misturar lotes num mesmo deploy sem necessidade.
> **Regra de ouro (SSG):** o site é pré-renderizado com hidratação. Toda correção deve ser classe/CSS ou efeito client-only pós-hidratação — nada que mude o HTML inicial entre servidor e cliente.

---

## Diagnóstico em uma linha

A base é boa (sem overflow horizontal, modais bottom-sheet corretos, scroll lock funciona), mas o mobile tem **1 quebra grave visível** (header), **fricções de iOS no momento exato da conversão** (zoom nos campos, CTA atrás da barra do Safari) e o site carrega **muito peso desnecessário no 4G** (vídeo, fontes, imagens externas).

**A "sobreposição do botão de WhatsApp" relatada:** confirmada ao vivo — é o botão **"Solicitar" do header** (com ícone de balão) que invade ~90px do nome "Paladares da Mantiqueira" em telas <400px (medido: título x=154–262, botão começa em x=173). Como o header é fixo, o defeito aparece em **todas** as telas. O botão flutuante redondo também tem problemas (sem folga no rodapé, sem safe-area de iPhone), mas a colisão gritante é a do header.

---

## LOTE 1 — Mobile crítico (a queixa do Rafael) · ~1 dia · risco baixo

*Só classes Tailwind/CSS. Inclui 2 itens do plano de leads (doc 12) para matar tudo num deploy só.*

- [x] **1.1 Header mobile** (`src/App.tsx` ~123–176; landings `scripts/gen-landings.mjs` ~198–218 e 369–389):
  esconder a tagline "Concierge Gastronômico" em `<sm`; nome com `text-lg sm:text-xl md:text-2xl` + `whitespace-nowrap`; botão "Solicitar" com `px-4 sm:px-6`; **remover o ícone do Instagram do header** (não só esconder — é o item §1.3 do doc 12: IG com 0 posts vaza confiança; volta quando tiver 9–12 posts). Replicar via media query no CSS das landings.
- [x] **1.2 Botão flutuante de WhatsApp** (`src/App.tsx` ~706–724; landings `.wa-float` ~322–325):
  `fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] md:right-8 md:bottom-8`; `pb-24 md:pb-0` no bloco final do rodapé; `aria-label="Solicitar orçamento pelo WhatsApp"`; `motion-safe:` no `animate-ping`. Landings: `bottom:calc(16px + env(safe-area-inset-bottom)); right:16px` + folga no footer.
- [x] **1.3 Campos do formulário com 16px no mobile** (`src/components/PedidoExperiencia.tsx` ~227): `text-sm` → `text-base md:text-sm` no `inputCls` (mata o auto-zoom do iOS no momento da conversão). Placeholder de `/35` → `/50`.
- [x] **1.4 Modais com `dvh` + safe-area** (`PedidoExperiencia.tsx` ~73/209; `ExperienciaModal.tsx` ~40/172): `max-h-[92vh]` → `max-h-[92dvh]`; rodapé sticky com `pb-[max(1.25rem,env(safe-area-inset-bottom))]` (CTA "Enviar meu pedido" não fica mais atrás da barra do Safari).
- [x] **1.5 Filtros de ocasião em linha rolável** (`src/App.tsx` ~321–330; confirmado ao vivo: hoje empilham em **6 linhas**): no mobile, virar faixa horizontal com `overflow-x-auto` + `flex-nowrap` + `snap-x` (com `-webkit-overflow-scrolling`), mantendo o wrap centralizado em `md:`.
- [x] **1.6 Âncoras sob o header fixo** (`src/index.css`): `html{scroll-padding-top:80px}` (títulos das seções não somem mais atrás do header ao navegar).
- [x] **1.7 CTAs largos em telas ≤360px** (`src/App.tsx` hero ~215–229 e pré-rodapé ~526–532): `w-full sm:w-auto justify-center` + tracking reduzido no mobile.
- [x] **1.8 Colagem do Conceito** (`src/App.tsx` ~260–302): hoje a coluna de 1/3 vira cápsulas de ~100px; empilhar no mobile (`flex-col sm:flex-row`, principal `h-[320px] sm:h-[500px]`, coluna vira linha `flex-row sm:flex-col h-40`).
- [x] **1.9 Alvos de toque ≥44px** (fechar dos modais `p-3`+ícone 20; chips `py-3` mobile; ícones/áreas do header `min-w-11 min-h-11`).
- [x] **1.10 Microcopy sob os CTAs primários** (doc 12 §1.7): "Orçamento sem compromisso · resposta no WhatsApp no mesmo dia" no hero da home e das 14 landings.
- [x] **1.11 Verificação:** preview mobile 375px e 360px — header, filtros, modal com teclado, fim de página; depois build + deploy + conferir no ar.

## LOTE 2 — Performance no 4G (velocidade = conversão) · ~1–2 dias

- [x] **2.1 Vídeo do hero só em desktop** (`src/App.tsx` ~89–104): no `useEffect`, iniciar só se `min-width: 768px` && sem `prefers-reduced-motion` && sem `saveData`. No celular fica o poster (visual idêntico). `aria-hidden="true"` no `<video>`.
- [x] **2.2 Poster do hero self-host + preload** (`index.html`): gerar `public/hero-poster.webp` (~1280px, 80–120KB), `<link rel="preload" as="image" fetchpriority="high">`; heros das landings idem.
- [x] **2.3 Fontes self-host** (`index.html` + `gen-landings.mjs`): `@fontsource` Inter (300–600) + Playfair (400/700/italic), `font-display:swap`, preload dos 2 woff2 principais — remove o CSS render-blocking do Google Fonts das 15 páginas.
- [x] **2.4 Imagens: sharp no build + WebP + srcset** (`scripts/`): otimizar `chef-rafael.jpg` (510KB), `pinhao.jpg` (640KB), logo (111KB→~10KB); gerar 480/800/1200 e usar `srcset/sizes` na home e landings.
- [x] **2.5 Unsplash → local** (`src/data/imagens.ts`): baixar as ~10 imagens de produção, otimizar e servir de `public/portfolio/` (elimina dependência externa, `referrerPolicy` e `onError` espalhados).
- [x] **2.6 Cache headers no `netlify.toml`**: `/assets/*` → `max-age=31536000, immutable`; imagens/fontes → `max-age=604800`.
- [x] **2.7 Code-splitting** (`src/App.tsx`): **feito via `LazyMotion/m`** (448KB→400KB; gzip 134→120KB). O `React.lazy` dos modais foi **descartado**: ganho marginal (~10KB) e custo real — perde a animação de saída do `AnimatePresence` e complica o SSG.
- [x] **2.8 Envio do pedido robusto em webview** (`PedidoExperiencia.tsx` ~49–57): botão → `<a href={linkWhatsApp} target="_blank" rel="noopener noreferrer">` com onClick só de analytics + feedback pós-clique ("Seu pedido foi aberto no WhatsApp 💬"). `window.open` falha no navegador embutido do Instagram — **e o tráfego novo virá justamente do IG** (doc 12).
- [x] **2.9 Logo com `width/height`** (CLS) na home e landings.
- [x] **2.10 Verificação:** preview de produção (dist pré-renderizado) sem nenhum erro/aviso de hidratação; 7 fontes locais carregadas; vídeo carrega em 1280px e NÃO carrega em 375px; zero referências a Unsplash/Google Fonts no dist. Peso: bundle 448→400KB (gzip 134→120), chef 499→73KB, logo 109→10KB, 12 imagens externas viraram WebP local de 17–106KB.

## LOTE 3 — Acessibilidade e polimento de UX · ~1 dia

- [x] **3.1 Modais completos** (`ExperienciaModal.tsx`, `PedidoExperiencia.tsx`): Esc fecha; foco vai ao modal e retorna ao fechar; focus trap no Tab; `aria-labelledby`; **botão voltar do Android fecha o modal** (pushState/popstate) em vez de sair do site.
- [x] **3.2 Contraste WCAG AA** (`src/index.css` + usos): token `--color-brand-terracotta-light` para texto terracotta sobre charcoal (~2,4:1 hoje); piso `/70` para microcopy informativa sobre creme (hoje `/40–/50` ≈ 2,3–2,9:1).
- [x] **3.3 Fotos sem grayscale no mobile** (`src/App.tsx` ~281/673): comida dessaturada permanentemente onde não há hover — `[@media(hover:hover)]:grayscale-[35%]`; cor plena no touch.
- [x] **3.4 `prefers-reduced-motion`** global no CSS + `useReducedMotion` nos `motion.div`.
- [x] **3.5 FAQ com semântica de acordeão** (aria-expanded/controls, pergunta vira `<h3>`).
- [x] **3.6 Card de experiência**: `<button>` contendo `<h3>` é HTML inválido — virar `article` + stretched-link com `aria-label`.
- [x] **3.7 Filtros**: `aria-pressed` + linha `role="status"` "N experiências para [filtro]".
- [x] **3.8 Eyebrows padronizados** (numeração 01–05 hoje quebrada, sublinhados inconsistentes, 9–10px → 11–12px).
- [x] **3.9 Botão flutuante abre o formulário** em vez de link cru do wa.me (lead chega qualificado; manter `rastrearOrcamento('botao_flutuante')`). *Validar com Rafael — muda comportamento.*

## LOTE 4 — Arquitetura e manutenção · quando conveniente

- [ ] **4.1 Dividir `App.tsx`** (757 linhas) em `src/sections/` — refactor mecânico, mesma árvore JSX (sem mudança visual), facilita tudo daqui pra frente.
- [ ] **4.2 Tokens de design compartilhados** home ↔ landings (hoje o CSS das landings duplica o tema em `gen-landings.mjs` — 2 lugares para manter o mesmo visual). Futuro ideal: landings renderizadas pelo mesmo `entry-server`.
- [ ] **4.3 Limpeza AI Studio**: remover `@google/genai`, `express`, `dotenv`, `tsx`, `autoprefixer`; `define` de GEMINI_API_KEY no `vite.config.ts`; reescrever `README.md` com os comandos reais.
- [ ] **4.4 `tsc --noEmit` no build** (hoje erro de tipo pode ir para produção).
- [ ] **4.5 `.cta-band` das landings** com margem lateral no mobile.

---

## Não fazer / adiado

| Item | Motivo |
|---|---|
| Redesenho do formulário (menos campos, accordion) | Já descartado no doc 12 §5 — sem dado de abandono que justifique |
| Trocar o fluxo de WhatsApp ou publicar preços | Decisões fechadas (doc 09) |
| Esconder o botão flutuante via IntersectionObserver | Opcional; só se a folga do rodapé (1.2) não bastar |
| CMS / área do cliente / agenda automática | Fase futura (doc 06) |

## Ordem recomendada e dependências

**Lote 1 já** (é a queixa e ajuda a conversão na temporada) → **Lote 2** antes do lançamento do Instagram (doc 12 Fase 2: o tráfego do IG chega por webview e 4G) → **Lote 3** → **Lote 4** (4.1 pode ser feito antes do Lote 3 para facilitar).
