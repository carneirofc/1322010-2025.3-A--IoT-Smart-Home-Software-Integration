import { cn, OutlineButton, type OutlineButtonProps } from "@carneirofc/ui";
import type { Ref } from "react";

export type ButtonTone = "default" | "primary";

export type ButtonProps = Omit<OutlineButtonProps, "variant"> & {
  tone?: ButtonTone;
  ref?: Ref<HTMLButtonElement>;
};

/** The library's OutlineButton, squared off and without the hover lift. */
export function Button({ tone = "default", className, ...props }: ButtonProps) {
  return (
    <OutlineButton
      variant={tone === "primary" ? "accent" : "neutral"}
      className={cn(
        "rounded-[2px] px-3.5 py-2 font-semibold shadow-none hover:translate-y-0 hover:shadow-none active:scale-100",
        tone === "primary" && "active:bg-modulo-escuro",
        className,
      )}
      {...props}
    />
  );
}
