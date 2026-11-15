"use client";

import { CopyButton } from "@carneirofc/ui";
import { useEffect, useState } from "react";
import type { DeviceId } from "@/mocks/types";

/** The library's CopyButton for a device id, for the installer's notes. */
export function CopyDeviceId({ id }: { id: DeviceId }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <CopyButton
      label="Copiar id"
      copiedLabel="Copiado"
      copied={copied}
      aria-label={`Copiar ${id}`}
      className="rounded-chip font-semibold hover:translate-y-0"
      onClick={() => {
        void navigator.clipboard?.writeText(id).then(() => setCopied(true));
      }}
    />
  );
}
