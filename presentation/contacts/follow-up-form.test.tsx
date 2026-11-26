import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FollowUpForm } from "@/presentation/contacts/follow-up-form";

const fakeAction = async () => ({ error: null });

describe("formulaire de changement de relance", () => {
  it("vide quand il n'y a pas de relance", () => {
    const html = renderToStaticMarkup(<FollowUpForm contactId="a" date={null} action={fakeAction} />);
    expect(html).toContain('name="relance"');
    expect(html).not.toMatch(/name="relance"[^>]*value="/);
  });

  it("affiche le message quand la date n'existe pas", () => {
    const html = renderToStaticMarkup(
      <FollowUpForm contactId="a" date={null} action={fakeAction} initialState={{ error: "invalid_date" }} />,
    );
    expect(html).toContain("Cette date n’existe pas. Choisissez un jour du calendrier.");
    expect(html).toContain('aria-invalid="true"');
  });
});
