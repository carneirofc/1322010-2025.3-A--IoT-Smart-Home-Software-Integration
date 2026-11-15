import type { ReactNode } from "react";

export type MeterFillTone = "brand" | "ok" | "warning" | "ghost";

const FILL_TONE: Record<MeterFillTone, string> = {
  brand: "bg-brand",
  ok: "bg-ok-solid",
  warning: "bg-warning-solid",
  ghost:
    "bg-[repeating-linear-gradient(135deg,var(--color-projection)_0_4px,var(--color-projection-light)_4px_8px)]",
};

export interface MeterFill {
  pct: number;
  tone: MeterFillTone;
}

export interface MeterProps {
  /** Bar height in px. */
  height?: number;
  /** Drawn in order, later fills on top. */
  fills?: readonly MeterFill[];
  /** Highlighted range, e.g. the adequate voltage band. */
  band?: { fromPct: number; toPct: number };
  /** Vertical marks (limits, budgets); `overhang` is how far they stick out. */
  marks?: readonly { pct: number; overhang?: number }[];
  /** Round markers (readings). */
  dots?: readonly number[];
  className?: string;
}

/** Horizontal bar with fills, a band, limit marks and reading dots. */
export function Meter({
  height = 10,
  fills = [],
  band,
  marks = [],
  dots = [],
  className = "",
}: MeterProps) {
  return (
    <div className={`relative rounded-full bg-neutral-bg ${className}`} style={{ height }}>
      {band ? (
        <div
          className="absolute inset-y-0 border border-ok-band bg-ok-bg"
          style={{ left: `${band.fromPct}%`, width: `${band.toPct - band.fromPct}%` }}
        />
      ) : null}
      {fills.map((fill) => (
        <div
          key={`${fill.tone}-${fill.pct}`}
          className={`absolute inset-y-0 left-0 rounded-full ${FILL_TONE[fill.tone]}`}
          style={{ width: `${fill.pct}%` }}
        />
      ))}
      {marks.map((mark) => (
        <div
          key={mark.pct}
          className="absolute -ml-px w-0.5 bg-fg"
          style={{
            left: `${mark.pct}%`,
            top: -(mark.overhang ?? 5),
            bottom: -(mark.overhang ?? 5),
          }}
        />
      ))}
      {dots.map((pct) => (
        <div
          key={pct}
          className="absolute top-1/2 -mt-[7px] -ml-[7px] size-3.5 rounded-full border-2 border-white bg-ok-solid shadow-[0_0_0_1px_var(--color-ok-solid)]"
          style={{ left: `${pct}%` }}
        />
      ))}
    </div>
  );
}

export interface ScaleTick {
  pct: number;
  label: ReactNode;
  strong?: boolean;
}

const tickAlign = (pct: number): string => {
  if (pct <= 0) return "";
  if (pct >= 100) return "-translate-x-full";
  return "-translate-x-1/2";
};

/** Labels under a meter: ends aligned to the edges, the rest centred. */
export function MeterScale({ ticks }: { ticks: readonly ScaleTick[] }) {
  return (
    <div className="relative mt-1.5 h-[18px] text-fg-muted text-xs">
      {ticks.map((tick) => (
        <span
          key={tick.pct}
          className={`absolute top-0 whitespace-nowrap ${tickAlign(tick.pct)} ${
            tick.strong ? "font-semibold text-fg" : ""
          }`}
          style={{ left: `${tick.pct}%` }}
        >
          {tick.label}
        </span>
      ))}
    </div>
  );
}

/** A meter and its scale, announced as one image with a text alternative. */
export function MeterFigure({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div role="img" aria-label={label} className={className}>
      {children}
    </div>
  );
}
