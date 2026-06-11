export type RowId = string;
export type ColumnId = string;
export type RequestId = string;
export type QueryKey = string;

export type GetRowId<TData> = (row: TData, index: number) => RowId;
export type AccessorKey<TData> = Extract<keyof TData, string>;

export interface AccessorContext<TData> {
  readonly rowIndex: number;
  readonly getRowId: GetRowId<TData>;
}

interface ColumnBase<TData> {
  readonly id?: ColumnId;
  readonly header?: string;
  readonly meta?: Readonly<Record<string, unknown>>;
}

export interface AccessorKeyColumnDef<
  TData,
  TKey extends AccessorKey<TData> = AccessorKey<TData>,
> extends ColumnBase<TData> {
  readonly accessorKey: TKey;
  readonly accessorFn?: never;
}

export interface AccessorFnColumnDef<TData, TValue>
  extends ColumnBase<TData> {
  readonly id: ColumnId;
  readonly accessorKey?: never;
  readonly accessorFn: (row: TData, context: AccessorContext<TData>) => TValue;
}

export interface DisplayColumnDef<TData> extends ColumnBase<TData> {
  readonly id: ColumnId;
  readonly accessorKey?: never;
  readonly accessorFn?: never;
}

export type ColumnDef<TData, TValue = unknown> =
  | AccessorKeyColumnDef<TData>
  | AccessorFnColumnDef<TData, TValue>
  | DisplayColumnDef<TData>;

export type AnyColumnDef<TData> = ColumnDef<TData, unknown>;

export type ColumnValue<TData, TColumn extends ColumnDef<TData, unknown>> =
  TColumn extends AccessorKeyColumnDef<TData, infer TKey>
    ? TData[TKey]
    : TColumn extends AccessorFnColumnDef<TData, infer TValue>
      ? TValue
      : unknown;

export type SortDirection = "asc" | "desc";

export interface SortItem {
  readonly columnId: ColumnId;
  readonly direction: SortDirection;
}

export interface SortState {
  readonly items: readonly SortItem[];
}

export type FilterOperator =
  | "equals"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

export interface FilterItem {
  readonly columnId: ColumnId;
  readonly operator: FilterOperator;
  readonly value: unknown;
  readonly caseSensitive?: boolean;
}

export interface FilterState {
  readonly items: readonly FilterItem[];
}

export interface PaginationState {
  readonly mode: "none" | "offset" | "cursor";
  readonly pageIndex?: number;
  readonly pageSize?: number;
  readonly cursor?: string;
}

export interface SelectionState {
  readonly rowIds: ReadonlySet<RowId>;
}

export interface ColumnState {
  readonly order: readonly ColumnId[];
  readonly visibility?: Readonly<Record<ColumnId, boolean>>;
  readonly sizing?: Readonly<Record<ColumnId, number>>;
}

export interface VisibleColumn<TData> {
  readonly column: AnyColumnDef<TData>;
  readonly columnId: ColumnId;
  readonly sourceIndex: number;
  readonly visibleIndex: number;
  readonly width: number | undefined;
}

export interface DataRowsState<TData> {
  readonly rows: readonly TData[];
  readonly rowIds: readonly RowId[];
}

export interface ProcessedRow<TData> {
  readonly row: TData;
  readonly rowId: RowId;
  readonly sourceIndex: number;
}

export interface ProcessedRows<TData> {
  readonly rows: readonly ProcessedRow<TData>[];
  readonly rowIds: readonly RowId[];
  readonly totalRowCount: number;
  readonly filteredRowCount: number;
}

export type LoadingState =
  | { readonly status: "idle" }
  | {
      readonly status: "loading";
      readonly requestId: RequestId;
      readonly queryKey: QueryKey;
    }
  | {
      readonly status: "success";
      readonly requestId: RequestId;
      readonly queryKey: QueryKey;
    }
  | {
      readonly status: "error";
      readonly requestId: RequestId;
      readonly queryKey: QueryKey;
      readonly error: GridDataSourceError;
    }
  | {
      readonly status: "cancelled";
      readonly requestId: RequestId;
      readonly queryKey: QueryKey;
    };

export interface GridDataSourceError {
  readonly message: string;
}

export interface GridState<TData> {
  readonly version: 1;
  readonly rows: DataRowsState<TData>;
  readonly sort: SortState;
  readonly filter: FilterState;
  readonly pagination: PaginationState;
  readonly selection: SelectionState;
  readonly columns: ColumnState;
  readonly loading: LoadingState;
}

export type GridStateSliceKey = keyof GridState<unknown>;

