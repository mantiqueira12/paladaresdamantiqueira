import { useState } from 'react';
import { m } from 'motion/react';
import { ArrowRight, Users } from 'lucide-react';
import { porta, pessoasLabel, type Experiencia } from '../data/experiencias';
import { IMAGEM_FALLBACK, srcSetPortfolio } from '../data/imagens';
import LoadingImage from './LoadingImage';

export default function ExperienceCard({
  exp,
  onVer,
}: {
  exp: Experiencia;
  onVer: () => void;
}) {
  const publico = pessoasLabel(exp);
  const [imagemFalhou, setImagemFalhou] = useState(false);

  // article + botão "stretched-link": HTML válido (antes era <button> contendo
  // <h3>), o card inteiro continua clicável e o leitor de tela anuncia um nome
  // curto ("Ver detalhes de X") em vez de todo o texto do card.
  return (
    <m.article
      initial={false}
      whileHover={{ y: -3 }}
      className="experience-card scroll-reveal group relative text-left bg-white rounded-sm overflow-hidden border border-brand-line hover:border-brand-moss/40 transition-colors flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <LoadingImage
          key={imagemFalhou ? 'imagem-fallback' : 'imagem-experiencia'}
          src={imagemFalhou ? IMAGEM_FALLBACK : exp.imagem}
          srcSet={imagemFalhou ? undefined : srcSetPortfolio(exp.imagem)}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          alt={exp.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
          loading="lazy"
          onImageFailure={imagemFalhou ? undefined : () => setImagemFalhou(true)}
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
        <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light flex-1">{exp.promessa}</p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-brand-line">
          {publico ? (
            <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-charcoal/70 flex items-center gap-1.5">
              <Users size={13} className="text-brand-terracotta" /> {publico}
            </span>
          ) : (
            <span aria-hidden="true" />
          )}
          <button
            type="button"
            onClick={onVer}
            aria-label={`Ver detalhes de ${exp.nome}`}
            className="min-h-11 min-w-11 text-[11px] uppercase tracking-widest font-bold text-brand-terracotta flex items-center gap-1 group-hover:gap-2 transition-all after:absolute after:inset-0 after:cursor-pointer"
          >
            Detalhes <ArrowRight size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </m.article>
  );
}
