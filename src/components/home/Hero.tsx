import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import type { ProfileVM } from '@/lib/data';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Emphasis } from '@/components/ui/Emphasis';
import { Icon } from '@/components/ui/Icon';
import { buttonClasses } from '@/components/ui/button';

/**
 * Home hero: big name, roles, poetic lines, CTA, portrait with faded edges,
 * watercolour atmosphere and a (smaller than the mockup) butterfly. Then 4 shortcuts.
 */
export async function Hero({ profile, locale }: { profile: ProfileVM; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const { hero } = profile;

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Decorative watercolour, anchored to the end side. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 end-0 -z-20 w-full opacity-70 md:w-[70%]"
      >
        <ResponsiveImage
          image={{ key: 'watercolor', alt: '' }}
          // Decorative, but it's the largest element on phones (= LCP), so load it early.
          priority
          sizes="(min-width: 48rem) 70vw, 50vw"
          className="h-full w-full !bg-transparent object-cover object-[70%_center]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-paper via-paper/70 to-transparent rtl:bg-linear-to-l"
      />

      <div className="mx-auto grid max-w-6xl gap-4 px-4 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-6 lg:pt-12">
        <div className="relative z-10">
          <h1
            id="hero-title"
            className="font-display text-display font-medium tracking-[0.03em] uppercase"
          >
            {profile.name.split(' ').map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
          </h1>
          <p className="mt-5 font-display text-[clamp(1.2rem,1rem+0.9vw,1.65rem)] leading-snug text-ink">
            {hero.roles.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="mt-8 font-display text-lead text-ink md:mt-10 [&_em]:text-lavender-strong">
            {hero.lines.map((line) => (
              <span key={line} className="block">
                <Emphasis text={line} />
              </span>
            ))}
          </p>
          <a
            href={hero.ctaHref}
            className={buttonClasses('primary', 'mt-8 px-7 py-3 text-base md:mt-10')}
          >
            {hero.cta}
            <Icon name="arrow" className="size-5 rtl:-scale-x-100" />
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <ResponsiveImage
            image={hero.photo}
            priority
            sizes="(min-width: 64rem) 34rem, (min-width: 28rem) 28rem, 92vw"
            className="aspect-[4/5] w-full !bg-transparent fade-edges object-cover object-[center_20%]"
          />
          {/* Butterfly: temporary cut-out from the cover (see media.config.ts). */}
          <div aria-hidden="true" className="absolute end-0 -top-2 w-20 sm:w-28 lg:-top-6 lg:w-32">
            <div className="motion-safe:animate-float">
              <ResponsiveImage
                image={{ key: 'butterfly-accent', alt: '' }}
                sizes="8rem"
                className="h-auto w-full !bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <nav
        aria-label={t('shortcutsLabel')}
        className="relative z-10 mx-auto max-w-5xl px-4 pt-4 pb-12 sm:px-6 md:pb-16"
      >
        <ul className="grid grid-cols-2 gap-2 rounded-[1.75rem] bg-paper/90 p-3 shadow-soft backdrop-blur-sm md:grid-cols-4 md:p-4">
          {hero.shortcuts.map((s) => (
            <li key={s.id}>
              <a
                href={s.href}
                className="group flex h-full flex-col items-center gap-3 rounded-2xl px-2 py-3 text-center hover:bg-mist"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-blush text-lavender-strong transition-colors group-hover:bg-[#e6ddf2]">
                  <Icon name={s.icon} className="size-7" />
                </span>
                <span className="caps text-[0.9rem] leading-snug">{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
