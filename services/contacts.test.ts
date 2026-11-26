import { describe, expect, it } from "vitest";
import type { ContactChanges, ContactRecord, ContactRepository, NewContactRecord } from "@/data/contact-repository";
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

// Faux dépôt en mémoire : le service est testé sans vraie base.
function fakeRepository(initial: ContactRecord[] = []) {
  const records = [...initial];
  const added: NewContactRecord[] = [];
  const updates: { id: string; changes: ContactChanges }[] = [];
  const removed: string[] = [];
  const repository: ContactRepository = {
    async add(contact) {
      added.push(contact);
      const record = { ...contact, lastFollowUpDate: null, id: `id-${records.length + 1}`, createdAt: "2026-11-25T10:00:00.000Z" };
      records.unshift(record);
      return record;
    },
    async list() {
      return records;
    },
    async get(id) {
      return records.find((r) => r.id === id) ?? null;
    },
    async update(id, changes) {
      updates.push({ id, changes });
      const record = records.find((r) => r.id === id);
      if (record) Object.assign(record, changes);
    },
    async remove(id) {
      removed.push(id);
      const index = records.findIndex((r) => r.id === id);
      if (index >= 0) records.splice(index, 1);
    },
  };
  return { repository, added, updates, removed };
}

function record(overrides: Partial<ContactRecord>): ContactRecord {
  return {
    id: "a",
    name: "Camille Roux",
    company: "Atelier Roux",
    stage: "À contacter",
    followUpDate: null,
    lastFollowUpDate: null,
    createdAt: "2026-11-25T10:00:00.000Z",
    ...overrides,
  };
}

describe("ajouter un contact", () => {
  it("enregistre Camille Roux à l'étape « À contacter », sans relance", async () => {
    const { repository, added } = fakeRepository();

    const result = await addContact(repository, { name: "Camille Roux", company: "Atelier Roux" });

    expect(added).toEqual([{ name: "Camille Roux", company: "Atelier Roux", stage: "À contacter", followUpDate: null }]);
    expect(result).toEqual({ ok: true, id: "id-1" });
  });

  it("retire les espaces autour du nom et de l'entreprise", async () => {
    const { repository, added } = fakeRepository();

    await addContact(repository, { name: "  Camille Roux ", company: " Atelier Roux  " });

    expect(added[0]).toMatchObject({ name: "Camille Roux", company: "Atelier Roux" });
  });

  it.each(["", "   "])("refuse un nom vide (%j) sans rien enregistrer", async (name) => {
    const { repository, added } = fakeRepository();

    const result = await addContact(repository, { name, company: "Atelier Roux" });

    expect(result).toEqual({ ok: false, error: "name_required" });
    expect(added).toEqual([]);
  });

  it("enregistre la date de relance choisie (26/11)", async () => {
    const { repository, added } = fakeRepository();

    await addContact(repository, { name: "Camille Roux", company: "", followUpDate: "2026-11-26" });

    expect(added[0].followUpDate).toBe("2026-11-26");
  });

  it("une date de relance vide veut dire « pas de relance »", async () => {
    const { repository, added } = fakeRepository();

    await addContact(repository, { name: "Camille Roux", company: "", followUpDate: "  " });

    expect(added[0].followUpDate).toBeNull();
  });

  it("refuse une date qui n'existe pas sans rien enregistrer", async () => {
    const { repository, added } = fakeRepository();

    const result = await addContact(repository, { name: "Camille Roux", company: "", followUpDate: "2026-02-30" });

    expect(result).toEqual({ ok: false, error: "invalid_date" });
    expect(added).toEqual([]);
  });
});

