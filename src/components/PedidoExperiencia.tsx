import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, CalendarHeart, Users, MapPin, PartyPopper, ChefHat, Sparkles } from 'lucide-react';
import { EXPERIENCIAS, acharPorNome } from '../data/experiencias';
import { montarMensagem, linkWhatsApp, WHATSAPP_DISPLAY, type PedidoData } from '../lib/whatsapp';
import { rastrearOrcamento } from '../lib/analytics';

const FAIXAS_PESSOAS = ['2 a 6 pessoas', '8 a 12 pessoas', '13 a 20 pessoas', 'Mais de 20 pessoas'];
const OCASIOES = [
  'Aniversário',
  'Bodas / casamento',
  'Pedido de casamento',
  'Encontro a dois',
  'Reunião de família',
  'Confraternização',
  'Réveillon na serra',
  'Outra ocasião',
];

interface Props {
  aberto: boolean;
  onFechar: () => void;
  experienciaInicial?: string;
}

const hojeISO = () => new Date().toISOString().split('T')[0];

export default function PedidoExperiencia({ aberto, onFechar, experienciaInicial = '' }: Props) {
  const [pedido, setPedido] = useState<PedidoData>({ experiencia: experienciaInicial });

  useEffect(() => {
    if (aberto) setPedido((p) => ({ ...p, experiencia: experienciaInicial }));
  }, [aberto, experienciaInicial]);

  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [aberto]);

  const expSel = pedido.experiencia ? acharPorNome(pedido.experiencia) : undefined;
  const mostrarSoServico = !expSel || expSel.camada === 'servico' || expSel.camada === 'ambas';

  const preview = useMemo(() => montarMensagem(pedido), [pedido]);
  const set = (campo: keyof PedidoData, valor: string | boolean) =>
    setPedido((p) => ({ ...p, [campo]: valor }));

  const enviar = () => {
    rastrearOrcamento('formulario', pedido.experiencia, {
      ocasiao: pedido.ocasiao,
      cidade: pedido.cidade,
      pessoas: pedido.pessoas,
      soServico: pedido.soServico,
    });
    window.open(linkWhatsApp(pedido), '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm" onClick={onFechar} />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full md:max-w-2xl bg-brand-cream rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* Cabeçalho */}
            <div className="sticky top-0 z-10 glass-header px-6 md:px-10 py-5 flex items-start justify-between rounded-t-3xl md:rounded-t-2xl">
              <div>
                <span className="text-[10px] uppercase tracking-[0.35em] text-brand-terracotta font-bold flex items-center gap-2">
                  <Sparkles size={13} /> Pedido de Experiência
                </span>
                <h3 className="serif text-2xl md:text-3xl font-bold mt-1 leading-tight">
                  Vamos planejar a sua noite?
                </h3>
              </div>
              <button
                onClick={onFechar}
                aria-label="Fechar"
                className="p-2 rounded-full border border-brand-line hover:bg-brand-charcoal hover:text-white transition-all shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 md:px-10 py-6 space-y-6">
              <p className="text-sm text-brand-charcoal/60 leading-relaxed -mt-1">
                Conte os detalhes e eu recebo o seu pedido já no WhatsApp, pronto para combinarmos tudo com carinho.
                Sem compromisso — o investimento conversamos juntos.
              </p>

              {/* Experiência */}
              <Campo icone={<ChefHat size={15} />} label="Experiência desejada">
                <select
                  value={pedido.experiencia || ''}
                  onChange={(e) => set('experiencia', e.target.value)}
                  className={inputCls}
                >
                  <option value="">Ainda não sei — quero ajuda para escolher</option>
                  {EXPERIENCIAS.map((e) => (
                    <option key={e.slug} value={e.nome}>
                      {e.nome} · {e.linha}
                    </option>
                  ))}
                </select>
              </Campo>

              <div className="grid md:grid-cols-2 gap-5">
                <Campo icone={<CalendarHeart size={15} />} label="Data desejada">
                  <input
                    type="date"
                    min={hojeISO()}
                    value={pedido.data || ''}
                    onChange={(e) => set('data', e.target.value)}
                    className={inputCls}
                  />
                </Campo>

                <Campo icone={<Users size={15} />} label="Quantos convidados">
                  <select
                    value={pedido.pessoas || ''}
                    onChange={(e) => set('pessoas', e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Selecione</option>
                    {FAIXAS_PESSOAS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo icone={<PartyPopper size={15} />} label="Ocasião">
                  <select
                    value={pedido.ocasiao || ''}
                    onChange={(e) => set('ocasiao', e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Selecione</option>
                    {OCASIOES.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo icone={<MapPin size={15} />} label="Cidade / local">
                  <input
                    type="text"
                    placeholder="Ex.: Campos do Jordão"
                    value={pedido.cidade || ''}
                    onChange={(e) => set('cidade', e.target.value)}
                    className={inputCls}
                  />
                </Campo>
              </div>

              <Campo label="Seu nome">
                <input
                  type="text"
                  placeholder="Como posso te chamar?"
                  value={pedido.nome || ''}
                  onChange={(e) => set('nome', e.target.value)}
                  className={inputCls}
                />
              </Campo>

              {mostrarSoServico && (
                <label className="flex items-start gap-3 p-4 rounded-xl border border-brand-line bg-white/60 cursor-pointer hover:border-brand-terracotta/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={!!pedido.soServico}
                    onChange={(e) => set('soServico', e.target.checked)}
                    className="mt-1 accent-brand-terracotta w-4 h-4"
                  />
                  <span className="text-sm text-brand-charcoal/80 leading-relaxed">
                    <strong className="text-brand-charcoal">Quero o formato "Só o Serviço"</strong> — eu compro os
                    insumos e cuido da estrutura; o chef assume o comando da cozinha (mín. 3h).
                  </span>
                </label>
              )}

              {/* Preview da mensagem */}
              <div className="rounded-2xl border border-brand-line overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-moss text-brand-cream text-[10px] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
                  <MessageCircle size={13} /> Prévia da sua mensagem
                </div>
                <pre className="px-5 py-4 text-sm text-brand-charcoal/80 whitespace-pre-wrap font-sans leading-relaxed bg-white/70">
                  {preview}
                </pre>
              </div>
            </div>

            {/* Rodapé / ação */}
            <div className="sticky bottom-0 glass-header px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center gap-3 justify-between border-t border-brand-line">
              <span className="text-[11px] text-brand-charcoal/50 order-2 sm:order-1">
                Abre uma conversa no WhatsApp · {WHATSAPP_DISPLAY}
              </span>
              <button
                onClick={enviar}
                className="order-1 sm:order-2 w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-terracotta text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-bold shadow-lg hover:bg-brand-charcoal transition-all hover:-translate-y-0.5"
              >
                <MessageCircle size={18} /> Enviar meu pedido
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inputCls =
  'w-full bg-white border border-brand-line rounded-xl px-4 py-3 text-sm text-brand-charcoal placeholder:text-brand-charcoal/35 outline-none focus:border-brand-terracotta focus:ring-2 focus:ring-brand-terracotta/15 transition-all';

function Campo({
  label,
  icone,
  children,
}: {
  label: string;
  icone?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-moss mb-2 flex items-center gap-2">
        {icone}
        {label}
      </span>
      {children}
    </label>
  );
}
