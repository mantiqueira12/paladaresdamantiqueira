import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { verifyBuild } from '../scripts/verify-build.mjs';

const SITE = 'https://paladaresdamantiqueira.com.br';
const verifyFixture = (dist, options = {}) =>
  verifyBuild({ dist, approvedSlugs: ['landing'], sourceSlugs: ['landing'], ...options });

function page({ canonical, link = '/', asset = '/logo.png?v=2#cache' }) {
  return `<!doctype html><html><head>
    <meta name="description" content="Descrição suficiente" />
    <link rel="canonical" href="${canonical}" />
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage"}</script>
  </head><body><main><h1>Título único</h1><a href="${link}">Link</a><img src="${asset}" alt="" /></main></body></html>`;
}

function validFixture() {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'paladares-verify-'));
  fs.mkdirSync(path.join(dist, 'landing'));
  fs.writeFileSync(path.join(dist, 'logo.png'), 'fake');
  fs.writeFileSync(
    path.join(dist, 'index.html'),
    page({ canonical: `${SITE}/`, link: '/landing/?pedido=1#form' }).replace(
      '<body>',
      '<body><noscript><p>Contato</p><a href="https://wa.me/5512997710040">WhatsApp</a><a href="tel:+5512997710040">Telefone</a></noscript><div id="root" data-prerendered="true"></div>',
    ),
  );
  fs.writeFileSync(path.join(dist, 'landing', 'index.html'), page({ canonical: `${SITE}/landing/`, link: '/?origem=landing#experiencias' }));
  fs.writeFileSync(path.join(dist, '404.html'), '<!doctype html><meta name="robots" content="noindex"><h1>Não encontrada</h1>');
  fs.writeFileSync(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0"?><urlset><url><loc>${SITE}/</loc></url><url><loc>${SITE}/landing/</loc></url></urlset>`,
  );
  return dist;
}

test('verificador aceita links e assets locais depois de remover query e hash', () => {
  const dist = validFixture();
  try {
    assert.doesNotThrow(() => verifyFixture(dist));
  } finally {
    fs.rmSync(dist, { recursive: true, force: true });
  }
});

test('verificador denuncia canonical enganoso da 404 e recurso inexistente', () => {
  const dist = validFixture();
  try {
    fs.writeFileSync(
      path.join(dist, '404.html'),
      `<meta name="robots" content="noindex"><link rel="canonical" href="${SITE}/"><h1>Não encontrada</h1>`,
    );
    fs.writeFileSync(path.join(dist, 'landing', 'index.html'), page({ canonical: `${SITE}/landing/`, asset: '/ausente.png' }));

    assert.throws(
      () => verifyFixture(dist),
      (error) => /404.+canonical/i.test(error.message) && /ausente\.png/.test(error.message),
    );
  } finally {
    fs.rmSync(dist, { recursive: true, force: true });
  }
});

test('verificador exige contato por WhatsApp e telefone sem JavaScript na home', () => {
  const dist = validFixture();
  try {
    const homePath = path.join(dist, 'index.html');
    const home = fs.readFileSync(homePath, 'utf8').replace(/<noscript>[\s\S]*?<\/noscript>/, '');
    fs.writeFileSync(homePath, home);

    assert.throws(() => verifyFixture(dist), /noscript.+WhatsApp.+telefone/i);
  } finally {
    fs.rmSync(dist, { recursive: true, force: true });
  }
});

test('verificador ancora adição, remoção e rename das rotas na lista aprovada', () => {
  const cases = [
    { name: 'adição', sourceSlugs: ['landing', 'nova'] },
    { name: 'remoção', sourceSlugs: [] },
    { name: 'rename', sourceSlugs: ['landing-renomeada'] },
  ];
  for (const item of cases) {
    const dist = validFixture();
    try {
      assert.throws(
        () => verifyFixture(dist, { sourceSlugs: item.sourceSlugs }),
        /fontes.+rotas aprovadas/i,
        item.name,
      );
    } finally {
      fs.rmSync(dist, { recursive: true, force: true });
    }
  }
});

test('verificador rejeita noindex ou none na home e nas landings aprovadas', () => {
  const cases = [
    { file: 'index.html', directive: 'noindex,follow' },
    { file: path.join('landing', 'index.html'), directive: 'none' },
  ];
  for (const item of cases) {
    const dist = validFixture();
    try {
      const file = path.join(dist, item.file);
      const html = fs.readFileSync(file, 'utf8').replace('<head>', `<head><meta name="robots" content="${item.directive}">`);
      fs.writeFileSync(file, html);
      assert.throws(() => verifyFixture(dist), /não pode conter robots.+(?:noindex|none)/i);
    } finally {
      fs.rmSync(dist, { recursive: true, force: true });
    }
  }
});

test('verificador rejeita separador codificado que escaparia de dist', () => {
  const dist = validFixture();
  const outsideName = `${path.basename(dist)}-outside.txt`;
  const outside = path.join(dist, '..', outsideName);
  try {
    fs.writeFileSync(outside, 'não publicado');
    fs.writeFileSync(
      path.join(dist, 'landing', 'index.html'),
      page({ canonical: `${SITE}/landing/`, link: `/..%2f${outsideName}` }),
    );

    assert.throws(() => verifyFixture(dist), /URL inválida.+escapa de dist/i);
  } finally {
    fs.rmSync(outside, { force: true });
    fs.rmSync(dist, { recursive: true, force: true });
  }
});
