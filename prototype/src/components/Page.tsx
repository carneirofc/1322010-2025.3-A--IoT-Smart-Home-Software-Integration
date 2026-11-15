import type { ReactNode } from "react";
import type { ClockTime } from "@/mocks/types";

/** Screen body: title row, then blocks 16 px apart. */
export function Page({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: ClockTime;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-page px-6 pt-4 pb-6 max-sm:px-4">
      <div className="mb-3 flex items-baseline justify-between gap-4 max-sm:flex-col max-sm:gap-1">
        <h1 className="font-bold text-lg">{title}</h1>
        <p className="text-fg-muted text-sm">Dados de exemplo · atualizado às {updatedAt}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </main>
  );
}
