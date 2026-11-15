import type { Load } from "@/mocks/types";
import { Panel } from "../ui/Panel";
import { RelayDot } from "../ui/RelayDot";

/** Relay state in words; an armed cycle reads as waiting. */
export function loadStateWord(load: Load): string {
  if (load.relay === "on") return "ligada";
  if (load.cycle?.armed) return "aguardando";
  return "desligada";
}

export function LoadsNow({ loads }: { loads: readonly Load[] }) {
  return (
    <Panel id="loads-title" title="Cargas agora" link={{ href: "/cargas/", label: "Ver cargas" }}>
      <ul className="divide-y divide-linha">
        {loads.map((load) => (
          <li key={load.deviceId} className="flex items-center gap-3 py-1.5">
            <RelayDot on={load.relay === "on"} />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold leading-tight">{load.name}</span>
              <span className="text-small text-tinta-suave">{load.summary}</span>
            </span>
            <span
              className={`font-semibold text-small ${
                load.relay === "on" ? "text-ciano-ink" : "text-tinta-suave"
              }`}
            >
              {loadStateWord(load)}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
