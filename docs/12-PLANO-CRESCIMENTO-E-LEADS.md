# 12 · Plano de Crescimento e Leads

**Paladares da Mantiqueira — Chef Particular na Serra da Mantiqueira**
Versão 1.0 | Julho/2026 | Gerado por auditoria multi-agente (4 auditores: conversão do site, medição do funil, canais orgânicos, processo comercial) + crítico adversarial que cortou o plano para caber na realidade: **1 pessoa, 5h/semana de marketing, R$ 0 de mídia paga.**

> **Para quem é este documento:** Rafael Jacob (dono e chef) e qualquer agente que for executar as melhorias.
> **O que ele faz:** é o plano-mestre para **vender mais e receber mais pedidos de orçamento**, em 3 fases com checkboxes. Cada item diz **quem faz** (🧑‍🍳 Rafael = painel/telefone/conversa · 🤖 Agente = código/documentos · 🤝 os dois).
> **Regra de execução:** seguir a ordem. Nada da Fase 2 antes da Fase 1 estar rodando. Marcar `[x]` ao concluir e registrar no `STATUS.md`.

---

## 0. Ponto de partida (baseline jul/2026)

| Indicador | Hoje |
|---|---|
| Pedidos de orçamento (WhatsApp) | **3–8/mês** |
| Google Business Profile | Verificado, **incompleto**, **1 avaliação** 5.0, fora do Local Pack |
| Instagram @paladaresdamantiqueira | Criado, **0 posts** |
| Site | No ar em `paladaresdamantiqueira.com.br`, 14 landings SEO, GA4 ativo (`solicitar_orcamento`) |
| Funil pós-clique | **Cego** — ninguém registra lead → proposta → fechado |
| Verba de anúncios | R$ 0 (só orgânico, por decisão) |
| Tempo do Rafael p/ marketing | 5h+/semana |

**A tese do plano (por que esta ordem):**
1. **Converter melhor os 3–8 leads que JÁ chegam** é o crescimento mais barato que existe — resposta rápida + follow-up recuperam 20–30% das propostas que hoje morrem no silêncio.
2. **GBP + avaliações** destravam a busca de maior intenção da região ("chef particular campos do jordão") — e estamos **em plena alta temporada de inverno**.
3. **Instagram** não é motor de leads no curto prazo: é **prova de vida**. O lead que chega pelo GBP/WhatsApp confere o perfil antes de fechar — hoje encontra um perfil vazio.

**Ordem fixa de prioridade quando faltar tempo:**
`avaliações > GBP > vendas/WhatsApp > Instagram > parcerias`

---

## 1. FASE 1 — Semana 1 (destravar o que sangra)

### 1.1 🧑‍🍳 GBP Sprint de Fundação (2h, sessão única no painel)
*A maior alavanca por hora investida. Tudo no painel do Google Business, sem código.*

- [ ] **Categorias:** manter "Serviço de chef pessoal" como primária; adicionar 2–3 secundárias (buscar no seletor por "bufê", "casamento", "eventos"). Secundárias **não aparecem ao público** — só ranqueiam; não violam o vocabulário da marca.
- [ ] **Área de atendimento:** configurar como negócio a domicílio (ocultar endereço residencial) e cadastrar até 20 cidades: Campos do Jordão, Santo Antônio do Pinhal, São Bento do Sapucaí, Monte Verde/Camanducaia, Gonçalves, Sapucaí-Mirim, São José dos Campos, Pindamonhangaba, Taubaté, Tremembé, Caçapava, Jacareí.
- [ ] **Serviços:** cadastrar as **13 experiências** como serviços (nome + descrição até 300 chars citando a porta de ocasião; preço = "entre em contato"). Cadastrar **"Só o Serviço" COM preço R$ 100/hora** (única camada com preço público — decisão fechada, doc 09).
- [ ] **Descrição (750 chars):** usar o texto pronto do Apêndice A.1.
- [ ] **Atributos:** revisar Editar perfil → Mais; marcar "agendamento obrigatório", "orçamentos on-line", empresa familiar (se disponível).
- [ ] **Link do site com UTM:** `https://paladaresdamantiqueira.com.br/?utm_source=gbp&utm_medium=organic&utm_campaign=perfil` · telefone idêntico ao do site/IG (consistência NAP).

