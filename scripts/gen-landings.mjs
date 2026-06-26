/**
 * Gera TODAS as landing pages estáticas de SEO (cidades + sazonais) e regenera
 * o sitemap.xml com a home + todas elas.
 *
 * Roda DEPOIS do build/prerender. Para cada item, escreve dist/<slug>/index.html
 * — página estática (sem depender de JS), com title/description/canonical/H1
 * próprios, copy, JSON-LD (Service + BreadcrumbList) e CTA de WhatsApp.
 *
 * FONTE ÚNICA do conteúdo (editável à mão):
 *   - src/data/cidades.json   → páginas "chef particular + cidade"
 *   - src/data/sazonais.json  → páginas por ocasião/estação (réveillon, inverno, etc.)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const SITE = 'https://paladaresdamantiqueira.com.br';
const WA = '5512997710040';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripTags = (s) => String(s ?? '').replace(/<[^>]+>/g, '');
const load = (f) => JSON.parse(fs.readFileSync(path.join(root, 'src/data', f), 'utf8'));

// Normaliza cidades e sazonais para um mesmo formato de "landing".
const cidades = load('cidades.json').map((c) => ({
  slug: c.slug,
  title: c.title,
  description: c.description,
  h1: c.h1,
  lead: c.lead,
  paragrafos: c.paragrafos,
  experienciaTitulo: `A experiência em ${c.cidade}`,
  listaTitulo: `Ocasiões em ${c.cidade}`,
  lista: c.ocasioes,
  ctaTitulo: `Vamos planejar a sua noite em ${c.cidade}?`,
  serviceName: `Chef particular em ${c.cidade}`,
  breadcrumb: `Chef particular em ${c.cidade}`,
  chip: c.cidade,
  areaServedName: c.cidade,
  areaServedType: 'City',
}));

const sazonais = load('sazonais.json').map((s) => ({
  ...s,
  areaServedName: 'Serra da Mantiqueira',
  areaServedType: 'Place',
}));

const landings = [...cidades, ...sazonais];

function waLink(n) {
  const msg = `Olá, Chef Rafael! 🌿 Vim pela página "${n.h1}" e gostaria de saber como funciona e os próximos passos.`;
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

function jsonld(n) {
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Chef particular / Personal chef',
      name: n.serviceName,
      description: stripTags(n.description),
      provider: { '@id': `${SITE}/` },
      areaServed: { '@type': n.areaServedType, name: n.areaServedName },
      url: `${SITE}/${n.slug}/`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: n.breadcrumb, item: `${SITE}/${n.slug}/` },
      ],
    },
  ];
  return data
    .map((d) => `<script type="application/ld+json">\n${JSON.stringify(d, null, 2).replace(/</g, '\\u003c')}\n</script>`)
    .join('\n    ');
}

const CSS = `
  :root{--cream:#FDFBF7;--charcoal:#2D2D2D;--terracotta:#A64D33;--moss:#3E4E3E;--line:rgba(45,45,45,.12)}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',system-ui,sans-serif;color:var(--charcoal);background:var(--cream);line-height:1.65;-webkit-font-smoothing:antialiased}
  .serif{font-family:'Playfair Display',Georgia,serif}
  a{color:inherit}
  .wrap{max-width:920px;margin:0 auto;padding:0 24px}
  header{position:sticky;top:0;z-index:10;background:rgba(253,251,247,.85);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
  header .wrap{display:flex;align-items:center;justify-content:space-between;height:72px}
  .brand{display:flex;align-items:center;gap:10px;text-decoration:none}
  .brand img{height:38px;width:auto}
  .brand b{font-family:'Playfair Display',serif;font-size:18px;color:var(--moss);font-weight:700;letter-spacing:-.5px}
  .btn{display:inline-flex;align-items:center;gap:8px;background:var(--terracotta);color:#fff;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:.08em;text-transform:uppercase;padding:14px 28px;border-radius:999px;transition:.25s}
  .btn:hover{background:var(--charcoal)}
  .btn.sm{padding:10px 20px;font-size:11px}
  .btn.ghost{background:transparent;color:var(--charcoal);border:1px solid var(--line)}
  .btn.ghost:hover{background:var(--charcoal);color:#fff}
  .crumb{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--moss);opacity:.8;margin:48px 0 18px}
  .crumb a{text-decoration:none}
  h1{font-family:'Playfair Display',serif;font-size:clamp(2.1rem,6vw,3.6rem);line-height:1.08;font-weight:700;margin-bottom:22px}
  .lead{font-size:clamp(1.15rem,2.5vw,1.45rem);font-weight:300;color:rgba(45,45,45,.78);max-width:46ch;margin-bottom:34px}
  .cta-row{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:64px}
  section{padding:40px 0;border-top:1px solid var(--line)}
  h2{font-family:'Playfair Display',serif;font-size:clamp(1.5rem,4vw,2.1rem);margin-bottom:20px}
  p.body{font-size:1.08rem;color:rgba(45,45,45,.8);margin-bottom:18px;max-width:64ch}
  ul.list{list-style:none;display:grid;gap:12px;margin-top:8px}
  ul.list li{padding-left:26px;position:relative;color:rgba(45,45,45,.85)}
  ul.list li:before{content:"";position:absolute;left:0;top:9px;width:9px;height:9px;border-radius:999px;background:var(--terracotta)}
  .steps{display:grid;gap:20px}
  @media(min-width:680px){.steps{grid-template-columns:repeat(3,1fr)}}
  .step{border:1px solid var(--line);border-radius:18px;padding:26px;background:#fff}
  .step b{display:block;font-family:'Playfair Display',serif;font-size:1.2rem;margin-bottom:8px}
  .step span{font-size:13px;font-weight:700;color:var(--terracotta);letter-spacing:.1em}
  .others{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px}
  .others a{text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:10px 18px;font-size:14px;transition:.2s}
  .others a:hover{border-color:var(--terracotta);color:var(--terracotta)}
  .cta-band{text-align:center;background:var(--charcoal);color:var(--cream);border-radius:24px;padding:56px 24px;margin:8px 0 56px}
  .cta-band h2{color:var(--cream)}
  .cta-band p{opacity:.75;font-weight:300;margin-bottom:26px}
  footer{border-top:1px solid var(--line);padding:40px 0;font-size:13px;color:rgba(45,45,45,.6)}
  footer .wrap{display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px}
  footer a{text-decoration:none}
`;

function page(n) {
  const url = `${SITE}/${n.slug}/`;
  const outras = landings.filter((o) => o.slug !== n.slug);
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(n.title)}</title>
    <meta name="description" content="${esc(stripTags(n.description))}" />
    <link rel="canonical" href="${url}" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png?v=2" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png?v=2" />
    <link rel="icon" type="image/png" href="/favicon.png?v=2" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="Paladares da Mantiqueira" />
    <meta property="og:title" content="${esc(n.title)}" />
    <meta property="og:description" content="${esc(stripTags(n.description))}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/og-image.jpg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
    <style>${CSS}</style>
    ${jsonld(n)}
  </head>
  <body>
    <header>
      <div class="wrap">
        <a class="brand" href="/" aria-label="Paladares da Mantiqueira — início">
          <img src="/logo-emblema.png" alt="Paladares da Mantiqueira" />
          <b>Paladares da Mantiqueira</b>
        </a>
        <a class="btn sm" href="${waLink(n)}" target="_blank" rel="noopener">Solicitar orçamento</a>
      </div>
    </header>

    <main class="wrap">
      <p class="crumb"><a href="/">Início</a> / ${esc(n.breadcrumb)}</p>
      <h1>${esc(n.h1)}</h1>
      <p class="lead">${n.lead}</p>
      <div class="cta-row">
        <a class="btn" href="${waLink(n)}" target="_blank" rel="noopener">Solicitar minha experiência</a>
        <a class="btn ghost" href="/#experiencias">Ver as experiências</a>
      </div>

      <section>
        <h2>${esc(n.experienciaTitulo)}</h2>
        ${n.paragrafos.map((p) => `<p class="body">${p}</p>`).join('\n        ')}
      </section>

      <section>
        <h2>${esc(n.listaTitulo)}</h2>
        <ul class="list">
          ${n.lista.map((o) => `<li>${esc(o)}</li>`).join('\n          ')}
        </ul>
      </section>

      <section>
        <h2>Como funciona</h2>
        <div class="steps">
          <div class="step"><span>01</span><b>Você faz o pedido</b>Escolhe a experiência (ou conta o que deseja), a data e o número de convidados. O pedido chega no meu WhatsApp.</div>
          <div class="step"><span>02</span><b>Confirmamos a data</b>Monto o seu orçamento sob medida e reservo o dia com um sinal de 50%. A data passa a ser sua.</div>
          <div class="step"><span>03</span><b>A experiência acontece</b>Eu orquestro a cozinha de forma invisível. Você aproveita os abraços, a conversa e os sabores.</div>
        </div>
      </section>

      <div class="cta-band">
        <h2>${esc(n.ctaTitulo)}</h2>
        <p>Orçamento sob medida, sem compromisso.</p>
        <a class="btn" href="${waLink(n)}" target="_blank" rel="noopener">Falar com o Chef Rafael</a>
      </div>

      <section>
        <h2>Veja também</h2>
        <div class="others">
          ${outras.map((o) => `<a href="/${o.slug}/">${esc(o.chip)}</a>`).join('\n          ')}
          <a href="/#experiencias">Ver todas as experiências</a>
        </div>
      </section>
    </main>

    <footer>
      <div class="wrap">
        <span>© 2026 Paladares da Mantiqueira · Chef Rafael Jacob — Chef Particular na Serra da Mantiqueira</span>
        <span><a href="/">paladaresdamantiqueira.com.br</a> · Doces pela Fernanda Marton Ateliê</span>
      </div>
    </footer>
  </body>
</html>
`;
}

// --- gera as páginas ---
for (const n of landings) {
  const dir = path.join(dist, n.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(n));
}

// --- regenera o sitemap (home + todas as landings) ---
const hoje = new Date().toISOString().split('T')[0];
const urls = [{ loc: `${SITE}/`, pri: '1.0' }, ...landings.map((n) => ({ loc: `${SITE}/${n.slug}/`, pri: '0.8' }))];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${hoje}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u.pri}</priority>\n  </url>`)
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);

console.log(`[gen-landings] ${landings.length} landings geradas (${cidades.length} cidades + ${sazonais.length} sazonais) + sitemap com ${urls.length} URLs.`);
