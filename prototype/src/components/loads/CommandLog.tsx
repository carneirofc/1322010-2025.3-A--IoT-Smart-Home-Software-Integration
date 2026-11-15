import { CheckIcon, CollapsiblePanel } from "@carneirofc/ui";
import { formatDecimal } from "@/lib/format";
import type { LoadCommand } from "@/mocks/types";
import { RuleChip } from "../ui/RuleChip";

const capitalise = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

const TH = "border-linha border-b py-1.5 pr-3 text-left font-semibold text-tinta-suave text-small";
const TD = "border-linha border-b py-2 pr-3 align-middle";

/** Every command sent to a relay: who asked, what, and how fast the relay answered. */
export function CommandLog({ commands }: { commands: readonly LoadCommand[] }) {
  return (
    <CollapsiblePanel
      defaultOpen
      className="cyber-subpanel mt-4 rounded-sub px-6 pt-2 pb-3"
      label={`Últimos comandos (${commands.length})`}
      triggerClassName="rounded-control px-0 py-1 font-semibold text-heading text-tinta hover:bg-transparent"
      contentClassName="pt-1"
    >
      <table className="w-full border-collapse text-body [&_tr:last-child>td]:border-b-0">
        <thead>
          <tr>
            <th scope="col" className={TH}>
              Hora
            </th>
            <th scope="col" className={TH}>
              Quem pediu
            </th>
            <th scope="col" className={TH}>
              Comando
            </th>
            <th scope="col" className={TH}>
              Resposta do relé
            </th>
          </tr>
        </thead>
        <tbody>
          {commands.map((command) => (
            <tr key={`${command.at}-${command.target}`}>
              <td className={`${TD} font-medium font-mono`}>{command.at}</td>
              <td className={TD}>
                {command.source.kind === "rule" ? (
                  <span className="inline-flex items-center gap-2">
                    <RuleChip rule={command.source.rule} />
                    {command.source.reason}
                  </span>
                ) : (
                  "Um morador"
                )}
              </td>
              <td className={TD}>
                {capitalise(command.action)} {command.target}
              </td>
              <td className={TD}>
                <span className="inline-flex items-center gap-1.5 text-lima-ink">
                  <CheckIcon size="h-4 w-4" />
                  confirmou em {formatDecimal(command.confirmedInS)} s
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CollapsiblePanel>
  );
}
