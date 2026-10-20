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

## Plain-passage wrap and Beta outline batch

`alpha-plain-wrap-native.json.gz` and `alpha-plain-wrap-measure.json.gz` pair all
295 Alpha faces with the published 0.6.5 baseline. Exactly four pure rules
passages improve; all 291 other faces and all heading controls are byte-identical.
The font size is unchanged. The broader width experiment was not adopted.

The source receipt restores exact 0.6.5 painter bytes only for historical
verification. Current Alpha rules, the two Beta outlines and the reviewed
Unlimited wording require their own current evidence. The completion checker
uses the affected printing/component footprint; an old proof cannot authorize a
changed component by attaching a receipt marker alone.

```sh
node tests/magic-early-source-ancestry.mjs
node games/magic/tools/accuracy/abu-plain-wrap-measure.mjs "$ABU_CURRENT" "$ALPHA_CANDIDATE" "$ALPHA_MEASURE"
```

`record-early-source-proof.mjs` is the one-time integration recorder for this
frozen batch, not a step needed for a normal single-profile calibration. Its
reviewed receipt and complete reverse edits are in `source-proof.json`; verification
requires no external images or Git history. Reused development references are
explicitly labeled and are not represented as a new blind validation sample.

Unlimited now has a native 0.6.6 replay of all 302 own-printing reviewed inputs.
All faces, normalized scans and frozen poses reproduce the prepared baseline
exactly. The outside-first printed-boundary diagnostic is coherent on all 302
faces: the existing frame is roughly two canonical pixels too narrow and short.
This is a renderer geometry residual, not permission to change scan registration.
The recorded values are diagnostic; source-family and internal aperture reviews,
geometry candidate replays, colors and text remain open.

To reproduce the outer-boundary diagnostic without changing scan poses:

```sh
node games/magic/tools/accuracy/early-native-boundaries.mjs NATIVE_CAPTURE REVIEWED_INPUTS.json BOUNDARIES.json NORMALIZATION.json
node games/magic/tools/accuracy/early-boundary-proposal.mjs BOUNDARIES.json PROPOSAL.json
```

The first command verifies all native raster hashes and the exact input/pose
manifest identities before attaching existing calibration/validation cohorts.
The second fits one x/y frame transform per material on calibration scans only.
Predicted reserved residuals are 0.05–0.09 canonical pixels; these numbers do not
replace an actual native candidate replay, internal aperture checks or frame
source comparison, and do not close a calibration task.

## Published 0.6.6 full-card check

`release066-scores.json.gz` records the latest maintainer result per printing,
face and generation, without counting duplicate history rows. All 597 normalized
scan hashes and registration transforms match the 0.6.5 baseline. Exactly six
faces change and all six scores improve; the other 591 retain identical scores.
Alpha's mean is 67.207/100 and Beta's is 67.565/100. These are the Lab whole-card
indices, distinct from the regional frame/text indices above. The scores predate
Dragon Whelp's new rich-paragraph correction and do not close outstanding set tasks.

## Native Unlimited geometry and pigment trials

Keep the same renderer source as the native baseline: trial tools reject a
source mismatch rather than silently combining unrelated revisions. The study
plugin exposes temporary frame/art/stock-mask inputs only inside Vite; no study
controls or scan transforms enter the published painter. Every trial's control
must reproduce its immutable native baseline PNG bytes.

```sh
node games/magic/tools/accuracy/early-frame-trial-replay.mjs NATIVE_CAPTURE DEFINITION.json TRIAL_CAPTURE
node games/magic/tools/accuracy/early-stock-mask-verify.mjs NATIVE_CAPTURE TRIAL_CAPTURE mask-only MASK_REPORT.json
python games/magic/tools/accuracy/early-internal-geometry.py NATIVE_CAPTURE FAMILY_STUDY BOUNDARY_PROPOSAL.json JOINT_GEOMETRY
node games/magic/tools/accuracy/early-frame-trial-measure.mjs NATIVE_CAPTURE TRIAL_CAPTURE FAMILY_STUDY FRAME_REPORT.json
node games/magic/tools/accuracy/early-native-color-audit.mjs NATIVE_CAPTURE COLOR_REPORT.json TRIAL_CAPTURE joint-art-paper
node games/magic/tools/accuracy/abu-color-fit.mjs COLOR_REPORT.json COLOR_FIT.json
```

