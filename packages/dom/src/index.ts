import type {
  AnyColumnDef,
  ColumnId,
  GridApi,
  GridEvent,
  GridState,
  RowId,
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

export type StaticGridDensity = "compact" | "comfortable";
export type StaticGridClassName = string | undefined;

export interface StaticGridHeaderClassContext<TData> {
  readonly column: AnyColumnDef<TData>;
  readonly columnId: ColumnId;
  readonly columnIndex: number;
}

export interface StaticGridRowClassContext<TData> {
  readonly row: TData;
  readonly rowId: string;
  readonly rowIndex: number;
  readonly selected: boolean;
}

export interface StaticGridCellClassContext<TData>
  extends StaticGridRowClassContext<TData>,
    StaticGridHeaderClassContext<TData> {
  readonly value: unknown;
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
  /**
   * Density token exposed through the root data attribute.
   */
  readonly density?: StaticGridDensity;
  /**
   * Theme token exposed through the root data attribute.
   */
  readonly theme?: string;
  /**
   * Optional message rendered outside the grid surface when there are no rows.
   */
  readonly emptyMessage?: string;
  /**
   * Additional class appended to the static grid root.
   */
  readonly rootClassName?: StaticGridClassName;
  /**
   * Optional class hook for each header cell.
   */
  readonly getHeaderCellClassName?: (
    context: StaticGridHeaderClassContext<TData>
  ) => StaticGridClassName;
  /**
   * Optional class hook for each row.
   */
  readonly getRowClassName?: (
    context: StaticGridRowClassContext<TData>
  ) => StaticGridClassName;
  /**
   * Optional class hook for each cell.
   */
  readonly getCellClassName?: (
    context: StaticGridCellClassContext<TData>
  ) => StaticGridClassName;
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

export interface StaticGridRowTarget {
  getAttribute(name: "data-row-id"): string | null;
  closest?(selector: "[data-row-id]"): StaticGridRowTarget | null;
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

export function selectStaticGridRow<TData>(
  api: GridApi<TData>,
  rowId: RowId
): void {
  api.dispatch({ type: "selection.replace", rowIds: [rowId] });
}

export function getStaticGridRowIdFromTarget(
  target: StaticGridRowTarget | null | undefined
): RowId | undefined {
  const rowTarget = target?.closest?.("[data-row-id]") ?? target;
  const rowId = rowTarget?.getAttribute("data-row-id") ?? undefined;
  return rowId === "" ? undefined : rowId;
}

export function mountStaticGrid<TData>(
  options: StaticGridMountOptions<TData>
): StaticGridMount {
  assertValidStaticGridMountTarget(options.container);
  assertRenderableStaticGridColumns(options.columns);
  let mounted = true;
  let lastAutoRenderedTransactionId: string | undefined;
  const renderOptions: StaticGridRenderOptions<TData> = {
    api: options.api,
    columns: options.columns,
    ...(options.caption === undefined ? {} : { caption: options.caption }),
    ...(options.density === undefined ? {} : { density: options.density }),
    ...(options.theme === undefined ? {} : { theme: options.theme }),
    ...(options.emptyMessage === undefined
      ? {}
      : { emptyMessage: options.emptyMessage }),
    ...(options.rootClassName === undefined
      ? {}
      : { rootClassName: options.rootClassName }),
    ...(options.getHeaderCellClassName === undefined
      ? {}
      : { getHeaderCellClassName: options.getHeaderCellClassName }),
    ...(options.getRowClassName === undefined
      ? {}
      : { getRowClassName: options.getRowClassName }),
    ...(options.getCellClassName === undefined
      ? {}
      : { getCellClassName: options.getCellClassName }),
  };
  const unsubscribe = options.api.subscribe((event) => {
    if (event.type === "state.change" && mounted) {
      if (event.transactionId === lastAutoRenderedTransactionId) return;
      lastAutoRenderedTransactionId = event.transactionId;
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

function assertValidStaticGridMountTarget(
  container: StaticGridMountTarget | null | undefined
): asserts container is StaticGridMountTarget {
  if (
    container === null ||
    container === undefined ||
    typeof container.innerHTML !== "string"
  ) {
    throw new Error("[MGRID-DOM-002] Static grid mount container is required.");
  }
}

export function renderStaticGridHtml<TData>(
  options: StaticGridRenderOptions<TData>
): string {
  assertRenderableStaticGridColumns(options.columns);
  const state = options.api.getState();
  const renderColumns = resolveRenderColumns(
    options.columns,
    state.columns.order
  ).filter((column) => state.columns.visibility?.[getColumnId(column)] !== false);
  assertVisibleStaticGridColumns(renderColumns);
  const columnCount = renderColumns.length;
  const density = options.density ?? "comfortable";
  const theme = options.theme ?? "light";
  const loadingStatus = state.loading.status;
  const busy = loadingStatus === "loading" ? "true" : "false";
  const gridLabel =
    options.caption === undefined
      ? ""
      : ` aria-label="${escapeAttribute(options.caption)}"`;
  const headerCells = renderColumns
    .map((column, columnIndex) => {
      const columnId = getColumnId(column);
      const className = composeClassName(
        "m-grid-header-cell",
        options.getHeaderCellClassName?.({ column, columnId, columnIndex })
      );
      return `<div class="${escapeAttribute(
        className
      )}" role="columnheader" aria-colindex="${
        columnIndex + 1
      }" data-column-index="${columnIndex}" data-column-id="${escapeAttribute(columnId)}">${escapeHtml(
        column.header ?? columnId
      )}</div>`;
    })
    .join("");

  const rows = state.rows.rows
    .map((row, rowIndex) => {
      const rowId = state.rows.rowIds[rowIndex] ?? "";
      const selected = state.selection.rowIds.has(rowId);
      const rowClassName = composeClassName(
        "m-grid-row",
        options.getRowClassName?.({ row, rowId, rowIndex, selected })
      );
      const selectionAttributes = selected
        ? ' aria-selected="true" data-selected="true"'
        : "";
      const cells = renderColumns
        .map((column, columnIndex) => {
          const columnId = getColumnId(column);
          const value = getCellValue(options.api, row, column, rowIndex);
          const className = composeClassName(
            "m-grid-cell",
            options.getCellClassName?.({
              row,
              rowId,
              rowIndex,
              selected,
              column,
              columnId,
              columnIndex,
              value,
            })
          );
          return `<div class="${escapeAttribute(
            className
          )}" role="gridcell" aria-colindex="${
            columnIndex + 1
          }" data-column-index="${columnIndex}" data-column-id="${escapeAttribute(columnId)}">${escapeHtml(
            String(value ?? "")
          )}</div>`;
        })
        .join("");

      return `<div class="${escapeAttribute(
        rowClassName
      )}" role="row" aria-rowindex="${
        rowIndex + 1
      }" data-row-index="${rowIndex}"${selectionAttributes} data-row-id="${escapeAttribute(rowId)}">${cells}</div>`;
    })
    .join("");

  const caption =
    options.caption === undefined
      ? ""
      : `<div class="m-grid-caption">${escapeHtml(options.caption)}</div>`;
  const empty =
    state.rows.rows.length === 0 && options.emptyMessage !== undefined
      ? `\n<div class="m-grid-empty" role="status">${escapeHtml(
          options.emptyMessage
        )}</div>`
      : "";

  const rootClassName = composeClassName("m-grid-root", options.rootClassName);

  return `<div class="${escapeAttribute(rootClassName)}" data-density="${escapeAttribute(
    density
  )}" data-theme="${escapeAttribute(theme)}" data-loading-status="${escapeAttribute(
    loadingStatus
  )}">
${caption}
<div class="m-grid-surface" role="grid"${gridLabel} aria-busy="${busy}" aria-readonly="true" aria-rowcount="${state.rows.rows.length}" aria-colcount="${columnCount}" style="--m-grid-column-count: ${columnCount};">
<div class="m-grid-header-row" role="row">${headerCells}</div>
${rows}
</div>${empty}
</div>`;
}

function getColumnId<TData>(column: AnyColumnDef<TData>): ColumnId {
  if (column.id !== undefined && column.id !== "") return column.id;
  if (column.accessorKey !== undefined && column.accessorKey !== "") {
    return column.accessorKey;
  }
  throw new Error("[MGRID-DOM-001] Column id is required for DOM rendering.");
}

function assertRenderableStaticGridColumns<TData>(
  columns: readonly AnyColumnDef<TData>[]
): void {
  if (columns.length === 0) {
    throw new Error(
      "[MGRID-DOM-003] At least one column is required for DOM rendering."
    );
  }
}

function assertVisibleStaticGridColumns<TData>(
  columns: readonly AnyColumnDef<TData>[]
): void {
  if (columns.length === 0) {
    throw new Error(
      "[MGRID-DOM-004] At least one visible column is required for DOM rendering."
    );
  }
}

function resolveRenderColumns<TData>(
  columns: readonly AnyColumnDef<TData>[],
  order: readonly ColumnId[]
): readonly AnyColumnDef<TData>[] {
  const columnsById = new Map<ColumnId, AnyColumnDef<TData>>();
  for (const column of columns) {
    columnsById.set(getColumnId(column), column);
  }

  const orderedColumns: AnyColumnDef<TData>[] = [];
  const seen = new Set<ColumnId>();
  for (const columnId of order) {
    if (seen.has(columnId)) continue;
    const column = columnsById.get(columnId);
    if (column !== undefined) {
      orderedColumns.push(column);
      seen.add(columnId);
    }
  }

  for (const column of columns) {
    const columnId = getColumnId(column);
    if (!seen.has(columnId)) orderedColumns.push(column);
  }

  return orderedColumns;
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

function composeClassName(
  baseClassName: string,
  userClassName: StaticGridClassName
): string {
  if (userClassName === undefined || userClassName.trim() === "") {
    return baseClassName;
  }
  return `${baseClassName} ${userClassName.trim()}`;
}
