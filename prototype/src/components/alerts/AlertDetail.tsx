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
import type { Alert } from "@/mocks/types";
import { Button } from "../ui/Button";
import { RuleChip } from "../ui/RuleChip";
import { StateMark } from "../ui/StateMark";
import { SEVERITY_TONE, SEVERITY_WORD } from "../ui/state";
import { stateText } from "./stateText";

/** The alert's record in a dialog: what happened, how it went, who acknowledged. */
export function AlertDetail({ alert, label }: { alert: Alert; label: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{label}</Button>
      </DialogTrigger>
      <DialogContent size="sm" closeLabel="Fechar" className="rounded-sub border">
        <DialogHeader>
          <DialogTitle className="font-semibold text-title leading-tight">
            {alert.headline}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-body">
            <StateMark tone={SEVERITY_TONE[alert.severity]}>
              {SEVERITY_WORD[alert.severity]}
            </StateMark>
            <RuleChip rule={alert.rule} />
            <span className="text-tinta-suave">{alert.subject}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <dl className="space-y-2 text-body">
            <div>
              <dt className="text-small text-tinta-suave">Ocorrência</dt>
              <dd className="font-semibold">{alert.title}</dd>
            </div>
            <div>
              <dt className="text-small text-tinta-suave">O que o sistema fez</dt>
              <dd>{alert.description}</dd>
            </div>
            <div>
              <dt className="text-small text-tinta-suave">Estado</dt>
              <dd>{stateText(alert.state)}</dd>
            </div>
          </dl>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
