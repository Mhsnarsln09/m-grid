# ADR-014: English-Only Code And Bilingual Documentation Policy

## Status

Accepted

## English

Decision: Source-level and technical artifacts are English-only. Human-readable explanations are bilingual in English first, Turkish second.

Rationale: English-only technical artifacts keep APIs, runtime messages, packages, tests and generated declarations consistent. Bilingual explanations support the project owner and contributors.

Consequences: Do not put Turkish words in source code or code blocks. Do not hardcode Turkish runtime messages. Future localization requires a locale contract.

## Turkce

Karar: Source-level ve technical artifact'ler English-only olur. Human-readable aciklamalar once English, sonra Turkish olmak uzere iki dilli olur.

Gerekce: English-only technical artifact'ler API, runtime message, package, test ve generated declaration tutarliligi saglar. Iki dilli aciklamalar proje sahibini ve contributor'lari destekler.

Sonuc: Source code veya code block icine Turkish kelime konmaz. Turkish runtime message hardcode edilmez. Gelecekte localization icin locale contract gerekir.
