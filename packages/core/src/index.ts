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

export interface SortState {
  readonly items: readonly unknown[];
}

export interface FilterState {
  readonly items: readonly unknown[];
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
}

export interface DataRowsState<TData> {
  readonly rows: readonly TData[];
  readonly rowIds: readonly RowId[];
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
  let state = createInitialState(options);
  let transactionSequence = 0;
  const subscribers = new Set<GridSubscriber<TData>>();

  const api: GridApi<TData> = {
    getRowId,
    getState() {
      return state;
    },
    dispatch(command) {
      const result = reduceGridState(state, command, { getRowId });
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

function createInitialState<TData>(
  options: GridOptions<TData>
): GridState<TData> {
  const rows = options.rows ?? [];
  const initial = options.initialState ?? {};

  return freezeState({
    version: 1,
    rows: initial.rows ?? createDataRowsState(rows, options.getRowId),
    sort: initial.sort ?? { items: [] },
    filter: initial.filter ?? { items: [] },
    pagination: initial.pagination ?? { mode: "none" },
    selection: initial.selection ?? { rowIds: new Set<RowId>() },
    columns: initial.columns ?? { order: options.columns.map(resolveColumnId) },
    loading: initial.loading ?? { status: "idle" },
  });
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
    columns: Object.freeze({ order: Object.freeze([...state.columns.order]) }),
    sort: Object.freeze({ items: Object.freeze([...state.sort.items]) }),
    filter: Object.freeze({ items: Object.freeze([...state.filter.items]) }),
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
