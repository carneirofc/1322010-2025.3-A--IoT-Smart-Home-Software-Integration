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

/** A breaker lever: up when its circuit (the tab) is on. */
function Lever({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-[18px] w-2.5 flex-none flex-col border-[1.5px] p-px ${
        on ? "justify-start border-white" : "justify-end border-grafite"
      }`}
    >
      <span className={`h-1.5 w-full ${on ? "bg-white" : "bg-grafite"}`} />
    </span>
  );
}

/** The screens as a row of breakers sitting on the board's top rail. */
export function BreakerTabs({ tabs }: { tabs: readonly TabLink[] }) {
  const current = normalise(usePathname());
  return (
    <nav
      aria-label="Telas do painel"
      className="mx-auto flex max-w-page px-6 max-sm:overflow-x-auto max-sm:px-4"
    >
      {tabs.map((tab) => {
        const active = normalise(tab.href) === current;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`-ml-px flex items-center gap-2.5 border border-grafite border-b-0 px-4 pt-2 pb-1.5 font-label font-semibold text-heading no-underline first:ml-0 max-sm:px-3 max-sm:text-body ${
              active ? "bg-grafite text-white" : "bg-papel text-grafite hover:bg-placa"
            }`}
          >
            <Lever on={active} />
            <span className="whitespace-nowrap">{tab.label}</span>
            {tab.badge && tab.badge.count > 0 ? (
              <span
                className={`inline-flex items-center gap-1 whitespace-nowrap font-sans font-semibold text-small ${
                  active ? "text-white" : "text-laranja-ink"
                }`}
              >
                <span className="size-2 bg-laranja" aria-hidden="true" />
                {tab.badge.count} {tab.badge.label}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
