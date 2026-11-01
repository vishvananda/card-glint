# Finishes and security stamps

[Magic pack](../README.md) · [Documentation index](README.md)

The pack supplies printing and the independent oval hologram. The host chooses
the whole-card finish on each scene instance. Use `finish: 'gloss'` for an ordinary
Magic card's clear surface, or choose `prismatic`, `cold` or `opal` for a foil
presentation. The game-neutral renderer keeps `regular` as its omitted-finish
default; use it for unshaded accuracy comparisons. The hologram remains local to
the stamp under any of these finishes, with the colored rim and lettering
protected by its mask. Its diffraction shares the prismatic finish's spectral
palette while retaining its own scale, axes and printed pattern.

Ordinary modern component frames share cost defaults across sets: pinned Card
Conjurer digit vectors, a measured down-left shadow, 1% larger discs and a small
numeral size/position correction. Printing overrides can refine this starting
point; caller adjustments remain relative to those defaults. Source disc and ink
colors are retained, and inline symbols keep their original source. Replacement
plates and special layouts keep their separate geometry.

The source comparison against MSE is recorded in
[`fixtures/accuracy/m21-mana-refinement.json`](../fixtures/accuracy/m21-mana-refinement.json).
Twenty M21 cards fit the defaults and 41 different cards validate them, all
outside the earlier mana cohort. Frozen transfer checks cover 148 measured
cards from M15, WAR, DMU and DSK, with four explicit alignment exclusions; see
[`fixtures/accuracy/modern-mana-transfer.json`](../fixtures/accuracy/modern-mana-transfer.json).
Whole-mana overlap improves in three sets. DMU's small regression and DSK's
conflicting placement/ink scores remain calibration flags. Separate numeral
identity diagnostics improve in every set, but do not replace fixed-pose scores.
This is a shared starting point, not a claim that every printing is calibrated.
Numeral masks are prepared once in a bounded material cache; card animation does
no font work or pixel readback.

## Security stamp appearance

Use `securityStamp: 'oval' | 'none'` to select the physical printing's security
stamp independently of its rarity or Oracle wording. The reference adapter
copies Scryfall's `security_stamp`; absent metadata becomes `'none'`, so an older
rare does not acquire a modern oval. Custom modern rare/mythic inputs that omit
the option retain the default oval. Other recognized shapes (`triangle`,
`acorn`, `circle`, `arena`, `heart`) are retained as metadata but are not drawn yet.

Supported oval stamps have a local holographic reflection in WebGL, on both
regular and foil cards. It follows tilt and pointer lighting while keeping the
colored mount, stock and nearby text static. Use `securityStampEffect: 'static'`
for the printed appearance. Canvas2D comparison/accuracy rasters remain static
under either setting. Ordinary M15, planeswalker, Saga, Adventure, Prepared,
Aftermath and modern split/fuse layouts share one cached interior mask, located
from the pinned source assets rather than fitted to each scan. Other stamp
shapes and template frames await dedicated assets and layouts.

Ordinary modern and planeswalker cards use separate oval mounts with colored
surrounds; Split/Fuse retains its plain oval. Existing Saga, Adventure, Prepare
and Aftermath painters also honor the physical stamp choice. Ordinary dense text
reserves space around the mount. The mounts are static; WebGL adds the localized holographic effect described above. Mount sources are decoded at native size,
and their black foot is matched to the stock once in the bounded material cache.
Warm preparation and animation perform no additional pixel readback.
Hosts must preserve original pinned URLs when calling `loadCanvasImages` so
source-specific SVG corrections run. Retain every returned image-map entry,
including additional historical detail layers. Comparison tools must use the
same release's decode policy as its painter.

## Separate artwork from printing

`opticalDocument(id, revision, face, tone)` keeps artwork separate from printing
for art-only rain, heat and pool treatments. Choose a gold, silver or prismatic
`tone` for reflection on the sharp printed layer. `mtg` remains an alias for `magic`.
