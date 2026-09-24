/**
 * Content model (docs/PLAN.md §3, ADR 0003).
 *
 * Zod schemas are the single source of truth: TypeScript types are inferred from them
 * and every content file is validated at build time. IDs are stable English strings;
 * slugs are localized and never used as references.
 */
import { z } from 'zod';
import { locales } from '@/i18n/config';
import { mediaKeys } from '@media/media.config';

// ---------- building blocks ----------

/** One value per active language; a missing translation fails the build. */
export const localized = <T extends z.ZodType>(schema: T) => z.record(z.enum(locales), schema);

const text = z.string().trim().min(1);
const localizedText = localized(text);
/** Paragraphs. Inline `_word_` renders as emphasis. */
const richText = localized(z.array(text));
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'IDs are lowercase-kebab-case');
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slugs are lowercase-kebab-case, no diacritics');
const hexColor = z.string().regex(/^#[0-9a-f]{6}$/i);

export const mediaRefSchema = z.object({
  key: z.enum(mediaKeys),
  alt: localized(z.string()), // empty string = decorative image
});

// ---------- site & profile ----------

export const siteSchema = z.object({
  /** Canonical origin, e.g. `https://ramonanichifor.ro` (overridable with SITE_URL). */
  baseUrl: z.url(),
  header: z.object({
    /** Show the small „Ramona Nichifor” above the menu (decision pending). */
    showName: z.boolean(),
  }),
});

export const roleIdSchema = z.enum(['counselor', 'author', 'artist', 'entrepreneur']);

export const roleSchema = z.object({
  id: roleIdSchema,
  title: localizedText,
  /** In-page anchor on the About page, e.g. `autor` / `author`. */
  anchor: localized(slug),
  summary: localizedText,
  body: richText,
  image: mediaRefSchema.optional(),
});

export const shortcutSchema = z.object({
  id: id,
  icon: z.enum(['book', 'brush', 'sprout', 'heart']),
  label: localizedText,
  /** Where the shortcut points; resolved to a URL by the data layer. */
  target: z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('booksByAudience'), audience: z.enum(['kids', 'teens', 'adults']) }),
    z.object({
      kind: z.literal('page'),
      page: z.enum(['about', 'universes', 'art', 'products', 'contact']),
    }),
    z.object({ kind: z.literal('role'), role: roleIdSchema }),
  ]),
});

export const profileSchema = z.object({
  name: text,
  hero: z.object({
    /** Lines under the name, e.g. „Autor · Ilustrator · Antreprenor”. */
    roles: localized(z.array(text)),
    /** Poetic lines; `_word_` renders in italics. */
    lines: localized(z.array(text)),
    cta: localizedText,
    photo: mediaRefSchema,
    shortcuts: z.array(shortcutSchema).length(4),
  }),
  roles: z.array(roleSchema).length(4),
  contact: z.object({
    /** International format without spaces, e.g. `+40722123456`. Missing = not yet provided. */
    whatsapp: z
      .string()
      .regex(/^\+[1-9]\d{7,14}$/)
      .optional(),
    email: z.email().optional(),
  }),
  social: z.object({
    instagram: z.url().optional(),
    facebook: z.url().optional(),
  }),
  /** Seller identification, if Ramona sells directly (to confirm with an accountant). */
  legal: z.object({ entityName: text, taxId: text }).optional(),
});

// ---------- books & universes ----------

export const seriesSchema = z.object({
  id,
  name: localizedText,
  description: localizedText,
});

export const audienceSchema = z.enum(['kids', 'teens', 'adults']);
export const publicationStatusSchema = z.enum(['published', 'coming_soon']);

export const editionSchema = z.object({
  /** Language of this edition (ISO 639-1), not necessarily a site locale. */
  language: z.string().length(2),
  format: z.enum(['print', 'ebook', 'audiobook', 'video_book']),
  isbn: z
    .string()
    .regex(/^97[89]-?\d{1,5}-?\d+-?\d+-?[\dX]$/, 'ISBN-13 with or without hyphens')
    .optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  publisher: text.optional(),
  pages: z.number().int().positive().optional(),
});

