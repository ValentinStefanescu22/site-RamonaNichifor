/**
 * Business rules: which purchase buttons a product shows (docs/PLAN.md §3).
 *
 *  available      → retailer buttons with a known link for this language, then „order by message”
 *  made_to_order  → „order by message”
 *  sold           → „ask about similar works” (same inquiry channel)
 *  coming_soon    → nothing (the card shows a „coming soon” badge)
 *  portfolio_only → nothing
 */
import type { Locale } from '@/i18n/config';
import type { PurchaseAction, ProductStatus } from '@/lib/data/types';

type PurchaseOption =
  | { kind: 'external_retailer'; retailerId: string; url?: string; locales?: Locale[] }
  | { kind: 'contact_inquiry'; channel: 'whatsapp' | 'email' };

type Context = {
  locale: Locale;
  retailerNames: ReadonlyMap<string, string>;
  contact: { whatsapp?: string; email?: string };
  /** Used when the requested contact channel isn't configured yet. */
  contactPageHref: string;
};

export function resolvePurchaseActions(
  status: ProductStatus,
  options: PurchaseOption[],
  ctx: Context,
): PurchaseAction[] {
  if (status === 'coming_soon' || status === 'portfolio_only') return [];

  const actions: PurchaseAction[] = [];

  if (status === 'available') {
    for (const option of options) {
      if (option.kind !== 'external_retailer' || !option.url) continue;
      if (option.locales && !option.locales.includes(ctx.locale)) continue;
      actions.push({
        kind: 'retailer',
        retailerId: option.retailerId,
        retailerName: ctx.retailerNames.get(option.retailerId) ?? option.retailerId,
        url: option.url,
      });
    }
  }

  for (const option of options) {
    if (option.kind !== 'contact_inquiry') continue;
    actions.push(resolveInquiry(option.channel, ctx));
  }

  // Avoid two identical fallback buttons (e.g. WhatsApp + e-mail both missing).
  return actions.filter(
    (action, i) =>
      action.kind !== 'contact_page' || actions.findIndex((a) => a.kind === 'contact_page') === i,
  );
}

function resolveInquiry(channel: 'whatsapp' | 'email', ctx: Context): PurchaseAction {
  const { whatsapp, email } = ctx.contact;
  if (channel === 'whatsapp' && whatsapp) return { kind: 'whatsapp', phone: whatsapp };
  if (email) return { kind: 'email', email };
  return { kind: 'contact_page', href: ctx.contactPageHref };
}

/** WhatsApp click-to-chat link with a pre-filled message. */
export function whatsappUrl(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(email: string, subject: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