The optional Python tool needs NumPy, Pillow and SciPy. It fits shared source
geometry from calibration-only robust medians: cross-card art variance locates
the aperture, while frame-to-paper color transitions locate the rules box.
Pixel coordinates refer to pixel centers. Narrow false bevel peaks and missing
apertures have synthetic controls:

```sh
python tests/early-internal-geometry.py
```

The source-family command accepts an optional final geometry JSON argument to
compare every family after fitting it to the same art/paper targets. Fixed opaque
support excludes illustration interiors; original scan poses remain unchanged.
ABU is retained for all six main materials: no alternate source has a decisive
calibration-cohort advantage. Native joint geometry improves the mean regional
frame-strip index from 72.259 to 81.808/100 on 277 nonland printings, with 220
individual gains. White has substantial regressions, so these numbers remain
candidate evidence rather than a completed frame calibration. The 15 basics and
10 duals still need their own internal geometry review.

The independent outer stock-mask change improves all 302 measured boundaries,
from a median residual of 0.957 to 0.112 canonical pixels. No title/type coverage,
strict interior or face-alpha pixel changes. Etching outputs match but are empty
in these inputs; do not treat that as a nonempty etching-mask certification.

The six ordinary Unlimited materials currently resolve no pigment correction
with set HSB enabled. New frame/paper fits improve most reserved-cohort color
medians; white is already close and remains conservative. Native color replay,
contrast/black levels, mana calibration, headings, body/footer fitting and final
whole-card scores remain required. `2ed-stage.json` lists each frozen receipt and
its remaining scope. No runtime profile has been promoted by these trials.

## Complete early-set reference cache

`reference-preparation.json.gz` records all 3,306 planned printings across the
13 major sets through Fourth Edition. Source assets remain external; the corpus
fixtures contain printing IDs, source links and hashes only. The ordinary query
must include `include_variations=true`: omitting it loses 14 Arabian Nights,
two Antiquities and three Dark printings, even with `unique=prints`. These are
ordinary historical variations and remain in the original audit scope.

The offline cache is prepared for every set. Original text is a separate gate:
MTGJSON has no `originalText` for the Collectors, International Collectors or
Summer printings. Other missing entries remain listed individually. Neither an
absent original field nor an empty Oracle body certifies the original printed
body. Review exact scans before transferring another printing's wording.

`fetch.mjs --set SET` now includes variations explicitly. Run
`fetch-printing-text.mjs --set SET` afterward so its snapshot identity matches.
The Dark's three existing rules-only reviews also pass the metadata adapter:
reviewed body fields are checked separately and never misreported as type,
artist, cost or stats reviews. Stale hashes, unreviewed bodies, duplicate fields
and invalid values still fail closed.

## Native Unlimited pigment verification and white compromise

`2ed-native-color-verification.json.gz` pairs all 277 main-material candidates
with the geometry-only baseline. The same cached material painter applies HSB
before frame composition; exact supplied adjustments and a nonzero pixel effect
are checked. All illustration-core and face-alpha bytes remain unchanged.

Median frame Oklab errors fall from 9.799 to 1.227 (blue), 5.540 to 1.924 (black),
5.312 to 1.617 (red), 5.281 to 2.507 (green), and 10.796 to 1.838 (artifact).
White retains its already close source palette. Paper errors improve as well.
These are color distances, not accuracy indices. Dark Basalt Monolith and other
individual palette regressions remain explicit in the frozen per-card report;
a shared fit is not permission to recolor individual scans. Contrast and black
levels still require separate checks.

The texture-aware fit samples at most 64 source tiles per calibration printing;
it does not approximate the whole source texture with one RGB median:

```sh
node games/magic/tools/accuracy/early-native-color-fit.mjs NATIVE_COLOR_AUDIT.json COLOR_FIT.json
node games/magic/tools/accuracy/early-native-color-verify.mjs GEOMETRY_CAPTURE COLOR_CAPTURE BEFORE_AUDIT.json AFTER_AUDIT.json COLOR_VERIFICATION.json
```

