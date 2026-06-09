# Data Grid Urun ve Teknik Mimari Analizi

## English

This document follows the current final decisions: the product architecture is Hybrid, the package scope is `@m-grid`, the license is MIT, there is no Community/Pro split during the first year, Vue is the first stable framework adapter, React and Svelte are post-MVP adapters, editing is outside MVP, the default mobile strategy is priority-based columns with horizontal-scroll fallback, and supported browsers are the latest two major versions.

## Turkce

Bu dokuman guncel kesin kararlari izler: urun mimarisi Hybrid, paket kapsami `@m-grid`, lisans MIT, ilk yil Community/Pro ayrimi yok, ilk stable framework adapter Vue, React ve Svelte post-MVP adapter, editing MVP disinda, varsayilan mobil strateji horizontal-scroll fallback ile priority-based columns ve desteklenen tarayicilar son iki major surumdur.

## 1. Yonetici ozeti

- Nihai urun yaklasimi: hybrid. `@m-grid/core` framework, DOM ve CSS bilmeyen headless state/data engine olur; `@m-grid/dom` ortak DOM/ARIA/olcum sozlesmesini uygular; `@m-grid/vue` ilk stable framework adapter olur; `@m-grid/theme-default` opsiyonel CSS temasi saglar.
- Temel farklilasma: TanStack Table kadar tasarim sistemi dostu ve framework-neutral, fakat hazir DOM, keyboard, responsive ve virtualization sozlesmesiyle daha az el isi gerektiren grid foundation.
- MVP siniri iki asamalidir. Contract MVP: paket sinirlari, strict TS, public type skeleton, reducer/command path, `getRowId`, column normalization, datasource lifecycle contract, package-boundary checks, MIT license, bilingual docs ve ADR'ler. Usable Grid MVP: Vue rendering adapter, framework-neutral DOM/vanilla foundation, ARIA grid navigation, fixed row virtualization, sorting/basic filtering/pagination/selection, priority-based responsive columns with horizontal-scroll fallback ve optional default theme.
- En buyuk teknik risk: virtualization, accessibility ve responsive/card presentation ayni anda ele alindiginda DOM semantigi, focus restoration ve performans butcelerinin birbirini zorlamasi.
- Onerilen ilk uygulama dilimi: package davranisi degil, dagitilabilir sozlesme. pnpm workspace, paket sinirlari, strict TS, ESM exports, minimal public type skeleton, theme CSS entry point, package-boundary checks, ilk ADR seti.

## 2. Problem ve hedef kullanicilar

Hedef problem, modern uygulamalarda buyuk veri tablolarini yalniz masaustunde degil container, modal, drawer, tablet ve mobil baglamlarda da kullanilabilir hale getirmektir. Paket, grid CSS'iyle mucadele etmek istemeyen ama tamamen hazir UI kit'e de kilitlenmek istemeyen gelistiricilere yonelik olmalidir.

Hedef kullanicilar:

- SaaS ve internal tool ekipleri;
- tasarim sistemi olan frontend platform ekipleri;
- TypeScript-heavy Vue ekipleri, daha sonra React/Svelte/vanilla ekipleri;
- AG Grid kapsamindaki tum enterprise ozelliklere hemen ihtiyaci olmayan ama performans, responsive ve accessibility sozlesmesi isteyen ekipler;
- headless table kullanirken keyboard, virtualization ve DOM semantigini tekrar yazmak istemeyen ekipler.

## 3. Dogrulanmis varsayimlar ve acik sorular

### Dogrulanmis

- Repository su an production package degil: `package.json`, workspace config, TypeScript config, test/lint/build config ve `src` yok.
- Mevcut kaynaklar analiz ve ajan orkestrasyonu odakli: `AGENTS.md`, `docs/original-analysis-prompt.md`, `docs/analysis-output-template.md`, `docs/agent-responsibility-matrix.md`, promptlar ve ajan/skill kurulum dosyalari.
- Proje kurallari framework-independent core, optional styling, container-based responsive, accessibility acceptance criteria, performance benchmark, security defaults ve ADR kaydi istiyor.
- Guncel resmi kaynaklara gore AG Grid Community/Enterprise ayrimi, TanStack Table headless/framework-agnostic yaklasimi, MUI X open-core lisansi ve Handsontable ticari/non-commercial lisans modeli release oncesi tekrar dogrulanmasi gereken rakip baglamidir.

### Varsayilan

- Paket scope'u `@m-grid/*` olacak.
- Lisans MIT olacak.
- Ilk stable adapter Vue, ilk framework-neutral kanit DOM/vanilla foundation olacak.
- React ve Svelte adapter'lari post-MVP olacak.
- Ilk yil Community/Pro ayrimi olmayacak.
- Browser support desteklenen tarayicilarin son iki major surumu olacak.

### Acik sorular

- CJS compatibility hedeflenecek mi, yoksa ESM-only kabul mu?
- Final CSS class prefix kesin mi: `.mg-*` mi?
- Column virtualization MVP'de zorunlu mu, yoksa rendered-column cap kabul mu?
- Gercek cihaz/AT manuel test sorumlulugu ve hedef cihaz listesi kimde olacak?
- Docs sitesi tercihi: VitePress, Astro/Starlight veya Docusaurus?

## 4. Rakip analizi ve farklilasma

AG Grid cok genis enterprise kapsami ve ticari paketleriyle guclu bir referanstir. Dogrudan "AG Grid'in tum ozellikleri" hedeflenmemeli; bu MVP'yi teslim edilemez hale getirir.

TanStack Table headless, framework-agnostic ve CSS/component-library agnostic bir engine olarak konumlanir. Farklilasma, daha headless olmak degil; grid DOM, keyboard, responsive strategy ve virtualization sozlesmesini hazir ve testlenmis vermektir.

