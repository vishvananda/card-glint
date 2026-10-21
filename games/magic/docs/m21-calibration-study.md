# M21 calibration study

Status: experimental. The current renderer defaults have not been replaced by
these measurements. Numeric evidence is in
[`m21-registration-experiments.json`](../fixtures/accuracy/m21-registration-experiments.json)
and [`m21-baseline-diagnostic.json`](../fixtures/accuracy/m21-baseline-diagnostic.json).

The previous all-HSV scan-only method has support on all 297 scans. It passes
all 231 initial recovery controls and all 594 combined color/geometry controls,
but only 888/891 broader replay cases. All three remaining failures are
planeswalkers: two Garruk, Unleashed transforms choose different vertical edge
minima, and foil Liliana, Death Mage exceeds the RMS limit. All ordinary-frame
cases pass. The suites have been reused during development; this is property
validation, not an untouched holdout. Full-set poses remain unapproved.
Numeric views and exact tool sources are preserved in
[`m21-normalization-value-v21.json.gz`](../fixtures/accuracy/m21-normalization-value-v21.json.gz).
The [type-line proposal](../fixtures/accuracy/m21/README.md) remains separate
from its pending runtime adoption.

The source census contains 297 ordinary printings, 50 semantic material/frame
variants and 17 registration families. Five planeswalker-deck printings have
only foil references: check their layout, but exclude them from ordinary-paper
color fitting. Four Teferi printings use the taller four-ability geometry.
M21 contains no legendary land or multicolor planeswalker, so transfer to those
families requires separate controls with matching pinned asset sources.

## Modern-frame default policy

Once M21 passes the full calibration checklist, use its profile as the baseline
for modern-frame sets without an independently calibrated profile. An exact
set/component calibration takes precedence; a partially calibrated set inherits
M21 only for its missing components. Explicit source-color or profile choices
remain authoritative. Resolve defaults through the same path for layout, asset
loading, native painting and cache identity; do not copy M21 values into every
set file.

Transfer each component to compatible frame geometry and pinned assets. M21
covers the ordinary, legendary, basic-land and two planeswalker geometries in
its census. Check representative split, adventure, double-faced, legendary-land
and multicolor planeswalker controls before applying applicable defaults there;
unrelated specialty geometry must retain its own layout. A fallback is not an
independent calibration: Lab should show its inherited source and keep the set's
checklist incomplete until checked. This policy is queued for integration after
M21 is complete, not activated by these experimental measurements.

## Reproduce the measurements

Keep downloaded scans, art, fonts and native renders in the external cache.
The tools below use no network fallback. Set `MAGIC_ACCURACY_CACHE` to the cache
and use a study directory outside the tracked source tree. `INPUTS` is a frozen
printing-input file with exact reference/component hashes and Original wording.
Run the Node scripts with `node games/magic/tools/accuracy/<script>` from the
repository root.

1. Run `modern-calibration-native.mjs INPUTS NATIVE` to capture every Original
   face and etching with one browser session. It records renderer, input and
   component identities and retains failures. This does not validate layout.
2. Run `modern-frame-observations.mjs INPUTS OBSERVATIONS`. Project raw pixels
   to HSV value before coarse resampling. Ordinary fine fields retain HSV value
   and the 0.8 px native Gaussian. The two reviewed planeswalker geometries use
   a largest-variance RGB axis per strip and a 0.4 px Gaussian; this is a linear
   projection of encoded RGB, not a linear-light conversion. Each field records
   its actual channel, filter and projection axis. It extracts reviewed
   frame strips directly from native-resolution scans. Gaussian filtering is
   restricted to each strip before any resampling; replacing all pixels outside
   those native strips must leave every packed field byte-identical.
3. Review all strip footprints. The two M21 frame-window review fixtures bind
   the source census, extraction bounds and observation hash. Titles, artwork,
   rules descenders and collector text are excluded. Do not widen a window just
   to recover a stronger signal.
4. Run `modern-calibration-normalize.mjs OBSERVATIONS/observations.json POSES
games/magic/fixtures/accuracy/m21-frame-projection-review-plan.json`.
   Templates come only from scans in each geometry/material family. A fixed
   affine model fits two disjoint strip partitions, retaining four tangential
   gradient bins per patch. The third partition validates the result; it is one
   independent check, not separate validation and certification samples.
