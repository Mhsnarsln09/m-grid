import { createGrid, getProcessedRows } from "@m-grid/core";
import {
  getStaticGridRowIdFromTarget,
  mountStaticGrid,
  selectStaticGridRow,
} from "@m-grid/dom";

const rows = [
  { id: "order-1001", customer: "Ada Lovelace", total: 129, status: "Ready" },
  { id: "order-1002", customer: "Grace Hopper", total: 249, status: "Queued" },
  { id: "order-1003", customer: "Katherine Johnson", total: 89, status: "Shipped" },
];

const columns = [
  { accessorKey: "customer", header: "Customer" },
  { id: "total", header: "Total", accessorFn: (row) => row.total },
  { accessorKey: "status", header: "Status" },
];

const alternateRows = [
  { id: "order-2001", customer: "Dorothy Vaughan", total: 159, status: "Ready" },
  { id: "order-2002", customer: "Mary Jackson", total: 319, status: "Queued" },
  { id: "order-2003", customer: "Annie Easley", total: 109, status: "Packed" },
];

export function setupStaticDemo(documentRef) {
  const api = createGrid({
    columns,
    rows,
    getRowId: (row) => row.id,
    initialState: { selection: { rowIds: new Set(["order-1002"]) } },
  });

  const app = documentRef.querySelector("#app");
  if (app === null) {
    throw new Error("[MGRID-DEMO-001] Demo mount target was not found.");
  }

  const refreshButton = documentRef.querySelector("#refresh-rows");
  if (refreshButton === null) {
    throw new Error("[MGRID-DEMO-002] Demo refresh button was not found.");
  }

  const selectNextButton = documentRef.querySelector("#select-next-row");
  if (selectNextButton === null) {
    throw new Error("[MGRID-DEMO-004] Demo select next button was not found.");
  }

  const swapColumnsButton = documentRef.querySelector("#swap-columns");
  if (swapColumnsButton === null) {
    throw new Error("[MGRID-DEMO-005] Demo swap columns button was not found.");
  }

  const toggleTotalColumnButton = documentRef.querySelector("#toggle-total-column");
  if (toggleTotalColumnButton === null) {
    throw new Error("[MGRID-DEMO-006] Demo toggle total column button was not found.");
  }

  const resizeTotalColumnButton = documentRef.querySelector("#resize-total-column");
  if (resizeTotalColumnButton === null) {
    throw new Error("[MGRID-DEMO-007] Demo resize total column button was not found.");
  }

  const sortTotalButton = documentRef.querySelector("#sort-total");
  if (sortTotalButton === null) {
    throw new Error("[MGRID-DEMO-008] Demo sort total button was not found.");
  }

  const filterReadyButton = documentRef.querySelector("#filter-ready");
  if (filterReadyButton === null) {
    throw new Error("[MGRID-DEMO-009] Demo filter ready button was not found.");
  }

  const pageSizeOneButton = documentRef.querySelector("#page-size-one");
  if (pageSizeOneButton === null) {
    throw new Error("[MGRID-DEMO-010] Demo page size one button was not found.");
  }

  const refreshStatus = documentRef.querySelector("#refresh-status");
  if (refreshStatus === null) {
    throw new Error("[MGRID-DEMO-003] Demo refresh status was not found.");
  }

  const mount = mountStaticGrid({
    api,
    columns,
    caption: "Orders",
    container: app,
  });

  let showingAlternateRows = false;
  let selectedRowIndex = 1;
  let showingTotalFirst = false;
  let showingTotalColumn = true;
  let showingWideTotal = false;
  let sortingTotalAsc = false;
  let filteringReady = false;
  let pagingOne = false;

  function getVisibleRows() {
    return showingAlternateRows ? alternateRows : rows;
  }

  function updateSelection() {
    const visibleRows = getVisibleRows();
    const selectedRow = visibleRows[selectedRowIndex] ?? visibleRows[0];
    if (selectedRow !== undefined) selectStaticGridRow(api, selectedRow.id);
    updateStatus(selectedRow?.customer ?? "No row");
  }

  function updateStatus(selectedCustomer) {
    const processed = getProcessedRows(api, columns);
    const paginationStatus =
      processed.pagination.mode === "offset"
        ? processed.pagination.pageCount === 0
          ? "; no pages"
          : `; page ${processed.pagination.pageIndex + 1} of ${
              processed.pagination.pageCount
            }`
        : "";
    refreshStatus.textContent = `${
      showingAlternateRows ? "Showing refreshed rows" : "Showing initial rows"
    }; ${selectedCustomer} selected; ${processed.rows.length} of ${
      processed.filteredRowCount
    } processed rows${paginationStatus}`;
  }

  refreshButton.addEventListener("click", () => {
    showingAlternateRows = !showingAlternateRows;
    selectedRowIndex = 1;
    api.dispatch({
      type: "rows.replace",
      rows: getVisibleRows(),
    });
    updateSelection();
    refreshButton.textContent = showingAlternateRows
      ? "Show initial rows"
      : "Refresh rows";
  });

  selectNextButton.addEventListener("click", () => {
    selectedRowIndex = (selectedRowIndex + 1) % getVisibleRows().length;
    updateSelection();
  });

  swapColumnsButton.addEventListener("click", () => {
    showingTotalFirst = !showingTotalFirst;
    api.dispatch({
      type: "columns.order.replace",
      order: showingTotalFirst
        ? ["total", "customer", "status"]
        : ["customer", "total", "status"],
    });
    swapColumnsButton.textContent = showingTotalFirst
      ? "Show customer first"
      : "Swap columns";
  });

  toggleTotalColumnButton.addEventListener("click", () => {
    showingTotalColumn = !showingTotalColumn;
    api.dispatch({
      type: "columns.visibility.replace",
      visibility: { total: showingTotalColumn },
    });
    toggleTotalColumnButton.textContent = showingTotalColumn
      ? "Hide total"
      : "Show total";
  });

  resizeTotalColumnButton.addEventListener("click", () => {
    showingWideTotal = !showingWideTotal;
    api.dispatch({
      type: "columns.sizing.replace",
      sizing: { total: showingWideTotal ? 180 : 96 },
    });
    resizeTotalColumnButton.textContent = showingWideTotal
      ? "Reset total width"
      : "Resize total";
  });

  sortTotalButton.addEventListener("click", () => {
    sortingTotalAsc = !sortingTotalAsc;
    api.dispatch({
      type: "sort.replace",
      sort: {
        items: sortingTotalAsc
          ? [{ columnId: "total", direction: "asc" }]
          : [],
      },
    });
    sortTotalButton.textContent = sortingTotalAsc
      ? "Clear total sort"
      : "Sort total";
    updateSelection();
  });

  filterReadyButton.addEventListener("click", () => {
    filteringReady = !filteringReady;
    api.dispatch({
      type: "filter.replace",
      filter: {
        items: filteringReady
          ? [{ columnId: "status", operator: "equals", value: "Ready" }]
          : [],
      },
    });
    filterReadyButton.textContent = filteringReady
      ? "Clear ready filter"
      : "Filter ready";
    updateSelection();
  });

  pageSizeOneButton.addEventListener("click", () => {
    pagingOne = !pagingOne;
    api.dispatch({
      type: "pagination.replace",
      pagination: pagingOne
        ? { mode: "offset", pageIndex: 0, pageSize: 1 }
        : { mode: "none" },
    });
    pageSizeOneButton.textContent = pagingOne ? "Show all rows" : "Page size 1";
    updateSelection();
  });

  app.addEventListener("click", (event) => {
    const rowId = getStaticGridRowIdFromTarget(event.target);
    if (rowId === undefined) return;

    const rowIndex = getVisibleRows().findIndex((row) => row.id === rowId);
    if (rowIndex === -1) return;

    selectedRowIndex = rowIndex;
    updateSelection();
  });

  return { api, mount };
}

if (typeof document !== "undefined") {
  setupStaticDemo(document);
}
