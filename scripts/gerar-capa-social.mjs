/** Composição editorial: fotografia original embutida, sem geração de alimentos.
 * Executar manualmente após alterar o layout: node scripts/gerar-capa-social.mjs
 * Chromium é usado apenas na manutenção; o build público consome o JPEG pronto.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');
const encoded = async (file) => (await fs.readFile(path.join(publicDir, file))).toString('base64');
const [font, photo] = await Promise.all([
  encoded('fonts/playfair-display-400.woff2'),
  encoded('portfolio/origens-da-serra/origens-da-serra-tabua-queijos.webp'),
]);
const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {});
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html lang="pt-BR"><meta charset="utf-8">
    <style>
      @font-face{font-family:Playfair;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:400}
      *{box-sizing:border-box}body{margin:0;background:#f5f0e8;color:#2d2d2d;width:1200px;height:630px}
      main{height:320px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
      h1{font-family:Playfair,serif;font-weight:400;font-size:64px;line-height:1.08;margin:0 0 23px;letter-spacing:-1.2px}
      h1 span{display:block}p{font:22px/1.4 Georgia,serif;margin:0}
      img{display:block;width:1200px;height:310px;object-fit:cover;object-position:50% 73%}
    </style><main><h1><span>Paladares da</span><span>Mantiqueira</span></h1>
    <p>Chef Rafael Jacob · experiências à sua mesa</p></main>
    <img src="data:image/webp;base64,${photo}" alt="Tábua de queijos de Origens da Serra">`);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('img').evaluate((img) => img.decode());
  const output = path.join(publicDir, 'social', 'paladares-mantiqueira.jpg');
  await fs.mkdir(path.dirname(output), { recursive: true });
  await page.screenshot({ path: output, type: 'jpeg', quality: 87 });
  console.log(`Capa 1200×630: ${path.relative(root, output)}`);
} finally {
  await browser.close();
}
