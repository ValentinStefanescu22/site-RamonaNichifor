import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { localeSettings, locales, type Locale, type Localized } from '@/i18n/config';
import { getProfile, getSiteConfig } from '@/lib/data';
import { getNavigation } from '@/lib/navigation';
import { href } from '@/lib/routing/routes';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { LanguageSwitcher, type LanguageLink } from './LanguageSwitcher';

type Props = {
  locale: Locale;
  /** This page's path in every language (for the language switcher). */
  paths: Localized<string>;
  children: ReactNode;
};

/** Skip link + header + main + footer, shared by every page. */
export async function SiteShell({ locale, paths, children }: Props) {
  const [t, tCommon, profile, site, nav] = await Promise.all([
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'common' }),
    getProfile(locale),
    getSiteConfig(),
    getNavigation(locale),
  ]);

  const languages: LanguageLink[] = locales.map((l) => ({
    locale: l,
    href: paths[l],
    shortLabel: localeSettings[l].shortLabel,
    nativeName: localeSettings[l].nativeName,
    hreflang: localeSettings[l].hreflang,
    current: l === locale,
  }));

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-paper px-5 py-3 shadow-lift focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {t('skipToContent')}
      </a>
      <SiteHeader
        items={nav}
        name={profile.name}
        homeHref={href({ key: 'home' }, locale)}
        showName={site.showHeaderName}
        currentHref={paths[locale]}
        labels={{
          nav: t('mainNav'),
          open: t('openMenu'),
          close: t('closeMenu'),
          comingSoon: tCommon('comingSoon'),
          home: t('homeLink'),
        }}
        languageSwitcher={<LanguageSwitcher languages={languages} label={t('languageSwitcher')} />}
      />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <SiteFooter locale={locale} profile={profile} nav={nav} languages={languages} />
    </>
  );
}
