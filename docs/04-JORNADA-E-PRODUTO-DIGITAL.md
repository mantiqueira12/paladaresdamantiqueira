# Jornada do Cliente e MVP do Produto Digital

> **Documento 04 — Paladares da Mantiqueira**
> Foco: como o cliente entra, escolhe, fecha e volta — e o que o produto digital precisa entregar em cada fase.
> Este documento traduz o posicionamento e a arquitetura de oferta (docs 01–03) em **fluxo concreto** e **requisitos**. Não contém código — apenas requisitos funcionais e regras de experiência.

---

## 0. Decisão estrutural que governa todo este documento

O medo do Rafael — *"a oferta vai ficar confusa e sem nicho"* — se resolve com **uma única regra de arquitetura**, que a crítica adversarial deixou explícita:

> **UM eixo primário de organização: a OCASIÃO (momento + nº de pessoas). A técnica (fondue, parrilla, pizza) é conteúdo DENTRO da experiência, nunca um card próprio.**

Tudo o que segue obedece a isso. Onde os especialistas divergiram (3 linhas vs. 6–8 menus; organizar por tema vs. por momento), **este documento decide por: organizar por momento, com no máximo 3 experiências-âncora visíveis na home + 1 caminho "Sob Medida"**. Amplitude (mais menus, vinhos, brunch, Clube) vem depois que 3 cards estiverem vendendo.

**Vocabulário travado (usar sempre o mesmo, nunca misturar):**

| Use | Nunca use |
|---|---|
| experiência, mesa, noite, celebração | pacote, quilo, buffet, marmita, rodízio, orçamento de comida |
| "Escolher uma experiência" / "Montar a minha" | "opção 1/2/3", "serviço A/B" |
| faixa "a partir de" | "consultar valores" (cego, sem âncora) |

---

## 1. As duas portas da home (o coração da experiência)

A home substitui o quiz atual de 3 cards técnicos por **duas portas explícitas, lado a lado, com peso visual igual**, ancoradas no posicionamento de celebração. Mais uma saída de segurança para o indeciso.

### Porta A — "Escolher uma experiência" (default, ~70–75% do tráfego)
O chef já curou. O cliente só escolhe. Caminho de **baixa fricção**, decisão em poucos cliques.

- Vitrine de **3 experiências-âncora**, organizadas por **ocasião + nº de pessoas**.
- Cada experiência mostra: nome, foto, faixa de pessoas, faixa de preço **"a partir de R$X/pessoa"**, e "o que está incluso".
- A técnica (fondue, parrilla, pizza, massas) aparece **dentro** da experiência como opção/variação — não como card.

### Porta B — "Montar a minha" (~20–25%)
O cliente diz o que deseja. Formulário guiado curto → vira um **briefing**, não um pedido fechado. O chef responde com proposta sob medida.

- **Regra anti-commodity (a mais importante):** "Montar a minha" **NÃO** é "qualquer coisa que você imaginar". É *"o mesmo chef desenhando exclusivo para a sua data"*. O formulário **parte de uma das 3 experiências como esqueleto** e o cliente troca módulos dentro do repertório do chef.
- Posicionada como **elevação/upgrade premium**, nunca como caminho concorrente mais barato.

### Porta C — "Não sei, me ajuda" (micro-CTA, não é um terceiro botão grande)
Link discreto que cai no **WhatsApp humano**. Captura o indeciso sem poluir as duas portas. Tudo que for dúvida cai aqui — nunca vira um 4º card.

**As 3 experiências-âncora da Porta A** (nomes a validar — ver §9):

| # | Experiência-âncora | Ocasião | Pessoas | Técnicas que moram dentro |
|---|---|---|---|---|
| 1 | **Mesa dos Chegados** | Íntimo: jantar a dois, pedido, comemoração pequena | 2–6 | empratado, fondue, massas |
| 2 | **Mesa Cheia** | Festivo: família grande, feriado, confraternização | 8–20 | pizza, burger, paella, parrilla |
| 3 | **Mesa de Celebração** | Marco: aniversário, bodas, virada de ano, "vencemos o ano" | variável | degustação, harmonização, chef à mesa |

> **PREMISSA A VALIDAR COM O RAFAEL (P1):** Confirmar que "Mestre da Grelha"/parrilla **deixa de ser linha própria** e vira formato dentro de Mesa Cheia e Mesa de Celebração. Isso elimina a confusão de hoje (3 ocasiões + 1 técnica solta competindo no mesmo nível). É uma decisão de produto explícita, porque hoje é um dos 3 destaques do site.

