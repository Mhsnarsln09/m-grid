import { readFile } from "node:fs/promises";

const root = new URL("..", import.meta.url);
const snapshots = [
  {
    label: "@m-grid/core",
    actual: "packages/core/dist/index.d.ts",
    expected: "api-snapshots/core.d.ts",
  },
  {
    label: "@m-grid/dom",
    actual: "packages/dom/dist/index.d.ts",
    expected: "api-snapshots/dom.d.ts",
  },
  {
    label: "@m-grid/vue",
    actual: "packages/vue/dist/index.d.ts",
    expected: "api-snapshots/vue.d.ts",
  },
];

const failures = [];

function normalize(source) {
  return source.replace(/\r\n/g, "\n").trimEnd();
}

for (const snapshot of snapshots) {
  const actual = normalize(await readFile(new URL(snapshot.actual, root), "utf8"));
  const expected = normalize(await readFile(new URL(snapshot.expected, root), "utf8"));

  if (actual !== expected) {
    failures.push(
      `${snapshot.label}: public API snapshot is stale. Run build, review the API change, and update ${snapshot.expected} intentionally.`
    );
  }
}

if (failures.length > 0) {
  console.error("API snapshot check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log("API snapshot check passed.");
}
