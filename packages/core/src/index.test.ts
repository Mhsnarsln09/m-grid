import { describe, expect, expectTypeOf, it } from "vitest";
import {
  createDataCoordinator,
  createGrid,
  getProcessedRows,
  getVisibleColumns,
  type AccessorFnColumnDef,
  type AccessorKeyColumnDef,
  type ColumnDef,
  type ColumnValue,
  type GetRowId,
  type GridDataSource,
} from "./index.js";

interface TestRow {
  readonly id: string;
  readonly name: string;
  readonly value: number;
}

const columns = [
  { accessorKey: "name", header: "Name" },
  { id: "score", accessorFn: (row: TestRow) => row.value },
] satisfies readonly ColumnDef<TestRow, unknown>[];

const getRowId: GetRowId<TestRow> = (row) => row.id;

describe("@m-grid/core contract", () => {
  it("keeps row identity stable after row reordering", () => {
    const rows = [
      { id: "a", name: "Alpha", value: 1 },
      { id: "b", name: "Beta", value: 2 },
    ];
    const grid = createGrid({ columns, rows, getRowId });

    grid.dispatch({ type: "rows.replace", rows: [rows[1]!, rows[0]!] });

    expect(grid.getState().rows.rowIds).toEqual(["b", "a"]);
  });

  it("rejects duplicate row ids with a predictable English error", () => {
    expect(() =>
      createGrid({
        columns,
        getRowId,
        rows: [
          { id: "same", name: "First", value: 1 },
          { id: "same", name: "Second", value: 2 },
        ],
      })
    ).toThrow("[MGRID-ROW-002] Duplicate row id detected.");
  });

  it("rejects empty row ids with a predictable English error", () => {
    expect(() =>
      createGrid({
        columns,
        getRowId: () => "",
        rows: [{ id: "", name: "Empty", value: 0 }],
      })
    ).toThrow("[MGRID-ROW-001] Row id must not be empty.");
  });

  it("validates provided initial row state", () => {
    expect(() =>
      createGrid({
        columns,
        getRowId,
        initialState: {
          rows: {
            rows: [{ id: "a", name: "Alpha", value: 1 }],
            rowIds: [],
          },
        },
      })
    ).toThrow("[MGRID-ROW-003] Row ids length must match rows length.");
    expect(() =>
      createGrid({
        columns,
        getRowId,
        initialState: {
          rows: {
            rows: [
              { id: "a", name: "Alpha", value: 1 },
              { id: "b", name: "Beta", value: 2 },
            ],
            rowIds: ["same", "same"],
          },
        },
      })
    ).toThrow("[MGRID-ROW-002] Duplicate row id detected.");
  });

  it("validates provided initial selection state", () => {
    expect(() =>
      createGrid({
        columns,
        getRowId,
        initialState: { selection: { rowIds: new Set([""]) } },
      })
    ).toThrow("[MGRID-ROW-001] Row id must not be empty.");
  });

  it("dispatches commands through reducer events and subscribers", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });
    const received: string[] = [];

    grid.subscribe((event) => {
      received.push(`${event.type}:${event.type === "state.change" ? event.slice : ""}`);
    });

    const events = grid.dispatch({
      type: "rows.replace",
      rows: [{ id: "r1", name: "Ready", value: 1 }],
    });

    expect(events).toHaveLength(1);
    expect(events[0]?.transactionId).toBe("mgrid_tx_000001");
    expect(received).toEqual(["state.change:rows"]);
    expect(grid.getState().rows.rowIds).toEqual(["r1"]);
  });

  it("supports subscriber unsubscribe", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });
    let calls = 0;
    const unsubscribe = grid.subscribe(() => {
      calls += 1;
    });

    unsubscribe();
    grid.dispatch({ type: "rows.replace", rows: [{ id: "r1", name: "Ready", value: 1 }] });

    expect(calls).toBe(0);
  });

  it("replaces selected row ids through a command", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    const events = grid.dispatch({
      type: "selection.replace",
      rowIds: ["r1", "r2", "r2"],
    });

    expect(events).toHaveLength(1);
    expect(events[0]?.slice).toBe("selection");
    expect([...grid.getState().selection.rowIds]).toEqual(["r1", "r2"]);
  });

  it("replaces sort state through a command", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    const events = grid.dispatch({
      type: "sort.replace",
      sort: {
        items: [
          { columnId: "score", direction: "desc" },
          { columnId: "score", direction: "asc" },
          { columnId: "name", direction: "asc" },
        ],
      },
    });

    expect(events).toHaveLength(1);
    expect(events[0]?.slice).toBe("sort");
    expect(grid.getState().sort.items).toEqual([
      { columnId: "score", direction: "desc" },
      { columnId: "name", direction: "asc" },
    ]);
  });

  it("replaces filter state through a command", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    const events = grid.dispatch({
      type: "filter.replace",
      filter: {
        items: [
          { columnId: "name", operator: "contains", value: "Al" },
          { columnId: "score", operator: "gte", value: 10 },
        ],
      },
    });

    expect(events).toHaveLength(1);
    expect(events[0]?.slice).toBe("filter");
    expect(grid.getState().filter.items).toEqual([
      { columnId: "name", operator: "contains", value: "Al" },
      { columnId: "score", operator: "gte", value: 10 },
    ]);
  });

  it("replaces column order through a command", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    const events = grid.dispatch({
      type: "columns.order.replace",
      order: ["score", "name", "score"],
    });

    expect(events).toHaveLength(1);
    expect(events[0]?.slice).toBe("columns");
    expect(grid.getState().columns.order).toEqual(["score", "name"]);
  });

  it("replaces column visibility through a command", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    const events = grid.dispatch({
      type: "columns.visibility.replace",
      visibility: { score: false },
    });

    expect(events).toHaveLength(1);
    expect(events[0]?.slice).toBe("columns");
    expect(grid.getState().columns.visibility).toEqual({ score: false });
  });

  it("replaces column sizing through a command", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    const events = grid.dispatch({
      type: "columns.sizing.replace",
      sizing: { name: 180, score: 96 },
    });

    expect(events).toHaveLength(1);
    expect(events[0]?.slice).toBe("columns");
    expect(grid.getState().columns.sizing).toEqual({ name: 180, score: 96 });
  });

  it("replaces pagination through a command", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    const offsetEvents = grid.dispatch({
      type: "pagination.replace",
      pagination: { mode: "offset", pageIndex: 2, pageSize: 25 },
    });
    const cursorEvents = grid.dispatch({
      type: "pagination.replace",
      pagination: { mode: "cursor", cursor: "next", pageSize: 50 },
    });

    expect(offsetEvents).toHaveLength(1);
    expect(offsetEvents[0]?.slice).toBe("pagination");
    expect(cursorEvents).toHaveLength(1);
    expect(grid.getState().pagination).toEqual({
      mode: "cursor",
      cursor: "next",
      pageSize: 50,
    });
  });

  it("derives processed rows from filter, sort and offset pagination state", () => {
    const grid = createGrid<TestRow>({
      columns,
      getRowId,
      rows: [
        { id: "a", name: "Alpha", value: 2 },
        { id: "b", name: "Beta", value: 3 },
        { id: "c", name: "Alpine", value: 1 },
      ],
      initialState: {
        filter: { items: [{ columnId: "name", operator: "contains", value: "Al" }] },
        sort: { items: [{ columnId: "score", direction: "asc" }] },
        pagination: { mode: "offset", pageIndex: 0, pageSize: 1 },
      },
    });

    const processed = getProcessedRows(grid, columns);

    expect(processed.totalRowCount).toBe(3);
    expect(processed.filteredRowCount).toBe(2);
    expect(processed.rowIds).toEqual(["c"]);
    expect(processed.rows.map((entry) => entry.rowId)).toEqual(["c"]);
    expect(processed.rows[0]?.sourceIndex).toBe(2);
    expect(processed.pagination).toEqual({
      mode: "offset",
      pageIndex: 0,
      pageSize: 1,
      pageCount: 2,
    });
  });

  it("applies text filters case-insensitively unless requested otherwise", () => {
    const grid = createGrid<TestRow>({
      columns,
      getRowId,
      rows: [
        { id: "a", name: "Alpha", value: 1 },
        { id: "b", name: "beta", value: 2 },
      ],
      initialState: {
        filter: { items: [{ columnId: "name", operator: "contains", value: "AL" }] },
      },
    });

    expect(getProcessedRows(grid, columns).rowIds).toEqual(["a"]);

    grid.dispatch({
      type: "filter.replace",
      filter: {
        items: [
          {
            columnId: "name",
            operator: "contains",
            value: "AL",
            caseSensitive: true,
          },
        ],
      },
    });

    expect(getProcessedRows(grid, columns).rowIds).toEqual([]);
  });

  it("does not treat empty numeric filter values as zero", () => {
    const grid = createGrid<TestRow>({
      columns,
      getRowId,
      rows: [
        { id: "a", name: "Zero", value: 0 },
        { id: "b", name: "One", value: 1 },
      ],
      initialState: {
        filter: { items: [{ columnId: "score", operator: "gte", value: "" }] },
      },
    });

    expect(getProcessedRows(grid, columns).rowIds).toEqual([]);
  });

  it("rejects processed rows when required columns are not provided", () => {
    const grid = createGrid<TestRow>({
      columns,
      getRowId,
      rows: [{ id: "a", name: "Alpha", value: 1 }],
      initialState: {
        sort: { items: [{ columnId: "score", direction: "asc" }] },
      },
    });

    expect(() => getProcessedRows(grid, [columns[0]!])).toThrow(
      '[MGRID-ROWMODEL-001] Processed row column was not provided: "score".'
    );
  });

  it("rejects processed rows when sort or filter columns have no accessor", () => {
    const displayColumns = [
      ...columns,
      { id: "actions", header: "Actions" },
    ] satisfies readonly ColumnDef<TestRow>[];
    const grid = createGrid<TestRow>({
      columns: displayColumns,
      getRowId,
      rows: [{ id: "a", name: "Alpha", value: 1 }],
      initialState: {
        sort: { items: [{ columnId: "actions", direction: "asc" }] },
      },
    });

    expect(() => getProcessedRows(grid, displayColumns)).toThrow(
      '[MGRID-ROWMODEL-002] Processed row column has no value accessor: "actions".'
    );
  });

  it("keeps cursor pagination unsliced in the client processed row model", () => {
    const grid = createGrid<TestRow>({
      columns,
      getRowId,
      rows: [
        { id: "a", name: "Alpha", value: 2 },
        { id: "b", name: "Beta", value: 1 },
      ],
      initialState: {
        sort: { items: [{ columnId: "score", direction: "asc" }] },
        pagination: { mode: "cursor", cursor: "next", pageSize: 1 },
      },
    });

    const processed = getProcessedRows(grid, columns);

    expect(processed.rows.map((entry) => entry.rowId)).toEqual(["b", "a"]);
    expect(processed.pagination).toEqual({
      mode: "cursor",
      cursor: "next",
      pageSize: 1,
    });
  });

  it("sorts text values case-insensitively with numeric collation", () => {
    const grid = createGrid<TestRow>({
      columns,
      getRowId,
      rows: [
        { id: "a", name: "item 10", value: 1 },
        { id: "b", name: "Item 2", value: 2 },
        { id: "c", name: "alpha", value: 3 },
      ],
      initialState: {
        sort: { items: [{ columnId: "name", direction: "asc" }] },
      },
    });

    expect(getProcessedRows(grid, columns).rowIds).toEqual(["c", "b", "a"]);
  });

  it("derives visible columns from order, visibility and sizing state", () => {
    const grid = createGrid<TestRow>({
      columns,
      getRowId,
      initialState: {
        columns: {
          order: ["score"],
          visibility: { name: false },
          sizing: { score: 96 },
        },
      },
    });

    expect(getVisibleColumns(columns, grid.getState().columns)).toEqual([
      {
        column: columns[1],
        columnId: "score",
        sourceIndex: 1,
        visibleIndex: 0,
        width: 96,
      },
    ]);
  });

  it("rejects duplicate columns in visible column derivation", () => {
    expect(() =>
      getVisibleColumns(
        [
          { accessorKey: "name" },
          { id: "name", accessorFn: (row: TestRow) => row.value },
        ],
        { order: ["name"] }
      )
    ).toThrow('[MGRID-COL-002] Column id collision: "name" is used by multiple columns.');
  });

  it("rejects invalid column order ids with predictable English errors", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    expect(() =>
      grid.dispatch({ type: "columns.order.replace", order: [""] })
    ).toThrow("[MGRID-COL-003] Column order id must not be empty.");
    expect(() =>
      grid.dispatch({ type: "columns.order.replace", order: ["missing"] })
    ).toThrow('[MGRID-COL-004] Unknown column order id: "missing".');
  });

  it("rejects invalid column visibility ids with predictable English errors", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    expect(() =>
      grid.dispatch({ type: "columns.visibility.replace", visibility: { "": false } })
    ).toThrow("[MGRID-COL-005] Column visibility id must not be empty.");
    expect(() =>
      grid.dispatch({
        type: "columns.visibility.replace",
        visibility: { missing: false },
      })
    ).toThrow('[MGRID-COL-006] Unknown column visibility id: "missing".');
  });

  it("rejects invalid column sizing values with predictable English errors", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    expect(() =>
      grid.dispatch({ type: "columns.sizing.replace", sizing: { "": 120 } })
    ).toThrow("[MGRID-COL-008] Column sizing id must not be empty.");
    expect(() =>
      grid.dispatch({
        type: "columns.sizing.replace",
        sizing: { missing: 120 },
      })
    ).toThrow('[MGRID-COL-009] Unknown column sizing id: "missing".');
    expect(() =>
      grid.dispatch({ type: "columns.sizing.replace", sizing: { name: 0 } })
    ).toThrow("[MGRID-COL-010] Column sizing width must be positive.");
  });

  it("rejects invalid pagination state with predictable English errors", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    expect(() =>
      grid.dispatch({
        type: "pagination.replace",
        pagination: { mode: "offset", pageIndex: -1, pageSize: 25 },
      })
    ).toThrow(
      "[MGRID-PAGE-001] Offset pagination pageIndex must be a non-negative integer."
    );
    expect(() =>
      grid.dispatch({
        type: "pagination.replace",
        pagination: { mode: "offset", pageIndex: 0, pageSize: 0 },
      })
    ).toThrow(
      "[MGRID-PAGE-002] Offset pagination pageSize must be a positive integer."
    );
    expect(() =>
      grid.dispatch({
        type: "pagination.replace",
        pagination: { mode: "cursor", cursor: "", pageSize: 25 },
      })
    ).toThrow("[MGRID-PAGE-004] Cursor pagination cursor must not be empty.");
  });

  it("rejects invalid sort state with predictable English errors", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    expect(() =>
      grid.dispatch({
        type: "sort.replace",
        sort: { items: [{ columnId: "", direction: "asc" }] },
      })
    ).toThrow("[MGRID-SORT-001] Sort column id must not be empty.");
    expect(() =>
      grid.dispatch({
        type: "sort.replace",
        sort: { items: [{ columnId: "missing", direction: "asc" }] },
      })
    ).toThrow('[MGRID-SORT-002] Unknown sort column id: "missing".');
    expect(() =>
      grid.dispatch({
        type: "sort.replace",
        sort: { items: [{ columnId: "name", direction: "up" as "asc" }] },
      })
    ).toThrow("[MGRID-SORT-003] Sort direction must be asc or desc.");
  });

  it("rejects invalid filter state with predictable English errors", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    expect(() =>
      grid.dispatch({
        type: "filter.replace",
        filter: { items: [{ columnId: "", operator: "equals", value: "x" }] },
      })
    ).toThrow("[MGRID-FILTER-001] Filter column id must not be empty.");
    expect(() =>
      grid.dispatch({
        type: "filter.replace",
        filter: {
          items: [{ columnId: "missing", operator: "equals", value: "x" }],
        },
      })
    ).toThrow('[MGRID-FILTER-002] Unknown filter column id: "missing".');
    expect(() =>
      grid.dispatch({
        type: "filter.replace",
        filter: {
          items: [
            { columnId: "name", operator: "near" as "equals", value: "x" },
          ],
        },
      })
    ).toThrow("[MGRID-FILTER-003] Filter operator is not supported.");
    expect(() =>
      grid.dispatch({
        type: "filter.replace",
        filter: {
          items: [
            {
              columnId: "name",
              operator: "equals",
              value: "x",
              caseSensitive: "yes" as unknown as boolean,
            },
          ],
        },
      })
    ).toThrow("[MGRID-FILTER-004] Filter caseSensitive must be boolean.");
  });

  it("rejects empty selected row ids with a predictable English error", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    expect(() =>
      grid.dispatch({
        type: "selection.replace",
        rowIds: [""],
      })
    ).toThrow("[MGRID-ROW-001] Row id must not be empty.");
  });

  it("uses one transaction id for all state changes from one command", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    grid.dispatch({
      type: "data.request.start",
      requestId: "request-1",
      queryKey: "orders",
    });
    const events = grid.dispatch({
      type: "data.request.success",
      requestId: "request-1",
      queryKey: "orders",
      rows: [{ id: "r1", name: "Ready", value: 1 }],
    });

    expect(events.map((event) => event.slice)).toEqual(["rows", "loading"]);
    expect(new Set(events.map((event) => event.transactionId)).size).toBe(1);
  });

  it("does not consume transaction ids for no-op commands", () => {
    const grid = createGrid<TestRow>({ columns, getRowId });

    expect(
      grid.dispatch({
        type: "data.request.success",
        requestId: "stale",
        queryKey: "orders",
        rows: [],
      })
    ).toEqual([]);

    const events = grid.dispatch({
      type: "rows.replace",
      rows: [{ id: "r1", name: "Ready", value: 1 }],
    });

    expect(events[0]?.transactionId).toBe("mgrid_tx_000001");
  });

  it("preserves typed row input for column accessors and getRowId", () => {
    expectTypeOf<(typeof columns)[number]>().toMatchTypeOf<ColumnDef<TestRow, unknown>>();
    expectTypeOf<
      ColumnValue<
        { id: string; optionalValue?: number },
        AccessorKeyColumnDef<{ id: string; optionalValue?: number }, "optionalValue">
      >
    >().toEqualTypeOf<number | undefined>();
    expectTypeOf<ColumnValue<TestRow, AccessorFnColumnDef<TestRow, number>>>().toEqualTypeOf<
      number
    >();
    expectTypeOf(getRowId).toMatchTypeOf<GetRowId<TestRow>>();
  });
});

