# ADR Backlog

## English

This directory holds Architecture Decision Records for `@m-grid`. ADR explanations are bilingual, while code blocks, identifiers, package names and technical artifacts remain English-only.

## Turkce

Bu dizin `@m-grid` icin Architecture Decision Record dosyalarini tutar. ADR aciklamalari iki dilli olur; code block, identifier, paket adi ve teknik artifact'ler English-only kalir.

## ADR Format

- Status: Proposed, Accepted, Superseded, Rejected
- Context
- Decision
- Rationale
- Alternatives
- Consequences
- Validation
- Open questions

## Initial ADRs

| ID | Title | Status | Why It Matters |
|---|---|---|---|
| ADR-001 | Hybrid product architecture | Accepted | Defines the product model |
| ADR-002 | Core dependency boundary | Accepted | Keeps core framework, DOM and CSS independent |
| ADR-003 | Package topology | Accepted | Sets initial packages |
| ADR-004 | Vue as first stable adapter | Accepted | Replaces the previous React-first assumption |
| ADR-005 | State, command, selector and event model | Proposed | Keeps controlled/uncontrolled behavior unified |
| ADR-006 | Mandatory stable row identity | Proposed | Enables selection, focus, datasource and virtualization correctness |
| ADR-007 | Datasource lifecycle and stale-response protection | Proposed | Prevents race-condition state corruption |
| ADR-008 | CSS and theming contract | Proposed | Keeps styling optional and low-specificity |
| ADR-009 | Responsive priority-column strategy | Accepted | Sets mobile default to priority columns with horizontal-scroll fallback |
| ADR-010 | Accessibility navigation model | Proposed | Defines ARIA and keyboard behavior |
| ADR-011 | Fixed-height virtualization baseline | Proposed | Keeps MVP performance measurable |
| ADR-012 | Security defaults | Proposed | Covers unsafe rendering, export and logging defaults |
| ADR-013 | MVP boundary | Accepted | Splits Contract MVP and Usable Grid MVP |
| ADR-014 | English-only code and bilingual documentation policy | Accepted | Defines language rules |
| ADR-015 | Browser support policy | Accepted | Supports latest two major versions |
| ADR-016 | MIT licensing and no Community/Pro split during first year | Accepted | Locks first-year product policy |
| ADR-017 | ESM-first package exports and CSS entry points | Proposed | Protects tree-shaking and CSS delivery |
| ADR-018 | Column virtualization or rendered-column cap | Proposed | Resolves DOM-cell budget before public MVP |

## Current Decisions

- Product architecture is Hybrid.
- Package scope is `@m-grid`.
- License is MIT.
- There is no Community/Pro separation during the first year.
- Initial packages are `@m-grid/core`, `@m-grid/dom`, `@m-grid/vue`, and `@m-grid/theme-default`.
- Vue is the first stable framework adapter.
- React and Svelte are post-MVP adapters.
- Editing is outside MVP.
- Default mobile strategy is priority-based columns with horizontal-scroll fallback.
- Supported browsers are the latest two major versions of supported browsers.
- Core does not define renderer-specific or framework-specific public types.
- Stacked/card mode is post-MVP experimental and uses list/detail semantics, not ARIA grid.
- Raw HTML rendering is not MVP default.
- Third-party plugin API is experimental until plugin-v1 ADR is accepted.

## Replaced Decisions

- React as the first stable adapter was replaced by Vue as the first stable adapter.
- React rendering was removed from Usable Grid MVP.
- Community/Pro split during the first year was rejected.
- Card/stacked renderer as an MVP mobile default was rejected.
- Dynamic row height and editing as MVP features were rejected.

## Open Questions

- ESM-only versus CJS compatibility.
- Final CSS class prefix.
- Whether column virtualization is required for MVP release or a rendered-column cap is acceptable.
- Whether CSV export is later promoted by ADR.
- Docs site stack.
- Manual assistive technology device ownership.
