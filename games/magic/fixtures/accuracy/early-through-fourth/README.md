# Early-set revalidation through Fourth Edition

`plan.json` freezes the starting backlog for the 13 major sets (3,306 printings).
The live completion authority remains `../calibration-progress.json`, not this
planning snapshot. The [current work order](work-order.json) completes and
releases Unlimited first, then prioritizes full M21 calibration and modern-frame
defaults. The remaining early-set backlog stays queued. Large Collectors and Summer editions are included; their
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
in these inputs; do not treat that as a nondefault etching-mask certification.

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
default etching outputs. Frame and paper texture samples remain in the selection
objective. This does not validate nondefault etching or complete the set. The six
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
hashes, face alpha and default etching layers are checked. Art placement is
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
unchanged face alpha and default etching, plus an art underlap covering all source
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
stock and default etching hashes. Prediction error stays below 0.2 Oklab distance
units. These are development fits across three illustrations per name, not
independent-name validation or whole-card accuracy scores. The compact replay
archive stores the exact JSON strings needed to reconstruct hashed source
files; artwork and PNG outputs remain in the external cache.

Run `early-native-color-audit.mjs` against each verified basic geometry capture,
then `early-land-color-fit.mjs AUDITS BASIC_GEOMETRY OUTPUT`. Replay each emitted
definition with `early-frame-trial-replay.mjs`, and verify the fifteen results
with `early-land-color-verify.mjs NATIVE BASIC_GEOMETRY COLOR_DIRECTORY OUTPUT`.
Use the frozen renderer revision recorded in the receipts for the replays.

## Unlimited colored land outlines

The basic-land brown-frame correction also rotated the thin colored outlines:
Island became purple and Forest lost its yellow-green color. The shared outline
pass samples four fixed text-box line strips after the existing geometry fit.
It fits one source-local HSB adjustment per basic color across all three scans.
Three shared bounded source rings, with hue weights on the chromatic plates,
keep the brown texture and paper separate. This runs in cached material
preparation; it adds no per-frame readback or color processing.

`early-land-accent-fit.mjs NATIVE COLOR_DIRECTORY OUTPUT` emits the five native
trial definitions. Replay each with `early-frame-trial-replay.mjs`, then run
`early-land-accent-verify.mjs NATIVE COLOR_DIRECTORY ACCENT_DIRECTORY OUTPUT`.
The verifier checks native raster hashes, painter/plugin identity, fixed poses,
source-ring isolation, unchanged art/paper cores, alpha and actual etching bytes.
No raster assets are included in the numerical replay archive.

The average Oklab errors improve for every color: W 3.65→2.32, U 7.85→2.08,
B 7.12→6.46, R 3.26→2.33 and G 6.55→1.42. Eleven of fifteen scans improve.
Black's median error rises from 4.53 to 5.42 despite the lower mean; the largest
individual regression is a white illustration at 3.83 units. Keep those
residuals and the darker third-illustration palettes visible. These are color
errors, not accuracy percentages. There are no per-card color overrides or
independent-name validation claims. Dual interiors/pinlines and land contrast/
black-level checks remain open before runtime adoption.

## Unlimited heading and credit probes

`early-heading-study.mjs NATIVE_CAPTURE OUTPUT [SHARED_DEFINITION]` checks thirty
ordinary cards and all twenty-five lands. It converts native reference PNGs to
488×680 before the text objective and rejects a dimension mismatch. Native
current face hashes must match exactly; command replay error is bounded by one
gray level. Title windows omit mana costs and type windows omit the art border.
The source-transform receipts retain these measurement-only crop changes.

The first run probes individual geometry to diagnose shared bounds. A supplied
definition evaluates one common grid per role; `early-heading-select.mjs MATRIX
PROBES OUTPUT` selects using calibration rows only. Validation is reused
development evidence. A local neighboring-value check retains the selected type
and artist geometry and slightly narrows the name. The 23 development validation
cards improve from 62.9→68.0/100 for names, 61.6→65.5 for types and 62.6→64.1 for
credits, against the same fixed-gray control. All individual residuals remain.

