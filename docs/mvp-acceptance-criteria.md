# MVP Acceptance Criteria

## English

MVP decisions are Vue-first, MIT-licensed, and split between Contract MVP and Usable Grid MVP.

## Turkce

MVP kararlari Vue-first, MIT lisansli ve Contract MVP ile Usable Grid MVP olarak iki asamalidir.

This document turns broad claims into measurable gates. No claim should be used in release notes or marketing until the related gate passes.

## Contract MVP

Contract MVP includes:

- `@m-grid/core`, `@m-grid/dom`, `@m-grid/vue`, `@m-grid/theme-default`;
- pnpm workspace, strict TypeScript, ESM exports and CSS entry points;
- typed column/options/state/event contracts;
- required stable `getRowId`;
- controlled and uncontrolled state through one reducer/command path;
- column normalization and duplicate ID diagnostics;
- datasource lifecycle contract with `AbortSignal`, `requestId`, `queryKey`, stale-response protection;
- package boundary, API surface and type checks;
- ADRs for architecture, state, datasource, CSS, responsive, accessibility and virtualization.

## Usable Grid MVP

Usable Grid MVP includes:

- Vue rendering adapter and framework-neutral DOM/vanilla rendering foundation;
- client sorting, basic filtering, pagination, row selection, column visibility/order/width state;
- fixed-height row virtualization;
- column virtualization or a documented rendered-column cap chosen by ADR;
- container-width responsive strategy: priority-based columns with horizontal-scroll fallback;
- ARIA grid navigation and focus restoration;
- optional low-specificity CSS theme and unstyled mode.

MVP excludes:

- pivoting, charts, formulas, tree data, row grouping, aggregation;
- Excel export, fill handle, advanced range selection;
- production dynamic row height;
- stacked/card renderer except post-MVP experimental plugin;
- raw HTML rendering;
- React/Svelte stable adapters;
- devtools and saved views;
- CSV export unless explicitly promoted by a later ADR.

## TypeScript API

- `ColumnDef<TData, TValue>` preserves `TData` and `TValue` in formatter, parser, validator and adapter-renderer type tests.
- `accessorKey` accepts only shallow `keyof TData`.
- `accessorFn` supports computed and nested values.
- Computed columns require explicit `id`; duplicate column IDs produce a stable diagnostic.
- Core public types import no React, Vue, Svelte, DOM, JSX, virtual-node or CSS types.
- Core renderer-adjacent contracts expose values and metadata only; concrete render return types belong to adapters.
- Public `.d.ts` snapshots are reviewed before release.

## State And Data

- `getRowId` is required.
- Same command sequence produces identical `GridTransaction` snapshots in core, DOM/vanilla and Vue tests.
- Controlled and uncontrolled slices use the same reducer tests.
- Controlled slices do not support `preventDefault`; parent state is source of truth.
- Missing controlled-state feedback produces a dev warning without logging row/cell/filter values.
- Datasource requests always include `AbortSignal`, `requestId` and `queryKey`.
- A stale response never mutates rows, totals, selection, pagination, focus or data status.
- Selection survives sort, filter, pagination, unload and reload when row IDs are stable.
- Unknown and estimated totals render without fake totals.

## Performance

- First render p95 targets with generated data already in memory: 10 rows <=100ms, 100 <=150ms, 1,000 <=250ms, 10,000 <=500ms, 100,000 <=900ms.
- Scroll p95 frame time <=16.7ms desktop target and p99 <=33ms during 10s continuous scroll.
- Dropped frames <=5% during the scroll benchmark.
- DOM rows <= visible rows + overscan rows * 2 + pinned rows.
- DOM cells warn above 5,000 and fail above 10,000 in default configuration, unless an ADR-approved rendered-column cap is active.
- Selection toggle p95 <=50ms.
- Keyboard navigation p95 <=50ms.
- Sort/filter button visual feedback <=100ms.
- Retained heap attributable to grid after teardown <=5MB for 100k row scenario, excluding user-owned row data.
- Core gzip budget target <=20KB; Vue adapter <=12KB; default base+light CSS <=10KB. These are initial budgets and must be measured before release.

## Responsive

