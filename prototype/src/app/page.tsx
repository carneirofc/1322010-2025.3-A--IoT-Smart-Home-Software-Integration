import type { Metadata } from "next";
import { DayChartCard } from "@/components/DayChartCard";
import { EnergyFlow } from "@/components/EnergyFlow";
import { LoadsNowCard } from "@/components/LoadsNowCard";
import { MonthCard } from "@/components/MonthCard";
import { OpenAlertsCard } from "@/components/OpenAlertsCard";
import { Page } from "@/components/Page";
import { TodayCard } from "@/components/TodayCard";
import { scenario } from "@/mocks/scenario";

export const metadata: Metadata = { title: "Visão geral" };

export default function OverviewPage() {
  return (
    <Page title="Visão geral" updatedAt={scenario.now}>
      <EnergyFlow energy={scenario.energy} />
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <TodayCard today={scenario.today} />
        <MonthCard month={scenario.month} />
      </div>
      <DayChartCard series={scenario.series} />
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <LoadsNowCard loads={scenario.loads} />
        <OpenAlertsCard alerts={scenario.alerts} />
      </div>
    </Page>
  );
}
