import type { Metadata } from "next";
import { Board } from "@/components/loads/Board";
import { CommandLog } from "@/components/loads/CommandLog";
import { EntranceMeter } from "@/components/loads/EntranceMeter";
import { Page } from "@/components/shell/Page";
import { scenario } from "@/mocks/scenario";

export const metadata: Metadata = { title: "Cargas" };

export default function LoadsPage() {
  return (
    <Page title="Cargas">
      <EntranceMeter entrance={scenario.entrance} />
      <Board loads={scenario.loads} energy={scenario.energy} />
      <CommandLog commands={scenario.commands} />
    </Page>
  );
}
