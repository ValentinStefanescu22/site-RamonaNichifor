/**
 * Single source of truth for the site's languages.
 * Adding a language: add it here, add `messages/<code>.json`, translate the route
 * segments in `src/lib/routing/routes.ts` and the localized fields in `content/`.
 */
export const locales = ['ro', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ro';

type LocaleSettings = {
  /** Text direction; `rtl` for Arabic, Hebrew… (CSS uses logical properties only). */
  dir: 'ltr' | 'rtl';
  /** Value for `hreflang` / `<html lang>`. */
  hreflang: string;
  /** Open Graph locale (`language_TERRITORY`). */
  ogLocale: string;
  /** Short label shown in the language switcher. */
  shortLabel: string;
  /** Language name written in that language (used for accessible labels). */
  nativeName: string;
};

export const localeSettings: Record<Locale, LocaleSettings> = {
  ro: { dir: 'ltr', hreflang: 'ro', ogLocale: 'ro_RO', shortLabel: 'RO', nativeName: 'Română' },
  en: { dir: 'ltr', hreflang: 'en', ogLocale: 'en_US', shortLabel: 'EN', nativeName: 'English' },
};

/** A value that exists once per language, e.g. `{ ro: 'Acasă', en: 'Home' }`. */
export type Localized<T> = Record<Locale, T>;

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}
