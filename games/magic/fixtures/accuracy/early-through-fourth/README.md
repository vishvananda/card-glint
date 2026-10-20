# Early-set revalidation through Fourth Edition

`plan.json` freezes the starting backlog for the 13 major sets (3,306 printings).
The live completion authority remains `../calibration-progress.json`, not this
planning snapshot. Large Collectors and Summer editions are included; their
fronts, borders and applicability must be checked rather than assumed to inherit
Beta or Revised. The order starts with Alpha and Beta's reopened work, then
proceeds chronologically through Fourth Edition.

Normalize references using independent scan boundaries, with separate validation
strips. Keep affine scale, rotation and shear fixed during renderer fitting.
Use nonfoil original-printing wording, including reviewed artist/type corrections.
Choose frame family and geometry before fitting color. Audit both filled ink and
edges: a hollow title must not win merely by producing more edges. Derive margins
from noncentered passages before testing centered ones. Keep renderer defaults
shared by set/material, never fit renderer offsets to individual scans.

The ABU replay tools consume the hash-bound frozen inputs and poses in `../abu-054/`
and resolve current reviewed printing corrections. Set `MAGIC_ACCURACY_CACHE` to
a restored source-object cache and choose output directories outside the checkout:

```sh
npm ci
npm run magic:data:build
node games/magic/tools/accuracy/abu-reviewed-replay.mjs "$ABU_CURRENT" all
node games/magic/tools/accuracy/abu-reviewed-replay.mjs "$ABU_BEFORE" all lea released-headings
node games/magic/tools/accuracy/abu-reviewed-measure.mjs "$ABU_BEFORE" "$ABU_CURRENT" "$ABU_REPORT"
```

`duals` instead of `all` captures all nineteen printed Alpha/Beta duals for a
quick outline check. The before run restores the released 0.6.1 heading controls
through the public set editor; everything else uses the same current renderer.
It is not a relabeled full capture of an older release. Both runs include source,
font/asset, original-reference, native-pixel and frozen-pose hashes.

Heading masks are black/white controls executed by the real painter with its
actual font state, transform and spacing; they are not cloned text contexts.
The paired measurement rejects any changed pixel outside the name/type slots.
Raw references are affine-sampled once at native size, and the regional score
uses local contrast and symmetric distances. These indices are out of 100 and
are separate from the Lab's whole-card metric. `--partial` explicitly produces
an incomplete progress report; it cannot certify complete coverage.

Keep raster previews and source assets outside Git. Submit portable measurements,
source receipts, rejected cases and profile values using the
[set contribution guide](../../../calibrating-a-set.md). Record source-asset
limitations separately from completed measurements. Experimental reconstructed
Alpha assets remain preview-only.

## Unlimited preparation

`2ed-stage.json` records all 302 cached scans/art objects and a numerically passing
independent affine normalization. Visual boundary certification is still pending.
All 302 type labels now have exact-printing reviews. The 230 Beta-derived
proposals were transcribed independently from the Unlimited scans; all agreed.
The native baseline is complete at 732×1020, and updated review provenance changes
none of its 302 face inputs or frozen poses. Frame selection and fitting remain open.
Wall of Ice's flavor-only printing has a new hash-bound empty-rules review.

```sh
node games/magic/tools/accuracy/early-printing-inputs.mjs 2ed "$UNLIMITED_STUDY"
node games/magic/tools/accuracy/early-calibration-normalize.mjs "$UNLIMITED_STUDY/inputs.json" "$UNLIMITED_STUDY/normalization"
```

Both tools are offline and use the existing source-object cache. The separate
early-set entry preserves the ABU normalizer's historical source receipts while
reusing its scan-only numerical modules. A numerical pass does not by itself
approve a new frame profile or original-type wording. To make a native baseline
from these external manifests without modifying frozen ABU fixtures:

```sh
node games/magic/tools/accuracy/abu-reviewed-replay.mjs "$UNLIMITED_NATIVE" all 2ed current "$UNLIMITED_STUDY/inputs.json" "$UNLIMITED_STUDY/normalization/normalization.json"
```

Both manifests must match by byte hash, set and reference hashes. The capture
retains every input's wording provenance; transferred labels remain proposals
until checked against the matching Unlimited scan. Native pixels do not turn an
unreviewed type proposal into an approved wording correction.

## Alpha bottom-corner certification

The three rejected Alpha black-frame references match their unchanged uniform
poses when checked against the two printed white bottom corner marks. The weak
bottom texture correlation is retained in the evidence. The optional certificate
uses 26 previously accepted calibration-cohort scans, three independently
supported remaining edges, and both marks within one canonical pixel. It changes
neither renderer values nor scan transforms. It is scoped to this measured frame.

`alpha-bottom-corners.json` is the frozen numerical template;
`alpha-corner-recovery.json.gz` retains all 46 black-frame measurements. Direct raw
window sampling matches the existing native reference rasters. All 276 displaced,
missing-mark and square-mark controls reject. The prior successful path stays
unchanged. Client/server integration is deployed; `alpha-corner-live.json.gz`
records all 295 current Alpha scores with zero alignment rejections. The original
capture and historical rejected records remain intact. The same-generation cache
now checks template identity, so the 551 unaffected Alpha/Beta records remain
eligible while the 46 Alpha black-frame entries recompute.

```sh
node tests/magic-corner-certification.mjs
node games/magic/tools/accuracy/audit-corner-recovery.mjs "$ABU_STUDY" "$CORNER_AUDIT"
```

The audit needs the source-object cache and existing native-capture directory.
Sampling and certificate checks run on numeric pixel arrays without Chromium.
Its timing includes PNG decoding and diagnostic controls, not GPU completion.

For original-type wording review, generate raw source crops outside the checkout:

```sh
python games/magic/tools/accuracy/early-type-review-sheets.py "$UNLIMITED_STUDY/inputs.json" "$TYPE_REVIEW" "$MAGIC_ACCURACY_CACHE"
```

This optional tool needs Pillow. The crops are for reading wording, not geometric
measurement, and contain external reference pixels. `2ed-type-review.json.gz`
records the 230 transcriptions and exact scan identities; the shipped corrections
will include the reviewed annotation fields in the next renderer data build.

Recovering Alpha's Nether Shadow scan also exposes a genuine rules-wrap outlier:
seven printed lines versus eight rebuilt. Beta's identical passage already wraps
correctly. The Alpha black-creature rules check is reopened while that tier/bounds
case is investigated; complete score coverage does not certify correct layout.
