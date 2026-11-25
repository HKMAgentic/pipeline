import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContactForm } from "@/presentation/contacts/contact-form";

const fakeAction = async () => ({ error: null });

describe("formulaire nouveau contact", () => {
  it("propose seulement les champs Nom et Entreprise", () => {
    const html = renderToStaticMarkup(<ContactForm action={fakeAction} />);
    expect(html).toContain('name="nom"');
    expect(html).toContain('name="entreprise"');
    expect(html).not.toContain('name="etape"');
    expect(html).not.toContain('name="relance"');
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
});
