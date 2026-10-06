/**
 * Verifica o artefato final em dist/ depois do prerender e da geração das
 * landings. Não corrige arquivos: qualquer inconsistência encerra com erro.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SITE = 'https://paladaresdamantiqueira.com.br';
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');

/**
 * Manifesto das rotas aprovadas. É o oráculo do verificador e NÃO pode ser
 * derivado de src/data/*.json — são esses arquivos que estão sendo auditados.
 * 14 landings + home = 15 URLs. Alterar esta lista é decisão de negócio.
 */
const APPROVED_SLUGS = Object.freeze([
  'chef-particular-em-campos-do-jordao',
  'chef-particular-em-santo-antonio-do-pinhal',
  'chef-particular-em-sao-bento-do-sapucai',
  'chef-particular-em-monte-verde',
  'chef-particular-em-goncalves',
  'chef-particular-em-sao-jose-dos-campos',
  'jantar-de-reveillon-na-serra-da-mantiqueira',
  'jantar-de-inverno-e-fondue-na-serra-da-mantiqueira',
  'jantar-romantico-na-serra-da-mantiqueira',
  'jantar-de-bodas-e-pedido-de-casamento-na-serra-da-mantiqueira',
  'chef-para-pousadas-e-casas-de-temporada-na-serra-da-mantiqueira',
  'personal-chef-na-serra-da-mantiqueira',
  'chef-para-casamento-e-mini-wedding-na-serra-da-mantiqueira',
  'chef-para-aniversario-na-serra-da-mantiqueira',
]);

const readJson = (name) => JSON.parse(fs.readFileSync(path.join(projectRoot, 'src', 'data', name), 'utf8'));
/** Slugs que os DADOS geram hoje — o objeto auditado, nunca o oráculo. */
const sourceSlugsFromData = () =>
  ['cidades.json', 'sazonais.json', 'nichos.json'].flatMap((name) => readJson(name).map((item) => item.slug));

function decodeHtml(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function firstAttribute(html, selectorPattern, attribute) {
  const tag = html.match(selectorPattern)?.[0];
  return tag?.match(new RegExp(`${attribute}=["']([^"']+)["']`, 'i'))?.[1] ?? null;
}

function localFileForUrl(dist, rawUrl, pageUrl) {
  const value = decodeHtml(rawUrl.trim());
  if (!value || /^(?:mailto:|tel:|javascript:|data:)/i.test(value)) return null;
  let url;
  try {
    url = new URL(value, pageUrl);
  } catch {
    return { invalid: value, motivo: 'não pode ser interpretada como URL' };
  }
  if (url.origin !== SITE) return null;

  // Separador codificado (%2F/%5C) atravessa o normalizador da URL e vira
  // traversal depois do decode: /..%2fpackage.json -> ../package.json.
  if (/%2f|%5c/i.test(url.pathname)) {
    return { invalid: value, motivo: 'separador codificado escapa de dist' };
  }

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return { invalid: value, motivo: 'percent-encoding inválido' };
  }

  const distRoot = path.resolve(dist);
  const relative = pathname.replace(/^\/+/, '');
  const target =
    !relative || pathname.endsWith('/')
      ? path.resolve(distRoot, relative, 'index.html')
      : path.resolve(distRoot, relative);

  const inside = path.relative(distRoot, target);
  if (!inside || inside.startsWith('..') || path.isAbsolute(inside)) {
    return { invalid: value, motivo: 'caminho resolvido escapa de dist' };
  }
  return target;
}

function referencedUrls(html) {
  const values = [];
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) values.push(match[1]);
  for (const match of html.matchAll(/\b(?:srcset|imagesrcset)=["']([^"']+)["']/gi)) {
    for (const candidate of match[1].split(',')) values.push(candidate.trim().split(/\s+/)[0]);
  }
  for (const match of html.matchAll(/\burl\(\s*["']?([^"')]+)["']?\s*\)/gi)) values.push(match[1]);
  return values;
}

