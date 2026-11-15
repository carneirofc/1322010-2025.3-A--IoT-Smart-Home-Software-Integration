import Link from "next/link";
import type { ClockTime, Hub } from "@/mocks/types";
import { StateMark } from "../ui/StateMark";

function hubText(hub: Hub): string {
  const hubPart = hub.online ? "Hub online" : "Hub offline";
  return hub.internetOk ? `${hubPart}, internet ok` : `${hubPart}, sem internet`;
}

/** The app mark: a house under the sun, on the library's cyan-to-pink tile. */
function Mark() {
  return (
    <span
      aria-hidden="true"
      className="grid size-9 place-items-center rounded-control border border-borda bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-ciano)_30%,white),color-mix(in_oklab,var(--color-rosa)_28%,white))]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12 12 5l8 7v7a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z" />
        <path d="M18 2.5v1.5M21.5 6H20M20.5 3.5l-1 1" />
      </svg>
    </span>
  );
}

/** Wordmark, hub link state and the instant the screen shows. */
export function Header({ hub, now }: { hub: Hub; now: ClockTime }) {
  return (
    <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-6 pt-4 pb-3 max-sm:flex-wrap max-sm:px-4">
      <Link
        href="/"
        className="flex items-center gap-2.5 font-semibold text-tinta text-title tracking-[-0.02em] no-underline"
      >
        <Mark />
        Casa Monitorada
      </Link>
      <div className="flex items-center gap-5 text-small">
        <StateMark tone={hub.online && hub.internetOk ? "ok" : "critical"}>
          {hubText(hub)}
        </StateMark>
        <p className="text-right text-tinta-suave text-caption leading-tight">
          <time dateTime={now} className="block font-medium font-mono text-heading text-tinta">
            <span className="sr-only">Horário dos dados </span>
            {now}
          </time>
          dados de exemplo
        </p>
      </div>
    </div>
  );
}
