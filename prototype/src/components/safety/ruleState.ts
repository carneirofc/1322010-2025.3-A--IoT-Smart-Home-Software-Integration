import type { Alert, Tone } from "@/mocks/types";
import { SEVERITY_TONE, SEVERITY_WORD } from "../ui/state";

const STATE_WORD: Record<Alert["state"]["kind"], string> = {
  open: "aberto",
  acknowledged: "reconhecido",
  closed: "encerrado",
};

/** A rule's state for its panel: "Aviso, R9 aberto" while its alert is not closed. */
export function ruleState(alert: Alert | undefined): { tone: Tone; label: string } {
  if (!alert || alert.state.kind === "closed") return { tone: "ok", label: "Normal" };
  return {
    tone: SEVERITY_TONE[alert.severity],
    label: `${SEVERITY_WORD[alert.severity]}, ${alert.rule} ${STATE_WORD[alert.state.kind]}`,
  };
}
