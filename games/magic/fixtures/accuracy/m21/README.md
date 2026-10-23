# M21 calibration evidence

The unreleased calibration branch is at profile revision 11. The
[foreground material review](walker-foreground-native-review.json) improves all
35 clean nonfoil planeswalker regions; mean OKLab distance falls from 4.87 to
0.53 (times 100, smaller is better). The shared
[loyalty review](walker-loyalty-native-review.json) improves all 14 starting
values and 42 ability costs, including the multi-digit labels. Its native replay
matches every selected crop and leaves pixels outside those regions unchanged.
The [badge/colon review](walker-badge-colon-native-review.json) raises actual
combined badge overlap from 61.95 to 86.48/100 and colon overlap from 36.01 to
68.24/100. Each improves on 40 of 42 ability fields; all four residual field
regressions stay listed. The 297-card diagnostic rises from 78.902 to
78.935/100 with the same inputs, scan poses and metric. All 283 other faces and
all 297 etchings remain byte-identical. The [static-ability review](walker-static-native-review.json) recovers Teferi's
three printed line breaks at the same 17.25 reference-pixel font size. Its joint
glyph/field objective rises from 62.07 to 76.85/100. All four native crops match
the proposal exactly, including the following divider's dependent movement.
The 297-card diagnostic rises from 78.935 to 78.967/100; the other 293 faces and
all 297 etchings are byte-identical. Scores for the 293 identical faces are
reused only after matching inputs, references, poses, raster hashes, complete
metric dependencies and preprocessing. These reviews do not certify the complete set.

[Component outliers](component-outliers.json) retain missing illustration spill
on Ugin, Basri and Garruk. Badge shadows, remaining text/footer
and basic-symbol rim audits, scan-pose certification and modern-default transfer
remain open. These branch measurements do not replace the published scores.

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

The shared painter changes have an exact historical source reconstruction and
a separate 250-case, 1,500-pair native compatibility audit. The current M21 worker
test covers 20 frame roles, Original and Oracle wording, all three tiers, faces
and etching masks. Asset requests, geometry and text measurement/draw calls must
match exactly. It reports exact pixel pairs separately from bounded browser
versus OffscreenCanvas raster differences; all etching masks must match exactly.
Synthetic assets and installed fonts establish portability, not scan fidelity.
The full-set release remains gated on the remaining regional audits, frozen
normalization review and compatible modern-default transfer.

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
center pitch and x/y offset over all 250 normal-frame costs, including the
individual observer's scan-boundary cases. It proves exact objective parity at
1134 stored native/scan measurements. Both starting points reach the same
solution; the own-render control stays near the current geometry.

The native 297-card replay changes exactly250 costs, with 47 byte-identical
control faces and all 297 etchings unchanged. Alpha and every cost-external pixel
are unchanged. Mean mana structure improves **89.56 to 90.10/100**, while the
whole-card diagnostic improves **78.18 to 78.22/100**, with identical coverage.

This remains **unadopted**. The broader mana metric improves 124 and regresses 126
costs, while the perimeter objective improves 227 and regresses 23. Generic
numerals, symbol ink/pigment and shadow fitting must follow. The title metric
also responds to 40 cost changes despite unchanged name pixels, exposing overlap
between its window and cost ink.

The cached search runs 179 candidates in roughly 1 second after about 31 seconds
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

## Independent mana glyph fit

[The glyph native trial](mana-glyph-native-review.json) searches filled-ink overlap
inside the fixed candidate circles. It separates numeral and W/U/B/R/G scale and
offsets from disc placement, paper color and shadow. Own-render controls recover
the unchanged geometry; all527 normal cost tokens remain in the denominator.

A complete297-card native replay changes exactly250 cost areas. All other face
pixels, all alpha and all297 etchings stay identical. Actual filled-ink overlap
improves W/U/B/G and numerals. Red's tiny predicted gain does not survive native
rasterization, so its transform is rejected. X is measured explicitly but remains
diagnostic because the existing per-color controls do not expose it.

Mean broad mana is90.05/100 (production89.56; circle-only90.10). Whole-card score
is78.219/100 (production78.181; circle-only78.224). These differing objectives
remain visible; the fit is not automatically promoted. Color/shadow and remaining
frame-family audits precede adoption. Full results and regressions are retained
in the adjacent compressed receipt.

