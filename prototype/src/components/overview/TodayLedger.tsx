import { formatDecimal, formatNumber } from "@/lib/format";
import type { DayTotals } from "@/mocks/types";
import { Panel } from "../ui/Panel";
import { Compact } from "../ui/Reading";

/** Today's totals as line items with dotted leaders. */
export function TodayLedger({ today }: { today: DayTotals }) {
  const items = [
    { label: "Energia gerada", value: formatDecimal(today.generatedKwh), unit: "kWh" },
    { label: "Energia consumida", value: formatDecimal(today.consumedKwh), unit: "kWh" },
    { label: "Autoconsumo", value: formatNumber(today.selfConsumptionPct), unit: "%" },
    { label: "Crédito na rede", value: formatDecimal(today.gridCreditKwh), unit: "kWh" },
  ];
  return (
    <Panel id="today-title" title={`Hoje, até ${today.until}`}>
      <dl>
        {items.map((item) => (
          <div key={item.label} className="flex items-baseline gap-2 py-[3px]">
            <dt>{item.label}</dt>
            <span
              aria-hidden="true"
              className="min-w-4 flex-1 translate-y-[-4px] border-borda border-b-2 border-dotted"
            />
            <dd className="font-medium font-mono">
              <Compact value={item.value} />{" "}
              <span className="font-normal text-small text-tinta-suave">{item.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