MUI X Data Grid React/MUI ekosisteminde guclu open-core urundur. Farklilasma framework-neutral core, tasarim sistemi agnostic CSS, low-specificity theme ve adapter ayrimidir.

Handsontable spreadsheet-like alana daha yakindir. Bu proje MVP'de spreadsheet clone olmamali; grouping, formulas, pivot, fill handle ve Excel workflow sonraya kalmalidir.

Kaynaklar release ve pricing yazimi oncesi yeniden dogrulanmalidir: AG Grid pricing, TanStack Table docs, MUI X licensing/pricing, Handsontable license pages.

## 5. Urun kapsami

### Contract MVP

- pnpm workspace, strict TypeScript, ESM package exports and CSS entry points.
- `@m-grid/core`, `@m-grid/dom`, `@m-grid/vue`, `@m-grid/theme-default` package boundaries.
- Public type skeleton for `ColumnDef`, `GridOptions`, `GridState`, commands and events.
- Required stable `getRowId`.
- Column normalization and duplicate ID diagnostics.
- Single reducer/command path for controlled and uncontrolled state.
- Datasource contract with `AbortSignal`, `requestId`, `queryKey`, and core-owned stale-response discard.
- Package boundary, type and API surface checks.
- MIT license.
- Bilingual architecture and developer documentation.
- First ADR set.

### Usable Grid MVP

- Framework-independent core state engine.
- Typed `ColumnDef<TData, TValue>`, `GridOptions<TData>`, `GridState`, typed event payloads.
- Stable row identity via required `getRowId`.
- Client data row model with sorting, basic filtering, pagination.
- Row selection, column visibility/order/width state.
- Fixed-height row virtualization.
- Column virtualization decision must be resolved by ADR before public MVP: either implement column virtualization or cap rendered columns with a documented warning/fallback.
- Datasource contract with `AbortSignal`, `requestId`, `queryKey`, stale-response discard.
- Container-width responsive engine: priority-based columns with horizontal-scroll fallback.
- ARIA grid model, roving tabindex, focus restoration, keyboard matrix.
- Optional default CSS theme with custom properties, cascade layers, `:where()`, stable slots/classes/data attributes.
- Vue rendering adapter and framework-neutral DOM/vanilla rendering foundation.

### MVP sonrasi

- Dynamic row height with measurement cache and scroll anchoring.
- Inline editing/custom editors.
- Column resize/reorder/pinning as hardened plugins if not completed in MVP.
- Range/cell selection, clipboard, Excel export, grouping, aggregation, tree data, pivot, master-detail.
- Infinite/cursor datasource helpers, server cache/prefetch, streaming updates.
- CSV export plugin with formula-injection mitigation unless promoted by ADR.
- Stacked/card renderer as experimental plugin with list/detail semantics and its own accessibility tests.
- React and Svelte adapters.
- Web Component adapter and optional CSS parts mapping.
- Devtools, persisted views, saved layouts, charts integration.

### Community / Pro degerlendirmesi

Ilk yil Community/Pro ayrimi olmayacak. Ticari ayrim, pro package veya feature paywall planlanmayacak; advanced features sadece teknik modularity icin plugin/package boundary ile ayrilabilir:

- Ilk yil tek lisans/paket politikasi: MIT.
- Post-MVP advanced adaylari: grouping, aggregation, pivot, tree data, server-side row model cache/prefetch, Excel export, range selection, saved views, charts.

## 6. Nihai mimari

### Karar

Hybrid architecture secilecek: headless core + DOM bridge + framework adapters + optional CSS themes + modular plugins.

### Gerekce

Bu repo henuz implementation icermedigi icin en degerli karar public/internal boundary'dir. Core'un Vue, React, DOM veya CSS'e baglanmasi ileride diger adapterlari davranis kopyalamaya zorlar. Tamamen headless model ise projenin responsive, accessibility ve developer-first hedeflerini kullaniciya yikar. Hybrid model bu iki ucu dengeler.

### Alternatifler

- Vue-first monolith: hizli demo, fakat core davranis Vue'ya kilitlenir.
- Tamamen headless: dusuk paket boyutu, fakat keyboard/DOM/responsive/a11y yuku kullaniciya kalir.
- Styled monolith: hizli baslangic, fakat CSS override ve tree-shaking zayiflar.
- Web Components/Shadow DOM: vanilla icin cazip, fakat CSS override, renderer, portal, focus ve design-system uyumu zorlasir.

### Avantajlar

- Core unit tests jsdom olmadan calisir.
- Adapter'lar ayni reducer/command/event sozlesmesini kullanir.
- Optional theme, unstyled ve design-system uyumu birlikte mumkun olur.
- Plugins tree-shakable kalir.
- Accessibility ve responsive sozlesmeleri DOM/adapters tarafinda standartlasir.

### Dezavantajlar

- Baslangic config ve dokumantasyon maliyeti tek paketten yuksek.
- Plugin API erken public yapilirsa semver yuku dogar.
- DOM/adapters siniri yanlis cizilirse soyutlama donabilir.

### Riskler

- Core siserse tree-shaking ve framework-neutral hedefler zayiflar.
- Renderer API framework tiplerini core'a sizdirabilir.
- Card mode grid semantigiyle karistirilabilir.
- Dynamic height performans ve focus restoration'i bozabilir.
- CSS token/class/data attribute yuzeyi semver yuku yaratir.

### Onerilen cozum

Core yalniz state, selectors, commands, events, row/column/data contracts, datasource orchestration ve virtualization range math uretsin. Core render node abstraction tanimlamaz; concrete renderer return type adapter sorumlulugudur. DOM paketi roles, attributes, focus application, ResizeObserver, scroll event normalization ve structural classes'i uygulasin. Framework adapters DOM sozlesmesini kendi component lifecycle'ina baglasin.

### Kabul kriterleri

