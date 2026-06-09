# Project Guidance: Developer-First Data Grid

## Mission

Build and maintain a framework-independent, TypeScript-first data-grid package inspired by the capabilities of AG Grid, while optimizing for:

- developer experience;
- easy CSS customization;
- responsive behavior across desktop, tablet, and mobile;
- accessibility by default;
- high performance on large datasets;
- modular, tree-shakable features;
- stable and well-documented public APIs.

The detailed product-analysis brief is in `docs/original-analysis-prompt.md`.

## Working mode

- For architecture, API, styling, responsive, virtualization, accessibility, data-source, packaging, or security work, inspect the relevant files before proposing changes.
- Use a plan before broad or cross-package changes.
- Separate verified facts, architectural decisions, assumptions, and open questions.
- Do not silently invent package behavior. Record consequential decisions as ADRs.
- Prefer the smallest complete change over broad speculative implementation.
- Never hide a trade-off with vague language such as "make it responsive" or "optimize performance". Define the mechanism, API contract, fallback behavior, and validation method.
- When a task has independent research areas, explicitly spawn the relevant project custom agents and wait for all requested reports before consolidating.

## Architectural defaults

These are defaults, not immutable conclusions. Deviations require a documented rationale.

- Use a framework-independent core with thin framework adapters.
- Prefer a hybrid product: headless/core capabilities plus optional styled packages.
- Use `@m-grid` as the package scope unless an ADR supersedes it.
- Use MIT as the project license unless an ADR supersedes it.
- Do not introduce Community/Pro package separation during the first project year.
- Keep rendering concerns outside the core state/data engine.
- Use strict TypeScript and preserve row-type information through public generics.
- Prefer ESM-first, side-effect-aware packages designed for tree-shaking.
- Keep advanced features modular or plugin-based when they do not belong in the minimum core.
- Avoid framework-specific types in core packages.
- Vue is the first stable framework adapter.
- React and Svelte are post-MVP adapters.
- Do not make any framework adapter the source of truth for behavior shared by other adapters.

## Styling contract

- Styling must be optional and easy to override.
- Prefer CSS custom properties as public design tokens.
- Keep selectors low-specificity; prefer `:where()` and documented cascade layers.
- Do not use `!important` in library styles except for a documented platform workaround.
- Avoid global resets and broad element selectors.
- Expose stable slots/classes and stateful `data-*` attributes for significant parts.
- Support `className`, slot props, and dynamic row/cell/header class hooks.
- Treat inline styles as a narrow escape hatch, not the primary theming API.
- Validate interoperability with Tailwind, Bootstrap, Material UI, and custom design systems.
- Provide light, dark, compact, comfortable, and mobile-oriented token examples.
- Preserve high-contrast and forced-colors usability.

## Responsive contract

- Responsive behavior must work from the grid container, not only the browser viewport.
- Prefer container queries where CSS behavior is sufficient.
- Expose programmatic container-width information only where business logic needs it.
- Support selectable strategies: horizontal table, priority-based column reduction, expandable detail, stacked/card presentation, and user-controlled visibility.
- Do not force card mode for every mobile use case.
- Define touch behavior, focus behavior, pinned-column degradation, action placement, filtering, sorting, and pagination for narrow layouts.
- Test at 320, 375, 480, 768, 1024, 1280, 1440, and 1920 CSS pixels.

## Accessibility contract

- Keyboard navigation and screen-reader semantics are product requirements, not post-release enhancements.
- Maintain a documented navigation model and editing-mode boundary.
- Ensure virtualization preserves correct positional metadata and focus restoration.
- Support reduced motion, forced colors, zoom, touch, and non-pointer operation.
- Public features that affect interaction require accessibility acceptance criteria.

## Performance contract

- Establish benchmarks before claiming performance improvements.
- Test row counts at 10, 100, 1,000, 10,000, and 100,000 where applicable.
- Measure first render, interaction latency, scrolling stability, DOM-node count, memory behavior, and bundle impact.
- Fixed-height virtualization should be the baseline path; dynamic-height behavior must document its cost and fallback.
- Avoid unbounded DOM growth.
- Server-side operations must support cancellation and stale-response protection.
- Real-time updates should be batchable and should not trigger full-grid recomputation without cause.

## Public API rules

- Public APIs must be type-safe, predictable, and framework-neutral where possible.
- Prefer explicit state slices and typed event payloads.
- Support controlled and uncontrolled use without maintaining two incompatible behavior models.
- Public names require tests and documentation.
- Breaking changes require migration notes and, where practical, a codemod or compatibility layer.
- Avoid exposing internal rendering objects as stable public contracts.

## Security rules

- Treat renderer output and user-provided content as untrusted.
- Do not provide unsafe raw-HTML rendering as the default.
- Sanitize or neutralize CSV and spreadsheet formula injection.
- Validate server-side sort and filter inputs.
- Do not log row data, credentials, or sensitive filter values by default.

## Validation expectations

Use the repository's actual scripts when they exist. For a pnpm monorepo, the expected validation order is generally:

1. focused unit or component tests;
2. type checking;
3. linting;
4. relevant accessibility checks;
5. relevant browser/end-to-end checks;
6. build and package-boundary checks;
7. benchmark or bundle checks when performance or packaging changed.

Never claim a check passed unless it was run successfully. Report skipped checks and the reason.

## Documentation expectations

When changing public behavior, update:

- API documentation;
- usage examples;
- accessibility notes;
- responsive behavior notes;
- migration guidance when compatibility changes;
- ADRs for consequential architecture decisions.

## Language policy

### English-only technical artifacts

All source-level and technical artifacts must be written only in English:

- source code;
- variable names;
- function names;
- class names;
- type and interface names;
- enum values;
- file and folder names;
- package names;
- test names;
- test descriptions;
- code comments;
- JSDoc and TSDoc;
- runtime error messages;
- warnings;
- log messages;
- command names;
- configuration keys;
- CSS classes;
- CSS custom properties;
- data attributes;
- commit messages;
- branch names;
- pull request titles;
- generated API declarations;
- code examples inside documentation.

Do not place Turkish words inside source code or code blocks. Do not hardcode Turkish runtime messages into the library. Default runtime text must be English. Future localization must use a separate locale or translation contract.

### Bilingual explanations

Human-readable explanations must be provided in both English and Turkish:

- architecture documents;
- ADR explanations;
- README files;
- developer guides;
- migration guides;
- release explanations;
- decision summaries;
- implementation reports;
- final Codex task reports.

Use this order consistently:

1. English
2. Turkish

For documents, either use paired subsections such as `## English` and `## Turkce`, or use an English paragraph immediately followed by its Turkish equivalent.

Do not translate identifiers, package names, API names, commands, paths, or code snippets. Code blocks must appear once and must remain English-only. Do not duplicate code blocks merely to provide Turkish documentation.

## Output quality

Reports and plans should include:

- decision;
- rationale;
- alternatives;
- advantages;
- disadvantages;
- risks;
- recommended solution;
- acceptance criteria;
- unresolved questions.

Code-review findings should lead with concrete, actionable issues and include file/symbol references where available.
