import Link from "next/link";
import type { ReactNode } from "react";

/** A titled block separated by a rule; `link` sends to the screen with the details. */
export function Section({
  id,
  title,
  aside,
  link,
  className = "",
  children,
}: {
  id: string;
  title: ReactNode;
  aside?: ReactNode;
  link?: { href: string; label: string };
  className?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-4 border-grafite border-b pb-1">
        <h2 id={id} className="font-bold font-label text-heading leading-tight">
          {title}
        </h2>
        {aside}
        {link ? (
          <Link href={link.href} className="font-semibold text-small underline underline-offset-2">
            {link.label}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