export const bookSchema = z.object({
  id,
  title: localizedText,
  subtitle: localizedText.optional(),
  seriesId: id.optional(),
  seriesNumber: z.number().int().positive().optional(),
  universeId: id.optional(),
  audience: audienceSchema,
  status: publicationStatusSchema,
  /** Real cover only. Missing = „Cover coming soon” placeholder. Never invent covers. */
  cover: mediaRefSchema.optional(),
  editions: z.array(editionSchema),
});

export const universeSchema = z
  .object({
    id,
    slug: localized(slug),
    /** The book at the heart of this universe; its title is the universe name. */
    bookId: id,
    tagline: localizedText,
    story: localized(z.array(text)),
    accentColor: hexColor,
    status: publicationStatusSchema,
    order: z.number().int(),
  })
  .refine((u) => u.status !== 'published' || Object.values(u.story).every((p) => p.length > 0), {
    message: 'A published universe needs its story in every language',
  });

// ---------- products & art ----------

export const productTypeSchema = z.enum([
  'book',
  'ebook',
  'audiobook',
  'bookmark',
  'card_game',
  'family_game',
  'ceramic',
  'print',
  'original',
]);

export const productStatusSchema = z.enum([
  'available',
  'coming_soon',
  'made_to_order',
  'sold',
  'portfolio_only',
]);

export const retailerSchema = z.object({ id, name: text });

export const purchaseOptionSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('external_retailer'),
    retailerId: id,
    /** Missing = link not known yet; the button is hidden and `content:check` reports it. */
    url: z.url().optional(),
    /** Limit to some site languages; omitted = all. */
    locales: z.array(z.enum(locales)).optional(),
  }),
  z.object({
    kind: z.literal('contact_inquiry'),
    channel: z.enum(['whatsapp', 'email']),
  }),
  // Future (ADR 0003, PLAN §12a): { kind: 'internal_checkout', provider: 'shopify', variantId }
]);

export const productSchema = z.object({
  id,
  slug: localized(slug),
  type: productTypeSchema,
  name: localizedText,
  shortDescription: localizedText.optional(),
  universeId: id.optional(),
  bookId: id.optional(),
  artworkId: id.optional(),
  images: z.array(mediaRefSchema),
  status: productStatusSchema,
  purchaseOptions: z.array(purchaseOptionSchema),
  /** Not displayed at launch (retailer prices change). */
  price: z.object({ amount: z.number().positive(), currency: z.string().length(3) }).optional(),
  /** Individual product pages come later (PLAN §12b). */
  hasDetailPage: z.boolean().default(false),
  order: z.number().int(),
});

export const artworkSchema = z.object({
  id,
  title: localizedText,
  technique: z.enum(['acrylic', 'watercolor', 'illustration', 'painting']),
  dimensions: z
    .object({ widthCm: z.number().positive(), heightCm: z.number().positive() })
    .optional(),
  year: z.number().int().optional(),
  images: z.array(mediaRefSchema).min(1),
  description: localizedText.optional(),
});

// ---------- inferred types ----------
// `Input` = what you write in content files; `Data` = validated, with defaults applied.

export type SiteInput = z.input<typeof siteSchema>;
export type ProfileInput = z.input<typeof profileSchema>;
export type SeriesInput = z.input<typeof seriesSchema>;
export type BookInput = z.input<typeof bookSchema>;
export type UniverseInput = z.input<typeof universeSchema>;
export type ProductInput = z.input<typeof productSchema>;
export type ArtworkInput = z.input<typeof artworkSchema>;
export type RetailerInput = z.input<typeof retailerSchema>;

export type SiteData = z.output<typeof siteSchema>;
export type ProfileData = z.output<typeof profileSchema>;
export type RoleData = z.output<typeof roleSchema>;
export type ShortcutData = z.output<typeof shortcutSchema>;
export type SeriesData = z.output<typeof seriesSchema>;
export type BookData = z.output<typeof bookSchema>;
export type UniverseData = z.output<typeof universeSchema>;
export type ProductData = z.output<typeof productSchema>;
export type ArtworkData = z.output<typeof artworkSchema>;
export type RetailerData = z.output<typeof retailerSchema>;
export type MediaRefData = z.output<typeof mediaRefSchema>;
export type ProductType = z.output<typeof productTypeSchema>;
export type ProductStatus = z.output<typeof productStatusSchema>;
export type PurchaseOptionData = z.output<typeof purchaseOptionSchema>;
export type RoleId = z.output<typeof roleIdSchema>;
