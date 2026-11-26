import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DeleteContact } from "@/presentation/contacts/delete-contact";

const fakeAction = async () => ({ error: null });
const camille = { id: "c", name: "Camille Roux" };

describe("supprimer un contact", () => {
  it("fermé : seulement le bouton « Supprimer »", () => {
    const html = renderToStaticMarkup(<DeleteContact contact={camille} action={fakeAction} />);
    expect(html).toContain(">Supprimer<");
    expect(html).not.toContain("Confirmer la suppression");
  });

  it("ouvert : demande de confirmation, « Confirmer la suppression » et « Annuler »", () => {
    const html = renderToStaticMarkup(<DeleteContact contact={camille} action={fakeAction} initialOpen />);
    expect(html).toContain("Supprimer Camille Roux ?");
    expect(html).toContain("Cette action est définitive.");
    expect(html).toContain("Confirmer la suppression");
    expect(html).toContain('name="id"');
    expect(html).toContain('value="c"');
  });

  it("« Annuler » n'envoie pas le formulaire", () => {
    const html = renderToStaticMarkup(<DeleteContact contact={camille} action={fakeAction} initialOpen />);
    expect(html).toMatch(/type="button"[^>]*>Annuler</);
    expect(html).toMatch(/type="submit"[^>]*>Confirmer la suppression</);
  });
});
