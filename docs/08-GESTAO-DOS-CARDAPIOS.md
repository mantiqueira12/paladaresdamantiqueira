# 08 · Gestão dos Cardápios

> **Para quê serve este documento:** decidir *como* o chef Rafael vai manter os cardápios das experiências "Paladares da Mantiqueira" ao longo do tempo — onde os cardápios "moram", como editar um preço, como criar uma experiência nova e como ligar/desligar algo sem quebrar nada. Vale tanto para hoje (sem site ainda) quanto para o site futuro.

---

## 1. As 3 opções, lado a lado

Avaliamos três formas de guardar e manter os cardápios. Todas separam **conteúdo** (o que o Rafael edita) de **código** (o site), são versionadas e de custo zero de plataforma. Mudam no equilíbrio entre *facilidade de edição*, *narrativa* e *risco de quebrar*.

| Critério | **1. Markdown modular** (1 arquivo `.md` por experiência) | **2. Fonte única** (um `cardapios.yml`/`.json`) | **3. Planilha** (Google Sheets) |
|---|---|---|---|
| **Facilidade de editar** | Alta — abre o arquivo, troca o texto, salva | Média — acha o bloco certo num arquivo grande | Alta (números/status) · **Baixa para texto longo** |
| **Facilidade de criar uma nova** | Alta — duplica `_MODELO.md`, preenche | Média — copia/cola um bloco respeitando indentação | Média — duplica linha + adiciona linhas-filhas de pratos |
| **Storytelling / narrativa** | **Alta** — corpo em Markdown, feito para texto | Média — descrição cabe, mas o arquivo não convida a escrever | **Baixa** — célula é péssima para parágrafo emocional |
| **Ligar no site** | Excelente — geradores estáticos leem frontmatter nativo | Excelente — sites nascem para ler `.yml` | Boa — exige API/CSV e *rebuild* a cada edição |
| **Edição pelo celular** | Razoável (app de notas/Markdown) | Razoável (GitHub web) | **Excelente** (app Sheets nativo) |
| **Risco de quebrar** | Médio — o YAML do topo é o ponto frágil | **Alto** se editar o `.yml` cru (1 erro derruba *tudo*) | Médio-alto — quebra silenciosa (id órfão, status mal escrito) |
| **Raio do estrago de um erro** | **Só aquela experiência** | O **site inteiro** | Ligações experiência↔pratos |
| **Esforço para montar** | Baixo-médio | Baixo-médio | Baixo-médio |
| **Custo de plataforma** | Zero | Zero | Zero |

**Leitura rápida da tabela:** a opção 1 é a única que pontua **alto em editar, criar E narrativa** ao mesmo tempo, e tem o **menor raio de estrago** quando algo dá errado (um arquivo torto afeta só uma experiência, nunca o site todo). A opção 2 é tecnicamente elegante, mas concentra todo o risco num único arquivo. A opção 3 ganha no celular e perde feio justamente no que é o coração da marca: a história da noite.

---

## 2. Recomendação

### Recomendado: **Opção 1 — Markdown modular (1 arquivo `.md` por experiência, em `docs/cardapios/`)**

**Por quê.** É o melhor equilíbrio entre *fácil de editar agora* e *já pronto para o site depois*:

1. **Casa com o coração da marca.** O eixo de "Paladares da Mantiqueira" é a **celebração à mesa** — vende-se a *noite*, não a comida no kg. Isso exige **texto que respira**: parágrafo, ênfase, ritmo. Markdown foi feito exatamente para isso. Planilha sufoca a narrativa; o arquivo único não convida a escrever. O `.md` deixa o Rafael contar a história com conforto.
2. **Uma experiência = um arquivo.** Espelha o modelo mental do negócio (cada experiência "Mesa ___" é uma unidade). Editar a "Mesa na Brasa" é abrir `mesa-na-brasa.md` — não caçar uma linha no meio de um paredão.
3. **Erro com raio pequeno.** Se um arquivo ficar torto, **só aquela experiência** sai do ar — o resto do site continua de pé. Na opção 2, um espaço errado derruba o site inteiro num sábado de evento. Essa diferença é decisiva para quem não programa.
4. **Fonte única de verdade, sem retrabalho.** O mesmo arquivo que o Rafael edita é o que o site lê. Nada de cadastrar em dois lugares.
5. **Encaixe direto no site futuro.** Astro, Eleventy, Next, Hugo — todos leem frontmatter nativamente. As **3 portas** (Íntima / Casa Cheia / Celebração) viram filtro pelo campo `linha`/`ocasioes`; a `camada` decide se a página mostra "R$/hora" ou "por pessoa". O Markdown **já é** o banco de dados — sem CMS, sem servidor, sem mensalidade.
6. **Portátil e à prova de fornecedor.** Texto puro, abre em qualquer editor, nunca "expira" nem depende de plataforma paga.

