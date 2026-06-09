# ADR-004: Vue As First Stable Adapter

## Status

Accepted

## English

Decision: Vue is the first stable framework adapter. React and Svelte are post-MVP adapters.

Rationale: Product direction explicitly prioritizes Vue. This replaces the previous React-first assumption.

Consequences: Usable Grid MVP includes Vue rendering. Vue ergonomics must not leak into `@m-grid/core` or `@m-grid/dom`; the adapter stays thin.

## Turkce

Karar: Ilk stable framework adapter Vue olur. React ve Svelte post-MVP adapter'lardir.

Gerekce: Urun yonu Vue'yu onceliklendirir. Bu karar onceki React-first varsayimini degistirir.

Sonuc: Usable Grid MVP Vue rendering icerir. Vue ergonomisi `@m-grid/core` veya `@m-grid/dom` paketlerine sizmaz; adapter ince kalir.
