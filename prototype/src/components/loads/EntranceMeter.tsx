import { CyberSubpanel } from "@carneirofc/ui";
import { formatNumber, percentOf } from "@/lib/format";
import type { ServiceEntrance } from "@/mocks/types";
import { Bar, BarFigure, BarScale } from "../ui/Bar";
import { Reading } from "../ui/Reading";
import { RuleChip } from "../ui/RuleChip";
import { StateMark } from "../ui/StateMark";

const amps = (value: number): string => `${formatNumber(value)} A`;
const pct = (value: number): string => `${formatNumber(Math.round(value))} %`;

/** Current at the service entrance against the main breaker and the R3 limit. */
export function EntranceMeter({ entrance }: { entrance: ServiceEntrance }) {
  const loadPct = percentOf(entrance.currentA, entrance.breakerA);
  const limitPct = percentOf(entrance.sheddingA, entrance.breakerA);
  return (
    <CyberSubpanel
      role="region"
      aria-labelledby="entrance-title"
      className="grid grid-cols-[auto_1fr_auto] items-center gap-6 rounded-sub px-6 py-3.5 max-sm:grid-cols-1 max-sm:gap-3"
    >
      <div>
        <h2 id="entrance-title" className="font-semibold text-heading leading-tight">
          Disjuntor geral
        </h2>
        <p className="text-display leading-tight">
          <Reading value={formatNumber(entrance.currentA)} unit="A" />{" "}
          <span className="font-sans text-body text-tinta-suave">
            de {amps(entrance.breakerA)} ({pct(loadPct)})
          </span>
        </p>
      </div>
      <BarFigure
        label={`Corrente de ${amps(entrance.currentA)}, ${pct(loadPct)} do disjuntor de ${amps(entrance.breakerA)}; a R3 desliga cargas a partir de ${amps(entrance.sheddingA)}`}
      >
        <Bar height={14} fills={[{ pct: loadPct, tone: "ink" }]} marks={[{ pct: limitPct }]} />
        <BarScale
          ticks={[
            { pct: 0, label: amps(0) },
            {
              pct: limitPct,
              label: `R3 desliga cargas a partir de ${amps(entrance.sheddingA)}`,
              strong: true,
              align: "end",
            },
          ]}
        />
      </BarFigure>
      <div className="text-small">
        <StateMark tone={entrance.sheddingActive ? "warning" : "ok"}>
          {entrance.sheddingActive ? "Sobrecarga" : "Normal"}
        </StateMark>
        <p className="mt-1 flex items-center gap-1.5 text-tinta-suave">
          proteção contra sobrecarga {entrance.sheddingActive ? "ativa" : "inativa"}
          <RuleChip rule="R3" />
        </p>
      </div>
    </CyberSubpanel>
  );
}
