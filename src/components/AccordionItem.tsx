import { useId, useState } from 'react';
import { m } from 'motion/react';
import { Minus, Plus } from 'lucide-react';

export default function AccordionItem({ title, content }: { title: string; content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const painelId = useId();
  return (
    <div className="border border-brand-line bg-white rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={painelId}
        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-brand-cream/30 transition-colors"
      >
        <h3 className="serif text-lg font-bold">{title}</h3>
        <div className="text-brand-terracotta shrink-0" aria-hidden="true">
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      {isOpen && (
        <m.div
          id={painelId}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-8 pb-8 text-sm text-brand-charcoal/70 leading-relaxed italic border-t border-brand-line/50"
        >
          <p className="pt-4">{content}</p>
        </m.div>
      )}
    </div>
  );
}
