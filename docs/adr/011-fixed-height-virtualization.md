# ADR-011: Fixed-Height Virtualization Baseline

## Status

Proposed

## English

Decision: MVP virtualization baseline is fixed row height.

Rationale: Fixed row height gives predictable range math and measurable scroll budgets. Dynamic height is too costly before measurement cache and scroll anchoring are proven.

Consequences: Dynamic row height is post-MVP. Column virtualization versus rendered-column cap remains a separate ADR decision.

## Turkce

Karar: MVP virtualization baseline fixed row height olur.

Gerekce: Fixed row height ongorulebilir range math ve olculebilir scroll budget saglar. Dynamic height, measurement cache ve scroll anchoring kanitlanmadan fazla maliyetlidir.

Sonuc: Dynamic row height post-MVP kalir. Column virtualization veya rendered-column cap karari ayri ADR konusudur.
