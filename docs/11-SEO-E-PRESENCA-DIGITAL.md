# 11 · SEO e Presença Digital — Google e Busca por IA

**Paladares da Mantiqueira — Chef Rafael Jacob**
Plano de visibilidade orgânica (Google) e em busca por IA (GEO/AEO) | Versão 1.0 | Junho/2026

> Consolidação de uma auditoria multi-agente em 6 frentes — SEO técnico, conteúdo on-page, conversão/UX/medição, SEO local, palavras-chave/concorrência e GEO/AEO. Itens priorizados por impacto × esforço. Toda priorização de palavra-chave é **qualitativa** (observando quem ranqueia e a intenção da SERP); **não há volume de busca inventado** — validar depois no Search Console/Keyword Planner.

---

## 1. Sumário executivo

O site tem uma base técnica de SEO acima da média para uma landing (meta tags, canonical, Open Graph, JSON-LD `LocalBusiness` + `FAQPage`, fallback estático em `index.html`, `robots.txt`/`sitemap.xml`), mas a visibilidade real está travada por dois gargalos que se reforçam.

**Primeiro gargalo (técnico): o site é uma SPA Vite+React que só "existe" depois do JavaScript** — todo o conteúdo que venderia o negócio (as 13 experiências, cardápios item a item, ocasiões, depoimentos, FAQ completo) vive em `src/data/experiencias.json` e no React, invisível para os crawlers de IA e fraco para o Google, que só lê os 5 parágrafos genéricos do bloco `#seo-fallback`.

