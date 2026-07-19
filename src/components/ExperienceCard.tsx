import { m } from 'motion/react';
import { ArrowRight, Users } from 'lucide-react';
import { porta, pessoasLabel, type Experiencia } from '../data/experiencias';
import { IMAGEM_FALLBACK, srcSetPortfolio } from '../data/imagens';

export default function ExperienceCard({
  exp,
  index,
  onVer,
}: {
  exp: Experiencia;
  index: number;
  onVer: () => void;
}) {
  // article + botão "stretched-link": HTML válido (antes era <button> contendo
  // <h3>), o card inteiro continua clicável e o leitor de tela anuncia um nome
  // curto ("Ver detalhes de X") em vez de todo o texto do card.
  return (
    <m.article
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative text-left bg-white rounded-2xl overflow-hidden border border-brand-line shadow-sm hover:shadow-2xl transition-shadow flex flex-col"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={exp.imagem}
          srcSet={srcSetPortfolio(exp.imagem)}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          alt={exp.nome}
          className="w-full h-full object-cover [@media(hover:hover)]:grayscale-[35%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          loading="lazy"
          onError={(e) => ((e.target as HTMLImageElement).src = IMAGEM_FALLBACK)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/40 to-transparent" />
        <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] font-bold bg-brand-cream/90 text-brand-charcoal px-3 py-1 rounded-full">
          {porta(exp.linha).rotulo}
        </span>
        {exp.destaque === 'novidade' && (
          <span className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.2em] font-bold bg-brand-terracotta text-white px-3 py-1 rounded-full">
            Novidade
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="serif text-2xl font-bold mb-2 group-hover:text-brand-terracotta transition-colors">
          {exp.nome}
        </h3>
        <p className="text-sm text-brand-charcoal/60 leading-relaxed font-light line-clamp-3 flex-1">{exp.promessa}</p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-brand-line">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-charcoal/70 flex items-center gap-1.5">
            <Users size={13} className="text-brand-terracotta" /> {pessoasLabel(exp)}
          </span>
          <button
            type="button"
            onClick={onVer}
            aria-label={`Ver detalhes de ${exp.nome}`}
            className="text-[11px] uppercase tracking-widest font-bold text-brand-terracotta flex items-center gap-1 group-hover:gap-2 transition-all after:absolute after:inset-0 after:cursor-pointer"
          >
            Ver <ArrowRight size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </m.article>
  );
}
