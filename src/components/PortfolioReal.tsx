import { ArrowUpRight } from 'lucide-react';
import LoadingImage from './LoadingImage';

const FOTOS = [
  {
    arquivo: 'origens-da-serra-ravioli',
    legenda: 'Ravióli artesanal',
    alt: 'Ravióli artesanal servido em tigelas durante Origens da Serra',
    destaque: true,
  },
  {
    arquivo: 'origens-da-serra-tabua-queijos',
    legenda: 'Tábua de queijos',
    alt: 'Tábua de queijos e acompanhamentos da experiência Origens da Serra',
  },
  {
    arquivo: 'origens-da-serra-cheesecake',
    legenda: 'Cheesecake com morango',
    alt: 'Cheesecakes individuais com morango dispostos sobre a mesa',
  },
];

export default function PortfolioReal({ onConhecer }: { onConhecer: () => void }) {
  return (
    <section id="portfolio-real" className="py-20 px-4 sm:px-6 md:py-28 section-border-top bg-[#F0F0E8]">
      <div className="max-w-7xl mx-auto">
        <div className="portfolio-intro">
          <h2 className="serif text-4xl md:text-6xl font-bold leading-[1.08] tracking-tight">
            Origens da Serra, servido em casa
          </h2>
          <div className="portfolio-context">
            <p className="text-base md:text-lg text-brand-charcoal/75 font-light leading-relaxed">
              Tábua de queijos, ravióli artesanal e cheesecake: pratos registrados durante uma realização de Origens da Serra.
            </p>
            <button type="button" onClick={onConhecer} className="portfolio-link">
              Conhecer a experiência <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="portfolio-grid">
          {FOTOS.map((foto) => (
            <figure key={foto.arquivo} className="portfolio-photo scroll-reveal">
              <div className="portfolio-image">
                <LoadingImage
                  src={`/portfolio/origens-da-serra/${foto.arquivo}.webp`}
                  srcSet={`/portfolio/origens-da-serra/${foto.arquivo}-600.webp 600w, /portfolio/origens-da-serra/${foto.arquivo}.webp 1200w`}
                  sizes={foto.destaque ? '(min-width: 768px) 58vw, 100vw' : '(min-width: 768px) 38vw, 50vw'}
                  alt={foto.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="portfolio-caption">{foto.legenda}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
