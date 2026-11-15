import { cn, OutlineButton, type OutlineButtonProps } from "@carneirofc/ui";
import type { Ref } from "react";

export type ButtonTone = "default" | "primary";

export type ButtonProps = Omit<OutlineButtonProps, "variant"> & {
  tone?: ButtonTone;
  ref?: Ref<HTMLButtonElement>;
};

/** The library's OutlineButton at control size, without the hover lift. */
export function Button({ tone = "default", className, ...props }: ButtonProps) {
  return (
    <OutlineButton
      variant={tone === "primary" ? "accent" : "neutral"}
      controlSize="md"
      className={cn(
        "rounded-control px-3.5 py-2 font-semibold hover:translate-y-0 active:scale-100",
        className,
      )}
      {...props}
    />
  );
}
