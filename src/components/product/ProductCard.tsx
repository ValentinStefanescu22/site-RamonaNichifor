import type { CSSProperties } from 'react';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import type { ProductVM } from '@/lib/data';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { ComingSoonBadge, ImagePlaceholder } from '@/components/ui/ComingSoon';
import { PurchaseButtons } from './PurchaseButtons';

type Props = { product: ProductVM; locale: Locale; headingLevel?: 'h3' | 'h4' };

/** Product card: image, type, name, status, purchase buttons. No detail page yet (PLAN §12b). */
export async function ProductCard({ product, locale, headingLevel: Heading = 'h3' }: Props) {
  const t = await getTranslations({ locale, namespace: 'product' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const accent = { '--accent': product.universe?.accentColor } as CSSProperties;

  return (
    <article
      style={accent}
      className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper shadow-soft"
    >
      <div className="relative">
        {product.image ? (
          <ResponsiveImage
            image={product.image}
            sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 45vw, 80vw"
            className="aspect-square w-full object-cover"
          />
        ) : (
          <ImagePlaceholder label={tCommon('imageComingSoon')} aspect="aspect-square" />
        )}
        {product.status !== 'available' && (
          <ComingSoonBadge
            label={t(`status.${product.status}`)}
            className="absolute start-3 top-3 bg-paper/90 shadow-soft"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="eyebrow text-lavender-strong">{t(`types.${product.type}`)}</p>
        <Heading className="font-display text-h3 leading-tight">{product.name}</Heading>
        {product.shortDescription && (
          <p className="text-sm text-muted">{product.shortDescription}</p>
        )}
        <div className="mt-auto pt-2">
          <PurchaseButtons
            actions={product.actions}
            productName={product.name}
            status={product.status}
            locale={locale}
          />
        </div>
      </div>
    </article>
  );
}
