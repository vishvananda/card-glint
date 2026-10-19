# Alpha, then Beta: full-set calibration review

The baseline is published 0.5.3. Experimental reconstructed frame assets are
excluded. Review Alpha before adopting Beta rendering changes. A rejected trial
or an unchanged default is not evidence that an entire set is complete.

## Order and completion

1. Freeze original printing inputs, content hashes, name-grouped cohorts, and
   nonfoil reference membership. Keep unknown wording fields explicit.
2. Validate scan-only normalization using disjoint boundary-profile samples for
   fitting, model selection, and untouched certification. Replacing the entire
   card interior must leave every extracted sample identical. Preserve uniform
   fits and axis-scale diagnostics; never feed scan poses into renderer defaults.
3. Replay every printing through the published native painter. Review all
   frame/color groups and retain rejected references in the denominator.
4. Check frame source/geometry, pigment/paper/black point, mana placement and
   colors, filled title/type ink, rules/flavor layout, artist/legal text, P/T,
   basic/dual-land treatment, and corners. Compare proposed shared adjustments
   against the same immutable inputs and require final native replay.
5. Record each component as improved, validated default, pending review, or
   blocked by a specific asset/reference. Only evidence-complete groups advance
   the completion ledger. Report the full-card scores and worst outliers.
6. After Alpha, test its rules-layout model against Beta as a candidate. Beta
   retains independent measured values unless the transfer passes.

## Normalization investigation

The Beta experiment used isolated luminance peaks, unlike the existing review
app's gradient-profile matcher. Forty-six black printings had no approved
experiment template. Other colors sometimes chose texture or the secondary
inner border. A comparison-only coherent outer-print detector recovered 281/302
under unchanged uniform-fit limits, but generalized poorly to Alpha (148/295).
It is a diagnostic prototype, not an adopted normalization policy.

The portable boundary-profile tools reproduce the established frame-only
approach. Templates come exclusively from calibration scan names, never from
renderer pixels. Fit, model selection, and certification samples are spatially
disjoint, and independent axis scale remains an explicit comparison diagnostic.
The original acceptance evidence stays intact for comparison. The frozen study
uses a new deterministic oracle-name split, keeping alternate basics together;
all validation is labeled reused-development.

Alpha's 0.5.3 rules adjustments are already active. Their font size, margins,
leading and horizontal scale must not be applied a second time. Their initial
native promotion review covered white cards; the current pass checks the full
set, including dense and mixed passages that retain the baseline layout.

## Text-size investigation

The source ink supports three size tiers. Character count predicts the tier
better than word count, but measured wrapping is also necessary: a short passage
with wide words can need the medium face. The experimental policy uses large
text through 117 characters only when it fits five measured lines at a 340px
width; medium text through 274 characters; then the small face. These are Alpha
development candidates, not a universal historical typesetting rule.

On 236 accepted references with confident line-pitch measurements, the combined
count/wrapping model agrees with 234 inferred size tiers. The other references
remain unclassified; this is not a whole-card accuracy score. The name-grouped
split is reused development evidence, not a newly sealed holdout.

Mana Vault and Hypnotic Specter use the small face despite falling below the
dense-text cutoff. Their Alpha and Beta scans have the same small text and line
breaks. Deliberate printing-specific typesetting is plausible; historical manual
adjustment cannot be established from those scans. Keep these as reviewed
outliers instead of contorting the shared count rule to fit two cards.

Use the native painter for the final comparison. The prepared component replay
must match its unchanged native raster, and each proposed rules layout must
match a full native render with no changed pixels outside the rules region
(including a one-canonical-pixel antialias fringe). Narrowing dense text can add
a line: validate wrapping before adjusting the block's optical center. Retaining
the old first-line position can push a block too low; blindly recentering an
unwanted extra line also regresses the match. Keep all ink inside the panel.

The tools accept an existing immutable capture and an offline asset cache:

```sh
export MAGIC_ACCURACY_CACHE=/path/to/accuracy-cache
node games/magic/tools/accuracy/abu-refresh-inputs.mjs INPUTS POSES REVIEWED
node games/magic/tools/accuracy/abu-type-study.mjs \
  REVIEWED/inputs.json REVIEWED/normalization BASELINES - STUDY @native-count
node games/magic/tools/accuracy/abu-calibration-score.mjs \
  REVIEWED/inputs.json REVIEWED/normalization BASELINES SCORER.mjs BEFORE.json
node games/magic/tools/accuracy/abu-calibration-score.mjs \
  REVIEWED/inputs.json REVIEWED/normalization BASELINES SCORER.mjs AFTER.json STUDY
```

`BASELINES` contains per-material `observations.json` receipts and native PNGs;
the study verifies every baseline hash. `SCORER.mjs` exports `scoreRegions` using
the review application's whole-card metric. `-` selects the portable JavaScript
text objective; an optional directory containing the compatible WASM kernel can
replace it. The same reference objective is checked against WASM before use.
The study uses one persistent browser and cached component rasters, not a browser
launch per candidate. Source, asset, input and pose identities are frozen in its
receipt. Warm normalized scan rasters are reused across wording/renderer changes;
new scan transforms or normalizer code invalidate that cache.

An optional final JSON argument selects a measured policy, for example
`'{"denseWidth":0.98}'`. `@details:REGEX` captures selected cards with baseline,
reference and candidate PNGs. Fractionally scaled text trials retain the full
native canvas origin: translating a cropped canvas can change glyph antialias
quantization even when geometry is identical. Native replay must certify this;
do not loosen the parity threshold to accept the artifact.

Refreshing original wording also refreshes its automatic sizing/centering
reference. Birds of Paradise and Northern Paladin retained stale reference runs
in the first refreshed input file; independent native replays confirm that
correcting those references leaves both 0.5.3 baseline PNGs byte-identical.

The scorer accepts the immutable baseline score JSON as a final optional
argument when measuring a candidate study. An exactly unchanged native PNG can
reuse its score only when the input manifest, reference, scan pose, complete
local metric dependency graph and runtime identity also match. Changed pixels
are rescored. The output records the source score-file hash and reused row
count. Imported policy/helper edits invalidate reuse even when the metric
entry file itself is unchanged.
