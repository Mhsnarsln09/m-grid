import { createGrid } from "../../packages/core/dist/index.js";
import { mountStaticGrid } from "../../packages/dom/dist/index.js";

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

  refreshButton.addEventListener("click", () => {
    showingAlternateRows = !showingAlternateRows;
    api.dispatch({
    type: "rows.replace",
    rows: showingAlternateRows ? alternateRows : rows,
  });
  api.dispatch({
    type: "selection.replace",
    rowIds: [showingAlternateRows ? "order-2002" : "order-1002"],
  });
  refreshButton.textContent = showingAlternateRows
      ? "Show initial rows"
      : "Refresh rows";
    refreshStatus.textContent = showingAlternateRows
      ? "Showing refreshed rows"
      : "Showing initial rows";
  });

  return { api, mount };
}

if (typeof document !== "undefined") {
  setupStaticDemo(document);
}
