import { InfoChip } from "@carneirofc/ui";
import type { RuleId } from "@/mocks/types";

/** Rule reference set like a breaker label ("R9"). */
export function RuleChip({ rule, className = "" }: { rule: RuleId; className?: string }) {
  return (
    <InfoChip
      title={`Regra ${rule}`}
      className={`rounded-[2px] px-1.5 py-0 font-label font-semibold text-small leading-[1.35] ${className}`}
    >
      {rule}
    </InfoChip>
  );
}
