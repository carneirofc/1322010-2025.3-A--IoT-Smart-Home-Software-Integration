import { formatBrl, percentOf } from "@/lib/format";
import type { MonthBudget, TariffFlag, Tone } from "@/mocks/types";
import { Bar, BarFigure, BarScale, PROJECTION_FILL } from "../ui/Bar";
import { Panel } from "../ui/Panel";
import { RuleChip } from "../ui/RuleChip";
import { StateMark } from "../ui/StateMark";

const FLAG_TONE: Record<TariffFlag, Tone> = {
  verde: "ok",
  amarela: "attention",
  vermelha: "critical",
};

/** The month's electricity bill so far, against the budget (R4). */
export function BillStub({ month }: { month: MonthBudget }) {
  const pct = (brl: number) => percentOf(brl, month.scaleMaxBrl);
  const withinBudget = month.projectionBrl <= month.budgetBrl;
  return (
    <Panel
      id="bill-title"
      title={`Conta de ${month.month.toLowerCase()}`}
      aside={
        <StateMark tone={FLAG_TONE[month.tariffFlag]} className="text-small">
          bandeira {month.tariffFlag}
        </StateMark>
      }
    >
      <p className="flex items-baseline gap-2">
        <span className="font-mono text-display leading-tight">{formatBrl(month.spentBrl)}</span>
        <span className="text-tinta-suave">gastos até agora</span>
      </p>
      <BarFigure
        className="mt-2.5"
        label={`Gasto de ${formatBrl(month.spentBrl)}, projeção de ${formatBrl(month.projectionBrl)} contra orçamento de ${formatBrl(month.budgetBrl)}`}
      >
        <Bar
          height={14}
          fills={[
            { pct: pct(month.projectionBrl), tone: "projection" },
            { pct: pct(month.spentBrl), tone: "accent" },
          ]}
          marks={[{ pct: pct(month.budgetBrl), overhang: 6 }]}
        />
        <BarScale
          ticks={[
            { pct: 0, label: formatBrl(0) },
            {
              pct: pct(month.budgetBrl),
              label: `orçamento ${formatBrl(month.budgetBrl)}`,
              strong: true,
              align: "end",
            },
          ]}
        />
      </BarFigure>
      <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-small">
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={`h-3 w-5 rounded-full border border-borda ${PROJECTION_FILL}`}
          />
          projeção do mês{" "}
          <span className="font-mono font-semibold">{formatBrl(month.projectionBrl)}</span>
        </span>
        <StateMark tone={withinBudget ? "ok" : "warning"}>
          {withinBudget ? "dentro do orçamento" : "acima do orçamento"}
        </StateMark>
        <RuleChip rule="R4" />
      </p>
    </Panel>
  );
}