- `@m-grid/core` Vue/React/Svelte/DOM/CSS import etmez.
- Dependency graph `vue/react/svelte/vanilla -> dom -> core`, `plugins -> core`, `theme -> no runtime adapter` kuralini gecemez.
- Ayni command dizisi tum adapter'larda ayni `GridTransaction` snapshot'larini uretir.
- Theme import edilmeden unstyled DOM render edilebilir.
- Public API snapshot review edilmeden release yapilmaz.

## 7. Monorepo ve paket agaci

Onerilen nihai agac:

```txt
packages/
  core/
    src/
      grid/
      state/
      columns/
      rows/
      features/
      events/
      commands/
      datasource/
      keyboard/
      virtualization/
      responsive/
      plugins/
      internal/
  dom/
    src/
      slots/
      attributes/
      focus/
      keyboard/
      measurement/
      layout/
      vanilla-renderer/
  vue/
  react/               # post-MVP
  svelte/              # post-MVP beta
  vanilla/
  theme-default/
    src/
      base.css
      light.css
      dark.css
      compact.css
      comfortable.css
      mobile.css
      forced-colors.css
  plugins/
    column-resize/
    column-reorder/
    column-pinning/
    editing/
    csv-export/
    clipboard/
    range-selection/
    row-grouping/
    tree-data/
    aggregation/
    infinite-scroll/
    card-view/
  testing/             # post-MVP
  bench/
examples/
  vanilla/
  vue-basic/
  responsive-priority/
  server-data/
docs/
  adr/
```

Baslangic agaci daha kucuk olmali:

```txt
packages/
  core/
  dom/
  vue/
  theme-default/
examples/
  vanilla/
  vue-basic/
docs/
  adr/
```

Dependency yonleri:

```txt
core              -> no framework, DOM, CSS
dom               -> core
vue/react/svelte  -> dom -> core
vanilla           -> dom -> core
plugins/*         -> core, optional dom only when explicitly DOM plugin
theme-default     -> CSS only
bench/testing     -> core + dom + selected adapters
examples          -> adapters + themes + plugins
```

Initial package responsibilities:

- `@m-grid/core`: owns state, commands, reducers, selectors, events, row identity, column definitions, datasource contracts, sorting/filtering/pagination/selection state contracts and framework-independent public types. It remains usable in non-browser environments and exposes no renderer-specific public types.
- `@m-grid/dom`: owns DOM rendering contracts, ARIA semantics, focus management, keyboard navigation, measurements, observers, viewport behavior and virtualization integration. It depends on `@m-grid/core` and does not depend on Vue, React or Svelte.
- `@m-grid/vue`: first stable framework adapter. It depends on `@m-grid/core` and, where appropriate, `@m-grid/dom`; it stays thin and does not duplicate lower-layer state, navigation, measurement or virtualization logic.
- `@m-grid/theme-default`: optional default CSS theme. It uses CSS custom properties, low-specificity selectors, no global reset, no required `!important`, and correct CSS side-effect metadata.

Tooling karari: `pnpm workspace + Changesets + ESM-first`. Turborepo/Nx ertelenir; 8+ paket, ciddi affected-build ihtiyaci veya uzun CI sureleri gorulurse yeniden degerlendirilir.

## 8. Core engine ve feature sinirlari

Core'da kalacaklar:

- column normalization and stable column IDs;
- row identity and row model;
- normalized state, reducers, selectors;
- command dispatcher and typed events;
- client sort/filter/pagination primitives;
- selection model including server "all matching query" include/exclude shape;
- focus/navigation state machine;
- datasource request orchestration and stale-response protection;
- fixed virtualization range calculation;
- responsive state resolver;
- plugin lifecycle contracts.

Plugin olacaklar:

- inline editing and custom editors;
- column resize/reorder/pinning if not MVP-hardened in core state;
- range/cell selection;
- CSV/clipboard/Excel export;
- row grouping, tree data, aggregation, pivot;
- infinite/cursor/cache datasource helpers;
- card/stacked presentation renderer, post-MVP experimental;
- saved views and persistence helpers;
- devtools.

## 9. Framework adapter'lari

Core davranisin kaynagi degil; adapter'lar yalniz binding ve rendering ergonomisi saglar.

- Vue: `useGrid`, `<MGrid>`, typed slots/render functions and idiomatic composables.
- Vanilla: DOM renderer/controller, framework independence proof.
- React/Svelte: post-MVP adapters; kendi wrapper'lari ayni command/selectors sozlesmesini kullanir.

Adapter acceptance:

- Vue adapter `@m-grid/core` davranisini fork etmez.
- Adapter-specific renderer return type core public API'sine sizmaz.
- DOM slot/class/data attribute snapshot'lari adapter'lar arasinda aynidir.

## 10. TypeScript public API

### `ColumnDef<TData, TValue>`

```ts
export type RowId = string;
export type ColumnId = string;
export type AccessorKey<TData> = Extract<keyof TData, string>;
export type AnyColumnDef<TData> = ColumnDef<TData, unknown>;

export interface ColumnDef<TData, TValue = unknown> {
  id?: ColumnId;
  accessorKey?: AccessorKey<TData>;
  accessorFn?: (row: TData, ctx: AccessorContext<TData>) => TValue;

  header?: string;
  formatter?: CoreCellFormatter<TData, TValue>;
  parser?: CoreValueParser<TData, TValue>;
  validator?: CoreValueValidator<TData, TValue>;

  sortable?: boolean | SortOptions<TData, TValue>;
  filter?: boolean | FilterOptions<TData, TValue>;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  responsive?: ColumnResponsiveDef<TData>;

  className?: GridClassValue;
  headerClassName?: GridClassValue;
  cellClassName?: GridClassValue | ((params: CellParams<TData, TValue>) => GridClassValue);
  meta?: Record<string, unknown>;
}
```

Rules:

- `accessorKey` MVP'de shallow `keyof TData` olur.
- Nested/computed/union-safe degerler icin `accessorFn` kullanilir.
- Computed kolonlarda `id` zorunludur; `accessorKey` varsa `id` turetilebilir.
- Deep path string public promise degildir; ileride `accessorPath()` helper ile gelebilir.

