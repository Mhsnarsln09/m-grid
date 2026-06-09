# ADR-008: CSS And Theming Contract

## Status

Proposed

## English

Decision: `@m-grid/theme-default` is optional, uses CSS custom properties, low-specificity selectors, no global reset and no required `!important`.

Rationale: Styling must be easy to override and must interoperate with application design systems.

Consequences: The grid must function without the default theme. CSS files must be exported as explicit entry points and marked as side effects.

## Turkce

Karar: `@m-grid/theme-default` opsiyoneldir; CSS custom property, low-specificity selector, global reset yok ve zorunlu `!important` yoktur.

Gerekce: Styling kolay override edilebilir olmali ve uygulama design system'leriyle birlikte calismalidir.

Sonuc: Grid default theme olmadan calisir. CSS dosyalari explicit entry point olarak export edilir ve side effect olarak isaretlenir.
