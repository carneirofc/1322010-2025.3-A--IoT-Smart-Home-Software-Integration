import type { Metadata } from "next";
import { AlertBoard } from "@/components/AlertBoard";
import { InfoIcon } from "@/components/icons";
import { Page } from "@/components/Page";
import { scenario } from "@/mocks/scenario";

export const metadata: Metadata = { title: "Alertas" };

export default function AlertsPage() {
  return (
    <Page title="Alertas" updatedAt={scenario.now}>
      <AlertBoard initialAlerts={scenario.alerts} />
      <p className="mt-5 flex items-center gap-2 text-fg-muted text-sm">
        <InfoIcon size="sm" />
        Reconhecer um alerta crítico para a repetição do push; o alerta só é encerrado quando a
        condição deixa de valer.
      </p>
    </Page>
  );
}
