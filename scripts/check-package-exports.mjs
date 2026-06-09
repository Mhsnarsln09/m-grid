import { access, readFile } from "node:fs/promises";

const root = new URL("..", import.meta.url);
const failures = [];

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, root), "utf8"));
}

async function assertExists(path, label) {
  try {
    await access(new URL(path, root));
  } catch {
    failures.push(`${label}: missing export target ${path}`);
  }
}

for (const packageName of ["core", "dom", "vue"]) {
  const manifest = await readJson(`packages/${packageName}/package.json`);
  const entry = manifest.exports?.["."];
  if (entry === undefined) {
    failures.push(`@m-grid/${packageName}: missing root export`);
    continue;
  }
  await assertExists(`packages/${packageName}/${entry.types}`, `@m-grid/${packageName}`);
  await assertExists(`packages/${packageName}/${entry.import}`, `@m-grid/${packageName}`);
  if (manifest.sideEffects !== false) {
    failures.push(`@m-grid/${packageName}: sideEffects must be false`);
  }
}

const themeManifest = await readJson("packages/theme-default/package.json");
for (const cssExport of ["./base.css", "./light.css"]) {
  const target = themeManifest.exports?.[cssExport];
  if (typeof target !== "string") {
    failures.push(`@m-grid/theme-default: missing ${cssExport} export`);
  } else {
    await assertExists(`packages/theme-default/${target}`, "@m-grid/theme-default");
  }
}
if (
  !Array.isArray(themeManifest.sideEffects) ||
  !themeManifest.sideEffects.includes("**/*.css")
) {
  failures.push("@m-grid/theme-default: CSS side effect metadata must include **/*.css");
}

if (failures.length > 0) {
  console.error("Package export check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log("Package export check passed.");
}
