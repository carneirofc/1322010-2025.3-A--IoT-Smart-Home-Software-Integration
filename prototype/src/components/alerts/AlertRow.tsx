"use client";

import Link from "next/link";
import type { Alert } from "@/mocks/types";
import { Button } from "../ui/Button";
import { RuleChip } from "../ui/RuleChip";
import { StateMark } from "../ui/StateMark";
import { SEVERITY_TONE, SEVERITY_WORD, TONE_EDGE } from "../ui/state";
import { AlertDetail } from "./AlertDetail";

const STATE_WORD: Record<Alert["state"]["kind"], string> = {
  open: "Aberto",
  acknowledged: "Reconhecido",
  closed: "Encerrado",
};

function StateColumn({ state }: { state: Alert["state"] }) {
  const time = state.kind === "closed" ? state.at : state.since;
  return (
    <div className="text-small">
      <p className={`font-semibold ${state.kind === "open" ? "text-laranja-ink" : "text-tinta-2"}`}>
        {STATE_WORD[state.kind]} {state.kind === "closed" ? "às" : "desde"}{" "}
        <span className="font-medium font-mono">{time}</span>
      </p>
      {state.kind === "closed" ? <p className="text-tinta-suave">{state.note}</p> : null}
    </div>
  );
}

/** One alert: severity and rule | what happened | state | action. */
export function AlertRow({
  alert,
  onAcknowledge,
}: {
  alert: Alert;
  onAcknowledge: (id: string) => void;
}) {
  const closed = alert.state.kind === "closed";
  const tone = SEVERITY_TONE[alert.severity];
  return (
    <article
      aria-label={`${alert.rule}, ${alert.subject}`}
      className={`grid grid-cols-[190px_1fr_170px_150px] items-center gap-5 border-l-4 py-3 pr-1 pl-4 max-sm:grid-cols-1 max-sm:gap-2 ${
        closed ? "border-l-borda" : TONE_EDGE[tone]
      }`}
    >
      <div>
        <StateMark tone={closed ? "neutral" : tone}>{SEVERITY_WORD[alert.severity]}</StateMark>
        <p className="mt-1 flex items-center gap-1.5 font-semibold">
          <RuleChip rule={alert.rule} />
          {alert.subject}
        </p>
      </div>
      <div>
        <p className={`font-semibold ${closed ? "text-tinta-2" : ""}`}>{alert.title}</p>
        <p className="text-small text-tinta-suave">{alert.description}</p>
      </div>
      <StateColumn state={alert.state} />
      <div className="justify-self-end max-sm:justify-self-start">
        {alert.state.kind === "open" ? (
          <Button tone="primary" onClick={() => onAcknowledge(alert.id)}>
            Reconhecer
          </Button>
        ) : alert.followUp?.href ? (
          <Button asChild>
            <Link href={alert.followUp.href} className="text-tinta-2 no-underline">
              {alert.followUp.label}
            </Link>
          </Button>
        ) : alert.followUp ? (
          <AlertDetail alert={alert} label={alert.followUp.label} />
        ) : null}
      </div>
    </article>
  );
}
