import { formatNumber } from "@/lib/format";
import { daySeries } from "./series";
import type { AirQuality, Alert, EnergySnapshot, LoadCommand, Scenario } from "./types";

/**
 * The example scenario of the report (chapter 6): the same house at the same
 * instant, Tuesday 17 November 2026 at 14:45. Every screen reads from here.
 */

const NOW = "14:45";
const DATE = { year: 2026, month: 11, day: 17 };

/** Fraction of the month elapsed at DATE, NOW (drives the bill projection, R4). */
function monthFraction(): number {
  const [hh, mm] = NOW.split(":").map(Number) as [number, number];
  const daysInMonth = new Date(DATE.year, DATE.month, 0).getDate();
  return (DATE.day - 1 + (hh + mm / 60) / 24) / daysInMonth;
}

/** Today's totals, integrated from the 24 h curves (samples with hour ≥ 24). */
function todayTotals() {
  const step = 7.5 / 60;
  let generated = 0;
  let consumed = 0;
  let exported = 0;
  let imported = 0;
  for (const s of daySeries.samples) {
    if (s.hour < 24) continue;
    generated += s.solarKw * step;
    consumed += s.loadKw * step;
    if (s.gridKw < 0) exported -= s.gridKw * step;
    else imported += s.gridKw * step;
  }
  return {
    generatedKwh: roundTenth(generated),
    consumedKwh: roundTenth(consumed),
    selfConsumptionPct: Math.round(((generated - exported) / generated) * 100),
    gridCreditKwh: roundTenth(exported - imported),
  };
}

const SPENT_BRL = 172;

const roundTenth = (value: number): number => Math.round(value * 10) / 10;

/** "Energia agora" is the last sample of the 24 h curves. */
function snapshotAtNow(): EnergySnapshot {
  const last = daySeries.samples.at(-1);
  if (!last) throw new Error("empty day series");
  return {
    solarKw: roundTenth(last.solarKw),
    houseKw: roundTenth(last.loadKw),
    gridKw: roundTenth(last.gridKw),
  };
}

const air: AirQuality = {
  co2Ppm: 1240,
  temperatureC: 21,
  limitPpm: 1000,
  aboveLimitForMin: 20,
  scaleMinPpm: 400,
  scaleMaxPpm: 2000,
};

const pumpOn: LoadCommand = {
  at: "10:42",
  source: { kind: "rule", rule: "R1", reason: "excedente solar" },
  target: "bomba",
  action: "ligar",
  confirmedInS: 0.8,
};

const washerOnGrid: LoadCommand = {
  at: "08:00",
  source: { kind: "rule", rule: "R1", reason: "prazo, pela rede" },
  target: "lavadora",
  action: "ligar",
  confirmedInS: 0.7,
};

const washerShed: LoadCommand = {
  at: "08:07",
  source: { kind: "rule", rule: "R3", reason: "sobrecarga" },
  target: "lavadora",
  action: "desligar",
  confirmedInS: 0.6,
};

const washerBack: LoadCommand = {
  at: "08:24",
  source: { kind: "rule", rule: "R3", reason: "corrente normal" },
  target: "lavadora",
  action: "ligar",
  confirmedInS: 0.7,
};

const washerDone: LoadCommand = {
  at: "09:50",
  source: { kind: "rule", rule: "R1", reason: "fim do ciclo" },
  target: "lavadora",
  action: "desligar",
  confirmedInS: 0.6,
};

const lightsOff: LoadCommand = {
  at: "07:05",
  source: { kind: "resident" },
  target: "iluminação",
  action: "desligar",
  confirmedInS: 0.6,
};

const co2Reading = `${formatNumber(air.co2Ppm)} ppm há ${air.aboveLimitForMin} min`;

