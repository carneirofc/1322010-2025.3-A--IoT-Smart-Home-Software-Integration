import type { CSSProperties } from "react";

export type KpiSize = "xl" | "compact" | "lg";

const VALUE_SIZE: Record<KpiSize, string> = {
  xl: "text-xl",
  compact: "text-[24px]",
  lg: "text-lg",
};

export interface KpiProps {
  label: string;
  value: string;
  unit?: string;
  size?: KpiSize;
  labelAbove?: boolean;
  valueClassName?: string;
  className?: string;
  style?: CSSProperties;
}

/** Key figure: a large value with its unit, plus a short label. */
export function Kpi({
  label,
  value,
  unit,
  size = "xl",
  labelAbove = false,
  valueClassName = "",
  className = "",
  style,
}: KpiProps) {
  const labelNode = <p className="text-fg-muted text-sm">{label}</p>;
  return (
    <div className={className} style={style}>
      {labelAbove ? labelNode : null}
      <p className={`font-bold leading-[1.1] tabular-nums ${VALUE_SIZE[size]} ${valueClassName}`}>
        {value}
        {unit ? <KpiUnit>{unit}</KpiUnit> : null}
      </p>
      {labelAbove ? null : labelNode}
    </div>
  );
}

export function KpiUnit({ children }: { children: string }) {
  return <small className="ml-0.5 font-semibold text-base text-fg-muted">{children}</small>;
}
