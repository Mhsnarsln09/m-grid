# ADR-006: Mandatory Stable Row Identity

## Status

Proposed

## English

Decision: `getRowId` is mandatory.

Rationale: Stable row identity is required for selection, focus restoration, virtualization, server data, pagination, persistence and future transactions.

Consequences: Index-based identity is rejected. Small static examples must still define `getRowId`.

## Turkce

Karar: `getRowId` zorunludur.

Gerekce: Stable row identity selection, focus restoration, virtualization, server data, pagination, persistence ve future transaction davranislari icin gereklidir.

Sonuc: Index-based identity reddedilir. Kucuk static ornekler de `getRowId` tanimlar.
