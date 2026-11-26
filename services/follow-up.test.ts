import { describe, expect, it } from "vitest";
import { followUpStatus, parseDay, todayIn } from "@/services/follow-up";

describe("lire un jour saisi", () => {
  it("accepte un jour qui existe", () => {
    expect(parseDay("2026-11-26")).toEqual({ ok: true, day: "2026-11-26" });
  });

  it.each(["2026-02-30", "2026-13-01", "26/11/2026", "demain", "2026-11-26T10:00"])(
    "refuse %j",
    (text) => {
      expect(parseDay(text)).toEqual({ ok: false, error: "invalid_date" });
    },
  );
});

describe("jour d'aujourd'hui dans un fuseau", () => {
  it("donne le jour du calendrier à Paris", () => {
    expect(todayIn(new Date("2026-11-24T10:00:00Z"), "Europe/Paris")).toBe("2026-11-24");
  });

  it("à 23 h 30 UTC, il est déjà le lendemain à Paris", () => {
    expect(todayIn(new Date("2026-11-24T23:30:00Z"), "Europe/Paris")).toBe("2026-11-25");
  });
});

describe("état d'une relance", () => {
  it("une relance le 20/11 vue le 24/11 est en retard de 4 jours", () => {
    expect(followUpStatus("2026-11-20", "2026-11-24")).toEqual({
      date: "2026-11-20",
      late: true,
      daysFromToday: -4,
    });
  });

  it("une relance prévue aujourd'hui n'est pas en retard", () => {
    expect(followUpStatus("2026-11-26", "2026-11-26")).toEqual({
      date: "2026-11-26",
      late: false,
      daysFromToday: 0,
    });
  });

  it("une relance à venir n'est pas en retard", () => {
    expect(followUpStatus("2026-12-01", "2026-11-26")).toEqual({
      date: "2026-12-01",
      late: false,
      daysFromToday: 5,
    });
  });

  it("compte les jours sans erreur au changement d'heure (fin octobre)", () => {
    expect(followUpStatus("2026-10-24", "2026-10-26").daysFromToday).toBe(-2);
  });
});
