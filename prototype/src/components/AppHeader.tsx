import Link from "next/link";
import type { ClockTime, Hub } from "@/mocks/types";
import { ClockIcon, HomeIcon } from "./icons";

function hubLabel(hub: Hub): string {
  const hubText = hub.online ? "Hub online" : "Hub offline";
  const netText = hub.internetOk ? "internet OK" : "sem internet";
  return `${hubText} · ${netText}`;
}

export function AppHeader({ hub, now }: { hub: Hub; now: ClockTime }) {
  return (
    <header className="bg-brand text-white">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between gap-4 px-6 max-sm:h-auto max-sm:flex-wrap max-sm:px-4 max-sm:py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-md text-white tracking-[0.01em] no-underline"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-white/14">
            <HomeIcon />
          </span>
          Casa Monitorada
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-[5px] font-semibold text-white ${
              hub.online ? "bg-ok-solid" : "bg-critical-solid"
            }`}
          >
            <span className="size-2 rounded-full bg-ok-glow" aria-hidden="true" />
            {hubLabel(hub)}
          </span>
          <time
            dateTime={now}
            className="inline-flex items-center gap-1.5 font-semibold text-md tabular-nums"
          >
            <ClockIcon size="sm" />
            <span className="sr-only">Horário atual </span>
            {now}
          </time>
        </div>
      </div>
    </header>
  );
}