**Segundo gargalo (local): não existe Google Perfil da Empresa (GBP)** — o ativo nº 1 do SEO local — enquanto o concorrente direto "Chef Em Casa" já captura demanda no TripAdvisor de Campos do Jordão (58 avaliações, nota 5,0, selo Travellers' Choice).

**A maior alavanca isolada é a dupla:** (a) criar e verificar o GBP como negócio de área de serviço + iniciar uma máquina de avaliações, e (b) tornar o conteúdo do site extraível sem JavaScript. Há uma **janela aberta** porque nenhum chef autônomo local está otimizado — a SERP é dominada por restaurantes e marketplaces (Take a Chef, Cronoshare, GetNinjas), não por concorrentes diretos bem-feitos.

---

## 2. Diagnóstico em uma olhada

| Frente | Achado mais importante | Severidade |
|---|---|---|
| **SEO Técnico (SPA/render)** | Build 100% client-side (`vite build` puro); conteúdo real só no JS. Fora o Googlebot, nenhum crawler de IA enxerga o cardápio. O `#seo-fallback` é raso (5 parágrafos genéricos). | **Alta** |
| **Conteúdo / Páginas** | Página única bloqueia profundidade temática; `sitemap.xml` só tem a home. FAQ da UI (5 perguntas) diverge do JSON-LD (3 perguntas). | **Alta** |
| **SEO Local + GBP** | Não existe Google Perfil da Empresa de área de serviço — sem Maps, sem pacote local, sem painel. Concorrente já captura demanda local. | **Alta** |
| **Autoridade / Backlinks / Citações** | Zero avaliações (concorrente tem 58 a 5,0); NAP só no schema; sem citações em diretórios; entidade "Rafael Jacob" fraca (sem `@type Person` autônomo). | **Alta** |
| **GEO/AEO (busca por IA)** | Dados ricos do `experiencias.json` desperdiçados; sem `Person`/`sameAs`/Wikidata; sem `llms.txt`; `robots.txt` não nomeia bots de IA. | **Alta** |
| **Conversão / Medição** | Sem prova social estruturada (`Review`/`aggregateRating`); GA4 instalado mas sem eventos de clique no WhatsApp; sem medição de funil por experiência. | **Média** |

---

## 3. A questão central da SPA (em linguagem simples)

**O problema.** O site é construído com React e Vite. Quando alguém (ou um robô) abre o endereço, o servidor entrega um `index.html` quase vazio: só uma `<div id="root">` e um `<script>` que baixa o JavaScript. É o JavaScript que, rodando no navegador, "desenha" a página — as experiências, os cardápios, os depoimentos, o FAQ. Tudo isso vem de `src/data/experiencias.json` e só vira texto visível **depois** que o código roda.

**Por que isso prejudica o Google.** O Googlebot até consegue executar JavaScript, mas faz isso numa segunda passada, mais lenta e menos confiável; e o sinal que ele extrai do conteúdo "tardio" é mais fraco do que o de HTML entregue pronto. Como paliativo, o site tem o bloco `#seo-fallback` (`index.html`, linhas 138–170) — HTML estático para o buscador ler antes do React. O problema é que esse fallback hoje tem **só 5 parágrafos genéricos**: não traz nenhuma das 13 experiências, nenhum cardápio, nenhuma ocasião, nenhum depoimento.

**Por que isso é fatal para as IAs.** Os crawlers de busca por IA (GPTBot/OAI-SearchBot do ChatGPT, ClaudeBot, PerplexityBot, o do Google AI Overviews) — ao contrário do Googlebot — **não executam JavaScript**. Eles leem apenas o HTML cru. Hoje, quando alguém pergunta a uma IA "qual chef particular contrato em Campos do Jordão?", a IA só vê aqueles 5 parágrafos genéricos. Sem conteúdo extraível, **não há o que ser citado**, e todas as outras ações de GEO ficam sem base.

**A recomendação — duas camadas, em ordem de prioridade:**

1. **Imediato e barato — enriquecer o `#seo-fallback`** (esforço baixo, dono: desenvolvedor). Reaproveitar o `experiencias.json` para escrever, em HTML estático real, as 13 experiências (nome + promessa + ocasiões + faixa de convidados + sazonalidade), o FAQ completo e os depoimentos. O fallback deve ser o conteúdo verdadeiro, não um resumo. Já destrava o Google e as IAs sem mudar a arquitetura.
2. **Estrutural e definitivo — pré-renderizar no build (SSG)** (esforço alto, dono: desenvolvedor). Adicionar um passo de pré-renderização (`vite-react-ssg`/`vite-plugin-ssg`, ou um `postbuild` que injeta o HTML renderizado no `dist/index.html`). O `prebuild` já roda `node scripts/gen-experiencias.mjs`; esse mesmo script pode **emitir também o HTML estático e o JSON-LD de catálogo** a partir da mesma fonte — assim página e fallback nunca divergem.

**Impacto.** É a precondição de tudo. Sem conteúdo extraível, o site nunca será citado por IAs e desperdiça o sinal mais forte de relevância junto ao Google.

---

## 4. Mapa de palavras-chave (clusters)

**Conflito posicionamento × busca:** o público digita muito termos commodity ("chef em casa", "a domicílio", "buffet em casa") que a marca recusa na vitrine. Estratégia: **capturar a busca** por esses termos como *pontes* (meta description, FAQ, `#seo-fallback`, ex.: "também procurado como chef em casa / chef a domicílio") e **converter** sempre na linguagem premium de "experiência/celebração à mesa". Nunca usá-los como proposta principal, H1, nome de experiência ou categoria de GBP.

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
| **Corporativo / confraternização de empresa** | Transacional | chef para confraternização de empresa; festa de fim de ano da empresa na serra; evento corporativo casa de campo | Casa com "Mesa Corporativa". Nicho secundário; enfatizar confraternização (não "coffee break de rotina"). NF como diferencial | Média |
| **Decisão (preço / como funciona)** | Informacional | quanto custa chef particular; como funciona personal chef; o que está incluso; personal chef × restaurante | Responder no FAQ/`FAQPage` sem expor tabela ("como funciona", "o que inclui/exclui", "por que sem tabela"). Conduz ao WhatsApp | Média |

**Prioridade entre clusters:** (1) cabeça + cidades; (2) sazonais de SERP fraca — réveillon/fim de ano, inverno/pinhão, Dia dos Namorados; (3) bodas e canal de hospedagem (quase sem concorrente); (4) FAQ de decisão.

**Concorrentes observados na SERP (jun/2026):** Take a Chef e Cronoshare (marketplaces, geolocalizados para SJC/Campos), GetNinjas; "Chef Em Casa" (concorrente local direto, TripAdvisor); restaurantes que capturam a intenção de "jantar/celebração" (Chef Romario, Confraria do Sabor, L'Osteria Villa Casato, Pontremoli, Due Mulini, Matterhorn); Donna Pinha (Santo Antônio do Pinhal, foco truta/pinhão) e Entre Vilas (São Bento do Sapucaí).

---

## 5. Plano por frentes

### Frente A — Técnico (renderização e indexação)

| # | O quê | Por quê | Impacto | Esforço |
|---|---|---|---|---|
| A1 | **Enriquecer o `#seo-fallback`** com as 13 experiências, FAQ completo e depoimentos | Conteúdo invisível para IAs e raso para o Google é a trava nº 1 | Alto | Baixo |
| A2 | **Pré-renderizar a home (SSG)** | Solução definitiva: HTML pronto para todo crawler, sem depender de JS | Alto | Alto |
| A3 | **Sincronizar `FAQPage` JSON-LD com a UI** (5 perguntas, não 3) | Divergência página×schema enfraquece a confiança | Médio | Baixo |
| A4 | **`GeoCircle` no `areaServed`** (geoMidpoint + geoRadius ~100 km) | Ranqueia para "perto de mim" no raio declarado | Médio | Baixo |
| A5 | **`@type Person` (Rafael Jacob) + `Service`/`OfferCatalog`** | Construir a entidade do chef e expor o catálogo como dado estruturado | Médio | Médio |
| A6 | **Atualizar `sitemap.xml`** ao criar novas páginas | Hoje só tem a home; novas landings precisam ser descobertas | Baixo | Baixo |
| A7 | **`robots.txt`: nomear bots de IA + criar `llms.txt`** | Liberação explícita e roadmap aumentam citação | Baixo | Baixo |

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
| C1 | **Criar GBP como negócio de área de serviço** (sem endereço público; até 20 cidades; NAP idêntico ao site) | Ativo nº 1 do local; destrava Maps, pacote local e painel | **Alto** | Médio |
| C2 | **Categoria principal "Chef pessoal/Personal chef"** | Maior fator isolado de ranqueamento local; evita a prateleira commodity | Alto | Baixo |
| C3 | **Preencher GBP completo** (descrição premium, horários, fotos reais, link) | Perfil completo gera muito mais visitas e alimenta recomendação por IA | Médio | Médio |
| C4 | **Embed de Google Maps na landing** centrado na região | Reforça sinal geográfico e consistência GBP↔site | Baixo | Baixo |
| C5 | **Bing Places + Apple Business Connect** (por último) | Cobertura iOS/Siri (público premium) e Copilot | Baixo | Baixo |

### Frente D — Autoridade / Backlinks / Citações / Avaliações

| # | O quê | Por quê | Impacto | Esforço |
|---|---|---|---|---|
| D1 | **Máquina de avaliações** (link curto + QR + rotina pós-evento no WhatsApp) | Review é o sinal de maior peso local; concorrente tem 58 a 5,0 | **Alto** | Médio |
| D2 | **Espelhar melhores avaliações no site com `Review`/`aggregateRating`** (só reais) | Prova social estruturada que IAs e ranking local valorizam | Médio | Médio |
| D3 | **NAP canônico + citações** (TripAdvisor, guias de turismo da serra) | Citações idênticas reforçam confiança; tráfego de referência qualificado | Médio | Médio |
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
| F1 | **Eventos GA4 nos CTAs de WhatsApp** (`gerar_lead_whatsapp` com experiência/ocasião/cidade) | Sem medir cliques no `wa.me`, não há funil | Alto | Baixo |
| F2 | **Search Console verificado + sitemap submetido** | Única fonte real de termos/impressões/cliques orgânicos | Alto | Baixo |
| F3 | **Prova social + microcopy de urgência sazonal** | Aumenta conversão sem ferir o premium | Médio | Baixo |
| F4 | **Marcar conversão de WhatsApp como evento-chave no GA4** | Otimizar conteúdo pelo que gera lead, não pelo que gera tráfego | Médio | Baixo |

---

## 6. Roadmap priorizado e sequenciado

### Onda 1 — Quick wins (0–30 dias) · maior resultado, menor esforço

| Ação | Dono | Dependência |
|---|---|---|
| C1 Criar e verificar o GBP de área de serviço | **Rafael** | — (verificação pode levar dias) |
| C2 Definir categoria "Chef pessoal/Personal chef" | **Rafael** | C1 |
| A1 Enriquecer `#seo-fallback` (13 experiências + FAQ + depoimentos) | **Desenvolvedor** | — |
| A3 Sincronizar `FAQPage` (5 perguntas) | **Desenvolvedor** | — |
| A4 `GeoCircle` no `areaServed` | **Desenvolvedor** | — |
| A7 `robots.txt` (bots de IA) + `llms.txt` | **Desenvolvedor** | — |
| F1 Eventos GA4 nos CTAs de WhatsApp | **Desenvolvedor** | — |
| F2 Verificar Search Console + submeter sitemap | **Rafael** + dev | — |
| D1 Montar rotina de avaliações (mensagem-padrão + link curto + QR) | **Rafael** | C1 verificado |

### Onda 2 — Estrutural (30–90 dias)

| Ação | Dono | Dependência |
|---|---|---|
| A2 Pré-renderização (SSG) | **Desenvolvedor** | A1 |
| A5 `@type Person` + `Service`/`OfferCatalog` | **Desenvolvedor** | — |
| E2 JSON-LD de catálogo a partir do `experiencias.json` | **Desenvolvedor** | A2 |
| B1 Páginas/âncoras por cidade | **Desenvolvedor** + Rafael (texto) | A2 |
| B4 FAQ de decisão expandido | **Rafael** (texto) + dev | A3 |
| C3 GBP completo (fotos, descrição, horários) | **Rafael** | C1 |
| C4 Embed de Maps na landing | **Desenvolvedor** | A4 |
| D2 Avaliações reais no site com `Review`/`aggregateRating` | **Desenvolvedor** | D1 |
| D3 NAP canônico + ficha TripAdvisor + guias locais | **Rafael** | C1 |
| A6 Atualizar `sitemap.xml` | **Desenvolvedor** | B1/B2/B3 |

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
- **A4** `GeoCircle` no `areaServed` (raio ~100 km) + 5 localidades.
- **A5** `@type Person` (Rafael Jacob) + **`Service`/`OfferCatalog`** com as 15 experiências.
- **A7** `robots.txt` libera bots de IA + `llms.txt` publicado.
- **F1** evento `solicitar_orcamento` (GA4) nos 3 CTAs com `experiencia/ocasiao/cidade/pessoas`.

**Onda 2 (parcial) — FEITO nesta rodada:**
- **A2** **Pré-renderização (SSG)** real: `vite build --ssr src/entry-server.tsx` + `scripts/prerender.mjs` injetam a página inteira em `<div id="root" data-prerendered="true">`; `src/main.tsx` hidrata por cima (`hydrateRoot`/`createRoot`). Imagem do chef movida para `public/` (sem hash). Hidratação verificada sem mismatch (console limpo), build idempotente.
- **E2** Catálogo como dado estruturado — o `OfferCatalog` carrega o **cardápio completo (159 itens, seção + prato + descrição)** na `description` de cada `itemOffered`, garantindo extração por IA sem JavaScript (os pratos vivem nos modais do app, invisíveis a crawlers).
- Limpeza de posicionamento: removido o termo commodity **"buffet"** das fichas (regra do `LEIA-ME.md`).

**Deploy:** `npm run build` (cliente → SSR → prerender) e `scripts/zip-dist.ps1` → `paladares-da-mantiqueira-site.zip` (barras normais, p/ Netlify).

**Pendente (dev):** A6 sitemap multi-URL (depende de B1/B2/B3) · B1 páginas por cidade · B2 landings sazonais · B4 FAQ de decisão · C4 embed de Maps · D2 `Review`/`aggregateRating` (**bloqueado** até haver avaliações reais — não inventar).

**A decidir (Rafael):** o termo **"coffee break"** na ficha *Mesa Corporativa* — é um serviço real e buscável (mantido), mas a auditoria sugeriu suavizá-lo na promessa de vitrine. Confirmar se mantém ou ajusta.

---

## 7. Métricas e ferramentas

**Instalar/configurar:**
- **Google Search Console** — verificar a propriedade e submeter o `sitemap.xml`. Fonte real de consultas, impressões, CTR e posição média.
- **Google Perfil da Empresa (insights)** — visualizações no Maps/Busca, cliques no site/ligar/rota, termos que levaram ao perfil.
- **GA4** (já instalado, ID G-42VSMJHHFD) — criar e marcar como conversão o evento `gerar_lead_whatsapp`, com parâmetros `experiencia`/`ocasiao`/`cidade`.
- **Validadores** — Rich Results Test / Schema Markup Validator após cada mudança de JSON-LD.
- **Validar volumes depois** — Keyword Planner / Ubersuggest, só para confirmar prioridades.

**Números a acompanhar (cadência mensal):**
- Avaliações no GBP: quantidade e nota média — **meta: 10–15 em 90 dias**; benchmark a superar: 58 a 5,0 do concorrente.
- Search Console: consultas para "chef particular/personal chef + cidade"; posição média dos clusters da seção 4.
- GBP: visualizações e ações (cliques para site/ligar/rota) por mês.
- GA4: cliques no WhatsApp (`gerar_lead_whatsapp`) totais e por landing/experiência.
- Cobertura de indexação: nº de URLs indexadas (cresce com B1/B2/B3) e ausência de erros.
- Citações de IA (qualitativo, trimestral): perguntar a ChatGPT/Perplexity/Google AI por "chef particular em Campos do Jordão" e registrar se o negócio é citado.

---

## 8. Riscos e o que NÃO fazer

- **Não ferir o posicionamento anti-commodity ao otimizar.** Termos commodity ("chef em casa", "a domicílio", "buffet em casa", "porção", "prato", "quilo", "coffee break de rotina") entram **apenas como pontes** em meta description, FAQ, `#seo-fallback` e `llms.txt` — nunca como H1, nome de experiência, copy de vitrine ou categoria principal do GBP.
- **Categoria do GBP errada é armadilha.** "Serviço de buffet" como principal puxa o negócio para a comparação por quilo/cabeça. Usar "Chef pessoal/Personal chef".
- **Não inventar avaliações nem `aggregateRating`.** Marcar `Review`/`aggregateRating` no schema **só com avaliações reais e verificáveis** — schema falso é passível de penalização. Os 3 depoimentos atuais ("Luciana M./Marcelo S./Beatriz R.") parecem ilustrativos: não promovê-los a schema enquanto não forem reais.
- **Não inventar volume de busca.** Toda priorização aqui é qualitativa; validar com Search Console/Keyword Planner antes de decisões caras.
- **Não misturar endereço de rua com área de serviço.** Manter o modo SAB no GBP e no schema (sem `streetAddress`).
- **Manter consistência absoluta de NAP** entre site, GBP, TripAdvisor, guias e marketplaces.
- **Não brigar pelo head de "fondue em casa"** (informacional/receitas, baixo ROI). Só cauda transacional + local.
- **Marketplaces (GetNinjas/Cronoshare) com cautela** — geram lead mas atraem caça-preço; se usados, copy premium. Tratar como teste, não como pilar.
- **`llms.txt` é mapa, não cadeado** — não substitui proteção contra bots abusivos (WAF); a conformidade dos bots é voluntária.
- **SSG não pode quebrar a hidratação React** — pré-renderizar a partir da mesma fonte (`experiencias.json` via `gen-experiencias.mjs`).

---

## 9. Arquivos relevantes para a execução

- `paladares-da-mantiqueira/index.html` — meta tags, JSON-LD (LocalBusiness ~linhas 35–65; FAQPage ~68–99) e `#seo-fallback` (~138–170) → A1, A3, A4, A5
- `paladares-da-mantiqueira/scripts/gen-experiencias.mjs` — fonte única do catálogo; estender para emitir HTML estático + JSON-LD → A1, A2, E2
- `paladares-da-mantiqueira/src/data/experiencias.json` — acervo factual (13 experiências, cardápios, ocasiões) → A1, E2
- `paladares-da-mantiqueira/package.json` — `prebuild` já roda o gerador; `build` é `vite build` puro → A2
- `paladares-da-mantiqueira/src/lib/whatsapp.ts` — `linkWhatsApp`/`linkWhatsAppTexto`, ponto para instrumentar GA4 → F1
- `paladares-da-mantiqueira/public/robots.txt` e `public/sitemap.xml` → A6, A7
- `paladares-da-mantiqueira/src/App.tsx` — FAQ da UI (~446–466) a sincronizar com o schema; depoimentos (~417–431) → A3, D2

---

*Nota de método: auditoria multi-agente (jun/2026), ~12 buscas reais em PT-BR para a frente de palavras-chave/SERP e pesquisa web para SEO local e GEO/AEO. As frentes de SEO técnico, conteúdo e conversão foram cobertas pela síntese lendo os arquivos reais do projeto. Documentos relacionados: 00-Visão e Posicionamento · 01-Público e Personas · 10-Conversão e Reservas.*
