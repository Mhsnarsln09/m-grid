import { createGrid } from "../../packages/core/dist/index.js";
import {
  getStaticGridRowIdFromTarget,
  mountStaticGrid,
  selectStaticGridRow,
} from "../../packages/dom/dist/index.js";

const rows = [
  { id: "order-1001", customer: "Ada Lovelace", total: 129, status: "Ready" },
  { id: "order-1002", customer: "Grace Hopper", total: 249, status: "Queued" },
  { id: "order-1003", customer: "Katherine Johnson", total: 89, status: "Shipped" },
];

const columns = [
  { accessorKey: "customer", header: "Customer" },
  { id: "total", header: "Total", accessorFn: (row) => `$${row.total}` },
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

  function getVisibleRows() {
    return showingAlternateRows ? alternateRows : rows;
  }

  function updateSelection() {
    const visibleRows = getVisibleRows();
    const selectedRow = visibleRows[selectedRowIndex] ?? visibleRows[0];
    if (selectedRow !== undefined) selectStaticGridRow(api, selectedRow.id);
    refreshStatus.textContent = `${showingAlternateRows ? "Showing refreshed rows" : "Showing initial rows"}; ${
      selectedRow?.customer ?? "No row"
    } selected`;
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
