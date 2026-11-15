/** Small orange counter (open alerts); `label` is read after the number. */
export function CountBadge({ count, label }: { count: number; label?: string }) {
  return (
    <span className="inline-grid h-[22px] min-w-[22px] place-items-center rounded-full bg-warning-solid px-1.5 font-bold text-white text-xs">
      {count}
      {label ? <span className="sr-only"> {label}</span> : null}
    </span>
  );
}
