# Shared frame reconstruction experiment

These offline tools compare a supplied blank frame with full native card
renders. They do not change defaults, the public API, or release calibration
status. Keep externally supplied assets, cached scans and generated galleries
under ignored `test-results/`; the Magic pack's source and fan-content policy
still applies.

The first experiment uses one Alpha white source and one shared geometry/color
profile. Frozen scan transforms are measurement inputs, never renderer options.
The full native painter supplies wording, fonts, symbols, art and compositing.
Only trusted frame pixels drive texture fitting: excluded lettering, artwork,
symbols and boundary halos cannot teach a compensating mark to the frame.

## Reproduce

Use a Python 3.12 virtual environment with `requirements.txt`. Generate Magic
data with `npm run magic:data:build`. The capture takes existing cache-only
study snapshots (`inputs.entries`, poses and component hashes); it does not
download or silently replace missing assets.

```sh
node games/magic/tools/accuracy/frame-reconstruction-input.mjs \
  INPUTS.json POSES.json COMPONENTS.json lea W test-results/frame-study

# Place the supplied 1062 x 1482 source here:
# test-results/frame-study/inputs/sharpened-frames/alpha-white-frame.png
python games/magic/tools/accuracy/frame-reconstruction-fit.py prepare test-results/frame-study
python games/magic/tools/accuracy/frame-reconstruction-fit.py fit test-results/frame-study
node games/magic/tools/accuracy/frame-reconstruction-native.mjs \
  test-results/frame-study INPUTS.json COMPONENTS.json train
python games/magic/tools/accuracy/frame-reconstruction-verify.py test-results/frame-study train
python games/magic/tools/accuracy/frame-reconstruction-evaluate.py test-results/frame-study

# Optional: replay a separately versioned whole-card metric exporting scoreRegions.
node games/magic/tools/accuracy/frame-reconstruction-score.mjs \
  test-results/frame-study INPUTS.json SCORER_MODULE.mjs train

PYTHONPATH=games/magic/tools/accuracy python -m unittest frame_reconstruction.test_model -v
```

Set `MAGIC_ACCURACY_CACHE` to reuse another checkout's content-addressed cache.
Do not use the same output directory for different input revisions. Capture
records source/scan hashes and the exact native baseline. Native replay must
match every released full-card PNG pixel before candidate comparisons proceed.
The optional whole-card scorer records its module hash and is a diagnostic only;
this tool never publishes scores or marks a set complete.

## Interpretation

- A deterministic split by Oracle identity holds out names from reconstruction.
  These are previously inspected development scans, not independent validation
  of the complete renderer. After evaluating the held-out result, `fit --all`
  refits the same procedure on every card; label that output as a full-data fit.
- Geometry uses median strips and one monotone shared panel remap. It cannot
  move a separate frame for each card. Current input poses are exploratory
  historical registrations; they do not certify the stricter contributor guide.
- Native scans remain untouched in the loss. The model samples the candidate
  into each scan. A matched 1.4-native-pixel Gaussian suppresses dot structure;
  evaluation also reports 3-pixel filtering. It is a restricted continuous-tone
  experiment, not a calibrated CMYK printing/scanner simulator.
- Shared HSB is fitted first and frozen. Backpropagation then optimizes a
  bounded 133 x 185 scalar texture residual, interpolated onto the source. It preserves
  dimensions and alpha and retains the source's existing high-frequency detail.
  Updates require at least five-card coverage and exclude dark stock. Shared
  HSB supplies color; the scalar texture fit cannot introduce colored speckles.
  A prior and smoothness term discourage unsupported changes. Coverage outside
  the observed patches must not be presented as recovered detail.
- Report frame and paper separately, with color error and boundary shifts.
  The contrast/structure SSIM term is an index out of 100, not a percentage or
  the Lab whole-card score. A better value alone is insufficient: inspect native
  full cards, residuals, masks and texture stability before adopting an asset.
  SSIM uses mask-normalized local moments after matched native filtering and
  fixed 2x decimation; excluded art and lettering do not enter its local moments.
  Evaluation caches reference statistics and uses at most two worker processes
  (`--workers 1` is available for a busy machine).

The differentiable HSB model rejects unsupported material operations. Keep
rounding outside autograd; compare quantized exports with the native `colorFrame`
operation. Do not apply the old source's HSB correction a second time to the
new calibrated material. Geometry is applied to a derived render plate; exported
reconstructed source PNGs retain the original aperture and alpha exactly.

## Follow-up ablations

Keep the first experiment frozen. The follow-up tools use its 34 calibration
names to construct a robust masked texture consensus, fit a smooth shared 2D
warp and test a shared Gaussian observation blur. Candidate plates already
include color and geometry; native replay must not apply those a second time.

