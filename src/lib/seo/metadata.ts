import type { Metadata } from 'next';
import { defaultLocale, localeSettings, locales, type Locale, type Localized } from '@/i18n/config';
import type { SiteVM } from '@/lib/data';

type Input = {
  locale: Locale;
  site: SiteVM;
  /** This page's path in every language. */
  paths: Localized<string>;
  title: string;
  description: string;
  /** Site-relative image URL, 1200×630. */
  ogImage: string;
  /** Use the title as-is instead of „Title · Ramona Nichifor”. */
  absoluteTitle?: boolean;
  noindex?: boolean;
};

/**
 * Per-page metadata: canonical URL, hreflang alternates (+ x-default → default locale),
 * Open Graph and Twitter cards. All URLs are absolute (required by Google and social sites).
 */
export function buildMetadata({
  locale,
  site,
  paths,
  title,
  description,
  ogImage,
  absoluteTitle,
  noindex,
}: Input): Metadata {
  const url = (p: string) => `${site.baseUrl}${p}`;
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [localeSettings[l].hreflang, url(paths[l])]),
  );
  languages['x-default'] = url(paths[defaultLocale]);

  return {
    metadataBase: new URL(site.baseUrl),
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url(paths[locale]), languages },
    openGraph: {
      type: 'website',
      url: url(paths[locale]),
      title,
      description,
      siteName: 'Ramona Nichifor',
      locale: localeSettings[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeSettings[l].ogLocale),
      images: [{ url: url(ogImage), width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [url(ogImage)] },
    robots:
      noindex || !site.allowIndexing
        ? { index: false, follow: !noindex }
        : { index: true, follow: true },
  };
}
