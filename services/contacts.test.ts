import { describe, expect, it } from "vitest";
import type { ContactRecord, ContactRepository, NewContactRecord } from "@/data/contact-repository";
import { addContact, listContacts } from "@/services/contacts";

// Faux dépôt en mémoire : le service est testé sans vraie base.
function fakeRepository(initial: ContactRecord[] = []) {
  const records = [...initial];
  const added: NewContactRecord[] = [];
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
  };
  return { repository, added };
}

describe("ajouter un contact", () => {
  it("enregistre Camille Roux à l'étape « À contacter »", async () => {
    const { repository, added } = fakeRepository();

    const result = await addContact(repository, { name: "Camille Roux", company: "Atelier Roux" });

    expect(added).toEqual([{ name: "Camille Roux", company: "Atelier Roux", stage: "À contacter" }]);
    expect(result).toEqual({
      ok: true,
      contact: { id: "id-1", name: "Camille Roux", company: "Atelier Roux", stage: "À contacter" },
    });
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
});

describe("lister les contacts", () => {
  it("renvoie les contacts du dépôt", async () => {
    const { repository } = fakeRepository([
      { id: "a", name: "Camille Roux", company: "Atelier Roux", stage: "Échange", createdAt: "2026-11-25T10:00:00.000Z" },
    ]);

    expect(await listContacts(repository)).toEqual([
      { id: "a", name: "Camille Roux", company: "Atelier Roux", stage: "Échange" },
    ]);
  });

  it("renvoie une liste vide quand il n'y a aucun contact", async () => {
    const { repository } = fakeRepository();
    expect(await listContacts(repository)).toEqual([]);
  });

  it("signale une étape inconnue enregistrée en base", async () => {
    const { repository } = fakeRepository([
      { id: "a", name: "X", company: "", stage: "Perdu", createdAt: "2026-11-25T10:00:00.000Z" },
    ]);

    await expect(listContacts(repository)).rejects.toThrow("Étape inconnue : Perdu");
  });
});
