import type { Contact } from "@/services/contacts";
import { ContactCard } from "./contact-card";
import type { CardActions } from "./card-actions";

type ContactListProps = {
  contacts: Contact[];
  emptyMessage: string;
  actions: CardActions;
};

export function ContactList({ contacts, emptyMessage, actions }: ContactListProps) {
  if (contacts.length === 0) {
    return <p className="bg-card text-muted-foreground ring-border rounded-lg p-5 text-sm ring-1">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-3">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} actions={actions} />
      ))}
    </div>
  );
}
