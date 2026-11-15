import Link from "next/link";

export function CardLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap font-semibold text-sm no-underline hover:underline"
    >
      {children} →
    </Link>
  );
}
