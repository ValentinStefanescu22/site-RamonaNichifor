'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { NavigationItem } from '@/lib/navigation';
import { Icon } from '@/components/ui/Icon';
import { ComingSoonBadge } from '@/components/ui/ComingSoon';

type Props = {
  items: NavigationItem[];
  labels: { nav: string; open: string; close: string; comingSoon: string };
  currentHref: string;
  /** Rendered at the bottom of the panel (language switcher). */
  footer: ReactNode;
};

/**
 * Phone menu: hamburger button + full-height panel with accordion groups.
 * While open: focus stays inside, page scroll is locked, Escape closes.
 */
export function MobileMenu({ items, labels, currentHref, footer }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab' || !panelRef.current) return;
      // Focus trap: cycle between the menu button and the panel's focusable elements.
      const focusables = [
        buttonRef.current!,
        ...panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([hidden])'),
      ].filter((el) => el.offsetParent !== null);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    // Close automatically if the window grows to desktop size.
    const desktop = window.matchMedia('(min-width: 64rem)');
    const onResize = () => desktop.matches && close(false);

    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onResize);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onResize);
    };
  }, [open]);

  const isCurrent = (href?: string) => !!href && href.split('#')[0] === currentHref;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.open}
        onClick={() => (open ? close(false) : setOpen(true))}
        className="relative z-50 inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-blush"
      >
        <Icon name={open ? 'close' : 'menu'} className="size-6" />
      </button>

      <div
        ref={panelRef}
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-(--header-h) bottom-0 z-40 overflow-y-auto bg-paper px-4 pt-4 pb-10"
      >
        <nav aria-label={labels.nav}>
          <ul className="divide-y divide-line">
            {items.map((item) =>
              item.children ? (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-expanded={expanded === item.id}
                    aria-controls={`m-nav-${item.id}`}
                    onClick={() => setExpanded((id) => (id === item.id ? null : item.id))}
                    className="flex min-h-13 w-full items-center justify-between text-start caps text-lg"
                  >
                    {item.label}
                    <Icon
                      name="chevron"
                      className={`size-5 transition-transform ${expanded === item.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <ul id={`m-nav-${item.id}`} hidden={expanded !== item.id} className="ps-3 pb-3">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <a
                          href={child.href}
                          aria-current={isCurrent(child.href) ? 'page' : undefined}
                          onClick={() => close(false)}
                          className="flex min-h-11 items-center justify-between gap-3 py-2 aria-[current=page]:text-lavender-strong"
                        >
                          {child.label}
                          {child.badge && <ComingSoonBadge label={labels.comingSoon} />}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    onClick={() => close(false)}
                    className="flex min-h-13 items-center caps text-lg aria-[current=page]:text-lavender-strong"
                  >
                    {item.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="mt-6 border-t border-line pt-4">{footer}</div>
      </div>
    </>
  );
}
