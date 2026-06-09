# ADR-005: State, Command, Selector And Event Model

## Status

Proposed

## English

Decision: Controlled and uncontrolled usage share one reducer/command execution path. Selectors provide read access and events report slice-level changes.

Rationale: Separate behavior models create adapter drift and make framework parity difficult.

Consequences: Framework adapters call the same core commands. Full state snapshots are available through API reads; change events should remain slice-scoped.

## Turkce

Karar: Controlled ve uncontrolled kullanim tek reducer/command execution path paylasir. Selector'lar okuma saglar, event'ler slice-level degisiklik bildirir.

Gerekce: Ayrik davranis modelleri adapter drift olusturur ve framework parity'yi zorlastirir.

Sonuc: Framework adapter'lari ayni core command'lari cagirir. Full state snapshot API okumasi ile alinir; change event'leri slice-scoped kalir.
