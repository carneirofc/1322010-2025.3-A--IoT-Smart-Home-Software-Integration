import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BreakerTabs, type TabLink } from "@/components/shell/BreakerTabs";
import { Header } from "@/components/shell/Header";
import { openAlertCount, scenario } from "@/mocks/scenario";
import "@fontsource/atkinson-hyperlegible-next/400.css";
import "@fontsource/atkinson-hyperlegible-next/600.css";
import "@fontsource/atkinson-hyperlegible-next/700.css";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Casa Monitorada", template: "%s | Casa Monitorada" },
  description: "Protótipo visual do painel de monitoramento residencial (dados de exemplo).",
};

const tabs: readonly TabLink[] = [
  { href: "/", label: "Visão geral" },
  { href: "/cargas/", label: "Cargas" },
  { href: "/seguranca/", label: "Segurança e saúde" },
  {
    href: "/alertas/",
    label: "Alertas",
    badge: { count: openAlertCount, label: openAlertCount === 1 ? "aberto" : "abertos" },
  },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="border-grafite border-b-[3px] bg-papel">
          <Header hub={scenario.hub} now={scenario.now} />
          <BreakerTabs tabs={tabs} />
        </header>
        {children}
      </body>
    </html>
  );
}
