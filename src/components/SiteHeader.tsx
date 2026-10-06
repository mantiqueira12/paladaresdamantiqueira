import { useEffect, useRef, useState } from 'react';
import { Menu, MessageCircle, Phone, X } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../lib/whatsapp';

const LINKS = [
  ['#conceito', 'Conceito'],
  ['#experiencias', 'Experiências'],
  ['#como-funciona', 'Como funciona'],
  ['#chef', 'O Chef'],
];

export default function SiteHeader({ onSolicitar }: { onSolicitar: () => void }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuAberto) return;
    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuAberto(false);
      menuButton.current?.focus();
    };
    document.addEventListener('keydown', fecharComEscape);
    return () => document.removeEventListener('keydown', fecharComEscape);
  }, [menuAberto]);

  const solicitar = () => {
    setMenuAberto(false);
    onSolicitar();
  };

  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <header className="site-header glass-header">
        <div className="site-header-inner">
          <a href="#topo" className="site-brand" onClick={() => setMenuAberto(false)} aria-label="Paladares da Mantiqueira — início">
            <img src="/logo-emblema.png" alt="" width={320} height={98} />
            <span className="site-brand-copy">
              <span className="site-brand-name serif">Paladares da Mantiqueira</span>
              <span className="site-brand-tagline">Concierge Gastronômico</span>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Navegação principal">
            {LINKS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <div className="site-header-actions">
            <a className="header-phone" href={`tel:+${WHATSAPP_NUMBER}`} aria-label="Ligar para Paladares da Mantiqueira"><Phone size={18} /></a>
            <button type="button" className="header-request" onClick={solicitar}>
              <MessageCircle size={15} aria-hidden="true" /><span>Solicitar</span>
            </button>
            <button ref={menuButton} type="button" className="menu-toggle" aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuAberto} aria-controls="menu-mobile" onClick={() => setMenuAberto(!menuAberto)}>
              {menuAberto ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
            </button>
          </div>
        </div>
        <nav id="menu-mobile" className="mobile-nav" aria-label="Navegação mobile" hidden={!menuAberto}>
          {LINKS.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuAberto(false)}>{label}</a>)}
        </nav>
      </header>
    </>
  );
}