**O risco real e como neutralizar.** O ponto frágil é o **frontmatter YAML** (o bloco entre `---` no topo): um espaço a mais na indentação, esquecer aspas num nome com dois-pontos, ou apagar um `---` quebra *aquele* arquivo. Mitigações já embutidas neste padrão:
- **Frontmatter só com campos simples** (texto, número, sim/não, listas curtas em uma linha) — nada aninhado, que é onde a indentação derruba tudo.
- **Editor que valida ao salvar** (VS Code + extensão de YAML, ou um app tipo Obsidian apontado para a pasta `docs/cardapios/`).
- **`_MODELO.md` cheio de comentários** e este documento como manual.
- **Regra de ouro:** mexa no corpo à vontade; no topo, troque *valores*, nunca apague os `---` nem os nomes dos campos (ver §4).

### Quando a Planilha (opção 3) seria a melhor escolha

Se, na prática, o Rafael **preferir editar como planilha e principalmente pelo celular** — tocar numa célula no app do Google Sheets entre um evento e outro, com a Fernanda editando a coluna de sobremesas em paralelo — então a Planilha passa a fazer mais sentido **como camada de dados**. O preço dessa conveniência é a narrativa: a história da noite terá de morar em outro lugar (um campo de texto rico ou os próprios `.md`), porque célula não acomoda parágrafo emocional.

> **Importante — dá para trocar depois sem perder conteúdo.** As três opções guardam os **mesmos campos** (nome, ocasião, pessoas, preço, etc.). Migrar Markdown → Planilha (ou o contrário) é uma conversão mecânica de uma vez. **Comece pelo Markdown**, que é onde a marca fala melhor; se o dia a dia provar que o celular/planilha é mais confortável, migra-se sem retrabalho. A decisão de hoje **não tranca** a de amanhã.

---

## 3. Guia prático — sistema recomendado (Markdown modular)

**Onde tudo mora:** uma pasta `docs/cardapios/`. Dentro dela:
- `_MODELO.md` — o gabarito (nunca aparece no site; serve só para copiar).
- `LEIA-ME.md` — atalho com este passo a passo.
- Um arquivo por experiência: `mesa-na-brasa.md`, `mesa-fondue.md`, `mesa-intima.md`, etc.

> **Nome do arquivo (slug):** tudo minúsculo, sem acento, sem espaço, com hífen. "Mesa na Brasa" → `mesa-na-brasa.md`. É esse nome que vira o endereço da página no site.

### 3.1. Como **editar** um cardápio existente
1. Abra a pasta `docs/cardapios/` no editor.
2. Abra o arquivo da experiência (ex.: `mesa-na-brasa.md`).
3. **Para mudar texto** (descrição, pratos, promessa): edite à vontade abaixo da segunda linha de `---`. É Markdown comum.
4. **Para mudar um dado** (preço, nº de pessoas, sazonalidade): no topo, ache o campo e troque **só o valor**. Ex.: `preco_por_pessoa: 180` → `preco_por_pessoa: 195`.
5. Salve. Se usar Git, faça commit (uma "foto" do estado — dá para desfazer depois).
6. **Conferência de 5 segundos:** os dois `---` continuam lá? Nomes com dois-pontos estão entre aspas? Indentação intocada? Pronto.

