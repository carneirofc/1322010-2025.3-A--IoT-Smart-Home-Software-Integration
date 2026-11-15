import type { Alert } from "@/mocks/types";
import { Card, CardHead } from "./Card";
import { CardLink } from "./CardLink";
import { CountBadge } from "./CountBadge";
import { Row, RowList } from "./RowList";
import { SeverityBadge } from "./SeverityBadge";

export function OpenAlertsCard({ alerts }: { alerts: readonly Alert[] }) {
  const open = alerts.filter((alert) => alert.state.kind === "open");
  return (
    <Card tone="warning" labelledBy="alerts-title">
      <CardHead
        id="alerts-title"
        title={
          <>
            Alertas abertos <CountBadge count={open.length} />
          </>
        }
        aside={<CardLink href="/alertas/">Ver alertas</CardLink>}
      />
      <RowList>
        {open.map((alert) => (
          <Row
            key={alert.id}
            lead={<SeverityBadge severity={alert.severity} />}
            main={
              <>
                <span className="font-semibold">{alert.headline}</span>
                <br />
                <span className="text-fg-muted text-sm">
                  {alert.detail} · {alert.rule}
                </span>
              </>
            }
            aside={
              <span className="whitespace-nowrap text-fg-muted text-sm">
                {alert.state.kind === "open" ? alert.state.since : null}
              </span>
            }
          />
        ))}
      </RowList>
    </Card>
  );
}
