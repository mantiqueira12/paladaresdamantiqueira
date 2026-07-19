# 11 · SEO e Presença Digital — Google e Busca por IA

**Paladares da Mantiqueira — Chef Rafael Jacob**
Plano de visibilidade orgânica (Google) e em busca por IA (GEO/AEO) | Versão 1.0 | Junho/2026

> Consolidação de uma auditoria multi-agente em 6 frentes — SEO técnico, conteúdo on-page, conversão/UX/medição, SEO local, palavras-chave/concorrência e GEO/AEO. Itens priorizados por impacto × esforço. Toda priorização de palavra-chave é **qualitativa** (observando quem ranqueia e a intenção da SERP); **não há volume de busca inventado** — validar depois no Search Console/Keyword Planner.

---

## 1. Sumário executivo

O site tem uma base técnica de SEO acima da média para uma landing (meta tags, canonical, Open Graph, JSON-LD `LocalBusiness` + `FAQPage`, fallback estático em `index.html`, `robots.txt`/`sitemap.xml`), mas a visibilidade real está travada por dois gargalos que se reforçam.

**Gargalo técnico original — resolvido:** o site era uma SPA Vite+React que só "existia" depois do JavaScript. A home agora é pré-renderizada, e as 14 landings são geradas como HTML estático; o conteúdo principal pode ser lido sem executar JavaScript.

**Gargalo local atual:** o Google Perfil da Empresa está verificado, porém incompleto, com pouca prova social e fora do Local Pack observado na auditoria de 2026-07-19.

**A maior alavanca isolada agora é completar o GBP como negócio de área de serviço e iniciar uma rotina legítima de avaliações reais.** A base técnica e a extração sem JavaScript já estão resolvidas.

---

## 2. Diagnóstico em uma olhada

| Frente | Achado mais importante | Severidade |
|---|---|---|
| **SEO Técnico (SPA/render)** | Home pré-renderizada, 14 landings estáticas, sitemap com 15 URLs e conteúdo essencial legível sem JavaScript. | **Resolvido** |
| **Conteúdo / Páginas** | Arquitetura publicada; aprofundamento com casos, fotos e FAQ próprios depende de material real. | **Média** |
| **SEO Local + GBP** | Perfil verificado, mas ainda incompleto, com uma avaliação no snapshot de 2026-07-19 e fora do Local Pack observado. | **Alta** |
| **Autoridade / Backlinks / Citações** | Pouca prova social e poucas citações locais legítimas; depoimentos fictícios removidos. | **Alta** |
| **GEO/AEO (busca por IA)** | `WebSite`, `LocalBusiness`, `Person`, catálogo, `llms.txt` e regras para bots de IA publicados. | **Base pronta** |
| **Conversão / Medição** | GA4, evento `solicitar_orcamento`, dimensões personalizadas e links contextuais de WhatsApp configurados. | **Base pronta** |

---

## 3. Renderização e extração — resolvido

**Estado atual.** O site continua construído com React e Vite, mas não depende mais da execução de JavaScript para entregar o conteúdo principal. O build pré-renderiza a home e gera 14 landings em HTML estático. O sitemap publica 15 URLs, e cada página entrega título, descrição, H1, conteúdo, links e dados estruturados no HTML inicial.

**Fonte única.** As 14 experiências públicas vêm de `src/data/experiencias.json`; os geradores de build mantêm catálogo, landings, sitemap e `OfferCatalog` sincronizados. Depoimentos fictícios foram removidos e não fazem parte do HTML nem do schema.

**Regra de manutenção.** Todo deploy deve preservar o fluxo de geração e pré-renderização, validar o conteúdo sem JavaScript e impedir divergência entre a interface visível e os dados estruturados. Novas experiências só entram quando estiverem ativas e validadas.

**Impacto.** A antiga trava técnica foi eliminada. O próximo ganho relevante vem de autoridade local, avaliações reais, Perfil da Empresa completo e conteúdo próprio de eventos.

---

