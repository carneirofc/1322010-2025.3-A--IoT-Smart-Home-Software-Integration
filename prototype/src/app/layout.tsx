import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { type TabLink, TabNav } from "@/components/TabNav";
import { openAlertCount, scenario } from "@/mocks/scenario";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Casa Monitorada", template: "%s · Casa Monitorada" },
  description: "Protótipo visual do painel de monitoramento residencial (dados de exemplo).",
};

const tabs: readonly TabLink[] = [
  { href: "/", label: "Visão geral" },
  { href: "/cargas/", label: "Cargas" },
  { href: "/seguranca/", label: "Segurança e saúde" },
  {
    href: "/alertas/",
    label: "Alertas",
    badge: { count: openAlertCount, label: "alertas abertos" },
  },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppHeader hub={scenario.hub} now={scenario.now} />
        <TabNav tabs={tabs} />
        {children}
      </body>
    </html>
  );
}
