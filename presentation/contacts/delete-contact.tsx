"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type DeleteContactState = { error: "not_found" | null };
export type DeleteContactAction = (state: DeleteContactState, formData: FormData) => Promise<DeleteContactState>;

type DeleteContactProps = {
  contact: { id: string; name: string };
  action: DeleteContactAction;
  initialOpen?: boolean;
};

// « Supprimer » demande une confirmation avant d'envoyer quoi que ce soit au serveur.
// Rendu dans un conteneur flex : la confirmation passe à la ligne, sous les autres actions.
export function DeleteContact({ contact, action, initialOpen = false }: DeleteContactProps) {
  const [open, setOpen] = useState(initialOpen);
  const [state, formAction, pending] = useActionState(action, { error: null });
  const titleId = `supprimer-${contact.id}-titre`;

  return (
    <>
      <Button type="button" variant="ghost" onClick={() => setOpen(true)} disabled={open} aria-expanded={open}>
        Supprimer
      </Button>
      {open && (
        <form
          action={formAction}
          role="alertdialog"
          aria-labelledby={titleId}
          className="order-last grid basis-full gap-2 pt-2"
        >
          <Input type="hidden" name="id" value={contact.id} />
          <p id={titleId} className="text-sm">
            <span className="font-semibold">Supprimer {contact.name} ?</span> Cette action est définitive.
          </p>
          <div className="flex items-center gap-2">
            <Button type="submit" variant="destructive" disabled={pending}>
              Confirmer la suppression
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} autoFocus>
              Annuler
            </Button>
          </div>
          {state.error && (
            <p role="alert" className="text-destructive text-sm">
              Ce contact n’existe plus. Rechargez la page.
            </p>
          )}
        </form>
      )}
    </>
  );
}