5. Use `modern-known-pose-inputs.py OBSERVATIONS/observations.json INPUTS
POSES/templates.json CACHE CONTROLS`, then `modern-known-pose-score.mjs
OBSERVATIONS/observations.json POSES CONTROLS CONTROLS/results.json`.
   The Python requirements are pinned in `modern-calibration-requirements.txt`.
   Thirty-three sources are selected by UUID before evaluating seven known
   native raster transforms each. Every selected case stays in the denominator.
   Recovery requires corner RMS at most 0.35 and maximum error at most 0.6 in
   the 488 × 680 comparison space. An optional final plan argument accepts
   `games/magic/fixtures/accuracy/m21-normalization-confirmation-plan.json` to
   cover all297 sources with two additional warps and an HSV variation.
   Run fresh controls and inspect normalized
   rasters before approving a method fitted using these controls.
6. Run `modern-frame-native-probe.mjs INPUTS NATIVE
OBSERVATIONS/observations.json PROBE`. It preserves frame semantics, rectangles,
   stock and material corrections, replaces art and hides title/body/artist
   strings, then requires identical pixels in every native frame field. Keep
   physical type lines: blanking them currently changes calibration eligibility
   even with a preserved canonical type. All 297 current fields pass.
7. For an explicitly provisional baseline, run `modern-calibration-score.mjs
INPUTS NATIVE POSES METRIC_MODULE OUTPUT --diagnostic`. The supplied module
   exports `scoreRegions(scan, render, card, face)`. Its relative import graph
   and the preprocessing graph are hashed. The tool validates input, raster,
   reference and pose identities, including on resume, and records normalized
   references for inspection. It needs no browser. Missing region maps and
   rejected poses remain visible; this report is never publication-eligible.

The analytic recovery check is `modern-affine-analytic-check.mjs`: three pigment
levels, seven affine transforms and an independent gain/offset variation. It also
checks native float encoding and polynomial interpolation. The score
cache/refusal protocol has a self-contained test at
`tests/magic-modern-calibration-score.mjs`; its mock metric tests identity
handling, not physical accuracy.

## Remaining calibration work

- Certify frame normalization, including rotation and independent axis scale.
- Validate dedicated planeswalker scoring maps; the initial supplied metric
  maps only 283 faces and explicitly leaves 14 planeswalkers unscored.
- Verify Original wording, artist/legal text, numbers and symbols against scans.
- Measure geometry before color: outer/inner edges, art apertures, title/type,
  rules boxes, corners and the planeswalker variants.
- Fit frame/paper color and blackpoint on nonfoil references with correct masks.
- Fit mana discs, glyphs, numerals, spacing and shadows; fit all set-symbol
  rarities with independent width/height and outline checks.
- Fit headings, body/flavor layout, stats and stamps. Retain outliers and
  compare whole-card and component indices.
- Calibrate artist credits separately: verify exact printed names, font/small
  caps, size, baseline, horizontal placement, tracking, ink and shadow. Include
  the ordinary frame, basic lands and planeswalker layouts; a body-text fit
  does not certify credits.
- Calibrate copyright/legal and collector lines separately: verify printed
  wording, year, trademark marks, number, rarity and set code before measuring
  font, size, spacing, color, position and clipping. Retain missing or incorrect
  strings as source/content errors rather than fitting around them.
- Calibrate the large basic-land mana symbols independently from mana costs:
  measure each W/U/B/R/G glyph's visible bounds and center, scale, position,
  color, bevel and shadow against every matching land printing. Asset padding
  is not a visible-symbol measurement. Preserve intentional art variants and
  report every printing, including outliers.
- Integrate a single editable M21 profile and transfer defaults only to matching
  source components. Preserve explicit source-color and printing choices.
- Verify compatibility of historical set scores and native rasters, complete
  renderer/package checks, then publish matching library and Lab revisions.

## Credits and large land-symbol diagnostics

`modern-component-raster-fit.py INPUTS NATIVE SCORES OUTPUT` makes cheap shared
bitmap geometry proposals from the frozen normalized scans. It uses the pinned
Python requirements and verifies every input/capture/reference hash. Artist,
legal and collector regions are fitted separately; all 15 basics (three of each
W/U/B/R/G) get a separate large-symbol pass. All 906 component rows are retained,
including foil-only references, missing signal and unapproved planeswalker poses.
It does not render fonts, change a scan pose or install renderer parameters.