### 1.2 🧑‍🍳 Blitz de avaliações: de 1 para 10+ em 30–45 dias
- [ ] Levantar no WhatsApp **15–20 clientes antigos** (nome, ocasião, cidade, data do evento) — anotar na planilha-funil (1.4).
- [ ] Enviar a mensagem do helper `mensagemAvaliacaoGoogle()` (`src/lib/whatsapp.ts`) personalizada com nome + ocasião + cidade — é a personalização que faz o cliente escrever "jantar de aniversário em Campos do Jordão", e esse texto é sinal de relevância local para o Google.
- [ ] **Cadência: 1–2 envios por dia útil, NUNCA em rajada** — 10 avaliações no mesmo dia num perfil que tinha 1 acionam o filtro anti-spam e podem sumir todas.
- [ ] Follow-up único e gentil após 5–7 dias para quem não avaliou.
- [ ] **Regra dura:** nunca oferecer desconto/brinde/sorteio em troca de avaliação (risco de remoção total). O pedido é sempre "se a noite foi especial".
- [ ] 🧑‍🍳 Responder **100% das avaliações em até 24h**, como dono, citando cidade + experiência na resposta.

### 1.3 🤖 Remover o ícone do Instagram vazio do header
- [ ] Tirar o ícone do IG do header da home (`src/App.tsx`) e das 14 landings (`scripts/gen-landings.mjs`) — manter só no rodapé — até o perfil ter 9–12 posts. Perfil zerado colado ao CTA principal sinaliza "negócio parado" no momento da decisão.
- [ ] Rebuild + deploy.

### 1.4 🤝 Planilha-funil única (mini-CRM) + ritual semanal
*Dois auditores pediram a mesma planilha — é UMA só. Fonte da verdade de todo o plano.*

- [ ] 🤖 Gerar o modelo (Google Sheets ou .xlsx) com **aba LEADS** (1 linha por conversa, 10–14 colunas): Data · Nome · Telefone · Canal (lista: Instagram / Site-Google / Maps-GBP / Indicação / Parceria / Outro) · Página/experiência citada na 1ª mensagem · Ocasião · Nº pessoas · Cidade · Data do evento · Status (Novo → Respondido → Proposta → Follow-up → Sinal pago → Realizado → Perdido) · Data do próximo toque · Datas comemorativas capturadas · Valor proposto · Valor fechado.
- [ ] 🤖 **Aba RESUMO** com fórmulas por mês: leads, propostas, fechados, taxa lead→proposta, taxa proposta→fechado, ticket médio + coluna manual com cliques `solicitar_orcamento` do GA4.
- [ ] 🤖 **Aba UTMs:** a tabela de links padronizados (Apêndice A.2) para nunca improvisar.
- [ ] 🧑‍🍳 Ritual: **2 min por lead na hora que chega + 15 min toda sexta** varrendo a coluna "próximo toque". Criar lembrete recorrente no Google Agenda **desde o dia 1**.

### 1.5 🧑‍🍳 WhatsApp Business com Respostas Rápidas
- [ ] Migrar para **WhatsApp Business** (grátis) no número +55 12 99771-0040.
- [ ] Salvar as Respostas Rápidas do Apêndice A.3: `/oi` (primeira resposta), `/qualifica` (4 perguntas em 1 envio), `/d2` e `/d5` (follow-up), `/d1pos` (pós-evento).
- [ ] Configurar **saudação automática** para horário de evento: "Estou no fogão agora — te respondo pessoalmente até às Xh 🌿".
- [ ] **SLA:** primeira resposta humana em ≤15 min em horário comercial, ≤2h fora dele. A primeira resposta sempre confirma os dados e dá o próximo passo com prazo ("te mando a proposta até amanhã às 12h").

