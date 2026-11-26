"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FollowUpError } from "@/services/contacts";

export type FollowUpFormState = { error: FollowUpError | null };

export type FollowUpAction = (state: FollowUpFormState, formData: FormData) => Promise<FollowUpFormState>;

export const FOLLOW_UP_ERROR_MESSAGES: Record<FollowUpError, string> = {
  invalid_date: "Cette date n’existe pas. Choisissez un jour du calendrier.",
};

type FollowUpFormProps = {
  contactId: string;
  date: string | null;
  action: FollowUpAction;
  initialState?: FollowUpFormState;
};

// Changer (ou retirer, en vidant le champ) la date de relance d'un contact.
export function FollowUpForm({ contactId, date, action, initialState = { error: null } }: FollowUpFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const error = state.error ? FOLLOW_UP_ERROR_MESSAGES[state.error] : null;
  const fieldId = `relance-${contactId}`;

  return (
    <form action={formAction} className="mt-4 grid gap-1.5">
      <Input type="hidden" name="id" value={contactId} />
      <Label htmlFor={fieldId} className="text-muted-foreground text-xs">
        Date de relance
      </Label>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          id={fieldId}
          type="date"
          name="relance"
          defaultValue={date ?? undefined}
          className="w-auto"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-erreur` : undefined}
        />
        <Button type="submit" variant="outline" disabled={pending}>
          {pending ? "Enregistrement…" : "Changer la relance"}
        </Button>
      </div>
      {error && (
        <p id={`${fieldId}-erreur`} role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </form>
  );
}
