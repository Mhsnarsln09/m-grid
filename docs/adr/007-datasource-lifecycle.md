# ADR-007: Datasource Lifecycle And Stale-Response Protection

## Status

Proposed

## English

Decision: Datasource requests include `AbortSignal`, `requestId` and `queryKey`; stale-response discard belongs in core.

Rationale: Datasource implementations should not be trusted to handle race conditions consistently.

Consequences: Old responses cannot mutate rows, totals, selection, pagination, focus or data status after a newer query is active.

## Turkce

Karar: Datasource request'leri `AbortSignal`, `requestId` ve `queryKey` icerir; stale-response discard core sorumlulugudur.

Gerekce: Datasource implementation'larinin race condition yonetimini tutarli yapacagi varsayilmaz.

Sonuc: Eski response'lar yeni query aktifken rows, totals, selection, pagination, focus veya data status degistiremez.
