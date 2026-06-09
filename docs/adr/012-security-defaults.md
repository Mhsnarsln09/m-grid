# ADR-012: Security Defaults

## Status

Proposed

## English

Decision: Raw HTML rendering is not in MVP. Renderer output and user data are untrusted. Runtime messages and logs are English and must not include sensitive row or filter data.

Rationale: Custom renderers, exports and server filters are high-risk grid surfaces.

Consequences: CSV export is outside MVP unless a later ADR promotes it. Server filters require structured operators and allowlist validation.

## Turkce

Karar: Raw HTML rendering MVP'de yoktur. Renderer output ve user data untrusted kabul edilir. Runtime message ve log'lar English olur ve hassas row/filter data icermez.

Gerekce: Custom renderer, export ve server filter grid paketlerinde yuksek riskli yuzeylerdir.

Sonuc: CSV export ancak daha sonra bir ADR promote ederse MVP'ye girer. Server filter'lar structured operator ve allowlist validation ister.
