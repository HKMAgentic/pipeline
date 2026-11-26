import { describe, expect, it } from "vitest";
import { INITIAL_STAGE, isEarlyStage, isStage, nextStage, STAGES } from "@/services/stages";

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

describe("étape suivante", () => {
  it("après « Contacté » vient « Échange »", () => {
    expect(nextStage("Contacté")).toBe("Échange");
  });

  it("chaque étape mène à la suivante", () => {
    expect(STAGES.map(nextStage)).toEqual(["Contacté", "Échange", "Proposition", "Signé", null]);
  });

  it("il n'y a pas d'étape après « Signé »", () => {
    expect(nextStage("Signé")).toBeNull();
  });
});

describe("étapes précoces", () => {
  it("« À contacter » et « Contacté » sont précoces, les suivantes non", () => {
    expect(STAGES.filter(isEarlyStage)).toEqual(["À contacter", "Contacté"]);
  });
});
