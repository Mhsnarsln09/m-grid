# ADR-010: Accessibility Navigation Model

## Status

Proposed

## English

Decision: Interactive mode uses ARIA grid semantics and roving focus. Read-only mode may use table semantics.

Rationale: Keyboard navigation and screen-reader semantics are product requirements.

Consequences: Virtualization must preserve positional metadata and focus restoration. Stacked/card mode must not pretend to be an ARIA grid.

## Turkce

Karar: Interactive mode ARIA grid semantics ve roving focus kullanir. Read-only mode table semantics kullanabilir.

Gerekce: Keyboard navigation ve screen-reader semantics urun gereksinimidir.

Sonuc: Virtualization positional metadata ve focus restoration'i korumalidir. Stacked/card mode ARIA grid gibi davranmamalidir.
