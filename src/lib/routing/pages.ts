/**
 * Enumerates every page of the site (static routes + routes generated from data).
 * Used by `generateStaticParams`, the page dispatcher and the sitemap.
 */
import { defaultLocale, locales, type Locale, type Localized } from '@/i18n/config';
import { getUniverses } from '@/lib/data';
import {
  alternates,
  audiences,
  routeId,
  routeSegments,
  type RouteKey,
  type RouteRef,
  type StaticRouteKey,
} from './routes';

/**
 * Pages whose final design is built. Others render a „work in progress” placeholder,
 * are `noindex` and stay out of the sitemap. Extend this list with each milestone.
 */
export const implementedRoutes: ReadonlySet<RouteKey> = new Set<RouteKey>(['home']);

export type PageEntry = {
  id: string;
  ref: RouteRef;
  /** Site-relative path per language. */
  paths: Localized<string>;
  implemented: boolean;
};

const staticKeys: StaticRouteKey[] = [
  'home',
  'about',
  'universes',
  'art',
  'products',
  'contact',
  'privacy',
];

export async function getAllPages(): Promise<PageEntry[]> {
  const universes = await getUniverses(defaultLocale);
  const refs: RouteRef[] = [
    ...staticKeys.map((key) => ({ key })),
    ...universes.map((u) => u.route),
    ...audiences.map((audience) => ({ key: 'booksByAudience' as const, audience })),
  ];
  return refs.map((ref) => ({
    id: routeId(ref),
    ref,
    paths: alternates(ref),
    implemented: implementedRoutes.has(ref.key),
  }));
}

/** Params for `app/[locale]/[[...segments]]`. */
export async function getAllPageParams(): Promise<{ locale: Locale; segments: string[] }[]> {
  const pages = await getAllPages();
  return pages.flatMap((page) =>
    locales.map((locale) => ({ locale, segments: routeSegments(page.ref, locale) })),
  );
}

export async function findPage(
  locale: Locale,
  segments: string[] | undefined,
): Promise<PageEntry | undefined> {
  const wanted = (segments ?? []).join('/');
  const pages = await getAllPages();
  return pages.find((page) => routeSegments(page.ref, locale).join('/') === wanted);
}
