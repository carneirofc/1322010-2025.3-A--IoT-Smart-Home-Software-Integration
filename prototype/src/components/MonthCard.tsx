import { formatBrl, percentOf } from "@/lib/format";
import type { MonthBudget, TariffFlag, Tone } from "@/mocks/types";
import { Card, CardHead } from "./Card";
import { WalletIcon } from "./icons";
import { KpiUnit } from "./Kpi";
import { Legend, LegendItem } from "./Legend";
import { Meter, MeterFigure, MeterScale } from "./Meter";
import { StatusPill } from "./StatusPill";

const FLAG_TONE: Record<TariffFlag, Tone> = {
  verde: "ok",
  amarela: "attention",
  vermelha: "critical",
};

/** Month spend against the budget (R4): spent, projection and budget on one bar. */
export function MonthCard({ month }: { month: MonthBudget }) {
  const pct = (brl: number) => percentOf(brl, month.scaleMaxBrl);
  const withinBudget = month.projectionBrl <= month.budgetBrl;
  return (
    <Card labelledBy="month-title">
      <CardHead
        id="month-title"
        icon={<WalletIcon />}
        title={month.month}
        aside={
          <StatusPill
            tone={FLAG_TONE[month.tariffFlag]}
            label={`BANDEIRA ${month.tariffFlag.toUpperCase()}`}
          />
        }
      />
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-xl leading-[1.1] tabular-nums">
          {formatBrl(month.spentBrl)} <KpiUnit>até agora</KpiUnit>
        </p>
        {withinBudget ? (
          <StatusPill tone="ok" label="DENTRO DO ORÇAMENTO" />
        ) : (
          <StatusPill tone="warning" label="ACIMA DO ORÇAMENTO" />
        )}
      </div>
      <MeterFigure
        className="mt-3.5"
        label={`Projeção de ${formatBrl(month.projectionBrl)} contra orçamento de ${formatBrl(month.budgetBrl)}`}
      >
        <Meter
          height={14}
          fills={[
            { pct: pct(month.projectionBrl), tone: "ghost" },
            { pct: pct(month.spentBrl), tone: "brand" },
          ]}
          marks={[{ pct: pct(month.budgetBrl), overhang: 6 }]}
        />
        <MeterScale
          ticks={[
            { pct: 0, label: formatBrl(0) },
            { pct: pct(month.spentBrl), label: formatBrl(month.spentBrl) },
            { pct: pct(month.budgetBrl), label: formatBrl(month.budgetBrl), strong: true },
          ]}
        />
      </MeterFigure>
      <Legend className="mt-1.5">
        <LegendItem swatch="w-3.5 border-brand border-t-8">gasto</LegendItem>
        <LegendItem swatch="w-3.5 border-projection border-t-8">
          projeção {formatBrl(month.projectionBrl)}
        </LegendItem>
        <LegendItem swatch="h-3 w-[3px] border-current border-l-2">
          orçamento {formatBrl(month.budgetBrl)}
        </LegendItem>
      </Legend>
    </Card>
  );
}
