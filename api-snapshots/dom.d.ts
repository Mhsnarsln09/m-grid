import type { AnyColumnDef, GridApi, GridEvent, GridState } from "@m-grid/core";
export type GridDomSlot = "root" | "viewport" | "header" | "body" | "footer";
export interface GridDomMountOptions<TData> {
    readonly api: GridApi<TData>;
    readonly slots?: Partial<Record<GridDomSlot, string>>;
}
export interface GridDomFocusRequest {
    readonly rowIndex: number;
    readonly columnIndex: number;
    readonly reason: "keyboard" | "pointer" | "programmatic";
}
export interface GridDomAriaSnapshot {
    readonly rowCount: number | "unknown";
    readonly columnCount: number;
    readonly busy: boolean;
}
export interface GridDomMeasurementSnapshot {
    readonly viewportWidth: number;
    readonly viewportHeight: number;
    readonly rowHeight: number;
}
export interface GridDomObserverContract {
    readonly observe: () => void;
    readonly disconnect: () => void;
}
export interface GridDomViewportContract {
    readonly getMeasurementSnapshot: () => GridDomMeasurementSnapshot | undefined;
}
export interface GridDomVirtualizationContract {
    readonly mode: "reserved";
    readonly rowHeight: number;
    readonly overscanRows: number;
}
export interface GridDomAdapter<TData> {
    readonly api: GridApi<TData>;
    readonly slots: Readonly<Partial<Record<GridDomSlot, string>>>;
    readonly getState: () => Readonly<GridState<TData>>;
    readonly onCoreEvent: (event: GridEvent<TData>) => void;
}
export interface StaticGridRenderOptions<TData> {
    /**
     * Core grid API that provides the current row state and row identity contract.
     */
    readonly api: GridApi<TData>;
    /**
     * Columns to render in source order. This helper does not apply column
     * visibility, sorting, filtering or virtualization.
     */
    readonly columns: readonly AnyColumnDef<TData>[];
    /**
     * Optional visible caption. When provided, it is also used as the static
     * grid's accessible label.
     */
    readonly caption?: string;
}
export interface StaticGridMountTarget {
    innerHTML: string;
}
export interface StaticGridMountOptions<TData> extends StaticGridRenderOptions<TData> {
    /**
     * Container that receives the static grid HTML.
     */
    readonly container: StaticGridMountTarget;
}
export interface StaticGridMount {
    /**
     * Re-renders the current core state into the original container.
     */
    readonly render: () => void;
    /**
     * Clears the container and stops automatic re-rendering. It does not dispose
     * the core grid API.
     */
    readonly unmount: () => void;
}
export declare function createDomAdapter<TData>(options: GridDomMountOptions<TData>): GridDomAdapter<TData>;
export declare function mountStaticGrid<TData>(options: StaticGridMountOptions<TData>): StaticGridMount;
export declare function renderStaticGridHtml<TData>(options: StaticGridRenderOptions<TData>): string;