### 3.2. Como **criar** uma experiência nova
1. **Duplique** `_MODELO.md`.
2. **Renomeie** a cópia com o slug da nova experiência (ex.: `mesa-celebracao.md`).
3. Preencha o **frontmatter** (topo): `nome`, `linha`, `ocasioes`, `pessoas_min/max`, `duracao_horas`, `camada`, `preco_por_pessoa` **ou** `servico_hora`, etc.
4. Escreva o **corpo**: promessa, entradas, principais, sobremesas (assinadas pelo Ateliê), inclui/exclui, extras, notas.
5. Deixe `ativo: true` quando estiver pronta para aparecer. Defina a `ordem` (posição na lista).
6. Salve / commit. O card aparece sozinho no site, na porta de ocasião certa.

### 3.3. Template oficial (o `_MODELO.md`)

Cada experiência é **um** arquivo `.md` com **este formato exato** (frontmatter YAML + corpo Markdown). Copie deste ponto, começando em `---`:

```markdown
---
nome: "<Nome da experiência>"
linha: "<Íntima | Casa Cheia | Celebração | Express>"
ocasioes: ["<ocasião 1>", "<ocasião 2>"]
pessoas_min: <número>
pessoas_max: <número>
duracao_horas: <número>
sazonalidade: "<ano todo | inverno (jun-ago) | datas comemorativas | ...>"
camada: "<completa | servico | ambas>"   # servico = Só o Serviço (cliente compra insumos), mín. 3h, R$100/h
destaque: "<lancamento | novidade | expansao>"
ativo: true
ordem: <número>
preco_por_pessoa: null            # camada completa — a definir pelo CMV
servico_hora: 100                 # camada Só o Serviço (R$/h, mín. 3h)
sobremesas_por: "Ateliê Fernanda Marton"
dieteticas: ["vegetariana"]       # + "sem glúten" / "sem lactose" quando aplicável
extras_recomendados: ["<extra 1>", "<extra 2>"]
---

# <Nome da experiência>

> **Promessa:** <uma frase que vende a noite, não a comida>

**Ocasião ideal:** <...> · **Pessoas:** <min–max> · **Duração:** <~Xh> · **Sazonalidade:** <...>

## Entradas — escolha 1
- **<nome>** — <descrição curta e apetitosa>
- **<nome>** — <...>
- **<nome>** — <...>

## Principais — escolha 1
- **<nome>** — <...>
- **<nome>** — <...>
- **<nome>** — <...>

## Sobremesas — escolha 1  *(Doces pelo Ateliê Fernanda Marton)*
- **<nome>** — <...>
- **<nome>** — <...>

## Inclui / Exclui
- **Inclui:** <...>
- **Exclui:** <...>

## Extras recomendados
- <extra> — <por que combina> (catálogo completo no doc 07 §4)

## Notas
- <sazonalidade, versões dietéticas, item-assinatura, observações de operação>
```

### 3.4. Exemplo preenchido (referência rápida — "Mesa na Brasa")

```markdown
---
nome: "Mesa na Brasa"
linha: "Casa Cheia"
ocasioes: ["aniversário ao ar livre", "reunião de amigos", "confraternização"]
pessoas_min: 8
pessoas_max: 20
duracao_horas: 5
sazonalidade: "ano todo"
camada: "ambas"
destaque: "novidade"
ativo: true
ordem: 2
preco_por_pessoa: null
servico_hora: 100
sobremesas_por: "Ateliê Fernanda Marton"
dieteticas: ["vegetariana"]
extras_recomendados: ["estação de queijos da Serra", "harmonização de vinhos"]
---

# Mesa na Brasa

> **Promessa:** O fogo no centro, o anfitrião na cadeira — e a noite cuidando de si mesma.

**Ocasião ideal:** confraternização ao ar livre · **Pessoas:** 8–20 · **Duração:** ~5h · **Sazonalidade:** ano todo

## Entradas — escolha 1
- **Provolone na brasa** — derretido na hora, alecrim e mel da região.
- **Linguiça artesanal** — selada no fogo de chão, pão rústico.

## Principais — escolha 1
- **Costela fogo de chão** — horas de brasa lenta, desmancha no garfo.
- **Ancho ao ponto** — corte nobre grelhado à vista da mesa.

## Sobremesas — escolha 1  *(Doces pelo Ateliê Fernanda Marton)*
- **Banana na brasa** — doce de leite e farofa de castanhas.
- **Pavê da casa** — receita assinada do Ateliê.

## Inclui / Exclui
- **Inclui:** mão de obra, curadoria, execução e sobremesa do Ateliê; deslocamento até ~100 km.
- **Exclui:** bebidas e aluguel de mobiliário (disponíveis como extra).

## Extras recomendados
- Estação de queijos da Serra — abre a noite enquanto a brasa pega ponto (catálogo completo no doc 07 §4).

## Notas
- "Mestre da Grelha" é o **formato** desta experiência, não uma linha à parte.
- Versão vegetariana com legumes e queijos na brasa sob aviso prévio.
```

