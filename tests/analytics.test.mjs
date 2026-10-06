import assert from 'node:assert/strict';
import test from 'node:test';
import { importTypeScript } from './import-typescript.mjs';

const { rastrearOrcamento } = await importTypeScript('../src/lib/analytics.ts', import.meta.url);

test('rastrearOrcamento envia somente valores conhecidos e nunca texto livre ou PII', () => {
  const chamadas = [];
  globalThis.window = { gtag: (...args) => chamadas.push(args) };
  const cidadeLivre = 'Rua Particular 123, Casa da Ana';

  rastrearOrcamento('landing', 'Menu secreto da Ana', {
    ocasiao: 'Festa da Ana',
    cidade: cidadeLivre,
    pessoas: '37 pessoas',
    pagina: 'https://site.test/pedido?nome=Ana',
    soServico: false,
  });

  assert.equal(chamadas.length, 1);
  const [comando, evento, payload] = chamadas[0];
  assert.equal(comando, 'event');
  assert.equal(evento, 'solicitar_orcamento');
  assert.deepEqual(payload, {
    origem: 'landing',
    experiencia: '(outra)',
    ocasiao: '(outra)',
    cidade: '(outra)',
    pessoas: '(outra)',
    so_servico: false,
    pagina: undefined,
  });
  assert.equal(JSON.stringify(payload).includes(cidadeLivre), false);
  assert.equal(JSON.stringify(payload).includes('Ana'), false);
  delete globalThis.window;
});

test('rastrearOrcamento preserva experiência, cidade, faixa, ocasião e slug permitidos', () => {
  let chamada;
  globalThis.window = { gtag: (...args) => (chamada = args) };

  rastrearOrcamento('hero', 'Origens da Serra', {
    ocasiao: 'Bodas / casamento',
    cidade: 'Campos do Jordão',
    pessoas: '8 a 12 pessoas',
    pagina: 'chef-particular-em-campos-do-jordao',
    soServico: true,
  });

  assert.deepEqual(chamada, [
    'event',
    'solicitar_orcamento',
    {
      origem: 'hero',
      experiencia: 'Origens da Serra',
      ocasiao: 'Bodas / casamento',
      cidade: 'Campos do Jordão',
      pessoas: '8 a 12 pessoas',
      so_servico: true,
      pagina: 'chef-particular-em-campos-do-jordao',
    },
  ]);
  delete globalThis.window;
});

test('rastrearOrcamento tolera ambiente sem gtag e erros do coletor', () => {
  globalThis.window = {};
  assert.doesNotThrow(() => rastrearOrcamento('formulario'));

  globalThis.window = {
    gtag: () => {
      throw new Error('bloqueado');
    },
  };
  assert.doesNotThrow(() => rastrearOrcamento('rodape', 'Noite de Fondue'));
  delete globalThis.window;
});
