import type { MetadataRoute } from 'next';
import { defaultLocale, localeSettings, locales } from '@/i18n/config';
import { getSiteConfig } from '@/lib/data';
import { getAllPages } from '@/lib/routing/pages';

// Generated once at build time into `out/sitemap.xml`.
export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, pages] = await Promise.all([getSiteConfig(), getAllPages()]);
  const url = (p: string) => `${site.baseUrl}${p}`;

  // One entry per page per language, each listing all its language versions (hreflang).
  return pages
    .filter((page) => page.implemented)
    .flatMap((page) =>
      locales.map((locale) => ({
        url: url(page.paths[locale]),
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [localeSettings[l].hreflang, url(page.paths[l])]),
            ),
            'x-default': url(page.paths[defaultLocale]),
          },
        },
      })),
    );
}
