import { formatDecimal, formatNumber } from "@/lib/format";
import type { DayTotals } from "@/mocks/types";

/** Today's totals as the line items of a bill, with dotted leaders. */
export function TodayLedger({ today }: { today: DayTotals }) {
  const items = [
    { label: "Energia gerada", value: formatDecimal(today.generatedKwh), unit: "kWh" },
    { label: "Energia consumida", value: formatDecimal(today.consumedKwh), unit: "kWh" },
    { label: "Autoconsumo", value: formatNumber(today.selfConsumptionPct), unit: "%" },
    { label: "Crédito na rede", value: formatDecimal(today.gridCreditKwh), unit: "kWh" },
  ];
  return (
    <section aria-labelledby="today-title" className="border border-grafite bg-papel px-4 py-3">
      <h2 id="today-title" className="font-bold font-label text-heading">
        Hoje, até {today.until}
      </h2>
      <dl className="mt-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-baseline gap-2 py-[3px]">
            <dt>{item.label}</dt>
            <span
              aria-hidden="true"
              className="min-w-4 flex-1 translate-y-[-4px] border-linha-forte border-b-2 border-dotted"
            />
            <dd className="font-label font-semibold text-heading tabular-nums">
              {item.value}{" "}
              <span className="font-sans font-normal text-fio text-small">{item.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
