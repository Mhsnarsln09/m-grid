# ADR-009: Responsive Priority-Column Strategy

## Status

Accepted

## English

Decision: The default mobile strategy is priority-based columns with horizontal-scroll fallback.

Rationale: Card mode is not a safe universal default for data-grid workflows. Priority columns preserve grid semantics while horizontal scroll protects required columns.

Consequences: Stacked/card rendering is post-MVP experimental. Responsive behavior is based on container width, not only viewport width.

## Turkce

Karar: Varsayilan mobil strateji horizontal-scroll fallback ile priority-based columns olur.

Gerekce: Card mode data-grid workflow'lari icin guvenli evrensel default degildir. Priority columns grid semantics'i korur, horizontal scroll ise required column'lari korur.

Sonuc: Stacked/card rendering post-MVP experimental kalir. Responsive davranis yalniz viewport'a degil container width'e dayanir.
