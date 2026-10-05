import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const index = fs.readFileSync(path.resolve(import.meta.dirname, '..', 'index.html'), 'utf8');
const analyticsScript = [...index.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .find((source) => source.includes('G-42VSMJHHFD'));

function execute(location) {
  const appended = [];
  const sandbox = {
    window: { location },
    document: { createElement: () => ({}), head: { append: (node) => appended.push(node) } },
  };
  vm.runInNewContext(analyticsScript, sandbox);
  return { appended, window: sandbox.window };
}

test('home não inicializa GA4 em localhost', () => {
  const result = execute({ hostname: 'localhost', origin: 'http://localhost:3000', pathname: '/', search: '?texto=livre' });
  assert.deepEqual(result.appended, []);
  assert.equal(result.window.dataLayer, undefined);
});

test('home envia page_location sem query livre em produção', () => {
  const result = execute({
    hostname: 'paladaresdamantiqueira.com.br',
    origin: 'https://paladaresdamantiqueira.com.br',
    pathname: '/',
    search: '?texto=livre',
    hash: '#pedido',
  });
  assert.equal(result.appended.length, 1);
  assert.equal(result.appended[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-42VSMJHHFD');
  const config = Array.from(result.window.dataLayer[1]);
  assert.equal(config[0], 'config');
  assert.equal(config[2].page_location, 'https://paladaresdamantiqueira.com.br/');
});
