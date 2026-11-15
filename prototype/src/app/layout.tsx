import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AlertsProvider } from "@/components/alerts/AlertsState";
import { Header } from "@/components/shell/Header";
import { NavTabs, type TabLink } from "@/components/shell/NavTabs";
import { scenario } from "@/mocks/scenario";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
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
    badge: "openAlerts",
  },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AlertsProvider initialAlerts={scenario.alerts}>
          <header className="relative border-borda border-b bg-papel/70 backdrop-blur-sm">
            <Header hub={scenario.hub} now={scenario.now} />
            <NavTabs tabs={tabs} />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-px h-px bg-[linear-gradient(90deg,transparent,var(--color-ciano)_20%,var(--color-rosa)_80%,transparent)]"
            />
          </header>
          {children}
        </AlertsProvider>
      </body>
    </html>
  );
}
