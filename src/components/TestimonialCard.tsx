import { Star } from 'lucide-react';

export default function TestimonialCard({
  quote,
  author,
  location,
}: {
  quote: string;
  author: string;
  location: string;
}) {
  return (
    <div className="bg-white p-10 border border-brand-line rounded-2xl flex flex-col h-full italic">
      <div className="flex gap-1 mb-8 text-brand-terracotta">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="currentColor" />
        ))}
      </div>
      <p className="text-base text-brand-charcoal/80 leading-relaxed mb-10 flex-1 font-light">"{quote}"</p>
      <div className="flex items-baseline gap-2 pt-6 border-t border-brand-line">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-moss not-italic">{author}</span>
        <span className="text-[10px] opacity-60 uppercase tracking-widest not-italic">• {location}</span>
      </div>
    </div>
  );
}