### 1.6 🧑‍🍳 Fechar as 2 pendências comerciais do doc 09 (10 minutos)
- [ ] **Faixas de cancelamento:** confirmar defaults — >14 dias devolve sinal menos taxa · 7–14 dias retém 50% · <72h retém 100%.
- [ ] **Prazo do saldo:** até 48h antes do evento (recomendado) ou no dia.
- [ ] 🤖 Registrar no doc 09 (mover de ⏳ para ✅) e salvar o script do pedido de sinal (Apêndice A.4) como Resposta Rápida.

### 1.7 🤖 Microcopy de redução de risco sob os CTAs primários
- [ ] Adicionar linha abaixo do CTA do hero da home e dos heros das 14 landings: **"Orçamento sem compromisso · resposta no WhatsApp no mesmo dia"** (`src/App.tsx` + `scripts/gen-landings.mjs`).
- [ ] Urgência honesta e sazonal onde couber: "Poucas datas de fim de semana em [mês]".
- [ ] Rebuild + deploy (pode ir junto com 1.3).

---

## 2. FASE 2 — Mês 1 (construir o motor)

### 2.1 🧑‍🍳 GBP vivo: fotos + Q&A + 1 post/semana
- [ ] **Fotos:** subir 15–20 na primeira semana, renomeando ANTES do upload com padrão local: `chef-particular-campos-do-jordao-mesa-posta.jpg`, `noite-de-fondue-serra-da-mantiqueira.jpg`, `chef-rafael-jacob-brasa.jpg`, `sobremesa-atelie-fernanda-marton.jpg`. Mix: logo + capa (mesa com montanha) + 2 do Rafael no fogo + 1 do casal + 2–3 por porta + sobremesas. Depois, 2–3 novas/semana vindas de eventos reais.
- [ ] **Q&A semeado (6 perguntas):** o dono pode publicar e responder as próprias perguntas (prática legítima). Alinhar com `faq.json`: Quanto custa? (consultivo, sinal 50%, sem valores) · Atende quais cidades? · Cobra deslocamento? (incluso ~100 km) · Como funciona a reserva? · Faz só o serviço de cozinha? (R$ 100/h, mín. 3h) · Atende restrições alimentares?
- [ ] **1 post/semana** (tipo "Novidade", 15 min): 100–300 palavras + 1 foto + botão "Saiba mais" para a landing correspondente com UTM. Julho/agosto (inverno): sem.1 Noite de Fondue · sem.2 Mesa de Inverno Edição Pinhão · sem.3 Só o Serviço no churrasco · sem.4 Mesa dos Chegados.

### 2.2 🧑‍🍳 Ritual D+1 permanente (o motor que substitui a blitz)
- [ ] Ao confirmar cada evento (sinal pago), criar **na hora** o lembrete D+1 no Google Agenda.
- [ ] Manhã seguinte ao evento, 3 passos (2 min): (1) agradecimento + link de avaliação (`/d1pos`); (2) pedir 1–2 fotos da noite + autorização de uso no Instagram; (3) capturar 2 datas comemorativas (aniversário, data do casal) → planilha.
- [ ] **Cartão QR de despedida (R$ 0):** imprimir cartões com QR do link de avaliação e entregar junto com o doce final do Ateliê — o momento de maior encantamento vira o momento do pedido. Pedir verbalmente na despedida.
- [ ] Meta: 100% dos eventos recebem D+1; ≥50% viram avaliação.

### 2.3 🧑‍🍳 Lançamento do Instagram (9–12 posts no mês, teto de 1h30/semana)
*Objetivo do mês 1 não é audiência — é parar de queimar credibilidade.*

- [ ] Setup (§7.2 do PLANEJAMENTO.md): conta empresa, nome buscável "Chef Particular · Serra da Mantiqueira", botão WhatsApp, link da bio com UTM (`?utm_source=instagram&utm_medium=social&utm_campaign=bio`).
- [ ] Executar o calendário de 14 dias (Apêndice A.5) em versão enxuta — 9–12 posts no mês, priorizando **fondue/pinhão/inverno** (pico de busca jul/ago).
- [ ] Regras: geotag da cidade em todo post · 5–10 hashtags locais · todo CTA empurra para o link da bio · **máx. 30 min/dia — se estourar 1h30/semana, o IG é o primeiro canal a ser cortado.**
- [ ] Ao chegar a 9–12 posts: 🤖 devolver o ícone do IG ao rodapé/header conforme 1.3.