Set `pigment: true` in a native trial definition to enable source-local material
candidates. Its geometry entry may include `pigment: { asset, adjustment }`.
The harness checks the actual resolved material, rejects a missing source, and
rejects a no-effect pigment candidate when the matching geometry control exists.
These are study-only properties; the library does not read them.

`2ed-white-shared-measure.json.gz` records seven shared white-frame candidates.
The calibration-only objective balances mean score against one quarter of its
largest individual regression. An additional one-pixel rightward source shift
improves calibration from 77.30 to 81.27/100 and reserved development references
from 78.41 to 80.81/100. The largest loss drops from about 23 to seven regional
points, and median outer-boundary error remains below 0.18 canonical pixels.
No per-card source position is used. This is an exploratory shared compromise,
not fresh blind validation.

`2ed-material-proposal.json` consolidates the six source/stock-mask/HSB choices
for the next integration. Its schema is deliberately a study proposal, not a
registered complete-set profile. Land geometry, illustration placement, black
levels, headings, mana and body/footer fitting remain open. Typography fitting
must use the current original wording, including Dragon Whelp's corrected flow,
instead of these older frozen frame-only body inputs.

## Alpha text-reference investigation

`alpha-text-reference-review.json` and its compressed numerical evidence compare
all 295 original-reference layouts across 0.5.2, 0.5.3, 0.5.4, 0.5.5, 0.6.0 and
0.6.6. Seventeen exact paired-wording examples also reproduce the Lab's previous
Oracle-reference setting; no inferred Oracle recipes count as evidence.
Animate Dead's displayed original text shrank from 22.5 to 15.5 canonical pixels
at 0.5.4 under that setting, while original-reference fitting retained 22.5.
Warp Artifact already differed in 0.5.2; 0.6.6 uses 33 centered with its own
original reference, versus 22.5 left-aligned with the Oracle reference.
The Lab now keeps the original column on its own reference.

The separate Oracle-inset candidate retains 80.5 canonical pixels at the left
when the existing model rejects an unsafe vertical fit. It reflows and reduces
font size within the same inset and 428–590 vertical limits, preserving the
entire visible text. Both centering references pass all 295 Alpha Oracle cases;
170 cards change, and all 295 frozen original-wording layouts remain identical.
That comparison is about layout constraints, not Oracle-versus-scan text scores.
Demonic Hordes' literal printed BBB is a separate scan-bound wording correction.

To replay published fitting, prepare a normal native `inputs.json` and a cached
object keyed by printing ID containing `{card, original, oracle}` for each exact
paired example. Use the same content-addressed external-asset cache:

```sh
node games/magic/tools/accuracy/early-text-history.mjs \
  INPUTS.json PAIRED_WORDINGS.json OUT 0.5.3 0.5.4 0.6.6
```

The tool archives immutable tags, builds each tag's own data, loads its native
fonts, records source/input/image hashes and refuses uncached external requests.
Only supplied paired records get Oracle-reference controls. It does not fetch
changing wording, mutate the checkout, adjust scans or upload scores. Temporary
source copies under `OUT/sources` can be removed after capture. Pixel evidence
stays outside Git. The gallery is at `/early-sets/alpha-text/`; its Oracle candidate
is explicitly unreleased, while the corrected original view uses published 0.6.6.

## Native Unlimited printed black levels

`2ed-keyline-selection.json.gz` records one source curve per ordinary material,
selected from four native candidates on the calibration cohort. The objective
balances median printed-keyline Oklab distance against frame/paper color and
texture-spread regressions. Validation does not choose the curve; its scans are
reused development observations, not a fresh blind sample.

| Material | Median keyline color distance before → after |
| -------- | -------------------------------------------- |
| White    | 12.206 → 3.052                               |
| Blue     | 8.804 → 2.160                                |
| Black    | 1.940 → 1.467                                |
| Red      | 3.963 → 1.978                                |
| Green    | 2.794 → 1.639                                |
| Artifact | 3.015 → 2.197                                |

