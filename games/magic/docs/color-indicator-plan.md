# Color indicators: investigation and implementation plan

Status: implemented on the feature branch; see [the input and usage guide](color-indicators.md).
This document records the original investigation and implementation decisions.
Inspected source: `a39f137a`, after 0.7.13. Upstream references use the revisions
already pinned in `assets.json`.

## Current support

The Magic pack does not draw color indicators. `RenderedCardInput` has no
indicator field or geometry, and neither ordinary type-line painter reserves
space for one.

`fromScryfallCard()` reads `face.color_indicator` only as a fallback for `colors`.
It loses the distinction between a card's colors and its indicator. Usually
`face.colors` is present, so even this fallback is unused. `fromMtgjsonCard()`
does not forward MTGJSON's `colorIndicator` field.

Changing `colors` alone can change frame selection. `frameColors` already allows
the physical palette to stay independent. Neither mana cost, frame color nor
Commander color identity is a reliable substitute for indicator data.

The [Comprehensive Rules, section 204](https://magic.wizards.com/en/rules)
describe the indicator as a circle with one or more colors at the left of the
type line. A current-color badge added by an application is a display of an
effect; it does not change the printed card's characteristics by itself.

## Upstream material we can reuse

### Magic Set Editor

[Full Magic Pack's indicator module](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/tree/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-modules.mse-include/indicators)
contains 512 × 512 mono-color PNGs, alternate bases, blend assets and masks for
multicolor layouts. The inspected white and blue images include the colored
disc, black ring and the pale lower rim. This is a complete visual reference,
not just a flat colored circle.

Its [module instructions](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/blob/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-modules.mse-include/indicators/readme.txt)
give an ordinary-card baseline of x=31, y=301, size=17 in 375 × 523 coordinates.
In our 488 × 680 coordinates that is approximately x=40.34, y=391.36,
diameter=22.12. Treat these as starting measurements; calibrate against scans
after accounting for each of our frame families' type-line geometry.

MSE provides horizontal/vertical/size offsets and independent face selection
for double- and triple-faced layouts. Its newer
[typeline module](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/blob/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-modules.mse-include/typelines/readme.txt)
groups the type text, indicator and expansion symbol. This is the layout
strategy to follow: reserve space before fitting the type text.

The [older M15 style](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/blob/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15.mse-style/style)
uses y=300 instead and shifts type text from x=32 to x=52 when an indicator is
visible, reducing available width by 20 source pixels. Its own header marks
this style as deprecated; the modular values are the better initial baseline.

MSE's `has_identity_general` in
[the game script](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/blob/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic.mse-game/script)
compares indicator, frame and mana-cost colors to decide visibility. That is
useful precedent for custom cards, but we should implement an explicit policy
using host-supplied colors. We must not infer live game effects from text or
hide an explicitly supplied printed indicator because it appears redundant.

### Card Conjurer

[The pinned CI pip pack](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/js/frames/packM15CIPips.js)
defines five SVG fills, half/third masks, and a separate 70 × 70 PNG base in
[`img/frames/m15/ciPips/`](https://github.com/joshbirnholz/cardconjurer/tree/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/ciPips).
The base's normalized bounds are `[0.0767, 0.5748, 0.0467, 0.0334]`, or roughly
`[37.43, 390.86, 22.79, 22.71]` in our reference coordinates.

The color SVGs and masks use a 1500 × 2100 full-card canvas; they must be cropped
or transformed together. Drawing the whole SVG into the small badge rectangle
would produce an almost invisible pip. For example, blue's fill is a circle
with source center `(150, 1240)`, radius 23 and an enclosing transform.

The pack tells users to shift type text right by 66 of its source pixels,
about 21.47 of our reference pixels. Its
[Classicshifted variant](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/js/frames/packClassicshiftedCIPips.js)
repositions the same parts, confirming that appearance and frame placement
should remain separate.

Recommendation: compare the MSE complete badge and Card Conjurer's separate
base/fills against scans. Prefer the closer asset for each frame family. Reuse
the upstream masks for two/three colors; inspect MSE's additional masks before
implementing four/five-color layouts. Do not substitute an all-gold disc for a
multicolor indicator. Keep asset URLs pinned and follow the existing Magic
[source notice](../NOTICE.md); no upstream application code needs to be copied.

## Proposed input contract

Keep this in the Magic pack. The Rust core and browser backend only receive
the resulting rasters and semantic regions. Suggested additive face fields:

```ts
colorIndicator?: readonly FrameColor[];
currentColors?: readonly FrameColor[];
colorIndicatorDisplay?: 'printed' | 'current-if-changed' | 'hidden';
```

- `colorIndicator` describes the physical indicator. Omitted or empty means
  none. Do not manufacture it from `colors` or `colorIdentity`.
- `colors` retains the base card's semantic colors; `frameColors` retains its
  existing palette override. `currentColors` is an optional resolved projection
  supplied by the host. The renderer does not compute game effects.
- The default display is `printed`. `current-if-changed` compares normalized
  current colors against the explicitly supplied base `colors`. If they differ,
  it shows current colors; otherwise it retains the printed indicator. Require
  known base colors for this comparison rather than interpreting missing data
  as colorless. `hidden` draws nothing and reserves no space.
- Normalize sets, reject invalid colors, and provide deterministic segment
  ordering. Check multicolor orientation against actual upstream masks/scans;
  do not assume that a list's provider order specifies the visual orientation.
- A transition to colorless is `currentColors: []`, not `['C']`. If shown,
  use a clearly documented neutral application badge labelled “Currently
  colorless”; colorless is not a sixth printed color. Never retain a stale
  colored indicator after this transition.

For example, proposed usage for a blue Sol Ring is:

```ts
const visible = {
  ...printedSolRing, // base colors remain []; artifact frame and mana cost stay
  currentColors: ['U'],
  colorIndicatorDisplay: 'current-if-changed',
};
```

It shows a blue disc beside “Artifact” without recoloring the artifact frame or
changing `{1}`. Removing the effect restores the original appearance. A small
pure resolver should expose the resulting colors, bounds and source
(`printed` or `current`) for accessibility and host controls.

These names are a proposed API, not exports available in 0.7.13.

## Preserve printing differences

Provider indicator data is not necessarily physical printing data. This was
verified against two downloaded Scryfall records and their scans:

- [Time Spiral Ancestral Vision](https://api.scryfall.com/cards/named?exact=Ancestral%20Vision&set=tsp)
  reports `color_indicator: ['U']`, but its scan has no indicator. Its original
  text instead says that the card is blue.
- [Time Spiral Remastered Ancestral Vision](https://api.scryfall.com/cards/named?exact=Ancestral%20Vision&set=tsr)
  reports the same field and does have the blue dot.
- [Innistrad Delver of Secrets](https://api.scryfall.com/cards/named?exact=Delver%20of%20Secrets&set=isd)
  has no indicator on the front and a blue indicator on Insectile Aberration.
  The field belongs to each face independently.

Preserve raw provider indicator colors separately during import, then resolve
physical visibility from printing traits and reviewed exceptions. Known
pre-indicator printings must not gain a dot in scan comparisons. Unknown
visibility should be reported by the accuracy adapter instead of quietly
claiming an exact reconstruction. Explicit host printing data wins.

Add this trait to printing appearance selection, rather than deriving it from
`wordingMode`: selecting Oracle text currently preserves physical appearance.
An optional modernized display can deliberately request the Oracle indicator.
MTGJSON's documented
[`colorIndicator`](https://mtgjson.com/data-models/card/card-set/#colorindicator)
must also be forwarded and subjected to the same physical-visibility policy.

## Implementation sequence

1. Add the typed fields, validation and pure resolver. Forward provider data
   without using it to guess printed visibility. Add an explicit printing
   trait/override and cover the Ancestral Vision pair above.
2. Prepare the chosen external indicator once, through existing image hooks.
   Composite mono/multicolor badges in the preparation cache. No new shader,
   per-frame fetch, decode, mask readback or compilation is needed. Cards without
   a visible indicator must not request its assets.
3. Add shared indicator/type-text layout. Ordinary component and full-plate
   painters both reserve the badge diameter plus gap before their existing
   type fitting. Retain the expansion symbol's right-side reservation. Expose
   a `color-indicator` semantic region with a descriptive label.
4. Integrate each dedicated layout through its own local coordinates:
   planeswalker, retro, Future, Saga, Battle, Adventure, Prepared, split,
   Aftermath and flip. Reuse per-panel transformations; never paint one
   parent-level badge across both halves. Report unsupported placements
   explicitly during the staged rollout.
5. Handle `printedImage` deliberately. An unchanged scan already contains its
   physical dot. A changed-color request needs a rebuilt type strip or a full
   rebuild to reserve text space and replace any old dot. A scan overlay alone
   cannot shift the printed type text reliably. Test both integration paths.
6. Include the resolved visible badge and geometry in `faceContentKey()` and
   any host geometry keys. The current cache key enumerates fields manually;
   adding interface fields alone would return stale cached faces. Only key
   etching/coverage data if their actual output includes the indicator. Keep
   artwork-only rasters unchanged. Append a new key component only for visible
   indicators so unchanged cards retain their existing cache identity. Include
   fields in preset/style conversion and edit round trips where applicable.
7. Add fixture-driven import/resolver tests plus browser comparisons for mono,
   two/three-color and unusual layouts. Exercise worker Canvas painting, 244,
   488 and 732 widths, PNG export, effect removal, and cache invalidation.
   Run the required renderer check/build/package/browser/showcase gates when
   implementation changes the renderer.

Initial visual controls: modern Ancestral Vision, Insectile Aberration,
Ravager of the Fells, and three-color Nicol Bolas, the Arisen. The latter's M19
Scryfall face was checked and supplies `color_indicator: ['B', 'R', 'U']`.
Select controls from provider data rather than guessing from frame appearance. Include
ordinary Sol Ring, blue Sol Ring, a two-color change, a return to its original
colors, and a card made colorless. Review small-size legibility and long type
lines as well as aligned full-resolution scan crops.

This is additive functionality and does not require a breaking API change.
The eventual release should invalidate scores only for printings whose visible
indicator or type layout changed, with the existing dependency rules retained.
