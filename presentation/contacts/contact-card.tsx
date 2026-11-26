import type { Contact } from "@/services/contacts";
import type { CardActions } from "./card-actions";
import { DateStamp } from "./date-stamp";
import { DeleteContact } from "./delete-contact";
import { EditContact } from "./edit-contact";
import { FollowUpForm } from "./follow-up-form";
import { followUpDoneLabel, toFollowUpView } from "./follow-up-view";
import { RecordFollowUp } from "./record-follow-up";
import { StageBadge } from "./stage-badge";
import { StageControls } from "./stage-controls";

// Nom, entreprise, étape et date de relance (tampon), puis les actions dans le pied de carte.
export function ContactCard({ contact, actions }: { contact: Contact; actions: CardActions }) {
  const followUp = contact.followUp;

  return (
    <article className="bg-card text-card-foreground ring-border relative overflow-hidden rounded-lg ring-1">
      {/* Le tampon est en haut à droite ; le texte lui laisse 112px. */}
      <div className={followUp ? "p-4 pr-28 sm:p-5 sm:pr-28" : "p-4 sm:p-5"}>
        <h3 className="text-xl leading-tight font-bold">{contact.name}</h3>
        {contact.company && <p className="text-muted-foreground mt-0.5 text-sm">{contact.company}</p>}
        <div className="mt-3">
          <StageBadge stage={contact.stage} />
        </div>
        {(contact.lastFollowUpDate || !followUp) && (
          <div className="text-muted-foreground mt-3 space-y-1 text-sm">
            {contact.lastFollowUpDate && <p>{followUpDoneLabel(contact.lastFollowUpDate)}</p>}
            {!followUp && <p>Pas de relance prévue</p>}
          </div>
        )}
        {/* La clé recrée le formulaire quand la date enregistrée change. */}
        <FollowUpForm
          key={followUp?.date ?? "aucune"}
          contactId={contact.id}
          date={followUp?.date ?? null}
          action={actions.setFollowUp}
        />
      </div>
      <footer className="bg-muted/50 border-border flex flex-wrap items-center gap-2 border-t px-4 py-3 sm:px-5">
        <RecordFollowUp contactId={contact.id} action={actions.recordFollowUp} />
        <StageControls key={contact.stage} contactId={contact.id} stage={contact.stage} actions={actions} />
        {/* Corriger et supprimer, discrets, à droite. */}
        <span className="flex-1" aria-hidden="true" />
        <EditContact key={`${contact.name}|${contact.company}`} contact={contact} action={actions.updateContact} />
        <DeleteContact contact={contact} action={actions.deleteContact} />
      </footer>
      {followUp && <DateStamp followUp={toFollowUpView(followUp)} className="absolute top-3 right-3 sm:top-4 sm:right-4" />}
    </article>
  );
}
