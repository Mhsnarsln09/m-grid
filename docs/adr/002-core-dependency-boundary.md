# ADR-002: Core Dependency Boundary

## Status

Accepted

## English

Decision: `@m-grid/core` must not depend on DOM APIs, CSS, Vue, React, Svelte, browser globals or rendering frameworks.

Rationale: Core must remain usable in non-browser environments and must be testable without DOM or framework runtimes.

Consequences: Core owns state, commands, reducers, selectors, events, row identity, column definitions, datasource contracts and framework-independent public types. Renderer-specific public types belong to adapters.

## Turkce

Karar: `@m-grid/core` DOM API, CSS, Vue, React, Svelte, browser global veya rendering framework bagimliligi tasimaz.

Gerekce: Core non-browser ortamlarda kullanilabilir olmali ve DOM/framework runtime olmadan test edilebilmelidir.

Sonuc: Core state, command, reducer, selector, event, row identity, column definition, datasource contract ve framework-independent public type'lari sahiplenir. Renderer-specific public type'lar adapter'lara aittir.
