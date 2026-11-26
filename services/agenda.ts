// Règle « qui relancer aujourd'hui ? » : partage les contacts en deux listes et les compte.
// Les contacts arrivent déjà calculés pour aujourd'hui (voir listContacts).
import type { Contact } from "./contacts";

export type Agenda = {
  due: Contact[]; // relances du jour : aujourd'hui ou en retard, le plus en retard en tête
  upcoming: Contact[]; // à venir : date la plus proche d'abord, sans date à la fin
  dueCount: number;
  lateCount: number;
  total: number;
};

function isDue(contact: Contact) {
  return contact.followUp !== null && contact.followUp.daysFromToday <= 0;
}

// Position dans le temps ; un contact sans date passe après tous les autres.
function when(contact: Contact) {
  return contact.followUp?.daysFromToday ?? Number.POSITIVE_INFINITY;
}

// `sort` de JavaScript est stable : à égalité, l'ordre reçu est conservé.
// Infinity − Infinity donne NaN : deux contacts sans date sont à égalité.
const byDate = (a: Contact, b: Contact) => when(a) - when(b) || 0;

export function buildAgenda(contacts: Contact[]): Agenda {
  const due = contacts.filter(isDue).sort(byDate);
  const upcoming = contacts.filter((contact) => !isDue(contact)).sort(byDate);
  return {
    due,
    upcoming,
    dueCount: due.length,
    lateCount: due.filter((contact) => contact.followUp?.late).length,
    total: contacts.length,
  };
}
