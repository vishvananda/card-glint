# Alpha, Beta and Unlimited text recheck

This recheck covers all 899 Original printings: 295 Alpha, 302 Beta and
302 Unlimited. It uses the released frame assets and the same cached scans,
art, printing corrections and frozen scan poses before and after.

| Set       | Accepted text comparisons | Before /100 | After /100 |
| --------- | ------------------------: | ----------: | ---------: |
| Alpha     |                292 of 295 |       64.82 |      66.68 |
| Beta      |                302 of 302 |       64.75 |      66.33 |
| Unlimited |                302 of 302 |       62.80 |      63.90 |

These are **rules/flavor-region similarity indices**, not whole-card compliance
scores or percentages of fidelity. All 899 native faces remain in the evidence.
The three historical Alpha pose rejections—Deathlace, Pestilence and Nether
Shadow—remain diagnostic rows outside the accepted mean. Their poses were not
refit for this experiment. The data is reused development data, not a new holdout.

## Whole-card check

A separate direct replay recomputes every regional component with the Lab metric.
The before/after score for each card uses the same eligible components and weights.

| Set       | Before /100 | After /100 |
| --------- | ----------: | ---------: |
| Alpha     |       67.18 |      67.82 |
| Beta      |       67.58 |      68.13 |
| Unlimited |       70.67 |      71.06 |

The medians and lower deciles also improve in all three sets. There are 270 gains
and 59 regressions greater than 0.5 point. No card changes component eligibility;
mean measured coverage is recorded separately from accuracy. As with the text
study, the primary mean keeps the three historical Alpha pose flags unchanged.

The [whole-card report](../fixtures/accuracy/early-through-fourth/abu-fractional-full-report.json.gz)
contains every printing, component, coverage value, frame/material group and
regression. The [raw metric results](../fixtures/accuracy/early-through-fourth/abu-fractional-full-score.json.gz)
retain the metric dependency hashes. Preprocessing is verified against the pinned
development commit. These are development measurements, not a published Lab revision
or a declaration that the three sets are complete.

## Fitting policy

Font sizes already used 0.25-pixel steps. The missing distinction was glyph
measurement: Chromium's hinted advances often rounded to whole pixels.
Regular and small Original passages now measure and paint with
`geometricPrecision` and normal kerning.

The renderer first selects the existing printing size and centering class.
If fractional advances add a row, it keeps the calibrated physical inset and
fits downward in 0.25-pixel steps, by at most 0.5 pixel. A wider fallback cannot
hide a failed fit. Unchanged base row counts retain their baseline grid;
changed wrapping can recenter the block. Large balanced passages and Oracle
layouts retain their existing policy.

No card gained a row in the complete replay. Seventeen font sizes changed:
three corrected small-face selections and fourteen fractional reductions.
Pixels outside the rules region and card silhouettes remain identical.
A separate 283-case replay preserves all 1,698 table/inspect face, printing and
artwork comparisons, including text measurements and frame geometry.

## Unlimited small faces

The regular-density retention rule previously bypassed both the dense-text
cutoff and the reviewed small face. Scan review confirms:

| Printing         | Selection                                        | Before /100 | After /100 |
| ---------------- | ------------------------------------------------ | ----------: | ---------: |
| Mana Vault       | Same content-matched small passage as Alpha/Beta |       38.59 |      81.99 |
| Hypnotic Specter | Same content-matched small passage as Alpha/Beta |       50.37 |      77.93 |
| Living Wall      | Shared dense cutoff, over 274 source characters  |       41.92 |      75.56 |

The two passage reviews also require the original name, exact wording and
eligible set. They do not apply to Oracle text or changed custom wording.
See [scan-bound size reviews](../fixtures/accuracy/2ed/text-size-review.json).

## Remaining review items

The accepted corpus contains 354 improvements and 96 regressions larger than
0.5 point. Every regression remains in the
[full text report](../fixtures/accuracy/early-through-fourth/abu-fractional-selected.json.gz),
with per-card layouts, references and pose identities.

