import { formatNumber } from "@/lib/format";
import { daySeries } from "./series";
import type { AirQuality, Alert, EnergySnapshot, LoadCommand, Scenario } from "./types";

/**
 * The example scenario of the report (chapter 6): the same house at the same
 * instant, a weekday in November at 14:45. Every screen reads from here.
 */

const NOW = "14:45";

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
  temperatureC: 24,
  limitPpm: 1000,
  aboveLimitForMin: 20,
  scaleMinPpm: 400,
  scaleMaxPpm: 2000,
};

const pumpOn: LoadCommand = {
  at: "10:42",
  source: { kind: "rule", rule: "R1", reason: "sobra solar" },
  target: "bomba",
  action: "ligar",
  confirmedInS: 0.8,
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
    id: "alert-r7-bedroom",
    rule: "R7",
    severity: "warning",
    subject: "Ar-condicionado",
    headline: "Ar-condicionado fora do horário",
    detail: "quarto, ligado desde 13:10",
    title: "Quarto, ligado desde 13:10",
    description: "Fora do horário de uso.",
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
    state: { kind: "closed", at: "08:17", note: "lavadora religada" },
    followUp: "Ver comandos",
  },
  {
    id: "alert-r8-kitchen",
    rule: "R8",
    severity: "critical",
    subject: "Gás",
    headline: "Gás na cozinha",
    detail: "cozinha, 12/11 19:02",
    title: "Cozinha, 12/11 19:02",
    description:
      "Alarme da casa tocou em 1 s; push a todos os moradores e ao contato de emergência.",
    state: { kind: "closed", at: "19:31", note: "reconhecido por Ana" },
    followUp: "Linha do tempo",
  },
];

export const scenario: Scenario = {
  now: NOW,
  hub: { online: true, internetOk: true },
  energy: snapshotAtNow(),
  today: {
    until: NOW,
    generatedKwh: 20.4,
    consumedKwh: 17.4,
    selfConsumptionPct: 63,
    gridCreditKwh: 3.0,
  },
  month: {
    month: "Novembro",
    spentBrl: 151,
    projectionBrl: 310,
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
      summary: "sobra solar",
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
      summary: "ciclo armado, aguardando sobra",
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
  commands: [pumpOn, lightsOff],
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
    emptyHouseFrom: "08:00",
    emptyHouseTo: "17:00",
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

/** Alerts still waiting for someone (badge on the Alertas tab). */
export const openAlertCount = alerts.filter((alert) => alert.state.kind === "open").length;
