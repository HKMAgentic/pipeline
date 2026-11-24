import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContactCard } from "@/presentation/contacts/contact-card";
import { demoContacts } from "@/presentation/contacts/demo-contacts";

describe("carte de contact", () => {
  it("affiche le nom, l'étape et le tampon de relance lisible", () => {
    const html = renderToStaticMarkup(<ContactCard contact={demoContacts[0]} />);
    expect(html).toContain("Hugo Bernard");
    expect(html).toContain("Contacté");
    expect(html).toContain('aria-label="Relance en retard de 4 jours, prévue le vendredi 20 novembre"');
  });
});
