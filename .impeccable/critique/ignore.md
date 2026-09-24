# Achados já revisados (não reabrir sem dado novo)

Este arquivo é lido pelo `/impeccable critique` antes de cada execução — os achados
abaixo já foram avaliados por um humano/agente e não devem ser repetidos como
"novidade" numa próxima rodada. Uma sessão futura com mais esforço/orçamento deve
gastar tempo em problemas *ainda não vistos*, não redescobrir estes.

Histórico completo (heurísticas, pontuação, achados do detector) em
`2026-09-24T20-59-34Z__index-html.md` — snapshot fechado em 2026-09-24 depois que
a passada de `/impeccable polish` corrigiu os 5 problemas prioritários (P0 do grid
de 14 cards, P1 de validação do formulário, P1 de legibilidade/contraste, P2 de
linhas longas, P2 de scroll mobile). Ver commit correspondente no histórico do git.

## Avaliados e aceitos como intencionais / falsos positivos do detector

- **`image-hover-transform`** (hover-scale em `<img>`, ~20 ocorrências) — padrão
  Tailwind comum e intencional (zoom suave ao passar o mouse nos cards e fotos do
  portfólio); não é um anti-padrão neste contexto.
- **`dark-glow`** (box-shadow com glow em `#ffba00` numa seção) — acento decorativo
  intencional, não um defeito.
- **`clipped-overflow-container`** (hero `section.hero-vh` e `#chef`, `overflow-hidden`)
  — usado para recorte de foto de fundo, não para esconder um popover/tooltip; o
  cenário que a regra tenta pegar (conteúdo interativo cortado) não se aplica aqui.
- **`text-occlusion`** (elemento decorativo "✦" sobreposto pelo `<h1>` do hero) —
  efeito de camada tipográfica intencional, não um bug de sobreposição.

## Avaliados e deliberadamente mantidos por enquanto (escolha editorial)

- **`kicker-above-heading` / `numbered-section-labels`** (kickers numerados
  "01. O Conceito" → "06. Perguntas Frequentes") — o próprio `craft-floor.md` desta
  skill bane esse padrão como tropo genérico de site-gerado-por-IA. Mantido por ora
  porque não fazia parte do escopo dos 5 problemas prioritários combinados com o
  Rafael em 2026-09-24; **não é** um falso positivo — é dívida de design real,
  válida para uma futura rodada de `/impeccable distill` ou `/impeccable typeset`
  decidir se remove.
- **`<input type="date">` / `<select>` nativos** quebrando a linguagem visual
  customizada — identificado como P3 (polimento) no critique original, fora do
  escopo da correção de 2026-09-24.
- **Botão flutuante do WhatsApp** (`botao_flutuante`) definido no código mas não
  montado — sobra de código, fora do escopo da correção de 2026-09-24.
- **`og:description`/copy do Twitter** usando "eventos exclusivos" — destoa do
  posicionamento anti-"evento corporativo" da marca; fora do escopo da correção de
  2026-09-24.

## Não são bugs do site (artefatos deste ambiente de nuvem)

- Imagens aparecendo em branco em screenshots headless — confirmadas OK via
  checagem de rede; efeito do Chromium headless sandboxed, não do código.
- `ERR_CERT_AUTHORITY_INVALID` ao carregar o Google Tag Manager — bloqueio do
  proxy de saída deste ambiente de sessão na nuvem, não do site.
