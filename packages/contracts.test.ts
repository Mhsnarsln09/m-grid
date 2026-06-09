import { describe, expect, expectTypeOf, it } from "vitest";
import { createGrid, type ColumnDef, type GetRowId } from "@m-grid/core";
import { createDomAdapter } from "@m-grid/dom";
import { createVueGridContract } from "@m-grid/vue";
import themePackage from "./theme-default/package.json" with { type: "json" };

interface PackageRow {
  readonly id: string;
  readonly label: string;
}

const columns = [{ accessorKey: "label" }] satisfies readonly ColumnDef<PackageRow>[];
const getRowId: GetRowId<PackageRow> = (row) => row.id;

describe("package contract smoke tests", () => {
  it("links core to dom without rendering", () => {
    const api = createGrid({ columns, getRowId });
    const dom = createDomAdapter({ api });

    expect(dom.getState().version).toBe(1);
    expect("emit" in api).toBe(false);
  });

  it("links the minimal Vue adapter contract without exposing rendering", () => {
    const vue = createVueGridContract({ columns, getRowId, adapterName: "vue" });

    expect(vue.api.getState().version).toBe(1);
    expect(vue.dom.api).toBe(vue.api);
  });

  it("keeps public TypeScript inference for row data", () => {
    expectTypeOf(getRowId).toMatchTypeOf<GetRowId<PackageRow>>();
    expectTypeOf(columns).toMatchTypeOf<readonly ColumnDef<PackageRow>[]>();
  });

  it("declares optional CSS package side effects and CSS exports", () => {
    expect(themePackage.sideEffects).toContain("**/*.css");
    expect(themePackage.exports).toHaveProperty("./base.css");
    expect(themePackage.exports).toHaveProperty("./light.css");
  });
});
