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

const api = createGrid({
  columns,
  rows,
  getRowId: (row) => row.id,
});

mountStaticGrid({
  api,
  columns,
  caption: "Orders",
  container: document.querySelector("#app"),
});

let showingAlternateRows = false;

document.querySelector("#refresh-rows").addEventListener("click", () => {
  showingAlternateRows = !showingAlternateRows;
  api.dispatch({
    type: "rows.replace",
    rows: showingAlternateRows ? alternateRows : rows,
  });
});
