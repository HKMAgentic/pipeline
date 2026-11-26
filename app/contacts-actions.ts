"use server";

// Point de branchement : seul fichier de app/ autorisé à importer @/data
// (exception documentée dans .claude/rules/presentation.md). Il crée le dépôt
// et le passe au service. Il ne contient aucune règle métier.
import { refresh } from "next/cache";
import { createContactRepository, type ContactRepository } from "@/data/contact-repository";
import { buildAgenda } from "@/services/agenda";
import { addContact, listContacts, setFollowUp } from "@/services/contacts";
import { todayIn } from "@/services/follow-up";
import type { ContactFormState } from "@/presentation/contacts/contact-form";
import type { FollowUpFormState } from "@/presentation/contacts/follow-up-form";

// « Aujourd'hui » se compte à l'heure de Paris, même sur un serveur réglé en UTC.
const TIME_ZONE = "Europe/Paris";

let repository: ContactRepository | undefined;
function getRepository() {
  repository ??= createContactRepository();
  return repository;
}

export async function loadAgenda() {
  return buildAgenda(await listContacts(getRepository(), todayIn(new Date(), TIME_ZONE)));
}

export async function addContactAction(_state: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const values = {
    name: String(formData.get("nom") ?? ""),
    company: String(formData.get("entreprise") ?? ""),
    followUpDate: String(formData.get("relance") ?? ""),
  };
  const result = await addContact(getRepository(), values);

  if (!result.ok) {
    // On renvoie la saisie pour que le formulaire la réaffiche.
    return { error: result.error, values };
  }

  refresh();
  return { error: null };
}

export async function setFollowUpAction(_state: FollowUpFormState, formData: FormData): Promise<FollowUpFormState> {
  const result = await setFollowUp(
    getRepository(),
    String(formData.get("id") ?? ""),
    String(formData.get("relance") ?? ""),
  );

  if (!result.ok) {
    return { error: result.error };
  }

  refresh();
  return { error: null };
}
