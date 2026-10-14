# Adventure frame investigation

The v0.2.17 painter uses component frames and estimated text lengths.
The corrected baseline covers 111 ordinary English nonfoil Adventure printings:
30 ELD, 51 WOE and 30 CLB. All render with their original rules and cached
Scryfall full scans/art. Baseline metrics are deliberately null until the
frame-only registration below is applied. The compact
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

The native implementation now:

1. Uses the full plate and shared art aperture for face painting, printing
   holes, artwork effects and hit regions, retaining the book fold and page edges.
2. Composites the inset page from its own color material. Callous Sell-Sword and
   Kellan demonstrate why the permanent's color is insufficient. Two-color
   pinlines, hybrid neutral labels, artifact plates and legendary crowns have
   separate source selection. Prepared composites use a 16 MiB LRU and borrow
   decoded assets without owning them. No render-loop decoding or readback occurs.
3. Fits measured independent page layouts, preserving inline reminders, flavor
   italics and the flavor divider. The permanent page excludes power/toughness
   ink and centers a single short rules line; two-line passages remain left
   aligned. Explicit left/original/Oracle alignment controls remain available.
4. Registers scans using frame-only rails, excluding art, text, symbols and stamp.
   Shared text settings were explored on ELD, then used unchanged on WOE/CLB.

## First native comparison (unreleased)

The [native receipt](fixtures/accuracy/adventure-native.json) retains all 111
results, including rejected fits and 22 component regressions. No card has text
overflow. Only 80 scans pass frame registration; CLB's low acceptance needs
investigation before generalizing its averages.

| Set               | Accepted / total | Permanent text F1 | Spell text F1 | White inset headers F1 |
| ----------------- | ---------------- | ----------------- | ------------- | ---------------------- |
| ELD (development) | 25 / 30          | 0.243 → 0.519     | 0.314 → 0.609 | 0.457 → 0.872          |
| WOE (held out)    | 43 / 51          | 0.287 → 0.468     | 0.369 → 0.531 | 0.516 → 0.881          |
| CLB (held out)    | 12 / 30          | 0.324 → 0.507     | 0.325 → 0.562 | 0.448 → 0.863          |

These are local-contrast text edge scores at one canonical pixel, not visual
accuracy percentages. White header text uses light-ink polarity; applying the
dark-lettering detector there would score background contours instead. Before
and after share the same original wording, art and independently normalized scan.
Power/toughness ink is excluded from body-text metrics.

The synthetic rotation test also exposed a generic registration rejection:
when translation-only fitting lost inlier support, its independent validation
error was discarded. The rotation candidate then compared against itself and
could never demonstrate a gain. Rejected candidates now retain that diagnostic;
support, pose bounds and disjoint-validation thresholds are unchanged.

Remaining work before release:

- Source left-page materials are too dark, especially red/blue; both inspected
  MSE page families share the problem. Preserve the native fold while replacing
  or calibrating the paper, rather than coloring over its shadow.
- Stomp, Petty Theft, Cast Off and several later spells need different wrapping.
  A shared maximum improves the average but does not reproduce every printing.
  Do not turn the per-card exploratory optima into renderer exceptions.
- WOE has a newer collector footer format. The prototype still prints the older
  collector/total/rarity layout; artist and power/toughness lettering also need QA.
- Oakhame Ranger's missing historical type falls back to an errataed provider
  type containing Ranger. Treat that as an input provenance issue, not bad geometry.
- Review the 31 rejected frame fits without relaxing acceptance to raise scores.
  Nyx/enchantment-creature plates and further Adventure treatments remain unclaimed.

```sh
node tests/magic-special-frame-input.mjs
node games/magic/tools/accuracy/special-frame-audit.mjs adventure-v0217-input-v2 --adventure
node games/magic/tools/accuracy/adventure-study.mjs adventure-native-v2
node tests/magic-adventure.mjs
node tests/magic-adventure-registration.mjs
```

Captures are immutable and ignored by Git. One browser session prepares the
batch; future structural scoring runs on the CPU. No external image enters the
public showcase or the published package.
