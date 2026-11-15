import { formatNumber } from "@/lib/format";
import type { Device, DeviceHealth } from "@/mocks/types";
import { Card, CardHead } from "./Card";
import { ChipIcon } from "./icons";
import { Kpi } from "./Kpi";
import { StatusPill } from "./StatusPill";

function DeviceItem({ device }: { device: Device }) {
  const late = device.status.kind === "late";
  return (
    <li
      className={`flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-[7px] ${
        late ? "border-attention-line bg-attention-bg" : "border-line bg-surface-muted"
      }`}
    >
      <span
        className={`size-[9px] flex-none rounded-full ${late ? "bg-attention-solid" : "bg-ok-solid"}`}
        aria-hidden="true"
      />
      <span>
        <span className="font-mono text-xs [overflow-wrap:anywhere]">{device.id}</span>
        <span
          className={`block text-xs ${late ? "font-semibold text-attention-fg" : "text-fg-muted"}`}
        >
          {device.status.kind === "late"
            ? `atrasado · há ${device.status.lastMessageAgoS} s`
            : "online"}
        </span>
      </span>
    </li>
  );
}

/** Device health: who is online, who is late, and what the hub filtered today. */
export function DeviceHealthCard({ health }: { health: DeviceHealth }) {
  const late = health.devices.filter((device) => device.status.kind === "late");
  const online = health.devices.length - late.length;
  const firstLate = late[0];
  const listLabel = firstLate
    ? `Lista de dispositivos; todos online, exceto ${late.map((d) => d.id).join(", ")}, atrasado`
    : "Lista de dispositivos; todos online";
  return (
    <Card tone={late.length > 0 ? "attention" : "ok"} labelledBy="devices-title">
      <CardHead
        id="devices-title"
        icon={<ChipIcon />}
        title="Dispositivos"
        aside={
          late.length > 0 ? (
            <StatusPill
              tone="attention"
              label={`ATENÇÃO · ${late.length} ${late.length === 1 ? "ATRASADO" : "ATRASADOS"}`}
            />
          ) : (
            <StatusPill tone="ok" label="NORMAL" />
          )
        }
      />
      <div className="mb-3 grid grid-cols-[auto_auto_auto_1fr_auto_auto] items-center gap-5 max-sm:grid-cols-1 max-sm:gap-3">
        <Kpi size="lg" value={formatNumber(health.devices.length)} label="dispositivos" />
        <Kpi size="lg" value={formatNumber(online)} label="online" />
        <Kpi
          size="lg"
          value={formatNumber(late.length)}
          label={late.length === 1 ? "atrasado" : "atrasados"}
          valueClassName={late.length > 0 ? "text-attention-fg" : ""}
        />
        <p className="text-sm">
          {firstLate && firstLate.status.kind === "late" ? (
            <>
              <span className="font-mono font-semibold text-sm">{firstLate.id}</span>
              <br />
              <span className="text-fg-muted">
                última mensagem há {firstLate.status.lastMessageAgoS} s
              </span>
            </>
          ) : null}
        </p>
        <Kpi
          size="lg"
          className="text-right"
          value={formatNumber(health.rejectedToday)}
          label="mensagens rejeitadas hoje"
        />
        <Kpi
          size="lg"
          className="text-right"
          value={formatNumber(health.duplicatesDiscarded)}
          label="duplicatas descartadas"
        />
      </div>
      <ul aria-label={listLabel} className="grid grid-cols-4 gap-2 max-sm:grid-cols-1">
        {health.devices.map((device) => (
          <DeviceItem key={device.id} device={device} />
        ))}
      </ul>
    </Card>
  );
}
