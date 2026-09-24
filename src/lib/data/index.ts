/**
 * Public data interface (ADR 0003).
 *
 * Components and pages import ONLY from here. Today the implementation reads local
 * files (`./local`); a CMS or Shopify implementation can replace it without touching
 * any component, as long as it keeps these signatures.
 */
export {
  getSiteConfig,
  getProfile,
  getSeries,
  getUniverses,
  getUniverse,
  getUniverseById,
  getBooksByAudience,
  getProducts,
} from './local';

export type * from './types';
