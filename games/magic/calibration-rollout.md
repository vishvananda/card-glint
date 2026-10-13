# Major-set calibration and release audit

The October 2026 inventory contains 272 major sets, using the agreed cutoff of
50 distinct ordinary English paper cards. The batch samples 6,321 presentations
across 445 set/frame/stock groups, with old frames first. Special layouts,
effects, modern legend crowns, unavailable scans, and missing sources stay in
the coverage report. These are stratified calibration samples, not accuracy
scores for every card.

The comparison stores each reference hash, renderer hash, template hash, and
frame transform. Translation and uniform scale are preferred. Rotation/skew
need improvement on separate frame strips. A bounded affine fallback permits
comparison of internal components when scan and source-frame aspect differ;
each axis is bounded to 3%, and its axis ratio remains a separate diagnostic and cannot certify the outer
frame's physical proportions. No scan transform is used by the renderer.

Set-symbol searches use cached styled SVG rasters and pure CPU sampling. The
search moves position and independent width/height, including paired steps
that keep one edge fixed. Different card names are reserved for validation.
Fresh production Canvas exports must reproduce the gain before a profile can
be adopted. Missing or inconsistent frame anchors never receive a symbol score.

Reproduce the stages with:

```sh
node games/magic/tools/accuracy/major-calibration-plan.mjs
node games/magic/tools/accuracy/major-calibration-capture.mjs
node games/magic/tools/accuracy/major-calibration-measure.mjs
node games/magic/tools/accuracy/major-calibration-verify.mjs
node games/magic/tools/accuracy/major-frame-verify.mjs
node games/magic/tools/accuracy/major-calibration-report.mjs
node games/magic/tools/accuracy/major-calibration-adopt.mjs
```

Captures and detailed measurements live in the ignored content-addressed
accuracy cache. Individual stages resume completed groups; source changes
invalidate captures. `retro`, `eighth`, `component`, `m15-accurate`, or set codes
can select a stage's groups. Browser use is limited to source rasterization and
final validation; there is no browser launch per placement candidate. These
measurements do not benchmark GPU completion time.

## Revised color audit

The deployed v0.2.10 has whole-frame HSB profiles for Revised white and red
only. Other Revised frame materials retain their source colors because earlier
fits failed component validation. Mana calibration is independent. The review
app's generic calibrated-colors label must not imply every material has a fit.

The normalized recheck in
`fixtures/accuracy/revised-color-calibration-audit.json` confirms that scan pose
is not the main color error. Across the sampled green references, the outer
frame needs about 1.04 times source brightness and paper needs about 0.67 times.
White also requires opposing brightness changes. A single HSB brightness
multiplier cannot match both. The old metric compared median color in narrow
outer strips and a broad paper patch; it did not demonstrate a close match
across the entire texture.

Do not enable rejected profiles or fit separate spatial masks across continuous
frame textures. The next color experiment should compare one smooth, shared
color transform over the complete asset (for example a regularized color LUT)
against HSB, with more spatial patches, texture-contrast checks, clipping
limits, and untouched validation names. Report coverage and residual error per
component and material, including materials that receive no adjustment.
