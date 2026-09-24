import { Minus, Plus } from 'lucide-react';

export default function AccordionItem({ title, content }: { title: string; content: string }) {
  return (
    <details className="group border border-brand-line bg-white rounded-2xl overflow-hidden">
      <summary className="w-full px-8 py-6 flex items-center justify-between gap-4 text-left hover:bg-brand-cream/30 transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="serif text-lg font-bold">{title}</span>
        <span className="text-brand-terracotta shrink-0" aria-hidden="true">
          <Plus size={20} className="group-open:hidden" />
          <Minus size={20} className="hidden group-open:block" />
        </span>
      </summary>
      <div className="px-8 pb-8 text-sm text-brand-charcoal/70 leading-relaxed italic border-t border-brand-line/50">
        <p className="pt-4 max-w-prose">{content}</p>
      </div>
    </details>
  );
}
