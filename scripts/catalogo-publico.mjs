const plain = (value) => String(value ?? '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');
const esc = (value) => plain(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Projeção pública explícita: não serializa preços, notas ou metadados internos. */
export function renderCatalogo(experiencias, { css = '' } = {}) {
  const seen = new Set();
  const fichas = experiencias.filter((item) => item.ativo !== false).map((item) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) throw new Error('slug de catálogo inválido');
    if (seen.has(item.slug)) throw new Error('slug de catálogo duplicado');
    seen.add(item.slug);
    return {
      slug: item.slug, nome: plain(item.nome), promessa: plain(item.promessa),
      modalidades: item.camada === 'servico'
        ? 'Só o Serviço: mão de obra, com ingredientes e estrutura providenciados pelo cliente.'
        : item.camada === 'ambas'
          ? 'Experiência completa ou Só o Serviço, com escopos diferentes definidos na proposta.'
          : 'Experiência completa, com escopo definido na proposta.',
      secoes: item.cardapio.map((section) => ({
        titulo: plain(section.titulo),
        itens: section.itens.map((dish) => ({ nome: plain(dish.nome), desc: plain(dish.desc) })),
      })),
    };
  });
  const intro = 'Conheça as opções das fichas da Paladares da Mantiqueira. A composição do encontro, as escolhas e os ingredientes disponíveis são combinados na proposta. As listas não significam que todos os pratos serão servidos juntos.';
  const escopo = 'Nas experiências completas, a proposta reúne cardápio, compras, preparo e serviço, com confeitaria da Fernanda Marton Ateliê. Em Só o Serviço, o cliente providencia os ingredientes e a estrutura; a contratação é de mão de obra. Sobremesas do Ateliê não estão incluídas nessa modalidade. Bebidas, vinhos, locação de louças ou mobiliário e outros extras dependem do que for combinado na proposta.';
  const sections = fichas.map((ficha) => `<section id="${ficha.slug}" class="catalog-section">
    <h2>${esc(ficha.nome)}</h2><p>${esc(ficha.promessa)}</p><p class="catalog-mode">${esc(ficha.modalidades)}</p>
    ${ficha.secoes.map((section) => `<h3>${esc(section.titulo)}</h3><ul>${section.itens.map((dish) => `<li><strong>${esc(dish.nome)}</strong>${dish.desc ? ` — ${esc(dish.desc)}` : ''}</li>`).join('')}</ul>`).join('')}
    <p><a href="/?${esc(new URLSearchParams({ pedido: '1', experiencia: ficha.nome }).toString())}">Conversar sobre ${esc(ficha.nome)}</a> · <a href="#indice">Voltar ao índice</a></p>
  </section>`).join('\n');
  const markdownSections = fichas.map((ficha) => {
    const menus = ficha.secoes.map((section) => {
      const itens = section.itens.map((dish) => `- ${esc(dish.nome)}${dish.desc ? ` — ${esc(dish.desc)}` : ''}`).join('\n');
      return `### ${esc(section.titulo)}\n\n${itens}`;
    }).join('\n\n');
    return `## ${esc(ficha.nome)}\n\n${esc(ficha.promessa)}\n\n${esc(ficha.modalidades)}\n\n${menus}`;
  }).join('\n\n');
  const markdown = `# Cardápios da Paladares da Mantiqueira\n\n${intro}\n\n${escopo}\n\n${markdownSections}\n\nContato: +55 12 99771-0040. https://paladaresdamantiqueira.com.br/\n`;
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Cardápios da Paladares da Mantiqueira', url: 'https://paladaresdamantiqueira.com.br/cardapios/' });
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Cardápios e experiências | Paladares da Mantiqueira</title>
  <meta name="description" content="Consulte os cardápios da Paladares da Mantiqueira: pratos, experiências e modalidades para celebrar em casa, com o chef Rafael Jacob.">
  <link rel="canonical" href="https://paladaresdamantiqueira.com.br/cardapios/">
  <link rel="alternate" type="text/markdown" href="/cardapios.md"><link rel="describedby" href="/llms.txt">
  <script type="application/ld+json">${schema}</script>
  <style>${css}
  .catalog-wrap{max-width:74ch;margin:auto;padding:28px 24px 60px}
  .catalog-nav{display:flex;gap:24px;flex-wrap:wrap;padding-bottom:28px}
  .catalog-wrap h1{font-family:'Playfair Display',Georgia,serif;font-size:clamp(2.3rem,4vw,3.6rem);line-height:1.15;margin:20px 0 24px}.catalog-wrap h2{margin-bottom:16px}.catalog-wrap h3{font:600 1.1rem Inter,system-ui,sans-serif;margin:28px 0 12px}
  .catalog-wrap p{margin:16px 0}.catalog-wrap ul{padding-left:22px}.catalog-wrap li{margin:12px 0}
  .catalog-wrap a{color:var(--moss,#3d4b36);text-decoration:underline;text-underline-offset:4px;overflow-wrap:anywhere}
  .catalog-section{padding:44px 0;border-top:1px solid var(--line,#dedbd2)}.catalog-mode{font-weight:600}
  .catalog-scope{margin:24px 0}.catalog-scope summary{padding:12px 0;cursor:pointer;text-decoration:underline;text-underline-offset:4px}
  #indice{padding:24px 0}#indice ul{columns:2;column-gap:32px}#indice li{break-inside:avoid}
  .catalog-wrap section{scroll-margin-top:24px}.catalog-wrap:focus{outline:none}
  @media(max-width:600px){#indice ul{columns:1}.catalog-wrap h1{font-size:2.3rem}}
  </style></head><body><a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <main id="conteudo" tabindex="-1" class="catalog-wrap">
  <nav class="catalog-nav" aria-label="Navegação principal"><a href="/">Paladares da Mantiqueira</a><a href="/#experiencias">Explorar as experiências</a></nav>
  <h1>Cardápios para celebrar na Mantiqueira</h1><p>${intro}</p><details class="catalog-scope"><summary>O que muda entre as modalidades</summary><p>${escopo}</p></details>
  <nav id="indice" aria-label="Índice dos cardápios"><h2>Encontre uma experiência</h2><ul>${fichas.map((ficha) => `<li><a href="#${ficha.slug}">${esc(ficha.nome)}</a></li>`).join('')}</ul></nav>
  ${sections}
  <footer><p>Converse sobre seu encontro: <a href="https://wa.me/5512997710040">WhatsApp</a> · <a href="tel:+5512997710040">+55 12 99771-0040</a></p><p><a href="/jantar-de-natal-na-serra-da-mantiqueira/">Natal</a> · <a href="/jantar-de-reveillon-na-serra-da-mantiqueira/">Réveillon</a></p></footer>
  </main></body></html>`;
  return { html, markdown };
}
