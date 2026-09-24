import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isLocale, localeSettings, locales } from '@/i18n/config';
import { fontVariables } from '../fonts';
import '@/styles/globals.css';

// Only the configured locales exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** Root layout: one per language, so `<html lang dir>` is correct for each page. */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale); // enables static rendering with next-intl

  const { hreflang, dir } = localeSettings[locale];
  return (
    <html lang={hreflang} dir={dir} className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
