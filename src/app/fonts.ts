import localFont from 'next/font/local';

/*
 * Fonts are subset by `scripts/subset-fonts.ts` from the sources in `fonts-src/`:
 * one small WOFF2 per style with exactly the characters the site uses (incl. ă, ș, ț),
 * instead of Google's separate `latin` + `latin-ext` files (~200 KB → ~66 KB).
 * Variable fonts: one file covers weights 400–600.
 */

// One family with both faces, so <em> gets the real italic (never a faux slant).
// Preloaded: the first screen (name, menu, roles) is set in it.
export const cormorant = localFont({
  src: [
    { path: '../generated/fonts/cormorant-garamond.woff2', weight: '400 600', style: 'normal' },
    {
      path: '../generated/fonts/cormorant-garamond-italic.woff2',
      weight: '400 600',
      style: 'italic',
    },
  ],
  variable: '--font-cormorant',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

// Body text; loads right after the CSS, `swap` keeps text visible meanwhile.
export const dmSans = localFont({
  src: '../generated/fonts/dm-sans.woff2',
  weight: '400 600',
  variable: '--font-dm-sans',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

export const fontVariables = `${cormorant.variable} ${dmSans.variable}`;