describe("@m-grid/core datasource coordinator", () => {
  it("cancels previous requests when a newer request starts", async () => {
    const seenSignals: boolean[] = [];
    const signals: boolean[] = [];
    const dataSource: GridDataSource<TestRow> = {
      async getRows(request) {
        seenSignals.push(request.signal.aborted);
        request.signal.addEventListener?.("abort", () => {
          signals.push(request.signal.aborted);
        });
        return {
          requestId: request.requestId,
          queryKey: request.queryKey,
          rows: [],
        };
      },
    };
    const grid = createGrid<TestRow>({ columns, getRowId, dataSource });
    const coordinator = createDataCoordinator(grid, dataSource);

    const first = coordinator.load("first");
    const second = coordinator.load("second");
    await Promise.all([first, second]);

    expect(seenSignals).toEqual([false, false]);
    expect(signals).toContain(true);
    expect(grid.getState().loading.status).toBe("success");
    expect(coordinator.getLatestRequest()?.queryKey).toBe("second");
  });

  it("prevents an older response from overwriting a newer accepted response", async () => {
    const resolvers = new Map<string, (rows: readonly TestRow[]) => void>();
    const dataSource: GridDataSource<TestRow> = {
      getRows(request) {
        return new Promise((resolve) => {
          resolvers.set(request.queryKey, (rows) => {
            resolve({
              requestId: request.requestId,
              queryKey: request.queryKey,
              rows,
            });
          });
        });
      },
    };
    const grid = createGrid<TestRow>({ columns, getRowId, dataSource });
    const staleEvents: string[] = [];
    grid.subscribe((event) => {
      if (event.type === "data.stale-response") {
        staleEvents.push(event.queryKey);
      }
    });
    const coordinator = createDataCoordinator(grid, dataSource);

    const first = coordinator.load("first");
    const second = coordinator.load("second");
    resolvers.get("second")?.([{ id: "new", name: "New", value: 2 }]);
    await second;
    resolvers.get("first")?.([{ id: "old", name: "Old", value: 1 }]);
    await first;

    expect(grid.getState().rows.rowIds).toEqual(["new"]);
    expect(staleEvents).toEqual(["first"]);
  });

  it("leaves loading deterministically when a request is cancelled", () => {
    const dataSource: GridDataSource<TestRow> = {
      getRows() {
        return new Promise(() => undefined);
      },
    };
    const grid = createGrid<TestRow>({ columns, getRowId, dataSource });
    const coordinator = createDataCoordinator(grid, dataSource);

    void coordinator.load("cancelled");
    coordinator.cancel();

    expect(grid.getState().loading.status).toBe("cancelled");
  });

  it("stores sanitized datasource errors in public state", async () => {
    const dataSource: GridDataSource<TestRow> = {
      async getRows() {
        throw new Error("https://example.invalid?token=secret");
      },
    };
    const grid = createGrid<TestRow>({ columns, getRowId, dataSource });
    const coordinator = createDataCoordinator(grid, dataSource);

    await expect(coordinator.load("error")).rejects.toThrow(
      "https://example.invalid?token=secret"
    );

    expect(grid.getState().loading).toMatchObject({
      status: "error",
      error: { message: "Datasource request failed." },
    });
  });
});
