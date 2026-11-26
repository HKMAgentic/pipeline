import type { Agenda } from "@/services/agenda";
import { ContactList } from "./contact-list";
import type { CardActions } from "./card-actions";

type AgendaSectionsProps = { agenda: Agenda; actions: CardActions };

// « Relances du jour » en premier : c'est la question prioritaire de l'écran.
export function AgendaSections({ agenda, actions }: AgendaSectionsProps) {
  const upcomingEmpty =
    agenda.total === 0
      ? "Aucun contact pour l’instant. Ajoutez votre premier contact avec le formulaire."
      : "Rien à venir pour l’instant.";

  return (
    <div className="grid gap-10">
      <section aria-labelledby="relances-titre">
        <h2 id="relances-titre" className="text-3xl font-bold tracking-wide uppercase">
          Relances du jour
        </h2>
        <div className="mt-4">
          <ContactList
            contacts={agenda.due}
            emptyMessage="Rien à relancer aujourd’hui."
            actions={actions}
          />
        </div>
      </section>
      <section aria-labelledby="a-venir-titre">
        <h2 id="a-venir-titre" className="text-2xl font-bold tracking-wide uppercase">
          À venir
        </h2>
        <div className="mt-4">
          <ContactList contacts={agenda.upcoming} emptyMessage={upcomingEmpty} actions={actions} />
        </div>
      </section>
    </div>
  );
}
