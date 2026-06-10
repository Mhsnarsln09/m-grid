import { describe, expect, it } from "vitest";
import { createGrid, type ColumnDef } from "@m-grid/core";
import { mountStaticGrid, renderStaticGridHtml } from "./index.js";

interface TestRow {
  readonly id: string;
  readonly label: string;
  readonly amount: number;
}

const columns = [
  { accessorKey: "label", header: "Label" },
  { id: "amount", header: "Amount", accessorFn: (row: TestRow) => row.amount },
] satisfies readonly ColumnDef<TestRow>[];

describe("@m-grid/dom static rendering", () => {
  it("renders a static grid shell from core state", () => {
    const api = createGrid({
      columns,
      rows: [{ id: "row-1", label: "Alpha", amount: 12 }],
      getRowId: (row) => row.id,
    });

    const html = renderStaticGridHtml({ api, columns, caption: "Orders" });

    expect(html).toContain('role="grid"');
    expect(html).toContain('aria-label="Orders"');
    expect(html).toContain('aria-rowcount="1"');
    expect(html).toContain('aria-colcount="2"');
    expect(html).toContain("Orders");
    expect(html).toContain("Alpha");
    expect(html).toContain("12");
  });

  it("escapes cell values instead of rendering raw HTML", () => {
    const api = createGrid({
      columns,
      rows: [{ id: "row-1", label: "<script>bad()</script>", amount: 1 }],
      getRowId: (row) => row.id,
    });

    const html = renderStaticGridHtml({ api, columns });

    expect(html).toContain("&lt;script&gt;bad()&lt;/script&gt;");
    expect(html).not.toContain("<script>bad()</script>");
  });

  it("keeps the static HTML output stable", () => {
    const api = createGrid({
      columns,
      rows: [
        { id: "row-1", label: "Alpha", amount: 12 },
        { id: "row-2", label: "Beta & Co", amount: 34 },
      ],
      getRowId: (row) => row.id,
    });

    const html = renderStaticGridHtml({ api, columns, caption: "Orders" });

    expect(html).toMatchInlineSnapshot(`
      "<div class="m-grid-root" data-density="comfortable" data-theme="light">
      <div class="m-grid-caption">Orders</div>
      <div class="m-grid-surface" role="grid" aria-label="Orders" aria-rowcount="2" aria-colcount="2" style="--m-grid-column-count: 2;">
      <div class="m-grid-header-row" role="row"><div class="m-grid-header-cell" role="columnheader" data-column-id="label">Label</div><div class="m-grid-header-cell" role="columnheader" data-column-id="amount">Amount</div></div>
      <div class="m-grid-row" role="row" data-row-id="row-1"><div class="m-grid-cell" role="gridcell" data-column-id="label">Alpha</div><div class="m-grid-cell" role="gridcell" data-column-id="amount">12</div></div><div class="m-grid-row" role="row" data-row-id="row-2"><div class="m-grid-cell" role="gridcell" data-column-id="label">Beta &amp; Co</div><div class="m-grid-cell" role="gridcell" data-column-id="amount">34</div></div>
      </div>
      </div>"
    `);
  });

  it("mounts, re-renders on state changes and unmounts static HTML", () => {
    const api = createGrid({
      columns,
      rows: [{ id: "row-1", label: "Alpha", amount: 12 }],
      getRowId: (row) => row.id,
    });
    const container = { innerHTML: "" };

    const mount = mountStaticGrid({ api, columns, caption: "Orders", container });

    expect(container.innerHTML).toContain("Alpha");

    api.dispatch({
      type: "rows.replace",
      rows: [{ id: "row-2", label: "Beta", amount: 34 }],
    });

    expect(container.innerHTML).toContain("Beta");
    expect(container.innerHTML).not.toContain("Alpha");

    mount.unmount();

    expect(container.innerHTML).toBe("");

    api.dispatch({
      type: "rows.replace",
      rows: [{ id: "row-3", label: "Gamma", amount: 56 }],
    });

    expect(container.innerHTML).toBe("");
  });
});
