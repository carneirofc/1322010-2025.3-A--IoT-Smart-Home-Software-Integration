/** Domain types for the example scenario. Times are local clock times ("HH:MM"). */

export type ClockTime = `${number}:${number}`;

/** Business rules of the report (chapter 5). */
export type RuleId = "R1" | "R2" | "R3" | "R4" | "R5" | "R6" | "R7" | "R8" | "R9";

/** Status semantics shared by every screen: colour always comes with a text label. */
export type Tone = "ok" | "attention" | "warning" | "critical" | "neutral";

export type Severity = "attention" | "warning" | "critical";

// ---------- Devices ----------

export type DeviceType =
  | "energy_meter"
  | "pv_inverter"
  | "relay"
  | "gas_sensor"
  | "air_quality"
  | "siren";

export type DeviceLocation =
  | "panel"
  | "garage"
  | "pool"
  | "laundry"
  | "outdoor"
  | "kitchen"
  | "bedroom"
  | "hall";

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

/** Device identifier, `<type>_<location>_<nn>`. */
export type DeviceId = `${DeviceType}_${DeviceLocation}_${Digit}${Digit}`;

export type DeviceStatus = { kind: "online" } | { kind: "late"; lastMessageAgoS: number };

export interface Device {
  id: DeviceId;
  status: DeviceStatus;
}

export interface DeviceHealth {
  devices: readonly Device[];
  rejectedToday: number;
  duplicatesDiscarded: number;
}

// ---------- Energy ----------

/** Instantaneous power flow; `gridKw` is positive when buying, negative when injecting. */
export interface EnergySnapshot {
  solarKw: number;
  houseKw: number;
  gridKw: number;
}

export interface DayTotals {
  until: ClockTime;
  generatedKwh: number;
  consumedKwh: number;
  selfConsumptionPct: number;
  gridCreditKwh: number;
}

export type TariffFlag = "verde" | "amarela" | "vermelha";

export interface MonthBudget {
  month: string;
  spentBrl: number;
  projectionBrl: number;
  budgetBrl: number;
  scaleMaxBrl: number;
  tariffFlag: TariffFlag;
}

/** One sample of the 24 h curves; `hour` is in clock hours, today = hour ≥ 24. */
export interface EnergySample {
  hour: number;
  solarKw: number;
  loadKw: number;
  gridKw: number;
}

export interface DaySeries {
  start: ClockTime;
  end: ClockTime;
  samples: readonly EnergySample[];
}

// ---------- Loads ----------

export type LoadKind = "pool_pump" | "washer" | "outdoor_lights";

export type RelayState = "on" | "off";

export type LoadMode = { kind: "automatic" } | { kind: "manual"; until: ClockTime };

export type CommandSource = { kind: "rule"; rule: RuleId; reason: string } | { kind: "resident" };

export interface LoadCommand {
  at: ClockTime;
  source: CommandSource;
  target: string;
  action: "ligar" | "desligar";
  confirmedInS: number;
}

export type LoadCommitment =
  | { kind: "runtime"; doneMin: number; targetMin: number; deadline: ClockTime }
  | { kind: "ready_by"; readyBy: ClockTime; gridFallbackAt: ClockTime; rule: RuleId }
  | { kind: "usage"; todayMin: number };

export interface WasherCycle {
  armed: boolean;
  waitsForSurplusKw: number;
}

export interface Load {
  kind: LoadKind;
  deviceId: DeviceId;
  name: string;
  /** Short reason shown on the overview list. */
  summary: string;
  relay: RelayState;
  powerW: number;
  mode: LoadMode;
  lastCommand?: LoadCommand;
  cycle?: WasherCycle;
  commitment: LoadCommitment;
}

export interface ServiceEntrance {
  currentA: number;
  breakerA: number;
  /** R3 sheds loads from this current on. */
  sheddingA: number;
  sheddingActive: boolean;
}

// ---------- Safety and health ----------

export interface GasReading {
  location: string;
  detected: boolean;
}

export interface HouseAlarm {
  active: boolean;
}

export interface SupplyVoltage {
  phaseAV: number;
  phaseBV: number;
  adequateMinV: number;
  adequateMaxV: number;
  scaleMinV: number;
  scaleMaxV: number;
}

export interface AirQuality {
  co2Ppm: number;
  temperatureC: number;
  limitPpm: number;
  aboveLimitForMin: number;
  scaleMinPpm: number;
  scaleMaxPpm: number;
}

export interface AirConditioner {
  on: boolean;
  onSince: ClockTime;
  powerKw: number;
  emptyHouseFrom: ClockTime;
  emptyHouseTo: ClockTime;
}

// ---------- Alerts ----------

export type AlertState =
  | { kind: "open"; since: ClockTime }
  | { kind: "acknowledged"; since: ClockTime }
  | { kind: "closed"; at: ClockTime; note: string };

export interface Alert {
  id: string;
  rule: RuleId;
  severity: Severity;
  /** Rule subject, e.g. "CO₂ no quarto". */
  subject: string;
  /** Headline on the overview list. */
  headline: string;
  /** Detail on the overview list (the rule id is appended). */
  detail: string;
  title: string;
  description: string;
  state: AlertState;
  /** Secondary action of a closed alert: a link when `href` is set, else the alert's detail. */
  followUp?: { label: string; href?: string };
}

// ---------- Whole scenario ----------

export interface Hub {
  online: boolean;
  internetOk: boolean;
}

export interface Scenario {
  now: ClockTime;
  hub: Hub;
  energy: EnergySnapshot;
  today: DayTotals;
  month: MonthBudget;
  series: DaySeries;
  entrance: ServiceEntrance;
  loads: readonly Load[];
  commands: readonly LoadCommand[];
  gas: GasReading;
  alarm: HouseAlarm;
  supply: SupplyVoltage;
  air: AirQuality;
  airConditioner: AirConditioner;
  deviceHealth: DeviceHealth;
  alerts: readonly Alert[];
}
