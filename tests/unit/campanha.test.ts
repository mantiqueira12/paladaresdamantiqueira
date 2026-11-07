import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import CampaignNotice from '../../src/components/CampaignNotice';
import campanha from '../../src/data/campanha.json';

describe('campanha editorial', () => {
  it('pode ser retirada sem deixar uma janela ou aviso vazio', () => {
    expect(renderToStaticMarkup(createElement(CampaignNotice, { campanha: { ...campanha, ativa: false } }))).toBe('');
  });
  it('permite acessar Natal e Réveillon a partir da campanha na home', () => {
    const html = renderToStaticMarkup(createElement(CampaignNotice));
    expect(html).toContain('/jantar-de-natal-na-serra-da-mantiqueira/#menus');
    expect(html).toContain('/jantar-de-reveillon-na-serra-da-mantiqueira/#menus');
    expect(html).toContain('20/12');
    expect(html).toContain('27/12');
  });
});
