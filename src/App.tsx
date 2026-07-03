/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef, useState } from 'react';
// LazyMotion + m: carrega só o subconjunto domAnimation da lib (bundle menor).
// MotionConfig reducedMotion="user" respeita o prefers-reduced-motion do sistema.
import { LazyMotion, MotionConfig, domAnimation, m } from 'motion/react';
import {
  MessageCircle,
  MapPin,
  Heart,
  Instagram,
  Star,
  HelpCircle,
  Phone,
  Wind,
  ArrowRight,
  CalendarHeart,
  ChefHat,
  Sparkles,
} from 'lucide-react';
import {
  EXPERIENCIAS,
  LINHAS,
  porta,
  experienciasPorLinha,
  type Experiencia,
  type Linha,
} from './data/experiencias';
import FAQ from './data/faq.json';
import CIDADES from './data/cidades.json';
import SAZONAIS from './data/sazonais.json';
import NICHOS from './data/nichos.json';
import { linkWhatsAppTexto, WHATSAPP_NUMBER, WHATSAPP_DISPLAY, GOOGLE_REVIEW_LINK } from './lib/whatsapp';
import { rastrearOrcamento, type OrigemOrcamento } from './lib/analytics';
import PedidoExperiencia from './components/PedidoExperiencia';
import ExperienciaModal from './components/ExperienciaModal';
import SectionHeading from './components/SectionHeading';
import Chip from './components/Chip';
import ExperienceCard from './components/ExperienceCard';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import StepCard from './components/StepCard';
import TestimonialCard from './components/TestimonialCard';
import AccordionItem from './components/AccordionItem';

// Foto do chef em public/ (caminho estático, sem hash de bundle): assim o HTML
// pré-renderizado (SSG) e o cliente apontam para a mesma URL e a hidratação casa.
const chefImage = '/chef-rafael.webp';

const FILTRO_GENERICO = linkWhatsAppTexto(
  'Olá, Chef Rafael! 🌿 Vi o seu site e gostaria de saber mais sobre as experiências na minha casa.',
);

