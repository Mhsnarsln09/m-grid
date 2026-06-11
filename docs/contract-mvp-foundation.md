# Contract MVP Foundation

## English

This document describes the initial `@m-grid` Contract MVP foundation. It now includes a static DOM rendering demo for first visible output. It does not implement usable interactive grid rendering, sorting, filtering, pagination, selection behavior, keyboard navigation, ARIA grid navigation, virtualization, responsive column behavior, export, editing or framework components.

### Repository Setup

The repository is a pnpm workspace with four initial packages:

```text
@m-grid/core
@m-grid/dom
@m-grid/vue
@m-grid/theme-default
```

Primary validation commands:

```text
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm install
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

### Package Responsibilities

`@m-grid/core` owns framework-independent public contracts, row identity validation, state/command/event contracts, selection state replacement, subscription flow and datasource lifecycle coordination. It must not import DOM APIs, CSS, Vue, React, Svelte, browser globals or renderer types.

`@m-grid/dom` owns framework-neutral contracts reserved for future DOM coordination, focus coordination, ARIA coordination, measurements, observers, viewport and virtualization integration. It also exposes `renderStaticGridHtml` and `mountStaticGrid` as deliberately small static rendering helpers for demos and package smoke tests.

`@m-grid/vue` is the first adapter package and currently exposes only a minimal contract placeholder that composes core and DOM contracts. It does not implement a real Vue grid component yet.

`@m-grid/theme-default` is an optional CSS package with explicit CSS entry points and CSS side-effect metadata. It has no JavaScript runtime dependency.

The default theme exposes header activity tokens for static sort and filter metadata: `--m-grid-header-active-background` and `--m-grid-header-filtered-border`.

### Dependency Rules

Allowed package directions:

```text
@m-grid/core -> no other @m-grid package
@m-grid/dom -> @m-grid/core
@m-grid/vue -> @m-grid/core, @m-grid/dom
@m-grid/theme-default -> no TypeScript runtime dependencies
```

Automated checks reject unsupported deep imports, circular `@m-grid` dependencies, framework imports in lower layers, CSS imports in core and DOM-related public types in core.

### Dependency Documentation

| Dependency | Type | Purpose | Why Required | Alternatives Considered |
|---|---|---|---|---|
| `typescript` | Development | Strict TypeScript compilation and declaration generation | Required for the TypeScript-first public API and ESM package output | Plain JavaScript was rejected because public generic contracts are a product requirement |
| `vitest` | Development | Focused unit and type-inference smoke tests | Required to prove Contract MVP behavior without browser rendering | Node's built-in test runner was considered, but Vitest gives `expectTypeOf` and TypeScript-friendly tests with less custom setup |

There are no production dependencies in `@m-grid/core`, `@m-grid/dom` or `@m-grid/theme-default`. `@m-grid/vue` declares Vue as a peer dependency because it is the Vue adapter package, but the current placeholder does not import Vue runtime APIs.

### Language Policy

All source code, tests, identifiers, package metadata, scripts, CSS selectors, CSS custom properties, data attributes, comments, logs and runtime messages are English-only. Explanatory documentation is bilingual in English first, then Turkish. Code blocks remain English-only.

### Browser Policy

The initial policy is latest two major versions of supported browsers. Current tooling metadata lists Chrome, Firefox, Safari, Edge, iOS Safari and Android Chrome families. This slice does not claim browser runtime validation.

### Package Exports

The JavaScript packages expose only root ESM entries and `package.json`. The CSS package exposes explicit CSS entry points:

```text
@m-grid/theme-default/base.css
@m-grid/theme-default/light.css
```

Unsupported internal deep imports are intentionally rejected by package-boundary checks.

### API Snapshot And Tarball Smoke

`pnpm api:check` compares generated public declaration entry points against committed API snapshots under `api-snapshots/`. Public API changes must update those snapshots intentionally after review.

`pnpm pack:smoke` packs all four packages, installs the local tarballs into a temporary consumer project, verifies public JavaScript imports and checks that CSS files are present through the published theme package. It does not perform browser runtime validation.

### Selection State API

`selection.replace` replaces the selected row id set in core state. It validates row ids with the same non-empty row id rule as row data. It does not implement pointer selection, keyboard selection ranges or adapter-level selection behavior.

Provided `initialState.rows` and `initialState.selection` are validated with the same row id rules used by commands.

### Sort State API

`sort.replace` replaces core sort state with typed `{ columnId, direction }` items. It validates non-empty known column ids, accepts only `asc` or `desc` directions and deduplicates repeated column ids while preserving first occurrence order. Row ordering is derived by `getProcessedRows`; this command does not mutate source rows. String sorting is case-insensitive and numeric-aware.

### Filter State API

`filter.replace` replaces core filter state with typed `{ columnId, operator, value }` items. It validates non-empty known column ids and supports the `equals`, `contains`, `startsWith`, `endsWith`, `gt`, `gte`, `lt` and `lte` operators. Text filters are case-insensitive by default and can opt into `caseSensitive: true`; numeric operators require finite numeric values. Filtered rows are derived by `getProcessedRows`; this command does not mutate source rows.

### Processed Row Model API

`getProcessedRows(api, columns)` derives rows from current core state. It applies `filter.items`, then `sort.items`, then offset pagination. Cursor pagination remains unsliced because cursor windows are expected to come from the data source; adapters must not pretend cursor mode can page arbitrary client rows. The result includes `rows`, `rowIds`, `totalRowCount` and `filteredRowCount`.

`getProcessedRows` rejects calls where the supplied columns do not include a column referenced by current sort or filter state.

Sort and filter items require accessor-backed columns. Display-only columns can render, but they cannot participate in the processed row model until a future custom value contract exists.

### Column Order State API

`columns.order.replace` replaces core column order state. It validates non-empty known column ids, deduplicates repeated ids while preserving first occurrence order and allows omitted columns so renderers can append unmatched configured columns as their own fallback.

`columns.visibility.replace` replaces core column visibility state. Omitted columns remain visible, `false` hides a known column and static DOM rendering rejects output when no visible columns remain.

`columns.sizing.replace` replaces core column sizing state. It validates positive finite pixel widths for known column ids; static DOM rendering maps configured widths into its CSS grid template while unsized columns keep the flexible `minmax(0, 1fr)` fallback.

`getVisibleColumns(columns, state)` derives visible column descriptors from source definitions plus current order, visibility and sizing state. It validates duplicate column ids and returns stable column ids, source indexes, visible indexes and optional pixel widths.

### Pagination State API

`pagination.replace` replaces core pagination state. `none` mode clears pagination fields, `offset` mode requires non-negative integer `pageIndex` and positive integer `pageSize`, and `cursor` mode requires positive integer `pageSize` with an optional non-empty cursor.

### Static DOM Rendering API

`@m-grid/dom` exposes `renderStaticGridHtml(options)` and `mountStaticGrid(options)` for first-output demos and package smoke coverage. The public contract is intentionally narrow:

- `options.api` reads the current `@m-grid/core` state and row identity contract.
- `options.columns` defines renderable columns; current core `columns.order` controls rendered order when ids match.
- Current core `columns.visibility` hides columns whose visibility value is `false`.
- Current core `columns.sizing` maps visible column ids to pixel tracks in the static CSS grid template.
- Current core `sort` state is exposed on matching static column headers through `data-sort-direction` and `data-sort-index`; only the primary sorted header receives `aria-sort`. Row order comes from `getProcessedRows`.
- Current core `filter` state is exposed on matching static column headers through `data-filtered="true"`; visible rows come from `getProcessedRows`.
- Empty `options.columns` is rejected because static DOM grid output requires at least one renderable column.
- Static DOM output with no visible columns is rejected.
- `options.caption`, when provided, renders visible caption text and the grid `aria-label`.
- `options.emptyMessage`, when provided and there are no rows, renders escaped status text outside the grid surface.
- `options.density` and `options.theme` set root `data-density` and `data-theme` attributes; defaults are `comfortable` and `light`.
- `rootClassName`, `getHeaderCellClassName`, `getRowClassName` and `getCellClassName` append escaped classes while preserving stable base classes.
- Row and cell class hook contexts include `selected` from current core selection state.
- Header labels, row ids, column ids and cell values are escaped before interpolation.
- `renderStaticGridHtml` returns a string.
- `mountStaticGrid` writes that string into `container.innerHTML`, re-renders after core state changes, exposes `render()` for explicit refresh and `unmount()` to clear the container and stop its subscription.
- `selectStaticGridRow` is a small DOM-package helper that dispatches core `selection.replace` for one row id.
- `getStaticGridRowIdFromTarget` extracts row ids from `[data-row-id]` targets for simple pointer selection wiring.
- Core state changes from one dispatch share one transaction id; `mountStaticGrid` uses that id to avoid duplicate automatic renders for multi-slice updates.
- Static output includes `aria-rowcount`, `aria-colcount`, body-row `aria-rowindex` and cell/header `aria-colindex` metadata.
- Static output includes processed `aria-rowcount`, source `data-total-row-count` and processed `data-filtered-row-count` metadata.
- Static output marks the grid as read-only with `aria-readonly="true"` because editing is out of scope.
- Static output includes zero-based processed `data-row-index`, source `data-source-row-index` and visible `data-column-index` hooks.
- Static output exposes loading state through root `data-loading-status` and grid `aria-busy`.
- Static output exposes pagination mode through root `data-pagination-mode`; offset pagination also exposes `data-page-index` and `data-page-size`.
- Static output exposes selected rows through row `aria-selected="true"` and `data-selected="true"`.
- These helpers do not diff, hydrate, virtualize, provide interactive sort/filter/pagination controls, edit or handle keyboard interaction.

Acceptance for this slice is the focused DOM unit test and inline static output snapshot. Browser runtime validation remains limited to manually serving `examples/dom-static/` after a build.

### Current Limitations

The Contract MVP foundation has only static DOM rendering plus a derived row model. It does not provide interactive sort/filter/pagination controls, edit, virtualize, navigate with keyboard, calculate responsive columns, export files, or provide a real Vue component. Those belong to later slices.

## Turkce

Bu dokuman ilk `@m-grid` Contract MVP foundation kapsamını aciklar. Artik ilk gorunur cikti icin static DOM rendering demo icerir. Usable interactive grid rendering, sorting, filtering, pagination, selection behavior, keyboard navigation, ARIA grid navigation, virtualization, responsive column behavior, export, editing veya framework component implement etmez.

### Repository Setup

Repository dort ilk package iceren bir pnpm workspace'tir:

```text
@m-grid/core
@m-grid/dom
@m-grid/vue
@m-grid/theme-default
```

Ana validation komutlari:

```text
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm install
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

