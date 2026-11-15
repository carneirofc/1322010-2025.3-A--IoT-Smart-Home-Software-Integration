"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface TabLink {
  href: string;
  label: string;
  /** Count plus the words shown after it ("2 abertos"). */
  badge?: { count: number; label: string };
}

const normalise = (path: string): string => (path.length > 1 ? path.replace(/\/+$/u, "") : path);

const ACTIVE =
  "border-transparent text-tinta shadow-[0_12px_28px_-16px_rgb(0_183_255/0.55)] [background:linear-gradient(color-mix(in_oklab,white_84%,var(--color-ciano)_16%),color-mix(in_oklab,white_84%,var(--color-ciano)_16%))_padding-box,linear-gradient(120deg,var(--color-ciano),var(--color-rosa))_border-box]";
const IDLE = "border-borda bg-papel/80 text-tinta-2 hover:bg-ui-bg-soft hover:text-tinta";

/** The four screens, styled as the library's sidebar items laid in a row. */
export function NavTabs({ tabs }: { tabs: readonly TabLink[] }) {
  const current = normalise(usePathname());
  return (
    <nav
      aria-label="Telas do painel"
      className="mx-auto flex max-w-page gap-2 px-6 pb-3 max-sm:overflow-x-auto max-sm:px-4"
    >
      {tabs.map((tab) => {
        const active = normalise(tab.href) === current;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2 whitespace-nowrap rounded-control border px-4 py-2 font-semibold text-body no-underline ${
              active ? ACTIVE : IDLE
            }`}
          >
            {tab.label}
            {tab.badge && tab.badge.count > 0 ? (
              <span className="rounded-chip bg-laranja-tint px-1.5 font-semibold text-caption text-laranja-ink">
                <span className="font-mono">{tab.badge.count}</span> {tab.badge.label}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
