import { type GridApi, type GridOptions } from "@m-grid/core";
import { type GridDomAdapter } from "@m-grid/dom";
export interface VueGridOptions<TData> extends GridOptions<TData> {
    readonly adapterName?: "vue";
}
export interface VueGridContract<TData> {
    readonly api: GridApi<TData>;
    readonly dom: GridDomAdapter<TData>;
}
export declare function createVueGridContract<TData>(options: VueGridOptions<TData>): VueGridContract<TData>;
