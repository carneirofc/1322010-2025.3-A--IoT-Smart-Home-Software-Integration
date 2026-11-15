import { formatDecimal, formatNumber } from "@/lib/format";
import type { DayTotals } from "@/mocks/types";
import { Card, CardHead } from "./Card";
import { CalendarIcon } from "./icons";
import { Kpi } from "./Kpi";

export function TodayCard({ today }: { today: DayTotals }) {
  return (
    <Card labelledBy="today-title">
      <CardHead
        id="today-title"
        icon={<CalendarIcon />}
        title="Hoje"
        aside={<span className="text-fg-muted text-sm">até {today.until}</span>}
      />
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Kpi size="compact" value={formatDecimal(today.generatedKwh)} unit="kWh" label="gerados" />
        <Kpi
          size="compact"
          value={formatDecimal(today.consumedKwh)}
          unit="kWh"
          label="consumidos"
        />
        <Kpi
          size="compact"
          value={formatNumber(today.selfConsumptionPct)}
          unit="%"
          label="autoconsumo"
        />
        <Kpi
          size="compact"
          value={formatDecimal(today.gridCreditKwh)}
          unit="kWh"
          label="crédito na rede"
        />
      </div>
    </Card>
  );
}