- Container widths tested: 320, 375, 480, 768, 1024, 1280, 1440, 1920 CSS px.
- Same viewport with different grid container widths produces different responsive state when appropriate.
- 320px: no body overflow except explicit `horizontal-table`; touch targets >=44x44 CSS px; actions reachable when row actions are enabled.
- 375px: primary column, filters, sort, pagination, validation and column picker reachable by keyboard and touch.
- 480px: priority columns show required/user-visible columns; horizontal-scroll fallback is available when required columns cannot fit.
- 768px: compact/priority mode works inside modal, drawer and sidebar without clipping filter/sort UI.
- 1024px: normal table supports resize/order where enabled and optional single pinned start column if remaining scroll area >=240px.
- 1280/1440/1920px: configured columns, pinning, resize/order and dense scanning remain available.
- Responsive-hidden columns do not alter server projection or export unless explicitly configured.

## Accessibility

- Interactive mode root uses `role="grid"` with accurate `aria-rowcount` and `aria-colcount`.
- Read-only mode may use native table semantics.
- Rendered rows/cells use absolute 1-based `aria-rowindex` and `aria-colindex`.
- Exactly one grid cell/header has `tabindex="0"` at a time.
- `Tab` enters/exits the grid as one tab stop and does not visit every cell.
- Arrow keys, Home/End, Ctrl/Meta Home/End, Page Up/Down, Enter, Space, Escape follow the documented keyboard model.
- Focus restores after sort, filter, pagination, virtualization remount and responsive strategy change.
- Focused row/cell is not unmounted by virtualization.
- `stacked-card` mode is not a Usable Grid MVP release gate; when shipped experimentally, it must use list/detail semantics and not be announced as grid.
- axe-core critical/serious violations are zero in automated smoke.
- Manual AT scenarios cover NVDA+Firefox, JAWS+Chrome/Edge, VoiceOver+Safari macOS, VoiceOver+iOS Safari, TalkBack+Android Chrome before stable release.
- Forced-colors mode preserves focus, selected, disabled and error state visibility.
- Reduced-motion mode disables animated scroll/reorder transitions.
- 200% and 400% zoom tests do not create keyboard traps or clipped focus rings.

## CSS Customization

- Default theme import is optional.
- Theme CSS uses cascade layers and `:where()` for low specificity.
- Library CSS contains no `!important` except ADR-documented platform workaround.
- Public token, slot, class and MVP data attribute lists are documented and covered by snapshot/contract tests.
- `.orders-grid .mg-cell { ... }` can override default cell styling without `!important`.
- Tailwind preflight, Bootstrap reboot and MUI CssBaseline examples pass visual/a11y smoke.
- Dynamic class/style hooks run only for rendered rows/cells, not the full 100k dataset.
- Recycled DOM nodes do not leak stale public `data-*`, classes or inline styles to another row.
- MVP public data attributes are limited to selection, focus, invalid, disabled, sort, density, responsive size/strategy and virtualization state. Feature-specific attributes become public only when their feature ships.

## Security

- Raw HTML rendering is not available by default in MVP.
- If added later, raw HTML API must be explicitly named `unsafeHtml` and require sanitizer policy.
- CSV formula injection is escaped by default for values beginning with `=`, `+`, `-`, `@`, tab, CR or LF.
- URL values reject `javascript:`, `data:` and `vbscript:` by default.
- Server-side sort/filter payloads are structured by column ID and typed operator, with documented allowlist validation.
- State hydration/deep merge rejects `__proto__`, `prototype`, and `constructor`.
- Default logger never includes row data, credentials, cell values or raw filter values.

## Packaging And Docs

- ESM package exports prevent deep internal imports.
- CSS entry points import directly, e.g. `@m-grid/theme-default/base.css`.
- CSS package `sideEffects` preserves CSS in production bundles.
- Core and adapter JS packages use `sideEffects: false`.
- Package boundary check prevents reverse imports.
- Clean tarball smoke installs and imports each package.
- Quick start renders a Vue or DOM/vanilla grid in under 10 minutes after packages exist.
- Docs include styling, responsive, accessibility, datasource cancellation, stale response and troubleshooting pages.
