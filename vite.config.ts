import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

/**
 * Sincroniza automaticamente C:\...\Portifolio → public/portfolio/
 * Roda a cada `npm run dev` e `npm run build`.
 *
 * Só copia as fotos REFERENCIADAS em src/data/imagens.ts (caminhos /portfolio/...).
 * Assim, fotos de teste/sobras na pasta Portifolio não entram no build.
 * Para usar uma foto nova: salve em Portifolio e aponte para ela em imagens.ts.
 *
 * Importante: nunca sobrescreve uma foto já otimizada em public/portfolio — só
 * copia se o destino não existe ou se o arquivo de origem for mais novo.
 */
function portfolioSync() {
  const sourceDir = path.resolve(__dirname, '../Portifolio');
  const targetDir = path.resolve(__dirname, 'public/portfolio');
  const imagensFile = path.resolve(__dirname, 'src/data/imagens.ts');

  const IMAGE_EXT = /\.(jpg|jpeg|png|webp|gif|avif)$/i;

  function normalize(name: string) {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9._-]/g, '');
  }

  // nomes de arquivo referenciados em imagens.ts: /portfolio/<arquivo>
  function referenced(): Set<string> {
    const set = new Set<string>();
    if (!fs.existsSync(imagensFile)) return set;
    const txt = fs.readFileSync(imagensFile, 'utf8');
    const re = /\/portfolio\/([a-z0-9._-]+)/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(txt))) set.add(m[1].toLowerCase());
    return set;
  }

  function sync() {
    if (!fs.existsSync(sourceDir)) return;
    const wanted = referenced();
    if (wanted.size === 0) return;
    fs.mkdirSync(targetDir, { recursive: true });
    for (const file of fs.readdirSync(sourceDir)) {
      if (!IMAGE_EXT.test(file)) continue;
      const norm = normalize(file);
      if (!wanted.has(norm)) continue; // ignora fotos não referenciadas
      const src = path.join(sourceDir, file);
      const stat = fs.statSync(src);
      if (!stat.isFile()) continue;
      const dest = path.join(targetDir, norm);
      const destExists = fs.existsSync(dest);
      if (!destExists || stat.mtimeMs > fs.statSync(dest).mtimeMs) {
        fs.copyFileSync(src, dest);
      }
    }
  }

  return {
    name: 'portfolio-sync',
    buildStart() {
      sync();
    },
  };
}

/**
 * Injeta, no index.html, o conteúdo de SEO/IA a partir de uma FONTE ÚNICA:
 *  - #seo-fallback  → as 13 experiências, área de atendimento, bio e FAQ em HTML
 *    estático, para o Google E os crawlers de IA (que não rodam JS) lerem o site.
 *  - FAQPage JSON-LD → as mesmas perguntas do FAQ da página (nunca divergem).
 * Lê src/data/experiencias.json (gerado das fichas) e src/data/faq.json.
 * Roda em `npm run dev` e `npm run build` via transformIndexHtml.
 */
