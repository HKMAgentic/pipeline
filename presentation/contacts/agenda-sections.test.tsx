import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AgendaSections } from "@/presentation/contacts/agenda-sections";
import type { Agenda } from "@/services/agenda";
import type { Contact } from "@/services/contacts";

import { fakeActions } from "@/presentation/contacts/fake-actions";

function contact(name: string, date: string, daysFromToday: number): Contact {
  return {
    id: name,
    name,
    company: "",
    stage: "À contacter",
    followUp: { date, late: daysFromToday < 0, daysFromToday },
  };
}

const enRetard = contact("Hugo Bernard", "2026-11-20", -4);
const aujourdhui = contact("Camille Roux", "2026-11-24", 0);
const dansCinqJours = contact("Léa Martin", "2026-11-29", 5);

function render(agenda: Agenda) {
  return renderToStaticMarkup(<AgendaSections agenda={agenda} actions={fakeActions} />);
}

// Découpe le HTML en deux : ce qui est dans « Relances du jour », ce qui est dans « À venir ».
function sections(html: string) {
  const start = html.indexOf("Relances du jour");
  const split = html.indexOf("À venir");
  expect(start).toBeGreaterThanOrEqual(0);
  expect(split).toBeGreaterThan(start);
  return { due: html.slice(start, split), upcoming: html.slice(split) };
}

describe("sections de l'agenda", () => {
  const agenda: Agenda = { due: [enRetard, aujourdhui], upcoming: [dansCinqJours], dueCount: 2, lateCount: 1, total: 3 };

  it("« Relances du jour » montre les 2 contacts dus, le plus en retard en tête", () => {
    const { due } = sections(render(agenda));
    expect(due).toContain("Hugo Bernard");
    expect(due).toContain("Camille Roux");
    expect(due.indexOf("Hugo Bernard")).toBeLessThan(due.indexOf("Camille Roux"));
  });

  it("le contact à relancer dans 5 jours est dans « À venir », pas dans « Relances du jour »", () => {
    const { due, upcoming } = sections(render(agenda));
    expect(upcoming).toContain("Léa Martin");
    expect(due).not.toContain("Léa Martin");
  });

  it("affiche « Rien à relancer aujourd'hui » quand rien n'est dû", () => {
    const html = render({ due: [], upcoming: [dansCinqJours], dueCount: 0, lateCount: 0, total: 1 });
    expect(sections(html).due).toContain("Rien à relancer aujourd’hui");
    expect(html).not.toContain("Aucun contact pour l’instant");
  });

  it("sans aucun contact, affiche « Aucun contact pour l'instant » (lot 1)", () => {
    const html = render({ due: [], upcoming: [], dueCount: 0, lateCount: 0, total: 0 });
    expect(html).toContain("Aucun contact pour l’instant");
  });

  it("« À venir » vide mais des relances dues : « Rien à venir pour l'instant. »", () => {
    const html = render({ due: [aujourdhui], upcoming: [], dueCount: 1, lateCount: 0, total: 1 });
    expect(sections(html).upcoming).toContain("Rien à venir pour l’instant.");
  });
});
