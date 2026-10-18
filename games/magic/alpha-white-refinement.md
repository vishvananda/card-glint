# Alpha white refinement experiments

The additional shared-frame fits improve the first reconstruction. The
blur-aware fit has the best native whole-card result; robust texture consensus
plus a small shared warp has the best masked frame/paper result. Neither is a
released default. The original study and its frozen inputs are described in
[the first experiment](alpha-white-reconstruction.md).

## Results

All fits use the same 34 calibration cards, fixed original-wording renders and
frozen affine scan transforms. The other 11 cards were withheld from these fits
but appeared in earlier development studies. These results do not constitute
fresh validation of the complete renderer. Evaluating several methods on this
small group also makes it a method-selection comparison, not a final unbiased
estimate of the selected method.

| Mean on 11 development holdout cards | Whole-card structure /100 | Masked frame/paper structure /100 | Frame/paper RGB error, 8-bit levels ↓ |
| ------------------------------------ | ------------------------: | --------------------------------: | ------------------------------------: |
| Released 0.5.2                       |                     68.95 |                             77.71 |                                  7.33 |
| First reconstruction                 |                     74.66 |                             85.24 |                                  6.04 |
| Robust shared texture                |                     74.87 |                             89.21 |                                  5.30 |
| Smooth shared warp                   |                     75.32 |                             88.55 |                                  5.76 |
| Blur-aware reconstruction            |                 **75.42** |                             90.74 |                                  5.26 |
| Shared texture + warp                |                     75.33 |                         **90.79** |                              **5.17** |

These are distinct indices, not percentages of correct pixels. The whole-card
metric includes unchanged typography, symbols and artwork. The masked metric
uses only trusted frame/paper pixels and mask-normalized contrast/structure
statistics. Native scoring is unchanged and unblurred for every candidate;
the observation blur is used during fitting only.

The blur-aware variant improves whole-card structure on all 45 cards relative
to the first reconstruction. Its all-card mean is 76.28/100 versus 75.39/100.
The other variants have regressions: the combined warp/texture variant loses
0.51 on Circle of Protection: Blue, 0.33 on Circle of Protection: Red and 0.19
on Healing Salve. Do not stack all methods merely because their averages improve.

## Methods and constraints

- **Shared texture:** robust per-pixel median and MAD over the 34 registered
  scans. Require five-card support, reaching full confidence at twelve cards;
  exclude all text, art, symbols, dark stock and unsafe filtering halos.
  Matched low-pass texture corrections are capped at ±0.075 luminance and
  ±0.025 chroma. Chroma uses a much wider 12-native-pixel smoothing kernel.
- **Shared warp:** one bicubically interpolated 13 × 17 displacement grid, fitted
  to boundary gradients in 80 steps. Maximum displacement is 1.223 canonical
  pixels; the minimum sampled Jacobian is 0.983. No scan transform is changed.
  This is a smooth grid warp, not a fitted warp for each card.
- **Blur-aware fit:** search shared Gaussian sigma values 0, 0.3, 0.6, 0.9, 1.2,
  1.5, 1.8, 2.4 and 3.2 native pixels. The training optimum is 1.2, inside the
  tested range. Freeze that observation model and fit a bounded scalar residual
  on a 244 × 340 grid for 80 steps. Cache fixed filtered terms and use linear
  grayscale filtering to avoid redundant RGB convolutions. This is a restricted
  Gaussian observation model, not calibrated CMYK screening or ink spread.

The consensus and warp can recover modest local color and placement differences.
The blur-aware model produces the most consistent whole-card improvement here.
All require another comparison when the supplied frame geometry changes.

## Artwork resolution and sampling

Every cached Alpha white `art_crop` in this study is 563 × 451 pixels. The full
PNG is 745 × 1040, with approximately 568 × 457 source pixels across the sampled
art aperture. The crop therefore offers no resolution advantage in this sample.
Those dimensions are sampling bounds, not evidence of additional optical detail.
Keep higher-resolution art crops for other printings; select the source per
printing rather than switching all artwork to scans.