### 2.4 🧑‍🍳 Higiene GA4 (30 min, painel — dados não retroagem, fazer cedo)
- [ ] **Dimensões personalizadas** (Administração → Definições personalizadas, escopo Evento): `origem`, `pagina`, `experiencia`, `ocasiao`, `cidade`, `pessoas`, `so_servico` — sem isso, os parâmetros que o site JÁ envia não aparecem em relatório nenhum.
- [ ] Retenção de dados: 14 meses · cadastrar IP próprio como tráfego interno · vincular Search Console · marcar `solicitar_orcamento` como conversão (key event), se ainda não estiver.
- [ ] Montar 1 Exploração: `solicitar_orcamento` × `pagina` × `origem`.

### 2.5 🤝 Escada de objeção de preço (4 degraus, sem desconto)
- [ ] 🤖 Documentar (Apêndice A.6 já traz a base): (1) reancorar no valor → (2) ajustar ESCOPO mantendo preço/pessoa (Celebração → Casa Cheia → Express) → (3) oferecer "Só o Serviço" como formato, nunca como desconto → (4) recusar com elegância e manter no radar.
- [ ] 🧑‍🍳 Regra escrita: **nunca reduzir % sobre a mesma proposta** — muda-se o escopo, nunca o valor do mesmo escopo.

### 2.6 🧑‍🍳 Captura em lote nos eventos (o que torna o IG sustentável)
- [ ] Checklist de 10 min por evento (celular em tripé de mesa): **5 clipes de 10s** (acender o fogo, corte hero, empratamento, mesa posta, sobremesa do Ateliê) + **10 fotos**. Nunca fotografar convidados sem pedir.
- [ ] 1 evento = 2 Reels + 1 carrossel + 3–4 stories + 2–3 fotos p/ GBP = **2 semanas de conteúdo**.
- [ ] Segunda-feira, 1h no Meta Business Suite: agendar a semana inteira de uma vez.
- [ ] 🤖 Banco de 10 legendas-modelo derivadas do copy aprovado (3 inimigos, "você recebe os abraços", insumos da serra).

---

## 3. FASE 3 — Mês 2–3 (expandir e cortar)

### 3.1 🧑‍🍳 Parcerias com pousadas e casas de temporada
*Só depois de avaliações e IG minimamente prontos — o parceiro confere antes de indicar.*

- [ ] Lista de **10 alvos** (Google Maps + Airbnb): pousadas SEM restaurante próprio nas cidades da serra; administradoras de casas de temporada; anfitriões Airbnb com 3+ imóveis ou casas para 8+ hóspedes. Começar por quem já conhece o trabalho.
- [ ] **Oferta em camadas:** comissão de **10% sobre evento fechado E realizado** (paga após quitação) OU permuta de entrada (jantar Mesa dos Chegados para o casal proprietário em troca de card no kit de boas-vindas + indicação ativa). Exclusividade suave: 1 parceiro "preferencial" por cidade nos primeiros 6 meses.
- [ ] **Abordagem de vizinho** (Apêndice A.7) + visita levando caixa de doces do Ateliê como cartão de visitas comestível. Formalização leve: resumo do combinado por WhatsApp.
- [ ] **Cadência:** 2 contatos novos/semana + 1 visita a cada 15 dias.
- [ ] 🤖 **Kit por parceiro:** card A5/A6 no Canva + QR para a landing `/chef-para-pousadas-e-casas-de-temporada...` com UTM único (`?utm_source=parceiro&utm_medium=qr&utm_campaign=pousada-NOME`) + versão digital (mais usada que a impressa) + texto pronto de 3 linhas para o anfitrião enviar no check-in.
- [ ] Bônus SEO: pedir à pousada um link para a landing no site dela ("serviços para hóspedes") — o backlink local que falta no Bloco 6 do doc 11.

