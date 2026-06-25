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
