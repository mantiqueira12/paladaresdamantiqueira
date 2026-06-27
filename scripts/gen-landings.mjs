/**
 * Gera TODAS as landing pages estáticas de SEO (cidades + sazonais + nichos),
 * a página 404 e regenera o sitemap.xml + o llms.txt com a home + todas elas.
 *
 * Roda DEPOIS do build/prerender. Para cada item, escreve dist/<slug>/index.html
 * — página estática (sem depender de JS) que HERDA A IDENTIDADE VISUAL DA HOME
 * (mesmas cores, fontes, header glass, hero escuro, pill-images, depoimentos,
 * FAQ, rodapé de 3 colunas e WhatsApp flutuante), com title/description/canonical/
 * H1 próprios, Open Graph + Twitter Card, GA4, JSON-LD (LocalBusiness provider +
 * Service + BreadcrumbList + FAQPage) e CTAs de WhatsApp rastreados.
 *
 * FONTE ÚNICA do conteúdo (editável à mão):
 *   - src/data/cidades.json   → páginas "chef particular + cidade"
 *   - src/data/sazonais.json  → páginas por ocasião/estação (réveillon, inverno...)
 *   - src/data/nichos.json    → páginas por nicho (bodas, pousadas...)
 *   - src/data/faq.json       → FAQ reaproveitado (visível + FAQPage JSON-LD)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const SITE = 'https://paladaresdamantiqueira.com.br';
const WA = '5512997710040';
const TEL = '+5512997710040';
const IG_MARCA = 'https://www.instagram.com/paladaresdamantiqueira/';
const IG_CHEF = 'https://www.instagram.com/rafaeldjacob/';
const IG_ATELIE = 'https://www.instagram.com/fernandamarton.docesmomentos/';
const GBP_URL = 'https://www.google.com/maps/place/?q=place_id:ChIJzXUll8iJzJQR2SJ60hPQGyk';
const REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJzXUll8iJzJQR2SJ60hPQGyk';
const GA_ID = 'G-42VSMJHHFD';
const EYEBROW = 'Chef Particular · Serra da Mantiqueira';

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripTags = (s) => String(s ?? '').replace(/<[^>]+>/g, '');
const jl = (s) => String(s ?? '').replace(/\*/g, '').trim();
const load = (f) => JSON.parse(fs.readFileSync(path.join(root, 'src/data', f), 'utf8'));

// Normaliza cidades, sazonais e nichos para um mesmo formato de "landing".
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

// Sazonais e nichos compartilham o mesmo formato (campos já prontos);
// só recebem a área de atendimento regional (a serra).
const regionais = (file) =>
  load(file).map((s) => ({ ...s, areaServedName: 'Serra da Mantiqueira', areaServedType: 'Place' }));

const sazonais = regionais('sazonais.json');
const nichos = regionais('nichos.json');

const landings = [...cidades, ...sazonais, ...nichos];

// FAQ geral reaproveitado da home — subconjunto que faz sentido em toda landing.
// O MESMO conjunto é exibido na página E emitido como FAQPage JSON-LD (o Google
// exige que o conteúdo do schema esteja visível na página).
const FAQ_TODAS = load('faq.json');
const FAQ_LANDING = [FAQ_TODAS[0], FAQ_TODAS[1], FAQ_TODAS[2], FAQ_TODAS[4], FAQ_TODAS[6]].filter(Boolean);

// Depoimentos — mesmos da home (App.tsx). Exibidos como prova social, mas NÃO
// marcados como Review/AggregateRating (política do Google: review snippets só
// para avaliações reais, atribuídas e verificáveis — virão do Google Business).
const DEPOIMENTOS = [
  {
    quote:
      'A experiência foi impecável. O Chef Rafael assumiu tudo e pude realmente dar atenção aos meus convidados. O sabor da Mantiqueira em cada prato!',
    autor: 'Luciana M.',
    local: 'Campos do Jordão',
  },
  {
    quote:
      'Nunca comi um churrasco tão técnico na minha própria casa. Organização total, sem bagunça e com muita hospitalidade.',
    autor: 'Marcelo S.',
    local: 'Santo Antônio do Pinhal',
  },
  {
    quote:
      'As massas artesanais estavam divinas e a sobremesa do Ateliê foi o ponto alto. Atendimento discreto e muito profissional.',
    autor: 'Beatriz R.',
    local: 'São Bento do Sapucaí',
  },
];

