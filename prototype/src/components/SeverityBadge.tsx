import type { Severity } from "@/mocks/types";
import { SEVERITY_LABEL, SEVERITY_OUTLINE, SEVERITY_SOLID } from "./tones";

/** Solid severity badge; outlined once the alert is closed. */
export function SeverityBadge({
  severity,
  outlined = false,
}: {
  severity: Severity;
  outlined?: boolean;
}) {
  const look = outlined ? `bg-transparent ${SEVERITY_OUTLINE[severity]}` : SEVERITY_SOLID[severity];
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-md px-[9px] py-[3px] font-extrabold text-xs tracking-[0.04em] ${look}`}
    >
      {SEVERITY_LABEL[severity]}
    </span>
  );
}
