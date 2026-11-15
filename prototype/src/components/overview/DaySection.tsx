import type { DaySeries } from "@/mocks/types";
import { DayChart } from "./DayChart";

function Key({ line, children }: { line: string; children: string }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <span aria-hidden="true" className={`h-0 w-[22px] border-t-[3px] ${line}`} />
      {children}
    </li>
  );
}

/** Last 24 h of generation, consumption and grid exchange, open on the page. */
export function DaySection({ series }: { series: DaySeries }) {
  return (
    <section aria-labelledby="day-title" className="mt-4">
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h2 id="day-title" className="font-semibold text-heading">
          Últimas 24 horas, em kW
        </h2>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-small">
          <Key line="border-ciano">geração solar</Key>
          <Key line="border-violeta">consumo da casa</Key>
          <Key line="border-rosa-ink border-dashed">rede (+ compra, − venda)</Key>
        </ul>
      </div>
      <DayChart series={series} />
    </section>
  );
}
