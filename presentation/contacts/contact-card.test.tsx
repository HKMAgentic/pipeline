import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContactCard } from "@/presentation/contacts/contact-card";
import type { Contact } from "@/services/contacts";

import { fakeActions } from "@/presentation/contacts/fake-actions";

const hugo: Contact = { id: "a", name: "Hugo Bernard", company: "Studio Lumen", stage: "Contacté", followUp: null };

function render(contact: Contact) {
  return renderToStaticMarkup(<ContactCard contact={contact} actions={fakeActions} />);
}

describe("carte de contact", () => {
  it("affiche le nom, l'entreprise et l'étape", () => {
    const html = render(hugo);
    expect(html).toContain("Hugo Bernard");
    expect(html).toContain("Studio Lumen");
    expect(html).toContain("Contacté");
  });

  it("ne montre pas encore le bouton « Relancer » (lot 5)", () => {
    const html = render(hugo);
    expect(html).not.toContain(">Relancer<");
  });

  it("à « Contacté », propose « Étape suivante » et la liste des étapes", () => {
    const html = render(hugo);
    expect(html).toContain("Étape suivante");
    expect(html).toContain("Changer d’étape");
  });

  it("à « Signé », ne propose pas « Étape suivante »", () => {
    const html = render({ ...hugo, stage: "Signé" });
    expect(html).not.toContain("Étape suivante");
  });
});

describe("tampon de relance sur la carte", () => {
  it("relance à venir le 26/11 : tampon bleu « 26·11 »", () => {
    const html = render({ ...hugo, followUp: { date: "2026-11-26", late: false, daysFromToday: 0 } });
    expect(html).toContain('role="img"');
    expect(html).toContain("26·11");
    expect(html).toMatch(/text-stamp(?!-late)/);
    expect(html).not.toContain("text-stamp-late");
    expect(html).not.toContain("EN RETARD");
  });

  it("relance du 20/11 vue le 24/11 : tampon rouge « EN RETARD » et « −4 JOURS »", () => {
    const html = render({ ...hugo, followUp: { date: "2026-11-20", late: true, daysFromToday: -4 } });
    expect(html).toContain("text-stamp-late");
    expect(html).toContain("EN RETARD");
    expect(html).toContain("−4 JOURS");
    expect(html).toContain("20·11");
  });

  it("sans date : pas de tampon et « Pas de relance prévue »", () => {
    const html = render(hugo);
    expect(html).not.toContain('role="img"');
    expect(html).toContain("Pas de relance prévue");
  });

  it("propose de changer la date, préremplie avec la date actuelle", () => {
    const html = render({ ...hugo, followUp: { date: "2026-11-20", late: true, daysFromToday: -4 } });
    expect(html).toContain('type="date"');
    expect(html).toContain('value="2026-11-20"');
    expect(html).toContain('name="id"');
    expect(html).toContain('value="a"');
    expect(html).toContain("Changer la relance");
  });
});
