# ADR-015: Browser Support Policy

## Status

Accepted

## English

Decision: `@m-grid` supports the latest two major versions of supported browsers.

Rationale: The package relies on modern platform capabilities such as ResizeObserver, container-aware behavior and advanced accessibility testing.

Consequences: Browser support docs and test matrices target the latest two major versions. Older browsers may receive graceful fallback only when explicitly documented.

## Turkce

Karar: `@m-grid`, desteklenen tarayicilarin son iki major surumunu destekler.

Gerekce: Paket ResizeObserver, container-aware behavior ve advanced accessibility testing gibi modern platform yeteneklerine dayanir.

Sonuc: Browser support docs ve test matrix son iki major surumu hedefler. Daha eski tarayicilar ancak acikca dokumante edilirse graceful fallback alir.
