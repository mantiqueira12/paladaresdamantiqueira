import { ReactNode } from 'react';

export default function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="bg-white p-10 border border-brand-line rounded-2xl hover:-translate-y-2 transition-all duration-500 hover:shadow-xl relative">
      <div className="w-14 h-14 rounded-full bg-brand-cream flex items-center justify-center text-brand-terracotta mb-6">
        {icon}
      </div>
      <span className="serif text-5xl font-bold opacity-5 block mb-2 italic leading-none absolute top-8 right-8">
        {number}
      </span>
      <h3 className="serif text-2xl font-bold mb-4">{title}</h3>
      <p className="text-sm leading-relaxed text-brand-charcoal/60 font-light">{description}</p>
    </div>
  );
}
