import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import type { ProfileVM } from '@/lib/data';
import type { NavigationItem } from '@/lib/navigation';
import { Icon } from '@/components/ui/Icon';
import { LanguageSwitcher, type LanguageLink } from './LanguageSwitcher';

type Props = {
  locale: Locale;
  profile: ProfileVM;
  nav: NavigationItem[];
  languages: LanguageLink[];
};

export async function SiteFooter({ locale, profile, nav, languages }: Props) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const tA11y = await getTranslations({ locale, namespace: 'a11y' });
  const tContact = await getTranslations({ locale, namespace: 'contact' });
  // Main links: the top-level menu items (dropdown parents link to their main page).
  const links = nav.flatMap((item) =>
    item.href ? [{ id: item.id, label: item.label, href: item.href }] : [],
  );
  const social = [
    { id: 'instagram', href: profile.social.instagram, label: tContact('instagram') },
    { id: 'facebook', href: profile.social.facebook, label: tContact('facebook') },
  ].filter((s): s is { id: 'instagram' | 'facebook'; href: string; label: string } => !!s.href);

  return (
    <footer className="border-t border-line bg-mist px-4 pt-14 pb-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <p className="caps text-xl tracking-[0.3em]">{profile.name}</p>

        <nav aria-label={tA11y('footerNav')}>
          <ul className="flex flex-wrap justify-center gap-x-2 gap-y-1">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center px-2 hover:text-lavender-strong hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {social.length > 0 && (
          <ul aria-label={tA11y('social')} className="flex gap-3">
            {social.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-paper hover:border-lavender-strong hover:text-lavender-strong"
                >
                  <Icon name={s.id} title={`${s.label} ${tA11y('opensInNewTab')}`} />
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted">{t('language')}</span>
          <LanguageSwitcher languages={languages} label={tA11y('languageSwitcher')} />
        </div>

        <p className="text-sm text-muted">{t('rights', { year: new Date().getFullYear() })}</p>
        {profile.legal && (
          <p className="text-xs text-muted">
            {profile.legal.entityName} · {profile.legal.taxId}
          </p>
        )}
      </div>
    </footer>
  );
}