### `GridOptions<TData>`

```ts
export interface GridOptions<TData> {
  columns: readonly AnyColumnDef<TData>[];
  getRowId: (row: TData, index: number) => RowId;

  rows?: readonly TData[];
  dataSource?: GridDataSource<TData>;
  dataMode?: "client" | "server" | "infinite" | "cursor";

  state?: Partial<GridState>;
  initialState?: Partial<GridState>;
  controlledSlices?: readonly GridStateSliceKey[];
  onStateChange?: (event: GridStateChangeEvent<TData>) => void;

  sorting?: SortingConfig<TData>;
  filtering?: FilteringConfig<TData>;
  pagination?: PaginationConfig;
  selection?: SelectionConfig;
  responsive?: GridResponsiveOptions<TData>;
  accessibility?: GridAccessibilityOptions;
  virtualization?: VirtualizationOptions;
  /** @experimental No semver guarantee until the plugin-v1 ADR is accepted. */
  plugins?: readonly ExperimentalGridPlugin<TData>[];

  className?: GridClassValue;
  slotClassNames?: GridSlotClassNames;
  getRowClassName?: (params: RowClassParams<TData>) => GridClassValue;
  getCellClassName?: (params: CellParams<TData, unknown>) => GridClassValue;
}
```

### Event ve renderer tipleri

```ts
export interface CellParams<TData, TValue> {
  row: TData;
  rowId: RowId;
  columnId: ColumnId;
  value: TValue;
  formattedValue?: string;
  state: Readonly<GridState>;
  api: GridApi<TData>;
}

export interface CoreCellContext<TData, TValue> {
  row: TData;
  rowId: RowId;
  columnId: ColumnId;
  value: TValue;
  formattedValue?: string;
}

export type CoreCellFormatter<TData, TValue> =
  (params: CoreCellContext<TData, TValue>) => string;

export type CoreValueParser<TData, TValue> =
  (input: string, params: CoreCellContext<TData, TValue>) => TValue;

export type CoreValueValidator<TData, TValue> =
  (params: CoreCellContext<TData, TValue>) => true | string | ValidationError[];

export interface GridStateChangeEvent<TData> {
  transactionId: string;
  slice: GridStateSliceKey;
  previous: Readonly<GridState[GridStateSliceKey]>;
  next: Readonly<GridState[GridStateSliceKey]>;
  patch: Partial<GridState>;
  command: GridCommand<TData>;
}

export interface CellEvent<TData, TValue> {
  type: "cell.click" | "cell.focus" | "cell.keydown";
  rowId: RowId;
  columnId: ColumnId;
  row: TData;
  value: TValue;
}
```

Custom cell renderer:

```ts
const revenueColumn: ColumnDef<Order, number> = {
  accessorFn: row => row.revenueCents / 100,
  id: "revenue",
  header: "Revenue",
  formatter: p => `$${p.value.toFixed(2)}`
};

// Vue adapter owns render return types:
export interface VueColumnDef<TData, TValue = unknown>
  extends ColumnDef<TData, TValue> {
  cell?: (params: CoreCellContext<TData, TValue>) => unknown;
  headerRenderer?: (params: HeaderContext<TData, TValue>) => unknown;
}

const vueRevenueColumn: VueColumnDef<Order, number> = {
  ...revenueColumn,
  cell: p => p.formattedValue
};
```

Custom editor contract, post-MVP feature:

```ts
export interface ReactCellEditor<TData, TValue> {
  mount(params: CellEditorMountParams<TData, TValue>): CellEditorHandle<TValue>;
}

export interface CellEditorHandle<TValue> {
  getValue(): TValue;
  focus(): void;
  validate?(): true | string | ValidationError[];
  destroy?(): void;
}
```

### Controlled/uncontrolled kullanim

Tek reducer/command yolu kullanilir. Controlled slice icin core internal source-of-truth olmaz; parent state'i geri vermezse dev warning uretilir.

```ts
const grid = createGrid<Order>({
  rows,
  columns,
  getRowId: row => row.id,
  state: { sort, columns: columnState },
  controlledSlices: ["sort", "columns"],
  onStateChange(event) {
    if (event.slice === "sort") setSort(event.next as SortState);
    if (event.slice === "columns") setColumnState(event.next as ColumnState);
  }
});
```

Uncontrolled:

```ts
const grid = createGrid<Order>({
  rows,
  columns,
  getRowId: row => row.id,
  initialState: {
    pagination: { mode: "offset", pageIndex: 0, pageSize: 50 }
  }
});
```

## 11. State modeli

```ts
export interface GridState {
  version: 1;
  sort: SortState;
  filter: FilterState;
  selection: SelectionState;
  columns: ColumnState;
  pagination: PaginationState;
  expansion: ExpansionState;
  focus: FocusState | null;
  editing: EditingState | null;
  density: DensityState;
  responsive: ResponsiveState;
  data: DataState;
}

export interface SortState {
  items: readonly { columnId: ColumnId; direction: "asc" | "desc"; priority: number }[];
}

export interface ColumnState {
  order: readonly ColumnId[];
  visibility: Record<ColumnId, boolean>;
  widths: Record<ColumnId, number>;
  pinned: Record<ColumnId, "left" | "right" | false>;
  version: number;
}

export type SelectionState =
  | { mode: "include"; rowIds: ReadonlySet<RowId> }
  | { mode: "exclude"; scope: SelectionScope; excludedRowIds: ReadonlySet<RowId> };
```

State persistence:

```ts
export interface SerializedGridState {
  schema: "m-grid.state";
  version: number;
  gridId: string;
  createdAt: string;
  state: Partial<GridState>;
  columnsHash: string;
}
```

