import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { fakeActions } from "@/presentation/contacts/fake-actions";
import { StageControls } from "@/presentation/contacts/stage-controls";

describe("contrôles d'étape", () => {
  it("à « Contacté », propose « Étape suivante »", () => {
    const html = renderToStaticMarkup(<StageControls contactId="a" stage="Contacté" actions={fakeActions} />);
    expect(html).toContain("Étape suivante");
    expect(html).toContain('name="id"');
  });

  it("à « Signé », ne propose pas « Étape suivante »", () => {
    const html = renderToStaticMarkup(<StageControls contactId="a" stage="Signé" actions={fakeActions} />);
    expect(html).not.toContain("Étape suivante");
  });

  it("propose la liste des étapes, sur l'étape actuelle", () => {
    const html = renderToStaticMarkup(<StageControls contactId="a" stage="Proposition" actions={fakeActions} />);
    expect(html).toContain("Changer d’étape");
    expect(html).toMatch(/name="etape"[^>]*value="Proposition"|value="Proposition"[^>]*name="etape"/);
  });

  it("affiche un message quand l'étape n'a pas pu être changée", () => {
    const html = renderToStaticMarkup(
      <StageControls contactId="a" stage="Signé" actions={fakeActions} initialState={{ error: "last_stage" }} />,
    );
    expect(html).toContain("Ce contact est déjà à la dernière étape.");
  });
});
