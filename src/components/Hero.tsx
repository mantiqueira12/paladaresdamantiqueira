import { ArrowDown, ArrowRight } from 'lucide-react';

export default function Hero({ onSolicitar }: { onSolicitar: () => void }) {
  return (
    <section className="editorial-hero" aria-labelledby="hero-title">
      <div className="hero-photo" aria-hidden="true">
        <img src="/hero-poster.webp" srcSet="/hero-poster-720.webp 720w, /hero-poster.webp 1440w" sizes="100vw" alt="" fetchPriority="high" decoding="async" />
      </div>
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow">Seu momento mais prazeroso na Serra da Mantiqueira</p>
          <h1 id="hero-title" className="serif">A experiência de um <span className="hero-title-line"><em>ótimo</em> restaurante,</span> na sala da sua casa.</h1>
          <p className="hero-description">De um churrasco animado a uma noite de massas e vinho. Comida feita com técnica e afeto, sem você precisar levantar da cadeira. Você recebe os abraços — eu assumo o fogão.</p>
          <div className="hero-actions">
            <button type="button" onClick={onSolicitar} className="hero-primary">Solicitar minha experiência <ArrowRight size={17} aria-hidden="true" /></button>
            <a href="#experiencias" className="hero-secondary">Ver experiências <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
          <p className="hero-note">Orçamento sem compromisso · resposta no WhatsApp no mesmo dia</p>
        </div>
        <p className="hero-location">Serra da Mantiqueira</p>
      </div>
    </section>
  );
}