export type GridCommand<TData> =
  | { readonly type: "rows.replace"; readonly rows: readonly TData[] }
  | { readonly type: "selection.replace"; readonly rowIds: readonly RowId[] }
  | { readonly type: "sort.replace"; readonly sort: SortState }
  | { readonly type: "filter.replace"; readonly filter: FilterState }
  | { readonly type: "columns.order.replace"; readonly order: readonly ColumnId[] }
  | {
      readonly type: "columns.visibility.replace";
      readonly visibility: Readonly<Record<ColumnId, boolean>>;
    }
  | {
      readonly type: "columns.sizing.replace";
      readonly sizing: Readonly<Record<ColumnId, number>>;
    }
  | { readonly type: "pagination.replace"; readonly pagination: PaginationState }
  | {
      readonly type: "data.request.start";
      readonly requestId: RequestId;
      readonly queryKey: QueryKey;
    }
  | {
      readonly type: "data.request.success";
      readonly requestId: RequestId;
      readonly queryKey: QueryKey;
      readonly rows: readonly TData[];
    }
  | {
      readonly type: "data.request.error";
      readonly requestId: RequestId;
      readonly queryKey: QueryKey;
      readonly error: GridDataSourceError;
    }
  | {
      readonly type: "data.request.cancel";
      readonly requestId: RequestId;
      readonly queryKey: QueryKey;
    };

export type GridEventType = "state.change" | "data.stale-response";

export type GridStateChangeEvent<
  TData,
  TSlice extends GridStateSliceKey = GridStateSliceKey,
> = {
  [K in TSlice]: {
      readonly type: "state.change";
      readonly transactionId: string;
      readonly slice: K;
      readonly previous: Readonly<GridState<TData>[K]>;
      readonly next: Readonly<GridState<TData>[K]>;
      readonly command: GridCommand<TData>;
      readonly state: Readonly<GridState<TData>>;
    };
}[TSlice];

export interface GridStaleResponseEvent {
  readonly type: "data.stale-response";
  readonly requestId: RequestId;
  readonly queryKey: QueryKey;
  readonly latestRequestId: RequestId | undefined;
  readonly latestQueryKey: QueryKey | undefined;
}

export interface GridEventMap<TData> {
  readonly "state.change": GridStateChangeEvent<TData>;
  readonly "data.stale-response": GridStaleResponseEvent;
}

export type GridEvent<TData> = GridEventMap<TData>[keyof GridEventMap<TData>];
export type GridSubscriber<TData> = (event: GridEvent<TData>) => void;
export type GridUnsubscribe = () => void;

export type GridSelector<TData, TValue> = (
  state: Readonly<GridState<TData>>
) => TValue;

export interface GridReducerContext<TData> {
  readonly getRowId: GetRowId<TData>;
  readonly columnIds: readonly ColumnId[];
}

export type GridReducer<TData> = (
  state: Readonly<GridState<TData>>,
  command: GridCommand<TData>,
  context: GridReducerContext<TData>
) => GridReducerResult<TData>;

export interface GridReducerResult<TData> {
  readonly state: Readonly<GridState<TData>>;
  readonly events: readonly GridStateChangeEvent<TData>[];
}

export interface GridOptions<TData> {
  readonly columns: readonly AnyColumnDef<TData>[];
  readonly getRowId: GetRowId<TData>;
  readonly rows?: readonly TData[];
  readonly dataSource?: GridDataSource<TData>;
  readonly initialState?: Partial<GridState<TData>>;
}

export interface GridApi<TData> {
  readonly getRowId: GetRowId<TData>;
  getState(): Readonly<GridState<TData>>;
  dispatch(command: GridCommand<TData>): readonly GridStateChangeEvent<TData>[];
  select<TValue>(selector: GridSelector<TData, TValue>): TValue;
  subscribe(subscriber: GridSubscriber<TData>): GridUnsubscribe;
}

export interface GridAbortSignal {
  readonly aborted: boolean;
  addEventListener?(
    type: "abort",
    listener: () => void,
    options?: { readonly once?: boolean }
  ): void;
  removeEventListener?(type: "abort", listener: () => void): void;
}

export interface GridRowsRequest {
  readonly requestId: RequestId;
  readonly queryKey: QueryKey;
  readonly signal: GridAbortSignal;
  readonly meta?: Readonly<Record<string, unknown>>;
}

export interface GridRowsResponse<TData> {
  readonly requestId: RequestId;
  readonly queryKey: QueryKey;
  readonly rows: readonly TData[];
  readonly metadata?: StaleResponseMetadata;
}

