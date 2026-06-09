import { createGrid, type GridApi, type GridOptions } from "@m-grid/core";
import { createDomAdapter, type GridDomAdapter } from "@m-grid/dom";

export interface VueGridOptions<TData> extends GridOptions<TData> {
  readonly adapterName?: "vue";
}

export interface VueGridContract<TData> {
  readonly api: GridApi<TData>;
  readonly dom: GridDomAdapter<TData>;
}

export function createVueGridContract<TData>(
  options: VueGridOptions<TData>
): VueGridContract<TData> {
  const api = createGrid(options);
  return {
    api,
    dom: createDomAdapter({ api }),
  };
}