### 3.2 🤖 Patch único de landings (1 rodada de código + QA)
*Empacotar num só deploy, não como ações separadas:*
- [ ] Rodapé das 14 landings: CTA de WhatsApp passa a usar `waLink(n)` + tracking (hoje sem evento e sem mensagem contextual — `gen-landings.mjs`).
- [ ] **Selo "★ X,X no Google (N avaliações)"** perto dos CTAs — **só quando houver 10+ avaliações** (antes disso, "5,0 com 1 avaliação" enfraquece).
- [ ] Substituir gradualmente os depoimentos estáticos por **reviews reais** com link "ver no Google".
- [ ] Reavaliar CTA secundário "quero receber o cardápio" via wa.me (a versão sem PDF do lead magnet — ver §5).

### 3.3 🧑‍🍳🤖 Revisão de 60 dias com metas de corte (45 min, última sexta do mês 2)
*O mecanismo anti-inchaço: o que não bater meta perde horas.*

| Meta de 60 dias | Alvo | Fonte |
|---|---|---|
| Avaliações no Google | **10+** | GBP |
| Local Pack | Aparecer para "chef particular + 1 cidade" (aba anônima, celular) | teste manual |
| Parcerias ativas | **2**, com ≥1 lead rastreado | planilha |
| Conversão lead→sinal | Calculada e conhecida (baseline) | planilha RESUMO |
| Pedidos de orçamento/mês | **Dobrar o piso: 8+/mês** | planilha + GA4 |
| Instagram | 20+ posts, 1º orçamento com `utm_source=instagram` | GA4 |

- [ ] O que bater meta recebe mais horas; o que não bater é reduzido ou morto.
- [ ] Montar em outubro (não antes) o disparo de reativação de Réveillon para a base.

---

## 4. Riscos de execução (do crítico adversarial)

1. **Dispersão em 4 frentes** — com 5h/semana, tudo ao mesmo tempo = tudo pela metade. Antídoto: a ordem fixa de prioridade e parcerias só no mês 2.
2. **Instagram engolindo as horas** — é o canal mais prazeroso para um chef e o que menos converte busca de alta intenção. Teto duro de 1h30/semana.
3. **Blitz de avaliações em rajada** — aciona filtro anti-spam do Google. Disciplina de 1–2/dia; nunca oferecer brinde.
4. **Planilha abandonada na semana 3** — todo o sistema depende de UM hábito (15 min de sexta + 2 min por lead). Lembrete no Agenda desde o dia 1; planilha nunca cresce além das colunas definidas.
5. **Melhorar aquisição com fechamento fraco** — mais leads "crus" sem SLA/qualificação/follow-up = balde furado. Por isso 1.5 e 1.6 vêm ANTES de qualquer tráfego novo.

---

## 5. Descartado ou adiado (decidido — não re-discutir sem dado novo)

| Item | Motivo | Reabrir quando |
|---|---|---|
| PDF do cardápio como lead magnet | CTA "quero receber o cardápio" via wa.me resolve 90% sem PDF | houver demanda comprovada |
| Eventos GA4 de meio de funil (abrir_formulario etc.) | 3–8 leads/mês não têm volume estatístico; a planilha responde "onde vaza" | >20 leads/mês |
| Redesenho do formulário PedidoExperiencia | Otimização fina sem dado de abandono | dados de funil indicarem |
| Selo "5,0 no Google" perto dos CTAs | Com 1 avaliação, enfraquece | 10+ avaliações (§3.2) |
| Calendário completo de reativação (4 disparos/ano) | Base pequena demais para "campanhas"; datas do D+1 cobrem | outubro (Réveillon) |
| docs/PLAYBOOK-COMERCIAL extenso | As Respostas Rápidas SÃO o playbook | scripts rodarem 1 mês |
| Script `review-msg.mjs` | Colar o texto como Resposta Rápida elimina a necessidade | — |
| Etiquetas do WhatsApp espelhando status | Planilha é a fonte da verdade | — |
| Painel mensal elaborado no GA4 | Aba RESUMO + 1 olhada no GA4 bastam | — |
| Clube da Mantiqueira (e preparações) | Fase 2 declarada (doc 09) | 3 portas vendendo estável |