export interface StaleResponseMetadata {
  readonly accepted: boolean;
  readonly reason?: "aborted" | "request-mismatch" | "query-mismatch";
}

export interface GridDataSource<TData> {
  getRows(request: GridRowsRequest): Promise<GridRowsResponse<TData>>;
}

export interface GridDataCoordinator<TData> {
  readonly load: (queryKey: QueryKey) => Promise<GridRowsResponse<TData> | undefined>;
  readonly cancel: () => void;
  readonly dispose: () => void;
  readonly getLatestRequest: () => LatestRequestMetadata | undefined;
}

export interface LatestRequestMetadata {
  readonly requestId: RequestId;
  readonly queryKey: QueryKey;
}

interface StaleResponseCheck {
  readonly latestRequestId: RequestId | undefined;
  readonly latestQueryKey: QueryKey | undefined;
  readonly responseRequestId: RequestId;
  readonly responseQueryKey: QueryKey;
  readonly signal: GridAbortSignal;
}

export function createGrid<TData>(options: GridOptions<TData>): GridApi<TData> {
  assertValidColumns(options.columns);
  const getRowId = options.getRowId;
  const columnIds = options.columns.map(resolveColumnId);
  let state = createInitialState(options);
  let transactionSequence = 0;
  const subscribers = new Set<GridSubscriber<TData>>();

  const api: GridApi<TData> = {
    getRowId,
    getState() {
      return state;
    },
    dispatch(command) {
      const result = reduceGridState(state, command, { getRowId, columnIds });
      state = result.state as GridState<TData>;
      const transactionId = `mgrid_tx_${String(++transactionSequence).padStart(6, "0")}`;
      const events = result.events.map((event) => ({
        ...event,
        transactionId,
        state,
      }));
      for (const event of events) publish(event);
      return events;
    },
    select(selector) {
      return selector(state);
    },
    subscribe(subscriber) {
      subscribers.add(subscriber);
      return () => {
        subscribers.delete(subscriber);
      };
    },
  };

  function publish(event: GridEvent<TData>): void {
    for (const subscriber of subscribers) {
      subscriber(event);
    }
  }

  internalPublishers.set(api as object, publish as GridInternalPublisher);

  return api;
}

export function getProcessedRows<TData>(
  api: GridApi<TData>,
  columns: readonly AnyColumnDef<TData>[]
): ProcessedRows<TData> {
  const state = api.getState();
  const indexedRows = state.rows.rows.map((row, sourceIndex) => ({
    row,
    rowId: state.rows.rowIds[sourceIndex] ?? "",
    sourceIndex,
  }));
  const filteredRows = indexedRows.filter((entry) =>
    state.filter.items.every((filter) =>
      matchesFilter(getColumnValue(api, entry.row, columns, filter.columnId, entry.sourceIndex), filter)
    )
  );
  const sortedRows = sortProcessedRows(api, filteredRows, columns, state.sort.items);
  const pagedRows =
    state.pagination.mode === "offset" &&
    state.pagination.pageIndex !== undefined &&
    state.pagination.pageSize !== undefined
      ? sortedRows.slice(
          state.pagination.pageIndex * state.pagination.pageSize,
          state.pagination.pageIndex * state.pagination.pageSize + state.pagination.pageSize
        )
      : sortedRows;
  return Object.freeze({
    rows: Object.freeze(pagedRows.map((entry) => Object.freeze(entry))),
    rowIds: Object.freeze(pagedRows.map((entry) => entry.rowId)),
    totalRowCount: indexedRows.length,
    filteredRowCount: filteredRows.length,
  });
}

export function getVisibleColumns<TData>(
  columns: readonly AnyColumnDef<TData>[],
  state: ColumnState
): readonly VisibleColumn<TData>[] {
  const columnsById = new Map<ColumnId, { column: AnyColumnDef<TData>; sourceIndex: number }>();
  columns.forEach((column, sourceIndex) => {
    columnsById.set(resolveColumnId(column), { column, sourceIndex });
  });

  const orderedColumns: Array<{ column: AnyColumnDef<TData>; sourceIndex: number }> = [];
  const seen = new Set<ColumnId>();
  for (const columnId of state.order) {
    if (seen.has(columnId)) continue;
    const entry = columnsById.get(columnId);
    if (entry !== undefined) {
      orderedColumns.push(entry);
      seen.add(columnId);
    }
  }

  for (const [columnId, entry] of columnsById) {
    if (!seen.has(columnId)) orderedColumns.push(entry);
  }

  return Object.freeze(
    orderedColumns
      .filter(({ column }) => state.visibility?.[resolveColumnId(column)] !== false)
      .map(({ column, sourceIndex }, visibleIndex) => {
        const columnId = resolveColumnId(column);
        return Object.freeze({
          column,
          columnId,
          sourceIndex,
          visibleIndex,
          width: state.sizing?.[columnId],
        });
      })
  );
}

