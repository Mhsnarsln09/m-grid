import { describe, expect, it } from "vitest";
import { setupStaticDemo } from "./main.mjs";

describe("static DOM demo", () => {
  it("updates rows, button text and status when refreshed", () => {
    const elements = {
      "#app": { innerHTML: "" },
      "#refresh-rows": createButton(),
      "#refresh-status": { textContent: "Showing initial rows" },
    };
    const documentRef = {
      querySelector(selector) {
        return elements[selector] ?? null;
      },
    };

    setupStaticDemo(documentRef);

    expect(elements["#app"].innerHTML).toContain("Ada Lovelace");

    elements["#refresh-rows"].click();

    expect(elements["#app"].innerHTML).toContain("Dorothy Vaughan");
    expect(elements["#refresh-rows"].textContent).toBe("Show initial rows");
    expect(elements["#refresh-status"].textContent).toBe("Showing refreshed rows");

    elements["#refresh-rows"].click();

    expect(elements["#app"].innerHTML).toContain("Ada Lovelace");
    expect(elements["#refresh-rows"].textContent).toBe("Refresh rows");
    expect(elements["#refresh-status"].textContent).toBe("Showing initial rows");
  });
});

function createButton() {
  let listener = () => undefined;
  return {
    textContent: "Refresh rows",
    addEventListener(type, callback) {
      if (type === "click") listener = callback;
    },
    click() {
      listener();
    },
  };
}
