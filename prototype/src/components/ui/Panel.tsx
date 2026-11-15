import { CyberSubpanel } from "@carneirofc/ui";
import Link from "next/link";
import type { ReactNode } from "react";

/** A titled CyberSubpanel; `link` sends to the screen with the details. */
export function Panel({
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
    <CyberSubpanel
      role="region"
      aria-labelledby={id}
      className={`rounded-sub px-5 py-3.5 ${className}`}
    >
      <div className="mb-1.5 flex items-baseline justify-between gap-4">
        <h2 id={id} className="font-semibold text-heading leading-tight">
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
    </CyberSubpanel>
  );
}
