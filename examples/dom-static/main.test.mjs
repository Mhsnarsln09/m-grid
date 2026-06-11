import { describe, expect, it } from "vitest";
import { setupStaticDemo } from "./main.mjs";

describe("static DOM demo", () => {
  it("updates rows, button text and status when refreshed", () => {
    const elements = {
      "#app": createApp(),
      "#refresh-rows": createButton(),
      "#select-next-row": createButton(),
      "#swap-columns": createButton(),
      "#refresh-status": {
        textContent: "Showing initial rows; Grace Hopper selected",
      },
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
    expect(elements["#refresh-status"].textContent).toBe(
      "Showing refreshed rows; Mary Jackson selected"
    );

    elements["#refresh-rows"].click();

    expect(elements["#app"].innerHTML).toContain("Ada Lovelace");
    expect(elements["#app"].innerHTML).toContain(
      'aria-selected="true" data-selected="true" data-row-id="order-1002"'
    );
    expect(elements["#refresh-rows"].textContent).toBe("Refresh rows");
    expect(elements["#refresh-status"].textContent).toBe(
      "Showing initial rows; Grace Hopper selected"
    );

    elements["#select-next-row"].click();

    expect(elements["#app"].innerHTML).toContain(
      'aria-selected="true" data-selected="true" data-row-id="order-1003"'
    );
    expect(elements["#refresh-status"].textContent).toBe(
      "Showing initial rows; Katherine Johnson selected"
    );

    elements["#app"].clickRow("order-1001");

    expect(elements["#app"].innerHTML).toContain(
      'aria-selected="true" data-selected="true" data-row-id="order-1001"'
    );
    expect(elements["#refresh-status"].textContent).toBe(
      "Showing initial rows; Ada Lovelace selected"
    );

    elements["#swap-columns"].click();

    expect(elements["#app"].innerHTML.indexOf("Total")).toBeLessThan(
      elements["#app"].innerHTML.indexOf("Customer")
    );
    expect(elements["#swap-columns"].textContent).toBe("Show customer first");
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
    expect(() => setupStaticDemo(createDocumentWithout("#select-next-row"))).toThrow(
      "[MGRID-DEMO-004] Demo select next button was not found."
    );
    expect(() => setupStaticDemo(createDocumentWithout("#swap-columns"))).toThrow(
      "[MGRID-DEMO-005] Demo swap columns button was not found."
    );
  });
});

function createDocumentWithout(missingSelector) {
  const elements = {
    "#app": createApp(),
    "#refresh-rows": createButton(),
    "#select-next-row": createButton(),
    "#swap-columns": createButton(),
    "#refresh-status": {
      textContent: "Showing initial rows; Grace Hopper selected",
    },
  };
  return {
    querySelector(selector) {
      if (selector === missingSelector) return null;
      return elements[selector] ?? null;
    },
  };
}

function createApp() {
  let listener = () => undefined;
  return {
    innerHTML: "",
    addEventListener(type, callback) {
      if (type === "click") listener = callback;
    },
    clickRow(rowId) {
      listener({ target: createRowTarget(rowId) });
    },
  };
}

function createRowTarget(rowId) {
  return {
    getAttribute(name) {
      return name === "data-row-id" ? rowId : null;
    },
    closest(selector) {
      return selector === "[data-row-id]" ? this : null;
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
