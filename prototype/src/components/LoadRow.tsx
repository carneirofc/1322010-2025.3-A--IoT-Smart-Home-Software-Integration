import { formatDecimal, formatDuration, formatNumber, percentOf } from "@/lib/format";
import type { Load, LoadCommitment } from "@/mocks/types";
import { Button, type ButtonVariant } from "./Button";
import { Confirm } from "./Confirm";
import { LoadIcon, loadStatus } from "./loadPresentation";
import { Meter } from "./Meter";
import { ModeTag } from "./ModeTag";
import { StatusPill } from "./StatusPill";

/** Column widths shared by the header and every row. */
export const LOAD_GRID =
  "grid grid-cols-[1.15fr_1.35fr_1.45fr_168px] gap-5 px-5 max-sm:grid-cols-1 max-sm:gap-3";

function ModeColumn({ load }: { load: Load }) {
  const { mode, cycle, lastCommand } = load;
  return (
    <div className="[&>p+p]:mt-1">
      <p>
        <ModeTag manual={mode.kind === "manual"}>
          {mode.kind === "manual" ? `Manual até ${mode.until}` : "Automático"}
        </ModeTag>
      </p>
      {cycle?.armed ? (
        <>
          <p className="text-sm">ciclo armado</p>
          <p className="text-fg-muted text-sm">
            espera {formatDecimal(cycle.waitsForSurplusKw)} kW de sobra
          </p>
        </>
      ) : lastCommand ? (
        <>
          <p className="text-sm">
            {lastCommand.source.kind === "rule"
              ? `${lastCommand.source.rule} (${lastCommand.source.reason}) às ${lastCommand.at}`
              : `morador, ${lastCommand.at}`}
          </p>
          {mode.kind === "manual" ? (
            <p className="text-fg-muted text-sm">a automação volta à meia-noite</p>
          ) : (
            <p>
              <Confirm>confirmado</Confirm>
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}

function CommitmentColumn({ commitment }: { commitment: LoadCommitment }) {
  switch (commitment.kind) {
    case "runtime": {
      const done = formatDuration(commitment.doneMin);
      const target = formatDuration(commitment.targetMin);
      return (
        <div>
          <p className="text-sm">
            <span className="font-semibold">Hoje {done}</span> de {target}
          </p>
          <div role="img" aria-label={`${done} de ${target} cumpridas`} className="mt-2 mb-1.5">
            <Meter
              fills={[{ pct: percentOf(commitment.doneMin, commitment.targetMin), tone: "ok" }]}
            />
          </div>
          <p className="text-fg-muted text-sm">prazo {commitment.deadline}</p>
        </div>
      );
    }
    case "ready_by":
      return (
        <div className="[&>p+p]:mt-1">
          <p className="text-sm">
            <span className="font-semibold">Pronta até {commitment.readyBy}</span>
          </p>
          <p className="text-fg-muted text-sm">
            liga pela rede às {commitment.gridFallbackAt} se faltar sobra ({commitment.rule})
          </p>
        </div>
      );
    case "usage":
      return (
        <div>
          <p className="text-sm">
            <span className="font-semibold">Hoje {formatDuration(commitment.todayMin)}</span>
          </p>
        </div>
      );
  }
}

/** Actions offered for the load's current state (inert in the prototype). */
function loadActions(load: Load): { label: string; variant: ButtonVariant }[] {
  if (load.mode.kind === "manual") {
    return [
      { label: load.relay === "on" ? "Desligar" : "Ligar", variant: "default" },
      { label: "Voltar ao automático", variant: "default" },
    ];
  }
  if (load.cycle?.armed && load.relay === "off") {
    return [
      { label: "Ligar agora", variant: "primary" },
      { label: "Cancelar ciclo", variant: "default" },
    ];
  }
  return [
    { label: load.relay === "on" ? "Desligar" : "Ligar", variant: "default" },
    { label: "Modo manual", variant: "default" },
  ];
}

/** One controlled load: state | mode and last command | daily commitment | actions. */
export function LoadRow({ load }: { load: Load }) {
  const status = loadStatus(load);
  return (
    <article className={`${LOAD_GRID} items-start border-line border-b py-4 last:border-b-0`}>
      <div>
        <h2 className="mb-1.5 flex items-center gap-2 font-bold text-md">
          <LoadIcon kind={load.kind} className="text-fg-muted" />
          {load.name}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone={status.tone} label={status.label} />
          <span className="font-bold text-md tabular-nums">{formatNumber(load.powerW)} W</span>
        </div>
      </div>
      <ModeColumn load={load} />
      <CommitmentColumn commitment={load.commitment} />
      <div className="flex flex-col items-stretch gap-2 max-sm:flex-row max-sm:flex-wrap">
        {loadActions(load).map((action) => (
          <Button key={action.label} variant={action.variant}>
            {action.label}
          </Button>
        ))}
      </div>
    </article>
  );
}

export function LoadTable({ loads }: { loads: readonly Load[] }) {
  return (
    <section
      aria-label="Cargas controladas"
      className="min-w-0 rounded-xl border border-line bg-surface shadow-card"
    >
      <div
        aria-hidden="true"
        className={`${LOAD_GRID} border-line border-b pt-3 pb-2 font-bold text-fg-muted text-xs uppercase tracking-[0.05em] max-sm:hidden`}
      >
        <span>Estado</span>
        <span>Modo e último comando</span>
        <span>Compromisso do dia</span>
        <span>Ações</span>
      </div>
      {loads.map((load) => (
        <LoadRow key={load.deviceId} load={load} />
      ))}
    </section>
  );
}