---

## 2. Mapa da jornada (visão geral)

```
DESCOBERTA
   │  Instagram · indicação · Airbnb/pousada · busca local
   ▼
HOME — escolher caminho
   ├─► PORTA A "Escolher uma experiência"  ──┐
   ├─► PORTA B "Montar a minha" (briefing)  ──┤
   └─► PORTA C "Não sei" → WhatsApp humano  ──┤
                                              ▼
                              PROPOSTA / ORÇAMENTO
                       (faixa estimada na hora → proposta formal do chef)
                                              ▼
                              RESERVA COM SINAL  ← ponto que mais muda o negócio
                                  (40–50% via Pix trava a data)
                                              ▼
                              PRÉ-EVENTO
                  (restrições, nº final, estrutura da cozinha, endereço, lembrete D-2)
                                              ▼
                              EVENTO (execução)
                                              ▼
                              PÓS / RECOMPRA
              (depoimento D+1 · captura de datas comemorativas · reativação sazonal)
```

A jornada tem **uma bifurcação só** (escolher experiência OU montar a minha) e **converge cedo** num fluxo único de proposta → sinal → evento. Isso mantém a operação simples para um chef solo.

---

## 3. Fase a fase — fluxo, objetivo e requisitos

Cada fase abaixo traz: **objetivo**, **o que o cliente faz**, **onde o WhatsApp é a ponte** e **requisitos funcionais** (marcados `[MVP]` ou `[v2]`).

### Fase 1 — Descoberta
**Objetivo:** ser encontrado e enquadrado como "programa da viagem/celebração", não como "comida".

| O cliente faz | WhatsApp? |
|---|---|
| Chega via Instagram, indicação, anfitrião de Airbnb/pousada, ou busca "chef particular Campos do Jordão" | Não (ainda) |

**Requisitos funcionais:**
- `[MVP]` Home carrega rápido, mobile-first (público chega muito por celular, dentro da casa de temporada).
- `[MVP]` Headline e abertura comunicam o eixo emocional (manter "A experiência de um ótimo restaurante, na sala da sua casa." + "Você recebe os abraços, eu assumo o fogão.").
- `[MVP]` Prova social visível acima da dobra: depoimentos que citam o **momento** (aniversário, reencontro, ano-novo), não o prato.
- `[MVP]` Selo "Insumos da Mantiqueira" + crédito visível à confeitaria da esposa ("Doces da Casa").
- `[MVP]` Link para Instagram como portfólio vivo.
- `[MVP]` Texto otimizado para busca local (cidades: Campos do Jordão, Santo Antônio do Pinhal, São Bento do Sapucaí, Vale do Paraíba).
- `[v2]` Página/cupom rastreável para parcerias com Airbnb/pousadas.

### Fase 2 — Escolher experiência OU montar a minha
**Objetivo:** levar o cliente a **uma decisão por tela**, sem sentir que está diante de um cardápio infinito.

#### Trilha A — "Escolher uma experiência"

| O cliente faz | WhatsApp? |
|---|---|
| Navega 3 cards de ocasião → abre 1 experiência → vê inclusos, faixa de pessoas, faixa de preço → escolhe variação (ex.: massas vs. fondue dentro de "Mesa dos Chegados") → avança para orçamento | Só no fechamento |

**Requisitos funcionais:**
- `[MVP]` 3 cards de experiência na home (dados em arquivo estático/JSON, sem CMS).
- `[MVP]` Página de detalhe por experiência: nome, fotos, ocasião, faixa de pessoas, **faixa "a partir de R$X/pessoa"**, lista "o que está incluso / o que não está incluso" (ex.: exclui bebidas alcoólicas, garçom extra, mobiliário).
- `[MVP]` Seletor de variação/técnica **dentro** da experiência (não cria card novo).
- `[MVP]` Ordenar a vitrine com a experiência de **maior ticket primeiro** (ancoragem alta — Mesa de Celebração ancora e faz Mesa Cheia parecer acessível).
- `[MVP]` CTA único e claro por experiência: "Ver valor e reservar".

#### Trilha B — "Montar a minha" (briefing guiado, com trilhos)

| O cliente faz | WhatsApp? |
|---|---|
| Responde 6 perguntas com opções fechadas → gera um briefing → vira mensagem pré-preenchida no WhatsApp para o chef | Sim — fecho consultivo |

