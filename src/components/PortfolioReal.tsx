const FOTOS = [
  {
    arquivo: 'origens-da-serra-tabua-queijos',
    alt: 'Tábua de queijos e acompanhamentos servida na experiência Origens da Serra',
    destaque: true,
  },
  {
    arquivo: 'origens-da-serra-terrine',
    alt: 'Terrine de queijo coberta com castanhas e servida com ervas',
  },
  {
    arquivo: 'origens-da-serra-ravioli',
    alt: 'Ravióli artesanal finalizado durante a experiência Origens da Serra',
  },
  {
    arquivo: 'origens-da-serra-prato-principal',
    alt: 'Prato principal servido com legumes na experiência Origens da Serra',
  },
  {
    arquivo: 'origens-da-serra-cheesecake',
    alt: 'Cheesecake individual servido com morango',
  },
  {
    arquivo: 'origens-da-serra-sobremesas',
    alt: 'Mesa de sobremesas preparada para encerrar a experiência',
  },
];

export default function PortfolioReal() {
  return (
    <section id="portfolio-real" className="py-24 px-4 sm:px-6 md:py-32 section-border-top bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-brand-moss font-bold mb-4 block underline underline-offset-8 decoration-brand-terracotta/30">
            05. Uma experiência real
          </span>
          <h2 className="serif text-4xl md:text-6xl font-bold leading-[1.08] tracking-tight mb-6">
            Origens da Serra, servido em casa
          </h2>
          <p className="text-base md:text-lg text-brand-charcoal/70 font-light leading-relaxed max-w-2xl">
            Da tábua de abertura à sobremesa, estes registros mostram uma noite real: ingredientes escolhidos,
            execução no local e uma mesa preparada para o anfitrião aproveitar os convidados.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 auto-rows-[180px] sm:auto-rows-[240px] lg:auto-rows-[260px]">
          {FOTOS.map((foto) => (
            <figure
              key={foto.arquivo}
              className={`relative overflow-hidden bg-brand-cream last:col-span-2 lg:last:col-span-1 ${
                foto.destaque ? 'col-span-2 row-span-2 rounded-tl-[72px] rounded-br-[72px]' : 'rounded-2xl'
              }`}
            >
              <img
                src={`/portfolio/origens-da-serra/${foto.arquivo}.webp`}
                srcSet={`/portfolio/origens-da-serra/${foto.arquivo}-600.webp 600w, /portfolio/origens-da-serra/${foto.arquivo}.webp 1200w`}
                sizes={foto.destaque ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 30vw, 50vw'}
                alt={foto.alt}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.025]"
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>

        <p className="mt-6 text-xs text-brand-charcoal/55 tracking-wide">
          Registros reais da experiência Origens da Serra · Paladares da Mantiqueira
        </p>
      </div>
    </section>
  );
}
