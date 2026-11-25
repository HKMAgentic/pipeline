// Règles métier des contacts. Le service ne connaît que le contrat du dépôt.
import type { ContactRecord, ContactRepository } from "@/data/contact-repository";
import { INITIAL_STAGE, isStage, type Stage } from "./stages";

export type Contact = {
  id: string;
  name: string;
  company: string;
  stage: Stage;
};

export type AddContactInput = { name: string; company: string };

// Un code d'erreur, pas une phrase : c'est l'écran qui choisit le message.
export type AddContactError = "name_required";

export type AddContactResult = { ok: true; contact: Contact } | { ok: false; error: AddContactError };

export async function addContact(repository: ContactRepository, input: AddContactInput): Promise<AddContactResult> {
  const name = input.name.trim();
  if (name === "") {
    return { ok: false, error: "name_required" };
  }

  const record = await repository.add({ name, company: input.company.trim(), stage: INITIAL_STAGE });
  return { ok: true, contact: toContact(record) };
}

export async function listContacts(repository: ContactRepository): Promise<Contact[]> {
  const records = await repository.list();
  return records.map(toContact);
}

function toContact(record: ContactRecord): Contact {
  if (!isStage(record.stage)) {
    throw new Error(`Étape inconnue : ${record.stage}`);
  }
  return { id: record.id, name: record.name, company: record.company, stage: record.stage };
}
