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
  origem: 'formulario' | 'botao_flutuante' | 'rodape' | 'header',
  experiencia?: string,
  detalhes?: DetalhesOrcamento,
): void {
  window.gtag?.('event', 'solicitar_orcamento', {
    origem,
    experiencia: experiencia || '(nao_informada)',
    ocasiao: detalhes?.ocasiao || undefined,
    cidade: detalhes?.cidade || undefined,
    pessoas: detalhes?.pessoas || undefined,
    so_servico: detalhes?.soServico || undefined,
  });
}