Gray 130 is a measurement control, **not** a proposed ink color. Geometry uses
pixel offsets, font-size deltas and horizontal-scale percentage deltas. These
regional command scores do not certify original ink/shadows, body text or an
entire set. Native profile replay after material integration and full-set checks
are still required; none of the individual probes become printing overrides.

## Unlimited full-set body policy

The 302 frozen original inputs have a native body candidate: the shared count/
wrap model with an inset for ordinary medium blocks, retaining the native base
for medium blocks above seven lines. The retention decision uses compiled font
size and line count, never a card identity or scan. It preserves 32 entire native
PNGs byte-for-byte. The current-wording regional body index rises from 51.0 to 59.1/100, with
248 gains and 22 regressions. Calibration names alone select the rule; the
101 validation printings are reused development evidence.

Every actual selected score equals its prediction. All non-body pixels and face
alpha match the baseline, and the default etching plane is byte-identical. The
completed checkpoint reload checks all saved PNG hashes without rewriting the
matrix or images. The current original-input refresh replays Dragon Whelp's
inline quotation and reuses the other 301 unchanged native recipes. All 302
current scores and pixel-isolation checks are then recomputed from cached PNGs.
The common selected parameters, 248 gains, 22 regressions and 32 retained faces
remain unchanged. This closes the wording-dependent body replay, not material
integration or the complete-set audit.

`early-body-study.mjs NATIVE DEFINITION OUTPUT` measures a policy grid. Add a
native output directory to replay current plus one selected rule. This mode
checks full native isolation, silhouette and etching equality, and resumes only
the same code/input/definition/pixel checkpoint. `early-region-select.mjs MATRIX
DEFINITION OUTPUT density-guards` selects the shared body rule. The optional
density guards reuse already measured identical recipes as predictions until
the native branch replay verifies them.

`early-body-verify.mjs NATIVE POLICY_MATRIX SELECTION NATIVE_MATRIX NATIVE_IMAGES
OUTPUT` repeats score/isolation checks from cached PNGs in Node, without Chromium.
`early-body-input-audit.mjs NATIVE CURRENT_PRINTING_INPUTS OUTPUT` identifies
wording-dependent refreshes while preserving unchanged reference/art identities
and poses. `early-body-refresh.mjs prepare NATIVE CURRENT_PRINTING_INPUTS OUT`
creates a composite baseline and a changed-card subset using the same painter.
Run policy/native studies only for that subset; `early-body-refresh.mjs merge
OLD_MATRIX PARTIAL_MATRIX REFRESHED_BASELINE OUTPUT [OLD_IMAGES PARTIAL_IMAGES
OUT_IMAGES]` reuses only identical candidates, dependencies and original inputs.
The full cached-PNG verification still runs over every card. The compact current
replay archive stores exact JSON strings and hashes for these inputs and reports.
Use the tool revision recorded by each frozen receipt.

The exact typography readback helper reads 693,824 RGBA bytes for the body window
instead of 2,986,560 bytes for the entire native canvas. Its translated and
fractional bilinear samples match the full readback exactly. This is offline
Canvas2D readback accounting, not renderer throughput or GPU completion timing.

Power/toughness has a separate 92-printing geometry probe. A common shift/size
change improves the mean but regresses 26 cases, so it remains flagged for
filled-ink, stroke-width and shadow review before adoption. Gray 130 is a fixed
measurement control throughout these geometry studies.

**Etching clarification:** the historical “empty etching” descriptions were
incorrect. The unchanged default plane contains a fallback set mark with 13,366
covered pixels. Existing byte-equality evidence remains valid. These studies do
not supply an illustration-etch resolver or certify its output.

## Unlimited mana baseline

