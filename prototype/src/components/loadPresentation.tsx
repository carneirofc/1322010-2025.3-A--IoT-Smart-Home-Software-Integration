import type { Load, LoadKind, Tone } from "@/mocks/types";
import { BulbIcon, DropIcon, type IconProps, WasherIcon } from "./icons";

const LOAD_ICON: Record<LoadKind, (props: IconProps) => React.JSX.Element> = {
  pool_pump: DropIcon,
  washer: WasherIcon,
  outdoor_lights: BulbIcon,
};

export function LoadIcon({ kind, ...props }: IconProps & { kind: LoadKind }) {
  const Icon = LOAD_ICON[kind];
  return <Icon {...props} />;
}

export interface LoadStatus {
  tone: Tone;
  label: string;
}

/** Relay state; on the overview an armed cycle reads as "waiting". */
export function loadStatus(load: Load, { showWaiting = false } = {}): LoadStatus {
  if (load.relay === "on") return { tone: "ok", label: "LIGADA" };
  if (showWaiting && load.cycle?.armed) return { tone: "neutral", label: "AGUARDANDO" };
  return { tone: "neutral", label: "DESLIGADA" };
}
