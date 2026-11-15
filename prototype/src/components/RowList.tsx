import type { ReactNode } from "react";

export function RowList({ children }: { children: ReactNode }) {
  return <ul>{children}</ul>;
}

/** List row: leading visual + text on the left, status or time on the right. */
export function Row({ lead, main, aside }: { lead: ReactNode; main: ReactNode; aside: ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-3 border-line border-t py-[7px] first:border-t-0 first:pt-0.5">
      <span className="flex min-w-0 items-center gap-3">
        {lead}
        <span>{main}</span>
      </span>
      {aside}
    </li>
  );
}

export function RowIcon({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-[34px] flex-none place-items-center rounded-lg border border-line bg-surface-muted text-fg-muted">
      {children}
    </span>
  );
}
