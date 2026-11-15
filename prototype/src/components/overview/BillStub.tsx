import { formatBrl, percentOf } from "@/lib/format";
import type { MonthBudget, TariffFlag, Tone } from "@/mocks/types";
import { Bar, BarFigure, BarScale } from "../ui/Bar";
import { RuleChip } from "../ui/RuleChip";
import { StateMark } from "../ui/StateMark";
import { TONE_SOLID } from "../ui/state";

const FLAG_TONE: Record<TariffFlag, Tone> = {
  verde: "ok",
  amarela: "attention",
  vermelha: "critical",
};

/** The month's electricity bill so far, against the budget (R4). */
export function BillStub({ month }: { month: MonthBudget }) {
  const pct = (brl: number) => percentOf(brl, month.scaleMaxBrl);
  const withinBudget = month.projectionBrl <= month.budgetBrl;
  const flagTone = FLAG_TONE[month.tariffFlag];
  return (
    <section
      aria-labelledby="bill-title"
      className="flex border border-grafite bg-papel [border-top-style:dashed] [border-top-width:2px]"
    >
      <div
        className={`flex w-[74px] flex-none flex-col items-center justify-center gap-1 px-2 text-center ${TONE_SOLID[flagTone]}`}
      >
        <span
          className={`font-label font-semibold text-small leading-tight ${
            flagTone === "attention" ? "text-amarela-ink" : "text-white"
          }`}
        >
          Bandeira {month.tariffFlag}
        </span>
      </div>
      <div className="min-w-0 flex-1 px-4 pt-3 pb-3">
        <h2 id="bill-title" className="font-bold font-label text-heading">
          Conta de {month.month.toLowerCase()}
        </h2>
        <p className="flex items-baseline gap-2">
          <span className="font-bold font-label text-display tabular-nums leading-none">
            {formatBrl(month.spentBrl)}
          </span>
          <span className="text-fio">gastos até agora</span>
        </p>
        <BarFigure
          className="mt-3"
          label={`Gasto de ${formatBrl(month.spentBrl)}, projeção de ${formatBrl(month.projectionBrl)} contra orçamento de ${formatBrl(month.budgetBrl)}`}
        >
          <Bar
            height={14}
            fills={[
              { pct: pct(month.projectionBrl), tone: "projection" },
              { pct: pct(month.spentBrl), tone: "ink" },
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
              className="h-3 w-5 border border-grafite bg-[repeating-linear-gradient(135deg,var(--color-linha-forte)_0_3px,transparent_3px_7px)]"
            />
            projeção do mês{" "}
            <strong className="tabular-nums">{formatBrl(month.projectionBrl)}</strong>
          </span>
          <StateMark tone={withinBudget ? "ok" : "warning"}>
            {withinBudget ? "dentro do orçamento" : "acima do orçamento"}
          </StateMark>
          <RuleChip rule="R4" />
        </p>
      </div>
    </section>
  );
}
