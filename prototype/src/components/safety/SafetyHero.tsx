import { CyberPanel } from "@carneirofc/ui";
import type { Alert, GasReading, HouseAlarm } from "@/mocks/types";
import { ConfirmAction } from "../ui/ConfirmAction";
import { RuleChip } from "../ui/RuleChip";
import { StateMark } from "../ui/StateMark";

/** Is anything unsafe: gas, the house alarm, and the health alerts still open. */
export function SafetyHero({
  gas,
  alarm,
  openAlerts,
}: {
  gas: GasReading;
  alarm: HouseAlarm;
  openAlerts: readonly Alert[];
}) {
  return (
    <CyberPanel aria-labelledby="safety-title" className="rounded-panel px-7 py-5 sm:px-7 sm:py-5">
      <h2 id="safety-title" className="sr-only">
        Segurança agora
      </h2>
      <div className="grid grid-cols-[1fr_1fr] gap-8 max-sm:grid-cols-1">
        <div>
          <p className="flex items-baseline justify-between gap-3">
            <span className="font-semibold text-heading">Gás na {gas.location}</span>
            <StateMark tone={gas.detected ? "critical" : "ok"} className="text-small">
              {gas.detected ? "crítico" : "normal"}
            </StateMark>
          </p>
          <p
            className={`mt-1 font-semibold text-title leading-tight ${
              gas.detected ? "text-vermelho-ink" : "text-lima-ink"
            }`}
          >
            {gas.detected ? "Gás detectado" : "Não detectado"}
          </p>
          <p className="mt-1.5 text-small text-tinta-suave">
            <RuleChip rule="R8" className="mr-1.5" />
            Se detectar gás, o alarme da casa toca e todos recebem push.
          </p>
        </div>
        <div className="border-borda border-l pl-8 max-sm:border-l-0 max-sm:pl-0">
          <p className="flex items-baseline justify-between gap-3">
            <span className="font-semibold text-heading">Alarme da casa</span>
            <ConfirmAction
              label="Testar alarme"
              title="Testar o alarme da casa?"
              description="O alarme toca agora para conferir que ele responde."
              details={["Aviso: luz e bipe.", "Alarme: sirene."]}
              confirmLabel="Testar alarme"
            />
          </p>
          <p
            className={`mt-1 font-semibold text-title leading-tight ${
              alarm.active ? "text-vermelho-ink" : "text-tinta-2"
            }`}
          >
            {alarm.active ? "Tocando" : "Desligado"}
          </p>
          <p className="mt-1.5 text-small text-tinta-suave">
            <span className="font-semibold text-tinta-2">Aviso</span> é luz e bipe;{" "}
            <span className="font-semibold text-tinta-2">alarme</span> é a sirene.
          </p>
        </div>
      </div>
      {openAlerts.length > 0 ? (
        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-control bg-laranja-tint px-4 py-2 text-laranja-ink">
          <span className="font-semibold">
            {openAlerts.length === 1 ? "1 alerta aberto" : `${openAlerts.length} alertas abertos`}{" "}
            de saúde:
          </span>
          {openAlerts.map((alert, index) => (
            <span key={alert.id} className="inline-flex items-center gap-1.5">
              {alert.subject} <RuleChip rule={alert.rule} />
              {index < openAlerts.length - 1 ? "e" : null}
            </span>
          ))}
        </p>
      ) : null}
    </CyberPanel>
  );
}
