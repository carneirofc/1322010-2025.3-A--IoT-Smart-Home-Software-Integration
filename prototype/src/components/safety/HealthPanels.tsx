import { formatDecimal, formatNumber, percentOf } from "@/lib/format";
import type { AirConditioner, AirQuality, Alert, SupplyVoltage } from "@/mocks/types";
import { Bar, BarFigure, BarScale } from "../ui/Bar";
import { Panel } from "../ui/Panel";
import { Reading } from "../ui/Reading";
import { StateMark } from "../ui/StateMark";
import { ruleState } from "./ruleState";

const ppm = (value: number): string => `${formatNumber(value)} ppm`;

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-small text-tinta-suave">{label}</p>
      <p className="text-display leading-tight">{children}</p>
    </div>
  );
}

/** Bedroom air (R9): CO₂ against its limit, and what to do about it. */
export function AirPanel({ air, alert }: { air: AirQuality; alert?: Alert }) {
  const state = ruleState(alert);
  const high = air.co2Ppm > air.limitPpm;
  const pct = (value: number) => percentOf(value, air.scaleMaxPpm, air.scaleMinPpm);
  return (
    <Panel
      id="air-title"
      title="Ar do quarto"
      aside={
        <StateMark tone={state.tone} className="text-small">
          {state.label}
        </StateMark>
      }
    >
      <div className="flex items-end gap-7">
        <Labelled label="CO₂">
          <Reading
            value={formatNumber(air.co2Ppm)}
            unit="ppm"
            className={high ? "text-laranja-ink" : ""}
          />
        </Labelled>
        <Labelled label="Temperatura">
          <Reading value={formatNumber(air.temperatureC)} unit="°C" />
        </Labelled>
        {high ? (
          <p className="ml-auto pb-1 text-right text-small text-tinta-suave">
            acima do limite
            <br />
            há <span className="font-mono">{air.aboveLimitForMin}</span> min
          </p>
        ) : null}
      </div>
      <BarFigure
        className="mt-3"
        label={`CO₂ em ${ppm(air.co2Ppm)}, ${high ? "acima" : "abaixo"} do limite de ${ppm(air.limitPpm)}`}
      >
        <Bar
          fills={[{ pct: pct(air.co2Ppm), tone: high ? "warning" : "ok" }]}
          marks={[{ pct: pct(air.limitPpm) }]}
        />
        <BarScale
          ticks={[
            { pct: 0, label: formatNumber(air.scaleMinPpm) },
            { pct: pct(air.limitPpm), label: `limite ${ppm(air.limitPpm)}`, strong: true },
            { pct: 100, label: ppm(air.scaleMaxPpm) },
          ]}
        />
      </BarFigure>
      {high ? (
        <p className="mt-2 rounded-control bg-laranja-tint px-3 py-1.5 font-semibold text-laranja-ink text-small">
          Abra a janela para renovar o ar do quarto.
        </p>
      ) : null}
    </Panel>
  );
}

/** Bedroom air conditioner (R7): guidance only, never switched off automatically. */
export function AirConditionerPanel({ ac, alert }: { ac: AirConditioner; alert?: Alert }) {
  const state = ruleState(alert);
  const outsideHours = alert !== undefined && alert.state.kind !== "closed";
  return (
    <Panel
      id="ac-title"
      title="Ar-condicionado do quarto"
      aside={
        <StateMark tone={state.tone} className="text-small">
          {state.label}
        </StateMark>
      }
    >
      <div className="flex items-end gap-7">
        <Labelled label="Estado">
          <span className="font-semibold text-title">
            {ac.on ? (
              <>
                ligado desde <span className="font-medium font-mono">{ac.onSince}</span>
              </>
            ) : (
              "desligado"
            )}
          </span>
        </Labelled>
        <Labelled label="Potência">
          <Reading value={formatDecimal(ac.powerKw)} unit="kW" />
        </Labelled>
      </div>
      {outsideHours ? (
        <p className="mt-3 font-semibold text-laranja-ink">Ligado fora do horário de uso</p>
      ) : null}
      <p className="mt-1 text-small text-tinta-suave">
        Casa vazia em dias úteis, das {ac.emptyHouseFrom} às {ac.emptyHouseTo}. O painel só orienta:
        o ar-condicionado não é desligado automaticamente.
      </p>
    </Panel>
  );
}

/** One phase: its reading, then its own gauge against the adequate band. */
function PhaseGauge({
  label,
  volts,
  supply,
}: {
  label: string;
  volts: number;
  supply: SupplyVoltage;
}) {
  const pct = (value: number) => percentOf(value, supply.scaleMaxV, supply.scaleMinV);
  const inRange = volts >= supply.adequateMinV && volts <= supply.adequateMaxV;
  return (
    <BarFigure
      label={`${label} em ${volts} V, ${inRange ? "dentro" : "fora"} da faixa adequada de ${supply.adequateMinV} a ${supply.adequateMaxV} V`}
    >
      <p className="flex items-baseline justify-between gap-3">
        <span className="text-small text-tinta-suave">{label}</span>
        <Reading value={formatNumber(volts)} unit="V" className="text-title leading-tight" />
      </p>
      <div className="mt-1.5">
        <Bar
          band={{ fromPct: pct(supply.adequateMinV), toPct: pct(supply.adequateMaxV) }}
          dots={[pct(volts)]}
        />
      </div>
      <BarScale
        ticks={[
          { pct: 0, label: `${supply.scaleMinV} V` },
          { pct: pct(supply.adequateMinV), label: String(supply.adequateMinV) },
          { pct: pct(supply.adequateMaxV), label: String(supply.adequateMaxV) },
          { pct: 100, label: `${supply.scaleMaxV} V` },
        ]}
      />
    </BarFigure>
  );
}

/** Supply voltage on both phases against the adequate band. */
export function SupplyPanel({ supply }: { supply: SupplyVoltage }) {
  const inRange = (volts: number) => volts >= supply.adequateMinV && volts <= supply.adequateMaxV;
  const adequate = inRange(supply.phaseAV) && inRange(supply.phaseBV);
  return (
    <Panel
      id="supply-title"
      title="Rede elétrica"
      className="flex flex-col"
      aside={
        <StateMark tone={adequate ? "ok" : "warning"} className="text-small">
          {adequate ? "faixa adequada" : "fora da faixa"}
        </StateMark>
      }
    >
      <div className="space-y-3">
        <PhaseGauge label="Fase A" volts={supply.phaseAV} supply={supply} />
        <PhaseGauge label="Fase B" volts={supply.phaseBV} supply={supply} />
      </div>
      <ul className="mt-auto space-y-1 border-linha border-t pt-2.5 text-small text-tinta-suave">
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2.5 w-5 flex-none rounded-full bg-lima-tint ring-1 ring-borda"
          />
          faixa adequada, de {supply.adequateMinV} a {supply.adequateMaxV} V
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="flex w-5 flex-none justify-center">
            <span className="size-3 rounded-full bg-lima-ink" />
          </span>
          tensão medida agora na fase
        </li>
      </ul>
    </Panel>
  );
}
