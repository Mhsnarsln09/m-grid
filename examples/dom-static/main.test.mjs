import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { setupStaticDemo } from "./main.mjs";

describe("static DOM demo", () => {
  it("maps workspace package imports for direct browser serving", () => {
    const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");

    expect(html).toContain('"@m-grid/core": "../../packages/core/dist/index.js"');
    expect(html).toContain('"@m-grid/dom": "../../packages/dom/dist/index.js"');
  });

  it("updates rows, button text and status when refreshed", () => {
    const elements = {
      "#app": createApp(),
      "#refresh-rows": createButton(),
      "#select-next-row": createButton(),
      "#swap-columns": createButton(),
      "#toggle-total-column": createButton("Hide total"),
      "#resize-total-column": createButton("Resize total"),
      "#sort-total": createButton("Sort total"),
      "#filter-ready": createButton("Filter ready"),
      "#page-size-one": createButton("Page size 1"),
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
      "Showing refreshed rows; Mary Jackson selected; 3 of 3 processed rows"
    );

    elements["#refresh-rows"].click();

    expect(elements["#app"].innerHTML).toContain("Ada Lovelace");
    expect(elements["#app"].innerHTML).toContain(
      'aria-selected="true" data-selected="true" data-row-id="order-1002"'
    );
    expect(elements["#refresh-rows"].textContent).toBe("Refresh rows");
    expect(elements["#refresh-status"].textContent).toBe(
      "Showing initial rows; Grace Hopper selected; 3 of 3 processed rows"
    );

    elements["#select-next-row"].click();

    expect(elements["#app"].innerHTML).toContain(
      'aria-selected="true" data-selected="true" data-row-id="order-1003"'
    );
    expect(elements["#refresh-status"].textContent).toBe(
      "Showing initial rows; Katherine Johnson selected; 3 of 3 processed rows"
    );

    elements["#app"].clickRow("order-1001");

    expect(elements["#app"].innerHTML).toContain(
      'aria-selected="true" data-selected="true" data-row-id="order-1001"'
    );
    expect(elements["#refresh-status"].textContent).toBe(
      "Showing initial rows; Ada Lovelace selected; 3 of 3 processed rows"
    );

    elements["#swap-columns"].click();

    expect(elements["#app"].innerHTML.indexOf("Total")).toBeLessThan(
      elements["#app"].innerHTML.indexOf("Customer")
    );
    expect(elements["#swap-columns"].textContent).toBe("Show customer first");

    elements["#resize-total-column"].click();

    expect(elements["#app"].innerHTML).toContain(
      "--m-grid-column-template: 180px minmax(0, 1fr) minmax(0, 1fr);"
    );
    expect(elements["#resize-total-column"].textContent).toBe("Reset total width");

    elements["#toggle-total-column"].click();

    expect(elements["#app"].innerHTML).not.toContain("Total");
    expect(elements["#toggle-total-column"].textContent).toBe("Show total");

    elements["#sort-total"].click();

    expect(elements["#app"].innerHTML.indexOf("Katherine Johnson")).toBeLessThan(
      elements["#app"].innerHTML.indexOf("Ada Lovelace")
    );
    expect(elements["#sort-total"].textContent).toBe("Clear total sort");

    elements["#filter-ready"].click();

    expect(elements["#app"].innerHTML).toContain("Ada Lovelace");
    expect(elements["#app"].innerHTML).not.toContain("Grace Hopper");
    expect(elements["#filter-ready"].textContent).toBe("Clear ready filter");

    elements["#page-size-one"].click();

    expect(elements["#app"].innerHTML).toContain('aria-rowcount="1"');
    expect(elements["#page-size-one"].textContent).toBe("Show all rows");
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
    expect(() =>
      setupStaticDemo(createDocumentWithout("#toggle-total-column"))
    ).toThrow("[MGRID-DEMO-006] Demo toggle total column button was not found.");
    expect(() =>
      setupStaticDemo(createDocumentWithout("#resize-total-column"))
    ).toThrow("[MGRID-DEMO-007] Demo resize total column button was not found.");
    expect(() => setupStaticDemo(createDocumentWithout("#sort-total"))).toThrow(
      "[MGRID-DEMO-008] Demo sort total button was not found."
    );
    expect(() => setupStaticDemo(createDocumentWithout("#filter-ready"))).toThrow(
      "[MGRID-DEMO-009] Demo filter ready button was not found."
    );
    expect(() => setupStaticDemo(createDocumentWithout("#page-size-one"))).toThrow(
      "[MGRID-DEMO-010] Demo page size one button was not found."
    );
  });
});

function createDocumentWithout(missingSelector) {
  const elements = {
    "#app": createApp(),
    "#refresh-rows": createButton(),
    "#select-next-row": createButton(),
    "#swap-columns": createButton(),
    "#toggle-total-column": createButton("Hide total"),
    "#resize-total-column": createButton("Resize total"),
    "#sort-total": createButton("Sort total"),
    "#filter-ready": createButton("Filter ready"),
    "#page-size-one": createButton("Page size 1"),
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

function createButton(textContent = "Refresh rows") {
  let listener = () => undefined;
  return {
    textContent,
    addEventListener(type, callback) {
      if (type === "click") listener = callback;
    },
    click() {
      listener();
    },
  };
}
