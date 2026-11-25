import { describe, expect, it } from "vitest";
import { INITIAL_STAGE, isStage, STAGES } from "@/services/stages";

describe("étapes du pipeline", () => {
  it("suivent l'ordre À contacter → Contacté → Échange → Proposition → Signé", () => {
    expect(STAGES).toEqual(["À contacter", "Contacté", "Échange", "Proposition", "Signé"]);
  });

  it("un nouveau contact commence à « À contacter »", () => {
    expect(INITIAL_STAGE).toBe("À contacter");
  });

  it("reconnaît une étape valide et refuse une étape inconnue", () => {
    expect(isStage("Échange")).toBe(true);
    expect(isStage("Perdu")).toBe(false);
  });
});
