# Native Prepared frames

Prepared uses a creature panel on the left and a spell inset on the right of
one physical face. Supply `layout: 'prepare'` and two `faces`, ordered creature
then spell. The parent owns the creature identity, statistics and full-card art.
The [official mechanics reference](https://magic.wizards.com/en/news/feature/secrets-of-strixhaven-mechanics)
describes their relationship. This is a separate native painter from Adventure.

## Sources and composition

The pinned CardConjurer revision
`33f2547137fe366b40e9e8dba4eb591af190fddf` supplies
[packPrepare.js](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/js/frames/packPrepare.js)
and `img/frames/prepare/regular/` plates and masks. The earlier inventory missed
this source. Creature and spell colors are independent. Two-color cards retain
gold outer material, colored pinlines and separate page gradients; hybrid spells
have neutral header interiors. Legendary crowns blend the creature's colors.

M15 power/toughness badges and Beleren Bold Small Caps lettering share the
Adventure footer implementation. Prepared defaults to rarity-first collector
numbering; a host can override `collectorFormat`. Hosts supply the printed
serial, artist and legal line. The frame, printing hole, art edge source and
optical-effect aperture all use the same `[.0767, .1129, .8476, .4429]` geometry.
The inset has separate title, type and rules hit regions.

Composites use a 16 MiB LRU keyed by decoded source identity and material choices.
Source bitmaps remain owned by their loading leases. Frame submission performs
no image decoding, font loading or mask readback. All source images remain
external pinned URLs; scans and art stay in the ignored local cache.

## Original wording and comparison

The frozen cohort contains all 36 ordinary English, nonfoil-eligible SOS
printings. MTGJSON's snapshot lacks `originalText` and `originalType` for both
panels of every card. All 72 printed text panels were visually checked against
their full scans. Current Scryfall face text matches those scans, including
reminders and paragraph breaks. The
[reviewed wording fixture](../fixtures/accuracy/prepare-printing-text.json) records
explicit original fields bound to the exact reference hashes. The adapter
preserves the missing provider values and rejects changed scans; it does not
silently treat future Oracle changes as original wording.

The immutable `prepare-v0219-input-v2` baseline corrects Tam’s italic Landfall
label on both renderer versions and uses v0.2.19's ordinary-frame
fallback with those same inputs and artwork. Native captures use independent
frame-only registration against the actual uncalibrated plate. Outside rails
and the bottom frame edge exclude text, art, inset headers, stamp and statistics.
Accepted translation, scale, rotation and skew models normalize the scan before
both versions are scored. Rejected fits remain raw and unscored.

A 12-card pilot explored rules size, placement and header lettering. The later
36-card coverage check exposed a short-text tradeoff and selected a 21.75-pixel
starting size for both panels, shrinking each independently. Consequently the
final full cohort is a development result, **not a held-out validation claim**.
Rules use source panel bounds, a two-pixel right shift for spell text, unit
leading and a .4-em paragraph gap. Badge and stamp exclusions keep fitted text
out of those areas. Main titles moved down one pixel and inset titles up one;
header sizes remain close to the source definition. There are no per-card
renderer settings.

The [comparison receipt](../fixtures/accuracy/prepare-native.json) records the full
cohort, input/renderer hashes, component scores, regressions and rejected fits.
Local-contrast edge F1 is measured at a one-pixel tolerance; body and white inset
header lettering use separate polarities. These are component diagnostics, not
whole-card accuracy percentages. The full gallery also retains before renders
and red/green overlays of accepted normalized scans. Across 29 accepted scans,
mean creature-text F1 improves from 0.276 to 0.628, spell text from .273 to .652,
and inset headers from .044 to .750. All 36 cards render without rules overflow;
two component regressions remain visible in the receipt.

## Remaining limits

- Seven black-card scans fail registration because the textured outside rails
  provide inconsistent edge profiles. They remain unscored; acceptance gates
  were not loosened. Another independent structural anchor is a follow-up.
- Some printed passages use different sizes and wraps, including Swords to
  Plowshares, Wild Idea, Landscape Painter and Tam's creature text. Shared
  fitting does not reproduce every printing's editorial choices.
- Source paper texture and color, inset borders, stamp detail and footer spacing
  are not certified by the text metric. No SOS HSB profile is fitted yet.
- Ordinary SOS validates the five colors, two-color gold/hybrid combinations
  and legendary crowns. Artifact, land and Vehicle sources exist but have no
  ordinary SOS validation card. Nyx variants are deferred.
- The source definition lists a colorless `c.png` that is absent from its pinned
  tree. A nonartifact colorless Prepared card fails explicitly rather than
  substituting an artifact frame.
- The deployed search adapter still needs special-frame routing. This validation
  gallery is separate from the public showcase and library package.

```sh
node games/magic/tools/accuracy/prepare-source.mjs prepare-source-v1
# Capture the frozen baseline with a v0.2.19 checkout before changing the painter.
MAGIC_CAPTURE_ROOT=/path/to/v0.2.19 node games/magic/tools/accuracy/special-frame-audit.mjs prepare-v0219-input-v1 --prepare
MAGIC_CAPTURE_ROOT=/path/to/v0.2.19 node games/magic/tools/accuracy/prepare-input-revision.mjs prepare-v0219-input-v2
node games/magic/tools/accuracy/prepare-study.mjs prepare-native-v5
node games/magic/tools/accuracy/prepare-receipt.mjs prepare-native-v5
node tests/magic-special-frame-input.mjs
node tests/magic-prepare.mjs
node tests/magic-prepare-registration.mjs
```

Captures are immutable; choose a new label when reproducing. One browser session
prepares the batch; structural scoring runs on the CPU. Prepared does not finish
the Rooms, Battles, physical double-faced layouts or later special-frame queue.
