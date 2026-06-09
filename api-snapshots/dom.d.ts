import type { GridApi, GridEvent, GridState } from "@m-grid/core";
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
export declare function createDomAdapter<TData>(options: GridDomMountOptions<TData>): GridDomAdapter<TData>;
