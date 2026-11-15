import Link from "next/link";
import type { ClockTime, Hub } from "@/mocks/types";
import { StateMark } from "../ui/StateMark";

function hubText(hub: Hub): string {
  const hubPart = hub.online ? "Hub online" : "Hub offline";
  return hub.internetOk ? `${hubPart}, internet ok` : `${hubPart}, sem internet`;
}

/** Wordmark, hub link state and the instant the screen shows. */
export function Header({ hub, now }: { hub: Hub; now: ClockTime }) {
  return (
    <div className="mx-auto flex max-w-page items-end justify-between gap-4 px-6 pt-4 pb-3 max-sm:flex-wrap max-sm:px-4">
      <Link
        href="/"
        className="font-bold font-label text-grafite text-title leading-none no-underline"
      >
        Casa Monitorada
      </Link>
      <div className="flex items-end gap-5 text-small">
        <StateMark tone={hub.online && hub.internetOk ? "ok" : "critical"}>
          {hubText(hub)}
        </StateMark>
        <p className="text-right text-fio leading-tight">
          <time dateTime={now} className="block font-label font-semibold text-grafite text-heading">
            <span className="sr-only">Horário dos dados </span>
            {now}
          </time>
          dados de exemplo
        </p>
      </div>
    </div>
  );
}
