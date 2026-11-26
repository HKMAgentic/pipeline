import type { Contact } from "@/services/contacts";
import { ContactCard } from "./contact-card";
import type { FollowUpAction } from "./follow-up-form";

export function ContactList({ contacts, setFollowUpAction }: { contacts: Contact[]; setFollowUpAction: FollowUpAction }) {
  if (contacts.length === 0) {
    return (
      <p className="bg-card text-muted-foreground ring-border rounded-lg p-5 text-sm ring-1">
        Aucun contact pour l’instant. Ajoutez votre premier contact avec le formulaire.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} setFollowUpAction={setFollowUpAction} />
      ))}
    </div>
  );
}
