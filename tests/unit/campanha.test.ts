import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import CampaignNotice from '../../src/components/CampaignNotice';
import campanha from '../../src/data/campanha.json';

describe('campanha editorial', () => {
  it('pode ser retirada sem deixar uma janela ou aviso vazio', () => {
    expect(renderToStaticMarkup(createElement(CampaignNotice, { campanha: { ...campanha, ativa: false } }))).toBe('');
  });
});