The five largest accepted regressions were visually inspected: Beta Scryb
Sprites and Keldon Warlord; Unlimited Wall of Water, Fire Elemental and Wall of
Fire. Several preserve a different printed flavor break than the shared fitter.
Small advances and numeral spacing also remain visible. Study shared
flavor-width/tracking rules before adding individual placement exceptions.

The first fractional trial added a row to Unlimited Simulacrum and moved the
whole block. That trial was rejected. The guarded fit retains six lines at
15.25 pixels, with a smaller 2.48-point regression. Alpha Nether Shadow retains
seven lines and improves by 3.75 points. These are explicit residuals, not reasons
to drop a scan or mark the entire set complete.

## Dual-frame follow-up

All nineteen printed Alpha/Beta dual lands have also been
[rechecked against native frames](../fixtures/accuracy/early-through-fourth/abu-dual-frame-review.json).
That initial recheck retained the previously reviewed outline candidates.
Subsequent perimeter and paper-panel updates are recorded below. The fixed-strip
gradient diagnostic and direct corner review still show some transition differences. Keep geometry open; a shift that improves
one strip is not permission to move an entire scan.

The review found a physical credit mismatch on Alpha Tropical Island.
The scan credits Mark Poole; provider metadata credits Jesper Myrfors.
The [reviewed correction](../fixtures/accuracy/lea/annotations-artist-credit.json)
now supplies the printed credit without changing canonical artwork attribution.
Its [native replay](../fixtures/accuracy/early-through-fourth/abu-tropical-artist-native.json.gz)
checks Original and both Oracle symbol modes. Each changes 3,710 pixels inside
the artist strip; all other pixels and etching masks remain identical.

The [scoped score update](../fixtures/accuracy/early-through-fourth/abu-tropical-artist-score.json.gz)
reproduces the old current-face score exactly and reuses the other 898 results.
The aggregate does not change: the current metric excludes its combined
artist/legal region until its content is verified. That region remains a
diagnostic, and its edge score falls from 44.84 to 43.26 despite the corrected
wording. Keep this result visible. It shows why word identity and physical
source review must accompany image overlap. A later metric should separate
verified artist text from unverified legal text.

The [pure-data receipt](../fixtures/accuracy/early-through-fourth/printing-artist-data-delta.json.gz)
proves that all 221 previous artist records and all 2,962 wording records are
unchanged. Historical captures keep their original source identities; only this
printing's artist/full-card approval needs a new replay.

## Current paper-panel replay

The shared Alpha/Beta dual-land paper panel is now six canonical pixels shorter.
Its fixed top and bottom caps preserve the physical border width; its striped
interior resizes with the panel. Adjacent prepared stock fills the vacated band.
Preparation remains cached, before lettering, with the existing source palette.

The [panel study](../fixtures/accuracy/early-through-fourth/abu-paper-panel-trials.json.gz)
compares eight candidates across all nineteen printings. The selected candidate
improves eighteen whole-card indices; Alpha Savannah regresses by 5.71 points.
It remains in the population and report. No per-printing warp or scan exclusion
was added. Paper-edge mean improves from 76.45 to 89.08/100. The five-pixel
candidate has a slightly higher whole-card mean, but weaker boundary agreement.

The [production replay](../fixtures/accuracy/early-through-fourth/abu-paper-native.json.gz)
covers all 899 Original faces. The nineteen affected faces reproduce the study
candidate exactly. The other 880 rasters and keys remain identical. Paired
Original and both Oracle symbol modes preserve silhouettes, outside-panel pixels
and default etching.

The [current scores](../fixtures/accuracy/early-through-fourth/abu-paper-current-scores.json.gz)
reuse only exact native identities and keep references, poses, component
eligibility and weights fixed:

| Set       | Scored printings | Current whole-card /100 |
| --------- | ---------------: | ----------------------: |
| Alpha     |              295 |                   68.00 |
| Beta      |              302 |                   68.29 |
| Unlimited |              302 |                   71.06 |

Fresh eroded paper-color samples support retaining the pigment settings: median
Oklab error improves from 5.81 to 5.20; the largest individual increase is 1.02,
within the existing allowance of 2. No HSB parameter was refitted.

A rules-region index includes its background pattern. This replay changes that
index while leaving font selection and text placement fixed. Use isolated ink
and layout evidence when fitting typography. Keep the texture/pattern difference
visible in whole-card results.

The [four-edge review](../fixtures/accuracy/early-through-fourth/abu-anchor-source-review.json.gz)
withholds three corner-based pose proposals because they lose bottom-frame
support. Current scan poses remain fixed. Remaining art-bottom, frame texture
and flavor/wrapping differences still require review; this update does not mark
an entire set complete.

## Unlimited geometry after raster cleanup

The five Unlimited dual-land variants affected by raster selection retain their
existing geometry approval. The
[edge review](../fixtures/accuracy/early-through-fourth/2ed-raster-geometry-review.json.gz)
checks four text-free outer rails and eight art/paper edges per printing.
All sixty profiles retain the same measured position and reference agreement.
Deliberate two-pixel shifts lose at least 11.99 points, so the check can detect
movement. Native interior pixels and silhouettes also remain identical.

This closes the geometry review for Badlands, Plateau, Scrubland, Taiga and
Volcanic Island. It does not close text, full-card or publication tasks. The
historical renderer identity stays attached to the original capture; exact
native hashes connect it to the current replay.

Reproduce the measurement with the raster replay and frozen input snapshot:

```sh
node games/magic/tools/accuracy/unlimited-raster-geometry-review.mjs \
  "$ABU_RASTER_NATIVE" "$ABU_INPUTS" "$UNLIMITED_GEOMETRY_REVIEW"
```

The ledger importer checks all five identities and all twelve strips, rejects
missing or nonfinite measurements, and requires the declared position,
reference-agreement and displacement gates. These are geometry-preservation
checks; they do not estimate a new scan pose.

## Shared flavor-width study

Two native sweeps cover every flavor-bearing printing: 76 per set, plus three
rules-only controls per set. Each sweep renders six candidates, for 2,844 full
native faces. Current and reflow controls reproduce production exactly. Selected
sizes, baselines, regular rules ink, scan poses and role row counts stay fixed.
Candidates that add rows or overflow are reported and withheld.

The first sweep changes italic glyph width by up to two percent. The second
keeps glyph shapes unchanged and reduces only the flavor wrapping width.

| Candidate                      | Alpha delta /100 | Beta delta /100 | Unlimited delta /100 |
| ------------------------------ | ---------------: | --------------: | -------------------: |
| Italic glyphs 1% wider         |            -2.48 |           -0.29 |                +2.60 |
| Flavor wrap width 2px narrower |            +0.08 |           +0.77 |                +0.74 |

These are fixed flavor-region edge/filled-ink objective deltas, not changes to
the published whole-card metric. The glyph sweep has substantial regressions
and is not adopted. The two-pixel wrap candidate improves eight Beta and seven
Unlimited printings by more than 0.5 point, with one such regression in each set.
Both are Dwarven Demolition Team: -2.66 in Beta and -1.21 in Unlimited. Alpha
has three regressions against two improvements and retains its existing policy.

Visual review identifies an input issue before any wrap candidate is promoted:
Pearled Unicorn's supplied Original flavor joins its dash-prefixed attribution
to the quotation. All three printing scans put the attribution on its own line.
A narrower wrap can accidentally restore that break and receive a better score.
Review and correct the printing source first, then repeat the shared-width fit.
The [three-printing source review](../fixtures/accuracy/early-through-fourth/abu-flavor-attribution-source-review.json)
records the exact proposed flavor correction without applying it. Northern Paladin
already has separate flavor and attribution paragraphs.

