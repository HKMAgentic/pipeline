import type { Contact } from "@/services/contacts";
import { ContactCard } from "./contact-card";
import type { FollowUpAction } from "./follow-up-form";

type ContactListProps = {
  contacts: Contact[];
  emptyMessage: string;
  setFollowUpAction: FollowUpAction;
};

export function ContactList({ contacts, emptyMessage, setFollowUpAction }: ContactListProps) {
  if (contacts.length === 0) {
    return <p className="bg-card text-muted-foreground ring-border rounded-lg p-5 text-sm ring-1">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-3">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} setFollowUpAction={setFollowUpAction} />
      ))}
    </div>
  );
}
