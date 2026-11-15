import type { Tone } from "@/mocks/types";
import { PILL_TONE } from "./tones";

/** Status chip: a text label plus colour, never colour alone. */
export function StatusPill({ tone, label }: { tone: Tone; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] font-bold text-xs leading-[1.35] tracking-[0.02em] ${PILL_TONE[tone]}`}
    >
      <span className="size-2 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}
