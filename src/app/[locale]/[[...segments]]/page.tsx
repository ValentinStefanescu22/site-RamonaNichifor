/**
 * Page dispatcher (ADR 0002). Every URL of the site is generated here from the
 * route registry + data, then rendered by the matching view in `src/views/`.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { isLocale, type Locale } from '@/i18n/config';
import { getSiteConfig } from '@/lib/data';
import { findPage, type PageEntry } from '@/lib/routing/pages';
import { getAllPages } from '@/lib/routing/pages';
import { routeSegments } from '@/lib/routing/routes';
import { buildMetadata } from '@/lib/seo/metadata';
import { ogImages } from '@/components/ui/ResponsiveImage';
import { SiteShell } from '@/components/layout/SiteShell';
import { HomeView } from '@/views/HomeView';
import { PlaceholderView } from '@/views/PlaceholderView';

type Params = { locale: string; segments?: string[] };
type Props = { params: Promise<Params> };

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return [];
  const locale = params.locale;
  const pages = await getAllPages();
  return pages.map((page) => ({ segments: routeSegments(page.ref, locale) }));
}

async function resolve(params: Promise<Params>): Promise<{ locale: Locale; page: PageEntry }> {
  const { locale, segments } = await params;
  if (!isLocale(locale)) notFound();
  const page = await findPage(locale, segments);
  if (!page) notFound();
  return { locale, page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, page } = await resolve(params);
  const [t, site] = await Promise.all([
    getTranslations({ locale, namespace: 'meta' }),
    getSiteConfig(),
  ]);
  const common = { locale, site, paths: page.paths, ogImage: ogImages.default };

  if (page.ref.key === 'home') {
    return buildMetadata({
      ...common,
      title: t('homeTitle'),
      description: t('homeDescription'),
      absoluteTitle: true,
    });
  }
  return buildMetadata({
    ...common,
    title: `${t(`pageTitles.${page.ref.key}`)} · ${t('siteName')}`,
    description: t('homeDescription'),
    absoluteTitle: true,
    // Pages not built yet must not be indexed.
    noindex: !page.implemented,
  });
}

export default async function Page({ params }: Props) {
  const { locale, page } = await resolve(params);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta' });

  let view;
  switch (page.ref.key) {
    case 'home':
      view = <HomeView locale={locale} />;
      break;
    default:
      // Built in later milestones (docs/PLAN.md §14).
      view = <PlaceholderView locale={locale} title={t(`pageTitles.${page.ref.key}`)} />;
  }

  return (
    <SiteShell locale={locale} paths={page.paths}>
      {view}
    </SiteShell>
  );
}
