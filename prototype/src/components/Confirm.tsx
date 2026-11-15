import type { ReactNode } from "react";
import { CheckIcon } from "./icons";

/** Green check for a relay command the device confirmed. */
export function Confirm({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 font-semibold text-ok-fg text-sm">
      <CheckIcon size="sm" />
      {children}
    </span>
  );
}
