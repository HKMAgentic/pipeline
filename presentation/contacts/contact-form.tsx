"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AddContactError } from "@/services/contacts";
import { FOLLOW_UP_ERROR_MESSAGES } from "./follow-up-form";

// `values` : ce qui a été saisi, pour le réafficher quand l'enregistrement est refusé.
export type ContactFormState = {
  error: AddContactError | null;
  values?: { name: string; company: string; followUpDate?: string };
};

// Message partagé avec la correction d'un contact (edit-contact.tsx).
export const NAME_REQUIRED_MESSAGE = "Le nom est obligatoire.";

type ContactFormProps = {
  action: (state: ContactFormState, formData: FormData) => Promise<ContactFormState>;
  initialState?: ContactFormState;
};

export function ContactForm({ action, initialState = { error: null } }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const nameError = state.error === "name_required" ? NAME_REQUIRED_MESSAGE : null;
  const dateError = state.error === "invalid_date" ? FOLLOW_UP_ERROR_MESSAGES.invalid_date : null;

  return (
    <form
      id="nouveau-contact"
      action={formAction}
      aria-labelledby="nouveau-contact-titre"
      className="bg-card text-card-foreground ring-border scroll-mt-6 rounded-lg p-5 ring-1"
    >
      <h2 id="nouveau-contact-titre" className="text-2xl font-bold tracking-wide uppercase">
        Nouveau contact
      </h2>
      <div className="mt-4 grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="nom">Nom</Label>
          {/* Pas d'attribut required : c'est le service qui valide, et l'écran affiche son message. */}
          <Input
            id="nom"
            name="nom"
            placeholder="Prénom Nom"
            autoComplete="off"
            className="h-10"
            defaultValue={state.values?.name}
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? "nom-erreur" : undefined}
          />
          {nameError && (
            <p id="nom-erreur" role="alert" className="text-destructive text-sm">
              {nameError}
            </p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="entreprise">Entreprise</Label>
          <Input
            id="entreprise"
            name="entreprise"
            placeholder="Nom de l’entreprise"
            autoComplete="off"
            className="h-10"
            defaultValue={state.values?.company}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="relance">
            Date de relance <span className="text-muted-foreground font-normal">(facultatif)</span>
          </Label>
          <Input
            id="relance"
            type="date"
            name="relance"
            className="h-10"
            defaultValue={state.values?.followUpDate}
            aria-invalid={dateError ? true : undefined}
            aria-describedby={dateError ? "relance-erreur" : undefined}
          />
          {dateError && (
            <p id="relance-erreur" role="alert" className="text-destructive text-sm">
              {dateError}
            </p>
          )}
        </div>
        <Button type="submit" size="lg" className="mt-1 w-full" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer le contact"}
        </Button>
      </div>
    </form>
  );
}
