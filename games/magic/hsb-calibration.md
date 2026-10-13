# Old-frame HSB calibration

The frame-family comparison is complete for this round: no replacement passed
all structural gates, so existing sources are retained. Color profiles are
explicitly opt-in with `colorCalibration: 'set-hsb-v1'`. The older
`early-hsb-v1` option limits the trial to Alpha, Beta, Unlimited and Revised.
Neither option certifies a geometric match or recolors artwork and lettering.

## Coverage and admission

The study accounts for all **63 old-frame major-set entries**, including modern
retro reprints. Major means at least 50 distinct ordinary English paper cards;
special treatments remain excluded. Alpha–Revised use their denser 334-reference
study. The remaining 59 set entries use 2,564 sampled scans from 58 sets:
30th Anniversary Edition has no qualifying high-resolution references in the
frozen inventory and remains explicitly unmeasured.

| Study                           | Frame profiles admitted | Mana targets admitted | Evidence                                                                    |
| ------------------------------- | ----------------------: | --------------------: | --------------------------------------------------------------------------- |
| Alpha, Beta, Unlimited, Revised |                       6 |                    20 | 334 references; 96 full-card previews at two tiers                          |
| Remaining old-frame sets        |                     191 |                   231 | 634 groups, 607 with reserved measurements; 191 full-card reserved previews |
| Total runtime                   |                     197 |                   251 | Rejected and sparse groups retain source colors                             |

The remaining-set frame results admit profiles in 54 sets; mana targets in 56.
All 634 groups have an outcome, including 27 without usable reserved samples.
The inventory of 13,603 old-frame printings is a coverage denominator, **not a
claim that every printing was rerendered**. Detailed scores and exclusions are
in [remaining-set results](fixtures/accuracy/old-hsb-results.json) and
[early-set results](fixtures/accuracy/early-hsb-family-results.json).

Fit one bounded HSB transform to the entire frame bitmap, including its paper,
with equal component weight. Fit the median of transformed source tiles, not
the transform of their median. Require separate calibration and reserved names,
at least three calibration and two reserved samples, improvement in the combined
score, no component-median regression above 0.25, no individual component
regression above 1.0, and at most 2% clipped source tiles. Both cohorts must pass.
Never trade a badly darkened frame for better paper: Revised green and Alpha
black now remain unchanged. Early-set profiles dropped from 22 proposed/admitted
under the earlier combined gate to six under these component gates.

Mana is fitted separately by set, stock and symbol. Fixed eroded discs and the
brightest fifth by rank suppress black glyph ink. Targets are bound to the
actual bitmap disc color; the historical procedural white sun and fallback
palette use that same target directly. Thus modern and original white symbols
no longer inherit coefficients fitted to different source colors.

## Raster evidence

The 191 remaining-set reserved full-card previews improve median sampled
frame/paper color distance **7.78 → 1.95**. Maximum component regression is 0.86;
none exceeds the 1.0 admission limit. Early-set admitted preview components
improve **4.51 → 1.60**, with maximum regression 0.44. Admitted early mana samples
improve **4.77 → 1.01**. Sampled art interiors are unchanged. All 192 early default
preview PNGs still match the pre-HSB baseline byte for byte.

Scores are 100 × Euclidean Oklab distance between robust interior color samples;
lower is better. They are neither whole-card accuracy percentages nor physical
ink measurements. Scan processing varies. See the full
[remaining raster audit](fixtures/accuracy/old-hsb-raster-results.json) and
[early raster audit](fixtures/accuracy/early-hsb-family-raster-results.json).
The early reserved cohort was reused after visual review, so it is an iterative
study, not a fresh blind test.

## Retained review cases

- Structural family uncertainty remains visible. No per-scan color transform,
  translation or scale was fitted. Early outer-frame proportions do not justify
  treating their geometric mismatch as a scan warp.
- Dual-land stripes and specialized layouts need their own source study. Existing
  Seventh Edition frame filters cannot be silently combined with an unfiltered
  fit; those groups are withheld. Partial adapter coverage is also withheld.
- Twenty-two admitted remaining-set mana groups have individually sensitive
  reserved samples despite a stable median. INV, PLS and RVR generic mana are
  prominent examples. Preserve maximum sensitivity for visual review rather
  than retuning to these reserved outliers.
- The user confirmed the white-card texture matches. Contrast spread alone does
  not establish a wrong texture. Other source-texture and geometry differences
  remain on the [asset backlog](accuracy-backlog.md).
- Per-color corrections remain preferable to the earlier global-set experiment.
  Historical global comparisons are retained in `early-hsb-global-results.json`;
  they are not the current runtime admission results.

## Loading and reproduction

Profiles guard the exact source revision, frame placement, material, border stock
and ordinary layout. Changed sources disable incompatible fits. Historical
set-symbol backings use one source resolver in both public and direct loading.
The host owns decoded source images; the Magic pack owns derived images.

Derived materials share a 16 MiB cache with pending-byte accounting and LRU
retirement. Whole-face batches wait for capacity instead of partially pinning
components and deadlocking. Cancellation before admission stops waiting;
after admission all shared builders settle before source leases release.
Temporary Canvas/ImageData staging is additional to this retained-bitmap limit.
Tests cover concurrent grids, warm cross-card/tier reuse, failure retry, abort,
eviction and single-close teardown. There is no animation-frame decoding,
readback, font loading or conversion. CPU preparation/submission timings do not
measure GPU completion time.

Run `old-frame-{cache,templates,measure,select}.mjs` first. Then:

```sh
node games/magic/tools/accuracy/hsb-shared.mjs fit
node games/magic/tools/accuracy/hsb-shared.mjs validate
node games/magic/tools/accuracy/hsb-adopt.mjs
node games/magic/tools/accuracy/old-hsb-samples.mjs
node games/magic/tools/accuracy/old-hsb-study.mjs fit
node games/magic/tools/accuracy/old-hsb-study.mjs validate
node games/magic/tools/accuracy/old-hsb-adopt.mjs
node games/magic/tools/accuracy/old-hsb-raster.mjs prepare
node games/magic/tools/accuracy/old-hsb-raster.mjs capture
node games/magic/tools/accuracy/old-hsb-raster.mjs measure
```

Fitting refuses to overwrite a frozen candidate; validation and export require
its exact hashes. Preserve prior experiments under their own names before a new
round. Source, template, capture, inventory and family-result identities are
recorded. Early previews use `hsb-study.mjs after` and `hsb-shared-raster.mjs`.
Comparisons and fits run on the CPU without Chromium; only raster capture uses
it. Downloaded art/scans and the review browser stay local and are not shipped.
