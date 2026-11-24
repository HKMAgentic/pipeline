import { describe, expect, it } from "vitest";
import { createExampleRepository } from "@/data/example-repository";

describe("couche données", () => {
  it("le dépôt d'exemple renvoie une liste vide", async () => {
    const repository = createExampleRepository();
    expect(await repository.list()).toEqual([]);
  });
});