These are color distances, not card accuracy indices. Of 277 cards, 242 improve
and 35 regress on this regional measurement. Individual losses remain in the
report; no scan receives its own renderer color adjustment. Dark Unholy Strength
and Raise Dead and the artifact outliers remain useful visual checks. White's
remaining difference includes source keyline geometry and antialiasing.

The native replays verify original reference/pose identities, exact released
baseline parity, unchanged illustration-core and face-alpha bytes, and unchanged
empty etching outputs. Frame and paper texture samples remain in the selection
objective. This does not validate nonempty etching or complete the set. The six
selected recipes are consolidated in `2ed-material-proposal.json`, still outside
the runtime registry. All 25 land interiors and the subsequent typography,
mana, art-window and whole-card checks remain open.

The physical-ink diagnostic follows short strips normal to each measured outer
printed boundary, choosing the darkest pixel to avoid the adjacent bevel. The
source curve has positive bounded channel slopes and returns to zero before
highlights. It is applied to cached source materials by the actual painter,
never to final card images.

```sh
python games/magic/tools/accuracy/early-frame-ink-audit.py NATIVE_CAPTURE TRIAL_CAPTURE VARIANT INK.json
python games/magic/tools/accuracy/early-keyline-tone-fit.py INK.json COLORS.json PREDICTION.json
# Render the proposed source curves with early-frame-trial-replay.mjs, then
# generate matching ink/color diagnostics for every candidate, including control.
python games/magic/tools/accuracy/early-native-keyline-select.py NATIVE_CAPTURE TRIAL_CAPTURE DEFINITION.json SELECTION.json
python tests/early-keyline-tone.py
python tests/early-native-keyline.py
```

The compact observations omit large RGB tile lists but retain every numeric
input used by native selection and the original diagnostic hashes. Reproduce
all six selections and 277 paired rows without downloading external pixels:

```sh
python games/magic/tools/accuracy/early-native-keyline-select.py --replay games/magic/fixtures/accuracy/early-through-fourth/2ed-keyline-observations.json.gz games/magic/fixtures/accuracy/early-through-fourth/2ed-keyline-selection.json.gz
```

That replay checks numerical selection only. Repeating PNG invariants requires
the referenced cached native captures. Python tools require NumPy and Pillow;
`early-basic-land-geometry.py` additionally requires SciPy. Its initial
three-illustration basic-land medians leave several art boundaries unresolved;
missing or out-of-range boundaries remain rejected rather than supplying a
speculative geometry fit.

## Unlimited basic-land geometry

`2ed-basic-land-native-verification.json.gz` verifies the five shared ABU source
transforms in `2ed-material-proposal.json`. The ordinary material map remains
separate from `basicLandMaterials`; these are integration candidates, not an
adopted runtime profile. Colors, typography, ten dual lands and complete-set
checks remain open.

| Basic land | Native frame-strip index before → after |
| ---------- | --------------------------------------- |
| Plains     | 61.8 → 82.7/100                         |
| Island     | 65.2 → 85.4/100                         |
| Swamp      | 65.7 → 91.1/100                         |
| Mountain   | 74.7 → 86.1/100                         |
| Forest     | 53.8 → 71.4/100                         |

Fourteen of fifteen printings improve; one Plains loses 0.81 regional points.
These are frame-strip indices, not whole-card scores. The three illustrations
of each name are development examples, not independent-name holdouts. Forest's
right art edge and paper sides retain the largest residuals and need another
look after color calibration; a shared source transform cannot change a source
asset's bevel shape independently.

The first joint art/paper measurement was inadequate on three illustrations
alone. Pooling all fifteen illustrations recovers the common art aperture, but
joint affine proposals still regress several colors. Both the source geometry
and those rejected native measurements are retained. Seventh Edition is a
weaker source family. The subsequent direct search uses ABU and keeps each
printing's independent scan pose fixed. It tests one shared position and scale
per land color: ±2 canonical pixels, ±0.8% horizontal scale and ±0.6% vertical
scale, selected by mean signed-gradient/census score minus one quarter of the
largest individual regression.