```sh
node --test games/magic/tools/accuracy/modern-mana-glyph-objective.test.mjs
node games/magic/tools/accuracy/modern-mana-glyph-fit.mjs \
  INPUTS CIRCLE_NATIVE CIRCLE_SCORES AUDIT CIRCLE_FIT CIRCLE_PARAMETERS OUTPUT
node games/magic/tools/accuracy/modern-calibration-native.mjs \
  INPUTS OUTPUT --mana-study PARAMETERS
```

The existing source-bound study accepts optional numeric and per-color glyph
controls. Editor adjustments remain relative; unrelated sets, planeswalker costs,
explicit older plates and cards without costs retain their defaults.

## Remaining ordinary and legendary material colors

[The28-card material trial](remaining-normal-color-native-review.json) covers
all18 remaining crowns and10 plain gold cards with nonfoil references. It keeps
the existing sources and frozen scan alignment. Shared frame, rules-paper and
header fits reduce mean color error from3.65 to2.84,1.92 to0.88 and3.91 to0.81
respectively (Oklab delta; lower is better).

Native replay rejects the unstable black-frame fit and retains the existing blue
surround, green rules paper and paired-color pinlines. Gold headers improve
substantially without recoloring their authored color strips. All28 alpha masks
and etchings remain identical. The regional structure index changes slightly
from73.86 to73.79/100; both objectives and all regressions are retained.

The compressed receipt includes selected parameters, earlier rejected candidates,
per-printing results and exact source bindings. The selected values are now integrated in profile revision6; see the combined
native replay below. This material trial does not certify typography or set completion.

## Planeswalker paper is a separate component

[The14-card paper trial](walker-paper-native-review.json) uses9 nonfoil scans
and5 unchanged foil-only render controls. The textured CC background does not own
the ability paper: adjusting it left every body-color patch unchanged. That
candidate is retained as a rejected component-ownership experiment.

A separate fit to the procedural paper reduces mean color error from2.23 to0.74.
It preserves the240/255 alpha, outline, text layout and all pixels outside the
ability paper. Heading/surround color patches and all14 etchings are unchanged.
The structure index stays effectively level at70.25 to70.26/100.

The selected paper colors and source-bound study parameters are in the receipt.
Regular blue has only a foil-only reference and retains shared defaults. These
are material candidates; planeswalker type/name color, mana, badges, starting
loyalty, typography and the full-set publication audit remain separate checks.

Use the existing native replay command with the selected material parameters:

```sh
node games/magic/tools/accuracy/modern-calibration-native.mjs \
  INPUTS OUTPUT --materials PARAMETERS
```

Paper corrections are keyed by the exact background-mask source, applied by the
procedural fill and excluded from bitmap color adjustment. Source-texture
corrections use the CC source key and are applied by its own preparer once.
The study never changes production defaults, caller inputs or source mask alpha.

## Profile revision 6: adopted components and contextual headings

[The combined native replay](component-profile-adoption-native-review.json) renders
all 297 Original printings without faults. It adopts the normal and planeswalker
mana size/placement, numeric and color glyph controls, paper colors and down-left
shadow; the 28 selected crown/gold material fits; and 9 booster/tall planeswalker
paper/body fits. The 5 planeswalker-deck bodies keep their previous settings:
transferring the shared regular fit regressed every deck reference. Deck mana
uses the separately reviewed shared transfer and retains one broad-region outlier.

Whole-card diagnostic structure changes from 78.181 to 78.294/100, with unchanged
regional coverage. There are 185 improvements and 112 regressions; the compressed
receipt retains every card and region, rather than hiding these differences.
All 9 nonfoil walkers improve ability-text and mana scores. Material-color
objectives remain in their separate receipts and are not implied by this index.

[The heading receipt](heading-contextual-native-review.json) covers 28 native
printing pairs. Beleren2016 is loaded only when selected by this printing profile,
for names and type lines. Its official same-width descending n is selected before
spaces/descenders and at line end; the n before the comma in “Ugin,” remains
regular, as do the internal forms in Legendary and Liliana. The font's unsorted
descender lookup misses g in native shaping, so the painter explicitly selects
the existing U+E009 glyph in these contexts. It never rewrites stored wording.
Forcing the font's global final-form feature is rejected.

