/**
 * Route registry (ADR 0002).
 *
 * Every page of the site is described by a `RouteRef` (what the page is) and turned
 * into a localized path by `path()` / `href()`. Links, hreflang alternates, the language
 * switcher and the sitemap are all derived from here, so they can never disagree.
 *
 * This module is pure: it knows nothing about content files. Parameterized routes
 * (e.g. a universe) receive their localized slugs from the data layer.
 */
import { locales, type Locale, type Localized } from '@/i18n/config';

export type Audience = 'kids' | 'teens' | 'adults';

export const audiences: readonly Audience[] = ['kids', 'teens', 'adults'];

/** Pages without parameters. */
export type StaticRouteKey =
  'home' | 'about' | 'universes' | 'art' | 'products' | 'contact' | 'privacy';

export type RouteRef =
  | { key: StaticRouteKey }
  | { key: 'universe'; id: string; slug: Localized<string> }
  | { key: 'booksByAudience'; audience: Audience };

export type RouteKey = RouteRef['key'];

/** Translated path segments per route. Changing a value here changes the public URL. */
const baseSegments: Record<RouteKey, Localized<string[]>> = {
  home: { ro: [], en: [] },
  about: { ro: ['despre-mine'], en: ['about'] },
  universes: { ro: ['universuri'], en: ['universes'] },
  universe: { ro: ['universuri'], en: ['universes'] },
  booksByAudience: { ro: ['carti'], en: ['books'] },
  art: { ro: ['arta'], en: ['art'] },
  products: { ro: ['produse'], en: ['products'] },
  contact: { ro: ['contact'], en: ['contact'] },
  privacy: { ro: ['confidentialitate'], en: ['privacy'] },
};

const audienceSegments: Record<Audience, Localized<string>> = {
  kids: { ro: 'copii', en: 'kids' },
  teens: { ro: 'adolescenti', en: 'teens' },
  adults: { ro: 'adulti', en: 'adults' },
};

/** Path segments after the locale prefix, e.g. `['universuri', 'fluturele-dansator-de-step']`. */
export function routeSegments(ref: RouteRef, locale: Locale): string[] {
  const base = baseSegments[ref.key][locale];
  switch (ref.key) {
    case 'universe':
      return [...base, ref.slug[locale]];
    case 'booksByAudience':
      return [...base, audienceSegments[ref.audience][locale]];
    default:
      return base;
  }
}

/** Site-relative path with trailing slash, e.g. `/ro/despre-mine/`. */
export function path(ref: RouteRef, locale: Locale): string {
  const segments = [locale, ...routeSegments(ref, locale)];
  return `/${segments.join('/')}/`;
}

/** Link target for `<a href>`; `hash` is an in-page anchor without `#`. */
export function href(ref: RouteRef, locale: Locale, hash?: string): string {
  return hash ? `${path(ref, locale)}#${hash}` : path(ref, locale);
}

/** The same page in every language: `{ ro: '/ro/…/', en: '/en/…/' }`. */
export function alternates(ref: RouteRef): Localized<string> {
  return Object.fromEntries(locales.map((l) => [l, path(ref, l)])) as Localized<string>;
}

/** Stable identity of a page, independent of language (used for lookups and tests). */
export function routeId(ref: RouteRef): string {
  switch (ref.key) {
    case 'universe':
      return `universe:${ref.id}`;
    case 'booksByAudience':
      return `books:${ref.audience}`;
    default:
      return ref.key;
  }
}

/** In-page anchors of the Art page tabs. */
export const artTabAnchors: Record<'originals' | 'prints', Localized<string>> = {
  originals: { ro: 'originale', en: 'originals' },
  prints: { ro: 'printuri', en: 'prints' },
};
