# Alpha white: corrected corners and complete-frame refit

The corrected source restores the missing bright corner marks. A shared border
placement fit and another bounded texture pass improve the previous experiment
on all 45 whole-card scores. No renderer defaults or public APIs change.
The [receipt](fixtures/accuracy/alpha-white-corrected-corners-result.json) contains
source hashes, parameters, all-card results and isolation checks. See the
[reproduction guide](tools/accuracy/frame_reconstruction/README.md#corrected-corner-layer-and-complete-frame-refinement).

## Results

| Mean across 45 Alpha white cards   | Previous best | Corrected source | Border refit | Full backpropagation |
| ---------------------------------- | ------------: | ---------------: | -----------: | -------------------: |
| Whole-card structure /100          |        83.745 |           83.745 |       83.745 |           **83.996** |
| Trusted frame/paper structure /100 |        91.022 |           91.056 |       91.066 |           **91.875** |
| Corner-mark structure /100         |        68.548 |           88.914 |       90.981 |           **91.468** |
| Bright corner-mark Dice /100       |         0.000 |           68.363 |       76.880 |           **77.782** |
| Corner RGB error, 8-bit levels ↓   |         4.493 |            3.434 |        3.187 |            **3.170** |

Released 0.5.2 scores 70.122/100 whole-card structure on the same original-wording
inputs. That comparison includes earlier frame, text and reference-art changes;
the incremental gain in this round is **0.251 points**, not the entire difference
from the release. All 45 whole-card scores improve, by 0.019–0.471 points.

The 11 names excluded from this fit improve from 84.183 to 84.413/100 whole-card
and 90.731 to 91.596/100 trusted frame/paper structure. These scans were inspected
in earlier development, so this is not independent renderer validation.

Backpropagation mainly helps the paper texture: its all-card regional index rises
from 87.783 to 89.187. The outer white-frame texture changes little. Dark-band
structure slightly declines, from 92.088 to 91.835; on the 11 comparison names,
the geometry-only corner RGB error is 3.251 versus 3.280 after backpropagation.
Retain the independently exported geometry-only border as an alternative. The
complete candidate is selected for its whole-card and combined regional results,
not a claim that every component improves.

The whole-card metric scarcely responds to restoring the corner marks. Their
separate shape and color diagnostics remain necessary; do not infer complete
corner accuracy from the whole-card number.

## What changed

The new transparent border keeps the same dimensions and source geometry, but
preserves the intrinsic bright marks from its fourteen land scans. Geometry
adjusts four outer edges relative to the previous white-frame mapping: left
−0.815, right +0.140, top −0.361, bottom −0.205 canonical pixels. The inner white
keyline, outer charcoal and all per-scan transforms remain fixed.

The separate color fit remains approximately +(3.80, 1.06, 4.01) RGB levels.
Refinement starts from the previous blur-aware frame and adds separate coarse
luminance fields for white texture and printed stock, bounded to ±0.025 and
±0.035. It uses 34 calibration names, robust median targets, and the earlier
fixed 1.2-native-pixel observation blur. Interpolated fields are bounded again
and clipped to high-resolution layer coverage before export. The independent
white material and border overlay recompose within one 8-bit level.

## Controls and verification

All 45 prior-candidate images reproduce exactly; all 225 final candidate hashes
are verified. Native 0.5.2 baseline parity, silhouette alpha, opaque artwork and
shared text-layout equality pass on every card. The three border-only variants
also leave the printed interior pixel-identical. Original wording and the earlier
shared text candidate remain fixed throughout.

The regional metric excludes the actual replayed lettering as well as the
historical scan/native masks. It projects each render into the untouched native
scan and reports both 1.4- and 3-pixel filtered measurements. Bright-mark Dice
uses fixed corner regions, 0.6-pixel filtering and a 0.28 luminance threshold.
The whole-card scorer and its normalization revision are unchanged.

`npm run check` passes, including rustfmt, strict Clippy, Rust tests, TypeScript,
formatting and pack boundaries. Seven numerical model/refinement tests pass.
The local comparison now shows only the aligned scan, 0.5.2 and current best,
with overlay controls and corner details. Derived assets remain local and are
not added to the public showcase or package.
