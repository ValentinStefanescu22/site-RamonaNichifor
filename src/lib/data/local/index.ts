/**
 * Data layer implementation over the local `content/` files.
 * Turns validated content into localized view-models for one language.
 */
import type { Locale } from '@/i18n/config';
import { href, type Audience } from '@/lib/routing/routes';
import { resolvePurchaseActions } from '@/lib/commerce/purchase';
import type { BookData, MediaRefData, ProductData, UniverseData } from '@content/schemas';
import type {
  BookVM,
  ImageVM,
  ProductFilter,
  ProductVM,
  ProfileVM,
  SeriesVM,
  SiteVM,
  UniverseVM,
} from '../types';
import { getContent } from './load';

function image(ref: MediaRefData | undefined, locale: Locale): ImageVM | undefined {
  return ref && { key: ref.key, alt: ref.alt[locale] };
}

function toSeries(id: string | undefined, locale: Locale): SeriesVM | undefined {
  const s = getContent().series.find((x) => x.id === id);
  return s && { id: s.id, name: s.name[locale], description: s.description[locale] };
}

function toBook(b: BookData, locale: Locale): BookVM {
  const universe = getContent().universes.find((u) => u.id === b.universeId);
  return {
    id: b.id,
    title: b.title[locale],
    subtitle: b.subtitle?.[locale],
    series: toSeries(b.seriesId, locale),
    seriesNumber: b.seriesNumber,
    audience: b.audience,
    status: b.status,
    cover: image(b.cover, locale),
    editions: b.editions,
    universeHref:
      universe && href({ key: 'universe', id: universe.id, slug: universe.slug }, locale),
  };
}

function toUniverse(u: UniverseData, locale: Locale): UniverseVM {
  const book = getContent().books.find((b) => b.id === u.bookId)!; // checked in load()
  const route = { key: 'universe', id: u.id, slug: u.slug } as const;
  return {
    id: u.id,
    route,
    href: href(route, locale),
    title: book.title[locale],
    tagline: u.tagline[locale],
    story: u.story[locale],
    accentColor: u.accentColor,
    status: u.status,
    order: u.order,
    book: toBook(book, locale),
  };
}

function toProduct(p: ProductData, locale: Locale): ProductVM {
  const { universes, retailers, profile } = getContent();
  const universe = universes.find((u) => u.id === p.universeId);
  const universeVM = universe && toUniverse(universe, locale);
  return {
    id: p.id,
    type: p.type,
    name: p.name[locale],
    shortDescription: p.shortDescription?.[locale],
    status: p.status,
    image: image(p.images[0], locale),
    universe: universeVM && {
      id: universeVM.id,
      title: universeVM.title,
      href: universeVM.href,
      accentColor: universeVM.accentColor,
    },
    actions: resolvePurchaseActions(p.status, p.purchaseOptions, {
      locale,
      retailerNames: new Map(retailers.map((r) => [r.id, r.name])),
      contact: profile.contact,
      contactPageHref: href({ key: 'contact' }, locale),
    }),
  };
}

export async function getSiteConfig(): Promise<SiteVM> {
  const { site } = getContent();
  return {
    // Env vars let the same code build a preview (pages.dev) and the real domain.
    baseUrl: (process.env.SITE_URL ?? site.baseUrl).replace(/\/$/, ''),
    showHeaderName: site.header.showName,
    allowIndexing: process.env.ALLOW_INDEXING === 'true',
  };
}

export async function getProfile(locale: Locale): Promise<ProfileVM> {
  const { profile } = getContent();
  const roleHref = (roleId: string) => {
    const role = profile.roles.find((r) => r.id === roleId)!;
    return href({ key: 'about' }, locale, role.anchor[locale]);
  };

  return {
    name: profile.name,
    hero: {
      roles: profile.hero.roles[locale],
      lines: profile.hero.lines[locale],
      cta: profile.hero.cta[locale],
      ctaHref: href({ key: 'about' }, locale),
      photo: image(profile.hero.photo, locale)!,
      shortcuts: profile.hero.shortcuts.map((s) => ({
        id: s.id,
        icon: s.icon,
        label: s.label[locale],
        href:
          s.target.kind === 'booksByAudience'
            ? href({ key: 'booksByAudience', audience: s.target.audience }, locale)
            : s.target.kind === 'role'
              ? roleHref(s.target.role)
              : href({ key: s.target.page }, locale),
      })),
    },
    roles: profile.roles.map((r) => ({
      id: r.id,
      title: r.title[locale],
      anchor: r.anchor[locale],
      href: href({ key: 'about' }, locale, r.anchor[locale]),
      summary: r.summary[locale],
      body: r.body[locale],
      image: image(r.image, locale),
    })),
    contact: profile.contact,
    social: profile.social,
    legal: profile.legal,
  };
}

export async function getSeries(locale: Locale): Promise<SeriesVM[]> {
  return getContent().series.map((s) => toSeries(s.id, locale)!);
}

export async function getUniverses(locale: Locale): Promise<UniverseVM[]> {
  return getContent()
    .universes.map((u) => toUniverse(u, locale))
    .sort((a, b) => a.order - b.order);
}

export async function getUniverse(slug: string, locale: Locale): Promise<UniverseVM | undefined> {
  const u = getContent().universes.find((x) => x.slug[locale] === slug);
  return u && toUniverse(u, locale);
}

export async function getUniverseById(id: string, locale: Locale): Promise<UniverseVM | undefined> {
  const u = getContent().universes.find((x) => x.id === id);
  return u && toUniverse(u, locale);
}

export async function getBooksByAudience(audience: Audience, locale: Locale): Promise<BookVM[]> {
  return getContent()
    .books.filter((b) => b.audience === audience)
    .map((b) => toBook(b, locale))
    .sort((a, b) => (a.seriesNumber ?? 0) - (b.seriesNumber ?? 0));
}

export async function getProducts(filter: ProductFilter, locale: Locale): Promise<ProductVM[]> {
  const list = getContent()
    .products.filter(
      (p) =>
        (!filter.universeId || p.universeId === filter.universeId) &&
        (!filter.types || filter.types.includes(p.type)) &&
        (!filter.statuses || filter.statuses.includes(p.status)),
    )
    .sort((a, b) => a.order - b.order)
    .map((p) => toProduct(p, locale));
  return filter.limit ? list.slice(0, filter.limit) : list;
}
