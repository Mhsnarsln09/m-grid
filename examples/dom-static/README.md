# Static DOM Demo Notes

## English

Decision: keep this example as a static-rendering smoke demo for `@m-grid/core`, `@m-grid/dom` and `@m-grid/theme-default`.

Rationale: the repository does not yet have an interactive DOM mount API or framework component. This demo gives the package family a visible browser output without pretending to provide sorting, filtering, virtualization, keyboard navigation or responsive column behavior.

Recommended workflow:

```text
corepack pnpm build
```

Then serve the repository root with any static file server and open `/examples/dom-static/`. The last verified local URL was `http://127.0.0.1:4173/examples/dom-static/`.

Acceptance criteria:

- the page loads without a bundler;
- `main.mjs` imports the built package output from `packages/core/dist/` and `packages/dom/dist/`;
- row, column and caption text render through `renderStaticGridHtml`;
- the optional default theme CSS remains replaceable by consumers;
- no interactive grid behavior is implied by the demo.

Open questions: the future DOM mount API, focus model, keyboard navigation and responsive strategies remain out of scope for this example.

## Turkce

Decision: bu ornegi `@m-grid/core`, `@m-grid/dom` ve `@m-grid/theme-default` icin static-rendering smoke demo olarak tut.

Rationale: repository'de henuz interactive DOM mount API veya framework component yok. Bu demo package ailesine gorunur browser ciktisi verir, fakat sorting, filtering, virtualization, keyboard navigation veya responsive column behavior sagladigini ima etmez.

Recommended workflow:

```text
corepack pnpm build
```

Sonra repository root'unu herhangi bir static file server ile serve edin ve `/examples/dom-static/` adresini acin. Son dogrulanan lokal URL `http://127.0.0.1:4173/examples/dom-static/` idi.

Acceptance criteria:

- page bundler olmadan yuklenir;
- `main.mjs`, built package output'u `packages/core/dist/` ve `packages/dom/dist/` uzerinden import eder;
- row, column ve caption text `renderStaticGridHtml` ile render edilir;
- optional default theme CSS consumer tarafindan degistirilebilir kalir;
- demo interactive grid behavior ima etmez.

Open questions: future DOM mount API, focus model, keyboard navigation ve responsive strategies bu ornegin kapsami disindadir.
