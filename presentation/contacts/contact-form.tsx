"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STAGES } from "./demo-contacts";

// Formulaire visible seulement : l'enregistrement sera branché avec la couche données.
export function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      id="nouveau-contact"
      onSubmit={handleSubmit}
      aria-labelledby="nouveau-contact-titre"
      className="bg-card text-card-foreground ring-border scroll-mt-6 rounded-lg p-5 ring-1"
    >
      <h2 id="nouveau-contact-titre" className="text-2xl font-bold tracking-wide uppercase">
        Nouveau contact
      </h2>
      <div className="mt-4 grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" name="nom" placeholder="Prénom Nom" autoComplete="off" required className="h-10" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="entreprise">Entreprise</Label>
          <Input id="entreprise" name="entreprise" placeholder="Nom de l’entreprise" autoComplete="off" className="h-10" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="etape">Étape</Label>
          <Select name="etape" defaultValue={STAGES[0]}>
            <SelectTrigger id="etape" className="h-10 w-full data-[size=default]:h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="relance">Date de relance</Label>
          <Input id="relance" name="relance" type="date" className="h-10" />
        </div>
        <Button type="submit" size="lg" className="mt-1 w-full">
          Enregistrer le contact
        </Button>
      </div>
    </form>
  );
}
