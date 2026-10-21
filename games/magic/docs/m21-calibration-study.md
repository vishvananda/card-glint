# M21 calibration study

Status: experimental. The current renderer defaults have not been replaced by
these measurements. Numeric evidence is in
[`m21-registration-experiments.json`](../fixtures/accuracy/m21-registration-experiments.json)
and [`m21-baseline-diagnostic.json`](../fixtures/accuracy/m21-baseline-diagnostic.json).

The current method has support on all297 scans but passes230/231 initial
recovery cases. The broader confirmation includes actual HSV changes and has
exposed high-confidence color-driven drift on Radha. These poses remain
unapproved; a geometric edge/phase comparison needs investigation before fitting
final defaults. The [type-line proposal](../fixtures/accuracy/m21/README.md) is
versioned separately from its pending runtime adoption.

The source census contains 297 ordinary printings, 50 semantic material/frame
variants and 17 registration families. Five planeswalker-deck printings have
only foil references: check their layout, but exclude them from ordinary-paper
color fitting. Four Teferi printings use the taller four-ability geometry.
M21 contains no legendary land or multicolor planeswalker, so transfer to those
families requires separate controls with matching pinned asset sources.

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
2. Run `modern-frame-observations.mjs INPUTS OBSERVATIONS`. It extracts reviewed
   frame strips directly from native-resolution scans. Gaussian filtering is
   restricted to each strip before any resampling; replacing all pixels outside
   those native strips must leave every packed field byte-identical.
3. Review all strip footprints. The two M21 frame-window review fixtures bind
   the source census, extraction bounds and observation hash. Titles, artwork,
   rules descenders and collector text are excluded. Do not widen a window just
   to recover a stronger signal.
4. Run `modern-calibration-normalize.mjs OBSERVATIONS/observations.json POSES`.
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
6. For an explicitly provisional baseline, run `modern-calibration-score.mjs
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

Indices are reported out of 100; they are not percentages of visual fidelity.
A passing regional fit does not prove an entire card, frame family or set.