**Requisitos funcionais — o formulário tem trilhos (campos fechados, não texto livre):**
- `[MVP]` **P1 Ocasião** — lista fechada: aniversário / bodas / pedido / confraternização / jantar a dois / outro.
- `[MVP]` **P2 Nº de pessoas** — define a faixa de formato e já mapeia para uma das 3 experiências-esqueleto.
- `[MVP]` **P3 Vibe** — intimista / animado / sofisticado (mapeia para a base).
- `[MVP]` **P4 Proteína-base** — escolha entre 3–4 que o chef domina (não campo aberto).
- `[MVP]` **P5 Restrições** — vegetariano / sem glúten / alergias.
- `[MVP]` **P6 Data + faixa de orçamento por pessoa.**
- `[MVP]` Ao enviar, gerar **mensagem pré-preenchida no WhatsApp** com todas as respostas estruturadas (reaproveita o padrão `WHATSAPP_MESSAGES` já existente no código).
- `[MVP]` Copy do topo do formulário reforça exclusividade: *"Conte a ocasião e o desejo — o chef desenha um menu exclusivo para a sua data."* (não "peça o que quiser").

> **Regra de ouro do Sob Medida (proteção de margem e sanidade do chef):** livre = ocasião, proteína dentro do repertório, nível de experiência. Com limite = o chef não cozinha fora do repertório nem improvisa pratos não testados. O cliente **troca módulos** (entrada/principal/sobremesa) dentro de opções pré-aprovadas.

### Fase 3 — Proposta / Orçamento
**Objetivo:** dar ao cliente uma **âncora de preço imediata** (mata a fricção do "será que cabe no bolso?") sem virar tabela de commodity.

| O cliente faz | WhatsApp? |
|---|---|
| Vê uma **faixa estimada na hora** (nº de pessoas × preço/pessoa + taxa de serra) → recebe proposta formal do chef | Sim — proposta formal e ajuste fino vêm pelo WhatsApp |

**Requisitos funcionais:**
- `[MVP]` **Calculadora de faixa** client-side: cliente informa nº de pessoas e cidade → vê faixa estimada (ex.: "entre R$X e R$Y por pessoa + taxa de serra"). **Faixa, nunca valor fechado** — preserva o "não é commodity".
- `[MVP]` A calculadora aplica regras de negócio do doc de precificação: **piso de faturamento por evento** (mesmo com 2 convidados) e **mínimo de pessoas por experiência**.
- `[MVP]` **Taxa de serra por município** (3 faixas: centro de Campos do Jordão incluso / até X km taxa fixa / acesso difícil taxa premium). Comunicar como "taxa de serra", nunca "frete".
- `[MVP]` Resultado da calculadora vira mensagem pré-preenchida no WhatsApp ("Quero a Mesa Cheia para 12 pessoas em São Bento, dia tal").
- `[MVP]` Sob Medida **nunca** exibe valor mais barato que a experiência curada mais cara (regra anti-canibalização).
- `[v2]` Proposta formal digital (PDF/link) com itens, inclusos e validade, gerada sem WhatsApp.

> **PREMISSA A VALIDAR COM O RAFAEL (P2 — destrava tudo):** definir os **3 números-chave**: (1) ticket mínimo por evento; (2) % do sinal (recomendado 40–50%); (3) raio de deslocamento incluso. Com esses três definidos, a calculadora e a tabela de preço se montam sozinhas.
> **PREMISSA P3:** confirmar publicar **faixa de preço** (recomendação de 4 dos 6 especialistas e da crítica) em vez do "consultar WhatsApp" cego de hoje.

### Fase 4 — Reserva com sinal
**Objetivo:** travar a data, filtrar curioso e profissionalizar. **É o ponto que mais muda o negócio.**

| O cliente faz | WhatsApp? |
|---|---|
| Confirma data → paga **sinal de 40–50% via Pix** → recebe confirmação | Sim — Pix manual + confirmação humana no MVP |

**Requisitos funcionais:**
- `[MVP]` **Sinal manual via Pix** já no MVP: chef envia chave Pix pelo WhatsApp, cliente paga, chef confirma a data. Sem sinal, não há agenda.
- `[MVP]` Mensagem-padrão de confirmação de reserva (data, experiência, nº de pessoas, valor total estimado, valor do sinal, saldo e quando vence).
- `[MVP]` **Política de cancelamento escalonada** publicada e enviada na confirmação: >14 dias devolve sinal menos taxa; 7–14 dias retém 50%; <72h retém 100% (insumos perecíveis já comprados).
- `[v2]` **Agenda com disponibilidade real** e bloqueio de datas (impede dois eventos no mesmo sábado de alta temporada — limite duro de 1 chef).
- `[v2]` Pagamento de sinal online (Pix automático / gateway) com baixa automática.

