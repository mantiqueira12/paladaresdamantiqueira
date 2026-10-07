import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const projectRoot = path.resolve(import.meta.dirname, '..');

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'paladares-static-'));
  fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(root, 'src', 'data'), { recursive: true });
  fs.mkdirSync(path.join(root, 'public'), { recursive: true });
  fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
  fs.copyFileSync(path.join(projectRoot, 'scripts', 'gen-landings.mjs'), path.join(root, 'scripts', 'gen-landings.mjs'));
  for (const name of ['cidades.json', 'sazonais.json', 'nichos.json', 'faq.json', 'tokens.json']) {
    fs.copyFileSync(path.join(projectRoot, 'src', 'data', name), path.join(root, 'src', 'data', name));
  }
  fs.copyFileSync(path.join(projectRoot, 'public', 'llms.txt'), path.join(root, 'public', 'llms.txt'));
  fs.writeFileSync(
    path.join(root, 'dist', 'index.html'),
    '<!doctype html><html><body><div id="root" data-prerendered="true"><main><h1>Home pronta</h1></main></div></body></html>',
  );
  return root;
}

function runGenerator(root) {
  return spawnSync(process.execPath, [path.join(root, 'scripts', 'gen-landings.mjs')], {
    cwd: root,
    encoding: 'utf8',
  });
}

function cleanup(root) {
  fs.rmSync(root, { recursive: true, force: true });
}

test('gen-landings aborta antes de escrever quando um slug está duplicado', () => {
  const root = fixture();
  try {
    const cidadesPath = path.join(root, 'src', 'data', 'cidades.json');
    const nichosPath = path.join(root, 'src', 'data', 'nichos.json');
    const cidades = JSON.parse(fs.readFileSync(cidadesPath, 'utf8'));
    const nichos = JSON.parse(fs.readFileSync(nichosPath, 'utf8'));
    nichos[0].slug = cidades[0].slug;
    fs.writeFileSync(nichosPath, JSON.stringify(nichos));

    const result = runGenerator(root);

    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stderr, /slug.+duplicado/i);
    assert.equal(fs.existsSync(path.join(root, 'dist', cidades[0].slug)), false);
  } finally {
    cleanup(root);
  }
});

test('gen-landings recusa home que ainda não foi pré-renderizada', () => {
  const root = fixture();
  try {
    fs.writeFileSync(path.join(root, 'dist', 'index.html'), '<!doctype html><div id="root"></div>');

    const result = runGenerator(root);

    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stderr, /home.+pré-renderizada/i);
    assert.equal(fs.existsSync(path.join(root, 'dist', 'chef-particular-em-campos-do-jordao')), false);
  } finally {
    cleanup(root);
  }
});

test('gen-landings rejeita slug que poderia escapar do diretório dist', () => {
  const root = fixture();
  try {
    const cidadesPath = path.join(root, 'src', 'data', 'cidades.json');
    const cidades = JSON.parse(fs.readFileSync(cidadesPath, 'utf8'));
    cidades[0].slug = '../escape';
    fs.writeFileSync(cidadesPath, JSON.stringify(cidades));

    const result = runGenerator(root);

    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stderr, /slug.+inseguro/i);
    assert.equal(fs.existsSync(path.join(root, 'escape')), false);
  } finally {
    cleanup(root);
  }
});

