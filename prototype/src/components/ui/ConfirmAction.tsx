"use client";

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@carneirofc/ui";
import { Button, type ButtonTone } from "./Button";

export interface ConfirmActionProps {
  /** Button that opens the confirmation. */
  label: string;
  tone?: ButtonTone;
  title: string;
  description: string;
  /** Facts the resident should weigh before confirming. */
  details?: readonly string[];
  confirmLabel: string;
  className?: string;
}

/** A button that asks before acting; the prototype only closes the dialog. */
export function ConfirmAction({
  label,
  tone = "default",
  title,
  description,
  details = [],
  confirmLabel,
  className,
}: ConfirmActionProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button tone={tone} className={className}>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent size="sm" closeLabel="Fechar" className="rounded-[2px] border-2">
        <DialogHeader>
          <DialogTitle className="font-label font-bold text-title leading-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-body text-fio">{description}</DialogDescription>
        </DialogHeader>
        {details.length > 0 ? (
          <DialogBody>
            <ul className="space-y-1.5 text-body">
              {details.map((line) => (
                <li key={line} className="border-linha border-l-[3px] pl-3">
                  {line}
                </li>
              ))}
            </ul>
          </DialogBody>
        ) : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button tone="primary">{confirmLabel}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