### Package Responsibilities

`@m-grid/core` framework-independent public contract'lari, row identity validation, state/command/event contract'lari, selection state replacement, subscription flow ve datasource lifecycle coordination'i sahiplenir. DOM API, CSS, Vue, React, Svelte, browser global veya renderer type import etmez.

`@m-grid/dom` future DOM coordination, focus coordination, ARIA coordination, measurement, observer, viewport ve virtualization integration icin framework-neutral contract'lari ayirir. Ayrica demo ve package smoke test icin bilerek kucuk tutulan `renderStaticGridHtml` ve `mountStaticGrid` static rendering helper'larini export eder.

`@m-grid/vue` ilk adapter package'tir ve su anda yalniz core ve DOM contract'larini birlestiren minimal placeholder contract export eder. Henuz real Vue grid component implement etmez.

`@m-grid/theme-default` explicit CSS entry point'leri ve CSS side-effect metadata'si olan optional CSS package'tir. JavaScript runtime dependency'si yoktur.

Default theme static sort ve filter metadata'si icin header activity token'lari expose eder: `--m-grid-header-active-background` ve `--m-grid-header-filtered-border`.

### Dependency Rules

Izin verilen package yonleri:

```text
@m-grid/core -> no other @m-grid package
@m-grid/dom -> @m-grid/core
@m-grid/vue -> @m-grid/core, @m-grid/dom
@m-grid/theme-default -> no TypeScript runtime dependencies
```