test('landings geradas oferecem navegação por teclado, movimento reduzido e analytics sem localhost', () => {
  const root = fixture();
  try {
    const result = runGenerator(root);
    assert.equal(result.status, 0, result.stderr);
    const html = fs.readFileSync(path.join(root, 'dist', 'chef-particular-em-campos-do-jordao', 'index.html'), 'utf8');

    assert.match(html, /href="#conteudo"[^>]*>Pular para o conteúdo/);
    assert.match(html, /<main id="conteudo" tabindex="-1">/);
    assert.match(html, /<a class="brand" href="\/" aria-label="Paladares da Mantiqueira — Concierge Gastronômico">[\s\S]*?<img src="\/logo-emblema\.png" alt=""/);
    assert.match(html, /<b>Paladares da Mantiqueira<\/b> <small>Concierge Gastronômico/);
    const notFoundHtml = fs.readFileSync(path.join(root, 'dist', '404.html'), 'utf8');
    assert.match(notFoundHtml, /<main id="conteudo" tabindex="-1">/);
    assert.match(html, /:focus-visible/);
    assert.match(html, /prefers-reduced-motion:\s*reduce/);
    assert.doesNotMatch(html, /<script async src="https:\/\/www\.googletagmanager\.com/);

    const analyticsScript = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
      .map((match) => match[1])
      .find((source) => source.includes('G-42VSMJHHFD'));
    assert.ok(analyticsScript, 'script do GA4 não encontrado');

    const appended = [];
    vm.runInNewContext(analyticsScript, {
      window: { location: { hostname: 'localhost', origin: 'http://localhost:3000', pathname: '/', search: '?mensagem=privada' } },
      document: { createElement: () => ({}), head: { append: (node) => appended.push(node) } },
    });
    assert.deepEqual(appended, []);

    const production = {
      window: {
        location: {
          hostname: 'paladaresdamantiqueira.com.br',
          origin: 'https://paladaresdamantiqueira.com.br',
          pathname: '/chef-particular-em-campos-do-jordao/',
          search: '?mensagem=privada',
        },
      },
      document: { createElement: () => ({}), head: { append() {} } },
    };
    vm.runInNewContext(analyticsScript, production);
    const config = Array.from(production.window.dataLayer[1]);
    assert.equal(config[2].page_location, 'https://paladaresdamantiqueira.com.br/chef-particular-em-campos-do-jordao/');
  } finally {
    cleanup(root);
  }
});

test('404 gerada é noindex e não declara a home como canonical', () => {
  const root = fixture();
  try {
    const result = runGenerator(root);
    assert.equal(result.status, 0, result.stderr);
    const html = fs.readFileSync(path.join(root, 'dist', '404.html'), 'utf8');
    assert.match(html, /<meta name="robots" content="noindex"/);
    assert.doesNotMatch(html, /rel="canonical"/);
  } finally {
    cleanup(root);
  }
});

test('rótulo da seção do chef usa a terracota clara com contraste sobre o fundo escuro', () => {
  const root = fixture();
  try {
    const result = runGenerator(root);
    assert.equal(result.status, 0, result.stderr);
    const html = fs.readFileSync(path.join(root, 'dist', 'chef-particular-em-campos-do-jordao', 'index.html'), 'utf8');

    assert.match(html, /\.chef \.eyebrow-dark\{color:var\(--terracotta-light\)\}/);
    assert.match(html, /<span class="eyebrow-dark">O Anfitrião<\/span>/);
    assert.doesNotMatch(html, /<span class="eyebrow-dark" style=/);
  } finally {
    cleanup(root);
  }
});

test('falha ao ler llms.txt encerra a geração com erro', () => {
  const root = fixture();
  try {
    fs.rmSync(path.join(root, 'public', 'llms.txt'));
    const result = runGenerator(root);
    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stderr, /llms\.txt/);
  } finally {
    cleanup(root);
  }
});

test('prerender preserva sequências especiais do HTML renderizado literalmente', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'paladares-prerender-'));
  try {
    fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
    fs.mkdirSync(path.join(root, 'dist', 'server'), { recursive: true });
    fs.copyFileSync(path.join(projectRoot, 'scripts', 'prerender.mjs'), path.join(root, 'scripts', 'prerender.mjs'));
    fs.writeFileSync(
      path.join(root, 'dist', 'index.html'),
      '<!doctype html><html><body><div id="root"><p>fallback</p></div>\n</body></html>',
    );
    const literal = '$&|$1|R$100/h';
    const appHtml = `<main><h1>${literal}</h1><p>${'conteudo '.repeat(700)}</p></main>`;
    fs.writeFileSync(path.join(root, 'dist', 'server', 'entry-server.js'), `export function render(){return ${JSON.stringify(appHtml)}}`);

    execFileSync(process.execPath, [path.join(root, 'scripts', 'prerender.mjs')], { cwd: root });
    const html = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');

    assert.ok(html.includes(literal));
    assert.equal((html.match(/id="root"/g) ?? []).length, 1);
    assert.equal((html.match(/<\/body>/g) ?? []).length, 1);
  } finally {
    cleanup(root);
  }
});
