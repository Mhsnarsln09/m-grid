import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const rootPath = new URL("..", import.meta.url).pathname;
const packages = [
  { name: "@m-grid/core", dir: "packages/core" },
  { name: "@m-grid/dom", dir: "packages/dom" },
  { name: "@m-grid/vue", dir: "packages/vue" },
  { name: "@m-grid/theme-default", dir: "packages/theme-default" },
];

const tempRoot = await mkdtemp(join(tmpdir(), "m-grid-pack-smoke-"));
const tarballDir = join(tempRoot, "tarballs");
const consumerDir = join(tempRoot, "consumer");
const npmCacheDir = join(tempRoot, "npm-cache");

run("mkdir", ["-p", tarballDir, consumerDir, npmCacheDir], rootPath);

const tarballs = [];
for (const packageInfo of packages) {
  run(
    "corepack",
    ["pnpm", "--dir", packageInfo.dir, "pack", "--pack-destination", tarballDir],
    rootPath
  );
  const manifest = JSON.parse(
    await readFile(join(rootPath, packageInfo.dir, "package.json"), "utf8")
  );
  const tarballName = `${manifest.name.replace("@", "").replace("/", "-")}-${manifest.version}.tgz`;
  tarballs.push(join(tarballDir, tarballName));
}

await writeFile(
  join(consumerDir, "package.json"),
  JSON.stringify(
    {
      name: "m-grid-tarball-smoke-consumer",
      private: true,
      type: "module",
    },
    null,
    2
  )
);

run(
  "npm",
  [
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    "--legacy-peer-deps",
    "--package-lock=false",
    ...tarballs,
  ],
  consumerDir
);

await writeFile(
  join(consumerDir, "consumer.mjs"),
  `
import { createGrid, getProcessedRows, getVisibleColumns } from "@m-grid/core";
import { createDomAdapter, getStaticGridRowIdFromTarget, mountStaticGrid, renderStaticGridHtml, selectStaticGridRow } from "@m-grid/dom";
import { createVueGridContract } from "@m-grid/vue";
import corePackage from "@m-grid/core/package.json" with { type: "json" };

const rows = [{ id: "row-1", label: "Ready" }];
const columns = [{ accessorKey: "label" }];
const getRowId = (row) => row.id;
const api = createGrid({ rows, columns, getRowId });
const selectedApi = createGrid({
  rows,
  columns,
  getRowId,
  initialState: { selection: { rowIds: new Set(["row-1"]) } },
});
const dom = createDomAdapter({ api });
const html = renderStaticGridHtml({ api, columns, caption: "Smoke" });
const selectedHtml = renderStaticGridHtml({ api: selectedApi, columns });
const rowIdFromTarget = getStaticGridRowIdFromTarget({
  getAttribute: () => null,
  closest: () => ({ getAttribute: () => "row-1" }),
});
const container = { innerHTML: "" };
const mount = mountStaticGrid({ api, columns, caption: "Smoke", container });
const vue = createVueGridContract({ rows, columns, getRowId, adapterName: "vue" });

if (corePackage.name !== "@m-grid/core") throw new Error("Unexpected core package metadata.");
if (dom.getState().rows.rowIds[0] !== "row-1") throw new Error("DOM adapter did not read core state.");
if (!html.includes('role="grid"')) throw new Error("Static DOM render did not produce a grid role.");
if (!html.includes('data-visible-column-count="1"')) throw new Error("Static DOM render did not expose visible column count.");
if (!html.includes("Ready")) throw new Error("Static DOM render did not include row content.");
if (!selectedHtml.includes('aria-selected="true"')) throw new Error("Static DOM render did not expose selected row metadata.");
if (rowIdFromTarget !== "row-1") throw new Error("Static DOM target helper did not read row id.");
if (!container.innerHTML.includes("Ready")) throw new Error("Static DOM mount did not include row content.");
api.dispatch({ type: "rows.replace", rows: [{ id: "row-2", label: "Updated" }] });
if (!container.innerHTML.includes("Updated")) throw new Error("Static DOM mount did not auto-render state changes.");
selectStaticGridRow(api, "row-2");
if (!container.innerHTML.includes('aria-selected="true"')) throw new Error("Static DOM mount did not auto-render selection changes.");
api.dispatch({ type: "sort.replace", sort: { items: [{ columnId: "label", direction: "asc" }] } });
api.dispatch({ type: "filter.replace", filter: { items: [{ columnId: "label", operator: "contains", value: "Updated" }] } });
api.dispatch({ type: "pagination.replace", pagination: { mode: "offset", pageIndex: 0, pageSize: 10 } });
api.dispatch({ type: "columns.order.replace", order: ["label"] });
api.dispatch({ type: "columns.visibility.replace", visibility: { label: true } });
api.dispatch({ type: "columns.sizing.replace", sizing: { label: 180 } });
if (api.getState().sort.items[0]?.columnId !== "label") throw new Error("Sort command did not update state.");
if (api.getState().filter.items[0]?.operator !== "contains") throw new Error("Filter command did not update state.");
if (api.getState().pagination.mode !== "offset") throw new Error("Pagination command did not update state.");
const processedRows = getProcessedRows(api, columns);
if (processedRows.rowIds[0] !== "row-2") throw new Error("Processed row model did not derive rows.");
if (processedRows.pagination.mode !== "offset" || processedRows.pagination.pageCount !== 1) throw new Error("Processed row model did not derive pagination summary.");
if (getVisibleColumns(columns, api.getState().columns)[0]?.columnId !== "label") throw new Error("Visible column helper did not derive columns.");
if (!container.innerHTML.includes("--m-grid-column-template: 180px;")) throw new Error("Column sizing did not update static DOM output.");
mount.unmount();
if (container.innerHTML !== "") throw new Error("Static DOM mount did not clear the container.");
if (vue.api.getState().version !== 1) throw new Error("Vue contract did not create a core grid.");

try {
  await import("@m-grid/core/dist/index.js");
  throw new Error("Unsupported deep import unexpectedly succeeded.");
} catch (error) {
  if (error?.code !== "ERR_PACKAGE_PATH_NOT_EXPORTED") throw error;
}
`
);

run("node", ["consumer.mjs"], consumerDir);
run("test", ["-f", "node_modules/@m-grid/theme-default/src/base.css"], consumerDir);
run("test", ["-f", "node_modules/@m-grid/theme-default/src/light.css"], consumerDir);
const baseCss = await readFile(join(consumerDir, "node_modules/@m-grid/theme-default/src/base.css"), "utf8");
const lightCss = await readFile(join(consumerDir, "node_modules/@m-grid/theme-default/src/light.css"), "utf8");
if (!baseCss.includes(".m-grid-header-cell[aria-sort]")) throw new Error("Theme base CSS did not style sorted headers.");
if (!baseCss.includes('.m-grid-header-cell[data-filtered="true"]')) throw new Error("Theme base CSS did not style filtered headers.");
if (!lightCss.includes("--m-grid-header-filtered-border")) throw new Error("Theme light CSS did not define filtered header token.");

console.log("Tarball smoke check passed.");

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      npm_config_cache: npmCacheDir,
    },
    stdio: "pipe",
  });

  if (result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
}
