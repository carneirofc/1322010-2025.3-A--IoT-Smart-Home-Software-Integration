import type { ReactNode } from "react";

/** Screen body; the active breaker tab already names the screen on sight. */
export function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-page px-6 pt-5 pb-8 max-sm:px-4">
      <h1 className="sr-only">{title}</h1>
      {children}
    </main>
  );
}