Persisted state merge kurallari: mevcut kolonlara ait width/order/visibility korunur, yeni kolonlar definition order ile eklenir, silinen kolonlara ait sort/filter invalid edilir, selection row index degil `RowId` ile korunur.

## 12. Data source modeli

```ts
export interface GridDataSource<TData> {
  getRows(request: GridRowsRequest<TData>): Promise<GridRowsResponse<TData>>;
  subscribe?(request: GridStreamRequest<TData>): AsyncIterable<GridDataPatch<TData>> | Unsubscribe;
}

export interface GridRowsRequest<TData> {
  requestId: string;
  queryKey: string;
  signal: AbortSignal;
  range?: { start: number; end: number };
  pagination?: OffsetPage | CursorPage;
  sort: SortModel<TData>;
  filter: FilterModel<TData>;
  projection?: ServerProjection;
  meta?: Record<string, unknown>;
}

export interface GridRowsResponse<TData> {
  requestId: string;
  rows: readonly TData[];
  rowIds?: readonly RowId[];
  total?: TotalCount;
  pageInfo?: PageInfo;
  partial?: boolean;
  warnings?: readonly GridDataWarning[];
}

export type TotalCount =
  | { kind: "known"; value: number }
  | { kind: "unknown" }
  | { kind: "estimated"; value: number; accuracy?: "low" | "medium" | "high" };
```

AbortSignal ve stale response kontrolu:

```ts
async function loadRows<TData>(lane: RequestLane, request: GridRowsRequest<TData>) {
  const response = await dataSource.getRows(request);

  if (
    response.requestId !== lane.latestRequestId ||
    request.queryKey !== lane.latestQueryKey ||
    request.signal.aborted
  ) {
    return { kind: "discarded-stale-response" as const };
  }

  return { kind: "applied" as const, response };
}
```

Server-side sort/filter validation:

```ts
export type ServerFilter<TColumnId extends string> = {
  columnId: TColumnId;
  operator: "equals" | "contains" | "startsWith" | "between" | "in";
  value: unknown;
};

export const serverLimits = {
  maxPageSize: 500,
  maxSorts: 5,
  maxFilters: 20,
  maxInValues: 100,
  maxStringLength: 500,
  maxFilterDepth: 2
} as const;
```

Column visibility is presentation state. Server projection is separate and must not be inferred from responsive-hidden columns unless explicitly configured.

## 13. Plugin sistemi

```ts
export interface ExperimentalGridPlugin<TData, TOptions = unknown> {
  id: string;
  dependsOn?: readonly string[];
  setup(ctx: PluginContext<TData>, options: TOptions): void | (() => void);
}

export interface PluginContext<TData> {
  registerFeature(feature: GridFeature<TData>): void;
  registerCommand<TCommand extends GridCommand<TData>>(handler: CommandHandler<TData, TCommand>): void;
  registerSelector<TValue>(selector: GridSelector<TData, TValue>): void;
  getState(): GridState;
  dispatch(command: GridCommand<TData>): void;
  emit(event: GridEvent<TData>): void;
}
```

Plugin rules:

- third-party plugin API has no MVP semver guarantee until plugin-v1 ADR is accepted;
- duplicate plugin IDs fail in dev and tests;
- missing dependencies fail before grid start;
- plugin registration is explicit, no import side effects;
- plugins cannot mutate DOM roles/keymap/focus directly; they must use command/event APIs.

## 14. DOM, slot ve state attribute sozlesmesi

```html
<div class="mg-root" data-mg-grid data-density="comfortable" data-theme="light">
  <div class="mg-toolbar" data-slot="toolbar"></div>
  <div class="mg-scrollport" data-slot="scrollport">
    <div
      class="mg-grid"
      data-slot="grid"
      role="grid"
      aria-rowcount="100000"
      aria-colcount="12"
      aria-label="Orders"
    >
      <div class="mg-header" data-slot="header" role="rowgroup">
        <div class="mg-header-row" data-slot="header-row" role="row" aria-rowindex="1">
          <div
            class="mg-header-cell"
            data-slot="header-cell"
            data-column-id="status"
            data-sort="ascending"
            role="columnheader"
            aria-colindex="2"
            aria-sort="ascending"
            tabindex="0"
          >Status</div>
        </div>
      </div>
      <div class="mg-body" data-slot="body" role="rowgroup">
        <div class="mg-row" data-slot="row" data-row-id="r42" role="row" aria-rowindex="42">
          <div
            class="mg-cell"
            data-slot="cell"
            data-column-id="status"
            data-selected="true"
            data-focused="true"
            role="gridcell"
            aria-colindex="2"
            aria-selected="true"
          >Paid</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

Public MVP state attributes:

```txt
data-selected
data-focused
data-invalid
data-disabled
data-sort="none|ascending|descending"
data-density="compact|comfortable"
data-responsive-size="xxs|xs|sm|md|lg|xl"
data-responsive-strategy="horizontal-table|compact-table|priority-columns"
data-virtualized
```

Deferred attributes such as `data-editing`, `data-pinned`, `data-loading`, `data-error`, `data-resizing`, `data-dragging`, `data-hovered`, `data-stale` and `data-optimistic` become public only when the corresponding feature ships and has its own contract tests. Until then they are internal or absent.

## 15. CSS ve tema mimarisi

### Cascade layer ve specificity

```css
@layer m-grid.base, m-grid.theme, m-grid.states;

@layer m-grid.base {
  :where(.mg-root) {
    container-type: inline-size;
    font-family: var(--mg-font-family);
    font-size: var(--mg-font-size);
    color: var(--mg-color-fg);
    background: var(--mg-color-bg);
  }

  :where(.mg-cell, .mg-header-cell) {
    box-sizing: border-box;
    min-width: 0;
    padding-inline: var(--mg-cell-padding-x);
    padding-block: var(--mg-cell-padding-y);
    border-color: var(--mg-color-border);
  }
}

