# Cardápios — pasta de edição

Aqui moram os cardápios do **Paladares da Mantiqueira**: **um arquivo `.md` por experiência**. É a fonte única — o que você edita aqui é o que o site vai mostrar.

## Editar um cardápio
1. Abra o arquivo da experiência (ex.: `mesa-na-brasa.md`).
2. **Texto** (promessa, pratos, notas): edite à vontade abaixo do segundo `---`.
3. **Dados** (preço, nº de pessoas, sazonalidade): no topo, troque **só o valor** do campo. Ex.: `preco_por_pessoa: 195`.
4. Salve. Confira: os dois `---` continuam lá? Nomes com `:` estão entre "aspas"?

## Criar uma nova
1. Duplique `_MODELO.md`.
2. Renomeie com o *slug* (minúsculas, sem acento, com hífen): `mesa-de-celebracao.md`.
3. Preencha o topo e o corpo. Deixe `ativo: true` e defina a `ordem`.

## Ligar/desligar sem apagar
- `ativo: false` → a experiência some do site, mas o arquivo fica guardado.

## Regras de ouro
- Toda sobremesa é **"Doces pela Fernanda Marton Ateliê"**.
- Vocabulário de marca: **experiência, noite, mesa, celebração**. Na vitrine, nunca usar "porção, quilo, buffet, marmita, rodízio, coffee break" ou "evento corporativo". “Prato” pode ser usado naturalmente dentro da descrição culinária do cardápio, sem transformar a oferta em venda por unidade.
- No topo, troque **valores**; **não apague** os nomes dos campos nem os `---`.
- `camada`: `completa` (você cura e compra) · `servico` (Só o Serviço, cliente compra, mín. 3h) · `ambas`.

> Manual completo, comparação das 3 formas de editar e o porquê da escolha: [../08-GESTAO-DOS-CARDAPIOS.md](../08-GESTAO-DOS-CARDAPIOS.md).

## Experiências ativas hoje
| Ordem | Arquivo | Linha |
|---|---|---|
| 1 | `mesa-dos-chegados.md` | Íntima |
| 2 | `noite-de-fondue.md` | Íntima |
| 3 | `mesa-na-brasa.md` | Casa Cheia |
| 4 | `mesa-cheia-cantina.md` | Casa Cheia |
| 5 | `forno-e-quintal.md` | Casa Cheia |
| 6 | `origens-da-serra.md` | Celebração |
| 7 | `brunch-na-montanha.md` | Casa Cheia |
| 8 | `cafe-colonial-autoral.md` | Casa Cheia |
| 9 | `edicao-pinhao.md` | Celebração |
| 10 | `harmonizacao-guiada.md` | Celebração |
| 11 | `noite-do-hamburguer.md` | Casa Cheia |
| 12 | `noite-do-hot-dog.md` | Casa Cheia |
| 13 | `boteco-da-serra.md` | Casa Cheia |
| 14 | `feito-na-paella.md` | Casa Cheia |

## Rascunhos aguardando validação

| Arquivo | Porta | Falta validar |
|---|---|---|
| `feijoada-dos-chegados.md` | Casa Cheia | Nome público, cardápio/lista de compras, pessoas, duração, estrutura, equipe, antecedência e direitos das fotos; modalidade Só o Serviço já confirmada |

Rascunhos ficam com `ativo: false` e não entram no site até a validação do Rafael.
