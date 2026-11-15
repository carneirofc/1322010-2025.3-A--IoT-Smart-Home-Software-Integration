import type { Metadata } from "next";
import { BillStub } from "@/components/overview/BillStub";
import { DaySection } from "@/components/overview/DaySection";
import { EnergyMeter } from "@/components/overview/EnergyMeter";
import { LoadsNow } from "@/components/overview/LoadsNow";
import { OpenAlerts } from "@/components/overview/OpenAlerts";
import { TodayLedger } from "@/components/overview/TodayLedger";
import { Page } from "@/components/shell/Page";
import { scenario } from "@/mocks/scenario";

export const metadata: Metadata = { title: "Visão geral" };

export default function OverviewPage() {
  return (
    <Page title="Visão geral">
      <EnergyMeter energy={scenario.energy} />
      <div className="mt-4 grid grid-cols-[1.25fr_1fr] gap-4 max-sm:grid-cols-1">
        <BillStub month={scenario.month} />
        <TodayLedger today={scenario.today} />
      </div>
      <DaySection series={scenario.series} />
      <div className="mt-4 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <LoadsNow loads={scenario.loads} />
        <OpenAlerts alerts={scenario.alerts} />
      </div>
    </Page>
  );
}
