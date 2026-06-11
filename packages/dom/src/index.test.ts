import { describe, expect, it } from "vitest";
import { createGrid, type ColumnDef } from "@m-grid/core";
import { mountStaticGrid, renderStaticGridHtml, selectStaticGridRow } from "./index.js";

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
    expect(html).toContain('aria-busy="false"');
    expect(html).toContain('data-loading-status="idle"');
    expect(html).toContain('aria-rowindex="1"');
    expect(html).toContain('aria-colindex="2"');
    expect(html).toContain('data-row-index="0"');
    expect(html).toContain('data-column-index="1"');
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

  it("renders density and theme data attributes", () => {
    const api = createGrid({
      columns,
      rows: [{ id: "row-1", label: "Alpha", amount: 12 }],
      getRowId: (row) => row.id,
    });

    const html = renderStaticGridHtml({
      api,
      columns,
      density: "compact",
      theme: 'custom"theme',
    });

    expect(html).toContain('data-density="compact"');
    expect(html).toContain('data-theme="custom&quot;theme"');
  });

  it("renders loading state metadata", () => {
    const api = createGrid({
      columns,
      rows: [{ id: "row-1", label: "Alpha", amount: 12 }],
      getRowId: (row) => row.id,
    });

    api.dispatch({
      type: "data.request.start",
      requestId: "request-1",
      queryKey: "orders",
    });

    const html = renderStaticGridHtml({ api, columns });

    expect(html).toContain('data-loading-status="loading"');
    expect(html).toContain('aria-busy="true"');
  });

  it("renders selected row metadata from core selection state", () => {
    const api = createGrid({
      columns,
      rows: [
        { id: "row-1", label: "Alpha", amount: 12 },
        { id: "row-2", label: "Beta", amount: 34 },
      ],
      getRowId: (row) => row.id,
      initialState: { selection: { rowIds: new Set(["row-2"]) } },
    });

    const html = renderStaticGridHtml({ api, columns });

    expect(html).toContain(
      'aria-selected="true" data-selected="true" data-row-id="row-2"'
    );
    expect(html).not.toContain('data-selected="true" data-row-id="row-1"');
  });

  it("selects one row through the static selection helper", () => {
    const api = createGrid({
      columns,
      rows: [
        { id: "row-1", label: "Alpha", amount: 12 },
        { id: "row-2", label: "Beta", amount: 34 },
      ],
      getRowId: (row) => row.id,
    });

    selectStaticGridRow(api, "row-2");

    expect([...api.getState().selection.rowIds]).toEqual(["row-2"]);
  });

  it("honors core column order state", () => {
    const api = createGrid({
      columns,
      rows: [{ id: "row-1", label: "Alpha", amount: 12 }],
      getRowId: (row) => row.id,
      initialState: { columns: { order: ["amount", "label"] } },
    });

    const html = renderStaticGridHtml({ api, columns });

    expect(html.indexOf("Amount")).toBeLessThan(html.indexOf("Label"));
    expect(html.indexOf(">12<")).toBeLessThan(html.indexOf(">Alpha<"));
  });

  it("keeps provided columns when core column order omits them", () => {
    const api = createGrid({
      columns,
      rows: [{ id: "row-1", label: "Alpha", amount: 12 }],
      getRowId: (row) => row.id,
      initialState: { columns: { order: ["amount"] } },
    });

    const html = renderStaticGridHtml({ api, columns });

    expect(html).toContain("Amount");
    expect(html).toContain("Label");
    expect(html.indexOf("Amount")).toBeLessThan(html.indexOf("Label"));
  });

  it("ignores duplicate ids in core column order state", () => {
    const api = createGrid({
      columns,
      rows: [{ id: "row-1", label: "Alpha", amount: 12 }],
      getRowId: (row) => row.id,
      initialState: { columns: { order: ["amount", "amount", "label"] } },
    });

    const html = renderStaticGridHtml({ api, columns });

    expect(html.match(/data-column-id="amount"/g)).toHaveLength(2);
  });

  it("applies escaped static class hooks", () => {
    const api = createGrid({
      columns,
      rows: [{ id: "row-1", label: "Alpha", amount: 12 }],
      getRowId: (row) => row.id,
      initialState: { selection: { rowIds: new Set(["row-1"]) } },
    });

    const html = renderStaticGridHtml({
      api,
      columns,
      rootClassName: "custom-root",
      getHeaderCellClassName: ({ columnId }) => `header-${columnId}`,
      getRowClassName: ({ rowId, selected }) =>
        selected ? `row-${rowId}-selected` : `row-${rowId}`,
      getCellClassName: ({ columnId, selected, value }) =>
        columnId === "label" && selected
          ? `cell-${String(value).toLowerCase()}-selected"`
          : undefined,
    });

    expect(html).toContain('class="m-grid-root custom-root"');
    expect(html).toContain('class="m-grid-header-cell header-label"');
    expect(html).toContain('class="m-grid-row row-row-1-selected"');
    expect(html).toContain('class="m-grid-cell cell-alpha-selected&quot;"');
  });

  it("renders an escaped empty message outside the grid surface", () => {
    const api = createGrid<TestRow>({
      columns,
      rows: [],
      getRowId: (row) => row.id,
    });

    const html = renderStaticGridHtml({
      api,
      columns,
      emptyMessage: "No <orders>",
    });

    expect(html).toContain('<div class="m-grid-empty" role="status">No &lt;orders&gt;</div>');
    expect(html).toContain('aria-rowcount="0"');
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
      "<div class="m-grid-root" data-density="comfortable" data-theme="light" data-loading-status="idle">
      <div class="m-grid-caption">Orders</div>
      <div class="m-grid-surface" role="grid" aria-label="Orders" aria-busy="false" aria-rowcount="2" aria-colcount="2" style="--m-grid-column-count: 2;">
      <div class="m-grid-header-row" role="row"><div class="m-grid-header-cell" role="columnheader" aria-colindex="1" data-column-index="0" data-column-id="label">Label</div><div class="m-grid-header-cell" role="columnheader" aria-colindex="2" data-column-index="1" data-column-id="amount">Amount</div></div>
      <div class="m-grid-row" role="row" aria-rowindex="1" data-row-index="0" data-row-id="row-1"><div class="m-grid-cell" role="gridcell" aria-colindex="1" data-column-index="0" data-column-id="label">Alpha</div><div class="m-grid-cell" role="gridcell" aria-colindex="2" data-column-index="1" data-column-id="amount">12</div></div><div class="m-grid-row" role="row" aria-rowindex="2" data-row-index="1" data-row-id="row-2"><div class="m-grid-cell" role="gridcell" aria-colindex="1" data-column-index="0" data-column-id="label">Beta &amp; Co</div><div class="m-grid-cell" role="gridcell" aria-colindex="2" data-column-index="1" data-column-id="amount">34</div></div>
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

  it("auto-renders once for multi-slice transactions", () => {
    const api = createGrid({
      columns,
      rows: [{ id: "row-1", label: "Alpha", amount: 12 }],
      getRowId: (row) => row.id,
    });
    let renderCount = 0;
    let html = "";
    const container = {
      get innerHTML() {
        return html;
      },
      set innerHTML(value: string) {
        renderCount += 1;
        html = value;
      },
    };

    mountStaticGrid({ api, columns, container });
    api.dispatch({
      type: "data.request.start",
      requestId: "request-1",
      queryKey: "orders",
    });
    api.dispatch({
      type: "data.request.success",
      requestId: "request-1",
      queryKey: "orders",
      rows: [{ id: "row-2", label: "Beta", amount: 34 }],
    });

    expect(renderCount).toBe(3);
    expect(container.innerHTML).toContain("Beta");
  });

  it("rejects missing mount containers with a predictable English error", () => {
    const api = createGrid({
      columns,
      rows: [{ id: "row-1", label: "Alpha", amount: 12 }],
      getRowId: (row) => row.id,
    });

    expect(() =>
      mountStaticGrid({
        api,
        columns,
        container: null as unknown as { innerHTML: string },
      })
    ).toThrow("[MGRID-DOM-002] Static grid mount container is required.");
  });

  it("rejects empty static column lists with a predictable English error", () => {
    const api = createGrid<TestRow>({
      columns: [],
      rows: [{ id: "row-1", label: "Alpha", amount: 12 }],
      getRowId: (row) => row.id,
    });

    expect(() => renderStaticGridHtml({ api, columns: [] })).toThrow(
      "[MGRID-DOM-003] At least one column is required for DOM rendering."
    );
  });
});
