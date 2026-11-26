"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContactIdentity, UpdateContactError } from "@/services/contacts";
import { NAME_REQUIRED_MESSAGE } from "./contact-form";

// `values` : ce qui a été saisi, pour le réafficher quand la correction est refusée.
export type EditContactState = { error: UpdateContactError | null; values?: ContactIdentity };
export type EditContactAction = (state: EditContactState, formData: FormData) => Promise<EditContactState>;

const MESSAGES: Record<UpdateContactError, string> = {
  name_required: NAME_REQUIRED_MESSAGE,
  not_found: "Ce contact n’existe plus. Rechargez la page.",
};

type EditContactProps = {
  contact: ContactIdentity & { id: string };
  action: EditContactAction;
  initialOpen?: boolean;
  initialState?: EditContactState;
};

// « Modifier » ouvre un panneau : nom et entreprise préremplis, Enregistrer ou Annuler.
// Rendu dans un conteneur flex : le panneau passe à la ligne, sous les autres actions.
export function EditContact({ contact, action, initialOpen = false, initialState = { error: null } }: EditContactProps) {
  const [open, setOpen] = useState(initialOpen);
  const [state, formAction, pending] = useActionState(async (previous: EditContactState, formData: FormData) => {
    const result = await action(previous, formData);
    if (!result.error) setOpen(false);
    return result;
  }, initialState);
  const values = state.values ?? contact;
  const nameError = state.error === "name_required" ? MESSAGES.name_required : null;
  const otherError = state.error && state.error !== "name_required" ? MESSAGES[state.error] : null;
  const prefix = `modifier-${contact.id}`;

  return (
    <>
      <Button type="button" variant="ghost" onClick={() => setOpen(true)} disabled={open} aria-expanded={open}>
        Modifier
      </Button>
      {open && (
        <form action={formAction} className="order-last grid basis-full gap-3 pt-2 sm:grid-cols-2">
          <Input type="hidden" name="id" value={contact.id} />
          <div className="grid gap-1.5">
            <Label htmlFor={`${prefix}-nom`}>Nom</Label>
            <Input
              id={`${prefix}-nom`}
              name="nom"
              autoComplete="off"
              className="bg-background"
              defaultValue={values.name}
              aria-invalid={nameError ? true : undefined}
              aria-describedby={nameError ? `${prefix}-erreur` : undefined}
            />
            {nameError && (
              <p id={`${prefix}-erreur`} role="alert" className="text-destructive text-sm">
                {nameError}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${prefix}-entreprise`}>Entreprise</Label>
            <Input
              id={`${prefix}-entreprise`}
              name="entreprise"
              autoComplete="off"
              className="bg-background"
              defaultValue={values.company}
            />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement…" : "Enregistrer"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Annuler
            </Button>
          </div>
          {otherError && (
            <p role="alert" className="text-destructive text-sm sm:col-span-2">
              {otherError}
            </p>
          )}
        </form>
      )}
    </>
  );
}
