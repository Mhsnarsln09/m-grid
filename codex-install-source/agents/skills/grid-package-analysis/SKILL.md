---
name: grid-package-analysis
description: Orchestrate a comprehensive architecture and product analysis for an AG Grid-like TypeScript data-grid package, especially CSS customization, responsive/mobile behavior, APIs, performance, accessibility, state, plugins, testing, packaging, security, documentation, and roadmap.
---

# Grid Package Analysis Workflow

Use this skill when the user asks to analyze, architect, plan, compare, scope, or prepare implementation for the data-grid package.

## Source brief

Read:

- `AGENTS.md`
- `docs/original-analysis-prompt.md`
- existing architecture documents and ADRs, when present
- existing package manifests and source tree, when present

Do not begin implementation during the analysis workflow.

## Phase 1: Establish context

1. Determine whether the repository is empty, a prototype, or an existing package.
2. Inventory existing packages, dependencies, public APIs, CSS, tests, and documentation.
3. List confirmed constraints separately from assumptions.
4. Define the target deliverable and its output path.
5. Preserve the original analysis brief; do not replace it with a shorter generic checklist.

## Phase 2: Parallel specialist analysis

Explicitly spawn project custom agents in waves. Wait for all agents in a wave before starting synthesis.

### Wave A: product and architecture

Spawn:

- `product_competitor_researcher`
- `grid_architect`
- `api_typescript_designer`
- `styling_theming_specialist`
- `responsive_mobile_specialist`
- `performance_virtualization_specialist`

Ask each agent to:
- remain within its domain;
- identify cross-domain constraints;
- return implementation-ready decisions and acceptance criteria;
- flag facts needing current external verification.

### Wave B: system integrity and delivery

Spawn:

- `accessibility_specialist`
- `data_state_specialist`
- `quality_security_specialist`
- `dx_packaging_docs_specialist`

Provide them with the relevant Wave A conclusions so they can challenge assumptions instead of starting from zero.

## Phase 3: Draft architecture

Consolidate specialist reports into one coherent draft using `docs/analysis-output-template.md`.

Required outcomes include:

- final product positioning;
- explicit MVP and post-MVP scope;
- package and dependency topology;
- core state and data contracts;
- TypeScript API examples;
- DOM, slot, data-attribute, CSS token, theme, and override contracts;
- responsive strategy-selection API and mobile defaults;
- virtualization and performance budgets;
- accessibility model;
- plugin contract;
- server data-source contract;
- test and security strategy;
- packaging and release strategy;
- documentation structure;
- risk register;
- phased roadmap;
- ADR candidates;
- implementation starter plan.

Do not combine incompatible recommendations without resolving the conflict.

## Phase 4: Independent synthesis review

Spawn `synthesis_reviewer` with:

- all specialist reports;
- the consolidated draft;
- known repository constraints.

Ask it to identify contradictions, missing decisions, unjustified scope, untestable requirements, and likely architectural traps.

Apply accepted review findings to the final analysis. Record rejected findings with rationale when material.

## Phase 5: Deliverables

When permitted to write files, create or update:

- `docs/architecture-analysis.md`
- `docs/adr/` candidate records or an ADR backlog
- `docs/mvp-acceptance-criteria.md`
- `docs/performance-benchmark-plan.md`
- `docs/responsive-test-matrix.md`
- `docs/roadmap.md`

The final response must state:

- files created or changed;
- the core architecture recommendation;
- MVP boundary;
- unresolved decisions;
- validation or research performed;
- recommended first implementation slice.

## Guardrails

- Do not let a single framework dictate core contracts.
- Do not treat mobile as a CSS-only afterthought.
- Do not promise accessibility or performance without acceptance criteria.
- Do not make the default theme mandatory.
- Do not use high-specificity CSS as a shortcut.
- Do not put every advanced feature in the core package.
- Do not use current competitor, browser, licensing, or tool-version claims without verification.
- Do not implement until the analysis and first ADR set are approved or the user explicitly requests implementation.
