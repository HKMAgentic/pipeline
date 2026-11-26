import type { Contact } from "@/services/contacts";
import { DateStamp } from "./date-stamp";
import { FollowUpForm, type FollowUpAction } from "./follow-up-form";
import { toFollowUpView } from "./follow-up-view";
import { StageBadge } from "./stage-badge";

// Nom, entreprise, étape et date de relance (tampon). Les boutons
// « Relancer » / « Étape suivante » arriveront avec les lots 5 et 4.
export function ContactCard({ contact, setFollowUpAction }: { contact: Contact; setFollowUpAction: FollowUpAction }) {
  const followUp = contact.followUp;

  return (
    <article className="bg-card text-card-foreground ring-border relative rounded-lg p-4 ring-1 sm:p-5">
      {/* Le tampon est en haut à droite ; le texte lui laisse 112px. */}
      <div className={followUp ? "pr-28" : undefined}>
        <h3 className="text-xl leading-tight font-bold">{contact.name}</h3>
        {contact.company && <p className="text-muted-foreground mt-0.5 text-sm">{contact.company}</p>}
        <div className="mt-3">
          <StageBadge stage={contact.stage} />
        </div>
        {!followUp && <p className="text-muted-foreground mt-3 text-sm">Pas de relance prévue</p>}
        {/* La clé recrée le formulaire quand la date enregistrée change. */}
        <FollowUpForm
          key={followUp?.date ?? "aucune"}
          contactId={contact.id}
          date={followUp?.date ?? null}
          action={setFollowUpAction}
        />
      </div>
      {followUp && <DateStamp followUp={toFollowUpView(followUp)} className="absolute top-3 right-3 sm:top-4 sm:right-4" />}
    </article>
  );
}
