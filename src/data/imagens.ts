/**
 * Imagens de cada experiência (capa).
 * Fotos do acervo do Rafael ficam em /portfolio/ (public/portfolio/).
 * Fotos Unsplash usam o formato timestamp-hex do CDN (images.unsplash.com/photo-{id}).
 */
const U = (id: string, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

export const IMAGEM_FALLBACK = U('1544025162-d76694265947');

export const IMAGENS: Record<string, string> = {
  // acervo Rafael — top view de amigos compartilhando mesa farta com vinho e massas
  'mesa-de-amigos': '/portfolio/mesa-de-amigos.jpg',
  // fondue — pessoas mergulhando pão na panela, luz clara e aconchegante
  'noite-de-fondue': U('1754910568106-e71804067c2c'),
  // churrasco brasileiro, carne na grelha com brasa
  'feito-na-brasa': U('1558030137-d464dd688b00'),
  // cantina italiana — massa e ambiente
  'mesa-cheia-cantina': U('1473093226795-af9932fe5856'),
  // pizza napolitana artesanal em forno de lenha com chamas
  'viva-la-pizza': U('1622880833523-7cf1c0bd4296'),
  // jantar de celebração / alta gastronomia — cordeiro assado
  'origens-da-serra': U('1734987052573-0fbe611842ae'),
  // acervo Rafael — brunch farto com flores
  'brunch-na-montanha': '/portfolio/brunch.jpg',
  // acervo Rafael — mesa de café colonial da serra
  'cafe-colonial-autoral': '/portfolio/cafe-colonial.jpg',
  // acervo Rafael — pinhão da araucária no habitat nativo (salve o arquivo em public/portfolio/pinhao.jpg)
  'edicao-pinhao': '/portfolio/pinhao.jpg',
  // vinhos e harmonização
  'harmonizacao-guiada': U('1510812431401-41d2bd2722f3'),
  // hambúrguer artesanal
  'noite-do-hamburguer': U('1568901346375-23c9450c58cd'),
  // hot dog gourmet
  'noite-do-hot-dog': U('1612392061981-9d086fe894ed'),
  // acervo Rafael — petiscos e boteco
  'boteco-da-serra': '/portfolio/boteco.jpg',
  // paella de frutos do mar rústica com camarão e mexilhões
  'feito-na-paella': U('1775201651117-2e8aa549f04c'),
  // mesa farta de coffee break / catering corporativo
  'mesa-corporativa': U('1576842546422-60562b9242ae'),
};
