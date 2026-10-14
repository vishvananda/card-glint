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

## Adopted results and review queue

The completed batch accepts 3,254 frame normalizations and adopts 219 symbol
profiles across 157 distinct sets, plus 17 component-frame horizontal insets.
The source-pinned tables exclude custom symbols, unsupported stock and modern
legend crowns. Reserved-card mean symbol edge F1 at one-pixel tolerance is:

| Frame family         | Profiles | Reserved cards | Before | After |
| -------------------- | -------: | -------------: | -----: | ----: |
| Retro                |       14 |             61 |  0.654 | 0.699 |
| Eighth Edition plate |       42 |            187 |  0.842 | 0.916 |
| Component            |       79 |            358 |  0.800 | 0.892 |
| M15 plate            |       84 |            396 |  0.823 | 0.899 |

These are symbol-region scores, not whole-card accuracy. The report retains 189
symbol groups for review, 23 missing or unconfirmed symbol-source/absence
policies, 11 groups with no printed symbol and three unsupported groups.
Shared frame residuals occur in 215 groups; asset-shape differences are not
silently converted into runtime distortions. Five sampled presentations could
not render because their text overflowed: Seek Bolas's Counsel in CMB1/CMB2
(two frame variants each) and Roiling Horror in the PLC Eighth Edition plate.

The existing comparison guards for 15 old-frame sets were transferred only
after every stored frame target measurement matched the current frame-only
raster exactly. This preserves validated comparison geometry across symbol
changes without refitting scans or changing their transforms. The
`registration-geometry-transfer.mjs` tool records both source hashes and the
matching measurements in each profile.

## Revised color audit

Versions 0.2.10 and 0.2.11 have whole-frame HSB profiles for Revised white and red
only. Other Revised frame materials retain their source colors because earlier
fits failed component validation. Mana calibration is independent. The review
app reports coverage per face rather than implying every material has a fit.

The normalized recheck in
`fixtures/accuracy/revised-color-calibration-audit.json` confirms that scan pose
is not the main color error. Across the sampled green references, the outer
frame needs about 1.04 times source brightness and paper needs about 0.67 times.
White also requires opposing brightness changes. A single HSB brightness
multiplier cannot match both. The old metric compared median color in narrow
outer strips and a broad paper patch; it did not demonstrate a close match
across the entire texture.

Do not enable rejected profiles without a new comparison. The next color
experiment should compare one smooth, shared
color transform over the complete asset, first testing a tonal gamma/contrast
curve and then a regularized color LUT if needed, against HSB, with more spatial patches, texture-contrast checks, clipping
limits, and untouched validation names. Report coverage and residual error per
component and material, including materials that receive no adjustment.

The follow-up [frame-color study](frame-asset-research.md#revised-color-alternatives-after-the-major-set-pass)
also tests ABU source textures and, following user review, source-derived
irregular paper masks with separate border/paper transforms. The earlier
whole-frame-only constraint no longer excludes this masked alternative.

## Follow-up with a larger old-frame sample

The v0.2.13 source recheck uses 212 nonfoil cards from Seventh Edition and the
three Urza sets, preserving the original six fitting names per set and reserving
all additional cached frame-study names. Of these, 172 pass frame normalization.
The [follow-up receipt](fixtures/accuracy/old-symbol-alignment-v0213.json)
records the source identities, candidate deltas, scores and regressions. Detailed
per-card transforms and image hashes remain in the local accuracy cache.

Seventh Edition's wider symbol improves the reserved broad-region F1 from
0.728 to 0.804 across 45 cards, but regresses on Sulfurous Springs. Urza's Saga's
larger symbol improves 0.731 to 0.768 across 36 cards, with regressions including
Lingering Mirage, Forest and Remote Isle. These are fresh Canvas results after
frozen per-card frame normalization. Neither proposal is adopted. Legacy's
identity fit and Destiny's negligible width change offer no reserved gain.

A second check freezes a smaller envelope around the baseline symbol and scores
dark ink and light outlines separately. It catches regressions hidden by nearby
frame/type edges in the broad metric; candidates that extend beyond its envelope
are rejected. Both metrics must improve before accepting the new study. This
check is insensitive to moderate brightness changes, but remains a structural
score: gradient colors and material polarity still require visual inspection.

```sh
node games/magic/tools/accuracy/symbol-alignment-plan.mjs
export MAGIC_CALIBRATION_PLAN=old-symbol-alignment
export MAGIC_CALIBRATION_REVISION=alignment-v0213
node games/magic/tools/accuracy/major-calibration-capture.mjs
node games/magic/tools/accuracy/major-calibration-measure.mjs
node games/magic/tools/accuracy/major-calibration-verify.mjs 7ed usg --include-review --symbol-shape
```

Study plans and revision directories are explicit, preserving the original
major-set cohort and prior evidence. The remaining outliers need inspection of
frame/stock normalization and symbol material before trying another shared fit;
their individual placements are not runtime exceptions.