const alerts: readonly Alert[] = [
  {
    id: "alert-r9-bedroom",
    rule: "R9",
    severity: "warning",
    subject: "CO₂ no quarto",
    headline: "CO₂ alto no quarto",
    detail: co2Reading,
    title: co2Reading,
    description: "Abra a janela para renovar o ar.",
    state: { kind: "open", since: "14:40" },
  },
  {
    id: "alert-r6-bedroom",
    rule: "R6",
    severity: "attention",
    subject: "Ar-condicionado",
    headline: "Quarto abaixo de 23 °C",
    detail: "21 °C, ligado desde 13:10",
    title: "Quarto a 21 °C, ligado desde 13:10",
    description: "Ajuste o termostato para 23 a 26 °C.",
    state: { kind: "open", since: "13:40" },
  },
  {
    id: "alert-r3-entrance",
    rule: "R3",
    severity: "warning",
    subject: "Sobrecarga",
    headline: "Sobrecarga na entrada",
    detail: "46 A de 50 A às 08:07",
    title: "46 A de 50 A às 08:07",
    description: "Lavadora desligada para proteger o disjuntor geral.",
    state: { kind: "closed", at: "08:24", note: "lavadora religada" },
    followUp: { label: "Ver comandos", href: "/cargas/" },
  },
  {
    id: "alert-r8-kitchen",
    rule: "R8",
    severity: "critical",
    subject: "Gás",
    headline: "Gás na cozinha",
    detail: "cozinha, 15/11 19:02",
    title: "Cozinha, 15/11 19:02",
    description:
      "Alarme da casa tocou em 1 s; push a todos os moradores e ao contato de emergência.",
    state: { kind: "closed", at: "19:31", note: "reconhecido por Ana" },
    followUp: { label: "Linha do tempo" },
  },
];

export const scenario: Scenario = {
  now: NOW,
  hub: { online: true, internetOk: true },
  energy: snapshotAtNow(),
  today: { until: NOW, ...todayTotals() },
  month: {
    month: "Novembro",
    spentBrl: SPENT_BRL,
    projectionBrl: Math.round(SPENT_BRL / monthFraction()),
    budgetBrl: 350,
    scaleMaxBrl: 400,
    tariffFlag: "verde",
  },
  series: daySeries,
  entrance: { currentA: 4, breakerA: 50, sheddingA: 45, sheddingActive: false },
  loads: [
    {
      kind: "pool_pump",
      deviceId: "relay_pool_01",
      name: "Bomba da piscina",
      summary: "excedente solar",
      relay: "on",
      powerW: 742,
      mode: { kind: "automatic" },
      lastCommand: pumpOn,
      commitment: { kind: "runtime", doneMin: 243, targetMin: 360, deadline: "17:00" },
    },
    {
      kind: "washer",
      deviceId: "relay_laundry_01",
      name: "Lavadora",
      summary: "ciclo armado, aguardando excedente",
      relay: "off",
      powerW: 0,
      mode: { kind: "automatic" },
      cycle: { armed: true, waitsForSurplusKw: 1.2 },
      commitment: { kind: "ready_by", readyBy: "18:00", gridFallbackAt: "16:30", rule: "R1" },
    },
    {
      kind: "outdoor_lights",
      deviceId: "relay_outdoor_01",
      name: "Iluminação externa",
      summary: "modo manual",
      relay: "off",
      powerW: 0,
      mode: { kind: "manual", until: "23:59" },
      lastCommand: lightsOff,
      commitment: { kind: "usage", todayMin: 0 },
    },
  ],
  commands: [pumpOn, washerDone, washerBack, washerShed, washerOnGrid, lightsOff],
  gas: { location: "cozinha", detected: false },
  alarm: { active: false },
  supply: {
    phaseAV: 127,
    phaseBV: 126,
    adequateMinV: 117,
    adequateMaxV: 133,
    scaleMinV: 110,
    scaleMaxV: 140,
  },
  air,
  airConditioner: {
    on: true,
    onSince: "13:10",
    powerKw: 1.1,
    roomTemperatureC: air.temperatureC,
    recommendedMinC: 23,
    recommendedMaxC: 26,
  },
  deviceHealth: {
    devices: [
      { id: "energy_meter_panel_01", status: { kind: "online" } },
      { id: "pv_inverter_garage_01", status: { kind: "online" } },
      { id: "relay_pool_01", status: { kind: "online" } },
      { id: "relay_laundry_01", status: { kind: "online" } },
      { id: "relay_outdoor_01", status: { kind: "late", lastMessageAgoS: 25 } },
      { id: "gas_sensor_kitchen_01", status: { kind: "online" } },
      { id: "air_quality_bedroom_01", status: { kind: "online" } },
      { id: "siren_hall_01", status: { kind: "online" } },
    ],
    rejectedToday: 3,
    duplicatesDiscarded: 41,
  },
  alerts,
};
