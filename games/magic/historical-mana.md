# Historical mana artwork and ordering

Original symbol mode selects glyph artwork per set and color through Eighth
Edition. It works with original wording or Oracle wording. Modern symbol mode
keeps the existing modern symbols. This choice does not change the mana cost.

The review covers 51 ordinary English paper sets/collections, 255 set/color
groups and 2,017 scan samples. The source candidates are the existing modern
SVGs, CardConjurer's old mana SVGs, and Full Magic Pack's old mana PNGs. The
early ABU white sun uses a resized Conjurer glyph; other early sets retain the
previously tuned font glyph over a circular disc.
White changes with Fourth Edition; the scans show modern blue, black and red
by Mirage, before Fifth Edition. Early black symbols also differ between the
Alpha/Beta/Unlimited family and Arabian Nights onward. Green is a closer match
between candidates and does not justify treating every small score difference
as a new printing era.

The runtime stores explicit set/color choices. Missing set profiles retain the
existing artwork. Historical bitmap preparation separates dark ink from the
disc and rebinds the disc to the renderer's existing palette or its independently
calibrated target. This also handles the neutral gray MSE skull disc, which an
HSB saturation multiplier cannot tint. Alpha and antialiasing are preserved.
Prepared bitmaps share the bounded material cache; animation does no decoding,
recoloring, font loading or readback.

## Evidence and limits

- [Glyph measurements, source URLs, scan hashes and normalization](fixtures/accuracy/mana-glyph-study.json)
- [Adopted choices and review reasons](fixtures/accuracy/mana-glyph-decisions.json)
- [108 scan-reviewed printed cost orders](fixtures/accuracy/historic-mana-order.json)

Glyph comparison uses dark-ink overlap and symmetric boundary agreement rather
than RGB differences. Frozen UUID cohorts separate fitting and held-out scans.
Only single-color costs are used: Oracle cost order is not a safe way to label
a multicolor printing's rightmost glyph. Frame normalization is reused when
accepted; otherwise local disc measurements are used for **artwork identity
only**, never renderer positioning. Glyph bounds are normalized isotropically.

Disc detection sometimes selects glyph ink, a shadow or a nearby frame edge.
Low absolute scores, sparse cohorts, close candidates and held-out disagreement
are review flags, not permission to replace an asset automatically. The retained
measurements include these failures. Visual review preserves modern symbols in
later sets when a contaminated crop incorrectly favors an old candidate. These
are candidate-selection scores, not whole-card compliance scores.

To repeat the study, populate the normal accuracy cache and full-set template
inventories, then run `tools/accuracy/mana-glyph-study.mjs`. Set
`CARD_GLINT_TEMPLATE_INVENTORY` to the inventory directory when it is outside
`test-results/magic-accuracy/scan-template-study`. Runtime choices require review;
the study does not overwrite them.

## Printed cost order

Legends is inconsistent even within one color pair: Gosta Dirk prints WU, while
Kasimir the Lone Wolf prints UW. All 55 multicolor Legends costs are recorded
explicitly. The Dark's three multicolor costs are also recorded. Reviewed Ice
Age, Chronicles and Alliances printings use WUBRG sorting; Mirage probes use the
modern ordering. The rules are scoped to these sets rather than a date cutoff.

`withCardWording` uses those defaults only when original wording does not supply
its own `manaSymbols`. An explicit original cost always wins. Printing overrides
are applied only when their symbol multiset matches the supplied cost, so a
customized card cannot accidentally inherit another mana cost. Hosts should
supply the Oracle cost in `wordings.oracle.manaSymbols`; Oracle wording with
original glyph artwork retains that Oracle order. Accuracy annotations bind
reviewed costs to the printing UUID and scan hash and fail on a changed scan.

