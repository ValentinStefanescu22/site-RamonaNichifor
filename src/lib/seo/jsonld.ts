/**
 * Structured data (schema.org JSON-LD) helping Google understand who Ramona is.
 * https://developers.google.com/search/docs/appearance/structured-data
 */
import { localeSettings, type Locale } from '@/i18n/config';
import type { ProfileVM, SiteVM } from '@/lib/data';

export function personJsonLd(
  profile: ProfileVM,
  site: SiteVM,
  locale: Locale,
  homePath: string,
  imagePath: string,
) {
  const sameAs = [profile.social.instagram, profile.social.facebook].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${site.baseUrl}/#person`,
    name: profile.name,
    url: `${site.baseUrl}${homePath}`,
    image: `${site.baseUrl}${imagePath}`,
    // Only unregulated titles (never „psychologist” / „psychotherapist”).
    jobTitle: profile.roles.filter((r) => r.id !== 'counselor').map((r) => r.title),
    ...(sameAs.length > 0 && { sameAs }),
    inLanguage: localeSettings[locale].hreflang,
  };
}

export function websiteJsonLd(site: SiteVM, locale: Locale, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.baseUrl}/#website`,
    name,
    url: `${site.baseUrl}/`,
    inLanguage: localeSettings[locale].hreflang,
    publisher: { '@id': `${site.baseUrl}/#person` },
  };
}