function seoInject() {
  const dataDir = path.resolve(__dirname, 'src/data');

  const esc = (s: unknown) =>
    String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const limpo = (s: unknown) => esc(String(s ?? '').replace(/\*/g, '').trim());

  function load(file: string): any {
    try {
      return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    } catch {
      return null;
    }
  }

  function pessoasLabel(e: any): string {
    if (e.pessoasMin && e.pessoasMax) return `${e.pessoasMin} a ${e.pessoasMax} pessoas`;
    if (e.pessoasMin) return `a partir de ${e.pessoasMin} pessoas`;
    return '';
  }

  function gerarFallback(exps: any[], faqs: any[]): string {
    const itens = exps
      .map((e) => {
        const meta = [e.linha, pessoasLabel(e), e.sazonalidade !== 'ano todo' ? e.sazonalidade : '']
          .filter(Boolean)
          .map(limpo)
          .join(' · ');
        const ocas = (e.ocasioes || []).map(limpo).join(', ');
        const menu = (e.cardapio || [])
          .map((c: any) => `${limpo(c.titulo)}: ${(c.itens || []).map((i: any) => limpo(i.nome)).join(', ')}`)
          .join('; ');
        return `        <li><strong>${limpo(e.nome)}</strong>${meta ? ` (${meta})` : ''} — ${limpo(e.promessa)}${ocas ? ` Ocasiões: ${ocas}.` : ''}${menu ? ` Cardápio: ${menu}.` : ''}</li>`;
      })
      .join('\n');
    const faqHtml = faqs.map((f) => `        <h3>${limpo(f.pergunta)}</h3>\n        <p>${limpo(f.resposta)}</p>`).join('\n');
    return `
        <h1>Chef Particular na Serra da Mantiqueira — A experiência de um ótimo restaurante na sua casa</h1>
        <p><strong>Paladares da Mantiqueira</strong> é o serviço de <strong>chef particular</strong> (também procurado como <em>personal chef</em>, <em>chef em casa</em> ou <em>chef a domicílio</em>) do <strong>Chef Rafael Jacob</strong> em <strong>Campos do Jordão</strong> e em toda a <strong>Serra da Mantiqueira</strong>. De um churrasco animado a uma noite de massas e vinho: comida feita com técnica e afeto, na sala da sua casa. Você recebe os abraços — eu assumo o fogão.</p>
        <h2>Experiências gastronômicas</h2>
        <p>Jantares exclusivos, churrasco de alta gastronomia, massas artesanais, fondue, brunch, celebrações e eventos privados. Em cada experiência você escolhe o cardápio, e a sobremesa é sempre da Fernanda Marton Ateliê.</p>
        <ul>
${itens}
        </ul>
        <h2>Onde atendemos</h2>
        <p>Atendimento em toda a Serra da Mantiqueira, sem taxa de deslocamento (até cerca de 100 km): <strong>Campos do Jordão</strong>, <strong>Santo Antônio do Pinhal</strong>, <strong>São Bento do Sapucaí</strong> e o Vale do Paraíba até <strong>São José dos Campos</strong>.</p>
        <h2>O Chef</h2>
        <p>Rafael Jacob, com mais de 15 anos na alta gastronomia, orquestra a sua cozinha de forma invisível e precisa para que a sua única tarefa seja desfrutar a companhia dos seus convidados. Projeto de família: a confeitaria autoral é assinada pela Fernanda Marton Ateliê.</p>
        <h2>Perguntas frequentes</h2>
${faqHtml}
        <h2>Contato</h2>
        <p>WhatsApp e telefone: (12) 99771-0040 · Instagram: <a href="https://www.instagram.com/paladaresdamantiqueira/">@paladaresdamantiqueira</a></p>`;
  }

  function gerarFaqJsonLd(faqs: any[]): string {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: String(f.pergunta).replace(/\*/g, ''),
        acceptedAnswer: { '@type': 'Answer', text: String(f.resposta).replace(/\*/g, '') },
      })),
    };
    const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
    return `<script type="application/ld+json">\n${json}\n    </script>`;
  }

  // Catálogo de experiências como dado estruturado (Service + OfferCatalog).
  // Dá às IAs e ao Google uma lista comparável e nomeada das experiências, sem
  // ferir o posicionamento (usa os nomes premium e "chef particular", não termos
  // commodity). Sem preço — coerente com "orçamento sob medida".
  function gerarCatalogoJsonLd(exps: any[]): string {
    const txt = (s: unknown) => String(s ?? '').replace(/\*/g, '').trim();
    const ativos = exps.filter((e) => e.ativo !== false).sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Chef particular / Personal chef',
      name: 'Experiências de chef particular — Paladares da Mantiqueira',
      provider: { '@id': 'https://paladaresdamantiqueira.com.br/' },
      areaServed: [
        'Campos do Jordão',
        'Santo Antônio do Pinhal',
        'São Bento do Sapucaí',
        'Serra da Mantiqueira',
        'São José dos Campos',
      ].map((name) => ({ '@type': 'Place', name })),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Experiências gastronômicas',
        itemListElement: ativos.map((e) => {
          // O cardápio de cada experiência vive nos modais do app (não no HTML
          // pré-renderizado). Embutimos aqui, como dado estruturado, o resumo de
          // cada tempo e seus pratos — assim IAs e Google extraem o cardápio
          // completo sem depender de JavaScript.
          const cardapio = (e.cardapio || [])
            .map((c: any) => {
              const itens = (c.itens || [])
                .map((i: any) => (i.desc ? `${txt(i.nome)} (${txt(i.desc)})` : txt(i.nome)))
                .join('; ');
              return `${txt(c.titulo)}: ${itens}`;
            })
            .join(' · ');
          const description = cardapio ? `${txt(e.promessa)} Cardápio — ${cardapio}.` : txt(e.promessa);
          return {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: txt(e.nome),
              category: txt(e.linha),
              description,
            },
          };
        }),
      },
    };
    const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
    return `<script type="application/ld+json">\n${json}\n    </script>`;
  }

  return {
    name: 'seo-inject',
    transformIndexHtml(html: string) {
      const exps = load('experiencias.json');
      const faqs = load('faq.json');
      let out = html;
      if (faqs) out = out.replace('<!--SEO_FAQ_JSONLD-->', gerarFaqJsonLd(faqs));
      if (exps) out = out.replace('<!--SEO_CATALOG_JSONLD-->', gerarCatalogoJsonLd(exps));
      if (exps) out = out.replace('<!--SEO_FALLBACK-->', gerarFallback(exps, faqs || []));
      return out;
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [portfolioSync(), seoInject(), react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
