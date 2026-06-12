# Static DOM Demo Notes

## English

Decision: keep this example as a static-rendering smoke demo for `@m-grid/core`, `@m-grid/dom` and `@m-grid/theme-default`.

Rationale: the repository does not yet have an interactive DOM mount API or framework component. This demo gives the package family a visible browser output without pretending to provide virtualized rendering, keyboard navigation or responsive column behavior.

Recommended workflow:

```text
corepack pnpm demo:static
```

Then open `http://127.0.0.1:4173/examples/dom-static/`.

Acceptance criteria:

- the page loads without a bundler;
- `index.html` maps `@m-grid/core` and `@m-grid/dom` to built workspace package output with an import map;
- `main.mjs` imports package names instead of direct relative dist files;
- row, column and caption text render through `mountStaticGrid`;
- the refresh button swaps visible row data, button text and status text after core state replacement;
- the select next button swaps selected row state through `selection.replace`;
- clicking a row swaps selected row state through `selection.replace`;
- the swap columns button swaps column order through `columns.order.replace`;
- the hide total button swaps column visibility through `columns.visibility.replace`;
- the resize total button swaps column sizing through `columns.sizing.replace`;
- the sort total, filter ready and page size buttons exercise processed rows from `getProcessedRows`;
- the static surface exposes processed row counts through `aria-rowcount`, `data-total-row-count` and `data-filtered-row-count`;
- the optional default theme CSS remains replaceable by consumers;
- no interactive grid behavior is implied by the demo.

Troubleshooting: if the controls render but the table does not, restart the demo with `corepack pnpm demo:static`. The script builds package `dist/` output before serving the import-mapped browser page.

Open questions: the future DOM mount API, focus model, keyboard navigation and responsive strategies remain out of scope for this example.

## Turkce

Decision: bu ornegi `@m-grid/core`, `@m-grid/dom` ve `@m-grid/theme-default` icin static-rendering smoke demo olarak tut.

Rationale: repository'de henuz interactive DOM mount API veya framework component yok. Bu demo package ailesine gorunur browser ciktisi verir, fakat virtualized rendering, keyboard navigation veya responsive column behavior sagladigini ima etmez.

Recommended workflow:

```text
corepack pnpm demo:static
```

Sonra `http://127.0.0.1:4173/examples/dom-static/` adresini acin.

Acceptance criteria:

- page bundler olmadan yuklenir;
- `index.html`, `@m-grid/core` ve `@m-grid/dom` package'larini import map ile built workspace package output'a map eder;
- `main.mjs`, direct relative dist file yerine package name import eder;
- row, column ve caption text `mountStaticGrid` ile render edilir;
- refresh button, core state replacement sonrasi visible row data, button text ve status text'i degistirir;
- select next button, selected row state'i `selection.replace` ile degistirir;
- row'a tiklamak selected row state'i `selection.replace` ile degistirir;
- swap columns button, column order'i `columns.order.replace` ile degistirir;
- hide total button, column visibility'yi `columns.visibility.replace` ile degistirir;
- resize total button, column sizing'i `columns.sizing.replace` ile degistirir;
- sort total, filter ready ve page size button'lari `getProcessedRows` uzerinden processed row'lari dener;
- static surface processed row count'lari `aria-rowcount`, `data-total-row-count` ve `data-filtered-row-count` ile expose eder;
- optional default theme CSS consumer tarafindan degistirilebilir kalir;
- demo interactive grid behavior ima etmez.

Troubleshooting: controls gorunup table gorunmuyorsa demo'yu `corepack pnpm demo:static` ile yeniden baslatin. Script, import-mapped browser page'i serve etmeden once package `dist/` output'unu build eder.

Open questions: future DOM mount API, focus model, keyboard navigation ve responsive strategies bu ornegin kapsami disindadir.