Automated check'ler unsupported deep import, circular `@m-grid` dependency, alt katmanlarda framework import'u, core'da CSS import'u ve core'da DOM-related public type'lari reddeder.

### Dependency Documentation

| Dependency | Type | Purpose | Why Required | Alternatives Considered |
|---|---|---|---|---|
| `typescript` | Development | Strict TypeScript compilation ve declaration generation | TypeScript-first public API ve ESM package output icin gereklidir | Plain JavaScript reddedildi cunku public generic contract'lar urun gereksinimidir |
| `vitest` | Development | Focused unit ve type-inference smoke test'leri | Browser rendering olmadan Contract MVP davranisini kanitlamak icin gereklidir | Node built-in test runner dusunuldu, fakat Vitest `expectTypeOf` ve TypeScript-friendly testleri daha az custom setup ile saglar |

`@m-grid/core`, `@m-grid/dom` ve `@m-grid/theme-default` production dependency icermez. `@m-grid/vue`, Vue adapter package oldugu icin Vue'yu peer dependency olarak bildirir; mevcut placeholder Vue runtime API'lerini import etmez.

### Language Policy

Tum source code, test, identifier, package metadata, script, CSS selector, CSS custom property, data attribute, comment, log ve runtime message English-only olur. Aciklayici dokumantasyon once English, sonra Turkce olacak sekilde bilingual olur. Code block'lar English-only kalir.

