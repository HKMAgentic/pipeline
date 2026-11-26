import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContactList } from "@/presentation/contacts/contact-list";

const fakeAction = async () => ({ error: null });

describe("liste des contacts", () => {
  it("affiche la carte de Camille Roux avec l'étape « À contacter »", () => {
    const html = renderToStaticMarkup(
      <ContactList
        contacts={[{ id: "a", name: "Camille Roux", company: "Atelier Roux", stage: "À contacter", followUp: null }]}
        setFollowUpAction={fakeAction}
      />,
    );
    expect(html).toContain("Camille Roux");
    expect(html).toContain("Atelier Roux");
    expect(html).toContain("À contacter");
    expect(html).not.toContain("Aucun contact pour l’instant");
  });

  it("affiche « Aucun contact pour l'instant » quand la liste est vide", () => {
    const html = renderToStaticMarkup(<ContactList contacts={[]} setFollowUpAction={fakeAction} />);
    expect(html).toContain("Aucun contact pour l’instant");
  });
});