`early-native-mana-audit.mjs NATIVE_CAPTURE OUTPUT` measures every printing with a
cost directly from the cached native card and its normalized scan. It verifies
full raster hashes and stored poses, then uses the existing perimeter objective
to distinguish circle geometry from glyph edges. These circle measurements are
diagnostics; they never move scan pixels or become printing-specific offsets.
Each card contributes only its rightmost circle, and pigment targets use only
calibration names. Reused development validation and every failed measurement
remain explicit.

All 277 Unlimited cost perimeters measure successfully. The circles are roughly
0.5–0.75px too large in diameter, 0.4–1px too far right and about 1px too high in
488×680 reference units. Black's disc has the pale generic source color instead
of the dark gray printing color. Its median color error is 21.2 Oklab units;
source glyph ink is also substantially darker than the scans. These findings
identify the next shared native geometry/pigment fit. Quantile pigment probes
and hypothetical validation targets do not certify rendered corrections, glyph
shape, numeral placement, cost pitch or a completed set.

## Unlimited native mana pigments

`early-mana-color-fit.mjs NATIVE AUDIT OUTPUT` derives one disc target per symbol
and a shared ink color from calibration-name quantiles. Its fixed 54-printing
sample preserves single/multiple costs and both cohorts. Replay using
`early-mana-color-replay.mjs NATIVE AUDIT DEFINITION OUT`; then independently
verify cached PNGs with `early-mana-color-verify.mjs NATIVE COLOR_CAPTURE OUTPUT`.
The study-only source plugin calls the production cached material pipeline.
Every unchanged control matches the native PNG exactly, and all changed pixels
remain in cost/rules regions with unchanged face alpha. No runtime data or
external raster assets are installed by these tools.

On 27 reused development validation names, median disc error improves from
2.27→1.01 Oklab units and ink from 26.88→3.11. The whole-cost structural index
moves 70.56→69.62/100. Pigment values are not chosen by that edge objective:
lightening source ink to match printed ink can lower edge contrast. The initial
shared geometry grid also prefers the unchanged control despite independently
measured circle offsets. Fit outer circles/pitch separately from internal glyph
shape/placement; preserve both component and whole-region results. This is not
an all-cost fit, etching check, runtime adoption or completed set.

## Unlimited mana components and printed-cost review

The first corrected-palette whole-cost grid prefers the unchanged geometry,
despite independently measured circle offsets. Keep that result as a diagnostic;
fit physical circles/pitch independently of the ink inside them. One common
circle transform is `dx=-0.875`, `dy=1.125`, `scaleX=scaleY=0.975`, with
`spacing=0.625`, in the painter’s reference units. These are set defaults, never
printing-specific shifts. On 54 actual native examples, median center error
falls 1.57→1.00px and radius error 0.25→0.00px. Individual residuals remain.

Disc-relative glyph masks retain physical size/centering and use three contrast
thresholds. Calibration-only fitting selects scale 1.06 for W/B/R, 1.14 for G,
and the unchanged U. All 40 changed cases improve actual ink overlap; U and
numeric-only cards remain byte-identical for this glyph change. The mean
internal-ink index rises 78.2→85.8/100 across the 54-card sample. Native numeral
fitting separately uses all 47 artifacts: scale 1.06 and dy -0.75 improves its
ink index 71.1→77.3/100, with 36 gains and eleven regressions. Chaos Orb, Glasses
of Urza, Sol Ring and Celestial Prism remain flagged; do not create per-card
calibration offsets to hide them. The whole-cost edge index stays separate.