The [first diagnostic](../fixtures/accuracy/m21-component-raster-diagnostic.json.gz)
confirms narrow artist names, smaller legal placement/width differences and
undersized/high black and green land symbols. None of its proposals is adopted:
several hit a search bound, letter matching can favor the wrong offset, and a
dark value mask poorly separates the light sun and saturated red glyph. Native
font candidates, glyph-aware masks/alternative assets, visible bounds, color,
bevel and shadow checks must precede the full native replay. A high regional
bitmap score cannot certify a complete component or set.

## Native footer and remaining registration research

The [native follow-up](../fixtures/accuracy/m21-native-footer-and-filter-research.json.gz)
retains all 297 source rows for each footer part. Candidates paint at 732 px and
use the same canonical resampling as the full-card metric. Their unchanged
baseline matches 555,152 tested glyph pixels exactly across collector, artist
and legal regions. Collector candidates include the pinned Conjurer Gotham font;
283 ordinary nonfoil printings choose shared candidates, with all planeswalkers
and foil-only sources retained as diagnostics. That coarse phase proposes Gotham
13 px for collectors, 12 px small caps for artists, and 11 px Plantin for legal
text. The follow-up below refines the search boundaries, provides a reproducible
CLI and replays complete native faces/etchings. Physical strings, ink colors and
remaining source details still need verification before changing defaults. Artist positions also depend on the
collector font's measured code width, so its phase delta is not the whole change.
Copyright regions follow the known stats/non-stats row and exclude long artist
names on the other row.

A targeted planeswalker probe tries extra vertical starting points and 0.8,
1.2 and 1.6 px native filtering. More filtering recovers the two Garruk cases
but worsens foil Liliana's recovery; no setting is promoted. Ordinary-frame
known controls remain passing. Preserve the existing normalization limits and
investigate physical frame-edge selection before full-set certification.

Indices are reported out of 100; they are not percentages of visual fidelity.
A passing regional fit does not prove an entire card, frame family or set.

## Reproduce the footer and large-land-symbol studies

Use the frozen Original inputs, baseline native capture, normalized-reference
score directory and local source cache from the same study. The tools reject
changed hashes instead of mixing renderer revisions or scan poses. Set
`MAGIC_ACCURACY_CACHE` to the cache root; fonts and images remain external assets.

```sh
node games/magic/tools/accuracy/modern-footer-study.mjs \
  "$INPUTS" "$NATIVE" "$SCORES" \
  games/magic/fixtures/accuracy/m21/footer-collector-boundary-plan.json "$COLLECTOR_OUT"
node games/magic/tools/accuracy/modern-footer-study.mjs \
  "$INPUTS" "$NATIVE" "$SCORES" \
  games/magic/fixtures/accuracy/m21/footer-artist-boundary-plan.json "$ARTIST_OUT"
node games/magic/tools/accuracy/modern-footer-study.mjs \
  "$INPUTS" "$NATIVE" "$SCORES" \
  games/magic/fixtures/accuracy/m21/footer-legal-fine-plan.json "$LEGAL_OUT"
python3 games/magic/tools/accuracy/modern-land-glyph-measure.py \
  "$INPUTS" "$NATIVE" "$SCORES" "$MAGIC_ACCURACY_CACHE" "$GLYPH_OUT"
python3 games/magic/tools/accuracy/modern-land-glyph-controls.py
```

Install the pinned Python requirements from
`games/magic/tools/accuracy/modern-calibration-requirements.txt` first. Font
variants paint natively at 732 px; the baseline is checked against the full-card
capture before ranking proposals. Translation is comparison-only within a fixed
component region. There are no per-card rendering offsets. Copyright uses its
physical row rather than including artist names in the same fit. The artist
search includes the selected collector font because its measured code width
also sets the artist credit's origin.

The land-symbol study estimates paper and ink independently for each image,
then fits shared per-color bounds to the filled ink. Known translation/scale
controls cover all five colors with different source/reference ink and paper
colors, and reject missing contrast. The high body-mask overlap does not certify
bezel, cast shadow or color accuracy. In particular, a black cast shadow cannot
be separated from black ink by color alone, and the white symbol's gray bezel
still differs from the warm reference.

A complete experimental native replay uses:

```sh
node games/magic/tools/accuracy/modern-calibration-prototype.mjs \
  "$INPUTS" "$NATIVE" \
  games/magic/fixtures/accuracy/m21/modern-prototype-refined-plan.json "$PROTOTYPE_OUT"
node games/magic/tools/accuracy/modern-calibration-pair-report.mjs \
  "$SCORES/scores.json" "$PROTOTYPE_SCORES/scores.json" \
  "$NATIVE/capture.json" "$PROTOTYPE_OUT/capture.json" "$PAIRED_OUT"
```