describe("changer la date de relance", () => {
  it("enregistre la nouvelle date", async () => {
    const { repository, updates } = fakeRepository([record({ id: "a" })]);

    const result = await setFollowUp(repository, "a", "2026-12-01");

    expect(result).toEqual({ ok: true });
    expect(updates).toEqual([{ id: "a", changes: { followUpDate: "2026-12-01" } }]);
  });

  it("une date vide retire la relance", async () => {
    const { repository, updates } = fakeRepository([record({ id: "a", followUpDate: "2026-11-20" })]);

    await setFollowUp(repository, "a", "");

    expect(updates).toEqual([{ id: "a", changes: { followUpDate: null } }]);
  });

  it("refuse une date qui n'existe pas sans rien enregistrer", async () => {
    const { repository, updates } = fakeRepository([record({ id: "a" })]);

    const result = await setFollowUp(repository, "a", "2026-13-01");

    expect(result).toEqual({ ok: false, error: "invalid_date" });
    expect(updates).toEqual([]);
  });
});

describe("lister les contacts", () => {
  it("renvoie les contacts du dépôt, sans relance si aucune date", async () => {
    const { repository } = fakeRepository([record({ stage: "Échange" })]);

    expect(await listContacts(repository, "2026-11-24")).toEqual([
      { id: "a", name: "Camille Roux", company: "Atelier Roux", stage: "Échange", followUp: null, lastFollowUpDate: null },
    ]);
  });

  it("un contact à relancer le 20/11, vu le 24/11, est en retard de 4 jours", async () => {
    const { repository } = fakeRepository([record({ followUpDate: "2026-11-20" })]);

    const [contact] = await listContacts(repository, "2026-11-24");

    expect(contact.followUp).toEqual({ date: "2026-11-20", late: true, daysFromToday: -4 });
  });

  it("renvoie une liste vide quand il n'y a aucun contact", async () => {
    const { repository } = fakeRepository();
    expect(await listContacts(repository, "2026-11-24")).toEqual([]);
  });

  it("signale une étape inconnue enregistrée en base", async () => {
    const { repository } = fakeRepository([record({ stage: "Perdu" })]);

    await expect(listContacts(repository, "2026-11-24")).rejects.toThrow("Étape inconnue : Perdu");
  });
});

describe("étape suivante", () => {
  it("un contact à « Contacté » passe à « Échange »", async () => {
    const { repository, updates } = fakeRepository([record({ id: "a", stage: "Contacté" })]);

    const result = await advanceStage(repository, "a");

    expect(result).toEqual({ ok: true, stage: "Échange" });
    expect(updates).toEqual([{ id: "a", changes: { stage: "Échange" } }]);
  });

  it("un contact à « Signé » n'a pas d'étape suivante : rien n'est enregistré", async () => {
    const { repository, updates } = fakeRepository([record({ id: "a", stage: "Signé" })]);

    expect(await advanceStage(repository, "a")).toEqual({ ok: false, error: "last_stage" });
    expect(updates).toEqual([]);
  });

  it("un contact inconnu : rien n'est enregistré", async () => {
    const { repository, updates } = fakeRepository();

    expect(await advanceStage(repository, "absent")).toEqual({ ok: false, error: "not_found" });
    expect(updates).toEqual([]);
  });
});

describe("choisir une étape", () => {
  it("un contact passé à « Proposition » par erreur revient à « Échange »", async () => {
    const { repository, updates } = fakeRepository([record({ id: "a", stage: "Proposition" })]);

    const result = await changeStage(repository, "a", "Échange");

    expect(result).toEqual({ ok: true, stage: "Échange" });
    expect(updates).toEqual([{ id: "a", changes: { stage: "Échange" } }]);
  });

  it("refuse une étape qui n'existe pas", async () => {
    const { repository, updates } = fakeRepository([record({ id: "a" })]);

    expect(await changeStage(repository, "a", "Perdu")).toEqual({ ok: false, error: "invalid_stage" });
    expect(updates).toEqual([]);
  });

  it("refuse un contact inconnu", async () => {
    const { repository, updates } = fakeRepository();

    expect(await changeStage(repository, "absent", "Échange")).toEqual({ ok: false, error: "not_found" });
    expect(updates).toEqual([]);
  });
});