---

## Apêndice A — Textos e scripts prontos

### A.1 Descrição do GBP (750 chars)
> Chef particular na Serra da Mantiqueira: a experiência de um ótimo restaurante na sala da sua casa. O chef Rafael Jacob (15+ anos de cozinha) cuida da curadoria do cardápio, da compra dos insumos da serra, do preparo e do serviço — você recebe os abraços, sem estresse e sem pia cheia. Experiências para jantares íntimos, casa cheia e grandes celebrações, com sobremesas assinadas pelo Ateliê Fernanda Marton. Atendo Campos do Jordão, Santo Antônio do Pinhal, São Bento do Sapucaí, Monte Verde, Gonçalves e região até São José dos Campos, com deslocamento incluso (~100 km). Orçamento sob medida pelo WhatsApp.

### A.2 Tabela de UTMs (copiar para a aba UTMs da planilha)
| Canal | Link |
|---|---|
| Bio do Instagram | `https://paladaresdamantiqueira.com.br/?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| Stories/posts com link | mesmo padrão, variando `utm_campaign` (ex.: `story-reveillon`) |
| GBP (campo Site) | `https://paladaresdamantiqueira.com.br/?utm_source=gbp&utm_medium=organic&utm_campaign=perfil` |
| Posts do GBP | landing correspondente + `?utm_source=gbp&utm_medium=organic&utm_campaign=post-SEMANA` |
| Parceiro (QR/card) | landing pousadas + `?utm_source=parceiro&utm_medium=qr&utm_campaign=pousada-NOME` |

*UTMs não afetam o canonical nem o SEO. Canais que vão direto ao WhatsApp sem passar pelo site (botões do IG/GBP) são invisíveis ao GA4 — a coluna Canal da planilha é a fonte da verdade, preenchida com a pergunta padrão "posso te perguntar como me encontrou?".*

### A.3 Respostas Rápidas do WhatsApp Business
- **/oi (primeira resposta):** "Que alegria receber sua mensagem! 🌿 Recebi aqui: [confirmar dados que vieram]. Vou desenhar uma proposta à altura e te mando **até [prazo]**. Enquanto isso, me confirma uma coisa: [pergunta que faltou]?"
- **/qualifica (lead cru, 4 perguntas em UM envio):** "Que alegria! Para eu desenhar algo à altura, me conta rapidinho: qual a **ocasião**? **quantas pessoas**? qual **data** você tem em mente? e em **qual cidade** seria? 🌿" — *Regra: NUNCA falar de investimento antes das 4 respostas. Fora dos ~100 km ou fora do eixo (marmita/quilo/corporativo de rotina): recusa elegante.*
- **/d2 (follow-up, toque de valor):** "Pensei na sua noite e imaginei [prato/detalhe da experiência] para a ocasião de vocês — faz sentido?"
- **/d5 (escassez honesta):** "Vou montar a agenda de [mês] esta semana; consigo segurar o dia [data] até sexta. Te confirmo?"
- **/d10 (encerramento elegante):** "Se o momento mudou, tudo bem — posso te avisar quando abrir a agenda de [temporada]?"
- **/d1pos (pós-evento D+1):** usar o texto de `mensagemAvaliacaoGoogle()` (src/lib/whatsapp.ts) + pedir 1–2 fotos com autorização + capturar 2 datas comemorativas.

### A.4 Script do pedido de sinal (proposta aceita → UMA mensagem)
> "Que alegria! Para eu **reservar a sua data**: o sinal é de 50% (R$ [valor]) via Pix — chave: [chave]. Seguro o dia [data] para você até [dia+48h]. Política simples: cancelando com mais de 14 dias, devolvo o sinal (menos taxa); entre 7 e 14 dias, 50%; com menos de 72h, o sinal cobre os insumos já comprados. O saldo a gente acerta até 48h antes. Qualquer dúvida, é só chamar!"

