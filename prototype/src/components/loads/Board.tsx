import { CheckIcon, CyberPanel } from "@carneirofc/ui";
import { formatDecimal, formatDuration, formatNumber, percentOf } from "@/lib/format";
import type { EnergySnapshot, Load, LoadCommand, LoadCommitment } from "@/mocks/types";
import { Bar } from "../ui/Bar";
import { Button } from "../ui/Button";
import { ConfirmAction, type ConfirmActionProps } from "../ui/ConfirmAction";
import { Compact } from "../ui/Reading";
import { RelayDot } from "../ui/RelayDot";
import { RuleChip } from "../ui/RuleChip";

const PAST: Record<LoadCommand["action"], string> = { ligar: "Ligada", desligar: "Desligada" };

/** What happened and when on one line, who asked on the next: neither breaks mid phrase. */
function LastCommand({ command }: { command: LoadCommand }) {
  return (
    <>
      <p className="whitespace-nowrap">
        {PAST[command.action]} às <span className="font-mono">{command.at}</span>
      </p>
      <p className="flex flex-wrap items-center gap-x-1.5 text-small text-tinta-suave">
        {command.source.kind === "rule" ? (
          <>
            pela <RuleChip rule={command.source.rule} />
            <span className="whitespace-nowrap">{command.source.reason}</span>
          </>
        ) : (
          "por um morador"
        )}
      </p>
    </>
  );
}

