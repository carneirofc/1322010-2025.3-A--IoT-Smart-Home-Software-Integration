import type { ReactNode } from "react";
import type { Tone } from "@/mocks/types";
import { TONE_INK, TONE_SOLID } from "./state";

/** A state dot followed by the word it stands for; colour is never alone. */
export function StateMark({
  tone,
  children,
  className = "",
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold ${TONE_INK[tone]} ${className}`}
    >
      <span
        className={`size-2.5 flex-none rounded-full ring-2 ring-white ${TONE_SOLID[tone]}`}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
