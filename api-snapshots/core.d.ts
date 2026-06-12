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
export type SortDirection = "asc" | "desc";
export interface SortItem {
    readonly columnId: ColumnId;
    readonly direction: SortDirection;
}
export interface SortState {
    readonly items: readonly SortItem[];
}
export type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith" | "gt" | "gte" | "lt" | "lte";
export interface FilterItem {
    readonly columnId: ColumnId;
    readonly operator: FilterOperator;
    readonly value: unknown;
    readonly caseSensitive?: boolean;
}
export interface FilterState {
    readonly items: readonly FilterItem[];
}
export type PaginationState = {
    readonly mode: "none";
} | {
    readonly mode: "offset";
    readonly pageIndex: number;
    readonly pageSize: number;
} | {
    readonly mode: "cursor";
    readonly pageSize: number;
    readonly cursor?: string;
};
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
export type ProcessedRowsPagination = {
    readonly mode: "none";
} | {
    readonly mode: "offset";
    readonly pageIndex: number;
    readonly pageSize: number;
    readonly pageCount: number;
} | {
    readonly mode: "cursor";
    readonly pageSize: number;
    readonly cursor?: string;
};
export interface ProcessedRows<TData> {
    readonly rows: readonly ProcessedRow<TData>[];
    readonly rowIds: readonly RowId[];
    readonly totalRowCount: number;
    readonly filteredRowCount: number;
    readonly pagination: ProcessedRowsPagination;
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
    readonly type: "sort.replace";
    readonly sort: SortState;
} | {
    readonly type: "filter.replace";
    readonly filter: FilterState;
} | {
    readonly type: "columns.order.replace";
    readonly order: readonly ColumnId[];
} | {
    readonly type: "columns.visibility.replace";
    readonly visibility: Readonly<Record<ColumnId, boolean>>;
} | {
    readonly type: "columns.sizing.replace";
    readonly sizing: Readonly<Record<ColumnId, number>>;
} | {
    readonly type: "pagination.replace";
    readonly pagination: PaginationState;
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
    readonly columnIds: readonly ColumnId[];
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
export declare function getProcessedRows<TData>(api: GridApi<TData>, columns: readonly AnyColumnDef<TData>[]): ProcessedRows<TData>;
export declare function getVisibleColumns<TData>(columns: readonly AnyColumnDef<TData>[], state: ColumnState): readonly VisibleColumn<TData>[];
export declare function createDataCoordinator<TData>(api: GridApi<TData>, dataSource: GridDataSource<TData>): GridDataCoordinator<TData>;
export {};
