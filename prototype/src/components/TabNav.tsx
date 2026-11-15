"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface TabLink {
  href: string;
  label: string;
  /** Count plus the words a screen reader appends to it. */
  badge?: { count: number; label: string };
}

const normalise = (path: string): string => (path.length > 1 ? path.replace(/\/+$/u, "") : path);

export function TabNav({ tabs }: { tabs: readonly TabLink[] }) {
  const current = normalise(usePathname());
  return (
    <div className="border-line border-b bg-surface">
      <nav
        className="mx-auto flex max-w-page gap-1 px-6 max-sm:overflow-x-auto max-sm:px-4"
        aria-label="Seções do painel"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={normalise(tab.href) === current ? "page" : undefined}
            className="inline-flex items-center gap-2 border-transparent border-b-[3px] px-3.5 pt-[13px] pb-[11px] font-semibold text-base text-fg-muted no-underline hover:text-fg aria-[current=page]:border-brand aria-[current=page]:text-brand max-sm:px-2.5 max-sm:pt-3 max-sm:pb-2.5 max-sm:text-sm"
          >
            {tab.label}
            {tab.badge && tab.badge.count > 0 ? (
              <span className="inline-grid h-[22px] min-w-[22px] place-items-center rounded-full bg-warning-solid px-1.5 font-bold text-white text-xs">
                {tab.badge.count}
                <span className="sr-only"> {tab.badge.label}</span>
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
    </div>
  );
}
