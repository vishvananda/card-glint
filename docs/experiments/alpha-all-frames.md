# Alpha material reconstruction experiment

This experiment compares original-wording native renders against frozen Scryfall
scan poses. It does not replace the shipped Magic frames. External frame PNGs,
scans, and generated card images stay in ignored output directories.

The material groups are white, blue, black, red, green, artifact, and land. Land
uses the supplied neutral material and four tint masks; its five shared color
palettes are measured across the historical basic and dual lands. A synthetic
Alpha-style Volcanic Island uses the red/blue palette and a labeled Beta visual
reference. It is never a training example or part of the score denominator.

## Inputs and capture

Use cached ordinary English nonfoil scans and art crops, reviewed original
wording, the components manifest, and an accepted per-scan affine pose manifest.
Keep rejected poses labeled. Do not fit a new pose to each texture candidate.
Set `MAGIC_ACCURACY_CACHE` to the cache directory and `MAGIC_NATIVE_SOURCE_ROOT`
to the checkout of the released renderer being compared. The latter is recorded
in the capture receipt, so an experiment checkout cannot silently pose as the
released version.

```sh
node games/magic/tools/accuracy/frame-reconstruction-input.mjs \
  INPUTS.json POSES.json COMPONENTS.json lea U OUTPUT/U
```

Extract the supplied material archive into `OUTPUT/inputs` and link that folder
as `OUTPUT/U/inputs`. Include the corrected separate inner-border image at
`inputs/inner-border/alpha-inner-border-sharpened.png`. The seven full-frame
sources must have the same dimensions and shared coverage alpha.

## Fit and replay

Python dependencies: NumPy, Pillow, SciPy, and CPU PyTorch. The fit tools use two
Torch threads. Run a small number of material jobs at a time; native browser
captures are a separate, bounded workload.

```sh
python games/magic/tools/accuracy/frame-reconstruction-set.py OUTPUT/U \
  OUTPUT/U/inputs/sharpened-frames/alpha-blue-frame.png --steps 80
python games/magic/tools/accuracy/frame-reconstruction-land.py OUTPUT/L --steps 80
node games/magic/tools/accuracy/frame-reconstruction-native.mjs OUTPUT/U \
  INPUTS.json COMPONENTS.json best OUTPUT/U/candidates.json --print-layers
node games/magic/tools/accuracy/frame-reconstruction-score.mjs OUTPUT/U \
  INPUTS.json SCORER.mjs best OUTPUT/U/candidates.json
```

The scorer is explicit and must export `scoreRegions`; its hash is saved. Native
replay requires byte-identical released baselines before recording a candidate.
`--print-layers` also exports art-free printing layers for browser composition.
The native replay supports a shared candidate plate or `perCardFile` for land
variants constructed from the same material and color palette.

Stages persist their receipts and resume: shared boundary geometry, shared color,
low-frequency texture residual, blur-aware refinement, artwork resolution audit,
outer stock, separately calibrated inner border, and bounded joint refinement.
The geometry search rejects boundary optima rather than silently clipping them.
Land tint regions are excluded from neutral texture training. Thin tint stripes
use their opaque core for palette measurement; the broad paper erosion must not
be applied to those stripes.

## Interpretation and preview

Report frame scores separately from whole-card scores. The latter can improve
simply because artwork is extracted from the normalized reference. Prefer the
art crop when it contains more illustration pixels; otherwise the full scan can
be sampled using the exact same frozen affine and native grid as the comparison.
Any edge feather must stay within the explicit illustration aperture transition.

The preview compares scan, released renderer, and experimental frame. It loads
Scryfall illustrations in the client, uses original wording, and provides search,
red/green edges, transparency, and amplified differences. Gloss and cardstock
are preview effects, excluded from scoring. Print dots are prepared once at
0.35 strength, 2 source pixels, and 0.5 variation; the exact material mask includes
the printed inner border but excludes the outer surround and scanned artwork.

The deterministic held-out names have already been inspected during development.
They diagnose shared-frame overfitting, but are not a blind test of the pipeline.
Land palette measurements use all 19 historical land scans and must be labeled
as a full-data fit. Preserve source hashes, cohort membership, normalization,
failed fits, and regional scores when sharing evidence.

The deployed preview is at <https://tetrarcum.com/alpha/> and uses the published
0.5.3 browser archive. Card tilt uses the consumer's independent spring motion,
with matching optical normals, pointer release rebound and reduced-motion
support. Overlay computations run in a worker and cache repeat modes. Fit view resamples both sources to the actual physical display pixels before
computing edges or differences, avoiding a second CSS reduction of the edge
map. Pixel-area integration handles downsampling. There is no extra grain blur;
1:1 mode preserves every source pixel and scrolls within each panel. Neither
view affects stored scores, normalization or the finished card images. Yellow
edges indicate agreement. Interaction evidence records runtime hashes and CPU
timings, including desktop and mobile viewport checks at device pixel ratio 2.
