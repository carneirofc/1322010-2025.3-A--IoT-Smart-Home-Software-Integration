import type { Severity, Tone } from "@/mocks/types";

/** Text + tinted background of a status pill. */
export const PILL_TONE: Record<Tone, string> = {
  ok: "bg-ok-bg text-ok-fg",
  attention: "bg-attention-bg text-attention-fg",
  warning: "bg-warning-bg text-warning-fg",
  critical: "bg-critical-bg text-critical-fg",
  neutral: "bg-neutral-bg text-neutral-fg",
};

/** Accent stripe on the left edge of a card. */
export const CARD_ACCENT: Record<Exclude<Tone, "neutral">, string> = {
  ok: "border-l-4 border-l-ok-solid",
  attention: "border-l-4 border-l-attention-solid",
  warning: "border-l-4 border-l-warning-solid",
  critical: "border-l-4 border-l-critical-solid",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  attention: "ATENÇÃO",
  warning: "AVISO",
  critical: "CRÍTICO",
};

export const SEVERITY_SOLID: Record<Severity, string> = {
  attention: "bg-attention-solid text-attention-ink",
  warning: "bg-warning-solid text-white",
  critical: "bg-critical-solid text-white",
};

export const SEVERITY_OUTLINE: Record<Severity, string> = {
  attention: "border-[1.5px] border-current text-attention-fg",
  warning: "border-[1.5px] border-current text-warning-fg",
  critical: "border-[1.5px] border-current text-critical-fg",
};

export const SEVERITY_TONE: Record<Severity, Exclude<Tone, "neutral" | "ok">> = {
  attention: "attention",
  warning: "warning",
  critical: "critical",
};
