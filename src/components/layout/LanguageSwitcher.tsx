export type LanguageLink = {
  locale: string;
  href: string;
  shortLabel: string;
  nativeName: string;
  hreflang: string;
  current: boolean;
};

type Props = { languages: LanguageLink[]; label: string; className?: string };

/** Links to the same page in every language (URLs come from the route registry). */
export function LanguageSwitcher({ languages, label, className = '' }: Props) {
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-1">
        {languages.map((lang) => (
          <li key={lang.locale}>
            <a
              href={lang.href}
              hrefLang={lang.hreflang}
              lang={lang.hreflang}
              aria-current={lang.current ? 'true' : undefined}
              aria-label={lang.nativeName}
              className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-full px-2 caps text-sm transition-colors ${
                lang.current ? 'bg-blush text-ink' : 'text-muted hover:text-lavender-strong'
              }`}
            >
              {lang.shortLabel}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
