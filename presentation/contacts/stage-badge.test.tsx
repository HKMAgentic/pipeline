import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StageBadge } from "@/presentation/contacts/stage-badge";

describe("étiquette d'étape", () => {
  it.each(["À contacter", "Contacté"] as const)("« %s » est en kraft", (stage) => {
    const html = renderToStaticMarkup(<StageBadge stage={stage} />);
    expect(html).toContain("bg-kraft");
    expect(html).not.toContain("bg-secondary");
    expect(html).toContain(stage);
  });

  it.each(["Échange", "Proposition", "Signé"] as const)("« %s » est en bleu", (stage) => {
    const html = renderToStaticMarkup(<StageBadge stage={stage} />);
    expect(html).toContain("bg-secondary");
    expect(html).not.toContain("bg-kraft");
  });
});
