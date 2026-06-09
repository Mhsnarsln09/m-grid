# Roadmap

## English

This roadmap reflects the final product decisions: Vue first, MIT license, no Community/Pro split during the first year, and no production code during architecture-update tasks.

## Turkce

Bu roadmap guncel urun kararlarini yansitir: once Vue, MIT lisans, ilk yil Community/Pro ayrimi yok ve mimari guncelleme gorevlerinde production code yok.

This roadmap is intentionally scoped. The project should earn complexity by validating package boundaries, accessibility and performance before adding enterprise breadth.

## Month 0-1: Architecture Approval

Deliverables:

- approve architecture analysis;
- approve ADR backlog;
- decide final CSS prefix;
- confirm MIT license file and package metadata;
- decide ESM-only stance;
- choose docs site stack.

Acceptance:

- open questions have owner and due date;
- first implementation slice is approved;
- no production behavior is started before core ADRs are accepted.

## Month 1-2: Package Contract Slice

Deliverables:

- pnpm workspace;
- `@m-grid/core`, `@m-grid/dom`, `@m-grid/vue`, `@m-grid/theme-default` package boundaries;
- strict TS config;
- ESM exports and CSS entry points;
- package-boundary tests;
- minimal public type placeholders;
- first ADR files;
- docs IA skeleton.

Acceptance:

- `pnpm -r build`, `typecheck`, `package:check` pass once scripts exist;
- core has no framework/DOM/CSS imports;
- CSS package `sideEffects` preserves CSS;
- public exports are narrow.

## Month 2-3: Core State And Columns

Deliverables:

- `ColumnDef<TData, TValue>`;
- column normalization and ID collision diagnostics;
- required `getRowId`;
- normalized `GridState`;
- command/reducer/transaction pipeline;
- controlled/uncontrolled state path;
- type tests.

Acceptance:

- same command sequence produces same transaction snapshots;
- controlled slice drift warning exists;
- type tests cover accessorKey, accessorFn, computed values and renderer params.

## Month 3-4: DOM, Theme And Accessibility Baseline

Deliverables:

- DOM slot/class/data attribute contract;
- ARIA grid/table semantic modes;
- roving tabindex navigation;
- focus restoration;
- base/light/dark/compact/comfortable/mobile CSS entries;
- forced-colors and reduced-motion tokens.

Acceptance:

- axe critical/serious zero in smoke;
- keyboard matrix automated;
- unstyled mode usable;
- CSS override and specificity tests pass.

## Month 4-5: Client Features

Deliverables:

- client sorting;
- basic filtering;
- pagination;
- row selection;
- column visibility/order/width state;
- stable events;
- Vue and DOM/vanilla examples.

Acceptance:

- selection survives sort/filter/page;
- user column visibility persists through responsive changes;
- examples use real package imports.

## Month 5-6: Datasource Contract

Deliverables:

- `GridDataSource<TData>`;
- `AbortSignal`, `requestId`, `queryKey`;
- stale-response discard in core;
- loading/error/partial states;
- server sort/filter structured models;
- race-condition tests.

Acceptance:

- stale responses cannot mutate rows/selection/pagination/focus;
- unknown and estimated totals render;
- server projection is separate from responsive visibility.

## Month 6-7: Fixed Virtualization

Deliverables:

- fixed row virtualization range math;
- DOM rendering integration;
- row/cell DOM budgets;
- focus pinning/restoration under virtual scroll;
- benchmark harness seed fixtures.

Acceptance:

- 100k rows do not full-DOM render;
- PageDown renders/focuses target;
- scroll budgets measured;
- teardown memory smoke passes.

## Month 7-8: Responsive MVP

Deliverables:

- container measurement in DOM/adapter;
- responsive state resolver;
- priority-based columns with horizontal-scroll fallback;
- narrow filter/sort/pagination/action placement;
- responsive test matrix automation.

Acceptance:

- 320-1920px container matrix passes;
- modal/drawer/sidebar contexts pass;
- stacked/card mode remains post-MVP experimental and is not a Usable Grid MVP gate.

## Month 8-9: Security And Export Plugin

Deliverables:

- CSV-safe export plugin only if a later ADR explicitly promotes it;
- URL validation helpers;
- logger privacy;
- prototype pollution guards;
- security regression tests.

Acceptance:

- CSV formula injection escaped by default when the export plugin exists;
- raw HTML remains unavailable or explicitly unsafe and sanitized;
- server filter limits documented.

## Month 9-10: Release Candidate Hardening

Deliverables:

- docs quick start;
- troubleshooting errors;
- package tarball smoke;
- API extractor/publint;
- bundle-size checks;
- browser matrix on main.

Acceptance:

- RC can be installed in clean temp project;
- public API diff reviewed;
- migration notes for all breaking 0.x changes.

## Month 10-12: Post-MVP Plugins And Adapters

Candidate work:

- column resize/reorder/pinning hardened plugins if not already included;
- inline editing beta only after MVP;
- dynamic row height beta;
- React/Svelte beta adapters;
- infinite/cursor datasource helpers;
- testing package;
- Storybook/visual lab;
- devtools prototype.

Acceptance:

- each plugin has its own API, a11y and security acceptance criteria;
- no advanced feature enters core without ADR.

## Deferred Enterprise Features

- grouping;
- aggregation;
- pivot;
- tree data;
- Excel export;
- range selection;
- fill handle;
- formulas;
- master-detail;
- charts integration;
- saved enterprise views.
