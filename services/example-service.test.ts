import { describe, expect, it } from "vitest";
import type { ExampleRepository } from "@/data/example-repository";
import { listExamples } from "@/services/example-service";

describe("couche service", () => {
  it("renvoie les éléments fournis par le dépôt", async () => {
    const fakeRepository: ExampleRepository = { list: async () => ["a"] };
    expect(await listExamples(fakeRepository)).toEqual(["a"]);
  });
});
