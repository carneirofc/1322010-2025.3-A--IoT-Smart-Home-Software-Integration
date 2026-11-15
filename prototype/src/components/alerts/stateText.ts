import type { AlertState } from "@/mocks/types";

/** An alert's state as a sentence ("Encerrado às 19:31, reconhecido por Ana"). */
export function stateText(state: AlertState): string {
  switch (state.kind) {
    case "open":
      return `Aberto desde ${state.since}`;
    case "acknowledged":
      return `Reconhecido, aberto desde ${state.since}`;
    case "closed":
      return `Encerrado às ${state.at}, ${state.note}`;
  }
}
