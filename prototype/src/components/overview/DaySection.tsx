import type { DaySeries } from "@/mocks/types";
import { Section } from "../ui/Section";
import { DayChart } from "./DayChart";

function Key({ line, children }: { line: string; children: string }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <span aria-hidden="true" className={`h-0 w-[22px] border-t-[3px] ${line}`} />
      {children}
    </li>
  );
}

/** Last 24 h of generation, consumption and grid exchange. */
export function DaySection({ series }: { series: DaySeries }) {
  return (
    <Section
      id="day-title"
      className="mt-5"
      title="Últimas 24 horas, em kW"
      aside={
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-small">
          <Key line="border-modulo">geração solar</Key>
          <Key line="border-grafite">consumo da casa</Key>
          <Key line="border-marrom border-dashed">rede (+ compra, − venda)</Key>
        </ul>
      }
    >
      <DayChart series={series} />
    </Section>
  );
}
