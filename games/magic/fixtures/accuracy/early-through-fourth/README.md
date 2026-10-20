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
Seventy-two type labels have exact-printing reviews; 230 Beta-derived labels are
explicit proposals awaiting Unlimited scan checks, not newly reviewed corrections.
Wall of Ice's flavor-only printing has a new hash-bound empty-rules review.

```sh
node games/magic/tools/accuracy/early-printing-inputs.mjs 2ed "$UNLIMITED_STUDY"
node games/magic/tools/accuracy/early-calibration-normalize.mjs "$UNLIMITED_STUDY/inputs.json" "$UNLIMITED_STUDY/normalization"
```

Both tools are offline and use the existing source-object cache. The separate
early-set entry preserves the ABU normalizer's historical source receipts while
reusing its scan-only numerical modules. A numerical pass does not by itself
approve a new frame profile or original-type wording.
