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
export interface AccessorKeyColumnDef<TData, TKey extends AccessorKey<TData> = AccessorKey<TData>> extends ColumnBase<TData> {
    readonly accessorKey: TKey;
    readonly accessorFn?: never;
}
export interface AccessorFnColumnDef<TData, TValue> extends ColumnBase<TData> {
    readonly id: ColumnId;
    readonly accessorKey?: never;
    readonly accessorFn: (row: TData, context: AccessorContext<TData>) => TValue;
}
export interface DisplayColumnDef<TData> extends ColumnBase<TData> {
    readonly id: ColumnId;
    readonly accessorKey?: never;
    readonly accessorFn?: never;
}
export type ColumnDef<TData, TValue = unknown> = AccessorKeyColumnDef<TData> | AccessorFnColumnDef<TData, TValue> | DisplayColumnDef<TData>;
export type AnyColumnDef<TData> = ColumnDef<TData, unknown>;
export type ColumnValue<TData, TColumn extends ColumnDef<TData, unknown>> = TColumn extends AccessorKeyColumnDef<TData, infer TKey> ? TData[TKey] : TColumn extends AccessorFnColumnDef<TData, infer TValue> ? TValue : unknown;
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
export type LoadingState = {
    readonly status: "idle";
} | {
    readonly status: "loading";
    readonly requestId: RequestId;
    readonly queryKey: QueryKey;
} | {
    readonly status: "success";
    readonly requestId: RequestId;
    readonly queryKey: QueryKey;
} | {
    readonly status: "error";
    readonly requestId: RequestId;
    readonly queryKey: QueryKey;
    readonly error: GridDataSourceError;
} | {
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
export type GridCommand<TData> = {
    readonly type: "rows.replace";
    readonly rows: readonly TData[];
} | {
    readonly type: "selection.replace";
    readonly rowIds: readonly RowId[];
} | {
    readonly type: "data.request.start";
    readonly requestId: RequestId;
    readonly queryKey: QueryKey;
} | {
    readonly type: "data.request.success";
    readonly requestId: RequestId;
    readonly queryKey: QueryKey;
    readonly rows: readonly TData[];
} | {
    readonly type: "data.request.error";
    readonly requestId: RequestId;
    readonly queryKey: QueryKey;
    readonly error: GridDataSourceError;
} | {
    readonly type: "data.request.cancel";
    readonly requestId: RequestId;
    readonly queryKey: QueryKey;
};
export type GridEventType = "state.change" | "data.stale-response";
export type GridStateChangeEvent<TData, TSlice extends GridStateSliceKey = GridStateSliceKey> = {
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
export type GridSelector<TData, TValue> = (state: Readonly<GridState<TData>>) => TValue;
export interface GridReducerContext<TData> {
    readonly getRowId: GetRowId<TData>;
}
export type GridReducer<TData> = (state: Readonly<GridState<TData>>, command: GridCommand<TData>, context: GridReducerContext<TData>) => GridReducerResult<TData>;
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
    addEventListener?(type: "abort", listener: () => void, options?: {
        readonly once?: boolean;
    }): void;
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
export declare function createGrid<TData>(options: GridOptions<TData>): GridApi<TData>;
export declare function createDataCoordinator<TData>(api: GridApi<TData>, dataSource: GridDataSource<TData>): GridDataCoordinator<TData>;
export {};