describe("noter une relance faite", () => {
  const TODAY = "2026-11-24";

  it("Hugo en retard, relancé le 24/11 avec une prochaine relance le 01/12", async () => {
    const { repository, updates } = fakeRepository([record({ id: "h", name: "Hugo Bernard", followUpDate: "2026-11-20" })]);

    const result = await recordFollowUp(repository, "h", "2026-12-01", TODAY);

    expect(result).toEqual({ ok: true });
    expect(updates).toEqual([{ id: "h", changes: { lastFollowUpDate: "2026-11-24", followUpDate: "2026-12-01" } }]);
    const [hugo] = await listContacts(repository, TODAY);
    expect(hugo).toMatchObject({ lastFollowUpDate: "2026-11-24", followUp: { date: "2026-12-01", late: false } });
  });

  it("sans prochaine date : la relance est notée, plus de relance prévue", async () => {
    const { repository, updates } = fakeRepository([record({ id: "h", followUpDate: "2026-11-20" })]);

    expect(await recordFollowUp(repository, "h", "", TODAY)).toEqual({ ok: true });
    expect(updates).toEqual([{ id: "h", changes: { lastFollowUpDate: "2026-11-24", followUpDate: null } }]);
  });

  it("accepte aujourd'hui comme prochaine date", async () => {
    const { repository } = fakeRepository([record({ id: "h" })]);
    expect(await recordFollowUp(repository, "h", TODAY, TODAY)).toEqual({ ok: true });
  });

  it("refuse une prochaine date passée sans rien enregistrer", async () => {
    const { repository, updates } = fakeRepository([record({ id: "h", followUpDate: "2026-11-20" })]);

    expect(await recordFollowUp(repository, "h", "2026-11-23", TODAY)).toEqual({ ok: false, error: "past_date" });
    expect(updates).toEqual([]);
  });

  it("refuse une date qui n'existe pas sans rien enregistrer", async () => {
    const { repository, updates } = fakeRepository([record({ id: "h" })]);

    expect(await recordFollowUp(repository, "h", "2026-02-30", TODAY)).toEqual({ ok: false, error: "invalid_date" });
    expect(updates).toEqual([]);
  });

  it("refuse un contact inconnu", async () => {
    const { repository, updates } = fakeRepository();

    expect(await recordFollowUp(repository, "absent", "", TODAY)).toEqual({ ok: false, error: "not_found" });
    expect(updates).toEqual([]);
  });
});

describe("corriger un contact", () => {
  it("« Atelier Roux » devient « Atelier Roux & fils »", async () => {
    const { repository, updates } = fakeRepository([record({ id: "c" })]);

    const result = await updateContact(repository, "c", { name: "Camille Roux", company: "Atelier Roux & fils" });

    expect(result).toEqual({ ok: true });
    expect(updates).toEqual([{ id: "c", changes: { name: "Camille Roux", company: "Atelier Roux & fils" } }]);
  });

  it("retire les espaces autour du nom et de l'entreprise", async () => {
    const { repository, updates } = fakeRepository([record({ id: "c" })]);

    await updateContact(repository, "c", { name: "  Camille  ", company: " Atelier " });

    expect(updates[0].changes).toEqual({ name: "Camille", company: "Atelier" });
  });

  it.each(["", "   "])("refuse un nom vidé (%j) sans rien modifier", async (name) => {
    const { repository, updates } = fakeRepository([record({ id: "c" })]);

    expect(await updateContact(repository, "c", { name, company: "Atelier Roux" })).toEqual({
      ok: false,
      error: "name_required",
    });
    expect(updates).toEqual([]);
  });

  it("refuse un contact inconnu", async () => {
    const { repository, updates } = fakeRepository();

    expect(await updateContact(repository, "absent", { name: "X", company: "" })).toEqual({ ok: false, error: "not_found" });
    expect(updates).toEqual([]);
  });
});

describe("supprimer un contact", () => {
  it("supprime Camille Roux", async () => {
    const { repository, removed } = fakeRepository([record({ id: "c" })]);

    expect(await deleteContact(repository, "c")).toEqual({ ok: true });
    expect(removed).toEqual(["c"]);
    expect(await listContacts(repository, "2026-11-24")).toEqual([]);
  });

  it("refuse un contact inconnu", async () => {
    const { repository, removed } = fakeRepository();

    expect(await deleteContact(repository, "absent")).toEqual({ ok: false, error: "not_found" });
    expect(removed).toEqual([]);
  });
});
