import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('gera apenas links, preservando ordem e regenerando mudanças das fontes', () => {
  const root = mkdtempSync(join(tmpdir(), 'links-rodape-'));
  const data = join(root, 'src/data');
  mkdirSync(data, { recursive: true });
  const sources = {
    cidades: [{ slug: 'cidade-a', cidade: 'Cidade A', lead: 'Editorial que não deve viajar' }],
    sazonais: [{ slug: 'ocasiao-a', chip: 'Ocasião A', description: 'Texto completo' }],
    nichos: [{ slug: 'ocasiao-b', chip: 'Ocasião B', paragrafos: ['Longo conteúdo'] }],
  };
  const generate = () => {
    for (const [name, values] of Object.entries(sources)) {
      writeFileSync(join(data, `${name}.json`), JSON.stringify(values));
    }
    const result = spawnSync(process.execPath, [resolve('scripts/gen-links-rodape.mjs')], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return readFileSync(join(data, 'links-rodape.json'), 'utf8');
  };
  try {
    const first = generate();
    assert.deepEqual(JSON.parse(first), {
      cidades: [{ slug: 'cidade-a', label: 'Chef particular em Cidade A' }],
      ocasioes: [{ slug: 'ocasiao-a', label: 'Ocasião A' }, { slug: 'ocasiao-b', label: 'Ocasião B' }],
    });
    assert.equal(generate(), first);
    sources.cidades[0].cidade = 'Cidade Atualizada';
    sources.nichos[0].slug = 'novo-destino';
    const updated = JSON.parse(generate());
    assert.equal(updated.cidades[0].label, 'Chef particular em Cidade Atualizada');
    assert.equal(updated.ocasioes[1].slug, 'novo-destino');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
