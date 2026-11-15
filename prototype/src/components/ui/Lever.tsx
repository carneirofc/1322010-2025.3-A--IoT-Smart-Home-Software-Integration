/** A breaker lever drawn in ink: up and filled when the circuit is on. */
export function Lever({ on, size = "md" }: { on: boolean; size?: "md" | "lg" }) {
  const box = size === "lg" ? "h-9 w-5 p-0.5" : "h-6 w-3.5 p-px";
  return (
    <span
      aria-hidden="true"
      className={`flex flex-none flex-col border-2 border-grafite bg-papel ${box} ${
        on ? "justify-start" : "justify-end"
      }`}
    >
      <span className={`h-1/2 w-full ${on ? "bg-grafite" : "bg-linha-forte"}`} />
    </span>
  );
}
