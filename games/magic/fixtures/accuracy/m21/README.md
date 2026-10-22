# M21 calibration evidence

## Type review proposal

`type-line-proposal.json` records the 297 reviewed physical type lines and exact
scan identities. `type-visual-review.json` records the contact-sheet review.
Only `typeLine` is certified: this does not approve body/flavor text, colors,
layout or the set as a whole. Massacre Wurm prints **Creature — Wurm**, and
Mazemind Tome prints **Artifact**.

The source proposals stay immutable as review history. Their exact type and
artist fields are now activated in annotations-type-line.json and
annotations-artist-credit.json, then generated into the public per-set resolver
data. [The content scope review](printing-content-scope-review.json) confirms
that all 2,495 existing non-M21 wording reviews and all 195 existing artist
reviews remain unchanged. The 29 existing M21 reviews retain every body and
non-type field. The public API test checks all 297 Original type lines, all 13
new credits, Oracle preservation, missing Original data and stale-scan rejection.

The study's frozen inputs already contain the reviewed physical types.
Captures with the 13 corrected credits must be regenerated before final scoring.
A field review does not certify all wording or the complete set.

## Production component fit on the calibration branch

`production-components-review.json` records the hashes and complete denominator
for the first adopted component fits. It is **not a set completion certificate**.

- Footer typography: credits diagnostic improves from **64.38 to 86.59/100**,
  all 297 printings improve. Every pixel above canonical y630 and every complete
  etching remain unchanged. The 13 reviewed artist-string corrections are now activated separately
  through the exact-printing resolver; the style profile never supplies strings.
- Large basic symbols: all 15 improve; the complete-set structure diagnostic
  increases **73.09 to 74.27/100**. All 282 other faces and all 297 etchings stay
  pixel-identical. Five shared, source-bound color/geometry profiles are used.
- Separate ink/paper checks measure glyph-body overlap of 97.61–99.77/100.
  These do not certify the baked bevels or cast shadows. Those remain under review.

The compressed parity receipts contain only hashes, counts and printing IDs.
Native PNGs and cached external assets stay outside the repository. Reproduce a
scope audit against local capture directories:

```sh
python games/magic/tools/accuracy/native-region-parity.py \
 BEFORE_NATIVE AFTER_NATIVE footer-parity.json.gz --region 0 630 488 50
```

For the basic-symbol change, use `--region 140 420 210 205` and repeat
`--allow-number NUMBER` for every collector number from 260 through 274.
Install the pinned Python dependencies from
`games/magic/tools/accuracy/modern-calibration-requirements.txt`.
The audit rejects incomplete captures, changed inputs/references, stale raster
hashes, any complete etching change and pixels outside the declared scope.

Production values live in `modern-printing-profiles.ts`; glyph color preparation
joins the existing bounded bitmap cache. The exact set and immutable source URL
must match. Uncalibrated sets, older frame families, special templates and custom
rules retain their existing behavior. Source-color mode skips the glyph recolor.

The generic renderer checks and focused component tests pass. Strict historical
Magic source guards remain enabled. Release remains gated on
the scoped historical source/pixel compatibility proof for the new painter
paths. The broader Magic test also reproduces a separator fixture overflow on
the released 0.6.10 baseline with local substitute fonts; it is tracked separately
from these fits. Existing historical receipts are not rewritten or bypassed.

## Stable rules-spacing fit

The [body review](body-production-review.json) records the full-card replay after
the text-only search. Leading is 0.975 and paragraph gap is 0.4 em. Font size remains
capped at the existing fit. All 268 ordinary font sizes and line counts are unchanged;
all 29 other faces and all 297 etchings remain pixel-identical.

The complete-set structure diagnostic improves **74.27 to 75.08/100** and its
rules component improves **56.81 to 59.45/100**. The report keeps every regression
and three lower-frame coverage changes visible. This remains partial calibration.

