/**
 * Gera variantes menores das imagens já otimizadas em WebP.
 *
 * As imagens originais continuam sendo a opção de maior resolução. As variantes
 * são usadas em `srcset`, evitando enviar arquivos de 800–1440 px para cards e
 * celulares que exibem a foto com cerca de 360–500 px.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const portfolio = path.join(pub, 'portfolio');

const tarefas = [
  ...fs
    .readdirSync(portfolio)
    .filter((arquivo) => arquivo.endsWith('.webp') && !/-\d+\.webp$/i.test(arquivo))
    .map((arquivo) => ({
      origem: path.join(portfolio, arquivo),
      destino: path.join(portfolio, arquivo.replace(/\.webp$/i, '-400.webp')),
      largura: 400,
    })),
  {
    origem: path.join(pub, 'hero-poster.webp'),
    destino: path.join(pub, 'hero-poster-720.webp'),
    largura: 720,
  },
  {
    origem: path.join(pub, 'chef-rafael.webp'),
    destino: path.join(pub, 'chef-rafael-500.webp'),
    largura: 500,
  },
];

for (const tarefa of tarefas) {
  if (!fs.existsSync(tarefa.origem)) continue;
  await sharp(tarefa.origem)
    .resize({ width: tarefa.largura, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(tarefa.destino);
}

console.log(`✓ ${tarefas.length} variantes responsivas verificadas/geradas`);
