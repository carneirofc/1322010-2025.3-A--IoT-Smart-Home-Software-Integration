import type { DaySeries, EnergySample } from "./types";

/**
 * 24 h curves of the example house: yesterday 14:45 → today 14:45 in 7.5 min
 * steps. Hours are clock hours; today's hours are offset by 24 (h + 24).
 */

const WINDOW_START_H = 14.75;
const WINDOW_END_H = 38.75;
const STEP_H = 7.5 / 60;

const SOLAR_PEAK_KW = 3.2;
const SOLAR_NOON_H = 12.5;
const SOLAR_HALF_DAY_H = 6.5;
const SOLAR_SHAPE = 0.86;

/** A passing cloud this morning. */
const CLOUD = { centreH: 10.2, widthH: 0.3, depth: 0.22 };

/** House consumption, piecewise linear through (hour, kW). */
const LOAD_POINTS: ReadonlyArray<readonly [number, number]> = [
  [14.75, 1.45],
  [16.9, 1.4],
  [17.2, 1.0],
  [18.0, 1.3],
  [18.8, 2.1],
  [19.2, 3.3],
  [19.5, 3.4],
  [19.8, 2.0],
  [21.0, 1.7],
  [22.0, 1.3],
  [22.6, 1.7],
  [23.0, 1.0],
  [24.5, 0.4],
  [28.8, 0.4],
  [29.2, 0.45],
  [30.0, 0.5],
  [30.4, 1.6],
  [30.9, 1.7],
  [31.2, 0.9],
  [31.8, 1.0],
  [32.0, 4.0],
  [32.2, 4.1],
  [32.3, 2.6],
  [32.6, 2.5],
  [33.4, 2.4],
  [33.6, 0.75],
  [34.6, 0.75],
  [34.75, 1.5],
  [37.1, 1.5],
  [37.2, 2.2],
  [38.75, 2.2],
];

export function solarKw(hour: number): number {
  const today = hour >= 24;
  const clock = today ? hour - 24 : hour;
  const offset = clock - SOLAR_NOON_H;
  if (Math.abs(offset) >= SOLAR_HALF_DAY_H) return 0;
  const clearSky =
    SOLAR_PEAK_KW * Math.cos((Math.PI * offset) / (2 * SOLAR_HALF_DAY_H)) ** SOLAR_SHAPE;
  if (!today) return clearSky;
  const cloud = 1 - CLOUD.depth * Math.exp(-(((clock - CLOUD.centreH) / CLOUD.widthH) ** 2));
  return clearSky * cloud;
}

export function loadKw(hour: number): number {
  for (let i = 1; i < LOAD_POINTS.length; i++) {
    const [h0, v0] = LOAD_POINTS[i - 1] ?? [0, 0];
    const [h1, v1] = LOAD_POINTS[i] ?? [0, 0];
    if (hour <= h1) return v0 + ((v1 - v0) * (hour - h0)) / (h1 - h0);
  }
  return LOAD_POINTS.at(-1)?.[1] ?? 0;
}

function sampleDay(): EnergySample[] {
  const count = Math.round((WINDOW_END_H - WINDOW_START_H) / STEP_H);
  return Array.from({ length: count + 1 }, (_, i) => {
    const hour = WINDOW_START_H + i * STEP_H;
    const solar = solarKw(hour);
    const load = loadKw(hour);
    return { hour, solarKw: solar, loadKw: load, gridKw: load - solar };
  });
}

export const daySeries: DaySeries = {
  start: "14:45",
  end: "14:45",
  samples: sampleDay(),
};
