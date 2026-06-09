import { describe, expect, expectTypeOf, it } from "vitest";
import {
  createDataCoordinator,
  createGrid,
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
