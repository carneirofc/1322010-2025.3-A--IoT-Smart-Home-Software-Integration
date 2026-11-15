import { InfoChip } from "@carneirofc/ui";
import type { RuleId } from "@/mocks/types";

/** Rule reference ("R9") as the library's info chip, set in mono. */
export function RuleChip({ rule, className = "" }: { rule: RuleId; className?: string }) {
  return (
    <InfoChip
      title={`Regra ${rule}`}
      className={`rounded-chip px-1.5 py-0 font-medium font-mono text-caption leading-[1.5] ${className}`}
    >
      {rule}
    </InfoChip>
  );
}
