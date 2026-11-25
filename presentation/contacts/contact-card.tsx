import type { Contact } from "@/services/contacts";
import { StageBadge } from "./stage-badge";

// Lot 1 : nom, entreprise, étape. Le tampon de relance (lot 2) et les boutons
// « Relancer » / « Étape suivante » (lots 4 et 5) arriveront avec leurs lots.
export function ContactCard({ contact }: { contact: Contact }) {
  return (
    <article className="bg-card text-card-foreground ring-border flex items-start gap-4 rounded-lg p-4 ring-1 sm:p-5">
      <div className="min-w-0 flex-1">
        <h3 className="text-xl leading-tight font-bold">{contact.name}</h3>
        {contact.company && <p className="text-muted-foreground mt-0.5 text-sm">{contact.company}</p>}
        <div className="mt-3">
          <StageBadge stage={contact.stage} />
        </div>
      </div>
    </article>
  );
}
