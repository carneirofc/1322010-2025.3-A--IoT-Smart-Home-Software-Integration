"use client";

import { useState } from "react";
import type { Alert, AlertState } from "@/mocks/types";
import { AlertItem } from "./AlertItem";
import { Button } from "./Button";

type Filter = "all" | AlertState["kind"];

const FILTERS: readonly { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "open", label: "Abertos" },
  { id: "acknowledged", label: "Reconhecidos" },
  { id: "closed", label: "Encerrados" },
];

const GROUPS: readonly { kind: AlertState["kind"]; title: (count: number) => string }[] = [
  { kind: "open", title: (count) => `Abertos (${count})` },
  { kind: "acknowledged", title: (count) => `Reconhecidos (${count})` },
  { kind: "closed", title: () => "Encerrados" },
];

function acknowledge(alert: Alert): Alert {
  if (alert.state.kind !== "open") return alert;
  return { ...alert, state: { kind: "acknowledged", since: alert.state.since } };
}

/** Alert list with local-only filters and acknowledgement (no backend). */
export function AlertBoard({ initialAlerts }: { initialAlerts: readonly Alert[] }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<Filter>("all");

  const onAcknowledge = (id: string) =>
    setAlerts((current) => current.map((alert) => (alert.id === id ? acknowledge(alert) : alert)));

  const groups = GROUPS.filter((group) => filter === "all" || filter === group.kind)
    .map((group) => ({
      ...group,
      items: alerts.filter((alert) => alert.state.kind === group.kind),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <div>
        <fieldset className="inline-flex gap-0.5 rounded-lg bg-neutral-bg p-[3px]">
          <legend className="sr-only">Filtrar alertas</legend>
          {FILTERS.map((option) => (
            <Button
              key={option.id}
              variant="segment"
              aria-pressed={filter === option.id}
              onClick={() => setFilter(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </fieldset>
      </div>
      {groups.map((group) => (
        <section key={group.kind} aria-labelledby={`${group.kind}-title`}>
          <h2
            id={`${group.kind}-title`}
            className="mt-5 mb-2 font-bold text-fg-muted text-xs uppercase tracking-[0.06em]"
          >
            {group.title(group.items.length)}
          </h2>
          <div className="space-y-3">
            {group.items.map((alert) => (
              <AlertItem key={alert.id} alert={alert} onAcknowledge={onAcknowledge} />
            ))}
          </div>
        </section>
      ))}
      {groups.length === 0 ? (
        <p className="mt-5 text-fg-muted text-sm">Nenhum alerta neste filtro.</p>
      ) : null}
    </>
  );
}
