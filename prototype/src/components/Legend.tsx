import type { ReactNode } from "react";

export function Legend({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`flex flex-wrap gap-4 text-fg-muted text-sm ${className}`}>{children}</div>
  );
}

/** One legend entry; `swatch` carries the border classes that draw the sample. */
export function LegendItem({ swatch, children }: { swatch: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-0 ${swatch}`} aria-hidden="true" />
      {children}
    </span>
  );
}