Score the replay with `modern-calibration-score.mjs` using exactly the baseline
normalization and metric graph before producing the paired report. That report
rejects changes to references, poses, metric code, coverage, component eligibility
and the printing census. It separates diagnostic credits from eligible weighted
components; an improvement in unverified credits must not inflate the total.
Unsupported region maps remain in the denominator.

The optional `modern-native-frame-diagnostic.mjs INPUTS NATIVE OBSERVATIONS
TEMPLATES OUT` compares native outer-frame fields to the scan-only consensus.
Identical fields share computation while retaining every printing. Its affine
residual is a diagnostic, not a renderer transformation: outer fields cannot
establish the shape or position of inner art, rules or type boundaries.

## Complete native footer and land-symbol replay

The [numeric replay](../fixtures/accuracy/m21-footer-and-land-native-replay.json.gz)
retains all 297 Original printings, hashes and differential checks for their
594 native layers, all footer proposal rows, the 15 large-land-symbol measurements
and the 61 distinct native outer-frame field diagnostics. Every etching is unchanged; face differences stay inside the permitted
footer and basic-land symbol regions, with no alpha changes or browser faults.

The same-pose, same-metric structural mean on the 283 supported ordinary faces
changes from 73.28 to 74.52/100.
All 15 basic lands improve and the other 268 structural scores are unchanged.
Diagnostic artist/legal overlap changes from 64.25 to
85.82/100. Credits remain unverified and excluded from the
weighted total. Four sample footer strings and renderings were visually checked;
this is not an all-printing content approval. All 14 planeswalkers remain visible
as missing full-card region maps, with their native layers and regional footer
diagnostics retained.

The expanded searches select Gotham 12.5 px for collector text, Beleren small caps
11.75 px with zero added tracking for artists, and MPlantin 11 px with 0.1 px
tracking for copyright. Collector and artist sizes/offsets are interior to the
refined search ranges. The refined replay plan is experimental, not a shipped
profile. Glyph-body masks, fixed scan poses and samples cannot certify remaining
bezel, shadow, ink-color, original-content or frame-geometry questions.

## Planeswalker registration follow-up

The [projection research](../fixtures/accuracy/m21-planeswalker-registration-research.json.gz)
retains the rejected wider-reserve trials and the linear RGB projection trials.
The selected research candidate estimates a largest-variance color axis within
each existing native frame strip and filters at 0.4 canonical px. All 98 existing
planeswalker pose/color controls pass: 28 initial controls, 42 confirmation
controls and 28 combined color/pose controls. Maximum corner RMS is 0.336 px and
maximum corner error is 0.476 px, within the unchanged 0.35/0.6 px limits. These
are reused development cases, not untouched holdouts. All 504 fields across the
14 planeswalkers remain byte-identical when pixels outside their reviewed native
frame fields are changed.

This is not production normalization approval. Port the shared projection and
per-family filter policy, keep ordinary HSV/0.8 behavior unchanged, version the
encoded fields correctly, and replay observations, templates and controls. The
private research overlay still has a legacy filter label; the frozen source
hashes and actual declared parameters identify its method. No old-label cache
may be used for the new projection.

[Scoring-window reviews](../fixtures/accuracy/m21/planeswalker-region-review.json)
cover all 14 ordinary M21 planeswalkers. The experimental
`modern-planeswalker-regions.mjs` separates the static Teferi row from indented
loyalty text, retains ability badges and starting loyalty, and mattes the corners
to reveal silhouette differences. It refuses other sets, altered sources and
unreviewed ability arrangements. These windows do not certify rendering accuracy
or change the live Lab metric. The frozen complete-census diagnostic below uses these maps; credits remain
diagnostic. Holographic-stamp contours and remaining layout/color fits are still
pending, so mapped coverage does not certify the whole renderer.

## Printed footer content and collector columns

The [initial partial footer content review](../fixtures/accuracy/m21/footer-content-review.json)
covers 33 unique printings: all 20 PW-deck cards, all 15 canonical-name/diacritic
candidates, and two ordinary controls, accounting for overlap. It identified twelve of the
[exact-printing artist corrections](../fixtures/accuracy/m21/artist-credit-proposal.json).
Do not remove accents generically: the printed Milivoj Ćeran and Bartłomiej Gaweł
forms match provider metadata. These are inactive proposals, not a changed runtime
catalog. Verify the remaining artists/legal strings before certifying credits.

