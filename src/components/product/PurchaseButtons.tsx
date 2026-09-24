import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import type { ProductStatus, PurchaseAction } from '@/lib/data';
import { mailtoUrl, whatsappUrl } from '@/lib/commerce/purchase';
import { buttonClasses } from '@/components/ui/button';
import { Icon } from '@/components/ui/Icon';

type Props = {
  actions: PurchaseAction[];
  productName: string;
  status: ProductStatus;
  locale: Locale;
};

/** Renders the actions resolved by `resolvePurchaseActions` (rules live there, not here). */
export async function PurchaseButtons({ actions, productName, status, locale }: Props) {
  if (actions.length === 0) return null;
  const t = await getTranslations({ locale, namespace: 'product' });
  const tA11y = await getTranslations({ locale, namespace: 'a11y' });

  const inquiryLabel = status === 'sold' ? t('askSimilar') : t('orderByMessage');
  const message =
    status === 'sold'
      ? t('whatsappSimilar', { product: productName })
      : t('whatsappMessage', { product: productName });
  // The first action is the main one; the rest are secondary.
  const variant = (i: number) => (i === 0 ? 'primary' : 'secondary');

  return (
    <ul className="flex flex-wrap gap-2">
      {actions.map((action, i) => {
        const cls = buttonClasses(variant(i), 'min-h-10 px-4 py-2 text-sm');
        switch (action.kind) {
          case 'retailer':
            return (
              <li key={action.retailerId}>
                <a href={action.url} target="_blank" rel="noopener" className={cls}>
                  {t('buyAt', { retailer: action.retailerName })}
                  <span className="sr-only"> {tA11y('opensInNewTab')}</span>
                </a>
              </li>
            );
          case 'whatsapp':
            return (
              <li key="whatsapp">
                <a
                  href={whatsappUrl(action.phone, message)}
                  target="_blank"
                  rel="noopener"
                  className={cls}
                >
                  <Icon name="whatsapp" className="size-4" />
                  {inquiryLabel}
                  <span className="sr-only"> {tA11y('opensInNewTab')}</span>
                </a>
              </li>
            );
          case 'email':
            return (
              <li key="email">
                <a
                  href={mailtoUrl(action.email, t('emailSubject', { product: productName }))}
                  className={cls}
                >
                  <Icon name="mail" className="size-4" />
                  {inquiryLabel}
                </a>
              </li>
            );
          case 'contact_page':
            return (
              <li key="contact">
                <a href={action.href} className={cls}>
                  {inquiryLabel}
                </a>
              </li>
            );
        }
      })}
    </ul>
  );
}
