import { formatDecimal, percentOf } from "@/lib/format";
import type { EnergySnapshot } from "@/mocks/types";

const kw = (value: number): string => `${formatDecimal(value)} kW`;

/**
 * The house's bidirectional meter: buying or selling right now, and how the
 * larger of solar and consumption splits between the house and the grid.
 */
export function EnergyMeter({ energy }: { energy: EnergySnapshot }) {
  const selling = energy.gridKw < 0;
  const gridKw = Math.abs(energy.gridKw);
  // Selling: the roof's output is split into house + grid.
  // Buying: the house's consumption is split into solar + grid.
  const whole = selling ? energy.solarKw : energy.houseKw;
  const sharedKw = Math.min(energy.solarKw, energy.houseKw);
  const sharedPct = percentOf(sharedKw, whole);
  return (
    <section
      aria-labelledby="meter-title"
      className="border-[3px] border-grafite bg-papel px-6 pt-4 pb-5 max-sm:px-4"
    >
      <div className="flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start">
        <div>
          <h2 id="meter-title" className="font-semibold text-heading leading-tight">
            {selling ? "Agora a casa está vendendo energia" : "Agora a casa está comprando energia"}
          </h2>
          <p className="mt-1 flex items-baseline gap-3">
            <span
              className={`font-bold font-label text-reading tabular-nums leading-[0.95] ${
                selling ? "text-verde-ink" : "text-laranja-ink"
              }`}
            >
              {kw(gridKw)}
            </span>
            <span className="font-semibold text-heading">
              {selling ? "injetados na rede" : "vindos da rede"}
            </span>
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 text-right max-sm:text-left">
          <dt className="text-fio text-small">Telhado gera</dt>
          <dt className="text-fio text-small">Casa consome</dt>
          <dd className="font-label font-semibold text-display tabular-nums leading-none">
            {kw(energy.solarKw)}
          </dd>
          <dd className="font-label font-semibold text-display tabular-nums leading-none">
            {kw(energy.houseKw)}
          </dd>
        </dl>
      </div>
      <div
        role="img"
        aria-label={
          selling
            ? `Dos ${kw(energy.solarKw)} do telhado, ${kw(sharedKw)} vão para a casa e ${kw(gridKw)} para a rede`
            : `Dos ${kw(energy.houseKw)} da casa, ${kw(sharedKw)} vêm do telhado e ${kw(gridKw)} da rede`
        }
        className="mt-4"
      >
        <p className="mb-1 text-fio text-small">
          {selling
            ? `Para onde vão os ${kw(energy.solarKw)} do telhado`
            : `De onde vêm os ${kw(energy.houseKw)} da casa`}
        </p>
        <div className="flex h-9 border-2 border-grafite font-semibold text-small">
          <div
            className="flex items-center bg-modulo px-3 text-white"
            style={{ width: `${sharedPct}%` }}
          >
            {selling ? `Casa ${kw(sharedKw)}` : `Telhado ${kw(sharedKw)}`}
          </div>
          <div
            className={`flex flex-1 items-center justify-end border-grafite border-l-2 px-3 ${
              selling ? "bg-verde-tint text-verde-ink" : "bg-laranja-tint text-laranja-ink"
            }`}
          >
            {selling ? `Rede ${kw(gridKw)}` : `Rede ${kw(gridKw)}`}
          </div>
        </div>
      </div>
    </section>
  );
}