Depois do Pix: mensagem de confirmação (doc 10 §6) + lembrete de saldo/briefing em D-3.

### A.5 Calendário dos 14 primeiros dias do Instagram
| Dia | Conteúdo |
|---|---|
| D1 | Reel manifesto 20–30s, Rafael de frente com o fogo aceso: "Você recebe os abraços, eu assumo o fogão" + compartilhar no @rafaeldjacob |
| D2 | Carrossel "3 formas de celebrar na serra" (1 card por porta; último card = CTA link na bio) |
| D3 | Stories com enquete "Qual é a sua próxima celebração na serra?" (3 opções = 3 portas) |
| D4 | Post "Quem é o Chef" (15+ anos, foto real, marcar @rafaeldjacob) |
| D5 | Reel bastidor de mise en place da Noite de Fondue (inverno = pico de fondue) |
| D6 | Foto de mesa posta + copy do inimigo nº 1 (a noite perdida no restaurante lotado — doc 06 §2.2) |
| D7 | Stories caixinha de perguntas → salvar em Destaque "Como funciona" |
| D8 | Carrossel "Como funciona em 4 passos" (experiência → data → sinal 50% → você recebe os abraços) |
| D9 | Post do Ateliê Fernanda Marton (marcar o perfil da Fernanda) |
| D10 | Reel POV "chegando na casa do cliente" (malas, fogo, primeira panela) |
| D11 | Post Mesa na Brasa (alta gastronomia, sem vocabulário de buffet) |
| D12 | Stories de compra com produtor local (selo "Insumos da Mantiqueira") |
| D13 | Carrossel "Inverno na serra" — Fondue + Edição Pinhão, CTA "agenda de julho/agosto limitada" |
| D14 | Prova social (depoimento citando a OCASIÃO) + escassez real ("restam X datas em agosto") |

### A.6 Escada de objeção de preço (4 degraus, nesta ordem, sem pular)
1. **Reancorar no valor:** "esse valor inclui curadoria, compra, execução e a sobremesa do Ateliê — você recebe os abraços, eu assumo o fogão."
2. **Ajustar escopo, mantendo o preço/pessoa:** menos tempos, outra experiência da mesma porta, ou porta mais enxuta (Celebração → Casa Cheia → Express).
3. **Oferecer "Só o Serviço" como formato diferente, nunca como desconto:** "existe um formato onde você cuida dos insumos e eu assumo só o comando: R$ 100/h, mínimo 3h."
4. **Recusar com elegância** e manter no radar de reativação.

### A.7 Abordagem de parceria (tom de vizinho)
> "Sou o Rafael, chef aqui da serra. Muitos hóspedes de pousada me pedem jantar no chalé, e eu queria indicar hospedagem de confiança também — posso passar aí pra gente se conhecer?"

Texto para o anfitrião enviar no check-in:
> "Dica da casa: se quiserem uma noite especial sem sair do chalé, o chef Rafael, aqui da serra, prepara jantares completos na sua cozinha — do fondue ao churrasco. Ele monta o orçamento pelo WhatsApp: [link]"

---

## Rotina semanal consolidada (≈ 4h30–5h)

| Dia | Tempo | O quê |
|---|---|---|
| Segunda | 1h30 | Agendar posts do IG (Meta Business Suite) + 1 post do GBP + varrer "próximo toque" da planilha |
| Terça | 30 min | Responder Q&A, avaliações e DMs |
| Quinta | 1h | Parcerias: 2 mensagens novas ou 1 visita (a partir do mês 2) |
| Sexta | 30 min | D+1 pendentes + envios da blitz de avaliações + atualizar planilha |
| Evento real | 25 min | 10 min captura em lote + stories ao vivo |
| Última sexta do mês | +45 min | Revisão de métricas (mês 2: revisão de 60 dias com metas de corte) |

**Número-rei:** pedidos de orçamento/mês (planilha + `solicitar_orcamento` no GA4). Meta de 60 dias: **8+/mês** e conversão lead→sinal conhecida.
