import type { CSSProperties } from 'react';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import type { UniverseVM } from '@/lib/data';
import { ComingSoonBadge } from '@/components/ui/ComingSoon';
import { BookCover } from './BookCover';

/** Card linking to a universe page; the whole card is clickable. */
export async function UniverseCard({ universe, locale }: { universe: UniverseVM; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'common' });
  const style = { '--accent': universe.accentColor } as CSSProperties;

  return (
    <article style={style} className="group relative flex h-full flex-col">
      <div className="overflow-hidden rounded-card shadow-soft transition-shadow duration-300 group-hover:shadow-lift">
        <div className="transition-transform duration-500 ease-soft group-hover:scale-[1.03]">
          <BookCover
            book={universe.book}
            placeholderLabel={t('coverComingSoon')}
            sizes="(min-width: 64rem) 16rem, 45vw"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-1.5">
        {universe.book.seriesNumber && (
          <p className="eyebrow text-[color-mix(in_oklab,var(--accent)_55%,var(--color-ink))]">
            {t('seriesBook', { number: universe.book.seriesNumber })}
          </p>
        )}
        <h3 className="font-display text-h3 leading-tight">
          {/* Stretched link: the ::after covers the whole card. */}
          <a
            href={universe.href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {universe.title}
          </a>
        </h3>
        <p className="text-sm text-muted">{universe.tagline}</p>
        {universe.status === 'coming_soon' && (
          <ComingSoonBadge label={t('comingSoon')} className="mt-1 self-start" />
        )}
      </div>
      {/* Visible focus ring for the stretched link. */}
      <span className="pointer-events-none absolute -inset-2 rounded-[1.5rem] ring-focus group-has-[a:focus-visible]:ring-3" />
    </article>
  );
}