function createInitialState<TData>(
  options: GridOptions<TData>
): GridState<TData> {
  const rows = options.rows ?? [];
  const initial = options.initialState ?? {};
  const columnIds = options.columns.map(resolveColumnId);

  return freezeState({
    version: 1,
    rows: initial.rows ?? createDataRowsState(rows, options.getRowId),
    sort: createSortState(initial.sort ?? { items: [] }, columnIds),
    filter: createFilterState(initial.filter ?? { items: [] }, columnIds),
    pagination: createPaginationState(initial.pagination ?? { mode: "none" }),
    selection: initial.selection ?? { rowIds: new Set<RowId>() },
    columns:
      initial.columns === undefined
        ? createColumnState(columnIds, columnIds)
        : createColumnState(
            initial.columns.order,
            columnIds,
            initial.columns.visibility,
            initial.columns.sizing
          ),
    loading: initial.loading ?? { status: "idle" },
  });
}

function sortProcessedRows<TData>(
  api: GridApi<TData>,
  rows: readonly ProcessedRow<TData>[],
  columns: readonly AnyColumnDef<TData>[],
  sortItems: readonly SortItem[]
): readonly ProcessedRow<TData>[] {
  if (sortItems.length === 0) return rows;
  return [...rows].sort((left, right) => {
    for (const sort of sortItems) {
      const leftValue = getColumnValue(api, left.row, columns, sort.columnId, left.sourceIndex);
      const rightValue = getColumnValue(api, right.row, columns, sort.columnId, right.sourceIndex);
      const comparison = compareValues(leftValue, rightValue);
      if (comparison !== 0) {
        return sort.direction === "asc" ? comparison : -comparison;
      }
    }
    return left.sourceIndex - right.sourceIndex;
  });
}

function getColumnValue<TData>(
  api: GridApi<TData>,
  row: TData,
  columns: readonly AnyColumnDef<TData>[],
  columnId: ColumnId,
  rowIndex: number
): unknown {
  const column = columns.find((candidate) => resolveColumnId(candidate) === columnId);
  if (column === undefined) return undefined;
  if (column.accessorFn !== undefined) {
    return column.accessorFn(row, { rowIndex, getRowId: api.getRowId });
  }
  if (column.accessorKey !== undefined) return row[column.accessorKey];
  return undefined;
}

