import { formatNumber, percentOf } from "@/lib/format";
import type { ServiceEntrance } from "@/mocks/types";
import { Card } from "./Card";
import { Meter, MeterFigure, MeterScale } from "./Meter";
import { StatusPill } from "./StatusPill";

const amps = (value: number): string => `${formatNumber(value)} A`;
const pct = (value: number): string => `${formatNumber(Math.round(value))} %`;

/** Service entrance current against the breaker and the R3 shedding limit. */
export function EntranceBanner({ entrance }: { entrance: ServiceEntrance }) {
  const loadPct = percentOf(entrance.currentA, entrance.breakerA);
  const limitPct = percentOf(entrance.sheddingA, entrance.breakerA);
  return (
    <Card
      tone={entrance.sheddingActive ? "warning" : "ok"}
      label="Corrente na entrada da casa"
      className="grid grid-cols-[auto_1fr_auto] items-center gap-5 max-sm:grid-cols-1 max-sm:gap-3"
    >
      <div>
        <p className="text-fg-muted text-sm">Entrada da casa</p>
        <p className="font-bold text-lg tabular-nums">
          {amps(entrance.currentA)}{" "}
          <small className="font-semibold text-base text-fg-muted">
            de {amps(entrance.breakerA)} ({pct(loadPct)})
          </small>
        </p>
      </div>
      <MeterFigure
        label={`Corrente de ${amps(entrance.currentA)}, ${pct(loadPct)} do disjuntor de ${amps(entrance.breakerA)}; a R3 desliga cargas a partir de ${amps(entrance.sheddingA)}`}
      >
        <p className="mb-1.5 text-right text-fg-muted text-xs">
          a R3 desliga cargas a partir de{" "}
          <span className="font-semibold text-fg">
            {amps(entrance.sheddingA)} ({pct(limitPct)})
          </span>{" "}
          ▾
        </p>
        <Meter height={12} fills={[{ pct: loadPct, tone: "ok" }]} marks={[{ pct: limitPct }]} />
        <MeterScale
          ticks={[
            { pct: 0, label: amps(0) },
            { pct: 50, label: amps(entrance.breakerA / 2) },
            { pct: 100, label: amps(entrance.breakerA) },
          ]}
        />
      </MeterFigure>
      <div className="text-right">
        {entrance.sheddingActive ? (
          <StatusPill tone="warning" label="SOBRECARGA" />
        ) : (
          <StatusPill tone="ok" label="NORMAL" />
        )}
        <p className="mt-1 text-fg-muted text-sm">
          Proteção contra sobrecarga (R3) {entrance.sheddingActive ? "ativa" : "inativa"}
        </p>
      </div>
    </Card>
  );
}
