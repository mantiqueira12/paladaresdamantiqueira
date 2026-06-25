/**
 * Gera src/data/experiencias.json a partir das fichas em docs/cardapios/*.md.
 * Mantém as fichas (Markdown) como FONTE ÚNICA do catálogo.
 *
 * Uso:  npm run gen:cardapios   (ou: node scripts/gen-experiencias.mjs)
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CARD_DIR = join(ROOT, 'docs', 'cardapios');
const OUT = join(ROOT, 'src', 'data', 'experiencias.json');

const SECOES_NAO_CARDAPIO = ['inclui / exclui', 'extras recomendados', 'notas'];

/** Parser de frontmatter simples (valores escalares, arrays inline JSON). */
function parseFrontmatter(yaml) {
  const out = {};
  for (let raw of yaml.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith('[')) {
      try { out[key] = JSON.parse(val); } catch { out[key] = []; }
      continue;
    }
    if (!val.startsWith('"') && !val.startsWith("'")) {
      const h = val.indexOf(' #'); // remove comentário inline
      if (h !== -1) val = val.slice(0, h).trim();
    }
    if (val === 'true') out[key] = true;
    else if (val === 'false') out[key] = false;
    else if (val === 'null' || val === '') out[key] = null;
    else if (/^-?\d+(\.\d+)?$/.test(val)) out[key] = Number(val);
    else out[key] = val.replace(/^['"]|['"]$/g, '');
  }
  return out;
}

/** Limpa o título de um tempo do cardápio. */
function limparTitulo(t) {
  return t
    .replace(/\s*\*\(.*?\)\*\s*$/, '') // remove "*(Doces ...)*"
    .replace(/\s*[—-]\s*escolha\s*\d+\s*$/i, '') // remove "— escolha 1"
    .trim();
}

/** Extrai itens "- **Nome** — descrição" de um bloco. */
function parseItens(bloco) {
  const itens = [];
  for (const m of bloco.matchAll(/^-\s+\*\*(.+?)\*\*\s*[—-]\s*(.+)$/gm)) {
    itens.push({ nome: m[1].trim(), desc: m[2].trim() });
  }
  return itens;
}

function parseFicha(slug, src) {
  const fm = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fm) throw new Error(`Frontmatter ausente em ${slug}`);
  const meta = parseFrontmatter(fm[1]);
  const corpo = fm[2];

  const promessa = (corpo.match(/\*\*Promessa:\*\*\s*(.+)/) || [, ''])[1].trim();

  // Divide o corpo em seções "## ..."
  const partes = corpo.split(/^##\s+/m).slice(1);
  const cardapio = [];
  let inclui = '', exclui = '';
  for (const p of partes) {
    const nl = p.indexOf('\n');
    const titulo = p.slice(0, nl).trim();
    const bloco = p.slice(nl + 1);
    const tl = titulo.toLowerCase();
    if (tl.startsWith('inclui')) {
      inclui = (bloco.match(/\*\*Inclui[^:]*:\*\*\s*(.+)/) || [, ''])[1].trim();
      exclui = (bloco.match(/\*\*Exclui[^:]*:\*\*\s*(.+)/) || [, ''])[1].trim();
      continue;
    }
    if (SECOES_NAO_CARDAPIO.some((s) => tl.startsWith(s))) continue;
    const itens = parseItens(bloco);
    if (itens.length) cardapio.push({ titulo: limparTitulo(titulo), itens });
  }

  return {
    slug,
    nome: meta.nome,
    linha: meta.linha,
    ocasioes: meta.ocasioes || [],
    pessoasMin: meta.pessoas_min ?? null,
    pessoasMax: meta.pessoas_max ?? null,
    duracaoHoras: meta.duracao_horas ?? null,
    sazonalidade: meta.sazonalidade || 'ano todo',
    camada: meta.camada || 'completa',
    destaque: meta.destaque || 'lancamento',
    ativo: meta.ativo !== false,
    ordem: meta.ordem ?? 99,
    sobremesasPor: meta.sobremesas_por || 'Fernanda Marton Ateliê',
    dieteticas: meta.dieteticas || [],
    extrasRecomendados: meta.extras_recomendados || [],
    promessa,
    inclui,
    exclui,
    cardapio,
  };
}

const arquivos = readdirSync(CARD_DIR)
  .filter((f) => f.endsWith('.md') && !f.startsWith('_') && f !== 'LEIA-ME.md');

const experiencias = arquivos
  .map((f) => parseFicha(f.replace(/\.md$/, ''), readFileSync(join(CARD_DIR, f), 'utf8')))
  .filter((e) => e.ativo)
  .sort((a, b) => a.ordem - b.ordem);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(experiencias, null, 2) + '\n', 'utf8');
console.log(`✓ ${experiencias.length} experiências → src/data/experiencias.json`);
for (const e of experiencias) {
  console.log(`  ${String(e.ordem).padStart(2)} · ${e.nome} (${e.linha}) — ${e.cardapio.length} tempos`);
}
