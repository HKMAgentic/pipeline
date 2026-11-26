import { describe, expect, it } from "vitest";
import type { ContactRecord, ContactRepository } from "@/data/contact-repository";
import { buildAgenda } from "@/services/agenda";
import { listContacts, type Contact } from "@/services/contacts";
import { followUpStatus } from "@/services/follow-up";

const TODAY = "2026-11-24";

function contact(name: string, date: string | null): Contact {
  return { id: name, name, company: "", stage: "À contacter", followUp: date ? followUpStatus(date, TODAY) : null };
}

const enRetard = contact("En retard", "2026-11-20"); // −4 jours
const aujourdhui = contact("Aujourd'hui", "2026-11-24");
const dansCinqJours = contact("Dans 5 jours", "2026-11-29");

const names = (contacts: Contact[]) => contacts.map((c) => c.name);

describe("relances du jour", () => {
  it("montre les contacts en retard et à relancer aujourd'hui, le plus en retard en tête", () => {
    const agenda = buildAgenda([aujourdhui, dansCinqJours, enRetard]);
    expect(names(agenda.due)).toEqual(["En retard", "Aujourd'hui"]);
  });

  it("range le contact à relancer dans 5 jours dans « À venir », pas dans les relances du jour", () => {
    const agenda = buildAgenda([aujourdhui, dansCinqJours, enRetard]);
    expect(names(agenda.upcoming)).toEqual(["Dans 5 jours"]);
    expect(names(agenda.due)).not.toContain("Dans 5 jours");
  });

  it("compte 2 relances à faire, dont 1 en retard", () => {
    const agenda = buildAgenda([aujourdhui, dansCinqJours, enRetard]);
    expect(agenda).toMatchObject({ dueCount: 2, lateCount: 1, total: 3 });
  });

  it("n'a rien à relancer quand aucun contact n'est dû ni en retard", () => {
    const agenda = buildAgenda([dansCinqJours, contact("Sans date", null)]);
    expect(agenda.due).toEqual([]);
    expect(agenda).toMatchObject({ dueCount: 0, lateCount: 0, total: 2 });
  });

  it("à retard égal, garde l'ordre reçu", () => {
    const a = contact("A", "2026-11-20");
    const b = contact("B", "2026-11-20");
    expect(names(buildAgenda([a, b]).due)).toEqual(["A", "B"]);
  });
});

describe("à venir", () => {
  it("date la plus proche d'abord, contacts sans date à la fin", () => {
    const sansDate = contact("Sans date", null);
    const dansDixJours = contact("Dans 10 jours", "2026-12-04");
    const agenda = buildAgenda([sansDate, dansDixJours, dansCinqJours]);
    expect(names(agenda.upcoming)).toEqual(["Dans 5 jours", "Dans 10 jours", "Sans date"]);
  });

  it("une liste vide donne un agenda vide", () => {
    expect(buildAgenda([])).toEqual({ due: [], upcoming: [], dueCount: 0, lateCount: 0, total: 0 });
  });
});

describe("le lendemain", () => {
  it("un contact à relancer demain passe dans les relances du jour le lendemain", async () => {
    const record: ContactRecord = {
      id: "a",
      name: "Demain",
      company: "",
      stage: "À contacter",
      followUpDate: "2026-11-26",
      createdAt: "2026-11-25T10:00:00.000Z",
    };
    const repository = { list: async () => [record] } as unknown as ContactRepository;

    const laVeille = buildAgenda(await listContacts(repository, "2026-11-25"));
    const leLendemain = buildAgenda(await listContacts(repository, "2026-11-26"));

    expect(names(laVeille.due)).toEqual([]);
    expect(names(laVeille.upcoming)).toEqual(["Demain"]);
    expect(names(leLendemain.due)).toEqual(["Demain"]);
  });
});
