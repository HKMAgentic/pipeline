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
    expect(await repository.list()).toEqual([{ ...camille, lastFollowUpDate: null, id: saved.id, createdAt: saved.createdAt }]);
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

    await repository.update(saved.id, { followUpDate: "2026-12-01" });

    const [contact] = await createContactRepository(url).list();
    expect(contact.followUpDate).toBe("2026-12-01");
  });

  it("peut retirer la date", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    const saved = await repository.add({ ...camille, followUpDate: "2026-11-26" });

    await repository.update(saved.id, { followUpDate: null });

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
        lastFollowUpDate: null,
        createdAt: "2026-11-25T10:00:00.000Z",
      },
    ]);
    await repository.update("ancien", { followUpDate: "2026-12-01" });
    expect((await repository.list())[0].followUpDate).toBe("2026-12-01");
  });
});

describe("lire et modifier un contact (libSQL)", () => {
  it("relit un contact par son identifiant", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    const saved = await repository.add(camille);

    expect(await repository.get(saved.id)).toEqual({ ...camille, lastFollowUpDate: null, id: saved.id, createdAt: saved.createdAt });
  });

  it("renvoie null pour un identifiant inconnu", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    expect(await repository.get("absent")).toBeNull();
  });

  it("garde la nouvelle étape après un redémarrage", async () => {
    const url = tempDatabaseUrl();
    const saved = await createContactRepository(url).add({ ...camille, stage: "Contacté" });

    await createContactRepository(url).update(saved.id, { stage: "Échange" });

    const afterRestart = createContactRepository(url);
    expect((await afterRestart.get(saved.id))?.stage).toBe("Échange");
  });

  it("ne modifie que les champs demandés", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    const saved = await repository.add({ ...camille, followUpDate: "2026-11-26" });

    await repository.update(saved.id, { stage: "Échange" });

    expect(await repository.get(saved.id)).toMatchObject({ name: "Camille Roux", followUpDate: "2026-11-26", stage: "Échange" });
  });

  it("une modification vide ne fait rien", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    const saved = await repository.add(camille);

    await repository.update(saved.id, {});

    expect(await repository.get(saved.id)).toMatchObject(camille);
  });
});

describe("relance faite (libSQL)", () => {
  it("garde « relancé le » et la nouvelle date après un redémarrage", async () => {
    const url = tempDatabaseUrl();
    const saved = await createContactRepository(url).add({ ...camille, followUpDate: "2026-11-20" });

    await createContactRepository(url).update(saved.id, { lastFollowUpDate: "2026-11-24", followUpDate: "2026-12-01" });

    const afterRestart = createContactRepository(url);
    expect(await afterRestart.get(saved.id)).toMatchObject({ lastFollowUpDate: "2026-11-24", followUpDate: "2026-12-01" });
  });

  it("ouvre une base du lot 2 (sans colonne « relancé le ») sans perdre ses contacts", async () => {
    const url = tempDatabaseUrl();
    const old = createClient({ url });
    await old.execute(
      "CREATE TABLE contacts (id TEXT PRIMARY KEY, name TEXT NOT NULL, company TEXT NOT NULL, stage TEXT NOT NULL, created_at TEXT NOT NULL, follow_up_date TEXT)",
    );
    await old.execute(
      "INSERT INTO contacts VALUES ('ancien', 'Hugo Bernard', 'Studio Lumen', 'Contacté', '2026-11-25T10:00:00.000Z', '2026-11-20')",
    );
    old.close();

    const repository = createContactRepository(url);

    expect(await repository.get("ancien")).toMatchObject({ followUpDate: "2026-11-20", lastFollowUpDate: null });
    await repository.update("ancien", { lastFollowUpDate: "2026-11-24" });
    expect((await repository.get("ancien"))?.lastFollowUpDate).toBe("2026-11-24");
  });
});
