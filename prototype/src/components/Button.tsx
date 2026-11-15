import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "default" | "primary" | "segment";

const VARIANT: Record<ButtonVariant, string> = {
  default: "border-line-strong bg-surface text-fg hover:bg-surface-muted",
  primary: "border-brand bg-brand text-white hover:bg-brand-hover",
  segment:
    "border-transparent bg-transparent text-fg-muted aria-pressed:border-line aria-pressed:bg-white aria-pressed:text-fg aria-pressed:shadow-card",
};

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: ButtonVariant;
}

/** Plain button; without an `onClick` it is inert, as in the prototype. */
export function Button({ variant = "default", className = "", ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-3.5 py-[7px] font-semibold text-sm disabled:opacity-60 ${VARIANT[variant]} ${className}`}
      {...props}
    />
  );
}
