# m-grid

## English

`m-grid` is a framework-independent, TypeScript-first data-grid package family. The current repository state is the Contract MVP foundation: package topology, strict TypeScript, package boundaries, public type skeletons, datasource lifecycle contracts, optional CSS entry points and focused validation.

It does not yet provide usable grid rendering, a real Vue component, sorting, filtering, pagination, interactive row selection behavior, keyboard navigation, ARIA grid navigation, virtualization, responsive column behavior, editing, grouping or export features.

The core state model now supports replacing selected row ids through `selection.replace`; adapters still need to implement real pointer and keyboard selection behavior.

The repository includes a static DOM demo for the first visible output. It renders rows and columns only; it is not yet a usable interactive grid.

### Packages

```text
@m-grid/core
@m-grid/dom
@m-grid/vue
@m-grid/theme-default
```

### Setup

Use Node.js 22 or newer. The repository pins pnpm through Corepack.

```text
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm install
```

If pnpm is not directly available on PATH, use Corepack:

```text
corepack pnpm install
corepack pnpm validate
```

### Validation

```text
pnpm typecheck
pnpm test
pnpm package:check
pnpm exports:check
pnpm api:check
pnpm pack:smoke
pnpm build
pnpm validate
pnpm release:check
```

`pnpm validate` is the fast local quality gate. `pnpm release:check` also packs the four packages into tarballs, installs them into a temporary consumer project and verifies public package imports.

### Documentation

See [Contract MVP Foundation](./docs/contract-mvp-foundation.md), [MVP Acceptance Criteria](./docs/mvp-acceptance-criteria.md), and [ADR Backlog](./docs/adr/README.md).

### Static DOM Demo

Run the static demo server, then open `http://127.0.0.1:4173/examples/dom-static/`.

```text
corepack pnpm demo:static
```

The demo imports package build output from `packages/core/dist/index.js` and `packages/dom/dist/index.js`. The `demo:static` script builds first, then serves the repository root. It exercises `mountStaticGrid`: the helper writes escaped static HTML from the current core state into a container and re-renders after core state changes. It does not diff, hydrate, virtualize, sort, filter or handle keyboard interaction.

See [Static DOM Demo Notes](./examples/dom-static/README.md) for the demo scope and validation notes.

## Turkce

`m-grid`, framework-independent ve TypeScript-first bir data-grid package ailesidir. Repository'nin mevcut durumu Contract MVP foundation'dir: package topology, strict TypeScript, package boundary'leri, public type skeleton'lari, datasource lifecycle contract'lari, optional CSS entry point'leri ve focused validation.

Henuz usable grid rendering, real Vue component, sorting, filtering, pagination, interactive row selection behavior, keyboard navigation, ARIA grid navigation, virtualization, responsive column behavior, editing, grouping veya export feature saglamaz.

Core state model artik selected row id'lerini `selection.replace` ile degistirmeyi destekler; adapter'larin real pointer ve keyboard selection behavior'i henuz implement etmesi gerekir.

Repository ilk gorunur cikti icin static DOM demo icerir. Sadece row ve column render eder; henuz usable interactive grid degildir.

### Packages

```text
@m-grid/core
@m-grid/dom
@m-grid/vue
@m-grid/theme-default
```

### Setup

Node.js 22 veya daha yeni surum kullanin. Repository pnpm'i Corepack uzerinden pinler.

```text
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm install
```

pnpm PATH uzerinde dogrudan mevcut degilse Corepack kullanin:

```text
corepack pnpm install
corepack pnpm validate
```

### Validation

```text
pnpm typecheck
pnpm test
pnpm package:check
pnpm exports:check
pnpm api:check
pnpm pack:smoke
pnpm build
pnpm validate
pnpm release:check
```

`pnpm validate` hizli lokal kalite gate'idir. `pnpm release:check` ayrica dort package'i tarball olarak paketler, gecici consumer project'e kurar ve public package import'larini dogrular.

### Documentation

[Contract MVP Foundation](./docs/contract-mvp-foundation.md), [MVP Acceptance Criteria](./docs/mvp-acceptance-criteria.md) ve [ADR Backlog](./docs/adr/README.md) dokumanlarina bakin.

### Static DOM Demo

Static demo server'i calistirin, sonra `http://127.0.0.1:4173/examples/dom-static/` adresini acin.

```text
corepack pnpm demo:static
```

Demo `packages/core/dist/index.js` ve `packages/dom/dist/index.js` build ciktilarini import eder. `demo:static` script'i once build alir, sonra repository root'unu serve eder. `mountStaticGrid` helper'ini dener: helper mevcut core state uzerinden escaped static HTML'i container icine yazar ve core state degisince yeniden render eder. Diff, hydrate, virtualize, sort, filter veya keyboard interaction yapmaz.

Demo kapsami ve validation notlari icin [Static DOM Demo Notes](./examples/dom-static/README.md) dokumanina bakin.