/* ------------------------------------------------------------------ ícones SVG */
const ICO = {
  phone:
    '<svg class="ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  instagram:
    '<svg class="ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  message:
    '<svg class="ico" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  arrow:
    '<svg class="ico" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  pin: '<svg class="ico" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
};
const star =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
const estrelas = star.repeat(5);

/* --------------------------------------------------------- WhatsApp + tracking */
function waLink(n) {
  const msg = `Olá, Chef Rafael! 🌿 Vim pela página "${n.h1}" e gostaria de saber como funciona e os próximos passos.`;
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}
// Rastreia o clique no WhatsApp como conversão no GA4 (mesmo evento da home).
const track = (n, origem) =>
  `onclick="window.gtag&amp;&amp;gtag('event','solicitar_orcamento',{origem:'landing_${origem}',pagina:'${n.slug}'})"`;

/* ----------------------------------------------------------------- JSON-LD */
// Provider completo emitido NA PRÓPRIA landing, para o @id resolver sem depender
// da home (robustez de entidade/E-E-A-T quando o Google/IA lê a página isolada).
function jsonld(n) {
  const provider = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE}/`,
    name: 'Paladares da Mantiqueira',
    alternateName: 'Chef Rafael Jacob - Chef Particular',
    url: `${SITE}/`,
    image: `${SITE}/og-image.jpg`,
    telephone: TEL,
    priceRange: '$$$',
    areaServed: [
      'Campos do Jordão',
      'Santo Antônio do Pinhal',
      'São Bento do Sapucaí',
      'Serra da Mantiqueira',
      'São José dos Campos',
    ].map((name) => ({ '@type': 'Place', name })),
    founder: { '@type': 'Person', name: 'Rafael Jacob', jobTitle: 'Chef' },
    sameAs: [IG_MARCA, IG_CHEF, IG_ATELIE, GBP_URL],
  };
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Chef particular / Personal chef',
    name: n.serviceName,
    description: stripTags(n.description),
    provider: { '@id': `${SITE}/` },
    areaServed: { '@type': n.areaServedType, name: n.areaServedName },
    url: `${SITE}/${n.slug}/`,
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: n.breadcrumb, item: `${SITE}/${n.slug}/` },
    ],
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_LANDING.map((f) => ({
      '@type': 'Question',
      name: jl(f.pergunta),
      acceptedAnswer: { '@type': 'Answer', text: jl(f.resposta) },
    })),
  };
  return [provider, service, breadcrumb, faq]
    .map((d) => `<script type="application/ld+json">\n${JSON.stringify(d, null, 2).replace(/</g, '\\u003c')}\n</script>`)
    .join('\n    ');
}

/* --------------------------------------------------------------------- CSS */
// Espelha o design system da home (src/index.css + App.tsx): mesmos tokens,
// fontes, header glass, hero escuro, pill-images, cards com hover, FAQ e rodapé.
const CSS = `
  :root{--cream:#FDFBF7;--charcoal:#2D2D2D;--terracotta:#A64D33;--moss:#3E4E3E;--line:rgba(45,45,45,.1)}
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Inter',system-ui,sans-serif;color:var(--charcoal);background:var(--cream);line-height:1.65;-webkit-font-smoothing:antialiased}
  .serif{font-family:'Playfair Display',Georgia,serif}
  a{color:inherit}
  img{display:block;max-width:100%}
  .ico{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .inner{max-width:1200px;margin:0 auto;padding:0 24px}
  .wrap{max-width:960px;margin:0 auto;padding:0 24px}

  /* HEADER (glass, igual à home) */
  header{position:fixed;top:0;left:0;right:0;z-index:50;height:80px;background:rgba(253,251,247,.8);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
  header .inner{display:flex;align-items:center;justify-content:space-between;height:80px}
  .brand{display:flex;align-items:center;gap:12px;text-decoration:none}
  .brand img{height:42px;width:auto}
  .brand-txt{display:flex;flex-direction:column;line-height:1}
  .brand-txt b{font-family:'Playfair Display',serif;font-size:20px;color:var(--moss);font-weight:700;letter-spacing:-.5px}
  .brand-txt small{font-size:9px;text-transform:uppercase;letter-spacing:.3em;opacity:.5;font-weight:600;margin-top:5px}
  .nav{display:none;gap:36px}
  .nav a{font-size:10px;text-transform:uppercase;letter-spacing:.2em;font-weight:600;text-decoration:none;transition:color .2s}
  .nav a:hover{color:var(--terracotta)}
  .actions{display:flex;align-items:center;gap:12px}
  .icon-btn{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border:1px solid var(--line);border-radius:999px;color:var(--charcoal);text-decoration:none;transition:.25s}
  .icon-btn:hover{background:var(--charcoal);color:#fff;border-color:var(--charcoal)}
  .icon-btn.tel{display:none}
  .btn{display:inline-flex;align-items:center;gap:10px;background:var(--terracotta);color:#fff;text-decoration:none;font-weight:600;font-size:13px;letter-spacing:.08em;text-transform:uppercase;padding:16px 32px;border-radius:999px;transition:.3s;border:1px solid var(--terracotta)}
  .btn:hover{background:#fff;color:var(--charcoal);border-color:#fff;transform:translateY(-2px)}
  .btn .ico{transition:transform .3s}
  .btn:hover .ico{transform:translateX(3px)}
  .btn.sm{padding:11px 22px;font-size:11px}
  .btn.dark{background:var(--charcoal);border-color:var(--charcoal);color:#fff}
  .btn.dark:hover{background:var(--terracotta);border-color:var(--terracotta);color:#fff}
  .btn.ghost-light{background:transparent;color:var(--cream);border:1px solid rgba(253,251,247,.3)}
  .btn.ghost-light:hover{background:rgba(253,251,247,.1);color:var(--cream);transform:none}

  /* HERO (escuro e imersivo, igual à home) */
  .hero{position:relative;background:var(--charcoal);color:var(--cream);overflow:hidden;padding:160px 0 96px}
  .hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.22}
  .hero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--charcoal) 10%,rgba(45,45,45,.5) 60%,transparent)}
  .hero-inner{position:relative;z-index:2;max-width:1200px;margin:0 auto;padding:0 24px}
  .crumb{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(253,251,247,.55);margin-bottom:28px}
  .crumb a{text-decoration:none;color:rgba(253,251,247,.85)}
  .crumb span{margin:0 8px;opacity:.5}
  .eyebrow{display:flex;align-items:center;gap:16px;margin-bottom:26px}
  .eyebrow .rule{width:48px;height:1px;background:var(--terracotta)}
  .eyebrow span:last-child{font-size:11px;text-transform:uppercase;letter-spacing:.35em;font-weight:600;color:var(--terracotta)}
  .hero h1{font-family:'Playfair Display',serif;font-size:clamp(2.3rem,6vw,4.2rem);line-height:1.08;font-weight:700;color:var(--cream);max-width:18ch;margin-bottom:26px}
  .hero .lead{font-size:clamp(1.1rem,2.2vw,1.4rem);font-weight:300;color:rgba(253,251,247,.72);max-width:52ch;margin-bottom:40px}
  .cta-row{display:flex;flex-wrap:wrap;gap:14px}

  /* SEÇÕES claras */
  section.block{padding:72px 0;border-top:1px solid var(--line);background:#fff}
  section.block.cream{background:var(--cream)}
  .eyebrow-dark{font-size:11px;text-transform:uppercase;letter-spacing:.35em;font-weight:600;color:var(--moss);margin-bottom:14px;display:block}
  h2{font-family:'Playfair Display',serif;font-size:clamp(1.7rem,4vw,2.6rem);line-height:1.15;margin-bottom:22px;font-weight:700}
  p.body{font-size:1.08rem;color:rgba(45,45,45,.8);margin-bottom:18px}
  p.body:last-child{margin-bottom:0}

  /* split texto + imagem (pill) */
  .split{display:grid;gap:40px;align-items:center}
  @media(min-width:768px){.split{grid-template-columns:1.15fr .85fr}}
  .pill{height:440px;border-radius:9999px;overflow:hidden;box-shadow:0 0 0 8px var(--cream),0 30px 60px rgba(0,0,0,.14)}
  .pill img{width:100%;height:100%;object-fit:cover;filter:grayscale(35%);transition:.7s}
  .pill:hover img{filter:grayscale(0);transform:scale(1.04)}

  /* lista de ocasiões */
  ul.list{list-style:none;display:grid;gap:14px;margin-top:8px}
  @media(min-width:680px){ul.list{grid-template-columns:1fr 1fr}}
  ul.list li{padding-left:28px;position:relative;color:rgba(45,45,45,.85);font-size:1.05rem}
  ul.list li:before{content:"";position:absolute;left:0;top:10px;width:9px;height:9px;border-radius:999px;background:var(--terracotta)}

  /* passos */
  .steps{display:grid;gap:20px}
  @media(min-width:768px){.steps{grid-template-columns:repeat(3,1fr)}}
  .step{border:1px solid var(--line);border-radius:16px;padding:32px;background:#fff;transition:transform .4s,box-shadow .4s}
  .step:hover{transform:translateY(-6px);box-shadow:0 24px 48px rgba(0,0,0,.08)}
  .step .num{font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:var(--terracotta);letter-spacing:.1em;display:block;margin-bottom:14px}
  .step b{display:block;font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;margin-bottom:10px}
  .step p{font-size:.97rem;color:rgba(45,45,45,.65);font-weight:300}

  /* seção do chef (escura) */
  .chef{background:var(--charcoal);color:var(--cream);border-top:1px solid var(--line)}
  .chef .split{padding:80px 0}
  .chef .photo{aspect-ratio:4/5;border-radius:80px 0 80px 0;overflow:hidden;border:1px solid rgba(253,251,247,.1)}
  .chef .photo img{width:100%;height:100%;object-fit:cover}
  .chef h2{color:var(--cream)}
  .chef p{color:rgba(253,251,247,.72);font-weight:300;font-size:1.08rem;margin-bottom:18px}
  .chef .quote{border-left:2px solid var(--terracotta);padding-left:22px;font-style:italic;color:rgba(253,251,247,.92)}

  /* depoimentos */
  .cards{display:grid;gap:24px}
  @media(min-width:768px){.cards{grid-template-columns:repeat(3,1fr)}}
  .tcard{background:#fff;border:1px solid var(--line);border-radius:16px;padding:36px;display:flex;flex-direction:column}
  .tcard .stars{display:flex;gap:3px;color:var(--terracotta);margin-bottom:24px}
  .tcard blockquote{font-style:italic;color:rgba(45,45,45,.82);font-weight:300;line-height:1.7;flex:1;margin-bottom:28px}
  .tcard .who{display:flex;gap:8px;align-items:baseline;padding-top:18px;border-top:1px solid var(--line)}
  .tcard .who b{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--moss);font-weight:700}
  .tcard .who span{font-size:10px;text-transform:uppercase;letter-spacing:.12em;opacity:.45}

  /* FAQ (details/summary, sem JS) */
  .faq{display:grid;gap:14px;max-width:780px;margin:0 auto}
  details{border:1px solid var(--line);border-radius:16px;background:#fff;overflow:hidden}
  summary{cursor:pointer;list-style:none;padding:22px 28px;font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;display:flex;justify-content:space-between;align-items:center;gap:16px}
  summary::-webkit-details-marker{display:none}
  summary:after{content:"+";color:var(--terracotta);font-size:1.5rem;font-weight:400;line-height:1}
  details[open] summary:after{content:"–"}
  details .ans{padding:0 28px 24px;color:rgba(45,45,45,.7);font-size:.98rem;font-style:italic;line-height:1.7}

  /* faixa CTA */
  .cta-band{text-align:center;background:var(--charcoal);color:var(--cream);border-radius:24px;padding:64px 28px;margin:8px auto;max-width:1100px}
  .cta-band h2{color:var(--cream)}
  .cta-band p{opacity:.72;font-weight:300;margin:0 auto 30px;max-width:46ch;font-style:italic}

  /* veja também */
  .others{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px}
  .others a{text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:11px 20px;font-size:14px;transition:.2s}
  .others a:hover{border-color:var(--terracotta);color:var(--terracotta)}

  /* rodapé rico (3 colunas + borda terracotta, igual à home) */
  footer{background:#fff;border-top:1px solid var(--line);border-bottom:8px solid var(--terracotta);padding:72px 0 40px}
  .fgrid{display:grid;gap:48px;margin-bottom:56px}
  @media(min-width:680px){.fgrid{grid-template-columns:1fr 1fr}}
  @media(min-width:980px){.fgrid{grid-template-columns:1.4fr 1fr 1fr 1fr}}
  .fcol h4{font-size:10px;text-transform:uppercase;letter-spacing:.3em;font-weight:700;color:var(--moss);opacity:.5;margin-bottom:24px}
  .fbrand b{font-family:'Playfair Display',serif;font-size:22px;color:var(--moss);font-weight:700;display:block;margin-bottom:18px}
  .fbrand p{font-size:13px;color:rgba(45,45,45,.6);line-height:1.7;max-width:34ch}
  .flist{list-style:none;display:grid;gap:14px}
  .flist a,.flist span{display:flex;gap:8px;align-items:flex-start;font-size:13px;color:rgba(45,45,45,.8);text-decoration:none;transition:color .2s}
  .flist a:hover{color:var(--terracotta)}
  .flist .ico{color:var(--terracotta);flex-shrink:0;margin-top:2px}
  .fsoc{display:flex;gap:14px;margin-bottom:18px}
  .fbar{border-top:1px solid var(--line);padding-top:28px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;font-size:10px;text-transform:uppercase;letter-spacing:.18em;font-weight:700;opacity:.45}
  .fbar a{text-decoration:none}

  /* WhatsApp flutuante (igual à home) */
  .wa-float{position:fixed;bottom:32px;right:32px;z-index:100;width:56px;height:56px;border-radius:999px;background:var(--charcoal);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 12px 32px rgba(0,0,0,.28);text-decoration:none}
  .wa-float .dot{position:absolute;top:-2px;right:-2px;width:14px;height:14px;background:var(--terracotta);border-radius:999px}
  .wa-float .dot:before{content:"";position:absolute;inset:0;border-radius:999px;background:var(--terracotta);animation:ping 1.4s cubic-bezier(0,0,.2,1) infinite}
  @keyframes ping{75%,100%{transform:scale(2.2);opacity:0}}

  /* entrada suave (microinteração via CSS, sem JS) */
  @media(prefers-reduced-motion:no-preference){
    .reveal{animation:fadeup .8s ease both}
    @keyframes fadeup{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  }

  @media(min-width:1024px){.nav{display:flex}.icon-btn.tel{display:inline-flex}}
`;

/* -------------------------------------------------------------- template HTML */
function head(n, { title, description, url, canonical }) {
  return `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(stripTags(description))}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png?v=2" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png?v=2" />
    <link rel="icon" type="image/png" href="/favicon.png?v=2" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="Paladares da Mantiqueira" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(stripTags(description))}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="1200" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(stripTags(description))}" />
    <meta name="twitter:image" content="${SITE}/og-image.jpg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');</script>
    <style>${CSS}</style>`;
}

function headerHtml(n) {
  return `    <header>
      <div class="inner">
        <a class="brand" href="/" aria-label="Paladares da Mantiqueira — início">
          <img src="/logo-emblema.png" alt="Paladares da Mantiqueira" />
          <span class="brand-txt"><b>Paladares da Mantiqueira</b><small>Concierge Gastronômico</small></span>
        </a>
        <nav class="nav">
          <a href="/#conceito">Conceito</a>
          <a href="/#experiencias">Experiências</a>
          <a href="/#como-funciona">Como funciona</a>
          <a href="/#chef">O Chef</a>
        </nav>
        <div class="actions">
          <a class="icon-btn tel" href="tel:${TEL}" title="Ligar agora" aria-label="Ligar agora">${ICO.phone}</a>
          <a class="btn sm dark" href="${waLink(n)}" target="_blank" rel="noopener" ${track(n, 'header')}>${ICO.message} Solicitar</a>
          <a class="icon-btn" href="${IG_MARCA}" target="_blank" rel="noopener" aria-label="Instagram">${ICO.instagram}</a>
        </div>
      </div>
    </header>`;
}

function footerHtml() {
  const linkCidade = (c) =>
    `<li><a href="/${c.slug}/">${ICO.pin}<span>Chef particular em ${esc(c.chip)}</span></a></li>`;
  const linkOcasiao = (o) => `<li><a href="/${o.slug}/">${ICO.pin}<span>${esc(o.chip)}</span></a></li>`;
  return `    <footer>
      <div class="inner">
        <div class="fgrid">
          <div class="fcol fbrand">
            <b>Paladares da Mantiqueira</b>
            <p>Concierge Gastronômico e Personal Chef na Serra da Mantiqueira. Experiências de mesa para os seus momentos de celebração — em Campos do Jordão, Santo Antônio do Pinhal, São Bento do Sapucaí e toda a serra até São José dos Campos.</p>
          </div>
          <div class="fcol">
            <h4>Área de Atendimento</h4>
            <ul class="flist">
              ${cidades.map(linkCidade).join('\n              ')}
              <li><span>${ICO.pin}<span>Vale do Paraíba até São José dos Campos</span></span></li>
            </ul>
          </div>
          <div class="fcol">
            <h4>Ocasiões</h4>
            <ul class="flist">
              ${[...sazonais, ...nichos].map(linkOcasiao).join('\n              ')}
            </ul>
          </div>
          <div class="fcol">
            <h4>Conecte-se</h4>
            <div class="fsoc">
              <a class="icon-btn" href="${IG_MARCA}" target="_blank" rel="noopener" aria-label="Instagram">${ICO.instagram}</a>
              <a class="icon-btn" href="https://wa.me/${WA}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICO.message}</a>
            </div>
            <p style="font-size:10px;text-transform:uppercase;letter-spacing:.15em;font-weight:700;color:rgba(45,45,45,.4)">+55 12 99771-0040 · @paladaresdamantiqueira</p>
          </div>
        </div>
        <div class="fbar">
          <span>© 2026 Rafael Jacob · Chef Particular na Serra da Mantiqueira</span>
          <a href="${IG_ATELIE}" target="_blank" rel="noopener">Doces pela Fernanda Marton Ateliê</a>
        </div>
      </div>
    </footer>`;
}

function page(n) {
  const url = `${SITE}/${n.slug}/`;
  const outras = landings.filter((o) => o.slug !== n.slug);
  return `<!doctype html>
<html lang="pt-BR">
  <head>
${head(n, { title: n.title, description: n.description, url, canonical: url })}
    ${jsonld(n)}
  </head>
  <body>
${headerHtml(n)}

    <section class="hero">
      <div class="hero-bg" style="background-image:url('/og-image.jpg')"></div>
      <div class="hero-inner reveal">
        <p class="crumb"><a href="/">Início</a><span>/</span>${esc(n.breadcrumb)}</p>
        <div class="eyebrow"><span class="rule"></span><span>${EYEBROW}</span></div>
        <h1>${esc(n.h1)}</h1>
        <p class="lead">${n.lead}</p>
        <div class="cta-row">
          <a class="btn" href="${waLink(n)}" target="_blank" rel="noopener" ${track(n, 'hero')}>Solicitar minha experiência ${ICO.arrow}</a>
          <a class="btn ghost-light" href="/#experiencias">Ver as experiências</a>
        </div>
      </div>
    </section>

    <main>
      <section class="block">
        <div class="wrap split">
          <div>
            <span class="eyebrow-dark">A experiência</span>
            <h2>${esc(n.experienciaTitulo)}</h2>
            ${n.paragrafos.map((p) => `<p class="body">${p}</p>`).join('\n            ')}
          </div>
          <div class="pill"><img src="/portfolio/mesa-de-amigos.jpg" alt="Mesa posta para uma experiência do Paladares da Mantiqueira" loading="lazy" decoding="async" width="800" height="1000" /></div>
        </div>
      </section>

      <section class="block cream">
        <div class="wrap">
          <span class="eyebrow-dark">Ocasiões</span>
          <h2>${esc(n.listaTitulo)}</h2>
          <ul class="list">
            ${n.lista.map((o) => `<li>${esc(o)}</li>`).join('\n            ')}
          </ul>
        </div>
      </section>

      <section class="block">
        <div class="wrap">
          <span class="eyebrow-dark">O Processo</span>
          <h2>Simples como deve ser</h2>
          <div class="steps">
            <div class="step"><span class="num">01</span><b>Você faz o pedido</b><p>Escolhe a experiência (ou conta o que deseja), a data e o número de convidados. O pedido chega no meu WhatsApp.</p></div>
            <div class="step"><span class="num">02</span><b>Confirmamos a data</b><p>Monto o seu orçamento sob medida e reservo o dia com um sinal de 50%. A data passa a ser sua.</p></div>
            <div class="step"><span class="num">03</span><b>A experiência acontece</b><p>Eu orquestro a cozinha de forma invisível. Você aproveita os abraços, a conversa e os sabores.</p></div>
          </div>
        </div>
      </section>

      <section class="chef">
        <div class="wrap split">
          <div class="photo"><img src="/chef-rafael.jpg" alt="Chef Rafael Jacob na cozinha" loading="lazy" decoding="async" width="800" height="1000" /></div>
          <div>
            <span class="eyebrow-dark" style="color:var(--terracotta)">O Anfitrião</span>
            <h2>A arte de receber bem</h2>
            <p>Sou <strong>Rafael Jacob</strong>. Com mais de 15 anos na alta gastronomia, meu compromisso é orquestrar a sua cozinha de forma invisível e precisa, para que a sua única tarefa seja desfrutar a companhia dos seus convidados.</p>
            <p>É um projeto de família: enquanto comando o fogo e os cortes, a confeitaria artesanal é assinada pela <strong>Fernanda Marton Ateliê</strong>, com sobremesas que encerram a sua experiência com perfeição.</p>
            <p class="quote">"Minha cozinha é sobre hospitalidade."</p>
          </div>
        </div>
      </section>

      <section class="block cream">
        <div class="wrap">
          <div style="text-align:center;margin-bottom:48px">
            <span class="eyebrow-dark">Depoimentos</span>
            <h2>Memórias de mesa</h2>
          </div>
          <div class="cards">
            ${DEPOIMENTOS.map(
              (d) =>
                `<div class="tcard"><div class="stars">${estrelas}</div><blockquote>"${esc(d.quote)}"</blockquote><div class="who"><b>${esc(d.autor)}</b><span>• ${esc(d.local)}</span></div></div>`,
            ).join('\n            ')}
          </div>
          <p style="text-align:center;margin-top:40px"><a href="${REVIEW_URL}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;font-size:.95rem;font-weight:600;color:var(--terracotta);text-decoration:none"><span style="display:inline-flex;gap:2px">${estrelas}</span> Já viveu uma experiência comigo? Deixe a sua avaliação no Google</a></p>
        </div>
      </section>

      <section class="block">
        <div class="wrap">
          <div style="text-align:center;margin-bottom:40px">
            <span class="eyebrow-dark">Perguntas Frequentes</span>
            <h2>Dúvidas comuns</h2>
          </div>
          <div class="faq">
            ${FAQ_LANDING.map(
              (f) =>
                `<details><summary>${esc(f.pergunta)}</summary><div class="ans">${esc(f.resposta)}</div></details>`,
            ).join('\n            ')}
          </div>
        </div>
      </section>

      <section class="block cream">
        <div class="cta-band">
          <h2>${esc(n.ctaTitulo)}</h2>
          <p>Orçamento sob medida, sem compromisso. Você recebe os abraços — eu assumo o fogão.</p>
          <a class="btn" href="${waLink(n)}" target="_blank" rel="noopener" ${track(n, 'band')}>${ICO.message} Falar com o Chef Rafael</a>
        </div>
      </section>

      <section class="block">
        <div class="wrap">
          <span class="eyebrow-dark">Veja também</span>
          <h2>Outras experiências e regiões</h2>
          <div class="others">
            ${outras.map((o) => `<a href="/${o.slug}/">${esc(o.serviceName)}</a>`).join('\n            ')}
            <a href="/#experiencias">Ver todas as experiências</a>
          </div>
        </div>
      </section>
    </main>

${footerHtml()}

    <a class="wa-float" href="${waLink(n)}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp" ${track(n, 'flutuante')}>${ICO.message}<span class="dot"></span></a>
  </body>
</html>
`;
}

/* ------------------------------------------------------------------- página 404 */
function page404() {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
${head(null, {
    title: 'Página não encontrada | Paladares da Mantiqueira',
    description: 'A página que você procura não existe. Conheça o chef particular na Serra da Mantiqueira.',
    url: `${SITE}/404`,
    canonical: `${SITE}/`,
  })}
    <meta name="robots" content="noindex" />
  </head>
  <body>
${headerHtml({ slug: '404', h1: 'Página não encontrada' })}
    <section class="hero">
      <div class="hero-bg" style="background-image:url('/og-image.jpg')"></div>
      <div class="hero-inner" style="text-align:center">
        <div class="eyebrow" style="justify-content:center"><span class="rule"></span><span>${EYEBROW}</span><span class="rule"></span></div>
        <h1 style="margin:0 auto 26px">Esta página saiu da mesa</h1>
        <p class="lead" style="margin:0 auto 40px">A página que você procura não existe ou foi movida. Mas a experiência continua à sua espera.</p>
        <div class="cta-row" style="justify-content:center">
          <a class="btn" href="/">Voltar ao início ${ICO.arrow}</a>
          <a class="btn ghost-light" href="/#experiencias">Ver as experiências</a>
        </div>
      </div>
    </section>
${footerHtml()}
  </body>
</html>
`;
}

/* ------------------------------------------------------------------ geração */
for (const n of landings) {
  const dir = path.join(dist, n.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(n));
}

// 404 branded (o Netlify serve dist/404.html automaticamente como página de erro)
fs.writeFileSync(path.join(dist, '404.html'), page404());

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

// --- regenera o llms.txt (público em public/) acrescentando as URLs das landings,
//     para que IAs descubram as páginas específicas e citáveis por cidade/ocasião ---
try {
  const base = fs.readFileSync(path.join(root, 'public/llms.txt'), 'utf8').trimEnd();
  const linhasCidades = cidades.map((c) => `- ${c.chip}: ${SITE}/${c.slug}/`).join('\n');
  const linhasOcasioes = [...sazonais, ...nichos].map((o) => `- ${o.chip}: ${SITE}/${o.slug}/`).join('\n');
  const extra = `\n\n## Páginas por cidade\n${linhasCidades}\n\n## Páginas por ocasião e nicho\n${linhasOcasioes}\n`;
  fs.writeFileSync(path.join(dist, 'llms.txt'), `${base}${extra}`);
} catch {
  /* se não houver public/llms.txt, ignora */
}

console.log(
  `[gen-landings] ${landings.length} landings (${cidades.length} cidades + ${sazonais.length} sazonais + ${nichos.length} nichos) + 404 + sitemap (${urls.length} URLs) + llms.txt.`,
);
