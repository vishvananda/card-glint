# Rendering inputs and asset preparation

[Magic pack](../README.md) · [Documentation index](README.md)

Use `frameColors` when a physical printing uses a different palette from its
rules colors. For example, `colors: ['U'], frameColors: ['G']` keeps the blue
card identity while selecting green frame/panel styling from the existing
assets. Mana symbols are supplied independently. An explicit empty array selects
a colorless palette; omitting the field uses `colors`. The recipe snapshots the
override with the rest of the presentation input. For historical `Summon` type
labels, supply `creature: true` so changing the visible type does not lose that
semantic flag.

Supply `canonicalTypeLine` for an effective English type independently of the
visible localized or historical `typeLine`. Profiles, Futureshifted type icons,
native split routing, and printing compatibility use that semantic value without
changing the printed label. Provider wording adapters preserve the Oracle type
by default; a host-supplied effective canonical type takes precedence.