Neither sweep changes the runtime or closes a rules/flavor/full-card task. The
[glyph-width evidence](../fixtures/accuracy/early-through-fourth/abu-flavor-glyph-width-trials.json.gz)
and [wrap-width evidence](../fixtures/accuracy/early-through-fourth/abu-flavor-wrap-width-trials.json.gz)
retain all candidates, regressions, native hashes and exact method snapshots.
The captured `poseHash` identifies the sampler transform; the separate pose table
joins it to the full normalization-report identity in the production census.

Run a sweep using the frozen Original input snapshot and restored cache:

```sh
node games/magic/tools/accuracy/abu-flavor-width-study.mjs \
  "$ABU_INPUTS" "$GLYPH_WIDTH_STUDY"
node games/magic/tools/accuracy/abu-flavor-width-study.mjs \
  "$ABU_INPUTS" "$FLAVOR_WRAP_STUDY" --wrap
```

Use `--pilot` or `--wrap-pilot` for the five-name diagnostic subset. The full
sweeps are development censuses, not new holdouts. Exact historical methods are
embedded in the evidence; newer CLI metadata descriptions may differ.

## Applied attribution correction

The three Pearled Unicorn corrections are now applied in the existing printing
annotations. Only the semantic break before the attribution changes. The
[data receipt](../fixtures/accuracy/early-through-fourth/printing-flavor-data-delta.json.gz)
checks all 2,962 wording records, both eager and per-set delivery, and all 222
artist credits. Other wording, fonts, geometry and source assets are unchanged.

The [native replay](../fixtures/accuracy/early-through-fourth/abu-flavor-native.json.gz)
covers all 899 Original faces and 30 paired layer comparisons across the three
printings. Alpha already wrapped at the same place, so its pixels are unchanged.
Beta and Unlimited now put the complete author attribution on its own line.
Oracle without flavor, silhouettes, outside-rules pixels and default etching
remain identical. Oracle with Original fallback flavor receives the correction.

The [updated scores](../fixtures/accuracy/early-through-fourth/abu-flavor-current-scores.json.gz)
recompute the three changed semantic inputs and reuse the other 896 exact
native/reference/pose/input tuples. The metric and component weights are fixed.

| Pearled Unicorn | Whole card before /100 | After /100 | Rules region before /100 | After /100 |
| --------------- | ---------------------: | ---------: | -----------------------: | ---------: |
| Alpha           |                  73.45 |      73.45 |                    76.07 |      76.07 |
| Beta            |                  71.58 |      72.01 |                    66.50 |      67.95 |
| Unlimited       |                  69.66 |      70.31 |                    62.85 |      65.04 |

The [repeated wrap study](../fixtures/accuracy/early-through-fourth/abu-flavor-wrap-corrected-trials.json.gz)
uses the corrected inputs for all 228 flavor printings and nine controls. The
two-pixel candidate still improves the flavor objective by 0.74 in Beta and
0.70 in Unlimited, with one regression in each set. Alpha remains unchanged by
the data correction and keeps its previous study result. No wrapping parameter
is promoted by this data fix. Rules, flavor, full-card review and publication
remain separate tasks.

The source review above remains a historical proposal. This section and the
new source/native receipts record its implementation. Older score receipts
retain their original renderer identities; the exact data projection preserves
only unaffected component approvals. Unknown data or painter changes still fail.

## Reproduce from the cache

Use Node 22+, the repository dependencies and Playwright Chromium. Set
`MAGIC_ACCURACY_CACHE` to a restored source-object cache; these tools do not
download missing assets. Choose output directories outside the checkout.

Prepare generated data **before** capturing either renderer:

```sh
git worktree add --detach ../glint-070 67b0ec3a5c282c8d84e5860fc77d95297afa881a
(cd ../glint-070 && npm ci && npm run magic:data:build)
npm ci
npm run magic:data:build
npx playwright install chromium

node games/magic/tools/accuracy/abu-fractional-baseline.mjs \
  ../glint-070 "$ABU_BASELINE"
node games/magic/tools/accuracy/abu-fractional-native.mjs \
  "$ABU_BASELINE" ../glint-070 "$ABU_NATIVE" --direct
node games/magic/tools/accuracy/abu-fractional-direct-report.mjs \
  "$ABU_NATIVE" "$ABU_BASELINE/inputs.json" "$ABU_REPORT"
```

The baseline builder was checked against twelve retained 0.7.0 native faces;
all twelve match exactly. Complete runs must contain all 899 unique printings.
The direct report verifies output hashes, unchanged silhouettes, rules-region
isolation, row budgets, medians, lower deciles and material groups.
The before and after use identical reviewed wording and poses.

The original capture finished its images before a build refreshed the generated
dependency manifest. Its strict source-close check correctly rejected that
fingerprint change. A
[separate metadata certificate](../fixtures/accuracy/early-through-fourth/abu-fractional-metadata.json.gz)
proves that only the four recorded source digests changed: generated data and
executable painter bytes stayed identical. The captured source identity was
retained. The
[exact capture tool](../fixtures/accuracy/early-through-fourth/abu-fractional-native-tool.mjs.gz)
is archived separately; the current CLI additionally accepts a rebuilt baseline
directly. Do not ignore source-close failures or relabel old captures.

The [source receipt](../fixtures/accuracy/early-through-fourth/abu-fractional-source-proof.json)
binds native output, rejected trials, the text report and unchanged controls.
These are Canvas/source checks, not GPU completion-time benchmarks.

## Art-height measurement

A separate [native art-height study](../fixtures/accuracy/early-through-fourth/abu-dual-art-height-trials.json.gz)
renders seven candidates for each of the nineteen physical Alpha/Beta dual lands.
It keeps the accepted scan transforms, original wording, source palette, outer
frame and paper panel fixed. A zero-change control reproduces every current
native raster exactly.

The art top already agrees well; shortening the aperture from the bottom
preserves that anchor. The shared two-pixel candidate reduces mean absolute
top-to-bottom displacement from 1.79 to 0.36 canonical pixels. Art-bottom
gradient agreement rises from 56.83 to 91.20/100, while art-top agreement changes
from 92.70 to 92.62/100. Paper-edge measurements remain identical.

Whole-card mean rises from 69.22 to 72.61/100 across this nineteen-card cohort:
eighteen gains and one regression greater than 0.5 point. Alpha Savannah loses
4.10 points and stays in the report. The 2.25-pixel candidate has a slightly
higher whole-card mean, but a larger residual height error. The production
replay below adopts the two-pixel candidate without a per-card exception.

The study resizes the illustration aperture together with its prepared frame.
Fixed border caps retain their thickness, and premultiplied-alpha interpolation
avoids dark fringes at transparent edges. Reflow occurs after the existing
color preparation. Synthetic checks cover fractional tiers, fixed top/outside
pixels, invalid inputs and gradient displacement controls. The report includes
the exact method sources and all 133 native results.

To reproduce it with the frozen input snapshot and the same metric module:

```sh
node --test tests/magic-abu-dual-art-study.mjs
node games/magic/tools/accuracy/abu-dual-art-trials.mjs \
  "$ABU_INPUTS" "$ABU_ART_TRIALS"
node games/magic/tools/accuracy/abu-dual-art-report.mjs \
  "$ABU_ART_TRIALS" "$ABU_INPUTS" "$LAB_METRIC_MODULE" "$ABU_ART_REPORT"
```

## Production art-height replay

