"use server";

// Point de branchement : seul fichier de app/ autorisé à importer @/data
// (exception documentée dans .claude/rules/presentation.md). Il crée le dépôt
// et le passe au service. Il ne contient aucune règle métier.
import { refresh } from "next/cache";
import { createContactRepository, type ContactRepository } from "@/data/contact-repository";
import { addContact, listContacts } from "@/services/contacts";
import type { ContactFormState } from "@/presentation/contacts/contact-form";

let repository: ContactRepository | undefined;
function getRepository() {
  repository ??= createContactRepository();
  return repository;
}

export async function loadContacts() {
  return listContacts(getRepository());
}

export async function addContactAction(_state: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const values = {
    name: String(formData.get("nom") ?? ""),
    company: String(formData.get("entreprise") ?? ""),
  };
  const result = await addContact(getRepository(), values);

  if (!result.ok) {
    // On renvoie la saisie pour que le formulaire la réaffiche.
    return { error: result.error, values };
  }

  refresh();
  return { error: null };
}
