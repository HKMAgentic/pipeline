import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createContactRepository } from "@/data/contact-repository";

// Chaque test a son propre fichier de base, dans un dossier temporaire.
function tempDatabaseUrl() {
  const dir = mkdtempSync(join(tmpdir(), "pipeline-test-"));
  return `file:${join(dir, "test.db")}`;
}

describe("dépôt de contacts (libSQL)", () => {
  it("une base neuve ne contient aucun contact", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    expect(await repository.list()).toEqual([]);
  });

  it("enregistre un contact puis le relit", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    const saved = await repository.add({ name: "Camille Roux", company: "Atelier Roux", stage: "À contacter" });

    expect(saved.id).toBeTruthy();
    expect(await repository.list()).toEqual([
      { id: saved.id, name: "Camille Roux", company: "Atelier Roux", stage: "À contacter", createdAt: saved.createdAt },
    ]);
  });

  it("retrouve les contacts après un redémarrage (nouveau dépôt sur le même fichier)", async () => {
    const url = tempDatabaseUrl();
    await createContactRepository(url).add({ name: "Camille Roux", company: "Atelier Roux", stage: "À contacter" });

    const afterRestart = createContactRepository(url);
    const contacts = await afterRestart.list();

    expect(contacts.map((c) => c.name)).toEqual(["Camille Roux"]);
  });

  it("liste les contacts du plus récent au plus ancien", async () => {
    const repository = createContactRepository(tempDatabaseUrl());
    await repository.add({ name: "Premier", company: "", stage: "À contacter" });
    await repository.add({ name: "Second", company: "", stage: "À contacter" });

    expect((await repository.list()).map((c) => c.name)).toEqual(["Second", "Premier"]);
  });
});
