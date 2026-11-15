import type { DaySeries } from "@/mocks/types";
import { Card, CardHead } from "./Card";
import { DayChart } from "./DayChart";
import { Legend, LegendItem } from "./Legend";

const SWATCH = "h-0 w-[22px] border-t-[3px]";

export function DayChartCard({ series }: { series: DaySeries }) {
  return (
    <Card labelledBy="chart-title">
      <CardHead
        id="chart-title"
        title={
          <>
            Últimas 24 h
            <span className="font-normal text-fg-muted text-sm">
              geração, consumo e troca com a rede (kW)
            </span>
          </>
        }
        aside={
          <Legend>
            <LegendItem swatch={`${SWATCH} border-solar`}>Geração solar</LegendItem>
            <LegendItem swatch={`${SWATCH} border-load`}>Consumo da casa</LegendItem>
            <LegendItem swatch={`${SWATCH} border-dashed border-exchange`}>
              Rede (+ compra / − venda)
            </LegendItem>
          </Legend>
        }
      />
      <DayChart series={series} />
    </Card>
  );
}