### Browser Policy

Ilk policy desteklenen browser'larin son iki major surumudur. Mevcut tooling metadata Chrome, Firefox, Safari, Edge, iOS Safari ve Android Chrome ailelerini listeler. Bu dilim browser runtime validation yapildigini iddia etmez.

### Package Exports

JavaScript package'lari yalniz root ESM entry ve `package.json` export eder. CSS package explicit CSS entry point'leri export eder:

```text
@m-grid/theme-default/base.css
@m-grid/theme-default/light.css
```

Unsupported internal deep import'lar package-boundary check'ler tarafindan bilerek reddedilir.

### API Snapshot And Tarball Smoke

`pnpm api:check`, generated public declaration entry point'lerini `api-snapshots/` altindaki committed API snapshot'larla karsilastirir. Public API degisiklikleri review sonrasi bilincli snapshot update gerektirir.

`pnpm pack:smoke`, dort package'i pack eder, local tarball'lari gecici consumer project'e kurar, public JavaScript import'larini dogrular ve published theme package uzerinden CSS dosyalarinin mevcut oldugunu kontrol eder. Browser runtime validation yapmaz.

### Selection State API

`selection.replace`, core state icindeki selected row id set'ini degistirir. Row id'leri row data ile ayni non-empty row id kuraliyla validate eder. Pointer selection, keyboard selection range veya adapter-level selection behavior implement etmez.

Verilen `initialState.rows` ve `initialState.selection`, command'larla ayni row id kurallariyla validate edilir.

### Sort State API

`sort.replace`, core sort state'ini typed `{ columnId, direction }` item'lariyla degistirir. Non-empty known column id'leri validate eder, yalniz `asc` veya `desc` direction kabul eder ve tekrar eden column id'leri ilk gorulme sirasini koruyarak tekillestirir. Row ordering `getProcessedRows` ile turetilir; bu command source row'lari mutate etmez. String sorting case-insensitive ve numeric-aware calisir.

### Filter State API

`filter.replace`, core filter state'ini typed `{ columnId, operator, value }` item'lariyla degistirir. Non-empty known column id'leri validate eder ve `equals`, `contains`, `startsWith`, `endsWith`, `gt`, `gte`, `lt` ve `lte` operator'lerini destekler. Text filter'lar default olarak case-insensitive calisir ve `caseSensitive: true` ile case-sensitive olabilir; numeric operator'lar finite numeric value ister.

### Processed Row Model API

`getProcessedRows(api, columns)`, mevcut core state'ten row turetir. Once `filter.items`, sonra `sort.items`, sonra offset pagination uygular. Cursor pagination unsliced kalir cunku cursor window'larin data source'tan gelmesi beklenir; adapter'lar cursor mode'un arbitrary client row'lari page edebildigini ima etmemelidir. Result `rows`, `rowIds`, `totalRowCount` ve `filteredRowCount` icerir.

`getProcessedRows`, verilen columns mevcut sort veya filter state'in referans verdigi column'i icermediginde cagrilari reddeder.

Sort ve filter item'lari accessor-backed column ister. Display-only column'lar render edilebilir, fakat future custom value contract gelene kadar processed row model'e katilamaz.

### Column Order State API

`columns.order.replace`, core column order state'ini degistirir. Non-empty ve known column id'leri validate eder, tekrar eden id'leri ilk gorulme sirasini koruyarak tekillestirir ve omitted column'lara izin verir; boylece renderer'lar eslesmeyen configured column'lari kendi fallback'i olarak sona ekleyebilir.

`columns.visibility.replace`, core column visibility state'ini degistirir. Omitted column'lar visible kalir, `false` known column'i gizler ve static DOM rendering visible column kalmadiginda output'u reddeder.

`columns.sizing.replace`, core column sizing state'ini degistirir. Known column id'leri icin positive finite pixel width'leri validate eder; static DOM rendering configured width'leri CSS grid template'e tasir, unsized column'lar flexible `minmax(0, 1fr)` fallback'ini korur.

`getVisibleColumns(columns, state)`, source definition'lar ile mevcut order, visibility ve sizing state'inden visible column descriptor'lari turetir. Duplicate column id'leri validate eder ve stable column id, source index, visible index ve optional pixel width dondurur.

