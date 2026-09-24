import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { href } from '@/lib/routing/routes';
import { buttonClasses } from '@/components/ui/button';

/** Temporary page for routes whose design is planned for a later milestone. */
export async function PlaceholderView({ locale, title }: { locale: Locale; title: string }) {
  const t = await getTranslations({ locale, namespace: 'placeholder' });
  return (
    <section className="bg-mist px-4 py-24 text-center sm:px-6 md:py-32">
      <div className="mx-auto max-w-xl">
        <p className="eyebrow text-lavender-strong">{t('title')}</p>
        <h1 className="mt-4 font-display text-h1 font-normal">{title}</h1>
        <p className="mt-6 text-lg text-muted">{t('text')}</p>
        <a href={href({ key: 'home' }, locale)} className={buttonClasses('secondary', 'mt-10')}>
          {t('back')}
        </a>
      </div>
    </section>
  );
}