@layer m-grid.states {
  :where(.mg-row[data-selected="true"]) {
    background: var(--mg-color-row-selected-bg);
  }

  :where(.mg-cell[data-focused="true"]) {
    outline: var(--mg-focus-ring-width) solid var(--mg-color-focus-ring);
    outline-offset: calc(var(--mg-focus-ring-width) * -1);
  }
}
```

Specificity budget: library selectors should be `0-0-0` via `:where()` wherever possible; unavoidable selectors max `0-1-0`. `!important` is banned except ADR-documented platform workaround.

### CSS custom properties

```css
:where(.mg-root) {
  --mg-font-family: system-ui, sans-serif;
  --mg-font-size: 14px;
  --mg-line-height: 1.4;
  --mg-density: comfortable;
  --mg-row-height: 40px;
  --mg-header-height: 44px;
  --mg-cell-padding-x: 12px;
  --mg-cell-padding-y: 8px;
  --mg-color-bg: Canvas;
  --mg-color-fg: CanvasText;
  --mg-color-border: #d0d7de;
  --mg-color-header-bg: #f6f8fa;
  --mg-color-row-hover-bg: #f6f8fa;
  --mg-color-row-selected-bg: #dbeafe;
  --mg-color-error: #b42318;
  --mg-color-focus-ring: #2563eb;
  --mg-border-width: 1px;
  --mg-border-radius: 6px;
  --mg-focus-ring-width: 2px;
  --mg-touch-target: 44px;
}
```

### Unstyled mode

Default theme import edilmeden DOM structural classes, slots, roles ve state attributes uretilir. Unstyled mode usable olmak zorundadir; focus-visible minimumu adapter tarafinda veya docs'ta zorunlu recipe olarak verilir.

### Light/dark/compact/comfortable/mobile temalari

```css
@layer m-grid.theme {
  :where(.mg-root[data-theme="light"]) {
    --mg-color-bg: #ffffff;
    --mg-color-fg: #111827;
    --mg-color-border: #d0d7de;
    --mg-color-header-bg: #f6f8fa;
  }

  :where(.mg-root[data-theme="dark"]) {
    --mg-color-bg: #0b1220;
    --mg-color-fg: #e5e7eb;
    --mg-color-border: #334155;
    --mg-color-header-bg: #111827;
    --mg-color-row-hover-bg: #1f2937;
    --mg-color-row-selected-bg: #1d4ed8;
    --mg-color-focus-ring: #93c5fd;
  }

  :where(.mg-root[data-density="compact"]) {
    --mg-row-height: 32px;
    --mg-header-height: 36px;
    --mg-cell-padding-x: 8px;
    --mg-cell-padding-y: 4px;
    --mg-font-size: 13px;
  }

  :where(.mg-root[data-density="comfortable"]) {
    --mg-row-height: 44px;
    --mg-header-height: 48px;
    --mg-cell-padding-x: 14px;
    --mg-cell-padding-y: 10px;
  }

  @container (max-width: 480px) {
    :where(.mg-root[data-responsive-density="auto"]) {
      --mg-row-height: 48px;
      --mg-header-height: 48px;
      --mg-cell-padding-x: 10px;
      --mg-cell-padding-y: 8px;
    }
  }

  @media (forced-colors: active) {
    :where(.mg-root) {
      --mg-color-bg: Canvas;
      --mg-color-fg: CanvasText;
      --mg-color-border: ButtonBorder;
      --mg-color-header-bg: Canvas;
      --mg-color-row-selected-bg: Highlight;
      --mg-color-focus-ring: Highlight;
    }
  }
}
```

### Design-system entegrasyonu

- Tailwind: `className`, `slotClassNames`, `getCellClassName`, `getRowClassName`; no utility classes emitted by library.
- Bootstrap: base CSS must tolerate reboot; examples show wrapper class overrides.
- MUI: adapter examples show MUI tokens mapped to CSS custom properties; core has no MUI dependency.
- Custom DS: token file can be replaced; default theme optional.

## 16. Responsive mimari

### Container query yaklasimi

CSS-only visual density and spacing use container queries. Behavioral decisions use `ResizeObserver` in DOM/adapter and normalized `responsive` state in core. Viewport breakpoints are insufficient because grid may live inside modal, drawer, sidebar or split pane.

### Responsive column API

```ts
export type GridResponsiveStrategy =
  | "horizontal-table"
  | "compact-table"
  | "priority-columns"
  | "primary-plus-detail"
  | "stacked-card"
  | "user-visibility";

export type GridContainerSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl";

export interface ColumnResponsiveDef<TData> {
  priority?: number;
  minContainerWidth?: number;
  hiddenBelow?: GridContainerSize;
  visibleWhen?: (ctx: ResponsiveContext, column: ColumnDef<TData>) => boolean;
  collapseToDetail?: boolean;
  collapseLabel?: string;
  cardRole?: "title" | "subtitle" | "meta" | "body" | "action";
  required?: boolean;
}
```

Conflict order:

1. `required`
2. controlled user visibility
3. developer `visibleWhen`
4. `hiddenBelow` / `minContainerWidth`
5. priority reduction
6. strategy fallback minimums

Responsive visibility does not mutate canonical user visibility unless the user explicitly changes it.

### Mobil strateji secimi

Default:

- `>=1024`: `horizontal-table`
- `768-1023`: `compact-table` + priority reduction
- `<768`: `priority-columns`
- fallback: `horizontal-table` when required columns cannot fit without losing meaning

`stacked-card` is post-MVP experimental. It must not be a release gate for the ARIA grid MVP.

`stacked-card` semantics:

```html
<ul class="mg-card-list" data-mg-card-list aria-label="Orders">
  <li class="mg-card-row" data-row-id="order_41">
    <h3>#10041</h3>
    <dl>
      <dt>Status</dt><dd>Paid</dd>
      <dt>Total</dt><dd>$240</dd>
    </dl>
  </li>
