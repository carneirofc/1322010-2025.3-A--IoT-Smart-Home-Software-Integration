import type { Severity, Tone } from "@/mocks/types";

/** Bandeira colours: text ink, solid swatch, tinted ground and left edge per state. */
export const TONE_INK: Record<Tone, string> = {
  ok: "text-verde-ink",
  attention: "text-amarela-ink",
  warning: "text-laranja-ink",
  critical: "text-vermelha-ink",
  neutral: "text-fio",
};

export const TONE_SOLID: Record<Tone, string> = {
  ok: "bg-verde",
  attention: "bg-amarela",
  warning: "bg-laranja",
  critical: "bg-vermelha",
  neutral: "bg-linha-forte",
};

export const TONE_TINT: Record<Tone, string> = {
  ok: "bg-verde-tint",
  attention: "bg-amarela-tint",
  warning: "bg-laranja-tint",
  critical: "bg-vermelha-tint",
  neutral: "bg-placa",
};

export const TONE_EDGE: Record<Tone, string> = {
  ok: "border-l-verde",
  attention: "border-l-amarela",
  warning: "border-l-laranja",
  critical: "border-l-vermelha",
  neutral: "border-l-linha",
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
