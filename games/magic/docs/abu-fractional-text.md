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