The text search paints isolated native 1.5x rules layers and reuses cached fonts
and glyphs. It never decodes artwork or changes a scan pose. Its search objective
combines symmetric edge distances with filled-ink overlap; it is distinct from
the full-card metric. Full-card validation is required before adopting values.

New native captures also hash the font stylesheet, asset URL manifest and four
shared raster helpers, which live outside the game source directory. Text studies reject older captures without this metadata;
refresh the baseline before another search. The recorded source commits for the
existing body comparison have identical pack metadata, checked in its review.

## Replacement-plate color proposals

The [color review](frame-color-proposal-review.json) keeps the six material
fits separate from production data. The 219 nonfoil sources drive shared frame
and paper targets. One measured dark-template mask identifies the three paper
panels; all six pinned assets have the same thresholded alpha shape. Native
previews apply paper correction to the name and type panels as well as rules,
so a dark frame correction does not dim their light paper.

These values are not adopted. Red clipping, weak white-frame improvement,
texture contrast and stock black point still need review. Other source families
and donor transfer remain separate work. External source/preview PNGs stay local.

The [constrained follow-up](frame-color-constrained-review.json) fixes periodic
tile sampling and bounds pooled component clipping. The red frame prediction
moves from 5.47 to 2.52 Oklab delta with no clipped sampled tiles. Black and green
fits improve after retaining every region of their repeated source strips.
Six new native previews use the revised values, retaining identity for the weak
white-frame fit. Pixel-level color, texture and full-set replay remain open.
The replacement plates also need their own stock binding: measured outer black
is zero, while all 219 reference stock medians agree with the existing M21
target of RGB (22, 19, 14). These are separate from the component-source binding.

A subsequent native border-mask preview matches that stock target on all six
materials. Alpha is unchanged, and every changed pixel remains within the
outer band. Production source bindings, interior pinlines and dark frame
texture are still separate checks; no replacement plate default is enabled.

## Complete native material replay

[Full replay and color diagnostics](frame-color-full-native-review.json) cover all
297 Original printings on the current 0.6.11-based study. The six shared material
corrections change exactly 219 nonfoil ordinary faces. The other 78 faces and all
297 complete etchings remain pixel-identical; the compressed parity receipt
records every printing and raster hash.

Compared with the uncorrected replacement plate using current rules spacing,
the whole structure diagnostic improves **77.62 to 78.03/100**. The nonfoil
subset improves **77.80 to 78.21/100**. Frame color distance drops from 5.34 to
2.22 and rules-paper distance from 2.24 to 0.99 in the fixed native color patches.
These Oklab distances are separate from the structure index.

The full pass exposed a problem that the six examples did not settle: applying
the rules-paper tone to the name and type panels worsens black and green headers.
Artifact type paper also needs a separate fit. Do not adopt this material trial
until the existing source-local header masks have independent shared fits and a
new native replay. All 37 whole-card regressions remain in the review. Gold,
colored artifacts, lands, crowns, planeswalkers and final default transfer remain
separate requirements.

The capture tool now accepts a source-bound material profile. Its selected IDs
declare the trial cohort; all other printings are controls. It records the
profile and injection-tool hashes, with no production profile edits:

```sh
node games/magic/tools/accuracy/modern-calibration-native.mjs \
  INPUTS OUTPUT --retain-component-rules --materials PARAMETERS
node games/magic/tools/accuracy/modern-native-material-audit.mjs \
  INPUTS BEFORE_NATIVE AFTER_NATIVE FROZEN_REFERENCE_SCORES PARAMETERS AUDIT_JSON
```

The material audit uses fixed frame, rules, name and type patches with the same
dark-letter rejection. Missing observations stay explicit. Tile-center spread
is only a coarse texture/color diagnostic; it does not certify fine print grain.

## Independent header-panel replay

