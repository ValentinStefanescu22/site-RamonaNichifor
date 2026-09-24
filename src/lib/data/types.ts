/**
 * View-models returned by the data layer: already localized, with URLs resolved.
 * Components only ever see these types — never raw content (`Localized<…>`).
 */
import type { MediaKey } from '@media/media.config';
import type { Audience, RouteRef } from '@/lib/routing/routes';

export type ImageVM = { key: MediaKey; alt: string };

export type SiteVM = {
  baseUrl: string;
  showHeaderName: boolean;
  /** Search engines may index the site (false before launch / on preview URLs). */
  allowIndexing: boolean;
};

export type ShortcutVM = {
  id: string;
  icon: 'book' | 'brush' | 'sprout' | 'heart';
  label: string;
  href: string;
};

export type RoleVM = {
  id: 'counselor' | 'author' | 'artist' | 'entrepreneur';
  title: string;
  anchor: string;
  /** Link to this role's section on the About page. */
  href: string;
  summary: string;
  body: string[];
  image?: ImageVM;
};

export type ProfileVM = {
  name: string;
  hero: {
    roles: string[];
    lines: string[];
    cta: string;
    ctaHref: string;
    photo: ImageVM;
    shortcuts: ShortcutVM[];
  };
  roles: RoleVM[];
  contact: { whatsapp?: string; email?: string };
  social: { instagram?: string; facebook?: string };
  legal?: { entityName: string; taxId: string };
};

export type SeriesVM = { id: string; name: string; description: string };

export type EditionVM = {
  language: string;
  format: 'print' | 'ebook' | 'audiobook' | 'video_book';
  isbn?: string;
  year?: number;
  publisher?: string;
  pages?: number;
};

export type PublicationStatus = 'published' | 'coming_soon';

export type BookVM = {
  id: string;
  title: string;
  subtitle?: string;
  series?: SeriesVM;
  seriesNumber?: number;
  audience: Audience;
  status: PublicationStatus;
  cover?: ImageVM;
  editions: EditionVM[];
  /** Page of the book's universe, if it belongs to one. */
  universeHref?: string;
};

export type UniverseVM = {
  id: string;
  route: Extract<RouteRef, { key: 'universe' }>;
  href: string;
  /** The universe is named after its core book. */
  title: string;
  tagline: string;
  story: string[];
  accentColor: string;
  status: PublicationStatus;
  order: number;
  book: BookVM;
};

export type ProductType =
  | 'book'
  | 'ebook'
  | 'audiobook'
  | 'bookmark'
  | 'card_game'
  | 'family_game'
  | 'ceramic'
  | 'print'
  | 'original';

export type ProductStatus =
  'available' | 'coming_soon' | 'made_to_order' | 'sold' | 'portfolio_only';

/** What a visitor can do to get a product. Resolved by `src/lib/commerce/purchase.ts`. */
export type PurchaseAction =
  | { kind: 'retailer'; retailerId: string; retailerName: string; url: string }
  | { kind: 'whatsapp'; phone: string }
  | { kind: 'email'; email: string }
  /** Fallback while contact details are missing. */
  | { kind: 'contact_page'; href: string };

export type ProductVM = {
  id: string;
  type: ProductType;
  name: string;
  shortDescription?: string;
  status: ProductStatus;
  image?: ImageVM;
  universe?: { id: string; title: string; href: string; accentColor: string };
  actions: PurchaseAction[];
};

export type ProductFilter = {
  universeId?: string;
  types?: ProductType[];
  statuses?: ProductStatus[];
  limit?: number;
};
