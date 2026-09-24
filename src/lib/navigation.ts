/**
 * Main navigation, generated from the route registry + data (never hardcoded):
 * a new universe or role appears in the menu automatically.
 */
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { getBooksByAudience, getProfile, getUniverses } from '@/lib/data';
import { artTabAnchors, audiences, href } from '@/lib/routing/routes';

export type NavigationItem = {
  id: string;
  label: string;
  href?: string;
  children?: NavigationItem[];
  badge?: 'coming_soon';
};

export async function getNavigation(locale: Locale): Promise<NavigationItem[]> {
  const t = await getTranslations({ locale, namespace: 'nav' });
  const [profile, universes] = await Promise.all([getProfile(locale), getUniverses(locale)]);

  const audienceItems = await Promise.all(
    audiences.map(async (audience) => {
      const books = await getBooksByAudience(audience, locale);
      const hasPublished = books.some((b) => b.status === 'published');
      return {
        id: `books-${audience}`,
        label: t(`audience.${audience}`),
        href: href({ key: 'booksByAudience', audience }, locale),
        badge: hasPublished ? undefined : ('coming_soon' as const),
      };
    }),
  );

  return [
    { id: 'home', label: t('home'), href: href({ key: 'home' }, locale) },
    {
      id: 'about',
      label: t('about'),
      // Parents keep an `href` for the footer; the header opens their dropdown instead.
      href: href({ key: 'about' }, locale),
      children: profile.roles.map((role) => ({
        id: `about-${role.id}`,
        label: role.title,
        href: role.href,
      })),
    },
    {
      id: 'books',
      label: t('books'),
      href: href({ key: 'booksByAudience', audience: 'kids' }, locale),
      children: audienceItems,
    },
    {
      id: 'universes',
      label: t('universes'),
      href: href({ key: 'universes' }, locale),
      children: [
        ...universes.map((u) => ({
          id: `universe-${u.id}`,
          label: u.title,
          href: u.href,
          badge: u.status === 'coming_soon' ? ('coming_soon' as const) : undefined,
        })),
        { id: 'universes-all', label: t('allUniverses'), href: href({ key: 'universes' }, locale) },
      ],
    },
    {
      id: 'art',
      label: t('art'),
      href: href({ key: 'art' }, locale),
      children: (['originals', 'prints'] as const).map((tab) => ({
        id: `art-${tab}`,
        label: t(`artTabs.${tab}`),
        href: href({ key: 'art' }, locale, artTabAnchors[tab][locale]),
      })),
    },
    { id: 'products', label: t('products'), href: href({ key: 'products' }, locale) },
    { id: 'contact', label: t('contact'), href: href({ key: 'contact' }, locale) },
  ];
}
