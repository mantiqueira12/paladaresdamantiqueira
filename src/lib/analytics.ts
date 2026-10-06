/**
 * Disparo de eventos para o Google Analytics 4 (gtag).
 * O snippet do GA é carregado no index.html; aqui só empurramos eventos.
 */

type GtagEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: 'event', action: string, params?: GtagEventParams) => void;
  }
}

/** Detalhes opcionais do pedido, úteis para entender o que mais converte. */
export interface DetalhesOrcamento {
  ocasiao?: string;
  cidade?: string;
  pessoas?: string;
  soServico?: boolean;
  pagina?: string;
}

/** De onde partiu o pedido — vira o parâmetro `origem` no GA4. */
export type OrigemOrcamento =
  | 'header'
  | 'hero'
  | 'texto_experiencias'
  | 'pre_rodape'
  | 'card_experiencia'
  | 'rodape'
  | 'landing'
  | 'formulario';

const ORIGENS = new Set<OrigemOrcamento>([
  'header',
  'hero',
  'texto_experiencias',
  'pre_rodape',
  'card_experiencia',
  'rodape',
  'landing',
  'formulario',
]);

const EXPERIENCIAS = new Set([
  'Entre Amigos',
  'Noite de Fondue',
  'Feito na Brasa',
  'Pasta à Mesa',
  'Viva la Pizza',
  'Origens da Serra',
  'Brunch na Montanha',
  'Café Colonial Autoral',
  'Mesa de Inverno — Edição Pinhão',
  'Harmonização Guiada',
  'Noite do Hambúrguer',
  'Noite do Hot Dog',
  'Boteco da Serra',
  'Feito na Paella',
]);

const CIDADES = new Set([
  'Campos do Jordão',
  'Santo Antônio do Pinhal',
  'São Bento do Sapucaí',
  'Monte Verde',
  'Gonçalves',
  'São José dos Campos',
]);

const FAIXAS = new Set(['2 a 7 pessoas', '8 a 12 pessoas', '13 a 20 pessoas', 'Mais de 20 pessoas']);
const OCASIOES = new Set([
  'Aniversário',
  'Bodas / casamento',
  'Pedido de casamento',
  'Encontro a dois',
  'Reunião de família',
  'Confraternização',
  'Réveillon na serra',
  'Outra ocasião',
]);
const PAGINAS = new Set([
  'chef-particular-em-campos-do-jordao',
  'chef-particular-em-santo-antonio-do-pinhal',
  'chef-particular-em-sao-bento-do-sapucai',
  'chef-particular-em-monte-verde',
  'chef-particular-em-goncalves',
  'chef-particular-em-sao-jose-dos-campos',
  'jantar-de-bodas-e-pedido-de-casamento-na-serra-da-mantiqueira',
  'chef-para-pousadas-e-casas-de-temporada-na-serra-da-mantiqueira',
  'personal-chef-na-serra-da-mantiqueira',
  'chef-para-casamento-e-mini-wedding-na-serra-da-mantiqueira',
  'chef-para-aniversario-na-serra-da-mantiqueira',
  'jantar-de-reveillon-na-serra-da-mantiqueira',
  'jantar-de-inverno-e-fondue-na-serra-da-mantiqueira',
  'jantar-romantico-na-serra-da-mantiqueira',
]);

function categoria(valor: string | undefined, permitidos: ReadonlySet<string>): string | undefined {
  if (!valor) return undefined;
  return permitidos.has(valor) ? valor : '(outra)';
}

/**
 * Evento-chave do negócio: alguém pediu um orçamento (abriu o WhatsApp do chef).
 * Marque `solicitar_orcamento` como Conversão no Google Analytics.
 *
 * @param origem de onde partiu o clique (ajuda a saber o que converte mais)
 * @param experiencia nome da experiência escolhida, quando houver
 * @param detalhes ocasião, cidade, nº de convidados e formato — preenchidos no formulário
 */
export function rastrearOrcamento(
  origem: OrigemOrcamento,
  experiencia?: string,
  detalhes?: DetalhesOrcamento,
): void {
  if (typeof window === 'undefined') return;
  try {
    const gtag = window.gtag;
    if (typeof gtag !== 'function') return;
    gtag('event', 'solicitar_orcamento', {
      origem: ORIGENS.has(origem) ? origem : 'formulario',
      experiencia: experiencia ? categoria(experiencia, EXPERIENCIAS) : '(nao_informada)',
      ocasiao: categoria(detalhes?.ocasiao, OCASIOES),
      cidade: categoria(detalhes?.cidade, CIDADES),
      pessoas: categoria(detalhes?.pessoas, FAIXAS),
      so_servico: typeof detalhes?.soServico === 'boolean' ? detalhes.soServico : undefined,
      pagina: detalhes?.pagina && PAGINAS.has(detalhes.pagina) ? detalhes.pagina : undefined,
    });
  } catch {
    // Bloqueadores, extensões e políticas de privacidade podem interromper o GA.
    // A ação principal (abrir o WhatsApp) não depende da telemetria.
  }
}