`early-mana-disc-fit.mjs NATIVE AUDIT COLOR_DEFINITION OUTPUT` measures common
circle geometry and pitch. `early-native-mana-study.mjs NATIVE COLOR_CAPTURE
DEFINITION OUTPUT` tests retained native controls, checking exact baseline and
active full-render parity. `early-mana-glyph-fit.mjs NATIVE AUDIT COLOR_CAPTURE
OUTPUT [colored|numeric]` predicts disc-relative ink adjustments; those mask
transforms require actual native replay with `early-mana-geometry-replay.mjs`.
`early-mana-component-verify.mjs NATIVE AUDIT DISC_CAPTURE GLYPH_CAPTURE OUTPUT`
and `early-mana-number-verify.mjs NATIVE AUDIT NUMBER_BASELINE NUMBER_CANDIDATE
FIT CURRENT_INPUTS OUTPUT` independently check cached PNG scores and isolation.
The replay archive retains exact inputs/reports and the historical tool revision.

The X-cost pass also found an input error: Unlimited Drain Life prints 1B,
while Oracle supplies X1B. Own-printing header review confirms 1B on eight early
printings. Alpha/Beta/Revised/Fourth already had corrections; missing reviews
are added for Unlimited, both Collector editions and Summer. The full reviewed
catalog audit finds only these four new original-cost fields changed, preserving
2,520 unrelated wording groups and all 182 artist rows. Original and Oracle
costs, both symbol-style options, stale hashes and provider immutability are
covered by resolver tests.

`early-header-input-review.mjs NATIVE CURRENT_INPUTS PROFILE_DEFINITION OUT`
replays only changed printed mana inputs with the frozen painter. A fixed union
cost window penalizes the removed extra symbol rather than cropping it away.
The corrected Unlimited control changes 1,104 header pixels, with unchanged
body/alpha; its surviving 1B pips are byte-identical. Historical extra-X header
trials are explicitly excluded from certification. Body-region results survive,
but final whole-face/profile captures must use current supplied inputs.

Thirteen actual X costs still need a font/asset comparison, and source ink
expansion remains open. These component studies are not a promoted runtime
profile, a whole-card compliance score or complete-set certification.

## Unlimited final mana component replay

Ink weight is fitted independently of physical disc and glyph size. The shared
red expansion is 0.4 source pixels per nominal 24px disc; B/G select zero.
Ten native red samples improve 80.4→89.9/100 in the disc-relative ink index,
with no regressions. Expansion makes the old fixed paper probe unreliable:
R at 0.4/0.6 differs from opaque-percentile sampling, and the first expanded G
fails composition. The selected red setting **requires opaque-percentile paper
sampling**. Its sampler is part of the calibration, not an interchangeable
implementation detail. The failed trial and all eighty B/R comparisons remain
in the numerical replay archive; sixty pairs are identical and twenty differ.

`early-mana-ink-study.mjs NATIVE AUDIT GLYPH_NATIVE OUT` renders four source-ink
weights through production preparation. `early-mana-ink-verify.mjs NATIVE AUDIT
GLYPH_NATIVE CANDIDATE OUT` independently verifies PNG hashes, pixels, isolation
and three-threshold ink scores, then selects on calibration names with a
worst-loss penalty. This does not modify the painter or install a runtime profile.

`early-mana-x-study.mjs NATIVE CURRENT_INPUTS AUDIT OUT` compares the pinned X
with six already cached font alternatives. It removes only ink-bound size for
source-identity measurement; it does not register scoring rasters or infer a
rendered offset. Existing X ranks first on twelve measurable original costs,
76.95/100 versus MPlantin's 76.23. Guardian Angel's pale disc reaches the
perimeter-search boundary and remains flagged. All thirteen actual X costs
remain in the subsequent native replay; corrected Drain Life is excluded from
X selection. There is no justification here for replacing X or applying the
numeric-only adjustments to it.

`early-mana-all-replay.mjs NATIVE AUDIT NUMBER_DEFINITION CURRENT_INPUTS
CORRECTED_HEADER OUT` composes current originals plus the joint candidate for
all 277 costs. Every control must match the frozen native PNG exactly, except
Drain Life, whose control must match its separately verified corrected header.
Only the reviewed original cost differs in supplied inputs. Fixed scan poses
never change. Run `early-mana-all-verify.mjs NATIVE AUDIT CURRENT_INPUTS
CORRECTED_HEADER CANDIDATE OUT` to recompute saved-PNG geometry, internal ink,
whole-cost structure and pixel isolation without Chromium.