### Fase 5 — Pré-evento
**Objetivo:** chegar à casa do cliente sem surpresa operacional (cozinha, acesso, restrições).

| O cliente faz | WhatsApp? |
|---|---|
| Preenche um formulário de detalhes → recebe lembrete D-2 | Sim — lembrete e ajustes finais |

**Requisitos funcionais:**
- `[MVP]` **Formulário de briefing pré-evento** (pode ser Google Form embutido no MVP): restrições/alergias finais, nº final de pessoas, **estrutura da cozinha** (fogão/forno/churrasqueira disponíveis), endereço completo, horário de chegada, estacionamento.
- `[MVP]` **Lembrete D-2** (pode ser mensagem manual de WhatsApp seguindo um checklist).
- `[MVP]` Regra: nº final de pessoas confirmado no pré-evento ajusta o saldo a pagar.
- `[v2]` Formulário pré-evento integrado à área do cliente, disparado automaticamente após o sinal.

### Fase 6 — Evento
**Objetivo:** entregar a experiência. (Operação física, fora do escopo digital — mas o produto registra o gancho do pós.)

**Requisitos funcionais:**
- `[MVP]` Nada obrigatório no produto digital durante o evento.
- `[MVP]` Orientar o chef a **capturar 1–2 fotos/autorização de depoimento** ao final (alimenta a Fase 7).

### Fase 7 — Pós / Recompra
**Objetivo:** transformar evento em relacionamento e receita recorrente (combate a sazonalidade).

| O cliente faz | WhatsApp? |
|---|---|
| Recebe pedido de depoimento (D+1) → eventualmente recompra; informa datas comemorativas | Sim — mensagem D+1 e reativação sazonal |

**Requisitos funcionais:**
- `[MVP]` **Mensagem D+1** padrão pedindo depoimento + foto, com link fácil para responder.
- `[MVP]` **Captura de datas comemorativas** (aniversários, data do casal) — registrar para reativação. No MVP pode ser uma planilha simples alimentada pelo chef.
- `[MVP]` Pedir que o depoimento mencione **o momento** (não o prato) para reforçar o posicionamento.
- `[v2]` **Área do cliente:** histórico, recompra em 1 clique, lembrete automático nas datas comemorativas.
- `[v2]` **"Clube da Mantiqueira"** — assinatura para donos de casa de temporada / pousadas (X jantares/temporada, prioridade de agenda, menu rotativo). Resolve receita fora de pico. **Pós-MVP — não agora.**

---

## 4. Onde o WhatsApp continua sendo a ponte (mapa explícito)

O produto digital **qualifica e estrutura**; o WhatsApp **fecha e humaniza**. No MVP, o WhatsApp é a ponte em:

| Momento | Papel do WhatsApp | Vira automático em |
|---|---|---|
| Indeciso (Porta C) | Atendimento humano | — (sempre humano) |
| Briefing "Montar a minha" | Recebe mensagem pré-preenchida | v2 (proposta digital) |
| Resultado da calculadora | Cliente dispara intenção com dados | v2 |
| Proposta formal | Chef envia e ajusta | v2 |
| Sinal/Pix | Chave manual + confirmação | v2 (pagamento online) |
| Lembrete D-2 | Mensagem do chef | v2 (disparo automático) |
| Pós D+1 e reativação | Relacionamento | v2 (área do cliente) |

**Princípio:** o WhatsApp nunca recebe um lead "cru". Sempre chega já enquadrado (experiência escolhida ou briefing estruturado), para a conversa começar no "vamos fechar a data", não no "o que vocês fazem?".

---

## 5. Escopo do MVP digital (o que lançar agora)

**O MVP é uma evolução da landing page atual, não um sistema.** Tudo client-side, dados estáticos, WhatsApp como motor de fechamento.

**Inclui:**
1. Home com **2 portas** (Escolher uma experiência / Montar a minha) + micro-CTA "Não sei, me ajuda" → WhatsApp.
2. Porta A como **vitrine estática de 3 experiências** (JSON, sem CMS), com faixa de preço e inclusos.
3. Porta B como **formulário guiado de 6 perguntas com trilhos** → mensagem pré-preenchida no WhatsApp.
4. **Calculadora de faixa de preço** client-side (nº pessoas × preço/pessoa + taxa de serra, com piso por evento).
5. **Formulário de briefing pré-evento** (Google Form embutido).
6. **Sinal via Pix manual** + mensagens-padrão (confirmação, política de cancelamento, lembrete D-2, pós D+1).
7. Prova social por momento, selo de insumos, crédito da confeitaria, link do Instagram.

