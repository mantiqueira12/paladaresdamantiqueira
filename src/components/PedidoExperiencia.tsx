import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { X, MessageCircle, CalendarHeart, Clock, Users, MapPin, PartyPopper, ChefHat, Sparkles, Copy, Check } from 'lucide-react';
import { EXPERIENCIAS, acharPorNome } from '../data/experiencias';
import { montarMensagem, WHATSAPP_NUMBER, WHATSAPP_DISPLAY, type PedidoData } from '../lib/whatsapp';
import { rastrearOrcamento, type OrigemOrcamento } from '../lib/analytics';
import { useModalA11y } from '../lib/useModalA11y';
import {
  OCASIOES,
  OUTRA_EXPERIENCIA,
  dataLocalISO,
  normalizarPedidoInicial,
  validarDataPedido,
  validarConvidadosPedido,
  validarHorarioPedido,
  faixaConvidadosPedido,
} from '../lib/pedido';

const NOMES_EXPERIENCIAS = EXPERIENCIAS.map((experiencia) => experiencia.nome);
const PEDIDO_INICIAL_VAZIO: PedidoData = {};

interface Props {
  aberto: boolean;
  onFechar: () => void;
  experienciaInicial?: string;
  pedidoInicial?: PedidoData;
  paginaOrigem?: string;
  /** De onde o pedido foi aberto — vira o parâmetro `origem` do evento GA4. */
  origem?: OrigemOrcamento;
}

