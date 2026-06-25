/**
 * Camada tipada do catálogo. Lê src/data/experiencias.json (gerado das fichas
 * em docs/cardapios/ via `npm run gen:cardapios`) e acrescenta a imagem de capa.
 *
 * FONTE ÚNICA: para mudar um cardápio, edite a ficha em docs/cardapios/ e rode
 * `npm run gen:cardapios`. Não edite o .json à mão.
 */
import raw from './experiencias.json';
import { IMAGENS, IMAGEM_FALLBACK } from './imagens';

export type ItemCardapio = { nome: string; desc: string };
export type TempoCardapio = { titulo: string; itens: ItemCardapio[] };
export type Camada = 'completa' | 'servico' | 'ambas';
export type Linha = 'Íntima' | 'Casa Cheia' | 'Celebração' | 'Express' | 'Corporativo';
export type Destaque = 'lancamento' | 'novidade' | 'expansao';

export interface Experiencia {
  slug: string;
  nome: string;
  linha: Linha;
  ocasioes: string[];
  pessoasMin: number | null;
  pessoasMax: number | null;
  duracaoHoras: number | null;
  sazonalidade: string;
  camada: Camada;
  destaque: Destaque;
  ativo: boolean;
  ordem: number;
  sobremesasPor: string;
  dieteticas: string[];
  extrasRecomendados: string[];
  promessa: string;
  inclui: string;
  exclui: string;
  cardapio: TempoCardapio[];
  imagem: string;
}

export const EXPERIENCIAS: Experiencia[] = (raw as Omit<Experiencia, 'imagem'>[])
  .map((e) => ({ ...e, imagem: IMAGENS[e.slug] ?? IMAGEM_FALLBACK }))
  .sort((a, b) => a.ordem - b.ordem);

/** As "portas de ocasião" — o eixo de navegação do catálogo. */
export interface Porta {
  key: Linha;
  rotulo: string;
  chamada: string;
  descricao: string;
}

export const PORTAS: Porta[] = [
  {
    key: 'Íntima',
    rotulo: 'Só os mais chegados',
    chamada: 'Momentos íntimos',
    descricao: 'Jantares acolhedores, com tempo e cuidado, para quem você ama de perto.',
  },
  {
    key: 'Casa Cheia',
    rotulo: 'Casa cheia',
    chamada: 'Reunir e celebrar',
    descricao: 'A casa lotada, a mesa farta e a alegria no comando — você só aproveita.',
  },
  {
    key: 'Celebração',
    rotulo: 'Grandes celebrações',
    chamada: 'Marcos e datas especiais',
    descricao: 'Bodas, pedidos e marcos da vida com a sofisticação de um restaurante premiado.',
  },
  {
    key: 'Express',
    rotulo: 'Noites descontraídas',
    chamada: 'Leve e divertido',
    descricao: 'O chef no comando, você cuida dos insumos. Sabor de chef, clima de festa.',
  },
  {
    key: 'Corporativo',
    rotulo: 'Corporativo',
    chamada: 'Para empresas',
    descricao: 'Coffee breaks, almoços executivos e confraternizações com a assinatura do chef para o seu time.',
  },
];

export const LINHAS: Linha[] = ['Íntima', 'Casa Cheia', 'Celebração', 'Express', 'Corporativo'];

export const porta = (key: Linha) => PORTAS.find((p) => p.key === key)!;

export const experienciasPorLinha = (linha: Linha) =>
  EXPERIENCIAS.filter((e) => e.linha === linha);

export const acharPorNome = (nome: string) =>
  EXPERIENCIAS.find((e) => e.nome === nome);

export function pessoasLabel(e: Experiencia): string {
  if (e.pessoasMin && e.pessoasMax) return `${e.pessoasMin} a ${e.pessoasMax} pessoas`;
  if (e.pessoasMin) return `a partir de ${e.pessoasMin} pessoas`;
  return '';
}

export function duracaoLabel(e: Experiencia): string {
  return e.duracaoHoras ? `~${e.duracaoHoras}h` : '';
}
