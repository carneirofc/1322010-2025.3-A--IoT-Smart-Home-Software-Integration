import type { Load } from "@/mocks/types";
import { Card, CardHead } from "./Card";
import { CardLink } from "./CardLink";
import { LoadIcon, loadStatus } from "./loadPresentation";
import { Row, RowIcon, RowList } from "./RowList";
import { StatusPill } from "./StatusPill";

export function LoadsNowCard({ loads }: { loads: readonly Load[] }) {
  return (
    <Card labelledBy="loads-title">
      <CardHead
        id="loads-title"
        title="Cargas agora"
        aside={<CardLink href="/cargas/">Ver cargas</CardLink>}
      />
      <RowList>
        {loads.map((load) => {
          const status = loadStatus(load, { showWaiting: true });
          return (
            <Row
              key={load.deviceId}
              lead={
                <RowIcon>
                  <LoadIcon kind={load.kind} />
                </RowIcon>
              }
              main={
                <>
                  <span className="font-semibold">{load.name}</span>
                  <br />
                  <span className="text-fg-muted text-sm">{load.summary}</span>
                </>
              }
              aside={<StatusPill tone={status.tone} label={status.label} />}
            />
          );
        })}
      </RowList>
    </Card>
  );
}
