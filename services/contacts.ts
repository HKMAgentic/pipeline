// Règles métier des contacts. Le service ne connaît que le contrat du dépôt.
import type { ContactRecord, ContactRepository } from "@/data/contact-repository";
import { followUpStatus, parseDay, type FollowUp } from "./follow-up";
import { INITIAL_STAGE, isStage, nextStage, type Stage } from "./stages";

export type Contact = {
  id: string;
  name: string;
  company: string;
  stage: Stage;
  followUp: FollowUp | null;
  lastFollowUpDate: string | null; // jour AAAA-MM-JJ de la dernière relance faite
};

export type AddContactInput = { name: string; company: string; followUpDate?: string };

// Des codes d'erreur, pas des phrases : c'est l'écran qui choisit le message.
export type FollowUpError = "invalid_date";
export type AddContactError = "name_required" | FollowUpError;

export type AddContactResult = { ok: true; id: string } | { ok: false; error: AddContactError };
export type SetFollowUpResult = { ok: true } | { ok: false; error: FollowUpError };

// Champ vide : pas de relance. Sinon, le jour doit exister.
function readFollowUpDate(text = ""): { ok: true; date: string | null } | { ok: false; error: FollowUpError } {
  const trimmed = text.trim();
  if (trimmed === "") return { ok: true, date: null };
  const parsed = parseDay(trimmed);
  return parsed.ok ? { ok: true, date: parsed.day } : parsed;
}

// Nom et entreprise, à la création comme à la correction : espaces retirés, nom obligatoire.
function readIdentity(input: ContactIdentity): { ok: true; identity: ContactIdentity } | { ok: false; error: "name_required" } {
  const name = input.name.trim();
  if (name === "") {
    return { ok: false, error: "name_required" };
  }
  return { ok: true, identity: { name, company: input.company.trim() } };
}

export async function addContact(repository: ContactRepository, input: AddContactInput): Promise<AddContactResult> {
  const identity = readIdentity(input);
  if (!identity.ok) {
    return identity;
  }
  const followUp = readFollowUpDate(input.followUpDate);
  if (!followUp.ok) {
    return followUp;
  }

  const record = await repository.add({
    ...identity.identity,
    stage: INITIAL_STAGE,
    followUpDate: followUp.date,
  });
  return { ok: true, id: record.id };
}

export type ContactIdentity = { name: string; company: string };
export type UpdateContactError = "name_required" | "not_found";
export type UpdateContactResult = { ok: true } | { ok: false; error: UpdateContactError };

// Corriger le nom ou l'entreprise d'un contact.
export async function updateContact(
  repository: ContactRepository,
  id: string,
  input: ContactIdentity,
): Promise<UpdateContactResult> {
  const identity = readIdentity(input);
  if (!identity.ok) {
    return identity;
  }
  if (!(await repository.get(id))) {
    return { ok: false, error: "not_found" };
  }
  await repository.update(id, identity.identity);
  return { ok: true };
}

export type DeleteContactResult = { ok: true } | { ok: false; error: "not_found" };

// Supprimer définitivement un contact.
export async function deleteContact(repository: ContactRepository, id: string): Promise<DeleteContactResult> {
  if (!(await repository.get(id))) {
    return { ok: false, error: "not_found" };
  }
  await repository.remove(id);
  return { ok: true };
}

export async function setFollowUp(repository: ContactRepository, id: string, date: string): Promise<SetFollowUpResult> {
  const followUp = readFollowUpDate(date);
  if (!followUp.ok) {
    return followUp;
  }
  await repository.update(id, { followUpDate: followUp.date });
  return { ok: true };
}

export type StageError = "not_found" | "last_stage" | "invalid_stage";
export type StageResult = { ok: true; stage: Stage } | { ok: false; error: StageError };

// L'étape suivante se calcule à partir de l'étape enregistrée, pas de celle affichée.
export async function advanceStage(repository: ContactRepository, id: string): Promise<StageResult> {
  const record = await repository.get(id);
  if (!record || !isStage(record.stage)) {
    return { ok: false, error: "not_found" };
  }
  const stage = nextStage(record.stage);
  if (!stage) {
    return { ok: false, error: "last_stage" };
  }
  await repository.update(id, { stage });
  return { ok: true, stage };
}

// Choisir n'importe quelle étape, par exemple pour corriger une erreur.
export async function changeStage(repository: ContactRepository, id: string, stage: string): Promise<StageResult> {
  if (!isStage(stage)) {
    return { ok: false, error: "invalid_stage" };
  }
  if (!(await repository.get(id))) {
    return { ok: false, error: "not_found" };
  }
  await repository.update(id, { stage });
  return { ok: true, stage };
}

// `today` : le jour du calendrier (AAAA-MM-JJ) qui sert à calculer les retards.
export async function listContacts(repository: ContactRepository, today: string): Promise<Contact[]> {
  const records = await repository.list();
  return records.map((record) => toContact(record, today));
}

function toContact(record: ContactRecord, today: string): Contact {
  if (!isStage(record.stage)) {
    throw new Error(`Étape inconnue : ${record.stage}`);
  }
  return {
    id: record.id,
    name: record.name,
    company: record.company,
    stage: record.stage,
    followUp: record.followUpDate ? followUpStatus(record.followUpDate, today) : null,
    lastFollowUpDate: record.lastFollowUpDate,
  };
}

export type RecordFollowUpError = FollowUpError | "past_date" | "not_found";
export type RecordFollowUpResult = { ok: true } | { ok: false; error: RecordFollowUpError };

// Noter qu'une relance a été faite aujourd'hui, et programmer (ou non) la suivante.
export async function recordFollowUp(
  repository: ContactRepository,
  id: string,
  nextDate: string,
  today: string,
): Promise<RecordFollowUpResult> {
  const next = readFollowUpDate(nextDate);
  if (!next.ok) {
    return next;
  }
  // La prochaine relance ne peut pas être dans le passé (aujourd'hui est accepté).
  if (next.date && followUpStatus(next.date, today).late) {
    return { ok: false, error: "past_date" };
  }
  if (!(await repository.get(id))) {
    return { ok: false, error: "not_found" };
  }
  await repository.update(id, { lastFollowUpDate: today, followUpDate: next.date });
  return { ok: true };
}
