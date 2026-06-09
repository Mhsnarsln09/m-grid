import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = new URL("..", import.meta.url);
const failures = [];
const packageNames = ["core", "dom", "vue", "theme-default"];
const packageByName = new Map();
const edges = new Map();

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, root), "utf8"));
}

async function collectFiles(relativeDir, extensions) {
  const entries = await readdir(new URL(relativeDir, root), { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const child = join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(child, extensions)));
    } else if (entry.isFile() && extensions.some((extension) => child.endsWith(extension))) {
      files.push(child);
    }
  }

  return files;
}

function collectImports(source) {
  const imports = [];
  const patterns = [
    /import\s+(?:type\s+)?[^"']*from\s+["']([^"']+)["']/g,
    /import\s+["']([^"']+)["']/g,
    /import\s*\(\s*["']([^"']+)["']\s*\)/g,
    /export\s+(?:type\s+)?[^"']*from\s+["']([^"']+)["']/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      imports.push(match[1]);
    }
  }
  return imports;
}

function addFailure(message) {
  failures.push(message);
}

for (const packageName of packageNames) {
  const manifest = await readJson(`packages/${packageName}/package.json`);
  packageByName.set(manifest.name, packageName);
  edges.set(packageName, new Set());
}

for (const packageName of packageNames) {
  const manifest = await readJson(`packages/${packageName}/package.json`);
  const declared = {
    ...manifest.dependencies,
    ...manifest.peerDependencies,
    ...manifest.devDependencies,
  };

  for (const dependency of Object.keys(declared)) {
    const target = packageByName.get(dependency);
    if (target !== undefined) {
      edges.get(packageName).add(target);
    }
  }
}

const allowedEdges = new Map([
  ["core", new Set()],
  ["dom", new Set(["core"])],
  ["vue", new Set(["core", "dom"])],
  ["theme-default", new Set()],
]);

for (const [source, targets] of edges) {
  for (const target of targets) {
    if (!allowedEdges.get(source).has(target)) {
      addFailure(`@m-grid/${source}: dependency on @m-grid/${target} is not allowed`);
    }
  }
}

function visitGraph(node, path = []) {
  if (path.includes(node)) {
    addFailure(`Package dependency cycle detected: ${[...path, node].join(" -> ")}`);
    return;
  }
  for (const target of edges.get(node) ?? []) {
    visitGraph(target, [...path, node]);
  }
}

for (const packageName of packageNames) {
  visitGraph(packageName);
}

async function assertSourceRules(packageName) {
  const sourceDir = `packages/${packageName}/src`;
  let files = [];
  try {
    files = await collectFiles(sourceDir, [".ts", ".tsx", ".css"]);
  } catch {
    return;
  }

  for (const file of files) {
    const source = await readFile(new URL(file, root), "utf8");
    if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      for (const specifier of collectImports(source)) {
        if (/^@m-grid\/[^/]+\/.+/.test(specifier)) {
          addFailure(`${file}: unsupported deep import "${specifier}"`);
        }
        if (/\.css(?:$|\?)/.test(specifier) && packageName !== "theme-default") {
          addFailure(`${file}: CSS imports are not allowed in ${packageName}`);
        }
      }
    }

    if (packageName === "core") {
      const coreForbidden = [
        /\bHTMLElement\b/,
        /\bElement\b/,
        /\bDocument\b/,
        /\bWindow\b/,
        /\bResizeObserver\b/,
        /\bMutationObserver\b/,
        /from\s+["'](?:vue|react|svelte)["']/,
        /from\s+["']@m-grid\/(?:dom|vue|react|svelte)["']/,
        /import\s+["'][^"']+\.css["']/,
      ];
      for (const pattern of coreForbidden) {
        if (pattern.test(source)) {
          addFailure(`@m-grid/core: forbidden pattern ${pattern} in ${file}`);
        }
      }
    }

    if (packageName === "dom") {
      const domForbidden = [
        /from\s+["'](?:vue|react|svelte)["']/,
        /from\s+["']@m-grid\/(?:vue|react|svelte)["']/,
      ];
      for (const pattern of domForbidden) {
        if (pattern.test(source)) {
          addFailure(`@m-grid/dom: forbidden pattern ${pattern} in ${file}`);
        }
      }
    }
  }
}

for (const packageName of packageNames) {
  await assertSourceRules(packageName);
}

const themePackage = await readJson("packages/theme-default/package.json");
if (themePackage.dependencies !== undefined) {
  addFailure("@m-grid/theme-default: runtime dependencies are not allowed");
}
if (
  !Array.isArray(themePackage.sideEffects) ||
  !themePackage.sideEffects.some((entry) => entry === "*.css" || entry === "**/*.css")
) {
  addFailure("@m-grid/theme-default: package.json must mark CSS files as side effects");
}

for (const packageName of ["core", "dom", "vue"]) {
  const manifest = await readJson(`packages/${packageName}/package.json`);
  if (manifest.sideEffects !== false) {
    addFailure(`@m-grid/${packageName}: sideEffects must be false`);
  }
}

if (failures.length > 0) {
  console.error("Package boundary check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log("Package boundary check passed.");
}