Two art experiments use the frozen affine transform to extract only the art
aperture: a hard aperture and a one-canonical-pixel transition on each side of
the seam. The frame and all lettering remain unchanged. Across all 45 native
renders, no pixels change outside the explicit art mask and alpha is preserved.

On the 11 comparison cards, the hard extraction scores 77.446/100 whole-card
structure and the feathered extraction 77.452, versus 74.662 for the first frame
reconstruction with the original art crop. The art component changes from
70.569 to 93.099 for both variants. This uses the reference itself as artwork:
**it measures extraction fidelity, not independent reconstruction accuracy.**
The whole-card frame component includes art-window boundaries, so it can change
even though the frame asset is fixed. The feather's score difference is too small
to establish a generally preferable treatment.

A misleading moiré pattern in the difference overlay came from different
resampling paths: direct scan-to-preview versus scan-to-native-to-preview.
Both sides now use the same 732 × 1020 pixel grid before preview resizing.
Every opaque art-interior RGB sample is identical on all 45 native cards.
The browser difference control also reports zero interior difference. The older
sampling remains selectable for diagnosis. Stored metric results are frozen;
the visualization fix does not silently change their normalization or revision.
Any metric normalization change needs a separately versioned comparison.

## Corners and the missing inner border

The first reconstruction excluded dark stock and kept the renderer's 0.058
corner radius. It therefore could not recover the separate printed inner band
visible inside Alpha's outer stock. Treat this as a missing component, not a
texture-fitting failure.

A provisional shared two-band model estimates an outer neutral tone near
RGB (27, 27, 27) and a slightly chromatic printed band near RGB (32, 29, 38), with
separately measured rectangular boundaries. It changes only stock pixels and
preserves the source alpha. A separate native silhouette override fits a radius
of 0.071803 of card width, about 35.04 canonical pixels.

All 45 raw reference PNG alpha channels have the same hash. Thus the silhouette
fit matches one common Scryfall reference mask; it is **not** 45 independent
measurements of physical Alpha corners. Do not transfer it to Beta or other sets
without their own measurements.

On the 11 comparison cards, native corner-alpha overlap improves from
96.88 to 99.36/100, and dark-stock RGB absolute error falls from 9.07 to 4.75
8-bit levels. These diagnostics are separate from whole-card scores. The entire
printed interior remains pixel-identical to the blur-aware baseline on all 45
cards. The provisional band is a preview, pending regenerated source assets;
no whole-card rescore or production calibration claim follows from it.

For replacement assets, prefer independently controllable layers:

1. Full-size frame material with the outer stock transparent.
2. The printed inner border, either included in that material or supplied as a
   separate transparent overlay on the same canvas.
3. Renderer-owned outer stock color and corner silhouette, with an optional
   separate stock texture if needed.

Keep the full 1062 × 1482 canvas and artwork aperture coordinates. Do not crop
assets to their visible bounds. A separate inner-border overlay allows shared
geometry and independent black-level calibration without moving frame colors.
Keep any opaque source composite as evidence, not the only editable asset.

## Evidence and checks

The [result receipt](fixtures/accuracy/alpha-white-refinement-result.json) records
method hashes, fit settings, candidate hashes, all-card scores, native captures,
stock/corner diagnostics and pixel-isolation checks. Commands are in the
[tool instructions](tools/accuracy/frame_reconstruction/README.md).

Verification: seven numerical tests pass; all 45 no-op full-card captures match
the released baseline exactly; the refinement baseline matches the first
reconstruction; the art and border experiments pass their isolation controls.
The local comparison has transparent, red/green and difference overlays,
common-grid sampling, 45 cards and desktop/mobile checks without page errors or
horizontal overflow. Captures and generated assets remain ignored local files.
No renderer interface, set profile, package asset or release status changes.
