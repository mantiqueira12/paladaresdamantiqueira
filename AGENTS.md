# Orientação para Agentes — Paladares da Mantiqueira

Ponto de entrada de **qualquer agente** que trabalhe neste repositório. Leia isto primeiro; depois leia **somente** o necessário para a tarefa.

## 1. Por onde começar (ordem de leitura)

1. **`STATUS.md`** (raiz) — estado vivo do projeto: o que está no ar, o que está em andamento, a próxima ação. **Sempre comece por ele.**
2. **O arquivo de controle da sua frente de trabalho** (tabela abaixo).
3. Só então os arquivos de código/conteúdo da tarefa.

**Não releia o repositório inteiro.** Os arquivos de controle existem para isso.

## 2. Mapa dos arquivos de controle

| Arquivo | O que controla | Quando usar |
|---|---|---|
| `STATUS.md` | Estado vivo + log de sessões + próxima ação | Início e fim de TODA sessão |
| `docs/12-PLANO-CRESCIMENTO-E-LEADS.md` | **Plano-mestre de vendas/leads** em 3 fases com checkboxes e divisão Rafael×agente | Qualquer tarefa de marketing, conversão, GBP, Instagram, parcerias ou processo comercial |
| `docs/09-DECISOES-FECHADAS.md` | O placar: decisões fechadas (✅) e pendentes (⏳) | Antes de propor qualquer mudança de oferta/preço/política |
| `PLANEJAMENTO.md` | Histórico técnico do site + plano de lançamento (§7) | Tarefas de código/site; consultar o que já foi feito |
| `docs/README.md` | Índice do plano de negócio (docs 00–12) | Para localizar contexto de negócio |
| `docs/11-SEO-E-PRESENCA-DIGITAL.md` | Roteiro de SEO (blocos feitos e pendentes) | Tarefas de SEO/landings/performance |
| `docs/portfolio-receitas/README.md` | Portfólio de receitas e assistente operacional | Tarefas de fichas técnicas/cardápios operacionais |
| `docs/cardapios/` | Fichas comerciais das 13 experiências (1 .md por experiência) | Edição de cardápio comercial — ver doc 08 |

## 3. Regras invioláveis (decisões fechadas — não re-discutir)

- **Sem preço público no site**, exceto "Só o Serviço" (R$ 100/h, mín. 3h). Fechamento consultivo via WhatsApp (+55 12 99771-0040).
- **Eixo único:** celebração à mesa na casa de campo da Mantiqueira. 3 portas de ocasião (Íntima · Casa Cheia · Celebração) + Sob Medida opt-in. Técnica nunca vira card próprio.
- **Vocabulário proibido na vitrine:** buffet, rodízio, quilo, marmita, porção, coffee break, evento corporativo.
- **Sinal de 50% via Pix** trava a data. Deslocamento incluso até ~100 km (até São José dos Campos).
- Recusar trabalho que muda de eixo (marmita, quilo, corporativo de rotina).
- Não transformar `[PREMISSA]` em `[VALIDADO]` sem confirmação do Rafael.
- Não escolher stack nem implementar fase posterior antes do critério de pronto da etapa atual, salvo pedido explícito.
- Itens listados como **descartados/adiados** no doc 12 §5 não voltam sem dado novo.

## 4. Protocolo de encerramento de sessão (obrigatório)

Ao terminar qualquer tarefa:
1. **Atualizar `STATUS.md`:** marcar o que mudou, registrar a sessão no log (data · o que foi feito · próxima ação).
2. **Marcar checkboxes** no arquivo de controle da frente (ex.: doc 12) — nunca deixar o plano dessincronizado da realidade.
3. **Decisões novas do Rafael** → registrar no `docs/09-DECISOES-FECHADAS.md` (mover de ⏳ para ✅).
4. Se a tarefa era de código: rodar build antes de encerrar e anotar no STATUS se o deploy ficou pendente.

## 5. Divisão de trabalho Rafael × agentes

- 🧑‍🍳 **Rafael:** tudo que exige painel logado (GBP, GA4, Meta/Instagram, WhatsApp Business), telefone, conversa com cliente/parceiro, decisão de negócio.
- 🤖 **Agentes:** código, rebuild/deploy, documentos, textos/scripts prontos para o Rafael colar, planilhas-modelo, QA.
- Quando uma tarefa mistura os dois, o agente prepara TUDO que der (texto pronto, passo a passo numerado do painel) e deixa para o Rafael só a execução final.

## 6. Trabalho no portfólio de receitas ou assistente operacional

1. Comece por `docs/portfolio-receitas/README.md`.
2. Leia somente os arquivos indicados ali e os necessários para a tarefa.
3. Preserve a separação:
   - `docs/cardapios/` = apresentação comercial;
   - `docs/portfolio-receitas/receitas/` = fichas técnicas;
   - CRM GastroBSC = integração futura.

## 7. Economia de contexto

Não releia todo o repositório para continuar um trabalho. Use `STATUS.md` + o índice e a próxima ação registrados no arquivo de controle da frente. Prefira ler seções específicas (os docs têm cabeçalhos numerados) a arquivos inteiros.
