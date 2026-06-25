/**
 * Pré-renderização (SSG) da home.
 *
 * Roda DEPOIS de `vite build` (cliente) e `vite build --ssr src/entry-server.tsx`.
 * Pega o HTML da aplicação renderizado no servidor e o injeta dentro de
 * <div id="root"> no dist/index.html, marcando-o com data-prerendered="true".
 * Assim todo crawler (inclusive os de IA, que não executam JS) recebe a página
 * inteira em HTML, e o cliente apenas hidrata por cima.
 *
 * O JSON-LD do <head> (LocalBusiness, Person, FAQPage, Service/OfferCatalog) e o
 * fallback de SEO já foram injetados pelo plugin seoInject no build do cliente;
 * aqui só trocamos o conteúdo do #root pela aplicação real.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, '../dist');
const htmlPath = path.join(dist, 'index.html');
const serverEntry = path.join(dist, 'server/entry-server.js');

if (!fs.existsSync(serverEntry)) {
  throw new Error(`[prerender] bundle de servidor não encontrado: ${serverEntry}. Rode "vite build --ssr src/entry-server.tsx --outDir dist/server" antes.`);
}

const { render } = await import(pathToFileURL(serverEntry).href);
const appHtml = render();
if (!appHtml || appHtml.length < 5000) {
  throw new Error(`[prerender] render() devolveu HTML suspeito (${appHtml?.length ?? 0} chars; esperado » 5000). Abortando para não publicar uma página vazia.`);
}

let html = fs.readFileSync(htmlPath, 'utf8');

// Substitui TODO o conteúdo de #root (comentário + fallback de SEO) pela
// aplicação renderizada. Âncora robusta: o </div> do #root é o último antes de
// </body> (o módulo JS fica no <head> no build de produção). O `[^>]*` aceita
// atributos já presentes (ex.: data-prerendered), tornando o passo idempotente.
const re = /<div id="root"[^>]*>[\s\S]*<\/div>(\s*<\/body>)/;
if (!re.test(html)) {
  throw new Error('[prerender] não encontrei <div id="root"> … </div></body> no dist/index.html. Estrutura mudou?');
}
html = html.replace(re, `<div id="root" data-prerendered="true">${appHtml}</div>$1`);

fs.writeFileSync(htmlPath, html);

// O bundle de servidor é só intermediário — não vai para produção.
fs.rmSync(path.join(dist, 'server'), { recursive: true, force: true });

console.log(`[prerender] OK — ${appHtml.length} chars de aplicação injetados em dist/index.html.`);
