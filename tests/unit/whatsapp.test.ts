import { describe, expect, it } from 'vitest';
import {
  GOOGLE_REVIEW_LINK,
  linkWhatsApp,
  linkWhatsAppTexto,
  mensagemAvaliacaoGoogle,
  montarMensagem,
  WHATSAPP_NUMBER,
} from '../../src/lib/whatsapp';

describe('montarMensagem', () => {
  it('sem dados, cumprimenta e pergunta o próximo passo', () => {
    const msg = montarMensagem({});
    expect(msg).toContain('Olá, Chef Rafael!');
    expect(msg).toContain('ainda estou escolhendo');
    expect(msg).toContain('próximo passo');
  });

  it('inclui nome, experiência e detalhes com a data em formato brasileiro', () => {
    const msg = montarMensagem({
      nome: 'Ana',
      experiencia: 'Noite de Fondue',
      ocasiao: 'Aniversário',
      pessoas: '8 a 12 pessoas',
      data: '2026-10-24',
      cidade: 'Campos do Jordão',
    });
    expect(msg).toContain('Aqui é Ana');
    expect(msg).toContain('*Noite de Fondue*');
    expect(msg).toContain('• Ocasião: Aniversário');
    expect(msg).toContain('• Convidados: 8 a 12 pessoas');
    expect(msg).toContain('• Data desejada: 24/10/2026');
    expect(msg).toContain('• Local: Campos do Jordão');
  });

  it('só menciona "Só o Serviço" quando o cliente escolheu esse formato', () => {
    expect(montarMensagem({ soServico: true })).toContain('Só o Serviço');
    expect(montarMensagem({ soServico: false })).not.toContain('Só o Serviço');
  });

  it('nunca cita preço (o valor nasce na conversa)', () => {
    const msg = montarMensagem({ experiencia: 'Feito na Brasa', pessoas: '13 a 20 pessoas' });
    expect(msg).not.toMatch(/R\$/);
  });
});

describe('links do WhatsApp', () => {
  it('apontam para o número do chef e codificam o texto', () => {
    const link = linkWhatsApp({ experiencia: 'Brunch na Montanha', nome: 'João & Maria' });
    expect(link.startsWith(`https://wa.me/${WHATSAPP_NUMBER}?text=`)).toBe(true);
    const texto = decodeURIComponent(link.split('?text=')[1]);
    expect(texto).toContain('João & Maria');
    expect(texto).toContain('*Brunch na Montanha*');
  });

  it('linkWhatsAppTexto preserva o texto livre', () => {
    const link = linkWhatsAppTexto('Oi, Chef! Quero saber mais.');
    expect(decodeURIComponent(link.split('?text=')[1])).toBe('Oi, Chef! Quero saber mais.');
  });

  it('o número é o oficial (+55 12 99771-0040)', () => {
    expect(WHATSAPP_NUMBER).toBe('5512997710040');
  });
});

describe('mensagemAvaliacaoGoogle', () => {
  it('personaliza a abertura mas mantém o pedido neutro', () => {
    const msg = mensagemAvaliacaoGoogle({ nome: 'Roberto', ocasiao: 'almoço', cidade: 'Santo Antônio do Pinhal' });
    expect(msg).toContain('Olá, Roberto!');
    expect(msg).toContain('o seu almoço em Santo Antônio do Pinhal');
    expect(msg).toContain(GOOGLE_REVIEW_LINK);
    expect(msg).toContain('avaliação sincera');
    // não sugere nota nem palavras-chave
    expect(msg).not.toMatch(/5 estrelas|cinco estrelas|nota 10|melhor chef/i);
  });

  it('funciona sem contexto', () => {
    const msg = mensagemAvaliacaoGoogle();
    expect(msg).toContain('Olá! 🌿');
    expect(msg).toContain('a sua experiência');
  });
});
