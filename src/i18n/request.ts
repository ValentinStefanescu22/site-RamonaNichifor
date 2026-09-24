import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, isLocale } from './config';

// Loads the UI messages for the locale set by `setRequestLocale()` in the layout/page.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
