import type { ReactNode } from 'react';

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  /** Background tone of the section. */
  tone?: 'paper' | 'mist' | 'blush';
  align?: 'start' | 'center';
  children?: ReactNode;
  className?: string;
};

const tones = { paper: 'bg-paper', mist: 'bg-mist', blush: 'bg-blush' };

/** Standard page section: optional eyebrow, an `<h2>`, optional intro, content. */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  tone = 'paper',
  align = 'start',
  children,
  className = '',
}: Props) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`${tones[tone]} px-4 py-16 sm:px-6 md:py-24 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        <header className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
          {eyebrow && <p className="eyebrow text-lavender-strong">{eyebrow}</p>}
          <h2 id={headingId} className="mt-3 font-display text-h2 font-normal text-balance">
            {title}
          </h2>
          {intro && <div className="mt-4 text-lg text-muted">{intro}</div>}
        </header>
        {children}
      </div>
    </section>
  );
}
