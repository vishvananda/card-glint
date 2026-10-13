# Early-set HSB experiment

Frame-family selection now takes priority over color calibration. The existing
profiles remain an explicit `colorCalibration: 'early-hsb-v1'` experiment and
are not the default. Refit them after choosing the source frames. Each frame
profile records its exact source asset URL; a different asset disables that
profile rather than silently reusing incompatible parameters.

The study covers Alpha, Beta, Unlimited and Revised. The frozen plan contains
334 references, including separate calibration and reserved cohorts, and 96
full-card previews at inspection and table sizes. The complete inventories
contain 1,205 ordinary printings. Sources are cached Scryfall PNGs and matching
art crops; no downloaded imagery is committed or used by the public showcase.

## Shared frame and paper correction

The first experiment fitted frame and paper independently. User review exposed
visible discontinuities where irregular frame details cross the text-box edge.
The current experiment applies one HSB transform to the entire frame bitmap,
including its paper, preserving transparent pixels and near-black/white ink.
Mana backgrounds have separate per-set/per-symbol profiles, including the
procedural original white disc. Shapes and lettering remain unchanged.

Fit bounded HSB in encoded sRGB against robust interior color samples, with
frame and paper weighted equally. Evaluate with 100 × Euclidean Oklab distance,
not a whole-card accuracy percentage. Text, artwork and border edges do not fit
color parameters. Mana uses a fixed eroded disc and the brightest fifth by rank
to avoid dense black sun/skull glyphs dominating the measurement. Shared ±2 px
window perturbations diagnose contamination; they do not move individual scans.

The shared-transform revision reuses previously reviewed reserved references.
It is an iterative experiment, not a fresh blind test. Candidate and method
hashes preserve the fit before validation. The initial independent results
remain as historical evidence in `early-hsb-{candidate,results,raster-results,audit}.json`.

## Global versus per-color

The user chose to retain per-color profiles. A global transform sacrifices
individual colors in three of the four sets and fits worse overall in all four:

| Set       | Before | Global per set | Per color |
| --------- | -----: | -------------: | --------: |
| Alpha     |   3.95 |           2.86 |      1.53 |
| Beta      |   4.77 |           3.96 |      1.67 |
| Unlimited |   5.71 |           4.87 |      2.91 |
| Revised   |   5.80 |           5.31 |      3.35 |

Each number averages six material medians (W/U/B/R/G/artifact), each measured
from all reserved frame and paper components. Per-color numbers include proposed
fits even when runtime admission rejected them. Lands and mana are excluded
from this comparison. Full per-color parameters and errors are retained in
`fixtures/accuracy/early-hsb-global-results.json`.

## Review findings

- The opt-in prototype has 22 whole-frame profiles and 20 mana profiles.
  Lands stay unchanged pending source-frame and dual-overlay work. Unlimited
  white lacks a useful improvement; Unlimited black clips and regresses on
  reserved cards. Four mana groups are withheld for instability or no gain.
- Actual reserved preview component medians improve **4.99 → 1.88**, and
  enabled mana samples **4.77 → 1.01**. All 192 default preview PNGs match the
  pre-HSB baseline byte for byte; sampled art interiors are unchanged.
- The combined frame/paper score can hide an unacceptable component regression.
  Revised green is the clearest example: Instill Energy's outer-frame error
  worsens **5.02 → 12.06**, despite improved paper. Living Lands has the same
  conflict. Alpha black has a smaller frame/paper conflict. Keep both visible;
  do not promote these candidates to defaults or fit per-card exceptions.
- The complete inventory audit predicts component color from cached templates;
  it is not 1,205 full rerenders. Many scan-dependent regressions remain,
  especially Unlimited's dark artifact references. Parameters were not retuned
  to those outliers. Full rows are in `early-hsb-shared-audit.json`.
- White texture was visually confirmed to match. Contrast spread alone is not
  evidence of a wrong texture. Preserve this correction to the earlier flag.

## Reproduction

The original pre-HSB capture must come from the source hash frozen in
`early-hsb-plan.json`. `hsb-study.mjs after` captures default and opt-in versions
and checks default parity. `hsb-shared.mjs fit` refuses to overwrite a frozen
candidate; `validate` requires its exact method hash. Then run `hsb-adopt.mjs`,
`hsb-shared-raster.mjs`, `hsb-shared-audit.mjs` and `hsb-global-report.mjs`.
Comparisons and fitting run on the CPU without Chromium; only raster capture
uses a browser. These tools measure image quality, not GPU completion time.
The local review browser and its images remain outside the repository.
