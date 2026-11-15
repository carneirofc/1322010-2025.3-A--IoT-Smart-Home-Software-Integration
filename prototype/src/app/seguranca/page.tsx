import type { Metadata } from "next";
import { DeviceHealthCard } from "@/components/DeviceList";
import { AirCard, AirConditionerCard } from "@/components/HealthCards";
import { Page } from "@/components/Page";
import { AlarmCard, GasCard, SupplyCard } from "@/components/SafetyCards";
import { scenario } from "@/mocks/scenario";
import type { RuleId } from "@/mocks/types";

export const metadata: Metadata = { title: "Segurança e saúde" };

const alertFor = (rule: RuleId) => scenario.alerts.find((alert) => alert.rule === rule);

export default function SafetyPage() {
  return (
    <Page title="Segurança e saúde" updatedAt={scenario.now}>
      <div className="grid grid-cols-[1fr_1fr_1.25fr] gap-4 max-sm:grid-cols-1">
        <GasCard gas={scenario.gas} />
        <AlarmCard alarm={scenario.alarm} />
        <SupplyCard supply={scenario.supply} />
      </div>
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <AirCard air={scenario.air} alert={alertFor("R9")} />
        <AirConditionerCard ac={scenario.airConditioner} alert={alertFor("R7")} />
      </div>
      <DeviceHealthCard health={scenario.deviceHealth} />
    </Page>
  );
}