### Pagination State API

`pagination.replace`, core pagination state'ini degistirir. `none` mode pagination field'larini temizler, `offset` mode non-negative integer `pageIndex` ve positive integer `pageSize` ister, `cursor` mode ise optional non-empty cursor ile positive integer `pageSize` ister.

### Static DOM Rendering API

`@m-grid/dom`, ilk cikti demo'lari ve package smoke coverage icin `renderStaticGridHtml(options)` ve `mountStaticGrid(options)` export eder. Public contract bilerek dar tutulur:

- `options.api` mevcut `@m-grid/core` state'ini ve row identity contract'ini okur.
- `options.columns` renderable column'lari belirler; id'ler eslestiginde mevcut core `columns.order` rendered order'i kontrol eder.
- Mevcut core `columns.visibility`, visibility degeri `false` olan column'lari gizler.
- Mevcut core `columns.sizing`, visible column id'lerini static CSS grid template icinde pixel track'lere map eder.
- Mevcut core `sort` state'i eslesen static column header'larda `data-sort-direction` ve `data-sort-index` ile expose edilir; yalniz primary sorted header `aria-sort` alir. Row order `getProcessedRows` sonucundan gelir.
- Mevcut core `filter` state'i eslesen static column header'larda `data-filtered="true"` ile expose edilir; visible rows `getProcessedRows` sonucundan gelir.
- Empty `options.columns` reddedilir cunku static DOM grid output en az bir renderable column gerektirir.
- Visible column kalmayan static DOM output reddedilir.
- `options.caption` verildiginde visible caption text ve grid `aria-label` uretir.
- `options.emptyMessage` verildiginde ve row yoksa, grid surface disinda escaped status text render eder.
- `options.density` ve `options.theme` root `data-density` ve `data-theme` attribute'larini belirler; default degerler `comfortable` ve `light` olur.
- `rootClassName`, `getHeaderCellClassName`, `getRowClassName` ve `getCellClassName` stable base class'lari koruyarak escaped class ekler.
- Row ve cell class hook context'leri mevcut core selection state'ten gelen `selected` bilgisini icerir.
- Header label, row id, column id ve cell value degerleri interpolation oncesi escape edilir.
- `renderStaticGridHtml` string dondurur.
- `mountStaticGrid` bu string'i `container.innerHTML` icine yazar, core state degisince yeniden render eder, explicit refresh icin `render()` ve container'i temizleyip subscription'i durdurmak icin `unmount()` sunar.
- `selectStaticGridRow`, tek row id icin core `selection.replace` dispatch eden kucuk bir DOM-package helper'idir.
- `getStaticGridRowIdFromTarget`, basit pointer selection wiring icin `[data-row-id]` target'larindan row id cikarir.
- Tek dispatch'ten gelen core state change'leri tek transaction id paylasir; `mountStaticGrid` multi-slice update'lerde duplicate automatic render'i onlemek icin bu id'yi kullanir.
- Static output `aria-rowcount`, `aria-colcount`, body-row `aria-rowindex` ve cell/header `aria-colindex` metadata'si icerir.
- Static output processed `aria-rowcount`, source `data-total-row-count` ve processed `data-filtered-row-count` metadata'si icerir.
- Static output, editing kapsam disi oldugu icin grid'i `aria-readonly="true"` ile read-only olarak isaretler.
- Static output zero-based processed `data-row-index`, source `data-source-row-index` ve visible `data-column-index` hook'lari icerir.
- Static output loading state'i root `data-loading-status` ve grid `aria-busy` uzerinden expose eder.
- Static output pagination mode'u root `data-pagination-mode` uzerinden expose eder; offset pagination ayrica `data-page-index` ve `data-page-size` expose eder.
- Static output selected row'lari row `aria-selected="true"` ve `data-selected="true"` ile expose eder.
- Bu helper'lar diff, hydrate, virtualize, interactive sort/filter/pagination control, edit veya keyboard interaction saglamaz.

Bu slice icin acceptance, focused DOM unit test ve inline static output snapshot'tir. Browser runtime validation halen build sonrasi `examples/dom-static/` klasorunu manuel serve etmekle sinirlidir.

### Current Limitations

Contract MVP foundation yalniz static DOM rendering ve derived row model icerir. Interactive sort/filter/pagination control, editing, virtualization, keyboard navigation, responsive column calculation, file export veya real Vue component saglamaz. Bunlar sonraki implementation slice'larin kapsamindadir.
