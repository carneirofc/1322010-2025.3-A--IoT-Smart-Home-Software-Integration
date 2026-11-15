/** pt-BR number formatting for the user-facing text. */

const NBSP = " ";
const MINUS = "−";

const numberFormats = new Map<number, Intl.NumberFormat>();

function numberFormat(fractionDigits: number): Intl.NumberFormat {
  let format = numberFormats.get(fractionDigits);
  if (!format) {
    format = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    numberFormats.set(fractionDigits, format);
  }
  return format;
}

/**
 * Formats a number the way the panel prints it: decimal comma, a non-breaking
 * space between thousands ("1 240") and a true minus sign ("−0,6").
 */
export function formatNumber(value: number, fractionDigits = 0): string {
  return numberFormat(fractionDigits)
    .formatToParts(value)
    .map((part) => {
      if (part.type === "group") return NBSP;
      if (part.type === "minusSign") return MINUS;
      return part.value;
    })
    .join("");
}

/** One decimal place, as used for kW, kWh and V readings ("2,8"). */
export function formatDecimal(value: number): string {
  return formatNumber(value, 1);
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/** Whole reais with a non-breaking space ("R$ 151"). */
export function formatBrl(value: number): string {
  return brl.format(value).replace(/\s/u, NBSP);
}

/** Minutes as hours and minutes ("4 h 03", "6 h", "0 h"). */
export function formatDuration(totalMin: number): string {
  const hours = Math.floor(totalMin / 60);
  const minutes = Math.round(totalMin % 60);
  return minutes === 0 ? `${hours} h` : `${hours} h ${String(minutes).padStart(2, "0")}`;
}

/** Share of `value` within [min, max] as a CSS percentage, clamped to 0–100. */
export function percentOf(value: number, max: number, min = 0): number {
  const ratio = (value - min) / (max - min);
  return Math.min(100, Math.max(0, ratio * 100));
}
