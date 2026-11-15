import { formatNumber } from "@/lib/format";
import type { Device, DeviceHealth } from "@/mocks/types";
import { Panel } from "../ui/Panel";
import { StateMark } from "../ui/StateMark";
import { CopyDeviceId } from "./CopyDeviceId";

function Count({
  value,
  label,
  className = "",
}: {
  value: number;
  label: string;
  className?: string;
}) {
  return (
    <div>
      <p className={`font-mono text-title leading-tight ${className}`}>{formatNumber(value)}</p>
      <p className="text-caption text-tinta-suave">{label}</p>
    </div>
  );
}

function DeviceRow({ device }: { device: Device }) {
  const late = device.status.kind === "late";
  return (
    <li className="flex items-center justify-between gap-2 py-1">
      <span className="font-mono text-small [overflow-wrap:anywhere]">{device.id}</span>
      <StateMark tone={late ? "attention" : "ok"} className="whitespace-nowrap text-small">
        {late ? "atrasado" : "online"}
      </StateMark>
    </li>
  );
}

/** Device health: who is online, who is late, and what the hub filtered today. */
export function DevicesPanel({ health }: { health: DeviceHealth }) {
  const late = health.devices.filter((device) => device.status.kind === "late");
  const online = health.devices.length - late.length;
  const firstLate = late[0];
  return (
    <Panel
      id="devices-title"
      title="Dispositivos"
      aside={
        <StateMark tone={late.length > 0 ? "attention" : "ok"} className="text-small">
          {late.length > 0
            ? `atenção, ${late.length} ${late.length === 1 ? "atrasado" : "atrasados"}`
            : "normal"}
        </StateMark>
      }
    >
      <div className="grid grid-cols-5 items-start gap-x-4 gap-y-2 max-sm:grid-cols-2">
        <Count value={health.devices.length} label="dispositivos" />
        <Count value={online} label="online" />
        <Count
          value={late.length}
          label={late.length === 1 ? "atrasado" : "atrasados"}
          className={late.length > 0 ? "text-ambar-ink" : ""}
        />
        <Count value={health.rejectedToday} label="mensagens rejeitadas hoje" />
        <Count value={health.duplicatesDiscarded} label="duplicatas descartadas" />
      </div>
      {firstLate && firstLate.status.kind === "late" ? (
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-control bg-ambar-tint px-3 py-1.5 text-ambar-ink text-small">
          <span>
            <span className="font-mono font-semibold">{firstLate.id}</span>: última mensagem há{" "}
            {firstLate.status.lastMessageAgoS} s
          </span>
          <CopyDeviceId id={firstLate.id} />
        </p>
      ) : null}
      <ul
        aria-label="Lista de dispositivos"
        className="mt-2 grid grid-cols-2 gap-x-8 divide-linha max-sm:grid-cols-1 [&>li]:border-linha [&>li]:border-b"
      >
        {health.devices.map((device) => (
          <DeviceRow key={device.id} device={device} />
        ))}
      </ul>
    </Panel>
  );
}
