'use client';

import { useEffect, useRef, useState } from 'react';
import type { NavigationItem } from '@/lib/navigation';
import { Icon } from '@/components/ui/Icon';
import { ComingSoonBadge } from '@/components/ui/ComingSoon';

type Props = {
  items: NavigationItem[];
  label: string;
  comingSoonLabel: string;
  currentHref: string;
};

/**
 * Desktop menu with dropdowns, using the „disclosure” pattern:
 * each parent is a <button aria-expanded> that shows/hides a list of links.
 * Closes on Escape (focus returns to the button), click outside and focus leaving.
 */
export function DesktopNav({ items, label, comingSoonLabel, currentHref }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!openId) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenId(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenId(null);
      navRef.current?.querySelector<HTMLButtonElement>(`[data-nav-button="${openId}"]`)?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openId]);

  const isCurrent = (href?: string) => !!href && href.split('#')[0] === currentHref;

  return (
    <nav ref={navRef} aria-label={label}>
      <ul className="flex items-center justify-center gap-x-1 xl:gap-x-3">
        {items.map((item) =>
          item.children ? (
            <li
              key={item.id}
              className="relative"
              onBlur={(e) => {
                // Close when keyboard focus moves outside this dropdown.
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  setOpenId((id) => (id === item.id ? null : id));
                }
              }}
            >
              <button
                type="button"
                data-nav-button={item.id}
                aria-expanded={openId === item.id}
                aria-controls={`nav-${item.id}`}
                onClick={() => setOpenId((id) => (id === item.id ? null : item.id))}
                className={`flex min-h-11 items-center gap-1 rounded-full px-3 caps text-[0.98rem] transition-colors hover:text-lavender-strong ${
                  item.children.some((c) => isCurrent(c.href)) ? 'text-lavender-strong' : ''
                }`}
              >
                {item.label}
                <Icon
                  name="chevron"
                  className={`size-4 transition-transform duration-200 ${openId === item.id ? 'rotate-180' : ''}`}
                />
              </button>
              <ul
                id={`nav-${item.id}`}
                hidden={openId !== item.id}
                className="absolute start-1/2 top-full z-50 mt-2 w-max min-w-60 -translate-x-1/2 rounded-card border border-line bg-paper p-2 shadow-lift rtl:translate-x-1/2"
              >
                {item.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={child.href}
                      aria-current={isCurrent(child.href) ? 'page' : undefined}
                      onClick={() => setOpenId(null)}
                      className="flex min-h-11 items-center justify-between gap-4 rounded-xl px-4 py-2 text-[0.95rem] transition-colors hover:bg-mist aria-[current=page]:text-lavender-strong"
                    >
                      {child.label}
                      {child.badge && <ComingSoonBadge label={comingSoonLabel} />}
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
                className="flex min-h-11 items-center rounded-full px-3 caps text-[0.98rem] transition-colors hover:text-lavender-strong aria-[current=page]:text-lavender-strong"
              >
                {item.label}
              </a>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