**Explicitamente FORA do MVP (v2+):** agenda com disponibilidade real; pagamento online; área do cliente; CMS; proposta digital; Clube da Mantiqueira; parceria rastreável Airbnb/pousadas; harmonização de vinhos; brunch; café colonial; 4ª experiência ou 2º nível de naming.

> **O que NÃO fazer agora (combate direto ao medo do dono):** 6–8 menus nomeados, dois níveis de naming (ocasião + tema como cards), vinhos, brunch. Tudo isso é amplitude que **reabre** a confusão. Amplitude vem depois que 3 cards estiverem vendendo.

---

## 6. Fases seguintes (roadmap resumido)

| Fase | Entrega-chave | Problema que resolve |
|---|---|---|
| **MVP** | 2 portas + vitrine 3 experiências + calculadora + Pix manual | Oferta clara, lead enquadrado, fricção reduzida |
| **v2 — Operação** | Agenda real + sinal online + proposta digital | Escala do chef solo, no-show, alta temporada |
| **v3 — Relacionamento** | Área do cliente + datas comemorativas + recompra 1-clique | Recompra, reativação sazonal |
| **v4 — Recorrência** | Clube da Mantiqueira + parceria Airbnb/pousadas | Receita fora de pico (sazonalidade) |

---

## 7. Como cada decisão de jornada combate "oferta confusa / sem nicho"

| Foco de confusão (medo do dono) | Decisão na jornada |
|---|---|
| Oferta parece infinita | Home tem **só 2 portas** + 3 experiências. Dúvida cai no WhatsApp, nunca vira card. |
| Curado vs. sob medida competindo | Sob Medida é **botão secundário, opt-in, premium**, que **parte de uma experiência-esqueleto**. Nunca mais barato que o curado mais caro. |
| Dois eixos de naming (ocasião + técnica) | **Um eixo só: ocasião.** Técnica vive dentro do card. |
| "Mestre da Grelha" solto | Vira **formato** dentro de Mesa Cheia / Mesa de Celebração. |
| Virar commodity (comida no quilo) | Vocabulário travado (experiência/noite), preço como **faixa**, item-assinatura não-cotável (confeitaria autoral). |
| Cliente não sabe se cabe no bolso e some no silêncio | **Calculadora de faixa** dá âncora imediata. |

---

## 8. Métricas da jornada (acompanhar desde o MVP)

- **Taxa Porta A vs. Porta B** (validar a premissa 70/25/5).
- **Taxa de uso da calculadora → WhatsApp** (a calculadora está reduzindo fricção?).
- **% de leads que chegam ao WhatsApp já enquadrados** vs. "o que vocês fazem?".
- **Taxa de conversão sinal pago / proposta enviada** (o sinal está filtrando bem?).
- **Taxa de no-show / cancelamento** por faixa da política.
- **% de recompra e datas comemorativas capturadas.**

---

## 9. Premissas a validar com o Rafael (consolidado)

| # | Premissa | Recomendação |
|---|---|---|
| **P1** | Parrilla/"Mestre da Grelha" deixa de ser linha e vira formato. | Sim — vira formato. |
| **P2** | Os 3 números: ticket mínimo por evento, % do sinal, raio incluso. | Sinal 40–50%; definir os outros dois. |
| **P3** | Publicar faixa "a partir de R$X/pessoa" em vez de "consultar WhatsApp". | Publicar faixa. |
| **P4** | Nomes das 3 experiências (Mesa dos Chegados / Mesa Cheia / Mesa de Celebração) — padronizar família "Mesa ___". | Padronizar "Mesa ___" (dá unidade). |
| **P5** | Fixar nº de experiências da home em **3** (não 5–8). | Travar em 3 + Sob Medida. |
| **P6** | Mínimo de pessoas por experiência (ex.: Mesa dos Chegados piso 4; Mesa Cheia piso 8). | Definir piso por experiência. |
| **P7** | Sinal Pix manual no MVP é aceitável antes de pagamento online. | Sim — começar manual. |

---

*Próximo passo prático: validar P1–P7 numa conversa de 30 min, fechar os 3 números (P2) e os 3 nomes (P4). Com isso, a vitrine, a calculadora e as mensagens de WhatsApp do MVP podem ser escritas e publicadas.*