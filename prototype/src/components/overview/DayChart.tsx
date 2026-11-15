import { formatDecimal, formatNumber } from "@/lib/format";
import type { DaySeries, EnergySample } from "@/mocks/types";

/** Plot geometry, in viewBox units. */
const VIEW = { width: 936, height: 200 };
const PLOT = { left: 40, right: 924, top: 12, bottom: 170 };
const Y_RANGE = { min: -3, max: 5 };
const TICK_EVERY_H = 3;
/** Hour ticks closer than this to either end would collide with the end labels. */
const TICK_END_GAP_H = 2.5;
const AXIS_LABEL_Y = 192;
const Y_LABEL_X = 32;
const Y_LABEL_DY = 4.5;
const ZONE_LABEL_INSET = 8.9;
const NOW_LABEL_DX = -9;

type SeriesKey = "solarKw" | "loadKw" | "gridKw";

interface SeriesLook {
  key: SeriesKey;
  line: string;
  dot: string;
  label: string;
  /** Offset of the "now" value label from its dot. */
  labelDy: number;
}

const SOLAR: SeriesLook = {
  key: "solarKw",
  line: "fill-none stroke-2 stroke-ciano",
  dot: "fill-ciano",
  label: "fill-ciano-ink",
  labelDy: -8,
};
const LOAD: SeriesLook = {
  key: "loadKw",
  line: "fill-none stroke-[2.2] stroke-violeta",
  dot: "fill-violeta",
  label: "fill-violeta",
  labelDy: 16,
};
const GRID: SeriesLook = {
  key: "gridKw",
  line: "fill-none stroke-2 stroke-rosa-ink [stroke-dasharray:6_4]",
  dot: "fill-rosa-ink",
  label: "fill-rosa-ink",
  labelDy: 16,
};

const coord = (value: number): string => value.toFixed(1);

/** "HH:MM" for an hour of the window (today's hours are offset by 24). */
export function clockLabel(hour: number): string {
  const minutes = Math.round((hour % 24) * 60);
  const hh = String(Math.floor(minutes / 60) % 24).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function scales(samples: readonly EnergySample[]) {
  const first = samples[0]?.hour ?? 0;
  const last = samples.at(-1)?.hour ?? first + 24;
  const x = (hour: number) =>
    PLOT.left + ((hour - first) / (last - first)) * (PLOT.right - PLOT.left);
  const y = (kw: number) =>
    PLOT.bottom - ((kw - Y_RANGE.min) / (Y_RANGE.max - Y_RANGE.min)) * (PLOT.bottom - PLOT.top);
  return { first, last, x, y };
}

function points(samples: readonly EnergySample[], key: SeriesKey, s: ReturnType<typeof scales>) {
  return samples.map((sample) => `${coord(s.x(sample.hour))},${coord(s.y(sample[key]))}`);
}

function describe(samples: readonly EnergySample[]): string {
  const now = samples.at(-1);
  const peak = samples.reduce<EnergySample | undefined>(
    (best, sample) => (!best || sample.solarKw > best.solarKw ? sample : best),
    undefined,
  );
  if (!now || !peak) return "Gráfico das últimas 24 horas sem dados.";
  const exchange =
    now.gridKw < 0
      ? `${formatDecimal(-now.gridKw)} kW injetados agora`
      : `${formatDecimal(now.gridKw)} kW comprados agora`;
  return (
    `Gráfico das últimas 24 horas: geração solar com pico de ${formatDecimal(peak.solarKw)} kW ` +
    `às ${clockLabel(peak.hour)} e ${formatDecimal(now.solarKw)} kW agora; consumo da casa de ` +
    `${formatDecimal(now.loadKw)} kW agora; troca com a rede de ${exchange}.`
  );
}

/** Solar generation, house consumption and grid exchange over the last 24 h. */
export function DayChart({ series }: { series: DaySeries }) {
  const { samples } = series;
  const s = scales(samples);
  const zeroY = coord(s.y(0));
  const solar = points(samples, "solarKw", s);
  const firstX = coord(s.x(s.first));
  const lastX = coord(s.x(s.last));
  const now = samples.at(-1);

  const yTicks = Array.from({ length: Y_RANGE.max - Y_RANGE.min + 1 }, (_, i) => Y_RANGE.min + i);
  const firstTick = Math.ceil(s.first / TICK_EVERY_H) * TICK_EVERY_H;
  const xTicks: number[] = [];
  for (let hour = firstTick; hour < s.last; hour += TICK_EVERY_H) {
    if (hour - s.first >= TICK_END_GAP_H && s.last - hour >= TICK_END_GAP_H) xTicks.push(hour);
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
      role="img"
      aria-label={describe(samples)}
      className="block h-auto w-full fill-tinta-suave font-mono text-[13px]"
    >
      {yTicks.map((kw) => {
        const y = coord(s.y(kw));
        return (
          <g key={kw}>
            <line
              x1={PLOT.left}
              x2={PLOT.right}
              y1={y}
              y2={y}
              className={kw === 0 ? "stroke-[1.5] stroke-tinta-suave" : "stroke-1 stroke-linha"}
            />
            <text x={Y_LABEL_X} y={coord(s.y(kw) + Y_LABEL_DY)} textAnchor="end">
              {formatNumber(kw)}
            </text>
          </g>
        );
      })}
      <text x={PLOT.left + 6} y={PLOT.top + ZONE_LABEL_INSET} className="font-semibold">
        kW
      </text>
      <text
        x={PLOT.right - 110}
        y={coord(PLOT.bottom - ZONE_LABEL_INSET)}
        textAnchor="end"
        className="font-sans font-semibold"
      >
        abaixo de 0: venda para a rede
      </text>

      <text x={firstX} y={AXIS_LABEL_Y} textAnchor="start">
        ontem {clockLabel(s.first)}
      </text>
      {xTicks.map((hour) => {
        const x = coord(s.x(hour));
        return (
          <g key={hour}>
            <line
              x1={x}
              x2={x}
              y1={PLOT.top}
              y2={PLOT.bottom}
              strokeDasharray="2 4"
              className="stroke-1 stroke-linha"
            />
            <text x={x} y={AXIS_LABEL_Y} textAnchor="middle">
              {clockLabel(hour)}
            </text>
          </g>
        );
      })}

      <path
        d={`M${firstX},${zeroY} L${solar.join(" ")} L${lastX},${zeroY} Z`}
        className="fill-solar-area stroke-none"
      />
      {[SOLAR, GRID, LOAD].map((look) => (
        <path
          key={look.key}
          d={`M${points(samples, look.key, s).join(" L")}`}
          className={look.line}
        />
      ))}

      <line
        x1={lastX}
        x2={lastX}
        y1={PLOT.top}
        y2={PLOT.bottom}
        className="stroke-[1.2] stroke-tinta [stroke-dasharray:3_3]"
      />
      <text x={lastX} y={AXIS_LABEL_Y} textAnchor="end" className="fill-tinta font-semibold">
        agora {clockLabel(s.last)}
      </text>
      {now
        ? [SOLAR, LOAD, GRID].map((look) => {
            const cy = s.y(now[look.key]);
            return (
              <g key={look.key}>
                <circle
                  cx={lastX}
                  cy={coord(cy)}
                  r={5}
                  className={`stroke-2 stroke-papel ${look.dot}`}
                />
                <text
                  x={coord(s.x(s.last) + NOW_LABEL_DX)}
                  y={coord(cy + look.labelDy)}
                  textAnchor="end"
                  className={`font-bold ${look.label}`}
                >
                  {formatDecimal(now[look.key])}
                </text>
              </g>
            );
          })
        : null}
    </svg>
  );
}
