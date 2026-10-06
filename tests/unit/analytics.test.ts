import { afterEach, describe, expect, it, vi } from 'vitest';
import { rastrearOrcamento } from '../../src/lib/analytics';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('rastrearOrcamento', () => {
  it('dispara solicitar_orcamento no GA4 com origem e detalhes', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    rastrearOrcamento('formulario', 'Noite de Fondue', { ocasiao: 'Aniversário', cidade: 'Campos do Jordão', soServico: true });
    expect(gtag).toHaveBeenCalledTimes(1);
    const [comando, evento, params] = gtag.mock.calls[0];
    expect(comando).toBe('event');
    expect(evento).toBe('solicitar_orcamento');
    expect(params).toMatchObject({
      origem: 'formulario',
      experiencia: 'Noite de Fondue',
      ocasiao: 'Aniversário',
      cidade: 'Campos do Jordão',
      so_servico: true,
    });
  });

  it('marca "(nao_informada)" quando não há experiência escolhida', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    rastrearOrcamento('hero');
    expect(gtag.mock.calls[0][2]).toMatchObject({ origem: 'hero', experiencia: '(nao_informada)' });
  });

  it('não quebra quando o GA4 não carregou (bloqueador de anúncios)', () => {
    vi.stubGlobal('window', {});
    expect(() => rastrearOrcamento('rodape')).not.toThrow();
  });
});
