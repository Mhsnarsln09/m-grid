import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@m-grid/core": `${root}packages/core/dist/index.js`,
      "@m-grid/dom": `${root}packages/dom/dist/index.js`,
      "@m-grid/vue": `${root}packages/vue/dist/index.js`,
    },
  },
  test: {
    environment: "node",
  },
});
