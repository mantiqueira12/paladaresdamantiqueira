# Crítica Adversarial (consultor cético)

# CRÍTICA ADVERSARIAL — Paladares da Mantiqueira

## 1) O medo central ("oferta confusa, sem nicho") está resolvido?

**Parcialmente — e os especialistas escondem um problema sob consenso aparente.** Todos convergiram em "2 trilhos" (curado vs. sob medida) + organizar por OCASIÃO, não por técnica. Isso resolve 70% do medo. Mas restam 3 focos reais de confusão:

- **Dois eixos de organização brigando.** Service Design e Marca organizam por OCASIÃO/Nº de pessoas (Mesa Íntima/Farta/Ocasião). Mas o Arquiteto de Cardápio organiza por TEMA (Brasa & Neblina, Noite de Fondue...). E o de Jornada admite que "por tema é mais fácil precificar, por momento vende melhor" sem decidir. **Resultado: se a home cruzar os dois eixos, o cliente vê "Mesa Farta" e dentro dela "Brasa & Neblina" e "Forno & Quintal" — duas camadas de naming. Isso é MAIS confuso que hoje, não menos.** Decisão obrigatória: UM eixo primário só.
- **Quantos produtos?** Service Design diz 3 linhas + 1 selo. Cardápio diz 6 menus (até 8). Jornada diz 5-7. São propostas incompatíveis. 6-8 cards nomeados numa home é exatamente o "inchaço" que o dono teme.
- **Mestre da Grelha.** Consenso de que vira formato, não linha. Concordo — mas hoje é um dos 3 destaques do site; rebaixá-lo é decisão de produto que precisa ser explícita.

## 2) Contradições e sobreposições entre especialistas

- **Eixo de catálogo (a contradição grave):** ocasião (Service Design, Marca, Posicionamento) **vs.** tema/menu (Cardápio). Precisa ser decidido pelo dono, não empurrado pro produto.
- **Granularidade:** 3 linhas (Service Design) vs. 6-8 menus (Cardápio) vs. 5-7 (Jornada). Conflito direto.
- **Preço público:** Service Design, Modelo de Negócio e Jornada querem faixa "a partir de R$X" publicada. Mas Marca diz "preço nunca é argumento" e a conversão hoje é 100% WhatsApp consultivo. Tensão real: publicar faixa reduz fricção mas enfraquece a venda consultiva por afeto. **Recomendo publicar faixa** — sem âncora de preço, "não é commodity" vira desculpa para o cliente não saber se cabe no bolso e desistir no silêncio.
- **Sobreposição pura:** os 6 especialistas reescreveram a mesma "arquitetura de 2 trilhos" com nomes diferentes (Mesas Assinadas/Experiências do Chef/Curadoria/Menus de Autor — tudo a mesma coisa). Isso não é validação independente; é eco. Cuidado em tratar consenso como prova.

## 3) Curado vs. sob medida: à prova de confusão?

**Risco de canibalização baixo, risco de confusão médio.** A blindagem certa (e os especialistas quase lá):

- **Sob medida NÃO é home de primeiro nível.** É botão secundário, opt-in, depois da vitrine curada. Todos concordam — mantenha.
- **Sob medida PARTE de um menu curado como esqueleto** (regra do Arquiteto de Cardápio). Esta é a melhor ideia do conjunto: o cliente troca módulos dentro do repertório, não pede "qualquer coisa". Protege qualidade, margem e a sanidade de 1 chef.
- **Regra de preço:** sob medida nunca sai mais barato que o curado mais caro. Sem isso, o curado é canibalizado por baixo.
- **O erro a evitar:** apresentar sob medida como "tudo que você imaginar". Isso reabre a commodity confusa. Posicione como "o mesmo chef desenhando exclusivo para a sua data" — exclusividade, não cardápio infinito.

## 4) Os 5 maiores riscos

1. **Escala de 1 chef (o teto duro).** Receita = horas do Rafael. Dois eventos no mesmo sábado de alta temporada = impossível. **Mitigar:** sinal alto trava agenda; preço sobe na alta temporada (não desconto); ter 1 auxiliar de confiança escalável; recusar datas em vez de baixar qualidade.
2. **Sazonalidade da serra.** Inverno (Campos do Jordão) lota; resto do ano cai. **Mitigar:** "Clube da Mantiqueira" (assinatura p/ donos de casa de temporada e pousadas) para receita fora de pico; parcerias com Airbnb/pousadas; Fondue/Origens como ímãs de inverno com agenda limitada e preço premium.
3. **Precificação por baixo da mão de obra real.** Erro nº1 de chef particular: cobrar só as horas "na casa", esquecendo compra+mise en place+limpeza+deslocamento em estrada de serra. **Mitigar:** ticket mínimo por evento (não só por pessoa), CMV-alvo ≤30%, taxa de serra por município, sinal 40-50%.
4. **Dependência total do WhatsApp.** Sem agenda, sem orçamento, sem trilha — não escala e some no volume de inverno. **Mitigar:** manter WhatsApp como fechamento, mas adicionar calculadora de faixa + formulário de briefing que gera mensagem pré-preenchida (reaproveita `WHATSAPP_MESSAGES` no `App.tsx`); sinal por Pix manual já no MVP.
5. **No-show / cancelamento com insumo perecível comprado.** **Mitigar:** sinal 40-50% obrigatório para travar data; política escalonada (<72h retém 100%).

## 5) O caminho mais simples que ainda entrega

Corte o excesso. O MVP de planejamento cabe em UMA decisão de estrutura:

1. **UM eixo: OCASIÃO.** 3 cards na home (Íntima 2-6 / Casa Cheia 8+ / Celebração premium). Tema (fondue/parrilla/pizza) vira opção DENTRO do card, nunca um card próprio.
2. **1 botão secundário "Sob Medida"** que parte de um desses 3 esqueletos.
3. **Mestre da Grelha = formato dentro de Casa Cheia/Celebração.** Não é linha.
4. **3 decisões numéricas que destravam tudo:** ticket mínimo por evento; % do sinal (40-50%); raio de deslocamento incluso. Defina esses três e a tabela de preço se monta sozinha.
5. **Publique faixa "a partir de R$X/pessoa"** por card. Fim do "consultar WhatsApp" cego.
6. **Pós-MVP (não agora):** Clube da Mantiqueira, agenda real, pagamento online, CMS.

**O que NÃO fazer agora:** 6-8 menus nomeados, dois níveis de naming, harmonização de vinhos, brunch, café colonial. Tudo isso é amplitude que reabre o medo que o dono tem. Amplitude vem depois que 3 cards estiverem vendendo.

Arquivo relevante: `C:\Users\acer\Documents\Paladares da Mantiqueira\paladares-da-mantiqueira\src\App.tsx` (seção `#quiz` e `WHATSAPP_MESSAGES`).