export default function App() {
  const [pedidoAberto, setPedidoAberto] = useState(false);
  const [pedidoExp, setPedidoExp] = useState('');
  const [detalhe, setDetalhe] = useState<Experiencia | null>(null);
  const [filtro, setFiltro] = useState<'Todas' | Linha>('Todas');

  // Hero: o vídeo de fundo (CDN externa, pesado) só é carregado depois do primeiro
  // paint E somente em telas largas, sem economia de dados e sem preferência por
  // menos movimento — no celular/4G o poster segura o visual sozinho.
  // heroVideo começa false (casa com o SSG).
  const videoRef = useRef<HTMLVideoElement>(null);
  const [heroVideo, setHeroVideo] = useState(false);
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    if (
      !window.matchMedia('(min-width: 768px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      conn?.saveData ||
      /\b[23]g\b/.test(conn?.effectiveType ?? '')
    ) {
      return;
    }
    const iniciar = () => setHeroVideo(true);
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(iniciar, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(iniciar, 1200);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (heroVideo) videoRef.current?.load();
  }, [heroVideo]);

  // origem: de onde o pedido foi aberto — vira o parâmetro `origem` do evento
  // GA4 solicitar_orcamento no envio (ex.: botao_flutuante vs formulario).
  const [pedidoOrigem, setPedidoOrigem] = useState<OrigemOrcamento>('formulario');
  const abrirPedido = (nome = '', origem: OrigemOrcamento = 'formulario') => {
    setPedidoExp(nome);
    setPedidoOrigem(origem);
    setPedidoAberto(true);
  };
  const solicitarDoDetalhe = (nome: string) => {
    setDetalhe(null);
    setTimeout(() => abrirPedido(nome), 180);
  };

  const lista = useMemo(
    () => (filtro === 'Todas' ? EXPERIENCIAS : experienciasPorLinha(filtro)),
    [filtro],
  );

  return (
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen flex flex-col selection:bg-brand-terracotta selection:text-white">
      {/* HEADER */}
      <header className="w-full h-20 flex items-center justify-between px-4 sm:px-6 md:px-16 glass-header fixed top-0 z-50">
        <div className="flex items-center gap-3">
          <img
            src="/logo-emblema.png"
            alt="Paladares da Mantiqueira"
            width={320}
            height={98}
            className="h-8 sm:h-9 md:h-11 w-auto"
          />
          {/* Em telas <sm o nome colidia com o botão "Solicitar"; o emblema segura a marca sozinho */}
          <div className="hidden sm:flex flex-col">
            <span className="serif text-xl md:text-2xl font-bold tracking-tighter text-brand-moss leading-none whitespace-nowrap">
              Paladares da Mantiqueira
            </span>
            <span className="hidden md:block text-[9px] uppercase tracking-[0.3em] opacity-50 mt-1 font-semibold leading-none">
              Concierge Gastronômico
            </span>
          </div>
        </div>
        <nav className="hidden lg:flex gap-10 text-[10px] uppercase tracking-[0.2em] font-bold">
          <a href="#conceito" className="hover:text-brand-terracotta transition-colors">
            Conceito
          </a>
          <a href="#experiencias" className="hover:text-brand-terracotta transition-colors">
            Experiências
          </a>
          <a href="#como-funciona" className="hover:text-brand-terracotta transition-colors">
            Como funciona
          </a>
          <a href="#chef" className="hover:text-brand-terracotta transition-colors">
            O Chef
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="hidden md:flex p-2 border border-brand-charcoal rounded-full hover:bg-brand-charcoal hover:text-white transition-all"
            title="Ligar agora"
          >
            <Phone size={18} />
          </a>
          <button
            onClick={() => abrirPedido('')}
            className="text-[10px] uppercase tracking-widest font-bold bg-brand-charcoal text-white px-4 py-3 sm:px-6 sm:py-2.5 rounded-full hover:bg-brand-terracotta transition-all flex items-center gap-2"
          >
            <MessageCircle size={14} /> Solicitar
          </button>
          {/* Ícone do Instagram sai do header enquanto o perfil não tiver posts (doc 12 §1.3);
              o link continua no rodapé. Devolver aqui quando houver 9-12 posts. */}
        </div>
      </header>

      <FloatingWhatsApp onClick={() => abrirPedido('', 'botao_flutuante')} />

      <main className="mt-20">
        {/* HERO */}
        <section className="relative hero-vh flex items-center p-6 md:p-16 overflow-hidden bg-brand-charcoal">
          <div className="absolute inset-0 z-0 scale-110">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              aria-hidden="true"
              poster="/hero-poster.webp"
              src={heroVideo ? 'https://cdn.pixabay.com/video/2017/04/18/8879-214434914_large.mp4' : undefined}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-brand-charcoal/40 to-transparent z-10" />
          </div>

          <div className="relative z-20 max-w-4xl text-brand-cream">
            <m.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-brand-terracotta" />
                <span className="text-xs uppercase tracking-[0.4em] font-semibold text-brand-terracotta-light">
                  Seu momento mais prazeroso na Serra da Mantiqueira
                </span>
              </div>
              <SectionHeading level={1} className="text-4xl md:text-6xl lg:text-8xl md:mb-10 text-brand-cream">
                A experiência de um <br />
                <span className="text-brand-terracotta-light italic font-light">ótimo</span> restaurante, <br />
                na sala da sua casa.
              </SectionHeading>
              <p className="text-lg md:text-xl font-light text-brand-cream/70 max-w-xl mb-12 leading-relaxed">
                De um churrasco animado a uma noite de massas e vinho. Comida feita com técnica e afeto, sem você
                precisar levantar da cadeira. Você recebe os abraços — eu assumo o fogão.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => abrirPedido('')}
                  className="group w-full sm:w-auto justify-center bg-brand-terracotta text-white px-8 sm:px-10 py-5 rounded-full text-sm uppercase tracking-widest font-bold shadow-xl hover:bg-white hover:text-brand-charcoal transition-all hover:-translate-y-1 flex items-center gap-3"
                >
                  Solicitar minha experiência
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#experiencias"
                  className="w-full sm:w-auto justify-center px-8 sm:px-10 py-5 rounded-full text-sm uppercase tracking-widest font-bold border border-brand-cream/30 text-brand-cream hover:bg-brand-cream/10 transition-all flex items-center gap-3"
                >
                  Ver experiências
                </a>
              </div>
              <p className="mt-5 text-xs tracking-wide text-brand-cream/60">
                Orçamento sem compromisso · resposta no WhatsApp no mesmo dia
              </p>
            </m.div>
          </div>

          <div className="absolute bottom-10 right-10 z-20 hidden lg:block">
            <div className="flex items-center gap-4 text-brand-cream/40 h-32 uppercase tracking-[0.3em] font-bold text-[10px] [writing-mode:vertical-rl]">
              Serra da Mantiqueira • 1.628m Alt.
            </div>
          </div>
        </section>

        {/* CONCEITO */}
        <section id="conceito" className="py-24 px-6 md:py-32 section-border-top bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-moss font-bold mb-4 block underline underline-offset-8 decoration-brand-terracotta/30 text-center md:text-left">
                01. O Conceito
              </span>
              <SectionHeading className="mt-8">
                Você recebe os abraços,
                <br />
                eu assumo o fogão.
              </SectionHeading>
              <p className="text-xl md:text-2xl font-light text-brand-charcoal/70 leading-relaxed mb-8">
                Seja acendendo a churrasqueira da casa de campo ou usando a cozinha do imóvel de temporada, eu chego
                para somar. Levo a técnica, a organização e o sabor.
              </p>
              <p className="text-xl md:text-2xl font-light text-brand-charcoal/70 leading-relaxed italic border-l-2 border-brand-line pl-6">
                Você aproveita o seu próprio evento como se fosse mais um convidado. Sem estresse e sem pia cheia.
              </p>
            </div>
            <div className="w-full md:w-1/2 flex flex-col sm:flex-row gap-4 relative">
              <div className="absolute -top-10 -left-10 z-30 hidden lg:flex flex-col items-center justify-center w-32 h-32 bg-brand-moss text-brand-cream rounded-full shadow-2xl border-2 border-brand-terracotta rotate-12">
                <Wind className="mb-1 animate-pulse" size={24} />
                <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-center leading-tight">
                  Insumos da
                  <br />
                  Mantiqueira
                </span>
                <div className="absolute inset-0 rounded-full border border-brand-cream/20 scale-90" />
              </div>
              <div className="w-full sm:w-2/3 h-[320px] sm:h-[500px] pill-image ring-8 ring-brand-cream shadow-2xl">
                <img
                  src="/portfolio/conceito-sala.webp"
                  alt="Sala de jantar rústica com vigas expostas e mobiliário de época"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="w-full sm:w-1/3 h-36 sm:h-auto flex flex-row sm:flex-col gap-4">
                <div className="w-1/2 h-full sm:w-full sm:h-1/2 pill-image [@media(hover:hover)]:grayscale hover:grayscale-0 transition-all">
                  <img
                    src="/portfolio/conceito-defumados.webp"
                    alt="Carnes defumadas sobre mesa rústica de madeira"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="w-1/2 h-full sm:w-full sm:h-1/2 pill-image">
                  <img
                    src="/portfolio/harmonizacao-guiada.webp"
                    alt="Vinhos e culinária rústica da Mantiqueira"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIÊNCIAS */}
        <section id="experiencias" className="py-24 px-6 md:py-32 section-border-top bg-brand-cream">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-moss font-bold mb-4 block underline underline-offset-8 decoration-brand-terracotta/30">
                02. As Experiências
              </span>
              <SectionHeading>Como vai ser o seu encontro?</SectionHeading>
              <p className="text-xl text-brand-charcoal/60 font-light">
                Escolha pelo clima do seu momento. Em cada experiência, você seleciona o cardápio — e a sobremesa é
                sempre da <strong className="font-medium text-brand-charcoal">Fernanda Marton Ateliê</strong>.
              </p>
            </div>

            {/* Filtros por porta de ocasião — no mobile viram faixa horizontal rolável
                (empilhados ocupavam ~6 linhas); no md+ voltam ao wrap centralizado */}
            <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 md:gap-3 mb-3 overflow-x-auto md:overflow-visible snap-x -mx-6 px-6 md:mx-0 md:px-0 pb-2 md:pb-0 scrollbar-none">
              <Chip ativo={filtro === 'Todas'} onClick={() => setFiltro('Todas')}>
                Todas
              </Chip>
              {LINHAS.map((l) => (
                <Chip key={l} ativo={filtro === l} onClick={() => setFiltro(l)}>
                  {porta(l).rotulo}
                </Chip>
              ))}
            </div>

            {/* Feedback do filtro (visual + leitores de tela) */}
            <p role="status" aria-live="polite" className="text-center text-xs text-brand-charcoal/70 mb-10">
              {lista.length} experiência{lista.length === 1 ? '' : 's'}
              {filtro === 'Todas' ? '' : ` para ${porta(filtro).rotulo}`}
            </p>

            {/* Grade de experiências */}
            <m.div
              key={filtro}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {lista.map((exp, i) => (
                <ExperienceCard key={exp.slug} exp={exp} index={i} onVer={() => setDetalhe(exp)} />
              ))}
            </m.div>

            <p className="text-center text-sm text-brand-charcoal/70 mt-12 italic">
              Não encontrou exatamente o que imaginou?{' '}
              <button onClick={() => abrirPedido('')} className="text-brand-terracotta font-semibold underline underline-offset-4">
                Conte o que você deseja
              </button>{' '}
              — eu desenho uma experiência sob medida para a sua data.
            </p>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className="py-24 px-6 md:py-32 section-border-top bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-moss font-bold mb-4 block underline underline-offset-8 decoration-brand-terracotta/30">
                03. O Processo
              </span>
              <SectionHeading>Simples como deve ser</SectionHeading>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <StepCard
                number="01"
                icon={<Sparkles size={22} />}
                title="Você faz o pedido"
                description="Escolhe uma experiência (ou conta o que deseja), a data e o número de convidados. Em segundos, o pedido chega no meu WhatsApp."
              />
              <StepCard
                number="02"
                icon={<CalendarHeart size={22} />}
                title="Confirmamos a data"
                description="Conversamos com calma, eu monto o seu orçamento sob medida e reservo o dia com um sinal de 50%. A data passa a ser sua."
              />
              <StepCard
                number="03"
                icon={<ChefHat size={22} />}
                title="A experiência acontece"
                description="Eu orquestro a cozinha. Você aproveita os abraços, a conversa e os sabores — sem se preocupar com nada."
              />
            </div>
          </div>
        </section>

        {/* CHEF + ATELIÊ */}
        <section id="chef" className="py-24 px-6 md:py-32 section-border-top bg-brand-charcoal text-brand-cream overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] overflow-hidden border border-brand-cream/10">
                <img
                  src={chefImage}
                  alt="Chef Rafael Jacob trabalhando na cozinha"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 glass-header p-8 text-brand-charcoal rounded-sm shadow-2xl max-w-xs hidden lg:block">
                <p className="serif text-xl font-bold italic mb-2">"Minha cozinha é sobre hospitalidade."</p>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">— Rafael Jacob</p>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-terracotta-light font-bold mb-4 block underline underline-offset-8 decoration-brand-terracotta-light/30">
                04. O Anfitrião
              </span>
              <SectionHeading className="text-brand-cream">A Arte de Receber Bem</SectionHeading>
              <div className="space-y-6 text-brand-cream/70 font-light leading-relaxed text-lg">
                <p>
                  Sou <strong>Rafael Jacob</strong>. Com mais de 15 anos na alta gastronomia e passagens por
                  restaurantes renomados, meu compromisso é orquestrar a sua cozinha de forma invisível e precisa, para
                  que a sua única tarefa seja desfrutar a companhia dos seus convidados.
                </p>
                <p>
                  Este é um <strong>projeto de família</strong>: enquanto comando o fogo e os cortes, minha esposa{' '}
                  <strong className="text-brand-cream">Fernanda Marton</strong> assina a confeitaria artesanal — o{' '}
                  <a
                    href="https://www.instagram.com/fernandamarton.docesmomentos/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-cream underline decoration-dotted underline-offset-2 hover:text-brand-terracotta transition-colors"
                  >
                    <strong>Fernanda Marton Ateliê</strong>
                  </a>{' '}
                  —, com sobremesas exclusivas que encerram a sua experiência com perfeição.
                </p>
                <p className="italic border-l-2 border-brand-terracotta pl-6 text-brand-cream/90">
                  "Existe uma imensa diferença entre o simples prazer de comer e o prazer da mesa. A ciência dá um nome a
                  essa arte sagrada de dividir a mesa: comensalidade."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section className="py-24 px-6 md:py-32 section-border-top bg-brand-cream/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 opacity-5 pointer-events-none">
            <Heart size={400} />
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-moss font-bold mb-4 block underline underline-offset-8 decoration-brand-terracotta/30">
                05. Depoimentos
              </span>
              <SectionHeading>Memórias de Mesa</SectionHeading>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="A experiência foi impecável. O Chef Rafael assumiu tudo e pude realmente dar atenção aos meus convidados. O sabor da Mantiqueira em cada prato!"
                author="Luciana M."
                location="Campos do Jordão"
              />
              <TestimonialCard
                quote="Nunca comi um churrasco tão técnico na minha própria casa. Organização total, sem bagunça e com muita hospitalidade."
                author="Marcelo S."
                location="Santo Antônio do Pinhal"
              />
              <TestimonialCard
                quote="As massas artesanais estavam divinas e a sobremesa do Ateliê foi o ponto alto. Atendimento discreto e muito profissional."
                author="Beatriz R."
                location="São Bento do Sapucaí"
              />
            </div>
            {GOOGLE_REVIEW_LINK && (
              <div className="text-center mt-16">
                <a
                  href={GOOGLE_REVIEW_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-charcoal/70 hover:text-brand-terracotta transition-colors"
                >
                  <span className="flex gap-0.5 text-brand-terracotta">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </span>
                  Já viveu uma experiência comigo? Deixe a sua avaliação no Google
                </a>
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 px-6 md:py-32 section-border-top bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-moss font-bold mb-4 flex items-center justify-center gap-2">
                <HelpCircle size={14} aria-hidden="true" /> Perguntas Frequentes
              </span>
              <SectionHeading>Dúvidas Comuns</SectionHeading>
            </div>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <AccordionItem key={item.pergunta} title={item.pergunta} content={item.resposta} />
              ))}
            </div>
          </div>
        </section>

        {/* PRE-FOOTER CTA */}
        <section className="relative py-28 md:py-40 flex items-center justify-center text-center px-6 section-border-top overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/hero-poster.webp"
              alt="Fogo e comida"
              className="w-full h-full object-cover opacity-20"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-brand-cream/40" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <SectionHeading>Vamos criar o seu próximo jantar?</SectionHeading>
            <p className="text-lg md:text-xl text-brand-charcoal/70 mb-10 font-light italic">
              "A ciência dá um nome a essa arte sagrada de dividir a mesa: comensalidade."
            </p>
            <button
              onClick={() => abrirPedido('')}
              className="inline-flex w-full max-w-md sm:w-auto justify-center items-center gap-4 bg-brand-terracotta text-white px-6 sm:px-12 py-6 text-sm uppercase tracking-[0.15em] sm:tracking-[0.3em] font-bold btn-hover rounded-full shadow-2xl"
            >
              <MessageCircle size={20} />
              Solicitar minha experiência
            </button>
            <p className="mt-5 text-xs tracking-wide text-brand-charcoal/60">
              Orçamento sem compromisso · resposta no WhatsApp no mesmo dia
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-20 section-border-top bg-white border-b-8 border-brand-terracotta">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-left">
          <div>
            <span className="serif text-2xl font-bold text-brand-moss block mb-6">Paladares da Mantiqueira</span>
            <p className="text-xs text-brand-charcoal/60 leading-relaxed max-w-xs">
              Concierge Gastronômico e Personal Chef na Serra da Mantiqueira. Experiências de mesa para os seus momentos
              de celebração — em Campos do Jordão, Santo Antônio do Pinhal, São Bento do Sapucaí e toda a serra até São
              José dos Campos.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-moss mb-8 opacity-50">
              Área de Atendimento
            </h4>
            <ul className="space-y-4 text-xs font-medium text-brand-charcoal/80">
              {CIDADES.map((c) => (
                <li key={c.slug} className="flex gap-2">
                  <MapPin size={14} className="text-brand-terracotta shrink-0" />
                  <a href={`/${c.slug}/`} className="hover:text-brand-terracotta transition-colors">
                    Chef particular em {c.cidade}
                  </a>
                </li>
              ))}
              <li className="flex gap-2 pt-2 border-t border-brand-line">
                <MapPin size={14} className="text-brand-terracotta shrink-0" />
                <span>Toda a Serra da Mantiqueira e o Vale do Paraíba</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-moss mb-8 opacity-50">
              Ocasiões
            </h4>
            <ul className="space-y-4 text-xs font-medium text-brand-charcoal/80">
              {[...SAZONAIS, ...NICHOS].map((o) => (
                <li key={o.slug} className="flex gap-2">
                  <CalendarHeart size={14} className="text-brand-terracotta shrink-0" />
                  <a href={`/${o.slug}/`} className="hover:text-brand-terracotta transition-colors">
                    {o.chip}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-moss mb-8 opacity-50">
              Conecte-se
            </h4>
            <div className="flex gap-6 items-center mb-8">
              <a
                href="https://www.instagram.com/paladaresdamantiqueira/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram do Paladares da Mantiqueira"
                className="w-11 h-11 border border-brand-line rounded-full flex items-center justify-center hover:bg-brand-charcoal hover:text-white transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href={FILTRO_GENERICO}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => rastrearOrcamento('rodape')}
                aria-label="Falar no WhatsApp"
                className="w-11 h-11 border border-brand-line rounded-full flex items-center justify-center hover:bg-brand-charcoal hover:text-white transition-all"
              >
                <MessageCircle size={20} />
              </a>
            </div>
            <p className="text-[10px] text-brand-charcoal/70 uppercase tracking-widest font-bold">
              {WHATSAPP_DISPLAY} · @paladaresdamantiqueira
            </p>
          </div>
        </div>

        {/* pb-24 no mobile: folga para o botão flutuante não cobrir os créditos */}
        <div className="flex flex-col items-center gap-6 px-6 pb-24 md:pb-0">
          <div className="flex gap-4 opacity-70">
            <Heart size={16} className="text-brand-terracotta" />
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40 italic">
              Seu próprio evento, sem estresse e sem pia cheia.
            </span>
          </div>
          <div className="w-full flex flex-col md:flex-row justify-between pt-12 border-t border-brand-line gap-4 max-w-7xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">
              © 2026 Rafael Jacob • Todos os direitos reservados
            </p>
            <a
              href="https://www.instagram.com/fernandamarton.docesmomentos/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-[0.2em] opacity-40 hover:opacity-70 transition-opacity font-bold"
            >
              Doces pela Fernanda Marton Ateliê
            </a>
          </div>
        </div>
      </footer>

      {/* MODAIS */}
      <ExperienciaModal experiencia={detalhe} onFechar={() => setDetalhe(null)} onSolicitar={solicitarDoDetalhe} />
      <PedidoExperiencia
        aberto={pedidoAberto}
        onFechar={() => setPedidoAberto(false)}
        experienciaInicial={pedidoExp}
        origem={pedidoOrigem}
      />
    </div>
    </MotionConfig>
    </LazyMotion>
  );
}