```sh
node games/magic/tools/accuracy/frame-reconstruction-native.mjs \
  test-results/frame-study INPUTS.json COMPONENTS.json train --plates-only
python games/magic/tools/accuracy/frame-reconstruction-refine.py prepare test-results/frame-study
python games/magic/tools/accuracy/frame-reconstruction-refine.py fit test-results/frame-study --steps 80
node games/magic/tools/accuracy/frame-reconstruction-native.mjs \
  test-results/frame-study INPUTS.json COMPONENTS.json refine \
  test-results/frame-study/refine/candidates.json
node games/magic/tools/accuracy/frame-reconstruction-score.mjs \
  test-results/frame-study INPUTS.json SCORER_MODULE.mjs refine \
  test-results/frame-study/refine/candidates.json
python games/magic/tools/accuracy/frame-reconstruction-evaluate.py test-results/frame-study \
  --label refine --candidates test-results/frame-study/refine/candidates.json --cohort validation
```

The optional art experiment checks the cached art-crop dimensions and extracts
only the art aperture from the full scan, using the same frozen affine. Run
`frame-reconstruction-art.py test-results/frame-study --inputs INPUTS.json`,
then use its `art-source/candidates.json` with the native/scoring commands and
the label `art`. This reference-derived art is not independent prediction
evidence; report art and frame gains separately. Its one-canonical-pixel seam
feather must not copy lettering or expand across the frame.
After native capture, run the art tool again with `--verify-native` to check
baseline parity, silhouette/aperture isolation and exact opaque art-interior
RGB equality against the common-grid reference on every card.

The art tool also exports each full reference onto the same native grid as the
art extraction. Use that image when drawing preview differences: direct
scan-to-preview and scan-to-native-to-preview sampling can produce false moire.
Do not silently change the normalization used by previously recorded scores.

For the optional dark-stock and corner diagnostic, run the art extraction first,
then:

```sh
python games/magic/tools/accuracy/frame-reconstruction-border.py test-results/frame-study
node games/magic/tools/accuracy/frame-reconstruction-native.mjs \
  test-results/frame-study INPUTS.json COMPONENTS.json border \
  test-results/frame-study/border/candidates.json
python games/magic/tools/accuracy/frame-reconstruction-border.py test-results/frame-study --evaluate
```

This diagnostic fits shared band colors/geometry and an optional manifest
`cornerRadius` override. It does not change a face or a renderer default. The
source alpha remains fixed; the final native silhouette applies the override.
Identical reference PNG alpha hashes establish one common reference mask, not
independent measurements of physical card cuts. Report corner and stock metrics
separately from frame texture. Replacement frame material should leave the outer
stock transparent; a full-canvas inner-border overlay can remain independently
calibratable. Keep external assets and all previews in the ignored output tree.

For the supplied 1062 × 1482 inner-border overlay, place its extracted files in
`inputs/inner-border/`, then run `frame-reconstruction-inner-border.py OUT`.
This reuses the frozen white-frame and band boundaries, exports as-supplied,
geometry-only and independently color-adjusted plates, and records separate
band measurements. It does not refit the white texture or outer stock. The
archive's original geometry was measured on lands; do not assume that its
bottom edge matches the fitted white plate without checking.

## Original wording and typography replay

The first Alpha snapshot used original rules bodies but retained 21 modern
type-line fallbacks. `wordingMode: 'original'` alone is not source evidence.
For that exact 45-card study, use:

```sh
node games/magic/tools/accuracy/frame-reconstruction-wording.mjs \
  INPUTS.json CORRECTED-INPUTS.json
```

This verifies cached original bodies through the strict calibration adapter and
uses the scan-bound `lea/annotations-white-types.json` review. It preserves all
non-wording input fields. Prepare a separate output directory with these inputs
and the same frozen poses. Link the existing plates there rather than refitting
or duplicating source images. Re-capture and re-score: do not attach historical
whole-card numbers to corrected images. Type-only pixel isolation is checked
separately from frame fitting.

The native experiment manifest optionally accepts `textModel` for a local replay
of the archived Alpha shared typography study. Its `rules` map uses
`lea:centered`, `lea:centered-long`, and `lea:regular` groups with the original
study's `adjustment` values. Only shared layout changes are replayed; current
renderer ink remains intact. Unsafe layouts fall back to the native text.
The capture receipt records the selected group, adjustment and every fallback.
These experiments do not install a printing-ID override or change defaults.

## Corrected corner layer and complete-frame refinement

Keep a new output root for each source-archive hash. Reuse the original-wording
observations, released captures, frozen `geometry.json`, `prepared/` masks,
`art-source/` references, and the previous `refine/` and `border/` fits through
local links. Extract the new overlay into that root's `inputs/inner-border/`.
Verify its checksums before fitting; do not replace the previous source.

