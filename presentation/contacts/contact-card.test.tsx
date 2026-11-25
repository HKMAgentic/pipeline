import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContactCard } from "@/presentation/contacts/contact-card";

describe("carte de contact", () => {
  it("affiche le nom, l'entreprise et l'étape", () => {
    const html = renderToStaticMarkup(
      <ContactCard contact={{ id: "a", name: "Hugo Bernard", company: "Studio Lumen", stage: "Contacté" }} />,
    );
    expect(html).toContain("Hugo Bernard");
    expect(html).toContain("Studio Lumen");
    expect(html).toContain("Contacté");
  });

  it("ne montre pas encore les boutons des lots suivants", () => {
    const html = renderToStaticMarkup(
      <ContactCard contact={{ id: "a", name: "Hugo Bernard", company: "Studio Lumen", stage: "Contacté" }} />,
    );
    expect(html).not.toContain("Relancer");
    expect(html).not.toContain("Étape suivante");
  });
});
