import { describe, expect, it } from "vitest";
import { toFollowUpView } from "@/presentation/contacts/follow-up-view";

describe("texte du tampon de relance", () => {
  it("à venir : date « 26·11 » et jour de la semaine", () => {
    expect(toFollowUpView({ date: "2026-11-26", late: false, daysFromToday: 2 })).toEqual({
      late: false,
      date: "26·11",
      caption: "JEUDI",
      label: "Relance prévue le jeudi 26 novembre",
    });
  });

  it("aujourd'hui : « AUJOURD'HUI » en bas", () => {
    expect(toFollowUpView({ date: "2026-11-26", late: false, daysFromToday: 0 })).toEqual({
      late: false,
      date: "26·11",
      caption: "AUJOURD’HUI",
      label: "Relance prévue aujourd’hui, jeudi 26 novembre",
    });
  });

  it("en retard de 4 jours : « −4 JOURS »", () => {
    expect(toFollowUpView({ date: "2026-11-20", late: true, daysFromToday: -4 })).toEqual({
      late: true,
      date: "20·11",
      caption: "−4 JOURS",
      label: "Relance en retard de 4 jours, prévue le vendredi 20 novembre",
    });
  });

  it("en retard d'un jour : singulier « −1 JOUR »", () => {
    const view = toFollowUpView({ date: "2026-11-23", late: true, daysFromToday: -1 });
    expect(view.caption).toBe("−1 JOUR");
    expect(view.label).toBe("Relance en retard de 1 jour, prévue le lundi 23 novembre");
  });
});
