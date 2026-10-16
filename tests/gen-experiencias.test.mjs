import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

test('geração preserva item com anotação sazonal em itálico antes do travessão', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'paladares-menu-parser-'));
  try {
    fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
    fs.mkdirSync(path.join(root, 'docs', 'cardapios'), { recursive: true });
    fs.copyFileSync(
      path.resolve(import.meta.dirname, '../scripts/gen-experiencias.mjs'),
      path.join(root, 'scripts', 'gen-experiencias.mjs'),
    );
    fs.writeFileSync(path.join(root, 'docs', 'cardapios', 'harmonizacao.md'), `---
nome: "Harmonização de teste"
ativo: true
ordem: 1
---
# Harmonização de teste

## Entrada quente
- **Creme de pinhão** *(inverno)* — o pinhão da serra na estação.
- **Velouté de cogumelos** — creme de cogumelos frescos.
`);
    const result = spawnSync(process.execPath, [path.join(root, 'scripts', 'gen-experiencias.mjs')], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    const values = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'experiencias.json'), 'utf8'));
    assert.deepEqual(values[0].cardapio[0].itens, [
      { nome: 'Creme de pinhão', desc: '(inverno) — o pinhão da serra na estação.' },
      { nome: 'Velouté de cogumelos', desc: 'creme de cogumelos frescos.' },
    ]);
  } finally {
    // Only remove the unique fixture directory created by this test.
    assert.equal(path.dirname(root), os.tmpdir());
    assert.ok(path.basename(root).startsWith('paladares-menu-parser-'));
    fs.rmSync(root, { recursive: true, force: true });
  }
});
