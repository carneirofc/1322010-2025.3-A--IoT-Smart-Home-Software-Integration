/*
 * Mono readings set compactly. A mono cell is 0.6em wide, so a plain space,
 * a non-breaking group separator or a decimal comma each leaves a gap wide
 * enough to split one value into two. Spaces become thin gaps and the comma
 * is pulled in on both sides.
 */

interface Token {
  text: string;
  at: number;
}

/** Splits at plain and non-breaking spaces, keeping each token's offset as a stable key. */
function tokens(value: string): Token[] {
  let at = 0;
  return value.split(/[  ]/u).map((text) => {
    const token = { text, at };
    at += text.length + 1;
    return token;
  });
}

/** Digits with the decimal comma tightened ("0,6" reads as one number). */
function Digits({ text }: { text: string }) {
  const [whole, fraction] = text.split(",");
  if (fraction === undefined) return <>{text}</>;
  return (
    <>
      {whole}
      <span className="-mx-[0.17em]">,</span>
      {fraction}
    </>
  );
}

/**
 * A short value such as "4 h 03" or "0 h": numbers in mono, unit letters in
 * the text face, a thin gap between them instead of a full mono cell.
 */
export function Compact({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span className={`whitespace-nowrap font-mono ${className}`}>
      {tokens(value).map((token) => (
        <span
          key={token.at}
          className={`${token.at > 0 ? "ml-[0.14em]" : ""} ${
            /\d/u.test(token.text) ? "" : "font-sans font-semibold text-[0.85em]"
          }`}
        >
          <Digits text={token.text} />
        </span>
      ))}
    </span>
  );
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
      {tokens(value).map((group) => (
        <span key={group.at} className={group.at > 0 ? "ml-[0.22em]" : ""}>
          <Digits text={group.text} />
        </span>
      ))}
      <span className={`ml-[0.18em] font-sans font-semibold text-[0.5em] ${unitClassName}`}>
        {unit}
      </span>
    </span>
  );
}
