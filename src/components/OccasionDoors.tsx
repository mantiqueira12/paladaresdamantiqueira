import { ArrowUpRight } from 'lucide-react';
import { PORTAS, type Linha } from '../data/experiencias';

export default function OccasionDoors({ onEscolher }: { onEscolher: (linha: Linha) => void }) {
  return (
    <section className="occasion-section" aria-labelledby="occasions-title">
      <div className="occasion-heading">
        <p className="editorial-eyebrow">À mesa, do seu jeito</p>
        <h2 id="occasions-title" className="serif">Como vai ser o seu encontro?</h2>
      </div>
      <div className="occasion-doors">
        {PORTAS.map((item, index) => (
          <button key={item.key} type="button" className="occasion-door" onClick={() => onEscolher(item.key)}>
            <span className="occasion-index" aria-hidden="true">0{index + 1}</span>
            <span className="occasion-name serif">{item.key}<ArrowUpRight size={24} aria-hidden="true" /></span>
            <span className="occasion-description">{item.descricao}</span>
            <span className="occasion-link">Conhecer experiências</span>
          </button>
        ))}
      </div>
    </section>
  );
}