function compareValues(left: unknown, right: unknown): number {
  if (left === right) return 0;
  if (left === undefined || left === null) return 1;
  if (right === undefined || right === null) return -1;
  if (typeof left === "number" && typeof right === "number") return left - right;
  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function matchesFilter(value: unknown, filter: FilterItem): boolean {
  const actual = value ?? "";
  const expected = filter.value ?? "";
  const actualText = normalizeFilterText(actual, filter.caseSensitive);
  const expectedText = normalizeFilterText(expected, filter.caseSensitive);
  switch (filter.operator) {
    case "equals":
      return typeof actual === "string" || typeof expected === "string"
        ? actualText === expectedText
        : actual === expected;
    case "contains":
      return actualText.includes(expectedText);
    case "startsWith":
      return actualText.startsWith(expectedText);
    case "endsWith":
      return actualText.endsWith(expectedText);
    case "gt":
      return compareFilterNumbers(actual, expected, (left, right) => left > right);
    case "gte":
      return compareFilterNumbers(actual, expected, (left, right) => left >= right);
    case "lt":
      return compareFilterNumbers(actual, expected, (left, right) => left < right);
    case "lte":
      return compareFilterNumbers(actual, expected, (left, right) => left <= right);
  }
}

function normalizeFilterText(value: unknown, caseSensitive: boolean | undefined): string {
  const text = String(value);
  return caseSensitive === true ? text : text.toLocaleLowerCase();
}

function compareFilterNumbers(
  actual: unknown,
  expected: unknown,
  compare: (left: number, right: number) => boolean
): boolean {
  const left = Number(actual);
  const right = Number(expected);
  if (!Number.isFinite(left) || !Number.isFinite(right)) return false;
  return compare(left, right);
}

function reduceGridState<TData>(
  state: Readonly<GridState<TData>>,
  command: GridCommand<TData>,
  context: GridReducerContext<TData>
): GridReducerResult<TData> {
  switch (command.type) {
    case "rows.replace":
      return withSliceChange(
        state,
        "rows",
        createDataRowsState(command.rows, context.getRowId),
        command
      );
    case "selection.replace":
      return withSliceChange(
        state,
        "selection",
        createSelectionState(command.rowIds),
        command
      );
    case "sort.replace":
      return withSliceChange(
        state,
        "sort",
        createSortState(command.sort, context.columnIds),
        command
      );
    case "filter.replace":
      return withSliceChange(
        state,
        "filter",
        createFilterState(command.filter, context.columnIds),
        command
      );
    case "columns.order.replace":
      return withSliceChange(
        state,
        "columns",
        createColumnState(
          command.order,
          context.columnIds,
          state.columns.visibility,
          state.columns.sizing
        ),
        command
      );
    case "columns.visibility.replace":
      return withSliceChange(
        state,
        "columns",
        createColumnState(
          state.columns.order,
          context.columnIds,
          command.visibility,
          state.columns.sizing
        ),
        command
      );
    case "columns.sizing.replace":
      return withSliceChange(
        state,
        "columns",
        createColumnState(
          state.columns.order,
          context.columnIds,
          state.columns.visibility,
          command.sizing
        ),
        command
      );
    case "pagination.replace":
      return withSliceChange(
        state,
        "pagination",
        createPaginationState(command.pagination),
        command
      );
    case "data.request.start":
      return withSliceChange(
        state,
        "loading",
        {
          status: "loading",
          requestId: command.requestId,
          queryKey: command.queryKey,
        },
        command
      );
    case "data.request.success": {
      if (!isLatestRequest(state.loading, command.requestId, command.queryKey)) {
        return { state, events: [] };
      }

      const rowsState = createDataRowsState(command.rows, context.getRowId);
      const loadingState: LoadingState = {
        status: "success",
        requestId: command.requestId,
        queryKey: command.queryKey,
      };
      const nextState = freezeState({ ...state, rows: rowsState, loading: loadingState });
      return {
        state: nextState,
        events: [
          createStateEvent(state, nextState, "rows", command),
          createStateEvent(state, nextState, "loading", command),
        ],
      };
    }
    case "data.request.error": {
      if (!isLatestRequest(state.loading, command.requestId, command.queryKey)) {
        return { state, events: [] };
      }

      return withSliceChange(
        state,
        "loading",
        {
          status: "error",
          requestId: command.requestId,
          queryKey: command.queryKey,
          error: command.error,
        },
        command
      );
    }
    case "data.request.cancel": {
      if (!isLatestRequest(state.loading, command.requestId, command.queryKey)) {
        return { state, events: [] };
      }

      return withSliceChange(
        state,
        "loading",
        {
          status: "cancelled",
          requestId: command.requestId,
          queryKey: command.queryKey,
        },
        command
      );
    }
  }
}

export function createDataCoordinator<TData>(
  api: GridApi<TData>,
  dataSource: GridDataSource<TData>
): GridDataCoordinator<TData> {
  let latest: LatestRequestMetadata | undefined;
  let currentAbort = createGridAbortController();
  let disposed = false;
  let requestSequence = 0;

  return {
    async load(queryKey) {
      if (disposed) {
        throw new Error("[MGRID-DATA-004] Cannot load rows after disposal.");
      }

      currentAbort.abort();
      currentAbort = createGridAbortController();
      const requestAbort = currentAbort;
      const requestId = `mgrid_req_${String(++requestSequence).padStart(6, "0")}`;
      latest = { requestId, queryKey };
      api.dispatch({ type: "data.request.start", requestId, queryKey });

      try {
        const response = await dataSource.getRows({
          requestId,
          queryKey,
          signal: requestAbort.signal,
        });
        const stale = getStaleResponseMetadata({
          latestRequestId: latest?.requestId,
          latestQueryKey: latest?.queryKey,
          responseRequestId: response.requestId,
          responseQueryKey: response.queryKey,
          signal: requestAbort.signal,
        });

        if (!stale.accepted) {
          publishCoreEvent(api, {
            type: "data.stale-response",
            requestId: response.requestId,
            queryKey: response.queryKey,
            latestRequestId: latest?.requestId,
            latestQueryKey: latest?.queryKey,
          });
          return undefined;
        }

        api.dispatch({
          type: "data.request.success",
          requestId: response.requestId,
          queryKey: response.queryKey,
          rows: response.rows,
        });
        return { ...response, metadata: stale };
      } catch (error) {
        if (requestAbort.signal.aborted) {
          return undefined;
        }

        api.dispatch({
          type: "data.request.error",
          requestId,
          queryKey,
          error: toDataSourceError(error),
        });
        throw error;
      }
    },
    cancel() {
      const request = latest;
      currentAbort.abort();
      if (request !== undefined) {
        api.dispatch({
          type: "data.request.cancel",
          requestId: request.requestId,
          queryKey: request.queryKey,
        });
      }
    },
    dispose() {
      const request = latest;
      disposed = true;
      currentAbort.abort();
      if (request !== undefined) {
        api.dispatch({
          type: "data.request.cancel",
          requestId: request.requestId,
          queryKey: request.queryKey,
        });
      }
    },
    getLatestRequest() {
      return latest;
    },
  };
}

function isStaleResponse(check: StaleResponseCheck): boolean {
  return !getStaleResponseMetadata(check).accepted;
}

function getStaleResponseMetadata(
  check: StaleResponseCheck
): StaleResponseMetadata {
  if (check.signal.aborted) {
    return { accepted: false, reason: "aborted" };
  }
  if (check.latestRequestId !== check.responseRequestId) {
    return { accepted: false, reason: "request-mismatch" };
  }
  if (check.latestQueryKey !== check.responseQueryKey) {
    return { accepted: false, reason: "query-mismatch" };
  }
  return { accepted: true };
}

function resolveColumnId<TData>(column: AnyColumnDef<TData>): ColumnId {
  if (column.id !== undefined && column.id !== "") {
    return column.id;
  }
  if (column.accessorKey !== undefined && column.accessorKey !== "") {
    return column.accessorKey;
  }
  throw new Error(
    "[MGRID-COL-001] Column id is required when accessorKey is not provided."
  );
}

function assertValidColumns<TData>(
  columns: readonly AnyColumnDef<TData>[]
): void {
  const ids = new Set<ColumnId>();
  for (const column of columns) {
    const id = resolveColumnId(column);
    if (ids.has(id)) {
      throw new Error(
        `[MGRID-COL-002] Column id collision: "${id}" is used by multiple columns.`
      );
    }
    ids.add(id);
  }
}

function createColumnState(
  order: readonly ColumnId[],
  knownColumnIds: readonly ColumnId[],
  visibility: Readonly<Record<ColumnId, boolean>> = {},
  sizing: Readonly<Record<ColumnId, number>> = {}
): ColumnState {
  const known = new Set(knownColumnIds);
  const seen = new Set<ColumnId>();
  const normalizedOrder: ColumnId[] = [];
  for (const columnId of order) {
    if (columnId === "") {
      throw new Error("[MGRID-COL-003] Column order id must not be empty.");
    }
    if (!known.has(columnId)) {
      throw new Error(
        `[MGRID-COL-004] Unknown column order id: "${columnId}".`
      );
    }
    if (seen.has(columnId)) continue;
    seen.add(columnId);
    normalizedOrder.push(columnId);
  }
  const normalizedVisibility = createColumnVisibilityState(visibility, known);
  const normalizedSizing = createColumnSizingState(sizing, known);
  return Object.freeze({
    order: Object.freeze(normalizedOrder),
    visibility: normalizedVisibility,
    sizing: normalizedSizing,
  });
}

function createColumnVisibilityState(
  visibility: Readonly<Record<ColumnId, boolean>>,
  knownColumnIds: ReadonlySet<ColumnId>
): Readonly<Record<ColumnId, boolean>> {
  const normalized: Record<ColumnId, boolean> = {};
  for (const [columnId, visible] of Object.entries(visibility)) {
    if (columnId === "") {
      throw new Error("[MGRID-COL-005] Column visibility id must not be empty.");
    }
    if (!knownColumnIds.has(columnId)) {
      throw new Error(
        `[MGRID-COL-006] Unknown column visibility id: "${columnId}".`
      );
    }
    if (typeof visible !== "boolean") {
      throw new Error("[MGRID-COL-007] Column visibility value must be boolean.");
    }
    normalized[columnId] = visible;
  }
  return Object.freeze(normalized);
}

function createColumnSizingState(
  sizing: Readonly<Record<ColumnId, number>>,
  knownColumnIds: ReadonlySet<ColumnId>
): Readonly<Record<ColumnId, number>> {
  const normalized: Record<ColumnId, number> = {};
  for (const [columnId, width] of Object.entries(sizing)) {
    if (columnId === "") {
      throw new Error("[MGRID-COL-008] Column sizing id must not be empty.");
    }
    if (!knownColumnIds.has(columnId)) {
      throw new Error(`[MGRID-COL-009] Unknown column sizing id: "${columnId}".`);
    }
    if (!Number.isFinite(width) || width <= 0) {
      throw new Error("[MGRID-COL-010] Column sizing width must be positive.");
    }
    normalized[columnId] = width;
  }
  return Object.freeze(normalized);
}

function createPaginationState(pagination: PaginationState): PaginationState {
  switch (pagination.mode) {
    case "none":
      return Object.freeze({ mode: "none" });
    case "offset": {
      assertNonNegativeInteger(
        pagination.pageIndex,
        "[MGRID-PAGE-001] Offset pagination pageIndex must be a non-negative integer."
      );
      assertPositiveInteger(
        pagination.pageSize,
        "[MGRID-PAGE-002] Offset pagination pageSize must be a positive integer."
      );
      return Object.freeze({
        mode: "offset",
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      });
    }
    case "cursor": {
      assertPositiveInteger(
        pagination.pageSize,
        "[MGRID-PAGE-003] Cursor pagination pageSize must be a positive integer."
      );
      if (pagination.cursor === "") {
        throw new Error("[MGRID-PAGE-004] Cursor pagination cursor must not be empty.");
      }
      return Object.freeze({
        mode: "cursor",
        pageSize: pagination.pageSize,
        ...(pagination.cursor === undefined ? {} : { cursor: pagination.cursor }),
      });
    }
  }
}

function createSortState(
  sort: SortState,
  knownColumnIds: readonly ColumnId[]
): SortState {
  const known = new Set(knownColumnIds);
  const seen = new Set<ColumnId>();
  const items: SortItem[] = [];
  for (const item of sort.items) {
    if (item.columnId === "") {
      throw new Error("[MGRID-SORT-001] Sort column id must not be empty.");
    }
    if (!known.has(item.columnId)) {
      throw new Error(`[MGRID-SORT-002] Unknown sort column id: "${item.columnId}".`);
    }
    if (item.direction !== "asc" && item.direction !== "desc") {
      throw new Error("[MGRID-SORT-003] Sort direction must be asc or desc.");
    }
    if (seen.has(item.columnId)) continue;
    seen.add(item.columnId);
    items.push(Object.freeze({ columnId: item.columnId, direction: item.direction }));
  }
  return Object.freeze({ items: Object.freeze(items) });
}

function createFilterState(
  filter: FilterState,
  knownColumnIds: readonly ColumnId[]
): FilterState {
  const known = new Set(knownColumnIds);
  const items = filter.items.map((item) => {
    if (item.columnId === "") {
      throw new Error("[MGRID-FILTER-001] Filter column id must not be empty.");
    }
    if (!known.has(item.columnId)) {
      throw new Error(
        `[MGRID-FILTER-002] Unknown filter column id: "${item.columnId}".`
      );
    }
    if (!isFilterOperator(item.operator)) {
      throw new Error("[MGRID-FILTER-003] Filter operator is not supported.");
    }
    if (
      item.caseSensitive !== undefined &&
      typeof item.caseSensitive !== "boolean"
    ) {
      throw new Error("[MGRID-FILTER-004] Filter caseSensitive must be boolean.");
    }
    return Object.freeze({
      columnId: item.columnId,
      operator: item.operator,
      value: item.value,
      ...(item.caseSensitive === undefined
        ? {}
        : { caseSensitive: item.caseSensitive }),
    });
  });
  return Object.freeze({ items: Object.freeze(items) });
}

function isFilterOperator(operator: string): operator is FilterOperator {
  return (
    operator === "equals" ||
    operator === "contains" ||
    operator === "startsWith" ||
    operator === "endsWith" ||
    operator === "gt" ||
    operator === "gte" ||
    operator === "lt" ||
    operator === "lte"
  );
}

function assertNonNegativeInteger(
  value: number | undefined,
  message: string
): asserts value is number {
  if (value === undefined || !Number.isInteger(value) || value < 0) {
    throw new Error(message);
  }
}

function assertPositiveInteger(
  value: number | undefined,
  message: string
): asserts value is number {
  if (value === undefined || !Number.isInteger(value) || value <= 0) {
    throw new Error(message);
  }
}

function createDataRowsState<TData>(
  rows: readonly TData[],
  getRowId: GetRowId<TData>
): DataRowsState<TData> {
  const rowIds = rows.map((row, index) => normalizeRowId(getRowId(row, index)));
  assertUniqueRowIds(rowIds);
  return Object.freeze({
    rows: Object.freeze([...rows]),
    rowIds: Object.freeze(rowIds),
  });
}

function normalizeRowId(rowId: RowId): RowId {
  if (rowId === "") {
    throw new Error("[MGRID-ROW-001] Row id must not be empty.");
  }
  return rowId;
}

function assertUniqueRowIds(rowIds: readonly RowId[]): void {
  const seen = new Set<RowId>();
  for (const rowId of rowIds) {
    if (seen.has(rowId)) {
      throw new Error("[MGRID-ROW-002] Duplicate row id detected.");
    }
    seen.add(rowId);
  }
}

function createSelectionState(rowIds: readonly RowId[]): SelectionState {
  for (const rowId of rowIds) {
    normalizeRowId(rowId);
  }
  return Object.freeze({ rowIds: new Set(rowIds) });
}

function withSliceChange<TData, TKey extends GridStateSliceKey>(
  state: Readonly<GridState<TData>>,
  slice: TKey,
  nextSlice: GridState<TData>[TKey],
  command: GridCommand<TData>
): GridReducerResult<TData> {
  if (Object.is(state[slice], nextSlice)) {
    return { state, events: [] };
  }
  const nextState = freezeState({ ...state, [slice]: nextSlice });
  return {
    state: nextState,
    events: [
      createStateEvent(state, nextState, slice, command) as GridStateChangeEvent<TData>,
    ],
  };
}

function createStateEvent<TData, TKey extends GridStateSliceKey>(
  previousState: Readonly<GridState<TData>>,
  nextState: Readonly<GridState<TData>>,
  slice: TKey,
  command: GridCommand<TData>
): GridStateChangeEvent<TData, TKey> {
  const event: GridStateChangeEvent<TData, TKey> = {
    type: "state.change",
    transactionId: "",
    slice,
    previous: previousState[slice],
    next: nextState[slice],
    command,
    state: nextState,
  };
  return event;
}

function isLatestRequest(
  loading: LoadingState,
  requestId: RequestId,
  queryKey: QueryKey
): boolean {
  return (
    loading.status === "loading" &&
    loading.requestId === requestId &&
    loading.queryKey === queryKey
  );
}

function toDataSourceError(error: unknown): GridDataSourceError {
  if (error instanceof Error) {
    return { message: "Datasource request failed." };
  }
  return { message: "Datasource request failed." };
}

function createGridAbortController(): {
  readonly signal: GridAbortSignal;
  readonly abort: () => void;
} {
  let aborted = false;
  const listeners = new Set<() => void>();
  const signal: GridAbortSignal = {
    get aborted() {
      return aborted;
    },
    addEventListener(type, listener, options) {
      if (type !== "abort") return;
      if (options?.once === true) {
        const once = () => {
          listeners.delete(once);
          listener();
        };
        listeners.add(once);
      } else {
        listeners.add(listener);
      }
    },
    removeEventListener(type, listener) {
      if (type !== "abort") return;
      listeners.delete(listener);
    },
  };

  return {
    signal,
    abort() {
      if (aborted) return;
      aborted = true;
      for (const listener of [...listeners]) {
        listener();
      }
      listeners.clear();
    },
  };
}

function freezeState<TData>(state: GridState<TData>): GridState<TData> {
  return Object.freeze({
    ...state,
    rows: Object.freeze({
      rows: Object.freeze([...state.rows.rows]),
      rowIds: Object.freeze([...state.rows.rowIds]),
    }),
    columns: Object.freeze({
      order: Object.freeze([...state.columns.order]),
      visibility: Object.freeze({ ...(state.columns.visibility ?? {}) }),
      sizing: Object.freeze({ ...(state.columns.sizing ?? {}) }),
    }),
    sort: Object.freeze({ items: Object.freeze([...state.sort.items]) }),
    filter: Object.freeze({ items: Object.freeze([...state.filter.items]) }),
    pagination: Object.freeze({ ...state.pagination }),
    selection: Object.freeze({ rowIds: new Set(state.selection.rowIds) }),
  });
}

type GridInternalPublisher = (event: GridEvent<unknown>) => void;

const internalPublishers = new WeakMap<object, GridInternalPublisher>();

function publishCoreEvent<TData>(api: GridApi<TData>, event: GridEvent<TData>): void {
  const publish = internalPublishers.get(api as object);
  if (publish === undefined) {
    throw new Error("[MGRID-EVENT-001] Grid event publisher is unavailable.");
  }
  publish(event as GridEvent<unknown>);
}
