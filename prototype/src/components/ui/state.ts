import type { Severity, Tone } from "@/mocks/types";

/** State colours: ink for text, solid for dots, tint for grounds, edge for rows. */
export const TONE_INK: Record<Tone, string> = {
  ok: "text-lima-ink",
  attention: "text-ambar-ink",
  warning: "text-laranja-ink",
  critical: "text-vermelho-ink",
  neutral: "text-tinta-suave",
};

export const TONE_SOLID: Record<Tone, string> = {
  ok: "bg-lima",
  attention: "bg-ambar",
  warning: "bg-laranja",
  critical: "bg-vermelho",
  neutral: "bg-borda",
};

export const TONE_TINT: Record<Tone, string> = {
  ok: "bg-lima-tint",
  attention: "bg-ambar-tint",
  warning: "bg-laranja-tint",
  critical: "bg-vermelho-tint",
  neutral: "bg-nevoa",
};

export const TONE_EDGE: Record<Tone, string> = {
  ok: "border-l-lima",
  attention: "border-l-ambar",
  warning: "border-l-laranja",
  critical: "border-l-vermelho",
  neutral: "border-l-borda",
};

export const SEVERITY_TONE: Record<Severity, Exclude<Tone, "ok" | "neutral">> = {
  attention: "attention",
  warning: "warning",
  critical: "critical",
};

export const SEVERITY_WORD: Record<Severity, string> = {
  attention: "Atenção",
  warning: "Aviso",
  critical: "Crítico",
};
