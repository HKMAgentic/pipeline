import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { EditContact } from "@/presentation/contacts/edit-contact";

const fakeAction = async () => ({ error: null });
const camille = { id: "c", name: "Camille Roux", company: "Atelier Roux" };

describe("corriger un contact", () => {
  it("fermé : seulement le bouton « Modifier »", () => {
    const html = renderToStaticMarkup(<EditContact contact={camille} action={fakeAction} />);
    expect(html).toContain(">Modifier<");
    expect(html).not.toContain('name="nom"');
  });

  it("ouvert : nom et entreprise préremplis, « Enregistrer » et « Annuler »", () => {
    const html = renderToStaticMarkup(<EditContact contact={camille} action={fakeAction} initialOpen />);
    expect(html).toContain('value="Camille Roux"');
    expect(html).toContain('value="Atelier Roux"');
    expect(html).toContain('name="nom"');
    expect(html).toContain('name="entreprise"');
    expect(html).toContain('name="id"');
    expect(html).toContain(">Enregistrer<");
    expect(html).toContain(">Annuler<");
  });

  it("nom vidé : « Le nom est obligatoire. » et la saisie reste", () => {
    const html = renderToStaticMarkup(
      <EditContact
        contact={camille}
        action={fakeAction}
        initialOpen
        initialState={{ error: "name_required", values: { name: "", company: "Atelier Roux & fils" } }}
      />,
    );
    expect(html).toContain("Le nom est obligatoire.");
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('value="Atelier Roux &amp; fils"');
  });
});