The [native census](../fixtures/accuracy/early-through-fourth/abu-art-native.json.gz)
replays all 899 Original faces. All nineteen affected Alpha/Beta duals reproduce
the measured two-pixel candidate exactly. The other 880 faces and cache identities
remain unchanged, including every Unlimited printing. Original and both Oracle
symbol modes preserve silhouettes, pixels outside the art/frame region and
default set-symbol etching.

The [layer checks](../fixtures/accuracy/early-through-fourth/abu-art-layers.json.gz)
pair printing, artwork and a synthetic host-supplied etching mask on every
affected printing. All 57 pairs use the same corrected aperture and shader UV
bounds. Both face and etching keys change only for those nineteen cards;
derivative masks must not retain the old illustration geometry.

The [scoped source receipt](../fixtures/accuracy/early-through-fourth/abu-art-source-delta.json.gz)
preserves historical source identities. Unchanged component approvals remain
reusable; geometry and full-card reviews for the affected cards remain open.

The [current score census](../fixtures/accuracy/early-through-fourth/abu-art-current-scores.json.gz)
joins 880 unchanged native results and nineteen exact production matches to the
measured candidate. It keeps the same references, scan transforms, inputs,
metric graph, component eligibility and weights:

| Set       | Current whole-card /100 |
| --------- | ----------------------: |
| Alpha     |                   68.10 |
| Beta      |                   68.40 |
| Unlimited |                   71.06 |

These are development results, pending outlier review and publication.
Alpha Savannah's 4.10-point art-height regression remains included.

Run the earlier candidate sweep from its recorded source revision. Use the
current checkout for production verification:

```sh
node games/magic/tools/accuracy/abu-art-native.mjs \
  "$ABU_ART_REFERENCE" "$ABU_INPUTS" "$ABU_ART_TRIALS" "$ABU_ART_NATIVE"
node games/magic/tools/accuracy/abu-art-layers.mjs \
  "$ABU_ART_REFERENCE" "$ABU_INPUTS" "$ABU_ART_LAYERS"
node tests/magic-abu-art-height.mjs
```

## Text-flow follow-up

Direct scan review found several differences that a set mean hid: Alpha/Beta
Word of Command keeps six rows instead of the printed seven, Howl from Beyond
retains an obsolete upward offset, and Unlimited Birds of Paradise selects the
medium face instead of the large left-aligned layout.

The [first flow study](../fixtures/accuracy/early-through-fourth/abu-flow-policy-trials.json.gz)
covers 85 Original printings and seven native variants. It includes every dense
passage, both content-reviewed small faces, existing placement reviews, low-score
cases and ordinary/flavor controls. Empty controls reproduce current native
images exactly. A blanket seven-row allowance regresses Unlimited Simulacrum by
38.57 diagnostic points. Removing every centered offset regresses Alpha Twiddle.
Neither blanket rule is adopted.

The [refined study](../fixtures/accuracy/early-through-fourth/abu-refined-flow-trials.json.gz)
renders eight variants for the same 85 printings. Normal-width small glyphs are
measured only in the precise pass, preserving the original line budget. A
content-matched Word of Command review permits its printed seventh row. Howl's
obsolete offset is retired while Twiddle's valid offset remains. Short two-block
keyword passages use the existing Beta large-layout geometry.

| Refined diagnostic           | Result |
| ---------------------------- | -----: |
| Actual native variants       |    680 |
| Changed printings            |     30 |
| Gains greater than 0.5 point |     29 |
| Regressions                  |      0 |
| New unsafe layouts           |      0 |
| Rules objective before /100  |  62.47 |
| Rules objective after /100   |  64.80 |

These are regional edge/filled-ink measurements on reused development scans,
separate from published whole-card scores. All references, poses, wording and
source assets stay fixed. Each report includes its exact method snapshots.
The production replay below verifies the refined proposals against actual renderer output.

A [separate wording review](../fixtures/accuracy/early-through-fourth/abu-stasis-source-review.json)
records all three Stasis scans: each prints “during upkeep,” while the cached
Original body inserts “your.” Apply this exact source correction before fitting
its wrapping. Oracle wording remains independent. The three field-only corrections are now in the development correction tables;
they have not yet been released.

