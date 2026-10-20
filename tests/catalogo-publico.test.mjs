import assert from 'node:assert/strict';
import test from 'node:test';
import { contextoDoCatalogo, renderCatalogo } from '../scripts/catalogo-publico.mjs';

const ficha = {
  slug: 'menu-real', nome: 'Menu da casa', camada: 'ambas', promessa: 'Uma mesa para reunir.',
  preco_por_pessoa: 999, notas: 'INTERNO_PRIVADO', dieteticas: ['DADO_NAO_PROJETADO'],
  cardapio: [{ titulo: 'Principais', itens: [{ nome: 'Peixe <da casa>', desc: 'Com **ervas** e limão.' }] }],
};

test('catálogo gera HTML e texto da mesma ficha, sem campos internos e com escape', () => {
  const result = renderCatalogo([ficha, { ...ficha, slug: 'rascunho', ativo: false }]);
  assert.match(result.html, /id="menu-real"/);
  assert.match(result.html, /Peixe &lt;da casa&gt;/);
  assert.match(result.markdown, /Peixe &lt;da casa&gt;/);
  assert.match(result.html, /Com ervas e limão/);
  assert.match(result.html, /Só o Serviço/);
  assert.match(result.html, /tel:\+5512997710040/);
  assert.match(result.html, /rel="canonical" href="https:\/\/paladaresdamantiqueira.com.br\/cardapios\/"/);
  for (const text of [result.html, result.markdown]) {
    for (const forbidden of ['INTERNO_PRIVADO', 'DADO_NAO_PROJETADO', '999', 'rascunho', '**ervas**']) {
      assert.ok(!text.includes(forbidden), forbidden);
    }
  }
  const changed = renderCatalogo([{ ...ficha, nome: 'Nome atualizado' }]);
  assert.match(changed.html, /Nome atualizado/);
  assert.match(changed.markdown, /Nome atualizado/);
});

test('catálogo rejeita âncoras inseguras e duplicadas', () => {
  assert.throws(() => renderCatalogo([{ ...ficha, slug: '../escape' }]), /slug/i);
  assert.throws(() => renderCatalogo([ficha, ficha]), /duplicado/i);
});

test('contexto do catálogo projeta só campos públicos da página conhecida', () => {
  const contextos = [{ pagina: 'pagina-conhecida', cidade: 'Campos do Jordão', ocasiao: 'Natal na serra', experiencia: 'Escolha anterior', nome: 'TEXTO_PRIVADO' }];
  assert.deepEqual(Object.fromEntries(contextoDoCatalogo('pagina-conhecida', contextos)), {
    pagina: 'pagina-conhecida', cidade: 'Campos do Jordão', ocasiao: 'Natal na serra',
  });
  assert.equal(contextoDoCatalogo('pagina-adulterada', contextos).toString(), '');
  assert.equal(contextoDoCatalogo(null, contextos).toString(), '');
  const html = renderCatalogo([ficha], { contextos }).html;
  assert.ok(!html.includes('TEXTO_PRIVADO'));
  assert.ok(!html.includes('Escolha anterior'));
});
