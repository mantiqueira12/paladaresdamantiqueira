import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Clock, Leaf, Check, MessageCircle, CalendarDays } from 'lucide-react';
import {
  type Experiencia,
  pessoasLabel,
  duracaoLabel,
  porta,
} from '../data/experiencias';
import { IMAGEM_FALLBACK } from '../data/imagens';

interface Props {
  experiencia: Experiencia | null;
  onFechar: () => void;
  onSolicitar: (nome: string) => void;
}

export default function ExperienciaModal({ experiencia, onFechar, onSolicitar }: Props) {
  useEffect(() => {
    document.body.style.overflow = experiencia ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [experiencia]);

  return (
    <AnimatePresence>
      {experiencia && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm" onClick={onFechar} />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full md:max-w-3xl bg-brand-cream rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            {/* Capa */}
            <div className="relative h-56 md:h-72 overflow-hidden rounded-t-3xl md:rounded-t-2xl">
              <img
                src={experiencia.imagem}
                alt={experiencia.nome}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => ((e.target as HTMLImageElement).src = IMAGEM_FALLBACK)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/90 via-brand-charcoal/20 to-transparent" />
              <button
                onClick={onFechar}
                aria-label="Fechar"
                className="absolute top-4 right-4 p-2 rounded-full bg-brand-cream/90 text-brand-charcoal hover:bg-white transition-all"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-5 left-6 md:left-10 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold bg-brand-terracotta text-white px-3 py-1 rounded-full">
                    {porta(experiencia.linha).rotulo}
                  </span>
                  {experiencia.destaque === 'novidade' && (
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold bg-brand-moss text-brand-cream px-3 py-1 rounded-full">
                      Novidade
                    </span>
                  )}
                </div>
                <h3 className="serif text-3xl md:text-4xl font-bold text-brand-cream leading-tight">
                  {experiencia.nome}
                </h3>
              </div>
            </div>

            <div className="px-6 md:px-10 py-7 space-y-7">
              <p className="serif text-xl md:text-2xl italic text-brand-charcoal/80 leading-relaxed">
                “{experiencia.promessa}”
              </p>

              {/* Meta */}
              <div className="flex flex-wrap gap-x-7 gap-y-2 text-sm text-brand-charcoal/70">
                {pessoasLabel(experiencia) && (
                  <span className="flex items-center gap-2">
                    <Users size={15} className="text-brand-terracotta" /> {pessoasLabel(experiencia)}
                  </span>
                )}
                {duracaoLabel(experiencia) && (
                  <span className="flex items-center gap-2">
                    <Clock size={15} className="text-brand-terracotta" /> {duracaoLabel(experiencia)}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <CalendarDays size={15} className="text-brand-terracotta" /> {experiencia.sazonalidade}
                </span>
              </div>

              {/* Cardápio */}
              <div className="space-y-6">
                <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold text-brand-moss border-b border-brand-line pb-2">
                  O cardápio — você escolhe
                </h4>
                {experiencia.cardapio.map((tempo) => (
                  <div key={tempo.titulo}>
                    <p className="serif text-lg font-bold text-brand-terracotta mb-2">{tempo.titulo}</p>
                    <ul className="space-y-2">
                      {tempo.itens.map((it) => (
                        <li key={it.nome} className="text-sm text-brand-charcoal/75 leading-relaxed">
                          <span className="font-semibold text-brand-charcoal">{it.nome}</span>
                          {it.desc ? ` — ${it.desc}` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <p className="text-xs text-brand-charcoal/50 italic flex items-center gap-2">
                  <Leaf size={13} className="text-brand-moss" /> Sobremesas por{' '}
                  <a
                    href="https://www.instagram.com/fernandamarton.docesmomentos/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted underline-offset-2 hover:text-brand-moss transition-colors"
                  >
                    {experiencia.sobremesasPor}
                  </a>
                  .
                </p>
              </div>

              {/* Inclui / Exclui */}
              {(experiencia.inclui || experiencia.exclui) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {experiencia.inclui && (
                    <div className="p-5 rounded-xl bg-white/70 border border-brand-line">
                      <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-moss mb-2 flex items-center gap-2">
                        <Check size={13} /> Inclui
                      </p>
                      <p className="text-sm text-brand-charcoal/70 leading-relaxed">{experiencia.inclui}</p>
                    </div>
                  )}
                  {experiencia.exclui && (
                    <div className="p-5 rounded-xl bg-white/70 border border-brand-line">
                      <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-charcoal/50 mb-2">
                        Não incluso
                      </p>
                      <p className="text-sm text-brand-charcoal/70 leading-relaxed">{experiencia.exclui}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Dietéticas */}
              {experiencia.dieteticas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {experiencia.dieteticas.map((d) => (
                    <span
                      key={d}
                      className="text-[11px] uppercase tracking-wider font-semibold text-brand-moss bg-brand-moss/8 border border-brand-moss/15 px-3 py-1 rounded-full"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Ação */}
            <div className="sticky bottom-0 glass-header px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center gap-3 justify-between border-t border-brand-line">
              <span className="text-[11px] text-brand-charcoal/50 order-2 sm:order-1">
                Sem preço fixo — montamos o seu orçamento com carinho, na conversa.
              </span>
              <button
                onClick={() => onSolicitar(experiencia.nome)}
                className="order-1 sm:order-2 w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-terracotta text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-bold shadow-lg hover:bg-brand-charcoal transition-all hover:-translate-y-0.5"
              >
                <MessageCircle size={18} /> Solicitar esta experiência
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
