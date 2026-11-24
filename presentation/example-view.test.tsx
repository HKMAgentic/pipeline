import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ExampleView } from "@/presentation/example-view";

describe("couche présentation", () => {
  it("affiche une liste", () => {
    const html = renderToStaticMarkup(<ExampleView items={[]} />);
    expect(html).toBe("<ul></ul>");
  });
});
