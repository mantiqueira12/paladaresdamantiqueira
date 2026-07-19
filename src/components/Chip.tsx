import { ReactNode } from 'react';

export default function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`shrink-0 whitespace-nowrap snap-start px-5 py-3 md:py-2.5 rounded-full text-[11px] uppercase tracking-[0.15em] font-bold transition-all border ${
        ativo
          ? 'bg-brand-charcoal text-white border-brand-charcoal'
          : 'bg-transparent text-brand-charcoal/70 border-brand-line hover:border-brand-charcoal/40'
      }`}
    >
      {children}
    </button>
  );
}
