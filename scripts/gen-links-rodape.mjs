import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Fontes editoriais continuam canônicas; a home recebe somente os links usados.
const data = resolve('src/data');
const read = (name) => JSON.parse(readFileSync(resolve(data, `${name}.json`), 'utf8'));
const manifesto = {
  cidades: read('cidades').map(({ slug, cidade }) => ({ slug, label: `Chef particular em ${cidade}` })),
  ocasioes: [...read('sazonais'), ...read('nichos')].map(({ slug, chip }) => ({ slug, label: chip })),
};
writeFileSync(resolve(data, 'links-rodape.json'), `${JSON.stringify(manifesto, null, 2)}\n`);
console.log(`✓ ${manifesto.cidades.length + manifesto.ocasioes.length} links de rodapé gerados`);
