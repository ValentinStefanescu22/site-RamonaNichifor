// Makes `useTranslations` / `getTranslations` keys type-checked against the RO messages.
import type messages from '../../messages/ro.json';
import type { Locale } from './config';

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
