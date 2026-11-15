/** A measured value in mono with its unit in the text face, a thin space apart. */
export function Reading({
  value,
  unit,
  className = "",
  unitClassName = "",
}: {
  value: string;
  unit: string;
  className?: string;
  unitClassName?: string;
}) {
  return (
    <span className={`whitespace-nowrap font-mono ${className}`}>
      {value}
      <span className={`ml-[0.18em] font-sans font-semibold text-[0.5em] ${unitClassName}`}>
        {unit}
      </span>
    </span>
  );
}
