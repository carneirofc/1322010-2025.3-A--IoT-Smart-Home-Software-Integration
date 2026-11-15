import { formatDecimal } from "@/lib/format";
import type { EnergySnapshot } from "@/mocks/types";
import { Card, CardHead } from "./Card";
import { BoltIcon, HomeIcon, SunIcon } from "./icons";
import { StatusPill } from "./StatusPill";

type NodeLook = "solar" | "house" | "grid";

const NODE_LOOK: Record<NodeLook, { box: string; icon: string }> = {
  solar: { box: "border-solar-line bg-solar-bg", icon: "text-solar" },
  house: { box: "border-line bg-surface-muted", icon: "text-brand" },
  grid: { box: "border-ok-line bg-ok-bg", icon: "text-ok-fg" },
};

function FlowNode({
  look,
  icon,
  label,
  kw,
  caption,
}: {
  look: NodeLook;
  icon: React.ReactNode;
  label: string;
  kw: number;
  caption?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 self-stretch rounded-xl border px-4 py-2.5 ${NODE_LOOK[look].box}`}
    >
      <span
        className={`grid size-[46px] flex-none place-items-center rounded-full border border-line bg-white ${NODE_LOOK[look].icon}`}
      >
        {icon}
      </span>
      <div>
        <p className="font-semibold text-fg-muted text-sm">{label}</p>
        <p className="font-bold text-xl leading-[1.1] tabular-nums">
          {formatDecimal(kw)} <small className="font-semibold text-base text-fg-muted">kW</small>
        </p>
        {caption ? <p className="font-semibold text-ok-fg text-xs">{caption}</p> : null}
      </div>
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="grid justify-items-center text-ok-solid" aria-hidden="true">
      <svg
        viewBox="0 0 120 24"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="h-6 w-full max-sm:hidden"
      >
        <path
          d="M8 12h96"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="6 5"
          fill="none"
        />
        <path d="M102 5l10 7-10 7z" fill="currentColor" />
      </svg>
      <span className="text-fg-muted text-xs">{label}</span>
    </div>
  );
}

/** Solar → house → grid, with what flows between them right now. */
export function EnergyFlow({ energy }: { energy: EnergySnapshot }) {
  const exporting = energy.gridKw < 0;
  const toHouseKw = Math.min(energy.solarKw, energy.houseKw);
  const gridKw = Math.abs(energy.gridKw);
  return (
    <Card labelledBy="flow-title">
      <CardHead
        id="flow-title"
        title="Energia agora"
        aside={
          exporting ? (
            <StatusPill tone="ok" label="VENDENDO PARA A REDE" />
          ) : (
            <StatusPill tone="neutral" label="COMPRANDO DA REDE" />
          )
        }
      />
      <div className="grid grid-cols-[1fr_120px_1fr_120px_1fr] items-center max-sm:grid-cols-1 max-sm:gap-2">
        <FlowNode look="solar" icon={<SunIcon size="lg" />} label="Solar" kw={energy.solarKw} />
        <FlowArrow label={`${formatDecimal(toHouseKw)} kW para a casa`} />
        <FlowNode look="house" icon={<HomeIcon size="lg" />} label="Casa" kw={energy.houseKw} />
        <FlowArrow
          label={
            exporting ? `sobra ${formatDecimal(gridKw)} kW` : `falta ${formatDecimal(gridKw)} kW`
          }
        />
        <FlowNode
          look="grid"
          icon={<BoltIcon size="lg" />}
          label="Rede"
          kw={gridKw}
          caption={exporting ? "injetando" : "comprando"}
        />
      </div>
    </Card>
  );
}
