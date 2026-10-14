# Adventure frame investigation

The current painter still uses component frames and estimated text lengths.
The corrected baseline covers 111 ordinary English nonfoil Adventure printings:
30 ELD, 51 WOE and 30 CLB. All render with their original rules and cached
Scryfall full scans/art. No Adventure frame registration is validated yet;
baseline metrics are deliberately null. The compact
[baseline receipt](fixtures/accuracy/adventure-baseline.json) records its hashes.

## Input findings

MTGJSON repeats a joined `originalText` on both records for 109 of these cards.
The joined field follows the printed book order: inset spell first, permanent
second. The face records use the opposite order. The adapter separates only
an identical pair with exactly one delimiter, preserving the original words.
Two CLB records already supply separate text and remain untouched.

Some printings also repeat the permanent's `originalType` on the spell record.
Only that duplicated pair may use the agreeing MTGJSON and Scryfall per-face
spell types, with the source conflict retained in the manifest. A missing
`originalType` still falls back to the provider's face type; historical type
errata must therefore be reviewed separately. Parent flavor no longer leaks
into the inset spell. The main frame uses the permanent's name, colors, mana
cost, rules and power/toughness; the inset retains its own independent fields.

Fae of Wishes, Horned Loch-Whale and Ratcatcher Trainee have Oracle changes on
both halves, so exact current-text equality cannot identify the original blocks.
Their scans confirm the same spell-first ordering. The baseline preserves
their old words rather than replacing them with Oracle text. The earlier
`adventure-v0217-input-v1` capture has duplicated wording and is unsuitable for
layout comparisons.

## Source-led replacement

The pinned CardConjurer revision `33f2547137fe366b40e9e8dba4eb591af190fddf`
provides 1500 × 2100 full plates in `img/frames/adventure/regular/`, plus
`nyx/` variants and shaped book-left/book-right/pinline masks. Its
[Adventure frame definition](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/js/frames/packAdventure.js)
defines the art aperture, two inset header bands and two independent text areas.
The [MSE Adventure style](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/blob/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-adventure.mse-style/style)
adds measured text fitting, page-specific material selection and optional
short-text centering. These sources remain external references.

Next steps:

1. Use the full native plate and shared art aperture for face painting, printing
   holes, artwork effects and hit regions. Preserve the book fold and page edges.
2. Composite the inset page from its own color material. Callous Sell-Sword and
   Kellan demonstrate why the permanent's color is insufficient. Validate gold,
   artifact, enchantment and legendary variants separately.
3. Replace character-count sizing with measured independent page layouts,
   preserving inline reminders, flavor italics and the flavor divider. Fit the
   permanent page around the power/toughness box.
4. Register scans using frame-only rails, excluding art, text, symbols and stamp.
   Establish ELD geometry and typography, then check WOE/CLB without per-card
   renderer tuning. Keep unsupported fits and source differences visible.

```sh
node tests/magic-special-frame-input.mjs
node games/magic/tools/accuracy/special-frame-audit.mjs adventure-v0217-input-v2 --adventure
```

Captures are immutable and ignored by Git. One browser session prepares the
batch; future structural scoring runs on the CPU. No external image enters the
public showcase or the published package.
