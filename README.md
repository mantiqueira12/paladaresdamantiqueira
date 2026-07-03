# Paladares da Mantiqueira — site

Site do chef particular **Rafael Jacob** (Serra da Mantiqueira): landing page React/Vite com SSG (pré-renderização + hidratação) e 14 landings estáticas de SEO, publicado no Netlify em [paladaresdamantiqueira.com.br](https://paladaresdamantiqueira.com.br).

> **Agentes/colaboradores:** comecem por [`AGENTS.md`](AGENTS.md) e [`STATUS.md`](STATUS.md). O plano de negócio vive em [`docs/`](docs/README.md).

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Dev server na porta 3000 |
| `npm run build` | Build completo: typecheck → cliente → SSR → pré-render da home → 14 landings + sitemap/llms.txt |
| `npm run preview` | Serve o `dist/` (teste real de hidratação) |
| `npm run gen:cardapios` | Regenera `src/data/experiencias.json` a partir das fichas em `docs/cardapios/` (roda sozinho no prebuild) |
| `npm run lint` | Typecheck (`tsc --noEmit`) |
| `npm run otimizar:imagens` | One-shot: converte/baixa imagens para WebP em `public/` (sharp) |

## Como o conteúdo flui

- **Experiências/cardápios:** editar as fichas `.md` em `docs/cardapios/` (nunca o `experiencias.json` — é gerado).
- **Landings de SEO:** conteúdo em `src/data/{cidades,sazonais,nichos}.json`; template e CSS em `scripts/gen-landings.mjs`.
- **Cores da marca:** `src/data/tokens.json` (fonte única, usada pelas landings; manter o `@theme` de `src/index.css` em sincronia).
- **FAQ:** `src/data/faq.json` (tela + JSON-LD + fallback de SEO, sempre em sincronia).
- **Fotos:** salvar em `../Portifolio` e referenciar em `src/data/imagens.ts` (o build copia só o que é referenciado).

## Deploy

`git push` na `main` → Netlify roda `npm run build` e publica o `dist/` em produção. Sem passos manuais.