## 4. Mapa de palavras-chave (clusters)

**Conflito posicionamento × busca:** o público digita muito termos commodity ("chef em casa", "a domicílio", "buffet em casa") que a marca recusa na vitrine. Estratégia: **capturar a busca** por esses termos como *pontes* (meta description, FAQ e conteúdo de apoio, ex.: "também procurado como chef em casa / chef a domicílio") e **converter** sempre na linguagem premium de "experiência/celebração à mesa". Nunca usá-los como proposta principal, H1, nome de experiência ou categoria de GBP.

| Cluster | Intenção | Exemplos de termos | Como o site cobre | Dif. |
|---|---|---|---|---|
| **Cabeça — chef particular na serra** | Transacional | chef particular / personal chef Campos do Jordão; chef particular Serra da Mantiqueira; contratar chef particular; personal chef Santo Antônio do Pinhal / São Bento do Sapucaí | H1 + title já combinam "chef particular" + "Serra da Mantiqueira / Campos do Jordão". Reforçar: citar as 4 cidades + "Vale do Paraíba até São José dos Campos" no fallback e no FAQ; manter "na sua casa de campo" como separador dos restaurantes | Média |
| **Coloquiais / commodity (pontes)** | Transacional | chef em casa / a domicílio Campos do Jordão e SJC; cozinheiro a domicílio; jantar em casa com chef; chef para temporada | Usar **só como termo-ponte** em meta description, FAQ e fallback. Não criar páginas com cara de commodity | Média |
| **Jantar romântico / a dois / pedido de casamento** | Transacional | jantar romântico em casa Campos do Jordão; pedido de casamento jantar; jantar de Dia dos Namorados em casa; jantar privativo a dois Mantiqueira | Casa com "Entre Amigos" (a dois) e "Origens da Serra" (pedido). Conteúdo "jantar a dois no seu chalé"; ativar em junho. SERP hoje 100% restaurantes — janela | Média |
| **Bodas / aniversário de casamento** | Transacional | jantar para bodas; comemorar bodas em casa de campo; bodas de prata jantar privativo; celebrar aniversário de casamento na serra | Casa direto com "Origens da Serra". Baixa concorrência local, alto ticket | **Baixa** |
| **Aniversário / confraternização em casa de campo** | Transacional | chef para aniversário em casa; confraternização em casa de campo; chef para recepção de convidados | Linha "Casa Cheia" (Feito na Brasa, Pasta à Mesa, Viva la Pizza, Feito na Paella). Diferencial: "o anfitrião não vira cozinheiro" | Média |
| **Churrasco / brasa com chef** | Transacional | churrasqueiro a domicílio Campos do Jordão; churrasco com chef em casa; fogo de chão em casa; costela sob encomenda | Casa com "Feito na Brasa" + curadoria de cortes. Separar do "churrasqueiro de buffet" | Média |
| **Fondue (sazonal inverno) ⚠️** | Majoritariamente **informacional** | fondue em casa; noite de fondue; chef para noite de fondue na serra; fondue de queijo da serra | **Não brigar pelo head** (receitas — Nestlé/Panelinha). Ir só na cauda transacional+local. Casa com "Noite de Fondue" e "Edição Pinhão" | Alta |
| **Réveillon / fim de ano (sazonal out–dez)** | Transacional | chef para réveillon Campos do Jordão; ceia de ano novo / Natal em casa de campo; réveillon privativo chalé | SERP fraca (só pacotes de hotel). Landing sazonal ativada no 2º semestre, com 2–3 meses de antecedência | **Baixa** |
| **Mesa de inverno / pinhão (sazonal jun–ago)** | Transacional | jantar de inverno casa de campo; menu de inverno; pinhão jantar na serra; café colonial em casa | Casa com "Mesa de Inverno — Edição Pinhão" e "Café Colonial Autoral". Termos regionais, baixa concorrência | **Baixa** |
| **Família em temporada / casa de campo** | Transacional | chef para casa de campo; almoço de domingo em família; brunch em casa de campo; feriado em família com chef | Eixo do anfitrião (personas 1 e 2). Casa com "Brunch na Montanha", "Pasta à Mesa". Reforçar em #conceito e #como-funciona | **Baixa** |
| **Canal de hospedagem (pousada/Airbnb)** | Transacional | chef para hóspedes de pousada; chef para Airbnb Campos do Jordão; chef para chalé alugado | Persona 4. SERP praticamente vazia. Captar o hóspede E criar argumento B2B para pousadas indicarem | **Baixa** |
| **Corporativo / confraternização de empresa** | Transacional | chef para confraternização de empresa; festa de fim de ano da empresa na serra; evento corporativo casa de campo | Oferta arquivada no catálogo principal. Avaliar futuramente uma página B2B discreta e separada, sem misturar esse posicionamento à vitrine do Paladares | Média |
| **Decisão (preço / como funciona)** | Informacional | quanto custa chef particular; como funciona personal chef; o que está incluso; personal chef × restaurante | Responder no FAQ/`FAQPage` sem expor tabela ("como funciona", "o que inclui/exclui", "por que sem tabela"). Conduz ao WhatsApp | Média |

