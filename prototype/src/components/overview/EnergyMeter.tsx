import { CyberPanel } from "@carneirofc/ui";
import { formatDecimal, percentOf } from "@/lib/format";
import type { EnergySnapshot } from "@/mocks/types";
import { Compact, Reading } from "../ui/Reading";

const kw = (value: number): string => `${formatDecimal(value)} kW`;

/**
 * Energy right now: buying or selling, and how the larger of solar and
 * consumption splits between the house and the grid.
 */
export function EnergyMeter({ energy }: { energy: EnergySnapshot }) {
  const selling = energy.gridKw < 0;
  const gridKw = Math.abs(energy.gridKw);
  // Selling: the roof's output splits into house + grid.
  // Buying: the house's consumption splits into solar + grid.
  const whole = selling ? energy.solarKw : energy.houseKw;
  const sharedKw = Math.min(energy.solarKw, energy.houseKw);
  const sharedPct = percentOf(sharedKw, whole);
  return (
    <CyberPanel aria-labelledby="meter-title" className="rounded-panel px-7 py-5 sm:px-7 sm:py-5">
      <div className="flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start">
        <div>
          <h2 id="meter-title" className="font-semibold text-heading leading-tight">
            {selling ? "Agora a casa está vendendo energia" : "Agora a casa está comprando energia"}
          </h2>
          <p className="mt-1 flex items-baseline gap-3">
            <Reading
              value={formatDecimal(gridKw)}
              unit="kW"
              className={`font-medium text-reading leading-none tracking-[-0.03em] ${
                selling ? "text-lima-ink" : "text-laranja-ink"
              }`}
            />
            <span className="font-semibold text-tinta-2">
              {selling ? "injetados na rede" : "vindos da rede"}
            </span>
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 text-right max-sm:text-left">
          <dt className="font-semibold text-ciano-ink text-small">Telhado gera</dt>
          <dt className="font-semibold text-small text-violeta">Casa consome</dt>
          <dd className="text-display leading-tight">
            <Reading value={formatDecimal(energy.solarKw)} unit="kW" />
          </dd>
          <dd className="text-display leading-tight">
            <Reading value={formatDecimal(energy.houseKw)} unit="kW" />
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
        <p className="mb-1.5 text-small text-tinta-suave">
          {selling
            ? `Para onde vão os ${kw(energy.solarKw)} do telhado`
            : `De onde vêm os ${kw(energy.houseKw)} da casa`}
        </p>
        <div className="flex h-9 overflow-hidden rounded-full border border-borda bg-papel font-semibold text-small">
          <div
            className="flex min-w-0 shrink items-center whitespace-nowrap rounded-full bg-[linear-gradient(90deg,color-mix(in_oklab,var(--color-ciano)_38%,white),color-mix(in_oklab,var(--color-ciano)_22%,white))] px-4 text-ciano-ink"
            style={{ width: `${sharedPct}%` }}
          >
            {selling ? "casa" : "telhado"}&nbsp;
            <Compact value={kw(sharedKw)} />
          </div>
          <div
            className={`flex flex-1 shrink-0 items-center justify-end whitespace-nowrap px-4 ${
              selling ? "bg-lima-tint text-lima-ink" : "bg-laranja-tint text-laranja-ink"
            }`}
          >
            rede&nbsp;
            <Compact value={kw(gridKw)} />
          </div>
        </div>
      </div>
    </CyberPanel>
  );
}
