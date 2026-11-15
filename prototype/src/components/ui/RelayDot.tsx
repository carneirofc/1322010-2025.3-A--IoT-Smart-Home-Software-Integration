/** Relay state as a dot: filled cyan with a halo when on, hollow when off. */
export function RelayDot({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`size-3 flex-none rounded-full ${
        on ? "bg-ciano ring-4 ring-ciano-tint" : "border-2 border-borda bg-papel"
      }`}
    />
  );
}