Across all 277, the ink index improves 76.71→86.50/100 (242 gains, 35
regressions); median center error falls 1.55→0.99px and radius error
0.375→0.125px. All physical measurements succeed. All B/R/G ink cases improve;
blue is essentially unchanged on average and contributes 24 small regressions.
Glasses of Urza, Chaos Orb, Sol Ring and several blue costs remain outliers.
The whole-cost structural index moves 72.89→72.73/100, with 144 gains and 133
regressions. Keep it alongside the physical/pigment/ink diagnostics; its contrast
sensitivity must not choose incorrect black ink. Changes remain in cost/rules
regions, alpha is unchanged, and no heading pixels change. Inline mana colors
change on 58 faces, as expected from production preparation.

These are mana-component results with reused development validation. Full frame,
body, footer and Oracle integration, etching checks, visual normalization review
and whole-card scoring are still required before promoting the Unlimited profile.

## Optional profile preparation and Unlimited dual-paper replay

The optional stock-mask placement and source-bound mana ink policy are documented
in the [contribution guide](../../../calibrating-a-set.md). Their preparation
receipt has 302 actual native Unlimited Original before/after pairs, all identical
while the options are inactive, plus 25,200 metadata cases across 15 sets. It does
not claim native Alpha/Beta or other-set pixel parity. New or changed full profiles
must carry current guards and fresh component evidence.

`2ed-dual-paper-replay.json.gz` retains exact source/fit/definition/native/report
JSON strings with hashes. Its five common paper-color candidates improve 18 of
20 actual stripe-color observations across ten dual lands. White, black and green
improve on all four associated cards; Volcanic Island's blue and red regressions
remain explicit. This is a development fit with all names reused, not blind
validation or an adopted profile. Outline/pinline colors, brown texture contrast
and blackpoint still need fitting. No alpha, upper-card or default etching pixels
change between the geometry-only and paper trials. Upper-card isolation covers
the first 590 native rows; separate type-ink verification remains part of final
profile integration.

Use a checkout with the exact renderer source recorded by the current native
capture; keep every output outside the checkout and use a new replay directory:

```sh
node games/magic/tools/accuracy/early-dual-color-source.mjs "$CURRENT_UNLIMITED_NATIVE" "$DUAL_GEOMETRY_DEFINITION" "$DUAL_CLEAN_SOURCE"
node games/magic/tools/accuracy/early-dual-paper-fit.mjs "$CURRENT_UNLIMITED_NATIVE" "$DUAL_CLEAN_SOURCE" "$DUAL_PAPER_FIT"
node games/magic/tools/accuracy/early-dual-color-replay.mjs "$CURRENT_UNLIMITED_NATIVE" "$DUAL_PAPER_DEFINITION" "$DUAL_PAPER_NATIVE"
node games/magic/tools/accuracy/early-dual-paper-verify.mjs "$CURRENT_UNLIMITED_NATIVE" "$DUAL_CLEAN_SOURCE" "$DUAL_PAPER_FIT" "$DUAL_PAPER_NATIVE" "$DUAL_PAPER_REPORT"
```

The definition contains two `L` trials with identical shared geometry; only the
paper trial adds five pinned-asset `pigments` entries using the fit's paper HSB,
identity frame HSB and the source paper mask. The replay plugin is study-only;
materials are prepared by the real cached painter before compositing, with no
filter over the final card. The source-alpha sampler never classifies scan colors
or adjusts their pose. These color errors are Oklab distances, separate from the
Lab's accuracy indices out of 100.

## Dual-land band ordering and Unlimited pinline geometry

`dual-text-box-order-review.json` records a visual check of all 39 printed dual
lands across Alpha, Beta, Unlimited and Revised. Broad paper stripes and narrow
three-color border bands use different ordering rules. Neither treatment shows
a reversal across these cached scans. Full-frame outline color is a separate
rule; this check does not certify it. The sheet generator verifies every cached
scan hash and keeps all external pixels outside the checkout:

```sh
python games/magic/tools/accuracy/early-dual-order-sheets.py games/magic/fixtures/accuracy "$MAGIC_ACCURACY_CACHE" "$DUAL_ORDER_REVIEW"
```

`2ed-dual-pinline-replay.json.gz` retains the geometry model, shared candidates,
actual native replay and fixed-strip checks. Keeping the existing physical width
and moving the bottom inward by five canonical pixels gives 82.65/100 mean edge
cosine, versus 72.61 for the existing geometry and 79.06 for the wider candidate.
These are forty local RGB-gradient-magnitude comparisons, not whole-card scores.
Twenty-five sides improve and fifteen regress; reserved names are reused
observations. Ten default native controls reproduce exactly. The candidate
preserves alpha, default etching, the first 590 native rows and the tested central
rules rectangle. Final complete ink/material isolation is still required.

The study plugin adds pinline geometry to the material-cache identity and invokes
the actual pixel-integrating border painter. It preserves original palette/order.
The joint color model has blur uncertainty; its palette and later band-center
medians remain diagnostics. Do not install them as printing inks.

```sh
python games/magic/tools/accuracy/early-dual-pinline-geometry.py "$CURRENT_UNLIMITED_NATIVE" "$DUAL_PAPER_NATIVE" "$DUAL_PINLINE_PROFILES"
OPENBLAS_NUM_THREADS=1 python games/magic/tools/accuracy/early-dual-pinline-fit.py "$DUAL_PINLINE_PROFILES" "$CURRENT_UNLIMITED_NATIVE/inputs.json" "$DUAL_PINLINE_FIT"
node games/magic/tools/accuracy/early-dual-pinline-replay.mjs "$CURRENT_UNLIMITED_NATIVE" "$DUAL_PINLINE_DEFINITION" "$DUAL_PINLINE_NATIVE"
python games/magic/tools/accuracy/early-dual-pinline-verify.py "$CURRENT_UNLIMITED_NATIVE" "$DUAL_PINLINE_NATIVE" "$DUAL_PINLINE_PROFILES" "$DUAL_PINLINE_REPORT"
python games/magic/tools/accuracy/early-dual-pinline-audit.py "$CURRENT_UNLIMITED_NATIVE" "$DUAL_PINLINE_NATIVE" "$DUAL_PINLINE_COLORS" --trial pinline-selected
```

The replay definition retains the shared-paper control and two geometry trials;
only their `pinline.box` (1500×2100 source coordinates) and four physical-compensated
`pinline.width` values differ. Use the archived exact definition, not a per-card
fit. Equivalent color orders in the eight-card training graph retain the existing
rule: Taiga and Underground Sea are the two reserved names, so training alone
cannot distinguish their pair order. Their scans and the cross-set visual check
support preserving it.

`2ed-dual-paper-compromise.json.gz` records the rejected shared color compromise.
Run `early-dual-paper-compromise.mjs FIT OUTPUT` to reproduce its four common
penalties. Avoiding Volcanic Island's blue regression gives up most of the gain
on the other three blue duals. The previous median candidate remains proposed,
with all residuals explicit. No runtime profile is adopted by these studies.

## Native coverage for Unlimited dual-pinline colors

`2ed-dual-pinline-palette-replay.json.gz` replaces uncertain band-center color
sampling with actual native zero/white controls. Six controls isolate the five
colored inks and fine edge ink, after source preparation and normal compositing.
The existing palette reconstructs within three byte levels; candidate predictions
also agree with actual PNGs within that bound. Source coverage defines every
sample. No scan color selects masks, and no scan pose or per-card palette changes.

