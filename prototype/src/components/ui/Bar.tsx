import type { ReactNode } from "react";

/** Hatching for a projected (not yet spent) amount. */
export const PROJECTION_FILL =
  "bg-[repeating-linear-gradient(135deg,var(--color-borda)_0_3px,transparent_3px_7px)]";

export type BarFillTone = "accent" | "ink" | "ok" | "warning" | "projection";

const FILL: Record<BarFillTone, string> = {
  accent: "bg-[linear-gradient(90deg,var(--color-ciano),var(--color-rosa))]",
  ink: "bg-violeta",
  ok: "bg-lima",
  warning: "bg-laranja",
  projection: PROJECTION_FILL,
};

export interface BarProps {
  /** Bar height in px. */
  height?: number;
  /** Drawn in order, later fills on top. */
  fills?: readonly { pct: number; tone: BarFillTone }[];
  /** Highlighted range, e.g. the adequate voltage band. */
  band?: { fromPct: number; toPct: number };
  /** Vertical limit marks; `overhang` is how far they stick out. */
  marks?: readonly { pct: number; overhang?: number }[];
  /** Readings drawn as square markers. */
  dots?: readonly number[];
}

/** A rounded gauge: fills, an optional band, limit marks and reading dots. */
export function Bar({ height = 10, fills = [], band, marks = [], dots = [] }: BarProps) {
  return (
    <div className="relative rounded-full border border-borda bg-papel" style={{ height }}>
      {band ? (
        <div
          className="absolute inset-y-0 bg-lima-tint"
          style={{ left: `${band.fromPct}%`, width: `${band.toPct - band.fromPct}%` }}
        />
      ) : null}
      {fills.map((fill) => (
        <div
          key={`${fill.tone}-${fill.pct}`}
          className={`absolute inset-y-0 left-0 rounded-full ${FILL[fill.tone]}`}
          style={{ width: `${fill.pct}%` }}
        />
      ))}
      {marks.map((mark) => (
        <div
          key={mark.pct}
          className="absolute -ml-px w-0.5 rounded-full bg-tinta"
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
          className="absolute top-1/2 -mt-[7px] -ml-[7px] size-3.5 rounded-full border-2 border-papel bg-lima-ink"
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
  /** Anchor the label's end on the tick instead of its centre. */
  align?: "end";
}

const tickAlign = (pct: number, align?: "end"): string => {
  if (align === "end") return "-translate-x-full";
  if (pct <= 0) return "";
  if (pct >= 100) return "-translate-x-full";
  return "-translate-x-1/2";
};

/** Labels under a bar: ends aligned to the edges, the rest centred. */
export function BarScale({ ticks }: { ticks: readonly ScaleTick[] }) {
  return (
    <div className="relative mt-1.5 h-[19px] text-caption text-tinta-suave">
      {ticks.map((tick) => (
        <span
          key={tick.pct}
          className={`absolute top-0 whitespace-nowrap tabular-nums ${tickAlign(tick.pct, tick.align)} ${
            tick.strong ? "font-semibold text-tinta" : ""
          }`}
          style={{ left: `${tick.pct}%` }}
        >
          {tick.label}
        </span>
      ))}
    </div>
  );
}

/** A bar and its scale, announced as one image with a text alternative. */
export function BarFigure({
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
