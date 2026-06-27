/**
 * Fechamento elegante: monta a mensagem personalizada e o link do WhatsApp
 * para o Chef Rafael (+55 12 99771-0040). Sem preço — o valor nasce na conversa.
 */
export const WHATSAPP_NUMBER = '5512997710040';
export const WHATSAPP_DISPLAY = '+55 12 99771-0040';

export interface PedidoData {
  experiencia?: string; // nome da experiência, ou vazio = "ainda não sei"
  data?: string; // ISO yyyy-mm-dd
  pessoas?: string; // faixa escolhida
  ocasiao?: string;
  cidade?: string;
  nome?: string;
  soServico?: boolean; // cliente quer a camada "Só o Serviço"
}

function dataBR(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

/** Monta a mensagem humana e calorosa que cai no WhatsApp do chef. */
export function montarMensagem(p: PedidoData): string {
  const blocos: string[] = [];

  blocos.push(p.nome ? `Olá, Chef Rafael! Aqui é ${p.nome}. 🌿` : 'Olá, Chef Rafael! 🌿');

  if (p.experiencia) {
    blocos.push(`Gostaria de solicitar a experiência *${p.experiencia}*.`);
  } else {
    blocos.push(
      'Gostaria de planejar uma experiência com você — ainda estou escolhendo qual combina mais com o momento.',
    );
  }

  const det: string[] = [];
  if (p.ocasiao) det.push(`• Ocasião: ${p.ocasiao}`);
  if (p.pessoas) det.push(`• Convidados: ${p.pessoas}`);
  if (p.data) det.push(`• Data desejada: ${dataBR(p.data)}`);
  if (p.cidade) det.push(`• Local: ${p.cidade}`);
  if (det.length) blocos.push(det.join('\n'));

  if (p.soServico) {
    blocos.push('Tenho interesse no formato *Só o Serviço* — eu cuido dos insumos e você assume o comando da cozinha.');
  }

  blocos.push('Pode me contar como funciona e os próximos passos?');

  return blocos.join('\n\n');
}

export function linkWhatsApp(p: PedidoData): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(montarMensagem(p))}`;
}

/** Link com um texto livre (CTAs genéricos). */
export function linkWhatsAppTexto(texto: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}

/**
 * Link curto de avaliação do Google Business Profile.
 * Pegue no painel do GBP (botão "Ask for reviews" / "Get more reviews") — tem o
 * formato https://g.page/r/XXXXXXXX/review — e cole aqui.
 */
export const GOOGLE_REVIEW_LINK = 'https://search.google.com/local/writereview?placeid=ChIJzXUll8iJzJQR2SJ60hPQGyk';

/**
 * Mensagem de agradecimento + pedido de avaliação no Google para enviar ao
 * cliente no dia seguinte à experiência (D+1). O chef copia e envia no WhatsApp.
 * Uma avaliação que cita a ocasião e a cidade vira sinal de relevância local.
 */
export function mensagemAvaliacaoGoogle(p: { nome?: string; ocasiao?: string; cidade?: string } = {}): string {
  const saudacao = p.nome ? `Olá, ${p.nome}! 🌿` : 'Olá! 🌿';
  const noite = p.ocasiao ? `o seu ${p.ocasiao}` : 'a sua experiência';
  const local = p.cidade ? ` em ${p.cidade}` : '';
  const pedido = GOOGLE_REVIEW_LINK
    ? `Se a noite foi especial pra você, uma avaliação no Google ajuda demais o nosso trabalho a chegar a mais pessoas: ${GOOGLE_REVIEW_LINK}`
    : 'Se a noite foi especial pra você, uma avaliação no Google ajuda demais o nosso trabalho a chegar a mais pessoas.';
  return [`${saudacao} Foi uma alegria preparar ${noite}${local}.`, pedido, 'Um abraço, Chef Rafael.'].join('\n\n');
}
