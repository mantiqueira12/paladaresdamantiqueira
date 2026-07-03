import { ReactNode } from 'react';

export default function SectionHeading({
  children,
  level = 2,
  className = '',
}: {
  children: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}) {
  const Tag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3';
  return (
    <Tag
      className={`serif font-medium tracking-tight ${
        level === 1
          ? 'text-4xl md:text-6xl lg:text-8xl leading-[1.1]'
          : level === 2
            ? 'text-3xl md:text-5xl mb-6'
            : 'text-xl md:text-2xl mb-4'
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
