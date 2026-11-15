import type { Metadata } from "next";
import { CommandHistory } from "@/components/CommandHistory";
import { EntranceBanner } from "@/components/EntranceBanner";
import { LoadTable } from "@/components/LoadRow";
import { Page } from "@/components/Page";
import { scenario } from "@/mocks/scenario";

export const metadata: Metadata = { title: "Cargas" };

export default function LoadsPage() {
  return (
    <Page title="Cargas" updatedAt={scenario.now}>
      <EntranceBanner entrance={scenario.entrance} />
      <LoadTable loads={scenario.loads} />
      <CommandHistory commands={scenario.commands} />
    </Page>
  );
}
