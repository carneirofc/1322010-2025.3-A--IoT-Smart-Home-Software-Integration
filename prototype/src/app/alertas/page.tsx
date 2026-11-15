import type { Metadata } from "next";
import { AlertBoard } from "@/components/alerts/AlertBoard";
import { Page } from "@/components/shell/Page";
import { scenario } from "@/mocks/scenario";

export const metadata: Metadata = { title: "Alertas" };

export default function AlertsPage() {
  return (
    <Page title="Alertas">
      <AlertBoard initialAlerts={scenario.alerts} />
      <p className="mt-5 border-borda border-t px-6 pt-3 text-small text-tinta-suave">
        Reconhecer um alerta crítico para a repetição do push; o alerta só é encerrado quando a
        condição deixa de valer.
      </p>
    </Page>
  );
}
