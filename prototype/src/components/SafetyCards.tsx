import { formatNumber, percentOf } from "@/lib/format";
import type { GasReading, HouseAlarm, SupplyVoltage } from "@/mocks/types";
import { Button } from "./Button";
import { Card, CardHead } from "./Card";
import { BellIcon, FlameIcon, PlugIcon } from "./icons";
import { Kpi } from "./Kpi";
import { Meter, MeterFigure, MeterScale } from "./Meter";
import { StatusPill } from "./StatusPill";

const BIG_STATE = "font-extrabold text-lg tracking-[0.02em]";

export function GasCard({ gas }: { gas: GasReading }) {
  return (
    <Card tone={gas.detected ? "critical" : "ok"} labelledBy="gas-title">
      <CardHead
        id="gas-title"
        icon={<FlameIcon />}
        title={`Gás · ${gas.location}`}
        aside={
          gas.detected ? (
            <StatusPill tone="critical" label="CRÍTICO" />
          ) : (
            <StatusPill tone="ok" label="NORMAL" />
          )
        }
      />
      <p className={`${BIG_STATE} ${gas.detected ? "text-critical-fg" : "text-ok-fg"}`}>
        {gas.detected ? "GÁS DETECTADO" : "NÃO DETECTADO"}
      </p>
      <p className="mt-1.5 text-fg-muted text-sm">
        Se detectar gás, o alarme da casa toca e todos recebem push (R8).
      </p>
    </Card>
  );
}

export function AlarmCard({ alarm }: { alarm: HouseAlarm }) {
  return (
    <Card labelledBy="siren-title">
      <CardHead id="siren-title" icon={<BellIcon />} title="Alarme da casa" />
      <p className={`${BIG_STATE} ${alarm.active ? "text-critical-fg" : "text-neutral-fg"}`}>
        {alarm.active ? "TOCANDO" : "DESLIGADO"}
      </p>
      <div className="mt-2 mb-3 grid gap-0.5 text-fg-muted text-xs">
        <span>
          <span className="font-semibold">Aviso</span> = luz e bipe
        </span>
        <span>
          <span className="font-semibold">Alarme</span> = sirene
        </span>
      </div>
      <Button>Testar alarme</Button>
    </Card>
  );
}

export function SupplyCard({ supply }: { supply: SupplyVoltage }) {
  const pct = (volts: number) => percentOf(volts, supply.scaleMaxV, supply.scaleMinV);
  const inRange = (volts: number) => volts >= supply.adequateMinV && volts <= supply.adequateMaxV;
  const adequate = inRange(supply.phaseAV) && inRange(supply.phaseBV);
  return (
    <Card tone={adequate ? "ok" : "warning"} labelledBy="supply-title">
      <CardHead
        id="supply-title"
        icon={<PlugIcon />}
        title="Rede elétrica"
        aside={
          adequate ? (
            <StatusPill tone="ok" label="FAIXA ADEQUADA" />
          ) : (
            <StatusPill tone="warning" label="FORA DA FAIXA" />
          )
        }
      />
      <div className="mb-3 grid grid-cols-2 gap-3">
        <Kpi labelAbove label="Fase A" value={formatNumber(supply.phaseAV)} unit="V" />
        <Kpi labelAbove label="Fase B" value={formatNumber(supply.phaseBV)} unit="V" />
      </div>
      <MeterFigure
        label={`Fase A em ${supply.phaseAV} V e fase B em ${supply.phaseBV} V, ${
          adequate ? "dentro" : "fora"
        } da faixa adequada de ${supply.adequateMinV} a ${supply.adequateMaxV} V`}
      >
        <Meter
          band={{ fromPct: pct(supply.adequateMinV), toPct: pct(supply.adequateMaxV) }}
          dots={[pct(supply.phaseAV), pct(supply.phaseBV)]}
        />
        <MeterScale
          ticks={[
            { pct: 0, label: `${supply.scaleMinV} V` },
            { pct: pct(supply.adequateMinV), label: String(supply.adequateMinV) },
            { pct: pct(supply.adequateMaxV), label: String(supply.adequateMaxV) },
            { pct: 100, label: `${supply.scaleMaxV} V` },
          ]}
        />
      </MeterFigure>
    </Card>
  );
}
