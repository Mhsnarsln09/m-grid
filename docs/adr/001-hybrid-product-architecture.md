# ADR-001: Hybrid Product Architecture

## Status

Accepted

## English

Decision: `@m-grid` uses a Hybrid architecture: framework-independent core, framework-neutral DOM layer, first stable Vue adapter, and optional CSS theme.

Rationale: A purely headless package would push DOM, keyboard and accessibility work to users. A styled framework monolith would conflict with framework independence and CSS override goals.

Consequences: Core behavior must stay outside framework adapters. Styled usage is optional. Unstyled usage remains supported.

## Turkce

Karar: `@m-grid` Hybrid mimari kullanir: framework-independent core, framework-neutral DOM katmani, ilk stable Vue adapter ve opsiyonel CSS tema.

Gerekce: Tamamen headless paket DOM, keyboard ve accessibility yukunu kullaniciya birakir. Styled framework monolith ise framework independence ve CSS override hedefleriyle catisir.

Sonuc: Core davranisi framework adapter disinda kalir. Styled kullanim opsiyoneldir. Unstyled kullanim desteklenir.
