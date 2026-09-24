/**
 * Loads every content file, validates it with Zod and checks cross-references.
 * Runs once per build (memoized). Any error stops the build with a readable message.
 */
import { z } from 'zod';
import {
  artworkSchema,
  bookSchema,
  productSchema,
  profileSchema,
  retailerSchema,
  seriesSchema,
  siteSchema,
  universeSchema,
} from '@content/schemas';
import { site } from '@content/site';
import { profile } from '@content/profile';
import { series } from '@content/series';
import { books } from '@content/books';
import { universes } from '@content/universes';
import { products } from '@content/products';
import { artworks } from '@content/artworks';
import { retailers } from '@content/retailers';

function parse<T extends z.ZodType>(name: string, schema: T, value: unknown): z.output<T> {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new Error(`Invalid content in content/${name}.ts:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

function assertUniqueIds(name: string, items: { id: string }[]) {
  const seen = new Set<string>();
  for (const { id } of items) {
    if (seen.has(id)) throw new Error(`Duplicate id "${id}" in content/${name}.ts`);
    seen.add(id);
  }
}

function assertRef(from: string, field: string, value: string | undefined, ids: Set<string>) {
  if (value !== undefined && !ids.has(value)) {
    throw new Error(`${from}: ${field} "${value}" does not exist`);
  }
}

function load() {
  const data = {
    site: parse('site', siteSchema, site),
    profile: parse('profile', profileSchema, profile),
    series: parse('series', z.array(seriesSchema), series),
    books: parse('books', z.array(bookSchema), books),
    universes: parse('universes', z.array(universeSchema), universes),
    products: parse('products', z.array(productSchema), products),
    artworks: parse('artworks', z.array(artworkSchema), artworks),
    retailers: parse('retailers', z.array(retailerSchema), retailers),
  };

  for (const key of [
    'series',
    'books',
    'universes',
    'products',
    'artworks',
    'retailers',
  ] as const) {
    assertUniqueIds(key, data[key]);
  }

  const ids = (items: { id: string }[]) => new Set(items.map((i) => i.id));
  const seriesIds = ids(data.series);
  const bookIds = ids(data.books);
  const universeIds = ids(data.universes);
  const artworkIds = ids(data.artworks);
  const retailerIds = ids(data.retailers);

  for (const b of data.books) {
    assertRef(`book ${b.id}`, 'seriesId', b.seriesId, seriesIds);
    assertRef(`book ${b.id}`, 'universeId', b.universeId, universeIds);
  }
  for (const u of data.universes) {
    assertRef(`universe ${u.id}`, 'bookId', u.bookId, bookIds);
  }
  for (const p of data.products) {
    assertRef(`product ${p.id}`, 'universeId', p.universeId, universeIds);
    assertRef(`product ${p.id}`, 'bookId', p.bookId, bookIds);
    assertRef(`product ${p.id}`, 'artworkId', p.artworkId, artworkIds);
    for (const o of p.purchaseOptions) {
      if (o.kind === 'external_retailer') {
        assertRef(`product ${p.id}`, 'retailerId', o.retailerId, retailerIds);
      }
    }
  }

  // Slugs must be unique per language, otherwise two pages would share a URL.
  for (const [name, items] of [
    ['universes', data.universes],
    ['products', data.products],
  ] as const) {
    const seen = new Set<string>();
    for (const item of items) {
      for (const [locale, slug] of Object.entries(item.slug)) {
        const key = `${locale}:${slug}`;
        if (seen.has(key))
          throw new Error(`Duplicate ${locale} slug "${slug}" in content/${name}.ts`);
        seen.add(key);
      }
    }
  }

  return data;
}

export type Content = ReturnType<typeof load>;

let cache: Content | undefined;

export function getContent(): Content {
  cache ??= load();
  return cache;
}
