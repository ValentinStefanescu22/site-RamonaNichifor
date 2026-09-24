'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { NavigationItem } from '@/lib/navigation';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';

type Props = {
  items: NavigationItem[];
  name: string;
  homeHref: string;
  showName: boolean;
  currentHref: string;
  labels: { nav: string; open: string; close: string; comingSoon: string; home: string };
  languageSwitcher: ReactNode;
};

/**
 * Sticky, centered header. On desktop the optional name sits above the centered menu;
 * after scrolling it collapses into a thin bar (name hidden, less padding).
 */
export function SiteHeader({
  items,
  name,
  homeHref,
  showName,
  currentHref,
  labels,
  languageSwitcher,
}: Props) {
  const [compact, setCompact] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // A 1px element at the top of the page: when it scrolls out of view, the header compacts.
  // IntersectionObserver is cheaper than listening to every scroll event.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setCompact(!entry?.isIntersecting));
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="absolute top-0 h-px w-px" />
      <header
        data-compact={compact}
        className="group/header sticky top-0 z-40 border-b border-transparent transition-[border-color,box-shadow] duration-300 data-[compact=true]:border-line data-[compact=true]:shadow-soft"
      >
        {/* Blur lives on its own layer: `backdrop-filter` on the header itself would trap
            the phone menu's `position: fixed` panel inside the header's box. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-paper/85 backdrop-blur-md" />
        {/* Phone & tablet: name (or nothing) + language + hamburger */}
        <div className="flex h-(--header-h) items-center justify-between gap-3 px-4 lg:hidden">
          {showName ? (
            <a
              href={homeHref}
              aria-label={labels.home}
              className="caps text-[1.05rem] tracking-[0.18em]"
            >
              {name}
            </a>
          ) : (
            <span />
          )}
          <MobileMenu
            items={items}
            labels={labels}
            currentHref={currentHref}
            footer={languageSwitcher}
          />
        </div>

        {/* Desktop */}
        <div className="relative mx-auto hidden max-w-7xl flex-col items-center px-6 transition-[padding] duration-300 lg:flex lg:pt-3 lg:pb-2 group-data-[compact=true]/header:lg:py-1.5">
          {showName && (
            <a
              href={homeHref}
              aria-label={labels.home}
              className="grid grid-rows-[1fr] caps text-[1.05rem] tracking-[0.3em] transition-[grid-template-rows,opacity] duration-300 group-data-[compact=true]/header:grid-rows-[0fr] group-data-[compact=true]/header:opacity-0"
              tabIndex={compact ? -1 : undefined}
              aria-hidden={compact || undefined}
            >
              <span className="overflow-hidden pb-1">{name}</span>
            </a>
          )}
          <div className="flex w-full items-center justify-center">
            <DesktopNav
              items={items}
              label={labels.nav}
              comingSoonLabel={labels.comingSoon}
              currentHref={currentHref}
            />
            <div className="absolute end-6 bottom-2 group-data-[compact=true]/header:bottom-1.5">
              {languageSwitcher}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