export default function PedidoExperiencia({
  aberto,
  onFechar,
  experienciaInicial = '',
  pedidoInicial = PEDIDO_INICIAL_VAZIO,
  paginaOrigem = '',
  origem = 'formulario',
}: Props) {
  const [pedido, setPedido] = useState<PedidoData>({ experiencia: experienciaInicial });
  const [enviado, setEnviado] = useState(false);
  const [erroData, setErroData] = useState<string | null>(null);
  const [erroConvidados, setErroConvidados] = useState<string | null>(null);
  const [erroHorario, setErroHorario] = useState<string | null>(null);
  const [statusCopia, setStatusCopia] = useState<'idle' | 'copiado' | 'manual' | 'erro'>('idle');
  const {
    cidade: cidadeInicial,
    data: dataInicial,
    horario: horarioInicial,
    experiencia: experienciaDoPedido,
    nome: nomeInicial,
    ocasiao: ocasiaoInicial,
    pessoas: pessoasIniciais,
    faixaPessoas: faixaPessoasInicial,
    soServico: soServicoInicial,
  } = pedidoInicial;
  const pedidoInicialNormalizado = useMemo(
    () => normalizarPedidoInicial({
      cidade: cidadeInicial,
      data: dataInicial,
      horario: horarioInicial,
      experiencia: experienciaDoPedido,
      nome: nomeInicial,
      ocasiao: ocasiaoInicial,
      pessoas: pessoasIniciais,
      faixaPessoas: faixaPessoasInicial,
      soServico: soServicoInicial,
    }, NOMES_EXPERIENCIAS),
    [cidadeInicial, dataInicial, horarioInicial, experienciaDoPedido, nomeInicial, ocasiaoInicial, pessoasIniciais, faixaPessoasInicial, soServicoInicial],
  );
  const previewRef = useRef<HTMLPreElement>(null);
  const convidadosRef = useRef<HTMLInputElement>(null);
  const horarioRef = useRef<HTMLInputElement>(null);
  const dialogRef = useModalA11y(aberto, onFechar);

  useEffect(() => {
    if (aberto) {
      const experiencia = experienciaInicial || pedidoInicialNormalizado.experiencia || '';
      const normalizado = { ...pedidoInicialNormalizado, experiencia };
      const inicial = normalizado.experiencia ? acharPorNome(normalizado.experiencia) : undefined;
      setPedido({
        ...normalizado,
        soServico: inicial?.camada === 'servico',
      });
      setEnviado(false);
      setErroData(null);
      setErroConvidados(null);
      setErroHorario(null);
      setStatusCopia('idle');
    }
  }, [aberto, experienciaInicial, pedidoInicialNormalizado]);

  const expSel = pedido.experiencia ? acharPorNome(pedido.experiencia) : undefined;
  const soServicoObrigatorio = expSel?.camada === 'servico';
  const pedidoEfetivo = useMemo<PedidoData>(
    () => (soServicoObrigatorio ? { ...pedido, soServico: true } : pedido),
    [pedido, soServicoObrigatorio],
  );

  const preview = useMemo(() => montarMensagem(pedidoEfetivo), [pedidoEfetivo]);
  // A confirmação "Copiada" vale só para o texto copiado: qualquer edição a invalida.
  const set = (campo: keyof PedidoData, valor: string | boolean) => {
    setStatusCopia('idle');
    setPedido((p) => ({ ...p, [campo]: valor }));
  };
  const setExperiencia = (nome: string) => {
    setStatusCopia('idle');
    const escolhida = acharPorNome(nome);
    setPedido((p) => ({
      ...p,
      experiencia: nome,
      soServico: escolhida?.camada === 'servico',
    }));
  };

  // O envio é um <form> GET nativo para o wa.me (não window.open nem <a> com o
  // texto no href): funciona no navegador embutido do Instagram/Facebook e não
  // deixa PII em href, que o GA4 (cliques de saída automáticos) poderia ler.
  // O texto só entra na URL no instante do envio, pelo campo oculto `text`.
  const aoEnviar = (evento: FormEvent<HTMLFormElement>) => {
    const erro = validarDataPedido(pedidoEfetivo.data);
    const erroQuantidade = convidadosRef.current?.validity.badInput
      ? 'Informe uma quantidade inteira maior que zero.'
      : validarConvidadosPedido(pedidoEfetivo.pessoas);
    const erroHora = horarioRef.current?.validity.badInput
      ? 'Informe um horário válido (HH:mm).'
      : validarHorarioPedido(pedidoEfetivo.horario);
    setErroData(erro);
    setErroConvidados(erroQuantidade);
    setErroHorario(erroHora);
    if (erro || erroQuantidade || erroHora) {
      evento.preventDefault();
      if (!erro) (erroQuantidade ? convidadosRef : horarioRef).current?.focus();
      return;
    }
    rastrearOrcamento(origem, pedidoEfetivo.experiencia, {
      ocasiao: pedidoEfetivo.ocasiao,
      cidade: pedidoEfetivo.cidade,
      pessoas: faixaConvidadosPedido(pedidoEfetivo.pessoas) || (!pedidoEfetivo.pessoas ? pedidoEfetivo.faixaPessoas : undefined),
      soServico: pedidoEfetivo.soServico,
      pagina: paginaOrigem,
    });
    setEnviado(true);
  };

  const copiarMensagem = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard indisponível');
      await navigator.clipboard.writeText(preview);
      setStatusCopia('copiado');
    } catch {
      const selecao = window.getSelection();
      const previewEl = previewRef.current;
      if (selecao && previewEl) {
        const intervalo = document.createRange();
        intervalo.selectNodeContents(previewEl);
        selecao.removeAllRanges();
        selecao.addRange(intervalo);
        previewEl.focus();
        setStatusCopia('manual');
      } else {
        setStatusCopia('erro');
      }
    }
  };

  return (
    <AnimatePresence>
      {aberto && (
        <m.div
          data-modal-overlay="pedido"
          className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
            onClick={onFechar}
          />

          <m.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pedido-modal-titulo"
            tabIndex={-1}
            className="relative z-10 w-full md:max-w-2xl bg-brand-cream rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[92dvh] overflow-y-auto overflow-x-hidden"
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
                <h3 id="pedido-modal-titulo" className="serif text-2xl md:text-3xl font-bold mt-1 leading-tight">
                  Vamos planejar o seu encontro?
                </h3>
              </div>
              <button
                type="button"
                onClick={onFechar}
                aria-label="Fechar"
                className="p-3 rounded-full border border-brand-line hover:bg-brand-charcoal hover:text-white transition-all shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 md:px-10 py-6 space-y-6">
              <p className="text-sm text-brand-charcoal/75 leading-relaxed -mt-1">
                Conte os detalhes. Ao tocar em Abrir no WhatsApp, você revisa e envia a mensagem diretamente para mim.
                Sem compromisso — o investimento conversamos juntos.
                {' '}Data, horário e quantidade podem ficar em aberto enquanto planejamos.
              </p>

              {/* Experiência */}
              <Campo id="pedido-experiencia" icone={<ChefHat size={15} />} label="Experiência desejada">
                <select
                  id="pedido-experiencia"
                  value={pedido.experiencia || ''}
                  onChange={(e) => setExperiencia(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Ainda não sei — quero ajuda para escolher</option>
                  <option value={OUTRA_EXPERIENCIA}>{OUTRA_EXPERIENCIA}</option>
                  {EXPERIENCIAS.map((e) => (
                    <option key={e.slug} value={e.nome}>
                      {e.nome} · {e.linha}
                    </option>
                  ))}
                </select>
              </Campo>

              <div className="grid md:grid-cols-2 gap-5">
                <Campo id="pedido-data" icone={<CalendarHeart size={15} />} label="Data desejada">
                  <input
                    id="pedido-data"
                    type="date"
                    min={dataLocalISO()}
                    value={pedido.data || ''}
                    onChange={(e) => {
                      set('data', e.target.value);
                      setErroData(null);
                    }}
                    aria-invalid={Boolean(erroData)}
                    aria-describedby={erroData ? 'pedido-data-erro' : undefined}
                    className={inputCls}
                  />
                  {erroData && (
                    <span id="pedido-data-erro" role="alert" className="mt-2 block text-sm font-semibold text-red-800">
                      {erroData}
                    </span>
                  )}
                </Campo>

                <Campo id="pedido-horario" icone={<Clock size={15} />} label="Horário desejado">
                  <input
                    id="pedido-horario"
                    ref={horarioRef}
                    type="time"
                    step="60"
                    value={pedido.horario || ''}
                    onChange={(e) => {
                      set('horario', e.target.value);
                      setErroHorario(null);
                    }}
                    aria-invalid={Boolean(erroHorario)}
                    aria-describedby={erroHorario ? 'pedido-horario-erro' : undefined}
                    className={inputCls}
                  />
                  {erroHorario && (
                    <span id="pedido-horario-erro" role="alert" className="mt-2 block text-sm font-semibold text-red-800">
                      {erroHorario}
                    </span>
                  )}
                </Campo>

                <Campo id="pedido-convidados" icone={<Users size={15} />} label="Quantidade de convidados">
                  <input
                    id="pedido-convidados"
                    ref={convidadosRef}
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    placeholder="Ex.: 12"
                    value={pedido.pessoas || ''}
                    onChange={(e) => {
                      setStatusCopia('idle');
                      setPedido((p) => ({ ...p, pessoas: e.target.value, faixaPessoas: undefined }));
                      setErroConvidados(null);
                    }}
                    aria-invalid={Boolean(erroConvidados)}
                    aria-describedby={erroConvidados ? 'pedido-convidados-erro' : pedido.faixaPessoas ? 'pedido-convidados-contexto' : undefined}
                    className={inputCls}
                  />
                  {pedido.faixaPessoas && (
                    <span id="pedido-convidados-contexto" className="mt-2 block text-sm text-brand-charcoal/75">
                      Seu link indica {pedido.faixaPessoas}. Informe a quantidade pretendida, se já souber.
                    </span>
                  )}
                  {erroConvidados && (
                    <span id="pedido-convidados-erro" role="alert" className="mt-2 block text-sm font-semibold text-red-800">
                      {erroConvidados}
                    </span>
                  )}
                </Campo>

                <Campo id="pedido-ocasiao" icone={<PartyPopper size={15} />} label="Ocasião">
                  <select
                    id="pedido-ocasiao"
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

                <Campo id="pedido-cidade" icone={<MapPin size={15} />} label="Cidade / local">
                  <input
                    id="pedido-cidade"
                    type="text"
                    placeholder="Ex.: Campos do Jordão"
                    value={pedido.cidade || ''}
                    onChange={(e) => set('cidade', e.target.value)}
                    autoComplete="address-level2"
                    maxLength={120}
                    className={inputCls}
                  />
                </Campo>
              </div>

              <Campo id="pedido-nome" label="Seu nome">
                <input
                  id="pedido-nome"
                  type="text"
                  placeholder="Como posso te chamar?"
                  value={pedido.nome || ''}
                  onChange={(e) => set('nome', e.target.value)}
                  autoComplete="name"
                  maxLength={80}
                  className={inputCls}
                />
              </Campo>

              {soServicoObrigatorio && (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-brand-terracotta/30 bg-brand-terracotta/5">
                  <ChefHat size={18} className="mt-0.5 text-brand-terracotta shrink-0" />
                  <span className="text-sm text-brand-charcoal/80 leading-relaxed">
                    <strong className="text-brand-charcoal">Formato único: "Só o Serviço"</strong> — você compra os
                    insumos e cuida da estrutura; o chef assume o comando da cozinha.
                  </span>
                </div>
              )}

              {/* Preview da mensagem */}
              <div className="rounded-2xl border border-brand-line overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-moss text-brand-cream flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
                    <MessageCircle size={13} /> Prévia da sua mensagem
                  </span>
                  <button
                    type="button"
                    onClick={copiarMensagem}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-cream/50 px-3 py-1.5 text-xs font-semibold normal-case tracking-normal hover:bg-brand-cream/15 transition-colors"
                  >
                    {statusCopia === 'copiado' ? <Check size={13} /> : <Copy size={13} />}
                    {statusCopia === 'copiado' ? 'Copiada' : 'Copiar mensagem'}
                  </button>
                </div>
                <pre
                  ref={previewRef}
                  tabIndex={-1}
                  className="px-5 py-4 text-sm text-brand-charcoal/85 whitespace-pre-wrap break-words [overflow-wrap:anywhere] font-sans leading-relaxed bg-white/70"
                >
                  {preview}
                </pre>
                <span className="sr-only" role="status" aria-live="polite">
                  {statusCopia === 'copiado'
                    ? 'Mensagem copiada.'
                    : statusCopia === 'manual'
                      ? 'Não foi possível copiar automaticamente. A mensagem foi selecionada para você copiar manualmente.'
                      : statusCopia === 'erro'
                        ? 'Não foi possível copiar ou selecionar a mensagem automaticamente.'
                      : ''}
                </span>
                {statusCopia === 'manual' && (
                  <p className="px-5 pb-4 text-sm text-brand-charcoal/80">
                    A cópia automática não funcionou. A mensagem está selecionada; use o comando de copiar do seu dispositivo.
                  </p>
                )}
                {statusCopia === 'erro' && (
                  <p className="px-5 pb-4 text-sm text-brand-charcoal/80">
                    Não foi possível copiar automaticamente. Selecione a prévia e use o comando de copiar do seu dispositivo.
                  </p>
                )}
              </div>
            </div>

            {/* Rodapé / ação */}
            <form
              action={`https://wa.me/${WHATSAPP_NUMBER}`}
              method="get"
              target="_blank"
              rel="noopener noreferrer"
              noValidate
              onSubmit={aoEnviar}
              className="sticky bottom-0 glass-header px-6 md:px-10 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col sm:flex-row items-center gap-3 justify-between border-t border-brand-line">
              <span className="text-xs text-brand-charcoal/80 leading-relaxed break-words order-2 sm:order-1" role="status">
                {enviado
                  ? 'Se o WhatsApp abriu, revise a mensagem e toque em enviar por lá. 💬'
                  : `Falta um passo: a mensagem abrirá no WhatsApp para você confirmar · ${WHATSAPP_DISPLAY}`}
              </span>
              <input type="hidden" name="text" value={preview} />
              <button
                type="submit"
                className="order-1 sm:order-2 w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-terracotta text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-bold shadow-lg hover:bg-brand-charcoal transition-all hover:-translate-y-0.5"
              >
                <MessageCircle size={18} /> Abrir no WhatsApp
              </button>
            </form>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

// text-base no mobile: fontes <16px fazem o Safari iOS dar zoom automático ao focar o campo
const inputCls =
  'w-full bg-white border border-brand-line rounded-xl px-4 py-3 text-base md:text-sm text-brand-charcoal placeholder:text-brand-charcoal/50 outline-none focus:border-brand-terracotta focus:ring-2 focus:ring-brand-terracotta/15 transition-all';

function Campo({
  id,
  label,
  icone,
  children,
}: {
  id: string;
  label: string;
  icone?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-moss mb-2 flex items-center gap-2">
        {icone}
        <label htmlFor={id}>{label}</label>
      </span>
      {children}
    </div>
  );
}
