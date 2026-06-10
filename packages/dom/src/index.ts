import type {
  AnyColumnDef,
  ColumnId,
  GridApi,
  GridEvent,
  GridState,
} from "@m-grid/core";

export type GridDomSlot =
  | "root"
  | "viewport"
  | "header"
  | "body"
  | "footer";

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

export interface StaticGridMountOptions<TData>
  extends StaticGridRenderOptions<TData> {
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

export function createDomAdapter<TData>(
  options: GridDomMountOptions<TData>
): GridDomAdapter<TData> {
  return {
    api: options.api,
    slots: options.slots ?? {},
    getState() {
      return options.api.getState();
    },
    onCoreEvent() {
      return undefined;
    },
  };
}

export function mountStaticGrid<TData>(
  options: StaticGridMountOptions<TData>
): StaticGridMount {
  let mounted = true;
  const renderOptions: StaticGridRenderOptions<TData> = {
    api: options.api,
    columns: options.columns,
    ...(options.caption === undefined ? {} : { caption: options.caption }),
  };
  const unsubscribe = options.api.subscribe((event) => {
    if (event.type === "state.change" && mounted) {
      mount.render();
    }
  });

  const mount: StaticGridMount = {
    render() {
      if (!mounted) return;
      options.container.innerHTML = renderStaticGridHtml(renderOptions);
    },
    unmount() {
      mounted = false;
      unsubscribe();
      options.container.innerHTML = "";
    },
  };

  mount.render();
  return mount;
}

export function renderStaticGridHtml<TData>(
  options: StaticGridRenderOptions<TData>
): string {
  const state = options.api.getState();
  const columnCount = options.columns.length;
  const gridLabel =
    options.caption === undefined
      ? ""
      : ` aria-label="${escapeAttribute(options.caption)}"`;
  const headerCells = options.columns
    .map((column) => {
      const columnId = getColumnId(column);
      return `<div class="m-grid-header-cell" role="columnheader" data-column-id="${escapeAttribute(
        columnId
      )}">${escapeHtml(column.header ?? columnId)}</div>`;
    })
    .join("");

  const rows = state.rows.rows
    .map((row, rowIndex) => {
      const rowId = state.rows.rowIds[rowIndex] ?? "";
      const cells = options.columns
        .map((column) => {
          const columnId = getColumnId(column);
          return `<div class="m-grid-cell" role="gridcell" data-column-id="${escapeAttribute(
            columnId
          )}">${escapeHtml(
            String(getCellValue(options.api, row, column, rowIndex) ?? "")
          )}</div>`;
        })
        .join("");

      return `<div class="m-grid-row" role="row" data-row-id="${escapeAttribute(
        rowId
      )}">${cells}</div>`;
    })
    .join("");

  const caption =
    options.caption === undefined
      ? ""
      : `<div class="m-grid-caption">${escapeHtml(options.caption)}</div>`;

  return `<div class="m-grid-root" data-density="comfortable" data-theme="light">
${caption}
<div class="m-grid-surface" role="grid"${gridLabel} aria-rowcount="${state.rows.rows.length}" aria-colcount="${columnCount}" style="--m-grid-column-count: ${columnCount};">
<div class="m-grid-header-row" role="row">${headerCells}</div>
${rows}
</div>
</div>`;
}

function getColumnId<TData>(column: AnyColumnDef<TData>): ColumnId {
  if (column.id !== undefined && column.id !== "") return column.id;
  if (column.accessorKey !== undefined && column.accessorKey !== "") {
    return column.accessorKey;
  }
  throw new Error("[MGRID-DOM-001] Column id is required for DOM rendering.");
}

function getCellValue<TData>(
  api: GridApi<TData>,
  row: TData,
  column: AnyColumnDef<TData>,
  rowIndex: number
): unknown {
  if (column.accessorFn !== undefined) {
    return column.accessorFn(row, {
      rowIndex,
      getRowId: api.getRowId,
    });
  }
  if (column.accessorKey !== undefined) {
    return row[column.accessorKey];
  }
  return "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
