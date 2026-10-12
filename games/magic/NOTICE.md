# Magic pack: sources and fan-content notice

This Magic game pack is unofficial Fan Content permitted under the
[Fan Content Policy](https://company.wizards.com/en/legal/fancontentpolicy).
Not approved/endorsed by Wizards. Portions of the materials referenced are
property of Wizards of the Coast. ©Wizards of the Coast LLC.

The drawing code is covered by the repository's MIT OR Apache-2.0 license.
That license does not apply to the external assets referenced in [assets.json](assets.json).
No third-party frame, symbol, illustration or font binaries are included here.
Importing the pack does not load them; painting a Magic face and loading its
optional font stylesheet requests the referenced URLs.

| Resource                | Source                                                                            | Pinned revision                            |
| ----------------------- | --------------------------------------------------------------------------------- | ------------------------------------------ |
| Modern frames and fonts | [wingedsheep/mtg-card-renderer](https://github.com/wingedsheep/mtg-card-renderer) | `b52888cda57a99b5b7dd47bc4fdfae47383a93f9` |
| Retro frames and fonts  | [Investigamer/cardconjurer](https://github.com/Investigamer/cardconjurer)         | `2fcddba8966156d484cedf54d8214996748dd5e1` |
| Historic symbol font    | [Andrew Gioia’s Mana](https://github.com/andrewgioia/mana)                        | `6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8` |
| Set symbol vectors      | [Andrew Gioia's Keyrune](https://github.com/andrewgioia/keyrune)                  | `256add455a043462f7b2bfa224ca71bfc66b62ab` |

External materials retain their own licenses and rights restrictions. Keyrune's
SVG sources are GPL-3.0. These references do not grant permission to redistribute
the assets. The generic renderer and original showcase do not load this pack.

The modern MPlantin italic face also uses CardConjurer's pinned
[`fonts/mplantin-i.ttf`](https://github.com/Investigamer/cardconjurer/blob/2fcddba8966156d484cedf54d8214996748dd5e1/fonts/mplantin-i.ttf).
The accuracy tools download [Scryfall references](https://scryfall.com/docs/api/images)
into an ignored local cache. Card scans and art crops retain their original
rights and are not included in releases, the public showcase, or CI evidence.

The accuracy tools also cache [MTGJSON set data](https://mtgjson.com/downloads/all-sets/)
for printing-specific `originalText`, joined by Scryfall printing ID. Downloaded
data stays local; source checksums and provenance are recorded in study reports.
Scan-reviewed corrections take precedence. The optional `originalType` field is
not automatically applied because it contains modernized types in some old sets.

The `GLINT` gem and `FORGE` spark/anvil symbols are original procedural symbols
for locally authored cards, not official set identities.

Mirage/Tempest and Fourth Edition use Mana’s `tap-4ed` glyph (U+EA31), the
tilted-card mark, from the pinned external font. Revised uses its earlier
diagonal-T `tap-alt` / `tap-3ed` glyph (U+E61C). Both retain pale circular
backgrounds. See the [Mana icon reference](https://mana.andrewgioia.com/icons.html).

Revised header costs also use Mana’s original white sun (`w-original`, U+E997),
without a circular background. Other header symbols retain the existing SVG
assets; inline symbols follow their separate printing policies.