**Prioridade entre clusters:** (1) cabeça + cidades; (2) sazonais de SERP fraca — réveillon/fim de ano, inverno/pinhão, Dia dos Namorados; (3) bodas e canal de hospedagem (quase sem concorrente); (4) FAQ de decisão.

**Concorrentes observados na SERP (jun/2026):** Take a Chef e Cronoshare (marketplaces, geolocalizados para SJC/Campos), GetNinjas; "Chef Em Casa" (concorrente local direto, TripAdvisor); restaurantes que capturam a intenção de "jantar/celebração" (Chef Romario, Confraria do Sabor, L'Osteria Villa Casato, Pontremoli, Due Mulini, Matterhorn); Donna Pinha (Santo Antônio do Pinhal, foco truta/pinhão) e Entre Vilas (São Bento do Sapucaí).

---

## 5. Plano por frentes

### Frente A — Técnico (renderização e indexação)

| # | O quê | Por quê | Impacto | Esforço |
|---|---|---|---|---|
| A1 | **HTML principal completo sem depender de JavaScript** — entregue | Conteúdo da home e das landings já é extraível no HTML inicial | Alto | Concluído |
| A2 | **Pré-renderizar a home e gerar landings estáticas** — entregue | HTML pronto para crawlers e visitantes | Alto | Concluído |
| A3 | **Sincronizar `FAQPage` JSON-LD com a UI** — entregue | Evita divergência página×schema | Médio | Concluído |
| A4 | **Declarar somente localidades reais em `areaServed`** — entregue | Mantém relevância local sem inventar sede, raio ou coordenadas | Médio | Concluído |
| A5 | **`@type Person` (Rafael Jacob) + `Service`/`OfferCatalog`** — entregue | Consolida a entidade do chef e o catálogo público | Médio | Concluído |
| A6 | **Manter `sitemap.xml` sincronizado com as páginas públicas** — entregue | As 14 landings e a home estão descobertas | Baixo | Concluído |
| A7 | **`robots.txt` para bots de IA + `llms.txt`** — entregue | Facilita descoberta e extração do conteúdo público | Baixo | Concluído |

### Frente B — Conteúdo / Páginas

| # | O quê | Por quê | Impacto | Esforço |
|---|---|---|---|---|
| B1 | **Páginas/âncoras por cidade** | Reforça "[serviço] + [cidade]"; captura long-tail local | Médio | Médio |
| B2 | **Landings sazonais** (réveillon/fim de ano; inverno/pinhão; Dia dos Namorados) | SERP fraca e demanda concentrada/antecipada | Médio | Médio |
| B3 | **Páginas por ocasião de alto ticket e baixa concorrência** (bodas, pedido, canal de hospedagem) | Quase sem concorrente direto; encaixe perfeito de posicionamento | Médio | Médio |
| B4 | **FAQ de decisão expandido** (quanto custa, como funciona, o que inclui/exclui, por que sem tabela) | Captura fundo de funil sem expor preço | Médio | Baixo |
| B5 | **Blocos pergunta-resposta + tabelas/listas** nas páginas | "Chunks" autocontidos são altíssimo sinal para IAs | Médio | Baixo |

### Frente C — SEO Local + Google Perfil da Empresa (GBP)

| # | O quê | Por quê | Impacto | Esforço |
|---|---|---|---|---|
| C1 | **Completar o GBP verificado como negócio de área de serviço** (sem endereço público; somente cidades reais, inseridas individualmente e validadas pela operação) | Ativo nº 1 do local; melhora presença no Maps, pacote local e painel | **Alto** | Médio |
| C2 | **Categoria principal "Chef pessoal/Personal chef"** | Maior fator isolado de ranqueamento local; evita a prateleira commodity | Alto | Baixo |
| C3 | **Preencher GBP completo** (descrição premium, horários, fotos reais, link) | Perfil completo gera muito mais visitas e alimenta recomendação por IA | Médio | Médio |
| C4 | **Embed de Google Maps na landing** centrado na região | Reforça sinal geográfico e consistência GBP↔site | Baixo | Baixo |
| C5 | **Bing Places + Apple Business Connect** (por último) | Cobertura iOS/Siri (público premium) e Copilot | Baixo | Baixo |

### Frente D — Autoridade / Backlinks / Citações / Avaliações

| # | O quê | Por quê | Impacto | Esforço |
|---|---|---|---|---|
| D1 | **Máquina de avaliações** (link curto + QR + rotina pós-evento no WhatsApp) | Review é o sinal de maior peso local; concorrente tem 58 a 5,0 | **Alto** | Médio |
| D2 | **Publicar relatos reais no site, com autorização e sem `aggregateRating` próprio** | Prova social verdadeira ajuda a decisão sem criar marcação enganosa | Médio | Médio |
| D3 | **Nome/telefone canônicos + citações em guias e parceiros locais legítimos** | Consistência reforça confiança e pode gerar referência qualificada | Médio | Médio |
| D4 | **Parcerias com pousadas/Airbnb premium (persona 4)** | Backlinks/citações locais de alta qualidade + canal de indicação | Médio | Médio |
| D5 | **Cadastrar entidade no Wikidata** | IAs cruzam fontes independentes antes de citar | Baixo | Médio |
| D6 | **Marketplaces (GetNinjas/Cronoshare) — avaliar trade-off** | Geram lead mas atraem caça-preço; risco de posicionamento | Baixo | Baixo |

### Frente E — GEO/AEO (busca por IA)

| # | O quê | Por quê | Impacto | Esforço |
|---|---|---|---|---|
| E1 | **Conteúdo extraível** (= A1 + A2) | Precondição: sem HTML cru, nada a citar | Alto | (em A) |
| E2 | **JSON-LD de catálogo a partir do `experiencias.json`** | Dados comparáveis (tabelas/listas) são altíssimo sinal para IAs | Médio | Médio |
| E3 | **Entidade Rafael Jacob** (= A5 + C1 + D5) | IAs só recomendam entidade reconhecível | Alto | (distribuído) |
| E4 | **`llms.txt` como mapa** (= A7) | Roadmap do que citar dentro dos limites do robots | Baixo | Baixo |
| E5 | **Monitorar linguagem das reviews do concorrente** | Alimenta copy citável com os termos que os clientes realmente usam | Baixo | Baixo |

### Frente F — Conversão / Medição

| # | O quê | Por quê | Impacto | Esforço |
|---|---|---|---|---|
| F1 | **Eventos GA4 nos CTAs de WhatsApp** (`solicitar_orcamento` com origem/página/experiência/ocasião/cidade/pessoas/formato) | Sem medir cliques no `wa.me`, não há funil | Alto | Baixo |
| F2 | **Search Console verificado + sitemap submetido** | Única fonte real de termos/impressões/cliques orgânicos | Alto | Baixo |
| F3 | **Prova social + microcopy de urgência sazonal** | Aumenta conversão sem ferir o premium | Médio | Baixo |
| F4 | **Marcar conversão de WhatsApp como evento-chave no GA4** | Otimizar conteúdo pelo que gera lead, não pelo que gera tráfego | Médio | Baixo |

---

## 6. Roadmap priorizado e sequenciado

### Onda 1 — Quick wins (0–30 dias) · maior resultado, menor esforço

| Ação | Dono | Dependência |
|---|---|---|
| C1 Completar o GBP verificado como área de serviço, com endereço oculto e somente cidades reais | **Rafael** | Perfil já verificado |
| C2 Manter categoria principal "Personal chef service", sem adicional por enquanto | **Rafael** | C1 |
| A1 HTML principal completo e extraível | **Desenvolvedor** | **Concluído** |
| A3 `FAQPage` sincronizado | **Desenvolvedor** | **Concluído** |
| A4 `areaServed` limitado a localidades reais, sem `GeoCircle` | **Desenvolvedor** | **Concluído** |
| A7 `robots.txt` (bots de IA) + `llms.txt` | **Desenvolvedor** | **Concluído** |
| F1 Eventos GA4 nos CTAs de WhatsApp | **Desenvolvedor** | **Concluído** |
| F2 Search Console vinculado + sitemap submetido | **Rafael** + dev | **Concluído** |
| D1 Montar rotina de avaliações (mensagem-padrão + link curto + QR) | **Rafael** | C1 verificado |

### Onda 2 — Estrutural (30–90 dias)

| Ação | Dono | Dependência |
|---|---|---|
| A2 Pré-renderização (SSG) | **Desenvolvedor** | **Concluído** |
| A5 `@type Person` + `Service`/`OfferCatalog` | **Desenvolvedor** | **Concluído** |
| E2 JSON-LD de catálogo a partir do `experiencias.json` | **Desenvolvedor** | **Concluído** |
| B1 Páginas por cidade | **Desenvolvedor** + Rafael (texto) | **Concluído** |
| B4 FAQ de decisão expandido | **Rafael** (texto) + dev | A3 |
| C3 GBP completo (fotos, descrição, horários) | **Rafael** | C1 |
| C4 Avaliar embed de Maps sem expor endereço residencial | **Desenvolvedor** | C1 completo |
| D2 Relatos reais no site, com autorização e sem `aggregateRating` próprio | **Desenvolvedor** | D1 |
| D3 NAP canônico + citações em guias/parceiros locais legítimos | **Rafael** | C1 |
| A6 Manter `sitemap.xml` sincronizado | **Desenvolvedor** | **Concluído** |

### Onda 3 — Autoridade & escala (90+ dias)

| Ação | Dono | Dependência |
|---|---|---|
| B2 Landings sazonais (réveillon no 2º semestre; inverno/pinhão; namorados) | **Desenvolvedor** + Rafael | A2 |
| B3 Páginas de bodas/pedido + página B2B de hospedagem | **Desenvolvedor** + Rafael | A2 |
| B5 Blocos pergunta-resposta + tabelas em todas as páginas | **Desenvolvedor** | A2 |
| D4 Parcerias com pousadas/Airbnb premium | **Rafael** | B3 |
| D5 Entidade no Wikidata | **Rafael**/dev | C1 + sameAs estável |
| C5 Bing Places + Apple Business Connect | **Rafael** | C1 estável |
| E5 Monitorar linguagem das reviews do concorrente | **Rafael** | — |
| D6 (Opcional) Marketplaces com copy premium | **Rafael** | decisão de posicionamento |

---

## 6.1 Status de execução — itens de desenvolvedor (jun/2026)

> Snapshot do que já está **implementado, buildado e verificado** no código (não confundir com os itens do Rafael, que dependem de ação manual no Google/Instagram).

**Onda 1 — FEITO:**
- **A1** `#seo-fallback` enriquecido — agora **superado pelo A2** (a página inteira é pré-renderizada).
- **A3** `FAQPage` JSON-LD sincronizado com a UI (6 perguntas, fonte `src/data/faq.json`).
- **A4** `areaServed` com localidades reais; `GeoCircle` e coordenadas de base foram removidos em 2026-07-19 para não publicar uma sede presumida em um negócio de atendimento externo.
- **A5** `@type WebSite`, `LocalBusiness` e `Person` com IDs separados + **`Service`/`OfferCatalog`** com as 14 experiências públicas.
- **A7** `robots.txt` libera bots de IA + `llms.txt` publicado.
- **F1** evento `solicitar_orcamento` (GA4) nos 3 CTAs com `experiencia/ocasiao/cidade/pessoas`.

**Onda 2 (parcial) — FEITO nesta rodada:**
- **A2** **Pré-renderização (SSG)** real: `vite build --ssr src/entry-server.tsx` + `scripts/prerender.mjs` injetam a página inteira em `<div id="root" data-prerendered="true">`; `src/main.tsx` hidrata por cima (`hydrateRoot`/`createRoot`). Imagem do chef movida para `public/` (sem hash). Hidratação verificada sem mismatch (console limpo), build idempotente.
- **E2** Catálogo como dado estruturado — em 2026-07-19 o `OfferCatalog` passou a descrever somente nome, porta e promessa visíveis nos cards. Cardápios completos deixam de ser marcados enquanto viverem apenas em modal; voltarão ao schema quando tiverem HTML/página pública própria.
- Limpeza de posicionamento: removido o termo commodity **"buffet"** das fichas (regra do `LEIA-ME.md`).

**Deploy:** `npm run build` (cliente → SSR → prerender) e `scripts/zip-dist.ps1` → `paladares-da-mantiqueira-site.zip` (barras normais, p/ Netlify).

**Nota de sincronização:** B1 (páginas por cidade), B2 (landings sazonais), B3 (bodas/pedido + B2B pousadas) e A6 (sitemap multi-URL) estão implementados — `scripts/gen-landings.mjs` gera 14 landings + home, totalizando 15 URLs no sitemap. Em 2026-07-19, cada landing passou a mostrar apenas 5 links relacionados + o retorno ao catálogo, em vez da malha todos-para-todos.

**Pendente (dev):** B4 FAQ de decisão expandido · avaliar C4 sem expor endereço residencial · D2 publicar relatos reais com autorização, sem `aggregateRating` próprio (**bloqueado** até haver avaliações reais — não inventar).

**Decidido em 2026-07-19:** Mesa Corporativa foi retirada do catálogo público e arquivada para possível página B2B separada. O termo **"coffee break"** não aparece mais nas fontes públicas, no HTML ou no JSON-LD do Paladares.

---

## 7. Métricas e ferramentas

**Instalar/configurar:**
- **Google Search Console** — verificar a propriedade e submeter o `sitemap.xml`. Fonte real de consultas, impressões, CTR e posição média.
- **Google Perfil da Empresa (insights)** — visualizações no Maps/Busca, cliques no site/ligar/rota, termos que levaram ao perfil.
- **GA4** (já instalado, ID G-42VSMJHHFD) — evento-chave `solicitar_orcamento`, com parâmetros `origem`/`pagina`/`experiencia`/`ocasiao`/`cidade`/`pessoas`/`so_servico`.
- **Validadores** — Rich Results Test / Schema Markup Validator após cada mudança de JSON-LD.
- **Validar volumes depois** — Keyword Planner / Ubersuggest, só para confirmar prioridades.

**Números a acompanhar (cadência mensal):**
- Avaliações no GBP: quantidade e nota média — **meta: 10–15 em 90 dias**; benchmark a superar: 58 a 5,0 do concorrente.
- Search Console: consultas para "chef particular/personal chef + cidade"; posição média dos clusters da seção 4.
- GBP: visualizações e ações (cliques para site/ligar/rota) por mês.
- GA4: pedidos de orçamento (`solicitar_orcamento`) totais e por landing/experiência.
- Cobertura de indexação: nº de URLs indexadas (cresce com B1/B2/B3) e ausência de erros.
- Citações de IA (qualitativo, trimestral): perguntar a ChatGPT/Perplexity/Google AI por "chef particular em Campos do Jordão" e registrar se o negócio é citado.

---

## 8. Riscos e o que NÃO fazer

- **Não ferir o posicionamento anti-commodity ao otimizar.** Termos commodity ("chef em casa", "a domicílio", "buffet em casa", "porção", "quilo", "coffee break de rotina") entram **apenas como pontes** em meta description, FAQ e `llms.txt` — nunca como H1, nome de experiência, copy de vitrine ou categoria principal do GBP. A palavra "prato" pode aparecer naturalmente em contexto culinário.
- **Categoria do GBP errada é armadilha.** "Serviço de buffet" como principal puxa o negócio para a comparação por quilo/cabeça. Usar "Chef pessoal/Personal chef".
- **Não inventar avaliações nem `aggregateRating`.** Os três depoimentos fictícios foram confirmados e removidos em 2026-07-19. Prova social só volta com relatos reais e verificáveis, sem marcação enganosa.
- **Não inventar volume de busca.** Toda priorização aqui é qualitativa; validar com Search Console/Keyword Planner antes de decisões caras.
- **Não misturar endereço de rua com área de serviço.** Manter o modo SAB no GBP e no schema (sem `streetAddress`).
- **Manter consistência absoluta de nome e telefone** entre site, GBP, guias e marketplaces. Como o atendimento é externo, o endereço residencial permanece oculto no perfil e não é publicado no schema.
- **Não brigar pelo head de "fondue em casa"** (informacional/receitas, baixo ROI). Só cauda transacional + local.
- **Marketplaces (GetNinjas/Cronoshare) com cautela** — geram lead mas atraem caça-preço; se usados, copy premium. Tratar como teste, não como pilar.
- **`llms.txt` é mapa, não cadeado** — não substitui proteção contra bots abusivos (WAF); a conformidade dos bots é voluntária.
- **SSG não pode quebrar a hidratação React** — pré-renderizar a partir da mesma fonte (`experiencias.json` via `gen-experiencias.mjs`).

---

## 9. Arquivos relevantes para a execução

- `paladares-da-mantiqueira/index.html` — meta tags e JSON-LD-base → A3, A4, A5
- `paladares-da-mantiqueira/scripts/gen-experiencias.mjs` — mantém fontes geradas do catálogo sincronizadas → A1, A5, E2
- `paladares-da-mantiqueira/scripts/gen-landings.mjs` — gera as 14 landings e o sitemap → A2, A6, B1, B2, B3
- `paladares-da-mantiqueira/scripts/prerender.mjs` — pré-renderiza a home e fecha o HTML estático → A1, A2
- `paladares-da-mantiqueira/src/data/experiencias.json` — acervo factual das 14 experiências públicas → A1, E2
- `paladares-da-mantiqueira/package.json` — build completo: geração, TypeScript, cliente, SSR e pré-renderização → A2
- `paladares-da-mantiqueira/src/lib/whatsapp.ts` — links contextuais e instrumentação GA4 → F1
- `paladares-da-mantiqueira/public/robots.txt` e `public/sitemap.xml` → A6, A7
- `paladares-da-mantiqueira/src/App.tsx` — conteúdo da home, FAQ e convite neutro para avaliações reais → A3, D1

---

*Nota de método: auditoria multi-agente (jun/2026), ~12 buscas reais em PT-BR para a frente de palavras-chave/SERP e pesquisa web para SEO local e GEO/AEO. As frentes de SEO técnico, conteúdo e conversão foram cobertas pela síntese lendo os arquivos reais do projeto. Documentos relacionados: 00-Visão e Posicionamento · 01-Público e Personas · 10-Conversão e Reservas.*
