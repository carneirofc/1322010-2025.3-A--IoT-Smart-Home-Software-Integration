import type { ReactNode } from "react";

/** Automation mode or command origin (not a status colour). */
export function ModeTag({ manual = false, children }: { manual?: boolean; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line-strong px-2.5 py-0.5 font-bold text-brand text-sm ${
        manual ? "bg-white" : "bg-brand-soft"
      }`}
    >
      {children}
    </span>
  );
}
