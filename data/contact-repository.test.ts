import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createClient } from "@libsql/client";
import { describe, expect, it } from "vitest";
import { createContactRepository } from "@/data/contact-repository";

// Chaque test a son propre fichier de base, dans un dossier temporaire.
function tempDatabaseUrl() {
  const dir = mkdtempSync(join(tmpdir(), "pipeline-test-"));
  return `file:${join(dir, "test.db")}`;
}

const camille = { name: "Camille Roux", company: "Atelier Roux", stage: "À contacter", followUpDate: null };

describe("dépôt de contacts (libSQL)", () => {
  it("une base neuve ne contient aucun contact", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    expect(await repository.list()).toEqual([]);
  });

  it("enregistre un contact puis le relit", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    const saved = await repository.add(camille);

    expect(saved.id).toBeTruthy();
    expect(await repository.list()).toEqual([{ ...camille, id: saved.id, createdAt: saved.createdAt }]);
  });

  it("retrouve les contacts après un redémarrage (nouveau dépôt sur le même fichier)", async () => {
    const url = tempDatabaseUrl();
    await createContactRepository(url).add(camille);

    const afterRestart = createContactRepository(url);
    const contacts = await afterRestart.list();

    expect(contacts.map((c) => c.name)).toEqual(["Camille Roux"]);
  });

  it("liste les contacts du plus récent au plus ancien", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    await repository.add({ ...camille, name: "Premier" });
    await repository.add({ ...camille, name: "Second" });

    expect((await repository.list()).map((c) => c.name)).toEqual(["Second", "Premier"]);
  });
});

describe("date de relance (libSQL)", () => {
  it("enregistre la date de relance choisie à la création", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    await repository.add({ ...camille, followUpDate: "2026-11-26" });

    const [contact] = await repository.list();

    expect(contact.followUpDate).toBe("2026-11-26");
  });

  it("relit « pas de date » comme null", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    await repository.add(camille);

    const [contact] = await repository.list();

    expect(contact.followUpDate).toBeNull();
  });

  it("garde la date modifiée après un redémarrage", async () => {
    const url = tempDatabaseUrl();
    const repository = createContactRepository(url);
    const saved = await repository.add({ ...camille, followUpDate: "2026-11-26" });

    await repository.setFollowUpDate(saved.id, "2026-12-01");

    const [contact] = await createContactRepository(url).list();
    expect(contact.followUpDate).toBe("2026-12-01");
  });

  it("peut retirer la date", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    const saved = await repository.add({ ...camille, followUpDate: "2026-11-26" });

    await repository.setFollowUpDate(saved.id, null);

    const [contact] = await repository.list();
    expect(contact.followUpDate).toBeNull();
  });

  it("ouvre une base du lot 1 (sans colonne de date) sans perdre ses contacts", async () => {
    const url = tempDatabaseUrl();
    const old = createClient({ url });
    await old.execute(
      "CREATE TABLE contacts (id TEXT PRIMARY KEY, name TEXT NOT NULL, company TEXT NOT NULL, stage TEXT NOT NULL, created_at TEXT NOT NULL)",
    );
    await old.execute(
      "INSERT INTO contacts VALUES ('ancien', 'Hugo Bernard', 'Studio Lumen', 'Contacté', '2026-11-25T10:00:00.000Z')",
    );
    old.close();

    const repository = createContactRepository(url);

    expect(await repository.list()).toEqual([
      {
        id: "ancien",
        name: "Hugo Bernard",
        company: "Studio Lumen",
        stage: "Contacté",
        followUpDate: null,
        createdAt: "2026-11-25T10:00:00.000Z",
      },
    ]);
    await repository.setFollowUpDate("ancien", "2026-12-01");
    expect((await repository.list())[0].followUpDate).toBe("2026-12-01");
  });
});
