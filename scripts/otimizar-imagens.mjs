/**
 * Otimização ONE-SHOT de imagens (doc 13, Lote 2 — itens 2.2/2.4/2.5).
 *
 * O que faz (rodar manualmente: `node scripts/otimizar-imagens.mjs`):
 *  1. Baixa as imagens Unsplash usadas em produção e as converte para WebP
 *     em public/portfolio/ (o site deixa de depender de CDN externa).
 *  2. Converte as fotos locais pesadas (chef, portfólio) para WebP.
 *  3. Reduz a logo do header (era ~109KB para exibir a ~44px de altura).
 *
 * Os .webp gerados são COMMITADOS — o build não depende deste script.
 * O portfolioSync (vite.config.ts) não sobrescreve nada disto: ele só copia
 * arquivos de ../Portifolio que estejam referenciados em imagens.ts.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const pf = path.join(pub, 'portfolio');
fs.mkdirSync(pf, { recursive: true });

const U = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=85&w=${w}`;

/* Unsplash → WebP local (cards das experiências + conceito + hero) */
const REMOTAS = [
  // capas de experiência (exibidas a ≤640px de largura)
  { id: '1754910568106-e71804067c2c', out: 'portfolio/noite-de-fondue.webp', w: 800, q: 75 },
  { id: '1558030137-d464dd688b00', out: 'portfolio/feito-na-brasa.webp', w: 800, q: 75 },
  { id: '1473093226795-af9932fe5856', out: 'portfolio/mesa-cheia-cantina.webp', w: 800, q: 75 },
  { id: '1622880833523-7cf1c0bd4296', out: 'portfolio/viva-la-pizza.webp', w: 800, q: 75 },
  { id: '1734987052573-0fbe611842ae', out: 'portfolio/origens-da-serra.webp', w: 800, q: 75 },
  { id: '1510812431401-41d2bd2722f3', out: 'portfolio/harmonizacao-guiada.webp', w: 800, q: 75 },
  { id: '1568901346375-23c9450c58cd', out: 'portfolio/noite-do-hamburguer.webp', w: 800, q: 75 },
  { id: '1612392061981-9d086fe894ed', out: 'portfolio/noite-do-hot-dog.webp', w: 800, q: 75 },
  { id: '1775201651117-2e8aa549f04c', out: 'portfolio/feito-na-paella.webp', w: 800, q: 75 },
  { id: '1576842546422-60562b9242ae', out: 'portfolio/mesa-corporativa.webp', w: 800, q: 75 },
  // seção Conceito
  { id: '1780246033915-a1ee941742e4', out: 'portfolio/conceito-sala.webp', w: 800, q: 75 },
  { id: '1765990605320-c7c5ce8e1c6f', out: 'portfolio/conceito-defumados.webp', w: 800, q: 75 },
  // hero/pré-rodapé (fica atrás de overlay escuro/claro — qualidade menor basta)
  { id: '1544025162-d76694265947', out: 'hero-poster.webp', w: 1440, q: 65 },
  { id: '1544025162-d76694265947', out: 'portfolio/fallback.webp', w: 800, q: 75 },
];

/* Locais → WebP (originais .jpg são removidos depois, referências atualizadas) */
const LOCAIS = [
  { src: 'chef-rafael.jpg', out: 'chef-rafael.webp', w: 1000, q: 80 },
  { src: 'portfolio/pinhao.jpg', out: 'portfolio/pinhao.webp', w: 800, q: 75 },
  { src: 'portfolio/brunch.jpg', out: 'portfolio/brunch.webp', w: 800, q: 75 },
  { src: 'portfolio/cafe-colonial.jpg', out: 'portfolio/cafe-colonial.webp', w: 800, q: 75 },
  { src: 'portfolio/mesa-de-amigos.jpg', out: 'portfolio/mesa-de-amigos.webp', w: 800, q: 75 },
  { src: 'portfolio/boteco.jpg', out: 'portfolio/boteco.webp', w: 800, q: 75 },
];

const kb = (f) => Math.round(fs.statSync(f).size / 1024);

async function baixar(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ao baixar ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

for (const r of REMOTAS) {
  const dest = path.join(pub, r.out);
  const buf = await baixar(U(r.id, Math.round(r.w * 1.2)));
  await sharp(buf).resize({ width: r.w, withoutEnlargement: true }).webp({ quality: r.q }).toFile(dest);
  console.log(`[unsplash] ${r.out} — ${kb(dest)}KB`);
}

for (const l of LOCAIS) {
  const src = path.join(pub, l.src);
  if (!fs.existsSync(src)) {
    console.warn(`[local] AUSENTE: ${l.src}`);
    continue;
  }
  const dest = path.join(pub, l.out);
  await sharp(src).resize({ width: l.w, withoutEnlargement: true }).webp({ quality: l.q }).toFile(dest);
  console.log(`[local] ${l.src} (${kb(src)}KB) → ${l.out} (${kb(dest)}KB)`);
}

/* Logo do header: exibida a ~44px de altura; 320px de largura cobre retina 2x */
const logo = path.join(pub, 'logo-emblema.png');
const antes = kb(logo);
const buf = await sharp(logo).resize({ width: 320, withoutEnlargement: true }).png({ palette: true }).toBuffer();
fs.writeFileSync(logo, buf);
const meta = await sharp(logo).metadata();
console.log(`[logo] logo-emblema.png ${antes}KB → ${kb(logo)}KB (${meta.width}x${meta.height})`);

console.log('\nPronto. Atualize as referências (.jpg → .webp) e remova os .jpg antigos.');
