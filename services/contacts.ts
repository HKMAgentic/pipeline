// Règles métier des contacts. Le service ne connaît que le contrat du dépôt.
import type { ContactRecord, ContactRepository } from "@/data/contact-repository";
import { followUpStatus, parseDay, type FollowUp } from "./follow-up";
import { INITIAL_STAGE, isStage, type Stage } from "./stages";

export type Contact = {
  id: string;
  name: string;
  company: string;
  stage: Stage;
  followUp: FollowUp | null;
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

export async function addContact(repository: ContactRepository, input: AddContactInput): Promise<AddContactResult> {
  const name = input.name.trim();
  if (name === "") {
    return { ok: false, error: "name_required" };
  }
  const followUp = readFollowUpDate(input.followUpDate);
  if (!followUp.ok) {
    return followUp;
  }

  const record = await repository.add({
    name,
    company: input.company.trim(),
    stage: INITIAL_STAGE,
    followUpDate: followUp.date,
  });
  return { ok: true, id: record.id };
}

export async function setFollowUp(repository: ContactRepository, id: string, date: string): Promise<SetFollowUpResult> {
  const followUp = readFollowUpDate(date);
  if (!followUp.ok) {
    return followUp;
  }
  await repository.setFollowUpDate(id, followUp.date);
  return { ok: true };
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
  };
}
