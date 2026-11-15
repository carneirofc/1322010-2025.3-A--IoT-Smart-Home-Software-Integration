"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { Alert } from "@/mocks/types";

interface AlertsState {
  alerts: readonly Alert[];
  acknowledge: (id: string) => void;
}

const AlertsContext = createContext<AlertsState | null>(null);

function acknowledged(alert: Alert): Alert {
  if (alert.state.kind !== "open") return alert;
  return { ...alert, state: { kind: "acknowledged", since: alert.state.since } };
}

/**
 * The alert list as local browser state, shared by the Alertas screen and the
 * tab badge so an acknowledgement shows in both. Lives in the root layout, so
 * it survives moving between screens until the page reloads.
 */
export function AlertsProvider({
  initialAlerts,
  children,
}: {
  initialAlerts: readonly Alert[];
  children: ReactNode;
}) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const acknowledge = useCallback(
    (id: string) =>
      setAlerts((current) =>
        current.map((alert) => (alert.id === id ? acknowledged(alert) : alert)),
      ),
    [],
  );
  const value = useMemo(() => ({ alerts, acknowledge }), [alerts, acknowledge]);
  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlerts(): AlertsState {
  const state = useContext(AlertsContext);
  if (!state) throw new Error("useAlerts needs an AlertsProvider");
  return state;
}
