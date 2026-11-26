import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContactForm } from "@/presentation/contacts/contact-form";

const fakeAction = async () => ({ error: null });

describe("formulaire nouveau contact", () => {
  it("propose les champs Nom, Entreprise et Date de relance (facultative)", () => {
    const html = renderToStaticMarkup(<ContactForm action={fakeAction} />);
    expect(html).toContain('name="nom"');
    expect(html).toContain('name="entreprise"');
    expect(html).toMatch(/type="date"[^>]*name="relance"|name="relance"[^>]*type="date"/);
    expect(html).toContain("Date de relance");
    expect(html).not.toContain('name="etape"');
  });

  it("affiche « Cette date n'existe pas. » sous le champ Date de relance, en gardant la saisie", () => {
    const html = renderToStaticMarkup(
      <ContactForm
        action={fakeAction}
        initialState={{ error: "invalid_date", values: { name: "Camille Roux", company: "", followUpDate: "" } }}
      />,
    );
    expect(html).toContain("Cette date n’existe pas. Choisissez un jour du calendrier.");
    expect(html).toContain('aria-describedby="relance-erreur"');
    expect(html).not.toContain("Le nom est obligatoire.");
    expect(html).toContain('value="Camille Roux"');
  });

  it("n'affiche pas de message d'erreur au départ", () => {
    const html = renderToStaticMarkup(<ContactForm action={fakeAction} />);
    expect(html).not.toContain("Le nom est obligatoire.");
  });

  it("affiche « Le nom est obligatoire. » sous le champ Nom quand le nom manque", () => {
    const html = renderToStaticMarkup(
      <ContactForm action={fakeAction} initialState={{ error: "name_required" }} />,
    );
    expect(html).toContain("Le nom est obligatoire.");
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="nom-erreur"');
  });

  it("garde l'entreprise saisie quand le nom manque", () => {
    const html = renderToStaticMarkup(
      <ContactForm
        action={fakeAction}
        initialState={{ error: "name_required", values: { name: "", company: "Sans nom SARL" } }}
      />,
    );
    expect(html).toContain('value="Sans nom SARL"');
  });
});
