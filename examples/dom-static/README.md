# Static DOM Demo Notes

## English

Decision: keep this example as a static-rendering smoke demo for `@m-grid/core`, `@m-grid/dom` and `@m-grid/theme-default`.

Rationale: the repository does not yet have an interactive DOM mount API or framework component. This demo gives the package family a visible browser output without pretending to provide sorting, filtering, virtualization, keyboard navigation or responsive column behavior.

Recommended workflow:

```text
corepack pnpm demo:static
```

Then open `http://127.0.0.1:4173/examples/dom-static/`.

Acceptance criteria:

- the page loads without a bundler;
- `main.mjs` imports the built package output from `packages/core/dist/` and `packages/dom/dist/`;
- row, column and caption text render through `mountStaticGrid`;
- the refresh button swaps visible row data, button text and status text after core state replacement;
- the select next button swaps selected row state through `selection.replace`;
- clicking a row swaps selected row state through `selection.replace`;
- the swap columns button swaps column order through `columns.order.replace`;
- the optional default theme CSS remains replaceable by consumers;
- no interactive grid behavior is implied by the demo.

Open questions: the future DOM mount API, focus model, keyboard navigation and responsive strategies remain out of scope for this example.

## Turkce

Decision: bu ornegi `@m-grid/core`, `@m-grid/dom` ve `@m-grid/theme-default` icin static-rendering smoke demo olarak tut.

Rationale: repository'de henuz interactive DOM mount API veya framework component yok. Bu demo package ailesine gorunur browser ciktisi verir, fakat sorting, filtering, virtualization, keyboard navigation veya responsive column behavior sagladigini ima etmez.

Recommended workflow:

```text
corepack pnpm demo:static
```

Sonra `http://127.0.0.1:4173/examples/dom-static/` adresini acin.

Acceptance criteria:

- page bundler olmadan yuklenir;
- `main.mjs`, built package output'u `packages/core/dist/` ve `packages/dom/dist/` uzerinden import eder;
- row, column ve caption text `mountStaticGrid` ile render edilir;
- refresh button, core state replacement sonrasi visible row data, button text ve status text'i degistirir;
- select next button, selected row state'i `selection.replace` ile degistirir;
- row'a tiklamak selected row state'i `selection.replace` ile degistirir;
- swap columns button, column order'i `columns.order.replace` ile degistirir;
- optional default theme CSS consumer tarafindan degistirilebilir kalir;
- demo interactive grid behavior ima etmez.

Open questions: future DOM mount API, focus model, keyboard navigation ve responsive strategies bu ornegin kapsami disindadir.