[Header-panel evidence](frame-color-header-native-review.json) checks a second
complete 297-card native pair. Structure improves **77.62 to 78.07/100**, with
183 improvements, 36 regressions and 78 unchanged controls. All 297 etchings
remain identical. Mean color distance falls **2.27 to 1.20** for name paper and
**2.27 to 1.13** for type paper. Black and green now improve independently;
artifact type paper retains identity. Frame and rules-paper fits are unchanged.

The opt-in Oracle flavor API has no default pixel impact: all 594 face and
etching PNGs match the pre-option native baseline byte for byte. The comparison
above was nevertheless freshly scored from the new capture metadata.

The art-rim audit measures reliable dark ridges in fixed, text-free strips.
It retains uncertain edges and does not move either image. Inner scan ink is
darker than outer stock: a common outer-stock lift would over-light the rims.
Use a native replay before promoting a source-specific shadow curve.

Reproduce with modern-inner-ink-audit.mjs INPUTS NATIVE
FROZEN_REFERENCE_SCORES PARAMETERS INK_AUDIT_JSON in the accuracy tools, and run
tests/magic-modern-inner-ink.mjs for exact, weak, ambiguous and noisy cases.

These results remain partial. Paper color, structural overlap and line ink are
separate diagnostics, and none alone certifies the complete M21 profile.

## Ordinary sources adopted on the calibration branch

[The production replay](frame-source-production-review.json) uses the real
default resolver without study materials or retained-layout injection. Its
297-card control disables only the new source selector. Both sides contain the
same Original type lines and printed artist credits.

The structure index improves **75.08 to 77.63/100**: 192 improve, 27 regress and
78 remain unchanged. Component eligibility and coverage are identical.
All 297 etchings and the 78 other-source faces remain identical. A fresh replay
after override guards, material-coverage resolution and slimmer cache keys
reproduces every one of the 594 native PNGs.

The six shared materials live in m21-ordinary-plates.ts and are selected by
semantic frame rules, without printing IDs. Existing component title, mana,
P/T and body typography are retained. Only the relevant source material enters
each face key, and preparation uses the existing bounded bitmap cache.

Mana-disc interiors remain pixel-identical for all 454 selected discs, while
the mana structural component drops from 90.47 to 89.43/100. Keep that regression
visible: it does not certify the antialiased rim, shadow or surrounding frame.
The structural total also excludes credits under this metric; footer accuracy
still uses its separate diagnostic.

These are partial-set improvements. The remaining source cohorts, final mana
and text checks, historical source compatibility and modern default transfer
must be completed before certifying M21 or publishing this calibration.

## Land follow-up

The land fit samples each contributing source only where it is fully visible:
the paper halves lie outside the broad blend and the headers/rails outside the
narrow join. It reuses the ordinary fit's clipping bounds and tile objective.
Missing patches remain explicit.

The first 33-card inspection found that basic lands use colored name/type
paper, while the nonbasic land headers are neutral. Blending colored full
plates tints those nonbasic headers incorrectly. Do not average the two
header populations into one per-color fit or promote the raw land trial.
A neutral source panel is needed for the nonbasic headers; paper gradients
and colored rails remain independent.

## Current land and colored-artifact follow-up

[Land production evidence](land-source-production-review.json) now adopts the
shared common texture and neutral nonbasic headers on this branch. The 33 land
scores improve **76.26 to 80.59/100**; the whole staged set reaches
**78.11/100**. The other 264 faces and all 297 etchings remain identical.
These are diagnostic scores, not a completed-set certification.

[Colored-artifact evidence](colored-artifact-pinline-review.json) covers the
complete three-card ordinary cohort. A calibrated artifact plate plus the
authored colored pinlines improves **62.40 to 69.26/100**, with all three cards
improving and identical regional eligibility, alpha and etching output.
The selected trial is now adopted on this calibration branch after the
[complete production replay](colored-artifact-production-review.json). A plain
artifact plate is rejected:
it removes a scorable frame region on Witch's Cauldron.

