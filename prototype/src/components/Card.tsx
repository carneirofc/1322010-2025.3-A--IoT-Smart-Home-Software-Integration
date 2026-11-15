import type { ReactNode } from "react";
import type { Tone } from "@/mocks/types";
import { CARD_ACCENT } from "./tones";

export interface CardProps {
  as?: "section" | "article" | "div";
  tone?: Exclude<Tone, "neutral">;
  /** No inner padding (tables and row lists bring their own). */
  flush?: boolean;
  muted?: boolean;
  labelledBy?: string;
  label?: string;
  className?: string;
  children: ReactNode;
}

export function Card({
  as: Tag = "section",
  tone,
  flush = false,
  muted = false,
  labelledBy,
  label,
  className = "",
  children,
}: CardProps) {
  const surface = muted ? "bg-surface-muted" : "bg-surface shadow-card";
  return (
    <Tag
      aria-labelledby={labelledBy}
      aria-label={label}
      className={`min-w-0 rounded-xl border border-line ${surface} ${flush ? "" : "px-5 py-3.5"} ${
        tone ? CARD_ACCENT[tone] : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

export interface CardHeadProps {
  id: string;
  title: ReactNode;
  icon?: ReactNode;
  aside?: ReactNode;
}

export function CardHead({ id, title, icon, aside }: CardHeadProps) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-3">
      <h2 id={id} className="flex items-center gap-2 font-bold text-base">
        {icon ? <span className="text-fg-muted">{icon}</span> : null}
        {title}
      </h2>
      {aside}
    </div>
  );
}