</ul>
```

Card mode is list/detail, not ARIA grid.

### Tablet davranisi

Tablet portrait defaults to compact/priority. Tablet landscape may support normal table and optional single pinned start column if remaining scroll area is at least 240px. Drawers and sidebars use measured container width, not viewport.

### Narrow-layout filtre/sort/pagination/editing

- Filters collapse into toolbar sheet below `sm`; active filter chips remain visible.
- Sort is available via header or compact sort menu; multi-sort through menu.
- Pagination shows previous/next and current range; page size in menu below `sm`.
- Actions move to row menu/detail footer below `sm`.
- Pinned right action column moves to row menu; left pinned primary column only remains if usable area remains.
- Resize handles disabled for coarse pointer below `md`; keyboard reorder remains via column menu.
- Editing is outside MVP. When a future editing plugin exists, inline editing is allowed only when the editor fits a 44px target; otherwise a popover/sheet editor is required.

## 17. Virtualization ve performans

### Performans butceleri

Initial budgets are calibration targets, not claims. They must be verified and adjusted against the committed benchmark harness before becoming release gates or marketing claims.

- First render p95 with generated data already in memory: 10 rows <=100ms, 100 <=150ms, 1k <=250ms, 10k <=500ms, 100k <=900ms.
- Scroll p95 frame time <=16.7ms desktop, p99 <=33ms, dropped frames <=5% during 10s continuous scroll.
- DOM rows <= visible rows + overscan * 2 + pinned rows.
- DOM cells warning above 5,000; failure above 10,000 default configuration unless an ADR-approved rendered-column cap applies.
- Selection toggle p95 <=50ms; keyboard navigation p95 <=50ms; sort/filter visual feedback <=100ms.
- Retained heap after teardown <=5MB attributable to grid excluding user-owned row data for 100k dataset.
- Core gzip budget <=20KB MVP target; Vue adapter <=12KB; default base+light CSS <=10KB. Budgets must be adjusted with measurement.

### Fixed/dynamic row height

MVP public API baseline:

```ts
export interface VirtualizationOptions {
  enabled?: boolean;
  rowHeight: number;
  rowOverscan?: number;
  maxDomRows?: number;
  maxDomCells?: number;
  scrollSync?: "native" | "raf";
}
```

Fixed row height is default and the only public MVP mode. Dynamic height is post-MVP experimental, measured, cached and bounded after scroll anchoring is proven. `--mg-row-height` cannot silently change fixed virtualization; core must receive row height option or adapter must sync measured token.

Column virtualization must be settled by ADR before Usable Grid MVP. The acceptable alternatives are: implement column virtualization, or cap default rendered columns and document the performance/accessibility fallback.

### Buyuk veri ve real-time guncellemeler

```ts
export interface GridDataPatch<TData> {
  kind: "upsert" | "delete" | "replaceRange" | "invalidate";
  rows?: readonly TData[];
  rowIds?: readonly RowId[];
  revision?: string | number;
  optimisticId?: string;
}
```

Rules:

- streaming updates batch to max one visual commit per frame;
- no full data clone per patch;
- stale async versions are ignored;
- sorting/filtering invalidates affected index sets; if threshold exceeded, async/server path is recommended.

Accessibility constraint: focused row/cell must not be unmounted by virtualization; `aria-rowindex` and `aria-colindex` are absolute, not viewport-relative.

## 18. Accessibility

Interactive mode uses `role="grid"`, `row`, `columnheader`, `gridcell`; read-only mode may use native table semantics. Roving `tabindex` is default; `aria-activedescendant` is not MVP default.

Keyboard matrix:

| Key | Navigation mode | Editing/menu mode |
|---|---|---|
| Tab | Enter/exit grid as one tab stop | Move out of active widget according to widget behavior |
| Arrow keys | Move focused cell/header | Owned by input/editor unless plugin documents otherwise |
| Home/End | Row start/end | Editor caret unless escaped |
| Ctrl/Meta+Home/End | Grid start/end | Editor native behavior where applicable |
| Page Up/Down | Move viewport page and render target | Editor native behavior |
| Enter | Activate or enter editing | Commit where editor defines |
| Space | Toggle selection/action | Widget native behavior |
| Escape | Clear range/menu or leave grid mode | Cancel editor/menu and restore focus |
| Shift+Arrow | Range selection if enabled | Text selection/editor native behavior |

Focus restoration fallback:

1. same rowId + columnId;
2. same rowId + first visible focusable column;
3. same columnId + nearest visible row;
4. first visible data cell;
5. empty-state container.

Manual AT matrix:

- NVDA + Firefox;
- JAWS + Chrome/Edge;
- VoiceOver + Safari macOS;
- VoiceOver + iOS Safari;
- TalkBack + Android Chrome.

Acceptance includes axe critical/serious zero, forced colors visible focus/selection/error, reduced motion disabling scroll/reorder animations, and 200/400% zoom checks.

## 19. Guvenlik

Defaults:

- renderer output is untrusted;
- raw HTML is not MVP default and must be named `unsafeHtml` when added;
- URL protocols `javascript:`, `data:`, `vbscript:` rejected unless explicit safe allowlist;
- CSV/spreadsheet formula injection neutralized by default;
- server sort/filter structured and allowlisted;
- no row data, credentials, cell values or raw filter values logged by default;
- state hydration rejects `__proto__`, `prototype`, `constructor`.

CSV contract:

```ts
export type CsvFormulaPolicy = "escape" | "strip" | "allow";
const dangerousCsvPrefix = /^[=+\-@\t\r\n]/;

