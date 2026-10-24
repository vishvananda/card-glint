# Old-frame color calibration

Color profiles are opt-in with `colorCalibration: 'set-hsb-v1'`;
`early-hsb-v1` restricts them to Alpha, Beta, Unlimited and Revised. The current
study uses the pinned ABU, Fourth, Seventh and Legends assets. Frame and paper
have separate HSB transforms. Green/black paper uses a connected source-chroma
mask that follows its irregular edge and embedded shadows; rectangular paper
interiors use fixed masks. Artwork and lettering are not recolored.

## Current coverage

The audit processed **2,898 cached examples from 62 sets**, against a 63-set
inventory. **1,825 scans passed frame normalization**. The fit accounts for 655
sampled groups; 66 inventory groups have no frozen sample (four denser early-set
study groups do not map one-to-one to the inventory). Missing references and
failed normalization never supply color measurements.

Runtime now has **53 dual frame/paper profiles across 32 sets** and **151 mana
targets across 54 sets**. Of the frame profiles, 47 pass the new automatic gates;
six preserve the previously approved Revised visual comparison. Revised's
reviewed values and source masks remain frozen rather than being silently
replaced by the new fit. Their new diagnostic flags remain visible.

- [Frozen fit](../fixtures/accuracy/old-dual-hsb-candidate.json)
- [Reserved measurements](../fixtures/accuracy/old-dual-hsb-results.json)
- [Exact runtime inventory and reviewed overrides](../fixtures/accuracy/old-dual-hsb-runtime.json)
- [Rejected and unmeasured groups](../fixtures/accuracy/old-dual-hsb-review.json)
- [Source-asset review leads](../fixtures/accuracy/old-dual-hsb-assets-review.json)

This is deliberately less automatic coverage than the earlier combined fits.
A rejected group receives source colors, not the old combined transform. Hosts
can distinguish these cases with `colorCalibrationCoverage(face)`. An admitted
color profile does not certify text, geometry, texture identity or every card in
the set. All source URLs, frame rectangles, stock and ordinary-layout constraints
must match before a profile applies.

## Measurement and admission

Each scan is aligned to a stock-correct frame target before sampling. The
existing bounded translation/scale/rotation/skew fitter validates on disjoint
frame strips. A weak dark source can use its exact stock mask only when at least
two visible RGB boundaries agree within 0.75 canonical pixels. A conflicting
mask or ambiguous scan remains rejected. Cached poses include reference,
source, target and method hashes. These poses are analysis-only.

Parameters are shared by set, stock and material, with at least three calibration
and two reserved cards. Frame and paper are fitted independently; no per-scan
color parameters are introduced. The cohorts predate this round and have been
used in earlier studies, so this is an iterative audit, not a new blind test.
Fitting refuses to overwrite frozen candidates; validation reuses their exact
parameters and source masks.

Median Oklab color error alone missed the pink Saga frame and Destiny's brown
darks. We also compare luminance-ranked RGB bins from ink-free frame patches,
which do not require matching the texture's phase. Separate admission limits
check chroma, darkest-bin tint/lightness and 10–90% texture contrast. Current
operational limits are 3 chroma units, 3 shadow-chroma units, 5 shadow-lightness
units and 2 contrast units, all in 100-scaled Oklab coordinates. These are
conservative review thresholds, not universal perceptual tolerances.

Component color error must be at most 5, median regression at most 0.25,
individual regression at most 2, and clipped source tiles at most 2%. Both
cohorts must pass. Mana is fitted separately from eroded, ink-rejected cost discs;
any sample with more than 1.5 units of position sensitivity blocks its group.
The JSON policy is authoritative for reproducing these decisions.

## Rendered checks

One reserved full-card render for each of the 53 active profiles gives median
sampled frame/paper color error **6.22 → 1.00**, relative to the unadjusted source
assets. Sampled art interiors are identical. These are color distances, not
whole-card accuracy percentages. See the
[raster audit](../fixtures/accuracy/old-dual-hsb-raster-results.json).

The reviewed Revised red profile retains one visible outlier: Stone Giant's
paper error is 6.11 versus 4.82 unadjusted. Its frame improves, and its appearance
remains the previously reviewed treatment; the mismatch is recorded rather than
fitting that scan independently. Other rejected groups include ambiguous dark
borders, insufficient normalized samples and texture contrast that HSB alone
does not match. An asset-review lead is not proof of a bad asset: scan processing
and sample geometry also contribute.

Urza's Saga, Legacy and Destiny white pass the new gates. The actual Destiny
Jasmine Seer render reduces frame-contrast error from 2.33 in v0.2.11 to 0.08;
shadow-chroma error drops from 2.99 to 1.84. The [regression measurements](../fixtures/accuracy/old-dual-hsb-regressions.json) retain the renderer and reference identities.
Frame textures now recolor near-white
highlights along with the surrounding paper. The former white-pixel exemption
created an exaggerated relief effect when paper was darkened. White mana-glyph
details retain their protection. Retro cost symbols no longer acquire synthetic
modern drop shadows merely because a set has no detailed typography profile.

## Loading and reproduction

Prepared materials share a 16 MiB Magic-owned cache with pending-byte accounting,
leases and LRU retirement. Keys include the complete dual adjustment, mask,
source revision, dimensions and pixel policy. Mask generation and color changes
happen only when preparing a missing static material. There is no animation-frame
decoding, readback, font loading or conversion. Temporary Canvas/ImageData memory
is additional. CPU preparation/submission time is not GPU completion time.

With the frozen old-frame and early reference caches available:

```sh
node games/magic/tools/accuracy/old-dual-hsb-templates.mjs
node games/magic/tools/accuracy/old-dual-hsb-samples.mjs
node games/magic/tools/accuracy/old-dual-hsb-study.mjs fit
node games/magic/tools/accuracy/old-dual-hsb-study.mjs validate
node games/magic/tools/accuracy/old-dual-hsb-adopt.mjs
node games/magic/tools/accuracy/old-dual-hsb-raster.mjs prepare
node games/magic/tools/accuracy/old-dual-hsb-raster.mjs capture
node games/magic/tools/accuracy/old-dual-hsb-raster.mjs measure
```

Use a new study revision/cohort for new fitting; do not overwrite the checked-in
candidate. External scans and frame pixels stay in the ignored local cache.
The earlier `old-hsb-*`, `early-hsb-*` and `revised-dual-hsb` reports are historical
evidence; the runtime inventory linked above identifies the active profiles.
