# Performance Benchmark Plan

## English

This plan follows the project browser policy: supported browsers are the latest two major versions of each supported browser.

## Turkce

Bu plan proje browser policy kararini izler: desteklenen tarayicilarin her biri icin son iki major surum desteklenir.

## Purpose

Performance claims require repeatable measurements. This plan defines datasets, metrics, budgets and failure criteria before implementation.

## Benchmark Rows

```ts
type BenchRow = {
  id: string;
  index: number;
  name: string;
  status: "new" | "active" | "paused" | "closed";
  amount: number;
  ratio: number;
  date: string;
  country: string;
  description: string;
};
```

Dataset sizes:

| Rows | Columns | Purpose |
|---:|---:|---|
| 10 | 10 | No-virtualization baseline and correctness |
| 100 | 20 | Normal app baseline |
| 1,000 | 50 | Virtualization threshold |
| 10,000 | 100 | Large client-side grid |
| 100,000 | 100 | Extreme virtualization and memory scenario |

Variants:

- fixed row height;
- dynamic height stress, post-MVP: 20% wrapped rows, 5% expanded detail, estimate error +/-50%;
- pinned: 2 left columns, 1 right column, 1 top row, 1 bottom summary row;
- streaming: 1,000 updates/sec for 30 seconds, 5% inserts, 80% updates, 15% deletes;
- server-data race: rapid sort/filter/page changes with out-of-order responses;
- mobile 375px horizontal table;
- mobile 375px priority-columns with horizontal-scroll fallback;
- mobile 375px stacked-card, post-MVP experimental only.

## Metrics

- first render time;
- time to first focusable cell;
- rendered row count;
- rendered cell count;
- p95 and p99 scroll frame time;
- dropped-frame percentage during 10s scroll;
- selection toggle latency;
- keyboard navigation latency;
- sort/filter visual feedback latency;
- client sort/filter completion time;
- memory growth after mount/unmount;
- retained heap after teardown;
- package gzip and brotli size;
- CSS size for base + light theme;
- datasource stale-response discard latency;
- streaming visual commits per second.

## Initial Calibration Budgets

These are calibration targets until the benchmark harness exists. They become release gates only after the harness is committed, run on agreed hardware/browser classes, and adjusted by ADR if needed.

| Metric | Budget |
|---|---:|
| First render 10 rows | <=100ms p95 |
| First render 100 rows | <=150ms p95 |
| First render 1,000 rows | <=250ms p95 |
| First render 10,000 rows | <=500ms p95 |
| First render 100,000 rows | <=900ms p95 |
| Scroll frame p95 | <=16.7ms |
| Scroll frame p99 | <=33ms |
| Dropped frames | <=5% |
| Selection toggle | <=50ms p95 |
| Keyboard navigation | <=50ms p95 |
| Sort/filter visual feedback | <=100ms |
| DOM cells warning | >5,000 |
| DOM cells failure | >10,000 default config unless ADR-approved rendered-column cap applies |
| Retained heap after teardown | <=5MB excluding user row data |
| Streaming commits | <=60 visual commits/sec |
| Core gzip | <=20KB target |
| Vue adapter gzip | <=12KB target |
| Base + light CSS gzip | <=10KB target |

## Virtualization Assertions

- Fixed row virtualization returns correct start/end/overscan/spacer/total size for all row counts.
- Rendered rows are visible rows + overscan * 2 + pinned rows.
- Column virtualization supports variable widths and absolute `aria-colindex`.
- If column virtualization is deferred, a rendered-column cap must keep DOM cells under budget and warn when exceeded.
- Focused row/cell is kept mounted or restored before focus is applied.
- Recycled DOM does not leak state attributes or classes.
- Dynamic height mode, when implemented, preserves scroll anchor after measurements above viewport.

## Scheduler Rules To Verify

- Scroll event stores latest viewport and does not synchronously recompute all rows.
- Range calculation happens in `requestAnimationFrame`.
- ResizeObserver updates are batched and guarded against loops.
- DOM reads and writes are not interleaved in tight loops.
- Streaming updates batch to at most one visual commit per frame.

## Datasource Race Scenarios

1. Sort A starts `r1`; sort B starts `r2`; `r1` resolves last and is discarded.
2. Filter changes while page 5 loads; page resets to 0 and old page response is discarded.
3. Infinite range 100-150 requested twice; second request joins or dedupes.
4. Cursor response returns old cursor after filter changes; cursor is ignored.
5. Optimistic update is followed by stale server snapshot; reconciliation policy is applied.
6. Streaming delete for unloaded selected row updates selection or missing-row policy.

## Browser Matrix

PR smoke:

- Chromium latest two major versions where available in CI;
- WebKit smoke for Safari-class regressions.

Main:

- Chrome latest two major versions;
- Firefox latest two major versions;
- WebKit/Safari latest two major versions where available;
- Edge latest two major versions through Chromium smoke or scheduled channel.

Nightly/manual:

- iOS Safari real device or closest available WebKit run;
- Android Chrome real device or closest available emulation;
- forced colors on Windows;
- reduced motion;
- 200% and 400% zoom.

## Reporting Format

Each benchmark run should record:

- git commit;
- package versions;
- browser and OS;
- hardware class;
- dataset seed;
- scenario name;
- metrics table;
- pass/fail status;
- flamegraph/trace link when failing.

## Acceptance

No performance claim may be published until:

- benchmark fixture is committed;
- thresholds are documented;
- current run passes thresholds;
- failures are triaged as P0/P1/P2/P3;
- docs distinguish measured facts from assumptions.
