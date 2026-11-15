import type { Alert } from "@/mocks/types";
import { Panel } from "../ui/Panel";
import { RuleChip } from "../ui/RuleChip";
import { SEVERITY_TONE, SEVERITY_WORD, TONE_EDGE, TONE_INK } from "../ui/state";

/** Alerts still waiting for someone. */
export function OpenAlerts({ alerts }: { alerts: readonly Alert[] }) {
  const open = alerts.filter((alert) => alert.state.kind === "open");
  return (
    <Panel
      id="open-alerts-title"
      title={open.length === 1 ? "1 alerta aberto" : `${open.length} alertas abertos`}
      link={{ href: "/alertas/", label: "Ver alertas" }}
    >
      <ul className="divide-y divide-linha">
        {open.map((alert) => {
          const tone = SEVERITY_TONE[alert.severity];
          return (
            <li key={alert.id} className={`border-l-4 py-1.5 pl-3 ${TONE_EDGE[tone]}`}>
              <p className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{alert.headline}</span>
                <span className="whitespace-nowrap font-mono text-small text-tinta-suave">
                  {alert.state.kind === "open" ? alert.state.since : null}
                </span>
              </p>
              <p className="flex items-center gap-2 text-small">
                <span className={`font-semibold ${TONE_INK[tone]}`}>
                  {SEVERITY_WORD[alert.severity]}
                </span>
                <RuleChip rule={alert.rule} />
                <span className="text-tinta-suave">{alert.detail}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