The comparison support is the opaque intersection across the entire candidate
envelope, so moving an aperture cannot introduce illustration detail into the
objective. The upper art strip is omitted because short heading descenders can
enter it. Native verification then repeats the score on the actual full
renderings. Maximum source-only prediction errors are 0.2–0.7 regional points.
All original wording, source/definition identities, current native raster
hashes, face alpha and empty etching layers are checked. Art placement is
intentionally adjusted to cover the source aperture; it is not certified by a
frame-only score.

```sh
python games/magic/tools/accuracy/early-basic-land-geometry.py NATIVE_CAPTURE CURRENT_FAMILY OUTER_PROPOSAL.json LAND_GEOMETRY
node games/magic/tools/accuracy/early-basic-land-search.mjs NATIVE_CAPTURE CURRENT_FAMILY LAND_GEOMETRY LAND_SEARCH
# For each emitted WL/UL/BL/RL/GL definition:
node games/magic/tools/accuracy/early-frame-trial-replay.mjs NATIVE_CAPTURE LAND_SEARCH/WL-definition.json LAND_SEARCH/WL-native
node games/magic/tools/accuracy/early-basic-land-verify.mjs NATIVE_CAPTURE LAND_SEARCH VERIFICATION.json
```

Use the exact baseline source checkout recorded by the native capture. Search
prepares a source bitmap once per color and compares cached scan profiles in
one warm browser; candidate evaluation does not compose whole cards or reload
art and fonts. Full native composition is reserved for verifying the winner.
The study does not benchmark GPU foil completion.

`early-frame-trial-measure.mjs` also accepts a final optional baseline-family
directory. It intersects current and transformed source supports before
comparing native candidates, verifies each printing's reference and pose, and
resolves basic-land keys separately from generic material `L`. No Lab scoring
method or published score generation is changed by these study tools.

## Unlimited dual-land geometry and outline review

All ten duals have one shared prepared-composite geometry candidate. It improves
the regional frame index from 64.6 to 67.1/100, with eight gains and two small
regressions. Eight calibration names select the transform; the other two names
are reused development checks. Native renders verify exact baseline parity,
unchanged face alpha and empty etching, plus an art underlap covering all source
apertures. This is not a full-card score or runtime adoption.

Own-printing outline inspection selects white for Unlimited Tundra and blue for
Volcanic Island; eight other assignments remain unchanged. The opposite-color
controls change pixels only inside the full-frame outline ring. The proposals
and compressed hash-bound measurements are listed in `2ed-stage.json`.

`early-dual-land-search.mjs` consumes a native capture and outer-material proposal;
`early-dual-land-verify.mjs` checks the resulting native frame trial. Both use the
unchanged production preparation of each composite and fixed scan transforms.
The thin-strip sampling helpers are tested against full RGBA normalization,
including alpha matting. `frame-profile-benchmark.mjs` measures their CPU work
only; it excludes painting, image readback, loading and GPU finish completion.

## Unlimited land-color candidates

The fifteen basic references now have native source-local HSB candidates: one
brown-frame adjustment and one paper adjustment for each of the five source
plates. All five median color distances improve. The third illustration in
every basic type has a darker scan palette; those five regressions remain in
the report instead of acquiring per-card color overrides. Colored rim accents,
contrast/black levels and the ten composed duals still need color checks.

The native verifier checks unchanged illustration cores, face alpha, white
stock and empty etching hashes. Prediction error stays below 0.2 Oklab distance
units. These are development fits across three illustrations per name, not
independent-name validation or whole-card accuracy scores. The compact replay
archive stores the exact JSON strings needed to reconstruct hashed source
files; artwork and PNG outputs remain in the external cache.

Run `early-native-color-audit.mjs` against each verified basic geometry capture,
then `early-land-color-fit.mjs AUDITS BASIC_GEOMETRY OUTPUT`. Replay each emitted
definition with `early-frame-trial-replay.mjs`, and verify the fifteen results
with `early-land-color-verify.mjs NATIVE BASIC_GEOMETRY COLOR_DIRECTORY OUTPUT`.
Use the frozen renderer revision recorded in the receipts for the replays.
