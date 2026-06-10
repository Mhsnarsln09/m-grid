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
    expect(elements["#app"].innerHTML).toContain(
      'aria-selected="true" data-selected="true" data-row-id="order-1002"'
    );

    elements["#refresh-rows"].click();

    expect(elements["#app"].innerHTML).toContain("Dorothy Vaughan");
    expect(elements["#app"].innerHTML).toContain(
      'aria-selected="true" data-selected="true" data-row-id="order-2002"'
    );
    expect(elements["#refresh-rows"].textContent).toBe("Show initial rows");
    expect(elements["#refresh-status"].textContent).toBe("Showing refreshed rows");

    elements["#refresh-rows"].click();

    expect(elements["#app"].innerHTML).toContain("Ada Lovelace");
    expect(elements["#app"].innerHTML).toContain(
      'aria-selected="true" data-selected="true" data-row-id="order-1002"'
    );
    expect(elements["#refresh-rows"].textContent).toBe("Refresh rows");
    expect(elements["#refresh-status"].textContent).toBe("Showing initial rows");
  });

  it("fails predictably when required demo nodes are missing", () => {
    expect(() => setupStaticDemo(createDocumentWithout("#app"))).toThrow(
      "[MGRID-DEMO-001] Demo mount target was not found."
    );
    expect(() => setupStaticDemo(createDocumentWithout("#refresh-rows"))).toThrow(
      "[MGRID-DEMO-002] Demo refresh button was not found."
    );
    expect(() => setupStaticDemo(createDocumentWithout("#refresh-status"))).toThrow(
      "[MGRID-DEMO-003] Demo refresh status was not found."
    );
  });
});

function createDocumentWithout(missingSelector) {
  const elements = {
    "#app": { innerHTML: "" },
    "#refresh-rows": createButton(),
    "#refresh-status": { textContent: "Showing initial rows" },
  };
  return {
    querySelector(selector) {
      if (selector === missingSelector) return null;
      return elements[selector] ?? null;
    },
  };
}

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
