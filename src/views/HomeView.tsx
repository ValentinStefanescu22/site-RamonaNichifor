import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { getProducts, getProfile, getSeries, getSiteConfig, getUniverses } from '@/lib/data';
import { artTabAnchors, href } from '@/lib/routing/routes';
import { personJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';
import { Hero } from '@/components/home/Hero';
import { Section } from '@/components/ui/Section';
import { UniverseCard } from '@/components/universe/UniverseCard';
import { ProductCard } from '@/components/product/ProductCard';
import { ResponsiveImage, mediaUrl } from '@/components/ui/ResponsiveImage';
import { buttonClasses } from '@/components/ui/button';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/seo/JsonLd';
import { whatsappUrl } from '@/lib/commerce/purchase';

export async function HomeView({ locale }: { locale: Locale }) {
  const [t, tContact, tA11y, profile, universes, series, site] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'contact' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getProfile(locale),
    getUniverses(locale),
    getSeries(locale),
    getSiteConfig(),
  ]);
  // Products you can get now come first in the band.
  const statusOrder = {
    available: 0,
    made_to_order: 1,
    sold: 2,
    coming_soon: 3,
    portfolio_only: 4,
  };
  const products = (await getProducts({}, locale)).sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status],
  );
  const mainSeries = series[0];
  const { contact, social } = profile;
  const hasContact = contact.whatsapp || contact.email || social.instagram || social.facebook;

  return (
    <>
      <JsonLd
        data={personJsonLd(
          profile,
          site,
          locale,
          href({ key: 'home' }, locale),
          mediaUrl('portrait'),
        )}
      />
      <JsonLd data={websiteJsonLd(site, locale, profile.name)} />

      <Hero profile={profile} locale={locale} />

      {/* Universes of the series */}
      <Section
        id="universes"
        eyebrow={mainSeries?.name}
        title={t('universes.title')}
        intro={mainSeries && <p>{t('universes.intro', { series: mainSeries.name })}</p>}
      >
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {universes.map((u) => (
            <li key={u.id}>
              <UniverseCard universe={u} locale={locale} />
            </li>
          ))}
        </ul>
        <p className="mt-12">
          <a href={href({ key: 'universes' }, locale)} className={buttonClasses('secondary')}>
            {t('universes.all')}
            <Icon name="arrow" className="size-4 rtl:-scale-x-100" />
          </a>
        </p>
      </Section>

      {/* The four roles, each linking to its section on the About page */}
      <Section id="roles" tone="mist" eyebrow={t('roles.eyebrow')} title={t('roles.title')}>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {profile.roles.map((role) => (
            <li key={role.id} className="flex flex-col rounded-card bg-paper p-6 shadow-soft">
              <h3 className="font-display text-h3 leading-tight">{role.title}</h3>
              <p className="mt-3 flex-1 text-muted">{role.summary}</p>
              <a href={role.href} className={buttonClasses('ghost', 'mt-5 self-start')}>
                {t('roles.more')}
                <span className="sr-only">: {role.title}</span>
                <Icon name="arrow" className="size-4 rtl:-scale-x-100" />
              </a>
            </li>
          ))}
        </ul>
      </Section>

      {/* Art teaser (artworks arrive in Milestone 3) */}
      <section
        aria-labelledby="art-title"
        className="relative isolate overflow-hidden bg-linear-to-br from-[#fdf8fc] to-[#f4f7ff] px-4 py-16 sm:px-6 md:py-24"
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-0 end-0 -z-10 hidden w-1/2 opacity-60 md:block"
        >
          <ResponsiveImage
            image={{ key: 'watercolor', alt: '' }}
            sizes="50vw"
            className="h-full w-full !bg-transparent object-cover object-[80%_75%]"
          />
        </div>
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <p className="eyebrow text-lavender-strong">{t('art.eyebrow')}</p>
            <h2 id="art-title" className="mt-3 font-display text-h2 font-normal text-balance">
              {t('art.title')}
            </h2>
            <p className="mt-5 text-lg text-muted">{t('art.text')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={href({ key: 'art' }, locale, artTabAnchors.originals[locale])}
                className={buttonClasses('primary')}
              >
                {t('art.originals')}
              </a>
              <a
                href={href({ key: 'art' }, locale, artTabAnchors.prints[locale])}
                className={buttonClasses('secondary')}
              >
                {t('art.prints')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Band with all products (horizontal scroll on small screens) */}
      <Section id="products" eyebrow={t('products.eyebrow')} title={t('products.title')}>
        <div
          role="region"
          aria-label={t('products.title')}
          tabIndex={0}
          className="-mx-4 mt-10 [scrollbar-width:thin] overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6"
        >
          <ul className="flex snap-x snap-mandatory gap-5">
            {products.map((p) => (
              <li key={p.id} className="w-[78%] shrink-0 snap-start min-[30rem]:w-[18rem]">
                <ProductCard product={p} locale={locale} />
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8">
          <a href={href({ key: 'products' }, locale)} className={buttonClasses('secondary')}>
            {t('products.all')}
            <Icon name="arrow" className="size-4 rtl:-scale-x-100" />
          </a>
        </p>
      </Section>

      {/* Contact */}
      <Section
        id="contact"
        tone="blush"
        align="center"
        eyebrow={t('contact.eyebrow')}
        title={t('contact.title')}
        intro={<p>{t('contact.text')}</p>}
      >
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {contact.whatsapp && (
            <a
              href={whatsappUrl(contact.whatsapp, '')}
              target="_blank"
              rel="noopener"
              className={buttonClasses('primary')}
            >
              <Icon name="whatsapp" />
              {tContact('whatsapp')}
              <span className="sr-only"> {tA11y('opensInNewTab')}</span>
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className={buttonClasses('secondary', 'tracking-normal normal-case')}
            >
              <Icon name="mail" />
              {contact.email}
            </a>
          )}
          {(['instagram', 'facebook'] as const).map(
            (network) =>
              social[network] && (
                <a
                  key={network}
                  href={social[network]}
                  target="_blank"
                  rel="noopener"
                  className={buttonClasses('secondary')}
                >
                  <Icon name={network} />
                  {tContact(network)}
                  <span className="sr-only"> {tA11y('opensInNewTab')}</span>
                </a>
              ),
          )}
          {!hasContact && (
            <a href={href({ key: 'contact' }, locale)} className={buttonClasses('primary')}>
              {t('contact.cta')}
              <Icon name="arrow" className="size-4 rtl:-scale-x-100" />
            </a>
          )}
        </div>
        {!hasContact && (
          <p className="mt-6 text-center text-sm text-muted">{tContact('detailsSoon')}</p>
        )}
      </Section>
    </>
  );
}
