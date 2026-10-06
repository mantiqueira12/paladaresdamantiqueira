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
    <div className="scroll-reveal bg-white p-8 md:p-10 border-t border-brand-line relative">
      <div className="w-14 h-14 rounded-full bg-brand-cream flex items-center justify-center text-brand-terracotta mb-6">
        {icon}
      </div>
      <span aria-hidden="true" className="serif text-4xl text-brand-moss block mb-2 italic leading-none absolute top-8 right-8">
        {number}
      </span>
      <h3 className="serif text-2xl font-bold mb-4">{title}</h3>
      <p className="text-sm leading-relaxed text-brand-charcoal/80 font-light">{description}</p>
    </div>
  );
}
