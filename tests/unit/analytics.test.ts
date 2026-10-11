import { afterEach, describe, expect, it, vi } from 'vitest';
import { rastrearAberturaPedido, rastrearOrcamento, type OrigemOrcamento } from '../../src/lib/analytics';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('rastrearAberturaPedido', () => {
  it.each(['header', 'hero', 'texto_experiencias', 'pre_rodape', 'card_experiencia', 'rodape', 'landing_header', 'landing_hero', 'landing_band', 'landing_footer'] as OrigemOrcamento[])(
    'emite somente a origem permitida %s', (origem) => {
      const gtag = vi.fn();
      vi.stubGlobal('window', { gtag });
      rastrearAberturaPedido(origem);
      expect(gtag.mock.calls).toEqual([['event', 'abrir_formulario', { origem }]]);
    },
  );

  it('descarta origem livre e usa formulario', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    rastrearAberturaPedido('Nome Privado' as OrigemOrcamento);
    expect(gtag.mock.calls).toEqual([['event', 'abrir_formulario', { origem: 'formulario' }]]);
  });

  it('tolera SSR, coletor ausente e coletor que lança', () => {
    vi.stubGlobal('window', undefined);
    expect(() => rastrearAberturaPedido('header')).not.toThrow();
    vi.stubGlobal('window', {});
    expect(() => rastrearAberturaPedido('header')).not.toThrow();
    vi.stubGlobal('window', { gtag: () => { throw new Error('bloqueado'); } });
    expect(() => rastrearAberturaPedido('header')).not.toThrow();
  });
});

it.each(['landing_header', 'landing_hero', 'landing_band', 'landing_footer'] as OrigemOrcamento[])(
  'preserva %s no evento final', (origem) => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    rastrearOrcamento(origem);
    expect(gtag.mock.calls[0][2].origem).toBe(origem);
  },
);

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
