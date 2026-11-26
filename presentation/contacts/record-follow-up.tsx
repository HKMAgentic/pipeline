"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RecordFollowUpError } from "@/services/contacts";
import { FOLLOW_UP_ERROR_MESSAGES } from "./follow-up-form";

// `nextDate` : la date saisie, pour la réafficher quand elle est refusée.
export type RecordFollowUpState = { error: RecordFollowUpError | null; nextDate?: string };
export type RecordFollowUpAction = (state: RecordFollowUpState, formData: FormData) => Promise<RecordFollowUpState>;

const MESSAGES: Record<RecordFollowUpError, string> = {
  ...FOLLOW_UP_ERROR_MESSAGES,
  past_date: "Choisissez aujourd’hui ou une date à venir.",
  not_found: "Ce contact n’existe plus. Rechargez la page.",
};

type RecordFollowUpProps = {
  contactId: string;
  action: RecordFollowUpAction;
  initialOpen?: boolean;
  initialState?: RecordFollowUpState;
};

// « Relancer » ouvre un petit panneau : prochaine date (facultative), Valider ou Annuler.
// Rendu dans un conteneur flex : le panneau passe à la ligne, sous les autres actions.
export function RecordFollowUp({ contactId, action, initialOpen = false, initialState = { error: null } }: RecordFollowUpProps) {
  const [open, setOpen] = useState(initialOpen);
  const [state, formAction, pending] = useActionState(async (previous: RecordFollowUpState, formData: FormData) => {
    const result = await action(previous, formData);
    if (!result.error) setOpen(false);
    return result;
  }, initialState);
  const error = state.error ? MESSAGES[state.error] : null;
  const fieldId = `prochaine-${contactId}`;

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} disabled={open} aria-expanded={open}>
        Relancer
      </Button>
      {open && (
        <form action={formAction} className="order-last grid basis-full gap-1.5 pt-2">
          <Input type="hidden" name="id" value={contactId} />
          <Label htmlFor={fieldId}>
            Prochaine relance <span className="text-muted-foreground font-normal">(facultatif)</span>
          </Label>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              id={fieldId}
              type="date"
              name="prochaine"
              defaultValue={state.nextDate}
              className="bg-background w-auto"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${fieldId}-erreur` : undefined}
            />
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement…" : "Valider"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Annuler
            </Button>
          </div>
          {error && (
            <p id={`${fieldId}-erreur`} role="alert" className="text-destructive text-sm">
              {error}
            </p>
          )}
        </form>
      )}
    </>
  );
}
