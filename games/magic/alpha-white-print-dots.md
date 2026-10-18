# Alpha white print-dot calibration

The existing shader can match these scans substantially better with a finer
screen and separate strengths for the frame, rules paper and printed inner
border. No renderer default or public interface changes in this experiment.

At a **732 × 1020 face raster**, use these measured candidates:

| Material             | Amount |  Period | Variation |
| -------------------- | -----: | ------: | --------: |
| White frame texture  |   0.35 | 2.00 px |      0.50 |
| Rules-box paper      |   0.40 | 2.00 px |      0.75 |
| Printed inner border |   0.30 | 2.00 px |      1.00 |

Use the existing ink separation, with `inset: 0`. Composite each material
through its actual coverage mask. The inner border uses the supplied fitted
layer's alpha; the outer surround receives no print dots. Preserve the scanned
illustration and the face alpha. An arbitrary rectangular inset cuts across the
rounded border and produces the square-corner artifact seen in the first
preview. Cardstock and gloss remain separate, whole-card visual effects.

## Results

Lower is better in this texture diagnostic. These values are **not whole-card
accuracy /100** and should not replace the existing layout and color scores.

| Material     | No added dots | Initial preview (0.45 / 2.8 / 0.5) |    Fitted |
| ------------ | ------------: | ---------------------------------: | --------: |
| Frame        |         0.871 |                              2.150 | **0.163** |
| Paper        |         0.691 |                              0.537 | **0.198** |
| Inner border |         0.875 |                              1.586 | **0.274** |

The fit improves every eligible card against no added dots: 45/45 frame,
44/44 paper and 45/45 inner border. Balance has no uncontaminated paper patch
of the selected size and is excluded from that measurement only. The eleven
comparison cards have fitted mismatches of 0.159, 0.194 and 0.279 respectively,
close to the 34-card fitting group. Those comparison scans were inspected in
earlier experiments; they are not independent validation.

Average patch RGB error increases slightly: frame 3.58 → 4.31, paper
3.49 → 4.39 and inner border 3.40 → 3.48 byte levels. Candidate selection
limits the training-group increase to one byte level per material. The fit
therefore improves texture with a small color tradeoff, not every metric.

## Measurement

1. Freeze the archived per-card affine transforms, including scale, rotation
   and shear. Keep original wording, frame reconstruction and typography fixed.
2. Select up to six clean, nonoverlapping patches per card and material. Exclude
   letters, illustration, bevels and edges. Frame patches are 16 × 32 pixels,
   paper 32 × 32 and the narrow printed band 6 × 32. This yields 795 patches.
3. Keep both images on their native pixel grids. Map scan frequency vectors
   through the inverse transpose of the affine Jacobian. Take nearby native
   candidate patches without interpolating their pixels. Warping the candidate
   first suppresses fine dots and can reward an excessively strong screen.
4. Remove smooth content with a 1.25-pixel Gaussian, then measure a Hann-windowed
   Fourier power spectrum. Compare amplitudes in five radial frequency bands
   and four directions, with luminance / opponent-color weights 0.7 / 0.15 /
   0.15. Phase is discarded, so a subpixel displacement of an otherwise correct
   screen is not treated as bad dot placement. Finite windows still introduce
   sampling variation; average patches per card, then cards equally.
5. Render parameter trials through the real public `FinishResources.printDots`
   preparation pass. Choose one shared period across the three materials;
   choose strength and irregularity separately. Select using the 34-card group
   and the color-error constraint, then inspect the other eleven cards.

There were 293 captures: 145 existing-shader trials, 121 local shader experiments
and 27 finer existing-shader trials. The local experiments changed black-ink
extraction and explored periods below the public minimum. Reducing black-ink
extraction did not beat the existing model. The selected profile uses only
currently supported settings. The experimental adapter reproduces the public
shader at its default settings within one byte level in four channel values
out of 2,986,560.

## Limits and next measurements

This fits the appearance of these cached scans, including scanner sampling and
compression. It does not identify the original press's physical screen ruling.
The strongest observed diagonal frequencies are near a two-pixel repeat at this
resolution. Keep the raster size with the profile: period is expressed in face
pixels, and the shader's antialiasing also depends on it. A higher-resolution
face needs a separate verification, not just an assumed identical score.

The inner border still has less chromatic grain than the scan. More elaborate
ink models should be tested against that residual, and against additional
colors/sets, before changing the renderer globally. Gloss and cardstock relief
were not calibrated from these flat scans. Whole-card structure scoring should
continue to suppress or separately report halftone texture so it cannot reward
extra outlines or penalize correct typography for unrelated dot phase.

## Evidence and reproduction

The compact receipt is
[`fixtures/accuracy/alpha-white-print-dots-result.json`](fixtures/accuracy/alpha-white-print-dots-result.json).
It contains all card/reference hashes, selected values, trial manifests and
hashes, aggregate results and per-card controls/candidates. Reference artwork
and generated images remain in ignored local output, outside the public
showcase. See the [tool instructions](tools/accuracy/frame_reconstruction/README.md#print-dot-calibration)
for the preparation, GPU capture, scoring and selection commands.