/** Mode, then why the relay is in its state now. */
function ModeColumn({ load }: { load: Load }) {
  const { mode, cycle, lastCommand } = load;
  return (
    <div className="space-y-1">
      <p className="font-semibold">
        {mode.kind === "manual" ? `Manual até ${mode.until}` : "Automático"}
      </p>
      {cycle?.armed ? (
        <>
          <p>Ciclo armado</p>
          <p className="text-tinta-suave text-small">
            espera {formatDecimal(cycle.waitsForSurplusKw)} kW de sobra
          </p>
        </>
      ) : lastCommand ? (
        <>
          <LastCommand command={lastCommand} />
          {mode.kind === "manual" ? (
            <p className="text-tinta-suave text-small">a automação volta à meia-noite</p>
          ) : (
            <p className="inline-flex items-center gap-1 text-small text-lima-ink">
              <CheckIcon size="h-4 w-4" />
              relé confirmou
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
          <p>
            <Compact value={done} className="font-medium text-heading" /> de {target} hoje
          </p>
          <div role="img" aria-label={`${done} de ${target} cumpridas`} className="my-1.5">
            <Bar
              fills={[{ pct: percentOf(commitment.doneMin, commitment.targetMin), tone: "ink" }]}
            />
          </div>
          <p className="text-tinta-suave text-small">até as {commitment.deadline}</p>
        </div>
      );
    }
    case "ready_by":
      return (
        <div className="space-y-1">
          <p>
            Pronta até <Compact value={commitment.readyBy} className="font-medium text-heading" />
          </p>
          <p className="text-tinta-suave text-small">
            se faltar sobra, liga pela rede às {commitment.gridFallbackAt}{" "}
            <RuleChip rule={commitment.rule} />
          </p>
        </div>
      );
    case "usage":
      return (
        <p>
          <Compact
            value={formatDuration(commitment.todayMin)}
            className="font-medium text-heading"
          />{" "}
          ligada hoje
        </p>
      );
  }
}

type Action =
  | { kind: "confirm"; props: ConfirmActionProps }
  | { kind: "plain"; label: string; primary?: boolean };

/** Actions offered for the load's state; switching a relay asks first. */
function loadActions(load: Load, energy: EnergySnapshot): Action[] {
  const name = load.name.toLowerCase();
  const takeOver =
    "A carga passa para o modo manual e a automação não a toca até o fim do dia, exceto pela segurança.";
  const switchAction = (): Action => {
    const on = load.relay === "on";
    const details: string[] = [];
    if (load.commitment.kind === "runtime") {
      details.push(
        `Hoje: ${formatDuration(load.commitment.doneMin)} de ${formatDuration(load.commitment.targetMin)}, até as ${load.commitment.deadline}.`,
      );
    }
    return {
      kind: "confirm",
      props: {
        label: on ? "Desligar" : "Ligar",
        title: `${on ? "Desligar" : "Ligar"} ${name}?`,
        description:
          load.mode.kind === "manual"
            ? `A carga continua em modo manual até ${load.mode.until}.`
            : takeOver,
        details,
        confirmLabel: on ? "Desligar" : "Ligar",
      },
    };
  };
  if (load.mode.kind === "manual") {
    return [switchAction(), { kind: "plain", label: "Voltar ao automático" }];
  }
  if (load.cycle?.armed && load.relay === "off") {
    const surplusKw = Math.max(0, -energy.gridKw);
    return [
      {
        kind: "confirm",
        props: {
          label: "Ligar agora",
          tone: "primary",
          title: `Ligar ${name} agora?`,
          description: "O ciclo começa já, sem esperar a sobra solar; a falta vem da rede.",
          details: [
            `Sobra agora: ${formatDecimal(surplusKw)} kW.`,
            `O ciclo espera ${formatDecimal(load.cycle.waitsForSurplusKw)} kW de sobra.`,
          ],
          confirmLabel: "Ligar agora",
        },
      },
      {
        kind: "confirm",
        props: {
          label: "Cancelar ciclo",
          title: "Cancelar o ciclo armado?",
          description: "O ciclo armado é desfeito e a lavadora deixa de esperar a sobra solar.",
          confirmLabel: "Cancelar ciclo",
        },
      },
    ];
  }
  return [switchAction(), { kind: "plain", label: "Modo manual" }];
}

/** One load: relay and reading | mode | commitment | actions. */
function Breaker({ load, energy }: { load: Load; energy: EnergySnapshot }) {
  const on = load.relay === "on";
  return (
    <article
      aria-label={load.name}
      className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_176px] items-start gap-5 border-linha border-b px-6 py-3.5 last:border-b-0 max-sm:grid-cols-1 max-sm:gap-3"
    >
      <div className="flex gap-3">
        <span className="pt-1.5">
          <RelayDot on={on} />
        </span>
        <div>
          <h3 className="font-semibold text-heading leading-tight">{load.name}</h3>
          <p className="font-mono text-caption text-tinta-suave">{load.deviceId}</p>
          <p className="mt-1">
            <span className={`font-semibold ${on ? "text-ciano-ink" : "text-tinta-suave"}`}>
              {on ? "Ligada" : "Desligada"}
            </span>{" "}
            <Compact value={`${formatNumber(load.powerW)} W`} className="font-medium" />
          </p>
        </div>
      </div>
      <ModeColumn load={load} />
      <CommitmentColumn commitment={load.commitment} />
      <div className="flex flex-col items-stretch gap-2 max-sm:flex-row max-sm:flex-wrap">
        {loadActions(load, energy).map((action) =>
          action.kind === "confirm" ? (
            <ConfirmAction key={action.props.label} {...action.props} />
          ) : (
            <Button key={action.label}>{action.label}</Button>
          ),
        )}
      </div>
    </article>
  );
}

/** The controlled loads, one row each, in the screen's CyberPanel. */
export function Board({ loads, energy }: { loads: readonly Load[]; energy: EnergySnapshot }) {
  return (
    <CyberPanel
      aria-labelledby="board-title"
      className="mt-4 overflow-hidden rounded-panel p-0 sm:p-0"
    >
      <div className="flex items-baseline justify-between gap-4 px-6 pt-4 pb-1">
        <h2 id="board-title" className="font-semibold text-title leading-tight">
          Cargas controladas
        </h2>
        <p className="text-small text-tinta-suave">
          {loads.length} circuitos com relé; o morador sempre pode assumir
        </p>
      </div>
      <div
        aria-hidden="true"
        className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_176px] gap-5 border-borda border-b px-6 pt-1 pb-1.5 font-semibold text-caption text-tinta-suave max-sm:hidden"
      >
        <span>Carga</span>
        <span>Modo e último comando</span>
        <span>Compromisso do dia</span>
        <span>Ações</span>
      </div>
      {loads.map((load) => (
        <Breaker key={load.deviceId} load={load} energy={energy} />
      ))}
    </CyberPanel>
  );
}
