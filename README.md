# m-grid

## English

`m-grid` is a framework-independent, TypeScript-first data-grid package family. The current repository state is the Contract MVP foundation: package topology, strict TypeScript, package boundaries, public type skeletons, datasource lifecycle contracts, optional CSS entry points and focused validation.

It does not yet provide usable grid rendering, a real Vue component, sorting, filtering, pagination, row selection, keyboard navigation, ARIA grid navigation, virtualization, responsive column behavior, editing, grouping or export features.

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
pnpm build
pnpm validate
```

### Documentation

See [Contract MVP Foundation](./docs/contract-mvp-foundation.md), [MVP Acceptance Criteria](./docs/mvp-acceptance-criteria.md), and [ADR Backlog](./docs/adr/README.md).

## Turkce

`m-grid`, framework-independent ve TypeScript-first bir data-grid package ailesidir. Repository'nin mevcut durumu Contract MVP foundation'dir: package topology, strict TypeScript, package boundary'leri, public type skeleton'lari, datasource lifecycle contract'lari, optional CSS entry point'leri ve focused validation.

Henuz usable grid rendering, real Vue component, sorting, filtering, pagination, row selection, keyboard navigation, ARIA grid navigation, virtualization, responsive column behavior, editing, grouping veya export feature saglamaz.

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
pnpm build
pnpm validate
```

### Documentation

[Contract MVP Foundation](./docs/contract-mvp-foundation.md), [MVP Acceptance Criteria](./docs/mvp-acceptance-criteria.md) ve [ADR Backlog](./docs/adr/README.md) dokumanlarina bakin.
