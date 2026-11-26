"use server";

// Point de branchement : seul fichier de app/ autorisé à importer @/data
// (exception documentée dans .claude/rules/presentation.md). Il crée le dépôt
// et le passe au service. Il ne contient aucune règle métier.
import { refresh } from "next/cache";
import { createContactRepository, type ContactRepository } from "@/data/contact-repository";
import { buildAgenda } from "@/services/agenda";
import {
  addContact,
  advanceStage,
  changeStage,
  deleteContact,
  listContacts,
  recordFollowUp,
  setFollowUp,
  updateContact,
} from "@/services/contacts";
import { todayIn } from "@/services/follow-up";
import type { ContactFormState } from "@/presentation/contacts/contact-form";
import type { DeleteContactState } from "@/presentation/contacts/delete-contact";
import type { EditContactState } from "@/presentation/contacts/edit-contact";
import type { FollowUpFormState } from "@/presentation/contacts/follow-up-form";
import type { RecordFollowUpState } from "@/presentation/contacts/record-follow-up";
import type { StageFormState } from "@/presentation/contacts/stage-controls";

// « Aujourd'hui » se compte à l'heure de Paris, même sur un serveur réglé en UTC.
const TIME_ZONE = "Europe/Paris";

let repository: ContactRepository | undefined;
function getRepository() {
  repository ??= createContactRepository();
  return repository;
}

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "");
}

// Résultat du service → état du formulaire ; la page est rafraîchie si tout s'est bien passé.
function settle<E>(result: { ok: true } | { ok: false; error: E }): { error: E | null } {
  if (!result.ok) return { error: result.error };
  refresh();
  return { error: null };
}

function today() {
  return todayIn(new Date(), TIME_ZONE);
}

export async function loadAgenda() {
  return buildAgenda(await listContacts(getRepository(), today()));
}

export async function addContactAction(_state: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const values = {
    name: field(formData, "nom"),
    company: field(formData, "entreprise"),
    followUpDate: field(formData, "relance"),
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
  return settle(await setFollowUp(getRepository(), field(formData, "id"), field(formData, "relance")));
}

export async function advanceStageAction(_state: StageFormState, formData: FormData): Promise<StageFormState> {
  return settle(await advanceStage(getRepository(), field(formData, "id")));
}

export async function changeStageAction(_state: StageFormState, formData: FormData): Promise<StageFormState> {
  return settle(await changeStage(getRepository(), field(formData, "id"), field(formData, "etape")));
}

export async function recordFollowUpAction(
  _state: RecordFollowUpState,
  formData: FormData,
): Promise<RecordFollowUpState> {
  const nextDate = field(formData, "prochaine");
  const result = await recordFollowUp(getRepository(), field(formData, "id"), nextDate, today());
  // En cas de refus, on renvoie la date saisie pour que le panneau la réaffiche.
  return result.ok ? settle(result) : { error: result.error, nextDate };
}

export async function updateContactAction(_state: EditContactState, formData: FormData): Promise<EditContactState> {
  const values = { name: field(formData, "nom"), company: field(formData, "entreprise") };
  const result = await updateContact(getRepository(), field(formData, "id"), values);
  // En cas de refus, on renvoie la saisie pour que le panneau la réaffiche.
  return result.ok ? settle(result) : { error: result.error, values };
}

export async function deleteContactAction(_state: DeleteContactState, formData: FormData): Promise<DeleteContactState> {
  return settle(await deleteContact(getRepository(), field(formData, "id")));
}
