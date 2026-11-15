"use client";

import { CyberPanel, EmptyState, SegmentedControl } from "@carneirofc/ui";
import { useState } from "react";
import type { Alert, AlertState } from "@/mocks/types";
import { AlertRow } from "./AlertRow";
import { useAlerts } from "./AlertsState";

type Filter = "all" | AlertState["kind"];

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "open", label: "Abertos" },
  { value: "acknowledged", label: "Reconhecidos" },
  { value: "closed", label: "Encerrados" },
];

const GROUP_TITLE: Record<AlertState["kind"], string> = {
  open: "Abertos",
  acknowledged: "Reconhecidos",
  closed: "Encerrados",
};

/** Open alerts get the screen's CyberPanel; acknowledged a subpanel; closed recede. */
function AlertGroup({
  kind,
  items,
  onAcknowledge,
}: {
  kind: AlertState["kind"];
  items: readonly Alert[];
  onAcknowledge: (id: string) => void;
}) {
  const titleId = `${kind}-title`;
  const content = (
    <>
      <h2 id={titleId} className="mb-1 font-semibold text-heading">
        {GROUP_TITLE[kind]}{" "}
        <span className="font-medium font-mono text-tinta-suave">({items.length})</span>
      </h2>
      <div className="divide-y divide-linha">
        {items.map((alert) => (
          <AlertRow key={alert.id} alert={alert} onAcknowledge={onAcknowledge} />
        ))}
      </div>
    </>
  );
  if (kind === "open") {
    return (
      <CyberPanel
        aria-labelledby={titleId}
        className="mt-4 rounded-panel px-6 py-4 sm:px-6 sm:py-4"
      >
        {content}
      </CyberPanel>
    );
  }
  return (
    <section
      aria-labelledby={titleId}
      className={`mt-5 px-6 ${kind === "acknowledged" ? "cyber-subpanel rounded-sub py-4" : ""}`}
    >
      {content}
    </section>
  );
}

/** Alert list with local-only filters and acknowledgement (no backend). */
export function AlertBoard() {
  const { alerts, acknowledge: onAcknowledge } = useAlerts();
  const [filter, setFilter] = useState<Filter>("all");

  const groups = (["open", "acknowledged", "closed"] as const)
    .filter((kind) => filter === "all" || filter === kind)
    .map((kind) => ({ kind, items: alerts.filter((alert) => alert.state.kind === kind) }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <fieldset>
        <legend className="sr-only">Filtrar alertas</legend>
        <SegmentedControl
          value={filter}
          options={FILTERS}
          onValueChange={setFilter}
          className="max-w-full flex-wrap gap-1 rounded-control border-borda bg-papel/90 p-1"
          optionClassName="rounded-[8px] px-3.5 py-1.5 font-semibold text-small hover:translate-y-0 shadow-none"
          activeOptionClassName="border-transparent bg-ciano-tint text-tinta shadow-[inset_0_0_0_1px_var(--color-ciano)]"
        />
      </fieldset>
      {groups.map((group) => (
        <AlertGroup
          key={group.kind}
          kind={group.kind}
          items={group.items}
          onAcknowledge={onAcknowledge}
        />
      ))}
      {groups.length === 0 ? (
        <EmptyState className="mt-5 rounded-sub border-borda bg-papel/70 px-6 py-5 text-body">
          Nenhum alerta neste filtro.
        </EmptyState>
      ) : null}
    </>
  );
}