One palette fits the eight calibration names, with equal votes for each straight
side. The selected candidate preserves the dark source edge. Mean pixel Oklab
distance falls 11.79→11.02 across forty border windows, with 32 gains and eight
regressions. All ten card means improve. Worst side regression is 0.38, compared
with 0.88 for the free-edge candidate, whose edge becomes brown. Preserve the
actual free-edge comparison as evidence of a blur/geometry tradeoff rather than
adopting it merely for lower mean error. These distances are not Lab accuracy
scores; reserved names are reused development observations.

All ten default and source-palette controls reproduce exactly. Changed pixels
stay within measured native pinline coverage; alpha and default etching remain
identical. Typography, artwork, paper and stock outside that coverage are therefore
unchanged. Final whole-profile Original/Oracle verification is still mandatory.

```sh
node games/magic/tools/accuracy/early-dual-pinline-palette-replay.mjs "$CURRENT_UNLIMITED_NATIVE" "$PINLINE_BASIS_DEFINITION" "$PINLINE_BASIS_NATIVE"
OPENBLAS_NUM_THREADS=1 python games/magic/tools/accuracy/early-dual-pinline-palette-fit.py "$CURRENT_UNLIMITED_NATIVE" "$PINLINE_BASIS_NATIVE" "$DUAL_PINLINE_NATIVE" "$PINLINE_PALETTE_FIT" "$PINLINE_PALETTE_DEFINITION"
node games/magic/tools/accuracy/early-dual-pinline-palette-replay.mjs "$CURRENT_UNLIMITED_NATIVE" "$PINLINE_PALETTE_DEFINITION" "$PINLINE_PALETTE_NATIVE"
OPENBLAS_NUM_THREADS=1 python games/magic/tools/accuracy/early-dual-pinline-palette-verify.py "$CURRENT_UNLIMITED_NATIVE" "$PINLINE_BASIS_NATIVE" "$PINLINE_PALETTE_FIT" "$PINLINE_PALETTE_NATIVE" "$PINLINE_PALETTE_REPORT"
```

Exact basis/candidate definitions are in the archive. `colors` on a white-control
trial limits it to cards containing that ink; unused color controls are omitted,
not synthesized. Both palettes use identical geometry and source preparation.
The optional `--preview PATH.png` verification output contains external scan/art
pixels and must remain outside Git. Brown land texture/black levels and full-frame
outline calibration remain open; this component study does not complete a set.

## Final Unlimited land material candidates

`2ed-land-material-replay.json.gz` retains exact definitions, native receipts,
color/texture samples and all residuals for twenty-five lands. Twenty-five current
defaults and twenty-five prior prepared materials reproduce exactly. The older
basic-land capture has different metadata; reuse is justified only by the paired
before/after PNG equality for those fifteen lands. No other printing inherits
that equivalence. Independent outline-source choices change only Tundra and
Volcanic Island, confined to the projected full-frame outline ring.

One brown HSB is shared by all source plates. Fixed narrow rails avoid both
colored frame/art outlines. All six notably dark references remain in their
original cohorts; they are not individually brightened or excluded. The shared
HSB reduces median rail-color error from 3.84 to about 2.44 Oklab units, with
individual regressions retained. The reference brightness spread is not solved
by per-printing renderer values.

The black-level fit checks color plus luminance-ordered texture and contrast.
An ink-only fit would worsen contrast on some faces. The selected common curve
ends at maximum channel 0.42, preserving brown/paper medians; all three Mountain
illustrations share a weaker source-relative curve chosen from native controls.
Every one of the twenty-five native keyline errors improves: median 6.09→1.69
Oklab units. Frame, paper and white-stock color medians are unchanged by this
last tone step; worst texture-contrast regression is 0.011 lightness units.
These are regional distances, not Lab accuracy scores or whole-set certification.

