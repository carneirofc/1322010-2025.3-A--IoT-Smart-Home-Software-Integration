import type { Load } from "@/mocks/types";
import { Lever } from "../ui/Lever";
import { Section } from "../ui/Section";

/** Relay state in words; an armed cycle reads as waiting. */
export function loadStateWord(load: Load): string {
  if (load.relay === "on") return "ligada";
  if (load.cycle?.armed) return "aguardando";
  return "desligada";
}

export function LoadsNow({ loads }: { loads: readonly Load[] }) {
  return (
    <Section id="loads-title" title="Cargas agora" link={{ href: "/cargas/", label: "Ver cargas" }}>
      <ul>
        {loads.map((load) => (
          <li
            key={load.deviceId}
            className="flex items-center gap-3 border-linha border-b py-1.5 last:border-b-0"
          >
            <Lever on={load.relay === "on"} />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold leading-tight">{load.name}</span>
              <span className="text-fio text-small">{load.summary}</span>
            </span>
            <span
              className={`font-label font-semibold text-heading ${
                load.relay === "on" ? "text-grafite" : "text-fio"
              }`}
            >
              {loadStateWord(load)}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
