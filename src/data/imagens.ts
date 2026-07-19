/**
 * Imagens de cada experiência (capa).
 * TODAS locais em /portfolio/ (public/portfolio/), otimizadas em WebP ~800px
 * por scripts/otimizar-imagens.mjs (doc 13 §2.4/2.5) — as que eram do Unsplash
 * foram baixadas e convertidas; o site não depende mais de CDN externa.
 * Fotos novas do acervo do Rafael: salvar em ../Portifolio e referenciar aqui
 * (o portfolioSync do vite.config.ts copia no build).
 */
export const IMAGEM_FALLBACK = '/portfolio/fallback.webp';

/** `srcset` das capas do catálogo; as variantes são geradas no prebuild. */
export function srcSetPortfolio(imagem: string): string | undefined {
  if (!imagem.startsWith('/portfolio/') || !imagem.endsWith('.webp')) return undefined;
  return `${imagem.replace(/\.webp$/, '-400.webp')} 400w, ${imagem} 800w`;
}

export const IMAGENS: Record<string, string> = {
  // acervo Rafael — top view de amigos compartilhando mesa farta com vinho e massas
  'mesa-de-amigos': '/portfolio/mesa-de-amigos.webp',
  // fondue — pessoas mergulhando pão na panela, luz clara e aconchegante
  'noite-de-fondue': '/portfolio/noite-de-fondue.webp',
  // churrasco brasileiro, carne na grelha com brasa
  'feito-na-brasa': '/portfolio/feito-na-brasa.webp',
  // cantina italiana — massa e ambiente
  'mesa-cheia-cantina': '/portfolio/mesa-cheia-cantina.webp',
  // pizza napolitana artesanal em forno de lenha com chamas
  'viva-la-pizza': '/portfolio/viva-la-pizza.webp',
  // jantar de celebração / alta gastronomia — cordeiro assado
  'origens-da-serra': '/portfolio/origens-da-serra.webp',
  // acervo Rafael — brunch farto com flores
  'brunch-na-montanha': '/portfolio/brunch.webp',
  // acervo Rafael — mesa de café colonial da serra
  'cafe-colonial-autoral': '/portfolio/cafe-colonial.webp',
  // acervo Rafael — pinhão da araucária no habitat nativo
  'edicao-pinhao': '/portfolio/pinhao.webp',
  // vinhos e harmonização
  'harmonizacao-guiada': '/portfolio/harmonizacao-guiada.webp',
  // hambúrguer artesanal
  'noite-do-hamburguer': '/portfolio/noite-do-hamburguer.webp',
  // hot dog gourmet
  'noite-do-hot-dog': '/portfolio/noite-do-hot-dog.webp',
  // acervo Rafael — petiscos e boteco
  'boteco-da-serra': '/portfolio/boteco.webp',
  // paella de frutos do mar rústica com camarão e mexilhões
  'feito-na-paella': '/portfolio/feito-na-paella.webp',
  // mesa farta de coffee break / catering corporativo
  'mesa-corporativa': '/portfolio/mesa-corporativa.webp',
};
