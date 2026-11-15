import type { Alert } from "@/mocks/types";
import { Button } from "./Button";
import { Card } from "./Card";
import { SeverityBadge } from "./SeverityBadge";
import { SEVERITY_TONE } from "./tones";

function StateColumn({ state }: { state: Alert["state"] }) {
  const label = "font-extrabold text-sm tracking-[0.03em]";
  switch (state.kind) {
    case "open":
      return (
        <div className="text-sm">
          <p className={`${label} text-warning-fg`}>ABERTO</p>
          <p className="text-fg-muted">desde {state.since}</p>
        </div>
      );
    case "acknowledged":
      return (
        <div className="text-sm">
          <p className={`${label} text-fg`}>RECONHECIDO</p>
          <p className="text-fg-muted">desde {state.since}</p>
        </div>
      );
    case "closed":
      return (
        <div className="text-sm">
          <p className={`${label} text-neutral-fg`}>ENCERRADO {state.at}</p>
          <p className="text-fg-muted">{state.note}</p>
        </div>
      );
  }
}

/** One alert: severity and rule | what happened | state | action. */
export function AlertItem({
  alert,
  onAcknowledge,
}: {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
}) {
  const closed = alert.state.kind === "closed";
  return (
    <Card
      as="article"
      flush
      muted={closed}
      tone={closed ? undefined : SEVERITY_TONE[alert.severity]}
      className="grid grid-cols-[180px_1fr_190px_150px] items-center gap-5 px-5 py-4 max-sm:grid-cols-1 max-sm:gap-3"
    >
      <div>
        <SeverityBadge severity={alert.severity} outlined={closed} />
        <p className="mt-1.5 font-bold">
          {alert.rule} · {alert.subject}
        </p>
      </div>
      <div>
        <p className={`mb-0.5 font-bold ${closed ? "text-fg-muted" : ""}`}>{alert.title}</p>
        <p className="text-fg-muted text-sm">{alert.description}</p>
      </div>
      <StateColumn state={alert.state} />
      <div className="justify-self-end max-sm:justify-self-start">
        {alert.state.kind === "open" ? (
          <Button variant="primary" onClick={() => onAcknowledge?.(alert.id)}>
            Reconhecer
          </Button>
        ) : alert.followUp ? (
          <Button>{alert.followUp}</Button>
        ) : null}
      </div>
    </Card>
  );
}
