import { formatDecimal, formatNumber, percentOf } from "@/lib/format";
import type { AirConditioner, AirQuality, Alert } from "@/mocks/types";
import { Card, CardHead } from "./Card";
import { SnowflakeIcon, WindIcon, WindowIcon } from "./icons";
import { Kpi } from "./Kpi";
import { Meter, MeterFigure, MeterScale } from "./Meter";
import { ruleStatus } from "./ruleStatus";
import { StatusPill } from "./StatusPill";

const ppm = (value: number): string => `${formatNumber(value)} ppm`;

/** Bedroom air (R9): CO₂ against its limit, plus what to do about it. */
export function AirCard({ air, alert }: { air: AirQuality; alert?: Alert }) {
  const status = ruleStatus(alert);
  const high = air.co2Ppm > air.limitPpm;
  const pct = (value: number) => percentOf(value, air.scaleMaxPpm, air.scaleMinPpm);
  return (
    <Card tone={high ? "warning" : "ok"} labelledBy="air-title">
      <CardHead
        id="air-title"
        icon={<WindIcon />}
        title="Ar do quarto"
        aside={<StatusPill tone={status.tone} label={status.label} />}
      />
      <div className="flex items-end gap-7">
        <Kpi
          labelAbove
          label="CO₂"
          value={formatNumber(air.co2Ppm)}
          unit="ppm"
          valueClassName={high ? "text-warning-fg" : ""}
        />
        <Kpi labelAbove label="Temperatura" value={formatNumber(air.temperatureC)} unit="°C" />
        {high ? (
          <p className="ml-auto text-right text-fg-muted text-sm">
            acima do limite
            <br />
            há {air.aboveLimitForMin} min
          </p>
        ) : null}
      </div>
      <MeterFigure
        className="mt-3"
        label={`CO₂ em ${ppm(air.co2Ppm)}, ${high ? "acima" : "abaixo"} do limite de ${ppm(air.limitPpm)}`}
      >
        <Meter
          fills={[{ pct: pct(air.co2Ppm), tone: high ? "warning" : "ok" }]}
          marks={[{ pct: pct(air.limitPpm) }]}
        />
        <MeterScale
          ticks={[
            { pct: 0, label: formatNumber(air.scaleMinPpm) },
            { pct: pct(air.limitPpm), label: `limite ${ppm(air.limitPpm)}`, strong: true },
            { pct: 100, label: ppm(air.scaleMaxPpm) },
          ]}
        />
      </MeterFigure>
      {high ? (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-warning-bg px-3 py-2 font-semibold text-sm text-warning-fg">
          <WindowIcon size="sm" />
          Abra a janela para renovar o ar do quarto.
        </p>
      ) : null}
    </Card>
  );
}

/** Bedroom air conditioner (R7): guidance only, never switched off automatically. */
export function AirConditionerCard({ ac, alert }: { ac: AirConditioner; alert?: Alert }) {
  const status = ruleStatus(alert);
  const outsideHours = alert !== undefined && alert.state.kind !== "closed";
  return (
    <Card tone={outsideHours ? "warning" : "ok"} labelledBy="ac-title">
      <CardHead
        id="ac-title"
        icon={<SnowflakeIcon />}
        title="Ar-condicionado do quarto"
        aside={<StatusPill tone={status.tone} label={status.label} />}
      />
      <div className="flex items-end gap-7">
        <Kpi
          labelAbove
          size="lg"
          label="Estado"
          value={ac.on ? `ligado desde ${ac.onSince}` : "desligado"}
        />
        <Kpi labelAbove label="Potência" value={formatDecimal(ac.powerKw)} unit="kW" />
      </div>
      {outsideHours ? (
        <p className="mt-3.5 font-semibold text-warning-fg">
          Fora do horário de uso ({alert.rule})
        </p>
      ) : null}
      <p className="mt-0.5 text-fg-muted text-sm">
        Casa vazia em dias úteis, das {ac.emptyHouseFrom} às {ac.emptyHouseTo}. O painel só orienta:
        o ar-condicionado não é desligado automaticamente.
      </p>
    </Card>
  );
}
