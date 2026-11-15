import type { Metadata } from "next";
import { DevicesPanel } from "@/components/safety/DevicesPanel";
import { AirConditionerPanel, AirPanel, SupplyPanel } from "@/components/safety/HealthPanels";
import { SafetyHero } from "@/components/safety/SafetyHero";
import { Page } from "@/components/shell/Page";
import { scenario } from "@/mocks/scenario";
import type { RuleId } from "@/mocks/types";

export const metadata: Metadata = { title: "Segurança e saúde" };

const alertFor = (rule: RuleId) => scenario.alerts.find((alert) => alert.rule === rule);
const healthRules: readonly RuleId[] = ["R9", "R6"];

export default function SafetyPage() {
  const openHealthAlerts = scenario.alerts.filter(
    (alert) => alert.state.kind === "open" && healthRules.includes(alert.rule),
  );
  return (
    <Page title="Segurança e saúde">
      <SafetyHero gas={scenario.gas} alarm={scenario.alarm} openAlerts={openHealthAlerts} />
      <div className="mt-4 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <AirPanel air={scenario.air} alert={alertFor("R9")} />
        <AirConditionerPanel ac={scenario.airConditioner} alert={alertFor("R6")} />
      </div>
      <div className="mt-4 grid grid-cols-[1fr_1.75fr] gap-4 max-sm:grid-cols-1">
        <SupplyPanel supply={scenario.supply} />
        <DevicesPanel health={scenario.deviceHealth} />
      </div>
    </Page>
  );
}
