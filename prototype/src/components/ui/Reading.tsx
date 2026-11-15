/**
 * Splits "1 240" at its non-breaking group separator: in mono that space is a
 * full cell and would read as two numbers, so groups sit a thin gap apart.
 */
function digitGroups(value: string): { text: string; at: number }[] {
  let at = 0;
  return value.split("\u00a0").map((text) => {
    const group = { text, at };
    at += text.length + 1;
    return group;
  });
}

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
      {digitGroups(value).map((group) => (
        <span key={group.at} className={group.at > 0 ? "ml-[0.22em]" : ""}>
          {group.text}
        </span>
      ))}
      <span className={`ml-[0.18em] font-sans font-semibold text-[0.5em] ${unitClassName}`}>
        {unit}
      </span>
    </span>
  );
}