## Production body-flow replay

The [current source receipt](../fixtures/accuracy/early-through-fourth/abu-flow-source-delta.json.gz)
binds the four renderer files and three field-only Stasis corrections.
The public Original resolver changes only those three semantic inputs. Oracle
wording, types, artists and symbols remain unchanged.

The [native replay](../fixtures/accuracy/early-through-fourth/abu-flow-native.json.gz)
covers all 899 printings. Forty-seven Original face identities change; only
33 raster images change. Every other image is byte-identical. The 44 layout
candidates reproduce their frozen trial images exactly. Another 376 paired
renders check both Oracle symbol modes and separate printing, artwork and
etching layers. All Oracle, artwork and mask images remain identical, with no
silhouette or outside-rules changes.

The [whole-card score update](../fixtures/accuracy/early-through-fourth/abu-flow-current-scores.json.gz)
recomputes those 33 images and reuses 866 exact identities. It preserves scan
transforms, metric dependencies, component weights and score coverage.

| Set       | Before /100 | Current /100 | Changed images |
| --------- | ----------: | -----------: | -------------: |
| Alpha     |      68.104 |       68.262 |             16 |
| Beta      |      68.402 |       68.540 |             15 |
| Unlimited |      71.059 |       71.063 |              2 |

Thirty-two changed images improve. Unlimited Stasis loses 1.435 whole-card
points after its physical wording correction; that result remains included.
These are development scores, not a release or a claim of exact reproduction.
Older component reviews remain reusable only where the exact source projection
and scope support them. A source-history projection does not approve a new fit.

```sh
node games/magic/tools/accuracy/abu-flow-inputs.mjs \
  "$ABU_BEFORE_INPUTS" "$ABU_FLOW_INPUTS" "$ABU_FLOW_INPUT_PROOF"
node games/magic/tools/accuracy/abu-flow-native.mjs \
  "$ABU_FLOW_REFERENCE" "$ABU_BEFORE_INPUTS" "$ABU_FLOW_INPUTS" \
  "$ABU_FLOW_INPUT_PROOF" "$ABU_REFINED_TRIALS" "$ABU_FLOW_NATIVE"
node games/magic/tools/accuracy/abu-flow-score.mjs \
  "$ABU_FLOW_NATIVE" "$ABU_BEFORE_INPUTS" "$ABU_FLOW_INPUTS" \
  "$LAB_METRIC" "$ABU_FLOW_SCORE"
node tests/magic-abu-flow-adoption.mjs
```

## Release and experimental preview

When an updated Alpha calibration is published, refresh the
[experimental Alpha frame study](https://tetrarcum.com/alpha) with it.
Regenerate both rebuild columns using the released renderer, original printing
wording and current text/layout calibration. Keep the experimental frames in
the experimental column and outside the library package.

Refresh the runtime, baked printing layers, aperture masks and scores together.
Version changed asset URLs so existing browsers receive the update. Verify the
actual served renderer and card output before switching the live preview.
Retain older score identities as history; do not label old measurements as
results from the new release.

## Finite audit decision

The [current review](../fixtures/accuracy/early-through-fourth/abu-current-review.json)
accepts the shared library defaults as an audited baseline for all 899 Original
printings. It binds the 33 changed images to direct aligned-scan review and
retains the 866 exact image identities, existing component reviews and explicit
outliers. The checklist has no open component or wording checks; actual
publication and matching Lab scores remain required before set completion.

The review reader rejects missing members, changed image/reference/pose/input
identities, foreign sets, altered group dependencies and markers without their
full evidence. Experimental reconstructed frames remain separate from this
library audit. Beta Clone's wrapping, flavor punctuation and Alpha Savannah's
source-pattern/art-edge loss remain visible follow-up issues.
