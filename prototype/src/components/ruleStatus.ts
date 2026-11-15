import type { Alert, Tone } from "@/mocks/types";
import { SEVERITY_LABEL, SEVERITY_TONE } from "./tones";

const STATE_LABEL: Record<Alert["state"]["kind"], string> = {
  open: "ABERTO",
  acknowledged: "RECONHECIDO",
  closed: "ENCERRADO",
};

/** Card status for a rule: "AVISO · R9 ABERTO" while its alert is not closed. */
export function ruleStatus(alert: Alert | undefined): { tone: Tone; label: string } {
  if (!alert || alert.state.kind === "closed") return { tone: "ok", label: "NORMAL" };
  return {
    tone: SEVERITY_TONE[alert.severity],
    label: `${SEVERITY_LABEL[alert.severity]} · ${alert.rule} ${STATE_LABEL[alert.state.kind]}`,
  };
}