The review also finds a separate rarity column on bonus cards and a star in the
set/language line of the five foil-only planeswalkers. The current painter
concatenates a bonus serial and rarity, moving rarity far left. The
[column diagnostic](../fixtures/accuracy/m21-collector-column-diagnostic.json.gz)
retains all 297 source/native rows. Median visible rarity left is 93 px on the
23 bonus scans versus 58 px in the prototype. These are visible glyph bounds,
not final font origins. Use a shared column fit, not per-card offsets.

```sh
python3 games/magic/tools/accuracy/modern-collector-column-measure.py \
  "$INPUTS" "$PROTOTYPE_OUT" "$PROTOTYPE_SCORES" "$COLUMN_OUT"
```

This heuristic uses per-image ink/stock contrast rather than a fixed bright-pixel
threshold. The latter misses Predatory Wurm's faint but visibly present U; it
does not need a missing-rarity override. Exact native font/layout fitting must
follow. Apply the reviewed artist strings and collector-layout corrections
before the final artist/collector refit.

## Complete-census paired diagnostic

The [297-card replay](../fixtures/accuracy/m21-complete-census-native-diagnostic.json.gz)
uses the experimental PCA poses for 14 planeswalkers and preserves all 283
ordinary pose rows, metric objects and normalized reference hashes exactly.
A shared lower-left frame field was moved from empty black stock to the actual
curved boundary after reviewing all 14 scans. Every planeswalker frame component
then passes the existing signal gate; no gate or metric weight was relaxed.

With these fixed poses and maps, the native footer/land prototype changes the
297-card structural mean from 73.09 to 74.27/100: 15 improvements, 282 unchanged,
zero regressions. All 297 etchings and face alpha channels are unchanged. The
292 nonfoil references have a separate summary in the evidence. Credits improve
from 64.38 to 85.57/100 diagnostically and remain excluded from the total. These
means include new planeswalker maps and cannot be compared directly to the old
283-card mean. This is complete census coverage, not completed M21 calibration.

## Shared projection implementation

The shared tools now use `modern-frame-policy.mjs` to select a fixed fine signal
and search policy by geometry. All 283 ordinary encoded fields and complete
normalization rows remain exactly equal to V21. All 504 planeswalker field values
and all 14 fitted transforms, support scores and optimization results exactly
match the frozen PCA research. All 297 outside-field isolation checks pass.
The [projection review plan](../fixtures/accuracy/m21-frame-projection-review-plan.json)
binds a new observation hash without changing or replacing historical reviews.
Its [window review](../fixtures/accuracy/m21-frame-window-pca-review.json)
retains the source-mask ancestry and complete field parity evidence.

The new float field format refuses inconsistent filter, channel and projection
metadata. Ordinary observations can still be replayed with their original
all-HSV policy. Per-geometry observations require explicit matching policy data;
no cache may silently interpret an old field as a new projection. Only the PW
fine objective gets the bounded vertical seed grid, chosen using fit fields
alone. The third strip partition never selects a seed. The analytic, encoding,
projection, isolation and legacy-policy checks are included in
`npm run test:magic-modern-calibration`. Full known-raster replay is a separate
required gate before approving these poses for final calibration.

## Full printed-footer census

The [full footer review](../fixtures/accuracy/m21/footer-census-review.json)
checks all 297 artist, legal, serial, rarity, set/language and finish-marker
strings on 25 source contact sheets. It adds Double Vision's printed
“Heonhwa Choe” credit to the earlier twelve artist proposals. Every legal line
uses the existing 2020 wording. Ten common nonbasic lands print an L in the
collector line; Radiant Fountain instead prints C, so this cannot be inferred
from the Land type. The five foil-only deck planeswalkers print a star, and
bonus cards retain a fixed rarity column without the /274 denominator.
This verifies content only; fonts, ink and placement still need native fitting.

`modern-footer-study.mjs` accepts an optional `reviewedFooterHash` in its plan.
It verifies the full review's input/reference census and derives only the
reviewed content differences. The baseline still paints the unmodified renderer
and must pass glyph-pixel parity. Opt-in `collectorRarityX` independently anchors
the rarity column. Artist studies now include the full available artist row on
noncreatures, reserving legal space on creatures and planeswalkers. The
[column fitting plan](../fixtures/accuracy/m21/footer-collector-column-plan.json)
refits the shared font/column geometry after the content corrections. These
study substitutions do not activate a runtime profile or printing corrections.
