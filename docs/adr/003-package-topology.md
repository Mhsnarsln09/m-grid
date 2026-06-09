# ADR-003: Package Topology

## Status

Accepted

## English

Decision: Initial package topology is `@m-grid/core`, `@m-grid/dom`, `@m-grid/vue`, and `@m-grid/theme-default`.

Rationale: This is the smallest topology that preserves the core/DOM/adapter/theme boundaries while supporting the Vue-first product decision.

Consequences: `@m-grid/dom` depends on `@m-grid/core`; `@m-grid/vue` depends on `@m-grid/core` and where appropriate `@m-grid/dom`; `@m-grid/theme-default` is optional CSS and must declare CSS side effects correctly.

## Turkce

Karar: Ilk paket topolojisi `@m-grid/core`, `@m-grid/dom`, `@m-grid/vue` ve `@m-grid/theme-default` olur.

Gerekce: Bu topoloji core/DOM/adapter/theme sinirlarini koruyan ve Vue-first kararini destekleyen en kucuk baslangictir.

Sonuc: `@m-grid/dom`, `@m-grid/core` paketine baglidir; `@m-grid/vue`, `@m-grid/core` ve uygun yerlerde `@m-grid/dom` kullanir; `@m-grid/theme-default` opsiyonel CSS'tir ve CSS side effect bilgisini dogru bildirir.