```sh
node games/magic/tools/accuracy/early-land-material-replay.mjs "$CURRENT_UNLIMITED_NATIVE" "$LAND_MATERIAL_DEFINITION" "$LAND_MATERIAL_NATIVE"
python games/magic/tools/accuracy/early-land-material-controls.py "$CURRENT_UNLIMITED_NATIVE" "$LAND_MATERIAL_NATIVE" "$BASIC_ACCENT_DIRECTORY" "$PINLINE_PALETTE_NATIVE" "$LAND_CONTROLS"
node games/magic/tools/accuracy/early-land-texture-audit.mjs "$CURRENT_UNLIMITED_NATIVE" "$LAND_BROWN_AUDIT" "$LAND_MATERIAL_NATIVE" brown-transfer
node games/magic/tools/accuracy/early-land-brown-fit.mjs "$LAND_BROWN_AUDIT" "$LAND_MATERIAL_DEFINITION" "$BASIC_ACCENT_FIT" "$LAND_BROWN_FIT" "$LAND_BROWN_DEFINITION"
node games/magic/tools/accuracy/early-land-material-replay.mjs "$CURRENT_UNLIMITED_NATIVE" "$LAND_BROWN_DEFINITION" "$LAND_BROWN_NATIVE"
```

Use the archived exact definitions for tone and Mountain comparisons.
`early-land-tone-fit.py` consumes the native keyline/color audits, brown definition
and ink-only fit, and writes a constrained fit plus replay definition.
`early-land-tone-verify.py --help` lists its native input manifests. It samples
both alternatives on the same pre-curve boundary strips and checks the actual
selected Mountain color audit. Every frame/stock alpha and art-core control
passes; default etching is unchanged. Mountain has three reused development
illustrations, not independent-name validation. No external raster belongs in Git.

`finalDefinition` and `finalNativeChoices` in the archive assemble the exact
semantic material values and point to each actual selected face hash. They do
not claim a production profile or a new full-face capture. The next step is
profile/typography/footer integration and all-Original/all-Oracle verification,
followed by a renderer release; then the work order moves to M21.

### Complete early-set profile preparation

The additive `profile-adapter-source-proof.json` and compressed native report
preserve the earlier optional preparation receipt. The new adapter supports
source-bound dual plates, independent full-frame outline colors and narrow
paper bands, explicit artist prefix/alignment/baseline, printed legal defaults,
and the shared early text count/wrap policy. These fields are inactive in the
existing full profiles. All 302 current Unlimited Original face PNG pairs and
default etching layers are identical; 25,200 semantic cases across 15 sets are
unchanged. This is compatibility evidence, not an adopted Unlimited profile or
native certification of the other sets.

Reproduce the default comparison after generating set data, with no build or
source mutation running concurrently:

```sh
node games/magic/tools/accuracy/profile-adapter-parity.mjs "$CURRENT_NATIVE" "$CURRENT_INPUTS" "$CURRENT_HEADER_REVIEW" "$ADAPTER_PARITY"
node tests/magic-profile-adapters.mjs
```

The integrated-profile replay takes a complete data candidate through the real
painter and checks every current baseline against its frozen PNG, including the
reviewed Drain Life header. `pilot` captures a small material selection; `all`
completes all 302. Resuming requires the same source, tool, inputs, candidate and
saved native PNG hashes. A pilot cannot certify full-set coverage:

```sh
node games/magic/tools/accuracy/early-integrated-profile-replay.mjs "$CURRENT_NATIVE" "$CURRENT_INPUTS" "$CURRENT_HEADER_REVIEW" "$PROFILE_CANDIDATE" "$PROFILE_REPLAY" pilot
node games/magic/tools/accuracy/early-integrated-profile-replay.mjs "$CURRENT_NATIVE" "$CURRENT_INPUTS" "$CURRENT_HEADER_REVIEW" "$PROFILE_CANDIDATE" "$PROFILE_REPLAY" all
```

The stock/plate/material choices are ready for this replay. Heading geometry is
measured, while its fixed-gray measurement controls must not be treated as final
ink calibration. The artist command evidence retains the measured left alignment
and alphabetic baseline; a different centering policy needs its own evidence.
