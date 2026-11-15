import { formatDecimal } from "@/lib/format";
import type { LoadCommand } from "@/mocks/types";
import { Card, CardHead } from "./Card";
import { Confirm } from "./Confirm";
import { ClockIcon } from "./icons";
import { ModeTag } from "./ModeTag";

const TH =
  "border-line border-b pr-3 pb-2 text-left font-bold text-fg-muted text-xs uppercase tracking-[0.05em]";
const TD = "border-line border-b py-[9px] pr-3 align-middle";

export function CommandHistory({ commands }: { commands: readonly LoadCommand[] }) {
  return (
    <Card labelledBy="history-title">
      <CardHead id="history-title" icon={<ClockIcon />} title="Últimos comandos" />
      <table className="w-full border-collapse text-sm [&_tr:last-child>td]:border-b-0">
        <thead>
          <tr>
            <th scope="col" className={TH}>
              Hora
            </th>
            <th scope="col" className={TH}>
              Origem
            </th>
            <th scope="col" className={TH}>
              Comando
            </th>
            <th scope="col" className={TH}>
              Confirmação do relé
            </th>
          </tr>
        </thead>
        <tbody>
          {commands.map((command) => (
            <tr key={`${command.at}-${command.target}`}>
              <td className={`${TD} font-semibold tabular-nums`}>{command.at}</td>
              <td className={TD}>
                {command.source.kind === "rule" ? (
                  <ModeTag>{command.source.rule}</ModeTag>
                ) : (
                  <ModeTag manual>morador</ModeTag>
                )}
              </td>
              <td className={TD}>
                {command.target} → {command.action}
              </td>
              <td className={TD}>
                <Confirm>confirmado em {formatDecimal(command.confirmedInS)} s</Confirm>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
