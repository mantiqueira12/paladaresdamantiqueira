import { m } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp({ onClick }: { onClick: () => void }) {
  // Abre o formulário de pedido (lead chega qualificado no WhatsApp) em vez do
  // link cru do wa.me. O evento GA4 dispara no envio, com origem=botao_flutuante.
  return (
    <m.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] md:right-8 md:bottom-8 z-[100] bg-brand-charcoal text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all"
      title="Solicitar orçamento pelo WhatsApp"
      aria-label="Solicitar orçamento pelo WhatsApp"
    >
      <MessageCircle size={28} aria-hidden="true" />
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-terracotta rounded-full motion-safe:animate-ping" />
      <div className="absolute top-0 right-0 w-3 h-3 bg-brand-terracotta rounded-full" />
    </m.button>
  );
}