---

## 4. Regras de ouro (para não bagunçar)

### 4.1. Campos **obrigatórios** em todo arquivo
Sem estes, o card pode não renderizar ou aparecer errado:
- `nome` — sempre **entre aspas** (nomes podem ter dois-pontos/acentos).
- `linha` — uma das portas: **Íntima · Casa Cheia · Celebração · Express**.
- `camada` — `completa`, `servico` ou `ambas`. Define qual preço a página mostra.
- **O preço da camada usada:** `preco_por_pessoa` (completa) **e/ou** `servico_hora` (Só o Serviço).
- `ativo` — `true` para aparecer, `false` para sumir.
- `ordem` — número que define a posição na lista.

### 4.2. O que **nunca** mudar
- **Os dois `---`** que cercam o frontmatter. Apagar um deles quebra o arquivo. Eles não são enfeite: são a fronteira entre "dados" e "texto".
- **Os nomes dos campos** (a parte antes dos dois-pontos): `preco_por_pessoa`, `ocasioes`, `ativo`, etc. O site procura por esses nomes exatos. Troque o **valor**, jamais o **rótulo**. Precisa de um campo novo? Fale com quem cuida do site antes — campo inventado é ignorado.
- **O slug / nome do arquivo** depois que a experiência foi ao ar — ele é o endereço da página. Renomear quebra links já compartilhados.
- **As regras de negócio fixas** (jun/2026), que devem estar refletidas no conteúdo:
  - Só o Serviço = **R$ 100/h, mínimo de 3 horas**, cliente compra insumos e cuida da logística.
  - Deslocamento **incluso até ~100 km** (toda a Serra até São José dos Campos).
  - Confeitaria sempre assinada como **"Doces pelo Ateliê Fernanda Marton"**.
  - **Sob Medida** nunca mais barato que o curado mais caro.
  - "Mesa na Brasa" carrega o **formato** "Mestre da Grelha" — não criar linha separada para isso.

### 4.3. Ligar / desligar sem apagar
- Para tirar uma experiência do ar (esgotou a estação, está em revisão), **não apague o arquivo**: troque `ativo: true` por `ativo: false`. O card some do site, mas o conteúdo (e o histórico) fica guardado.
- Para trazê-la de volta, é só voltar para `ativo: true`. Nada para reescrever.
- Útil para sazonais: a "Mesa Fondue" pode passar o verão em `ativo: false` e reaparecer no inverno com um toque.

### 4.4. Higiene de edição (hábitos que evitam 90% dos sustos)
- **Edite uma experiência por vez** e salve. Erro pequeno, fácil de achar.
- **Aspas em todo texto** do frontmatter, principalmente se tiver dois-pontos, acento ou vírgula.
- **Listas em uma linha só:** `ocasioes: ["a", "b"]` — evite quebrar em várias linhas (indentação aninhada é o que mais quebra).
- **Conferência de 5 segundos** antes de fechar: dois `---` presentes? Nomes de campo intocados? Valores no formato certo (número sem aspas, texto com aspas)?
- **Use o controle de versão** (Git): cada salvamento vira uma "foto" reversível. Errou? Volta-se ao estado anterior sem drama.
- Na dúvida sobre um campo, **copie do `_MODELO.md`** em vez de digitar do zero.

---

*Documento de gestão — Paladares da Mantiqueira · referências cruzadas: doc 07 (catálogo de extras, §4) · decisões confirmadas jun/2026.*