Historical evidence reuse is separate from M21 fit approval. The exact scoped
source compatibility receipt preserves unrelated native results; Unlimited's
current-applicability wrapper additionally checks its original dependency
guards and the exact certified profile in both eager and per-set delivery.
An unknown shared-painter edit or changed Unlimited profile still rejects reuse.

The colored-artifact production replay raises the staged whole-set structure
index to **78.18/100**, with 3 improvements, no regressions and 294 unchanged
faces. All 297 etchings are unchanged. Exact raster/input/reference/pose and metric
identities allow 294 metrics to be reused; the 3 changed metrics are measured
freshly. The diagnostic runner verifies every seeded row before aggregation.
M21 remains incomplete pending the remaining source, mana, text and normalization
checks and the compatible-modern default transfer.

Run `npm run magic:data:build` before a native study, and finish source edits
before capture. The capture runner checks source, font/asset metadata, generic
raster helpers and its own tool identity again at the end; source drift leaves
an explicit fault instead of accepting a mixed-version capture.

## Mana disc measurement

[The complete mana audit](mana-disc-measurement-review.json) measures all
567 cost tokens on 264 Original cards, using the existing native PNGs and frozen
normalized scan rasters. It launches no Chromium. Vite SSR supplies the exact
source geometry, and Node measures the cached pixels.

All 567 native controls recover their known center/radius within 0.75px.
The scan side produces 509 eligible nonfoil pairs; 46 search-boundary results
remain flagged. Native-only paper arcs, source paper priors and softly saturated
contrast prevent strong glyph/shadow edges from winning over the disc perimeter.
Earlier ambiguous detectors are retained as rejected diagnostics.

The normal-frame observations suggest roughly a one-pixel diameter reduction.
A shared gap adjustment preserves the already-close center pitch. The proposal
is **not adopted**: it needs native replay and independent numeral, glyph, shadow
and color checks. Planeswalker variants retain their separate review.

```sh
node --test games/magic/tools/accuracy/modern-mana-ring.test.mjs
node games/magic/tools/accuracy/modern-native-mana-audit.mjs \
  INPUTS NATIVE SCORES AUDIT_JSON
```

The input must be the complete 297-card M21 Original snapshot and match both
the native capture and current renderer. The tool verifies every used raster,
checks tool/source stability and retains unsupported measurements explicitly.

## Shared mana fit and native trial

[The shared native trial](mana-shared-native-review.json) fits one diameter,
center pitch and x/y offset over all250 normal-frame costs, including the
individual observer's scan-boundary cases. It proves exact objective parity at
1134 stored native/scan measurements. Both starting points reach the same
solution; the own-render control stays near the current geometry.

The native297-card replay changes exactly250 costs, with47 byte-identical
control faces and all297 etchings unchanged. Alpha and every cost-external pixel
are unchanged. Mean mana structure improves **89.56 to90.10/100**, while the
whole-card diagnostic improves **78.18 to78.22/100**, with identical coverage.

This remains **unadopted**. The broader mana metric improves124 and regresses126
costs, while the perimeter objective improves227 and regresses23. Generic
numerals, symbol ink/pigment and shadow fitting must follow. The title metric
also responds to40 cost changes despite unchanged name pixels, exposing overlap
between its window and cost ink.

The cached search runs179 candidates in roughly1 second after about31 seconds
of PNG/objective preparation. It does not run Chromium. A source-bound native
trial then checks the chosen result through the actual renderer.

```sh
node --test games/magic/tools/accuracy/modern-mana-objective.test.mjs \
  games/magic/tools/accuracy/modern-mana-study.test.mjs
node games/magic/tools/accuracy/modern-mana-shared-fit.mjs \
  INPUTS NATIVE SCORES AUDIT PROPOSAL OUTPUT
node games/magic/tools/accuracy/modern-calibration-native.mjs \
  INPUTS OUTPUT --mana-study PARAMETERS
```

The shared fit uses fixed reference pixels and source-only paper arcs. The
trial parameters bind the renderer, input snapshot, source hook and fit receipt.
Neither script modifies production profiles or input cards.