function validatePage({ dist, file, canonical, label, errors }) {
  if (!fs.existsSync(file)) {
    errors.push(`${label}: arquivo ausente (${file})`);
    return;
  }
  const html = fs.readFileSync(file, 'utf8');
  const h1Count = [...html.matchAll(/<h1\b/gi)].length;
  if (h1Count !== 1) errors.push(`${label}: esperado 1 H1, encontrado ${h1Count}`);

  const actualCanonical = firstAttribute(html, /<link\b[^>]*\brel=["']canonical["'][^>]*>/i, 'href');
  if (actualCanonical !== canonical) errors.push(`${label}: canonical ${JSON.stringify(actualCanonical)}; esperado ${canonical}`);

  const robots = firstAttribute(html, /<meta\b[^>]*\bname=["']robots["'][^>]*>/i, 'content');
  if (robots && /\b(?:noindex|none)\b/i.test(robots)) {
    errors.push(`${label}: não pode conter robots ${JSON.stringify(robots)} — rota aprovada precisa ser indexável`);
  }

  const description = firstAttribute(html, /<meta\b[^>]*\bname=["']description["'][^>]*>/i, 'content');
  if (!description?.trim()) errors.push(`${label}: meta description ausente`);

  const jsonLd = [...html.matchAll(/<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (jsonLd.length === 0) errors.push(`${label}: JSON-LD ausente`);
  for (const [index, match] of jsonLd.entries()) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${label}: JSON-LD ${index + 1} inválido (${error.message})`);
    }
  }

  for (const reference of referencedUrls(html)) {
    const target = localFileForUrl(dist, reference, canonical);
    if (!target) continue;
    if (target.invalid) {
      errors.push(`${label}: URL inválida ${JSON.stringify(target.invalid)} — ${target.motivo}`);
    } else if (!fs.existsSync(target)) {
      errors.push(`${label}: recurso/link local ausente ${reference} -> ${target}`);
    }
  }
}

export function verifyBuild({
  dist = path.join(projectRoot, 'dist'),
  approvedSlugs = APPROVED_SLUGS,
  sourceSlugs = sourceSlugsFromData(),
} = {}) {
  const errors = [];
  const approved = [...approvedSlugs];
  const source = [...sourceSlugs];

  if (new Set(approved).size !== approved.length) errors.push('rotas aprovadas contêm slugs duplicados');
  if (new Set(source).size !== source.length) errors.push('fontes de landing contêm slugs duplicados');

  const ausentes = approved.filter((slug) => !source.includes(slug));
  const naoAprovados = source.filter((slug) => !approved.includes(slug));
  if (ausentes.length || naoAprovados.length) {
    errors.push(
      `fontes de landing divergem das rotas aprovadas — faltando nos dados: [${ausentes.join(', ') || 'nenhum'}]; fora do manifesto: [${naoAprovados.join(', ') || 'nenhum'}]`,
    );
  }

  const pages = [
    { file: path.join(dist, 'index.html'), canonical: `${SITE}/`, label: 'home' },
    ...approved.map((slug) => ({
      file: path.join(dist, slug, 'index.html'),
      canonical: `${SITE}/${slug}/`,
      label: slug,
    })),
  ];
  for (const page of pages) validatePage({ dist, ...page, errors });

  const home = pages[0].file;
  if (fs.existsSync(home)) {
    const homeHtml = fs.readFileSync(home, 'utf8');
    if (!/\bid=["']root["'][^>]*\bdata-prerendered=["']true["']/.test(homeHtml)) {
      errors.push('home: marcador data-prerendered="true" ausente');
    }
    const noscript = homeHtml.match(/<noscript\b[^>]*>([\s\S]*?)<\/noscript>/i)?.[1] ?? '';
    if (!/href=["']https:\/\/wa\.me\/5512997710040["']/i.test(noscript) || !/href=["']tel:\+5512997710040["']/i.test(noscript)) {
      errors.push('home: noscript precisa oferecer WhatsApp e telefone');
    }
  }

  const notFoundPath = path.join(dist, '404.html');
  if (!fs.existsSync(notFoundPath)) {
    errors.push('404: arquivo ausente');
  } else {
    const notFound = fs.readFileSync(notFoundPath, 'utf8');
    if (!/<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*noindex/i.test(notFound)) {
      errors.push('404: meta robots noindex ausente');
    }
    if (/<link\b[^>]*\brel=["']canonical["']/i.test(notFound)) {
      errors.push('404: canonical não deve apontar para a home nem declarar URL indexável');
    }
  }

  const sitemapPath = path.join(dist, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    errors.push('sitemap.xml ausente');
  } else {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const actual = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const expected = [`${SITE}/`, ...approved.map((slug) => `${SITE}/${slug}/`)];
    if (actual.length !== expected.length || new Set(actual).size !== actual.length) {
      errors.push(`sitemap: esperado ${expected.length} URLs únicas; encontrado ${actual.length}`);
    }
    const missing = expected.filter((url) => !actual.includes(url));
    const extra = actual.filter((url) => !expected.includes(url));
    if (missing.length) errors.push(`sitemap: URLs ausentes: ${missing.join(', ')}`);
    if (extra.length) errors.push(`sitemap: URLs inesperadas/inativas: ${extra.join(', ')}`);
    if (/<lastmod>/i.test(sitemap)) errors.push('sitemap: lastmod não deve ser inventado durante o build');
  }

  if (errors.length) {
    throw new Error(`[verify-build] ${errors.length} erro(s):\n- ${errors.join('\n- ')}`);
  }
  return { pages: pages.length, landings: approved.length, sitemapUrls: approved.length + 1 };
}

const isCli = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isCli) {
  try {
    const result = verifyBuild();
    if (result.landings !== 14 || result.sitemapUrls !== 15) {
      throw new Error(
        `[verify-build] manifesto aprovado deveria ter 14 landings e 15 URLs; tem ${result.landings} e ${result.sitemapUrls}`,
      );
    }
    console.log(`[verify-build] OK — ${result.pages} páginas indexáveis (${result.landings} landings) e ${result.sitemapUrls} URLs no sitemap.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
