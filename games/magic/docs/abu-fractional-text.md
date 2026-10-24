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
Frame pixels remain identical to the previously reviewed outline candidates.
The fixed-strip gradient diagnostic and direct corner review still show
top/bottom transition differences. Keep geometry open; a shift that improves
one strip is not permission to move an entire scan.

The review also finds a physical credit mismatch on Alpha Tropical Island:
the scan says Mark Poole, while the current rebuild says Jesper Myrfors.
This remains an explicit artist task until the printing correction and its
native replay are recorded.

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
