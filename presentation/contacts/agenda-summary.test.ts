import { describe, expect, it } from "vitest";
import { agendaSummary } from "@/presentation/contacts/agenda-summary";

describe("texte du bandeau", () => {
  it("« 2 relances à faire, dont 1 en retard »", () => {
    expect(agendaSummary({ dueCount: 2, lateCount: 1 })).toBe("2 relances à faire, dont 1 en retard");
  });

  it("singulier et sans retard", () => {
    expect(agendaSummary({ dueCount: 1, lateCount: 0 })).toBe("1 relance à faire");
  });

  it("aucune relance", () => {
    expect(agendaSummary({ dueCount: 0, lateCount: 0 })).toBe("Aucune relance à faire aujourd’hui");
  });
});
