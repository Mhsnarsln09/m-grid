import { createGrid } from "../../packages/core/dist/index.js";
import { renderStaticGridHtml } from "../../packages/dom/dist/index.js";

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

const api = createGrid({
  columns,
  rows,
  getRowId: (row) => row.id,
});

document.querySelector("#app").innerHTML = renderStaticGridHtml({
  api,
  columns,
  caption: "Orders",
});