export function escapeCsvCell(value: unknown, policy: CsvFormulaPolicy = "escape") {
  const text = String(value ?? "");
  if (policy === "strip") return text.replace(dangerousCsvPrefix, "");
  if (policy === "escape" && dangerousCsvPrefix.test(text)) return `'${text}`;
  return text;
}
```

## 20. Test stratejisi

Validation order once scripts exist:

1. focused unit/component tests;
2. typecheck;
3. lint;
4. accessibility checks;
5. browser/e2e checks;
6. build/package boundary checks;
7. benchmark/bundle checks when relevant.

Tooling recommendation: Vitest, Testing Library DOM/user-event, Playwright, axe-core, API Extractor or publint/are-the-types-wrong, package boundary tests, bundle-size checks.

Release gates:

- TypeScript strict zero errors;
- core unit tests for state/datasource/virtualization;
- component tests for roles/focus/keyboard/renderer escaping;
- Playwright Chromium PR smoke; Chromium/Firefox/WebKit on main;
- axe critical/serious zero;
- 100k row scenario does not full-DOM render;
- stale response tests pass;
- package exports and sideEffects pass package lint.

## 21. Paketleme ve dagitim

ESM-first, side-effect-aware packages:

```json
{
  "name": "@m-grid/core",
  "version": "0.1.0",
  "type": "module",
  "sideEffects": false,
  "files": ["dist"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "development": "./dist/index.dev.js",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./plugins": {
      "types": "./dist/plugins.d.ts",
      "import": "./dist/plugins.js",
      "default": "./dist/plugins.js"
    },
    "./package.json": "./package.json"
  },
  "types": "./dist/index.d.ts",
  "engines": { "node": ">=18.18" }
}
```

Theme package:

```json
{
  "name": "@m-grid/theme-default",
  "type": "module",
  "sideEffects": ["**/*.css"],
  "exports": {
    "./base.css": "./dist/base.css",
    "./light.css": "./dist/light.css",
    "./dark.css": "./dist/dark.css",
    "./compact.css": "./dist/compact.css",
    "./comfortable.css": "./dist/comfortable.css",
    "./mobile.css": "./dist/mobile.css",
    "./package.json": "./package.json"
  }
}
```

Recommended CSS imports:

```ts
import "@m-grid/theme-default/base.css";
import "@m-grid/theme-default/light.css";
```

Versioning: fixed versioning during 0.x with Changesets. 1.x may revisit independent versioning.

## 22. Developer experience ve dokumantasyon

Docs IA:

```txt
getting-started/
concepts/
styling/
responsive/
features/
server-data/
accessibility/
performance/
api/
examples/
migration/
troubleshooting/
```

Error format:

```txt
[MGRID-COL-001] Column id collision: "status" is used by multiple columns.
Each column must resolve to a unique id. Set `id` explicitly on one of the columns.
Docs: https://m-grid.dev/errors/MGRID-COL-001
```

Debug logs must avoid row/cell/filter values. Quick start must render a useful React or vanilla grid in under 10 minutes after packages exist.

## 23. Risk kaydi

| Risk | Olasilik | Etki | Erken sinyal | Azaltma | Sahip |
|---|---:|---:|---|---|---|
| Core'a React/DOM/CSS sizmasi | Orta | Yuksek | core import graph browser/framework gosterir | package-boundary CI, ADR-002 | Architecture |
| Virtualization focus kaybi | Yuksek | Yuksek | PageDown/sort/filter sonrasi focus body'ye duser | logical focus state, focused row pinning | A11y/Perf |
| Card mode grid semantigiyle karisir | Orta | Yuksek | role=grid icinde card DOM | card=list semantics, opt-in | Responsive/A11y |
| CSS specificity regressions | Orta | Orta | override icin `!important` gerekir | specificity tests, :where(), layers | Styling |
| Dynamic row height scroll jump | Yuksek | Orta | expansion/measure sonrasi viewport ziplari | post-MVP, scroll anchoring tests | Perf |
| Datasource race corrupts state | Orta | Yuksek | old request rows overwrite current query | requestId/queryKey/signal discard in core | Data |
| Server filter injection | Orta | Yuksek | raw filter strings sent to backend | typed operators, allowlist, limits | Security |
| Plugin API early freeze | Orta | Orta | plugin authors depend on internal shapes | experimental tags, narrow contracts | Architecture |
| CSS sideEffects misconfigured | Orta | Orta | production build drops CSS | package lint, tarball smoke | Packaging |
| MVP scope too broad | Yuksek | Yuksek | editing/grouping/dynamic/card all targeted at once | slice roadmap, strict MVP boundary | Product |

## 24. Yol haritasi

See [roadmap](./roadmap.md) for the detailed 12-month plan.

## 25. ADR listesi

See [ADR README](./adr/README.md). First ADRs:

- ADR-001 Hybrid headless/styled architecture
- ADR-002 Core must not depend on DOM/framework/CSS
- ADR-003 Package topology and dependency direction
- ADR-004 State, command and event model
- ADR-005 Required stable row identity
- ADR-006 Datasource request lifecycle and stale-response protection
- ADR-007 CSS/theming contract
- ADR-008 Responsive strategy contract
- ADR-009 Accessibility navigation model
- ADR-010 Virtualization baseline
- ADR-012 MVP boundary and deferred plugins

## 26. MVP kabul kriterleri

See [MVP acceptance criteria](./mvp-acceptance-criteria.md).

## 27. Performans benchmark plani

See [performance benchmark plan](./performance-benchmark-plan.md).

## 28. Responsive test matrisi

See [responsive test matrix](./responsive-test-matrix.md).

## 29. Ilk 12 aylik plan

Summarized in [roadmap](./roadmap.md).

## 30. Uygulamaya baslanabilecek ornek baslangic kodu

This task intentionally does not create production code. The first implementation slice should create package scaffolding and minimal public type placeholders only after these documents are approved.

## 31. Cozulmemis kararlar

- Final CSS prefix.
- ESM-only versus CJS fallback.
- Whether column virtualization is required for MVP release or post-MVP hardening.
- Whether CSV export is later promoted by ADR.
- Minimum supported browser/AT matrix and real-device ownership.
- Docs site stack.