The old and new heading renders differ only in the name/type bands; rules,
credits, P/T and alpha remain unchanged. Tall Teferi type fitting is still an
outlier. A shared tracking/dash-spacing policy is not adopted from the earlier
trial, which improved the mean but regressed already good short type lines.

[R3 collateral evidence](unaffected-native-components-review.json) contains 1500
identical pixel/text/geometry pairs outside M21, including historical cards and
modern donor profiles. The source-reconstruction receipt retains its immutable
R2 parent and preserves Unlimited's 141 dependency guards. This is evidence for
reuse of unrelated scores, not approval of changed M21 scores.

M21 remains incomplete: foreground walker colors, remaining rules/heading
outliers, basic-symbol rim/shadow, loyalty/footer checks and final normalization
certification remain open. None of these diagnostics marks the set complete.

## Profile revision 12: colored-artifact paper palettes

[The native paper audit](artifact-paper-native-review.json) checks all three
ordinary colored artifacts against their frozen nonfoil references. Their metal
frames already had colored pinlines, but their name, type and rules panels were
still using neutral artifact paper. Shared W/B panel tones now preserve the
artifact texture and source-local masks. All nine measured fields improve:
mean OKLab distance ×100 falls from 6.099 to 0.198. Lower is better. There is one
white and two black printings; this is native verification of the fit, with no
independent white-card holdout. U/R/G colored-artifact paper remains unmeasured.

The same-environment replay proves that the other 294 faces and all 297 etching
masks are byte-identical. A new committed-source baseline was necessary because
installing system fallback fonts changed a few artist accents and symbol etching
masks since the prior capture. These changes are excluded from the palette gain.
Whole-card structural score stays essentially 78.967/100, as expected for a
metric designed to suppress pigment differences.

To repeat the isolation and color checks with cached complete native captures:

```sh
node games/magic/tools/accuracy/modern-artifact-paper-audit.mjs \
  "$INPUTS" "$BEFORE" "$AFTER" "$SCORES" "$REPORT"
```

The tool verifies inputs, decoded native pixels, reference hashes and frozen
poses. It rejects changes outside the three panel supports, any changed etching,
or any changed unrelated card. Reference scans and art remain external/cache
assets; the receipt contains measurements and hashes only.

## Profile revision 13: fractional body fitting and ordinary P/T

[The complete native typography replay](typography-native-review.json) replaces
default hinted body measurements with matching precise measurement, saved-request
replay and painting. The old code retained floating values, but all 1,128 measured
regular-text advances in this capture were whole pixels. The new fit uses a 24.25
maximum size, 1.02 text width, .9875 leading and 1.25 rightward adjustment in the
488×680 reference space. A content-derived legacy line limit prevents a spacing
change from adding wrapped rows. Original and Oracle fit their own wording.

The fixed 32-card semantic/density cohort selects the shared numerical proposal;
the complete 268-card corpus retains every result. Native body overlap rises from
53.845 to 59.548/100: 187 improve and 81 regress. This is a filled/edge glyph search
index, distinct from the public whole-card structure index. Large residuals and
the short rules/flavor wrapping examples remain in the receipt and outlier list;
this is not a claim that every printing improved.

All 148 ordinary P/T fields are reviewed. The existing font and anchor win, with
precise metrics at .97 size: mean overlap 87.585 to 89.200/100, 127 improvements and 21
regressions. The actually loaded 2016 font is rejected, including a 34.93-point
asterisk regression on Kinetic Augur. No missing-font fallback is a valid trial.

Actual production reproduces the independent proposal, injected into immutable
profile 12 source, on all 297 native face and 297 etching pairs. 268 faces change;
the other 29 and every etching remain byte-identical. The native audit also rejects
changes outside body/P/T support, alpha changes and any baseline-objective drift.
The new request test covers matching font states, replay, content retention,
invalid line limits, wording isolation and unchanged unrelated-set defaults.

Whole-card diagnostic structure rises 78.967 to 80.473/100. Aven Gagglemaster’s
frame signal classification changes, so regional coverage is reported rather
than assumed constant. Using only common eligible components still gives
78.967 to 80.470/100. Investigate that signal gate before certification.
[R10 collateral evidence](unaffected-native-typography-review.json) retains 1,500
identical unrelated pixel/text/geometry pairs against published 0.6.11. M21 remains
incomplete until the remaining component/source and normalization reviews,
modern-default transfer, ledger and release work are finished.