```sh
python games/magic/tools/accuracy/frame-reconstruction-inner-border.py OUT
python games/magic/tools/accuracy/frame-reconstruction-corners.py OUT --steps 80
node games/magic/tools/accuracy/frame-reconstruction-native.mjs \
  OUT CORRECTED-INPUTS.json COMPONENTS.json corners OUT/candidates.json
python games/magic/tools/accuracy/frame-reconstruction-corner-evaluate.py OUT --workers 2
node games/magic/tools/accuracy/frame-reconstruction-score.mjs \
  OUT CORRECTED-INPUTS.json SCORER_MODULE.mjs corners OUT/candidates.json
```

The candidate manifest uses `key`, `title`, `file`, and the same `cornerRadius`,
`artSource` and `textModel` for every entry. Include the old plate, new
`inner-border/tone-plate.png`, `joint/geometry-plate.png`,
`joint/band-only-plate.png`, and `joint/backprop-plate.png`. Link the old plate
inside the new output root. The specialized regional evaluator expects that
order and the native label `corners`.

Geometry adjusts one shared outer rectangle within ±1.5 canonical pixels;
the inner white keyline and all scan poses remain fixed. Refinement starts from
the previous best texture and fits independent 244 × 340 luminance fields for
trusted white texture and the dark printed band. Additional changes are bounded
to ±0.025 and ±0.035 respectively, including interpolation overshoot. The
previous shared observation blur stays fixed. High-resolution layer coverage is
reapplied when exporting so a resized correction cannot cross an alpha edge.
Color, silhouette, lettering and illustration are not optimization variables.

The 34 calibration names supply robust median targets; the other 11 names are
excluded. Report both cohorts and the full group, noting their earlier use in
development. Regional evaluation projects renders into each native scan and
excludes the actual replayed lettering in addition to the old scan/native masks.
It measures frame/paper, dark band and corner marks separately. Bright-mark Dice
uses the same fixed corner regions and a 0.28 luminance threshold after 0.6-pixel
filtering; report RGB error alongside it rather than selecting by overlap alone.

`joint/white-texture-plate.png` and `joint/backprop-overlay.png` preserve separate
material control. Their recomposition through the stock mask is checked against
the fitted complete plate. They already contain the experimental geometry and
color adjustments; do not apply the previous source calibration again. Keep
these derived external assets in ignored output, not the public showcase.

## Print-dot calibration

`frame-reconstruction-print-dots.py` works with the corrected-corner study's
frozen observations, prepared raw scans and masks. It excludes text and art,
measures native-pixel spectra, and chooses material settings without adjusting
per-card dot phase. Its companion `.mjs` uses the built public finish module in
one reusable WebGL context. GPU preparation/readback occurs once per candidate;
none of this is part of the tilt/render loop. The capture uses ANGLE Metal on
macOS; choose an available backend for other platforms and record it.

With a built renderer exposed as `renderer/` beside the study's output and the
output served by a local HTTP server:

```sh
export VECLIB_MAXIMUM_THREADS=1 OMP_NUM_THREADS=1 OPENBLAS_NUM_THREADS=1
export PYTHONDONTWRITEBYTECODE=1
python games/magic/tools/accuracy/frame-reconstruction-print-dots.py prepare \
  "$STUDY/corners-v3" "$STUDY/print-dots"
node games/magic/tools/accuracy/frame-reconstruction-print-dots.mjs \
  "$STUDY/print-dots" "$STUDY_URL/print-dots/"
python games/magic/tools/accuracy/frame-reconstruction-print-dots.py score \
  "$STUDY/corners-v3" "$STUDY/print-dots"
python games/magic/tools/accuracy/frame-reconstruction-print-dots.py select \
  "$STUDY/corners-v3" "$STUDY/print-dots" \
  --trials "$STUDY/print-dots"
python -m unittest games.magic.tools.accuracy.frame_reconstruction.test_print_dots
```

Use a Python environment with the numerical dependencies above. For additional
trials, copy/link the patch files and `patches.json` to a sibling trial directory
and supply a `candidates.json`. The committed result fixture contains the exact
three trial manifests for this experiment; their `source` is the relative URL
of the reconstructed blank plate. An optional `experiment` URL loads
`frame_reconstruction/print-dots-experiment.mjs`, a local diagnostic adapter for
the public GLSL. Use that only when explicitly testing ink extraction or screen
rotation; the selected Alpha profile needs neither change. Compare its default
output with the public preparation pass before trusting new trial results.

Score checkpoints validate their texture-metric, patch/manifest fingerprint and
render hash before reuse. Pass all trial directories to `select --trials` for
the shared-period fit. Selection uses the calibration cohort only, requires the
existing ink model and a supported period, and limits each material's increase
in mean RGB error to one byte level. Native texture mismatch is a separate
metric from whole-card accuracy /100. Inspect both texture and average color;
do not promote a profile just because its spectrum improves.
