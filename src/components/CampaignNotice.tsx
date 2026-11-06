import { ArrowRight } from 'lucide-react';
import campanhaAtual from '../data/campanha.json';

/** Campanha editorial no fluxo da página. A flag ativa permite encerrar ou trocar o destaque. */
export default function CampaignNotice({ campanha = campanhaAtual }: { campanha?: typeof campanhaAtual }) {
  if (!campanha.ativa) return null;
  return (
    <aside className="campaign-notice" aria-label="Campanha em destaque" data-campaign={campanha.id}>
      <div className="campaign-notice-inner">
        <div className="campaign-notice-copy">
          <h2>{campanha.titulo}</h2>
          <p>{campanha.descricao}</p>
        </div>
        <div className="campaign-notice-action">
          <a href={campanha.href}>{campanha.acao}<ArrowRight size={17} aria-hidden="true" /></a>
          {campanha.segundaAcao && campanha.segundoHref && (
            <a href={campanha.segundoHref}>{campanha.segundaAcao}<ArrowRight size={17} aria-hidden="true" /></a>
          )}
          <p>{campanha.prazo}</p>
        </div>
      </div>
    </aside>
  );
}
