import { describe, expect, it } from "vitest";
import { createGrid, type ColumnDef } from "@m-grid/core";
import { renderStaticGridHtml } from "./index.js";

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
});
