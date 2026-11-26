import { describe, expect, it } from "vitest";
import type { ContactRecord, ContactRepository, NewContactRecord } from "@/data/contact-repository";
import { addContact, listContacts, setFollowUp } from "@/services/contacts";

// Faux dépôt en mémoire : le service est testé sans vraie base.
function fakeRepository(initial: ContactRecord[] = []) {
  const records = [...initial];
  const added: NewContactRecord[] = [];
  const followUpChanges: { id: string; date: string | null }[] = [];
  const repository: ContactRepository = {
    async add(contact) {
      added.push(contact);
      const record = { ...contact, id: `id-${records.length + 1}`, createdAt: "2026-11-25T10:00:00.000Z" };
      records.unshift(record);
      return record;
    },
    async list() {
      return records;
    },
    async setFollowUpDate(id, date) {
      followUpChanges.push({ id, date });
      const record = records.find((r) => r.id === id);
      if (record) record.followUpDate = date;
    },
  };
  return { repository, added, followUpChanges };
}

function record(overrides: Partial<ContactRecord>): ContactRecord {
  return {
    id: "a",
    name: "Camille Roux",
    company: "Atelier Roux",
    stage: "À contacter",
    followUpDate: null,
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
    const { repository, followUpChanges } = fakeRepository([record({ id: "a" })]);

    const result = await setFollowUp(repository, "a", "2026-12-01");

    expect(result).toEqual({ ok: true });
    expect(followUpChanges).toEqual([{ id: "a", date: "2026-12-01" }]);
  });

  it("une date vide retire la relance", async () => {
    const { repository, followUpChanges } = fakeRepository([record({ id: "a", followUpDate: "2026-11-20" })]);

    await setFollowUp(repository, "a", "");

    expect(followUpChanges).toEqual([{ id: "a", date: null }]);
  });

  it("refuse une date qui n'existe pas sans rien enregistrer", async () => {
    const { repository, followUpChanges } = fakeRepository([record({ id: "a" })]);

    const result = await setFollowUp(repository, "a", "2026-13-01");

    expect(result).toEqual({ ok: false, error: "invalid_date" });
    expect(followUpChanges).toEqual([]);
  });
});

describe("lister les contacts", () => {
  it("renvoie les contacts du dépôt, sans relance si aucune date", async () => {
    const { repository } = fakeRepository([record({ stage: "Échange" })]);

    expect(await listContacts(repository, "2026-11-24")).toEqual([
      { id: "a", name: "Camille Roux", company: "Atelier Roux", stage: "Échange", followUp: null },
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
