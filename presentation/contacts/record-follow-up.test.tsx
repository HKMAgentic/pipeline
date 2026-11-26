import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { RecordFollowUp } from "@/presentation/contacts/record-follow-up";

const fakeAction = async () => ({ error: null });

describe("noter une relance faite", () => {
  it("fermé : seulement le bouton « Relancer »", () => {
    const html = renderToStaticMarkup(<RecordFollowUp contactId="h" action={fakeAction} />);
    expect(html).toContain(">Relancer<");
    expect(html).not.toContain('name="prochaine"');
  });

  it("ouvert : prochaine date facultative, « Valider » et « Annuler »", () => {
    const html = renderToStaticMarkup(<RecordFollowUp contactId="h" action={fakeAction} initialOpen />);
    expect(html).toMatch(/type="date"[^>]*name="prochaine"|name="prochaine"[^>]*type="date"/);
    expect(html).toContain("Prochaine relance");
    expect(html).toContain("(facultatif)");
    expect(html).toContain(">Valider<");
    expect(html).toContain(">Annuler<");
    expect(html).toContain('name="id"');
    expect(html).not.toMatch(/name="prochaine"[^>]*min=|min=[^>]*name="prochaine"/);
  });

  it("date passée : « Choisissez aujourd'hui ou une date à venir. »", () => {
    const html = renderToStaticMarkup(
      <RecordFollowUp contactId="h" action={fakeAction} initialOpen initialState={{ error: "past_date" }} />,
    );
    expect(html).toContain("Choisissez aujourd’hui ou une date à venir.");
    expect(html).toContain('aria-invalid="true"');
  });

  it("garde la date saisie quand elle est refusée", () => {
    const html = renderToStaticMarkup(
      <RecordFollowUp
        contactId="h"
        action={fakeAction}
        initialOpen
        initialState={{ error: "past_date", nextDate: "2026-11-20" }}
      />,
    );
    expect(html).toContain('value="2026-11-20"');
  });
});
