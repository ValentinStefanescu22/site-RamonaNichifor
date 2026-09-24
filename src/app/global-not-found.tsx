import type { Metadata } from 'next';
import { locales, localeSettings } from '@/i18n/config';
import { href } from '@/lib/routing/routes';
import roMessages from '@messages/ro.json';
import enMessages from '@messages/en.json';
import { fontVariables } from './fonts';
import '@/styles/globals.css';

/*
 * 404 for any unknown URL (exported as `404.html`, served by Cloudflare Pages).
 * The language is unknown here, so the page is bilingual. Full design: Milestone 4.
 */
const copy = {
  ro: {
    title: 'Pagina nu a fost găsită',
    text: 'Linkul poate fi greșit sau pagina a fost mutată.',
    back: roMessages.placeholder.back,
  },
  en: {
    title: 'Page not found',
    text: 'The link may be wrong or the page has moved.',
    back: enMessages.placeholder.back,
  },
};

export const metadata: Metadata = {
  title: '404 · Ramona Nichifor',
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="ro" className={fontVariables}>
      <body>
        <main className="flex min-h-screen items-center justify-center bg-mist px-4 py-24 text-center">
          <div className="flex max-w-xl flex-col gap-12">
            <p className="font-display text-display text-lavender">404</p>
            {locales.map((locale) => (
              <div key={locale} lang={localeSettings[locale].hreflang}>
                <h1 className="font-display text-h2 font-normal">{copy[locale].title}</h1>
                <p className="mt-3 text-muted">{copy[locale].text}</p>
                <a
                  href={href({ key: 'home' }, locale)}
                  className="mt-4 inline-block text-lavender-strong underline underline-offset-4"
                >
                  {copy[locale].back}
                </a>
              </div>
            ))}
          </div>
        </main>
      </body>
    </html>
  );
}