For background on the modern ordering convention, see Wizards'
[Split (Odds & Ends)](https://magic.wizards.com/en/news/making-magic/split-odds-ends-2006-04-17).
The historical exceptions above were checked directly against printing scans.

## Glyph size within a fixed disc

A follow-up study fits the bright outer disc independently, rejects weak or
boundary fits, and compares ink at three threshold levels without normalizing
its bounds. Shared inner scales are chosen on fitting cards and checked on
reserved cards. The colored candidates improve with inner scales of 0.94 for
Conjurer blue/black and MSE black, 0.92 for MSE red, and 0.88 for Conjurer green.
The MSE blue asset keeps its native proportions pending sufficient evidence.
These are source-artwork corrections; the outer circles do not shrink.

For white, 14 accepted Alpha/Beta/Unlimited scans provide seven fitting and
seven reserved samples. The reserved overlap is 0.836 for Conjurer at 0.92 inner
scale, 0.790 for the resized current font and 0.785 for resized MSE. The original
font at its existing size scores 0.777. ABU uses Conjurer; Beta has only two
usable fitting samples and inherits this family choice. Other early white sets
retain the font because their disc fits were rejected, not because they scored
better. See [disc measurements](fixtures/accuracy/mana-glyph-sizing.json) and
[shared size fits](fixtures/accuracy/mana-glyph-sizing-fit.json).

`symbolAdjustment.mana.glyphs` supplies per-color cost controls, for example
`{ U: { scale: 0.95, dx: 0.25, dy: -0.25 } }`. Scale is relative to the selected
printing's default glyph; offsets use canonical 488 × 680 card pixels. These
controls leave the circle, other colors and inline symbols fixed. Whole-cost
scale still affects all circles uniformly. Numeral controls remain independent.
Glyph separation is cached during preparation; warm adjustments require no
source pixel readback. Colored ink is clipped to its own stationary circle.

## Beta disc colors and red ink

Printing color calibration now supplies explicit Beta targets for all five mana
colors and the neutral numeral disc. The targets are independent of the selected
glyph asset. They are fitted from eroded disc interiors, excluding dark ink,
with even UUIDs used for fitting and odd UUIDs reserved for validation. Frame
normalization stays fixed. Local circle measurements locate samples only; they
do not adjust renderer geometry or scan registration.

Beta's MSE red flame also needs more ink than its source bitmap supplies. A
0.4 px circular expansion, stated for a nominal 24 px disc, improves the
normalized shape comparison on reserved red scans from 0.806 to 0.902. It was
selected on the separate fitting scans, against both other source families and
smaller/larger expansions. This is stroke weight, independent of glyph scale.
It applies only to the measured Beta/MSE-red combination. Other historical
symbols and modern-symbol mode retain their existing artwork.

Expansion occurs once during cached bitmap preparation. It preserves disc alpha
and partial-alpha edge pixels; palette rebinding then applies the printing color.
The material cache key includes both the palette and expansion amount. See
[Beta material measurements](fixtures/accuracy/beta-mana-materials.json) for
sample counts, source and scan identities, color errors, and rejected samples.
These color and shape diagnostics are separate from the mana-region placement
score; neither should be interpreted as a percentage of correct card pixels.
The complete candidate raster check improves reserved disc-color error for
blue, black, red, green and neutral discs. White has no reserved-sample gain
(1.88 to 1.91) after the placement fit and remains a review flag. Red's actual
rendered shape score improves from 0.794 to 0.909 on its 21 reserved scans.

## Fallen Empires, Fourth Edition and Chronicles

These ordinary printing frames have shared original-symbol defaults for cost
placement, spacing, circle size, colored glyph geometry and generic numerals.
Explicit editor adjustments remain relative to those defaults. Oracle wording
can retain the original symbols; selecting modern symbols keeps the existing
modern-symbol defaults. Custom frames do not inherit these measured profiles.

Printing color calibration adds six disc colors and one shared ink color per
set. The original filled glyphs remain filled. Ink recoloring uses the existing
preparation pixel buffer, preserves disc alpha and flat paper, and participates
in the bounded material cache. Repeated preparation performs no pixel readback.
The source-color option disables both disc and ink recoloring.

The [integration receipt](fixtures/accuracy/early-reprint-mana.json) records exact
native agreement with the measured prototype on all 690 printings and unchanged
pixels on 98 controls from other sets. These checks verify implementation and
scope; they are not scan-accuracy scores. The separate regional studies retain
reused validation cohorts, color regressions and thin-glyph exclusions. Original
wording was supplied to both sides of this replay. Remaining symbol, typography
and whole-card gates stay open for the grouped release.
