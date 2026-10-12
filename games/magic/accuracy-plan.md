# Magic rendering accuracy

M21 is the first measured set. The local pipeline inventories **397 English paper
printings**, excludes **100 alternate treatments**, and captures all **297 ordinary
printings** at both raster tiers. That includes 268 nonbasic/non-planeswalker cards,
15 basic lands, and 14 planeswalkers, including ordinary deck-exclusive printings.
Basic lands and planeswalkers remain visible in the denominator even where the
painter is inaccurate. No frame assets have been replaced.

This supersedes the initial 253-card proposal. Keep game-specific references,
typography, geometry, and tools in this pack. Neither the browser backend nor the
Rust core imports them. The public showcase uses only original repository assets.
The pack's [fan-content notice](NOTICE.md) applies to the local reference work.

## Run it

Use the repository's Node dependencies and pinned Playwright browser. Only capture
needs Chromium; comparison, validation, deltas, and report generation run in Node
with `pngjs`, without a browser, Python, OpenCV, or GPU.

```sh
npm ci
npx playwright install chromium
npm run magic:reference:fetch -- --set m21
npm run magic:reference:render -- --set m21 --run current
npm run magic:reference:compare -- --set m21 --run current
npm run magic:reference:report -- --set m21 --run current
npm run magic:reference:validate -- --set m21
```

Open `test-results/magic-accuracy/m21/current/report.html` directly. It includes
paired scans/renders, an edge disagreement view, both raster tiers, filters for
reviewed text and held-out cards, per-region measurements, failed cards, excluded
treatments, and an asset improvement list. `metrics.json`, `metrics.csv`, and
`asset-backlog.json` are beside it. These files and all downloaded binaries are
ignored, excluded from releases, and not uploaded by public CI.

`fetch --offline` verifies and reuses the cache without downloads; `fetch --refresh`
explicitly refreshes it. Rendering always uses the snapshot offline and rejects
uncached requests. `render --cohort calibration` provides a quick development
capture; `--limit N` produces an explicitly incomplete run. A fetch with `--limit`
writes a separate sample snapshot and does not replace the complete set snapshot.
Use a different `--run` name to preserve before/after captures.

Comparison uses two Node workers. Repeating comparison reuses per-card results
when image checksums, input, alignment, and comparison source are unchanged. It
still verifies captured image bytes. No browser is started by this command. Cold
comparison includes PNG decoding, both tiers, raw/aligned metrics, diagnostics,
and preview encoding; it is not a renderer FPS or GPU benchmark.

For matching before/after runs:

```sh
npm run magic:reference:compare -- --run baseline-reviewed
npm run magic:reference:delta -- --baseline baseline-reviewed --run current
```

Deltas require the same browser, metric implementation, reference bytes, alignment,
and per-card input. Changed input and failed cards are listed separately. Body
improvement claims use reviewed printed wording and confident alignment only.
The initial baseline already used the repaired italic source so captures could
pass font preflight; its old painter still rendered rules/flavor as plain text.

## References and cache

[corpus.json](fixtures/accuracy/m21/corpus.json) records the exact printing UUIDs,
source pages, image hashes, inclusion categories, and exclusion reasons.
[cohorts.json](fixtures/accuracy/m21/cohorts.json) freezes 16 typography calibration
cards and eight held-out cards, plus seven frame calibration examples. Twenty-four
body texts/type lines/styles were reviewed against the downloaded scans in
[annotations.json](fixtures/accuracy/m21/annotations.json). A reference hash change
invalidates a reviewed annotation.

The downloader follows paginated Scryfall search with `unique=prints`. It saves
raw API pages, returned full-card PNGs and `art_crop` images, and the pinned frame,
symbol and font components. It uses returned image URLs, including revision
queries, rather than reconstructing them. High-resolution scan status and PNG
size/decoding are checked. Art crops are Scryfall's available scan art, not a claim
to original artist master files. See Scryfall's
[image formats](https://scryfall.com/docs/api/images) and
[access guidance](https://scryfall.com/docs/faqs/i-m-having-trouble-accessing-the-scryfall-api-or-i-m-blocked-17).

`games/magic/.cache/accuracy/objects/` holds immutable SHA-256 objects.
`urls/` maps exact URLs to hashes, byte lengths, content types, fetch times and
HTTP validators. `sets/` holds complete snapshots. A failed download/refresh does
not publish a new snapshot or replace the prior successful URL pointer. Hashes are
verified on reuse. API starts are spaced by 150 ms; two download jobs, bounded
retries and Retry-After handling limit traffic. `MAGIC_ACCURACY_CACHE` can point
to a different local cache directory.

Capture forces `printedImage: null`, feeds only cached art to the assembled face,
and checks all requested bitmaps and loaded fonts. It records browser, OS, font
hashes/status, renderer source hash (including untracked source), stylesheet hash,
input hashes, and native image hashes. The two native tiers are 732 × 1020 and
244 × 340. Comparison uniformly scales each raster into 488 × 680 with padding;
source dimensions and aspect residuals are reported. The sampled full PNGs are
745 × 1040. No anisotropic stretching is used.

## Shared alignment, never per scan

[alignment.json](fixtures/accuracy/m21/alignment.json) is a frozen set/frame profile.
Every card in a frame family gets exactly the same translation, uniform scale,
and rotation. Normal, legendary, and planeswalker families have separate entries.
An uncalibrated family uses identity and is explicitly labeled. New sets need
reviewed regions/cohorts before their own profile can be established; promote a
profile to a cross-set frame default only after validating multiple sets.

The calibration command uses only the frozen calibration cohort. Border ridges
around the art and type plate provide robust median landmark observations. A
constrained least-squares fit must stay within six pixels, 1.5% scale, and half a
degree. It must also improve frame-only edge agreement without regressing more
than a third of calibration cards. Text and held-out cards never enter this
selection. The current normal/legendary proposals failed frame validation, so
identity is retained; the planeswalker proposal passed.

```sh
npm run magic:reference:calibrate -- --run baseline-reviewed --refresh
```

`--refresh` is required to replace an existing profile. The profile records its
calibration IDs, source snapshot, reference hashes, fit, rejection/acceptance
reason and frame validation scores. Freeze it before typography tuning and apply
the same version to both runs. Per-card landmark residuals only flag uncertain
scans; they never change the transform. Raw inspection scores remain available.
Persistent disagreement is evidence for review, not permission to warp a scan.

## What the scores mean

Independent fixed regions cover title, type line, body, stats, mana, set symbol,
frame sides and type/stats borders. Footer content and the bottom strip are
separate diagnostics. Regions do not read `FACE_RECTS` from the painter. There is
no whole-card RGB score where a matching illustration can conceal missing text.

- **Symmetric boundary distance and F1:** local contrast segmentation after mild
  blur, followed by an eight-neighbor chamfer distance in both directions. Mean
  and p95 distances expose displacement and missing ink. Precision, recall and
  F1 use tolerances of 0, 1 and 2 canonical pixels. Empty regions are marked
  inapplicable; missing ink scores zero.
- **Census similarity:** 5 × 5 local intensity-order agreement near reference
  edges. Low-contrast/tied reference comparisons are excluded. This is a second
  structural measurement; it is not a substitute for boundary distance.
- **Geometry diagnostics:** foreground bounds and row bands from both images,
  plus measured run widths, baselines, chosen font size and overflow from the
  ordinary painter. These are diagnostic ink bands, not asserted OCR baselines.

Local intensity ordering follows the idea in
[Zabih and Woodfill's census-transform paper](https://www.cs.cornell.edu/~rdz/Papers/ZW-ECCV94.pdf).
There is no direct color or saturation penalty. Extreme recoloring that changes
foreground contrast, clipping or heavy halftoning can still affect segmentation.
One-pixel edge agreement is a structural score, **not “percent accurately rendered.”**

`test:magic-accuracy` uses original synthetic glyphs to test font/spacing changes,
missing ink, alignment, cache corruption, offline misses and failed refreshes.
`magic:reference:validate` additionally perturbs the 16 reviewed calibration scan
crops. Brightness, gamma, saturation, color cast and mild noise must rank above
2/4-pixel shifts, horizontal expansion, increased leading and deleted content.
The initial validation passed: benign median F1 values exceeded 0.998; a two-pixel
shift scored 0.665, changed leading 0.436, and a missing bottom third 0.778.
This establishes sensitivity on these examples, not universal perceptual validity.

Unreviewed Oracle wording remains visible in all-card diagnostic scores. Historical
printed words can differ substantially: old reminder text, card self-names,
“enters the battlefield,” and shuffle wording affect wrapping. Only 24 of 297
body texts have been reviewed. Missing footer fields, basic-land symbol layout,
security stamps, and existing special-layout typography remain visible limitations.

## Changes and next passes

The second typography pass is recorded in
[typography-measurement.json](fixtures/accuracy/m21/typography-measurement.json).
It retains the font sources and frame assets, measures actual glyph extents for
vertical centering, separates line/paragraph/flavor gaps, and fits text around the
power/toughness plate. A short final line in a long flavor passage can trigger a
small size reduction. The maximum body size is 24.5 reference pixels. No printing
IDs, scan coordinates, or set-specific text adjustments enter the painter.

[typography.json](fixtures/accuracy/m21/typography.json) records reviewed line
breaks and approximate ink bounds for 24 cards. Run the browser-free measurement
after comparison, before generating the report:

```sh
npm run magic:reference:typography -- --run typography
npm run magic:reference:report -- --run typography
```

Soft-wrap F1 excludes paragraph breaks supplied in the input. Block-edge and
matched-line errors use canonical pixels; scan-bound measurements have about two
pixels of uncertainty. Matched-line errors only compare identical line text, so
their counts accompany the score. OCR assisted initial transcription; it is not
needed to run any comparison. The targets never force renderer line breaks.

With alignment unchanged, the eight M21 holdouts improved from 0.345 to 0.614
median body edge F1, 0.662 to 0.772 mean soft-wrap F1, and 6.5 to 3 pixels median
block-edge error. Exact wrapping improved from two to four holdouts. All 297
printings rendered, with zero ordinary-text overflow or stats-plate collisions.
Chromatic Orrery remains an edge-score regression; Teferi's Tutelage regresses
at table size and still has incorrect dense-flavor wrapping. The original frame
asset review list remains applicable.

M20 was reserved as the transfer test before viewing its results. The renderer
and alignment transforms were frozen with explicit M21 provenance and no M20
typography tuning. The 24 evaluation cards were selected from metadata alone: three
text-length quantiles in each of white, blue, black, red, green, multicolor,
colorless nonland, and land. Names present in the M21 corpus were excluded from
this reviewed cohort. Both renderer versions used identical reviewed inputs.
All other ordinary M20 printings stay in the diagnostic report.

### M20 transfer results

The [frozen plan](fixtures/accuracy/m20/transfer-plan.json) and
[transfer measurement](fixtures/accuracy/m20/transfer-measurement.json) record
343 ordinary M20 printings: 311 ordinary nonbasic/non-planeswalkers, 20 basics,
and 12 planeswalkers. One promotional treatment is excluded. Both versions
rendered all 343 without failures; 331 ordinary text layouts passed fit checks.
The two sets now cover 640 printings, with 48 reviewed body texts. The remaining
592 Oracle bodies have diagnostic scores only.

| Reviewed evaluation metric   | M21 holdouts (8) | M20 transfer (23) |
| ---------------------------- | ---------------- | ----------------- |
| Median body edge F1, inspect | 0.345 → 0.614    | 0.349 → 0.486     |
| Median body edge F1, table   | 0.329 → 0.594    | 0.340 → 0.478     |
| Mean soft-wrap F1            | 0.662 → 0.772    | 0.773 → 0.719     |
| Exact wrapping               | 2 → 4            | 11 → 11           |
| Median block-edge error      | 6.5 → 3px        | 7 → 3px           |

The spacing gains transfer, but wrapping does not consistently improve. M20 has
16 body-edge improvements and five regressions above the 0.02 review threshold.
Bag of Holding, Gargos, Brought Back, Empyrean Eagle, and Nightpack Ambusher are
flagged. Kaalia and Fencing Ace also lose soft-wrap agreement. Empyrean Eagle
specifically exposes the flavor-orphan heuristic: its printing keeps the short
last line that our heuristic removes. Keep this result as evidence for the next
iteration; no M20-specific typography adjustments followed evaluation.

Bone Splinters is the 24th reviewed card. Its 3.5px frame-landmark residual exceeds
the existing confidence limit, so it stays visible in the report but outside
the aggregate above. M20 has 29 alignment flags in total. The median residual is
2px for normal frames and 1px for legendary frames in both sets. These observations
support retaining the shared ordinary-frame alignment for this comparison; they
do not eliminate individual scan uncertainty. No M20 or per-scan transform was fit.

Land boxes, loyalty plates, and the black frame are flagged in both sets. M20's
set symbol and blue-mana region add review associations. Placement and region
selection must be checked before replacing any source asset. Assets are unchanged.

The transfer command verifies matching renderer, font, browser, metric and
alignment fingerprints before combining results. The M21 holdouts were recaptured
from the committed baseline; their PNGs at both tiers are byte-identical to the
earlier working-tree captures. This resolves the differing source fingerprints
without assuming that source changes were harmless.

```sh
npm run magic:reference:fetch -- --set m20
npm run magic:reference:render -- --set m20 --run typography
npm run magic:reference:compare -- --set m20 --run typography
npm run magic:reference:typography -- --set m20 --run typography
npm run magic:reference:report -- --set m20 --run typography
# Requires both archived renderer runs and M21 runs named in transfer-plan.json:
npm run magic:reference:transfer -- --set m20 --baseline before --run typography
```

Open `test-results/magic-accuracy/m20/typography/report.html` for all-card results,
or inspect `transfer.json` beside it. A warm comparison of all 343 cards at both
tiers took 2.2 seconds, including checksum verification, without Chromium.
Download and raster capture are excluded. The paired-card bootstrap intervals
describe the selected cohorts, not a population-wide accuracy guarantee.

The internal `planeswalker-large` name means a taller rules area for more than
three ability rows, not an oversized card. M21's four entries are four ordinary
art printings of Teferi, Master of Time. This existing row-count heuristic and its
uncalibrated frame profile remain separate from ordinary-face typography.

The first complete [measurement](fixtures/accuracy/m21/measurement.json) recorded
297/297 successful comparisons, 20 alignment flags and zero measured ordinary-text
overflows. Comparison took 71.3 seconds cold and 1.8 seconds with all 297 results
cached on the development machine. Those times exclude download and capture.

Among 293 cards with identical before/after input, inspection-tier median title
F1 increased from 0.498 to 0.565, type from 0.546 to 0.721, and stats from 0.742 to
0.899. For 23 reviewed, comparable bodies, median F1 increased from 0.282 to 0.336;
the eight held-out bodies improved from 0.276 to 0.345. Three reviewed bodies
regressed by more than 0.02: Baneslayer Angel, Chandra's Incinerator, and Terror of
the Peaks. Their examples show remaining block-position and wrapping differences;
new italics can also look better despite a lower edge-overlap score. Keep the
score vector and visual review together. Four changed-input cards were excluded
from paired improvement claims.

The initial asset/placement review list flags land type boxes, the planeswalker
loyalty plate, the M21 symbol, and the black ordinary frame. These associations
are saved with source URLs, counts and examples in the measurement file, while
the local report links every measured card. No automatic asset replacement follows
from a low score.

The first renderer pass repairs the invalid italic font URL, rejects failed/empty
font loads with a retry path, adds explicit rules/flavor/style runs, and measures
wrapping against available width and height. Plain `rulesText` stays supported.
Layout and painting share shaped runs; mana symbols remain indivisible. Ordinary
modern rules no longer use character-count thresholds or silently clip overflow. Long
names/type lines retain their full content through size/width fitting. Title,
type and stats placement and the existing M21 SVG's ink crop were adjusted.
All new visible inputs participate in cache identity. Preparation failures release
resources before a revision can be published. Existing frame sources are unchanged.

`asset-backlog.json` groups residuals by source URL and role. A median F1 below
0.6 across at least three confidently aligned cards flags an asset/placement
review; this is a triage threshold, not proof of an incorrect asset. It includes
counts, frame families and worst examples. Co-occurring components and placement
can explain the same residual. Crown details, paper textures and art crop fidelity
need additional regions before their assets can be ranked responsibly.

Next passes should:

1. Investigate wrapping and font-size selection across both sets, including the
   flavor-orphan regression. Reserve a fresh evaluation cohort before using M20
   examples for tuning; these observed examples cannot serve as an untouched test
   of a policy derived from them.
2. Review remaining printed text and line geometry; improve glyph metrics and
   dense rules without fitting per-card coordinates.
3. Add proper basic-land symbol layout, complete printing-footer inputs, security
   stamp coverage and separate planeswalker typography acceptance.
4. Review the asset backlog with paired examples. Keep source-asset replacements
   separate from typography changes so their effects can be measured.
5. Extend the old-border baseline below to additional historical frame families,
   then bulk ingestion and aggregation across sets.
   Keep per-frame defaults and use set overrides only when cohort evidence supports
   them. Inventory unsupported layouts and low-quality references explicitly.
6. Validate WebGL compositing and Safari captures separately. A future native
   Canvas/Skia capture path must demonstrate font/raster parity before replacing
   the production-browser capture. Offline comparisons already need no Chromium.

Renderer changes require `npm run check`, `npm run build`, `npm run test:package`,
`npm run test:magic`, `npm run test:magic-accuracy`, `npm run test:browser`, and
`npm run test:showcase`, with `npm run preview` for the last two. Strict Clippy and
rustfmt use the pinned toolchain. Downloaded references are local opt-in data;
public CI stays synthetic. All decoding/font work remains in preparation, never
per-frame rendering. CPU submission time must not be labeled GPU completion time.

## Mirage and Tempest old-border baseline

The [frozen survey](fixtures/accuracy/tmp/survey-measurement.json) adds all 350
ordinary printings from each set, including 20 basic lands each. All 700 produced
inspect and table rasters and per-region scores without failures. Combined with
M21/M20, coverage is now 1,340 printings and 72 reviewed printed bodies. This is
a baseline of the unchanged legacy painter, not an old-border typography fix.

Both sets use the existing `retro-seventh` asset family. Capture now respects
Scryfall's historical frame and border, caches and verifies the Goudy font, records
the actual retro asset URLs, and uses separate old-border comparison regions.
Ordinary white borders are eligible too, though this pair tests black borders.
The earlier modern corpora retain their snapshot identities where the expanded
selection policy makes no difference. Unconfigured retro families cannot silently
reuse modern alignment landmarks.

The cohorts were frozen before viewing their scans or scores. Mirage contributes
eight frame-calibration cards and eight holdouts, stratified by color/type and
text length. Tempest contributes eight holdouts with names absent from Mirage.
All 24 printed body texts, styles and type lines were reviewed; the other 676
Oracle bodies remain diagnostic. Printed soft wraps are not forced into inputs.

Mirage's frame-only calibration accepted one transform: +0.355px horizontal,
−0.984px vertical, scale 0.993877, rotation −0.00989°. Frame-edge median F1 rose
from 0.626 to 0.831 on the calibration cohort, with seven of eight cards
nonregressing. Tempest uses that exact profile without fitting. No individual
scan is adjusted. The shared profile gives 1px median and 2px p90 landmark
residuals in both full sets.

| Baseline metric                       | Mirage  | Tempest |
| ------------------------------------- | ------- | ------- |
| Printings measured                    | 350/350 | 350/350 |
| Alignment flags                       | 11      | 0       |
| Reviewed holdouts included            | 7/8     | 8/8     |
| Median reviewed body edge F1, inspect | 0.347   | 0.288   |
| Median reviewed body edge F1, table   | 0.321   | 0.279   |
| Warm Node comparison, both tiers      | 3.23s   | 3.25s   |

These are different cards, so the two columns are not paired improvement scores
or percentages of correct cards. Grasslands exceeds the existing 3px residual
limit and is excluded from Mirage's reviewed holdout aggregate while remaining
visible in the full report. Seven nonbasic lands and four white cards account
for Mirage's flags. Investigate their shared geometry before adding a frame/set
exception; a per-scan fit would hide this evidence.

The scan-based sensitivity check passed across the eight Mirage calibration crops.
Median F1 remained 0.986–1.000 under brightness, gamma, saturation, color-cast and
small-noise changes, versus 0.648 for a 2px shift and 0.583 for wider glyphs and
spacing. This validates sensitivity on those crops, not universal perception.

The review queue is concrete:

- **Old-border body typography:** the legacy painter ignores paragraph/run
  italics and picks 16/19/23px using character count. Move it to measured layout
  with old-border spacing, preserving the existing frames. Add layout/overflow
  output and reviewed line targets first: currently all 700 lack those checks.
  Their zero recorded overflow count is not evidence that text fits.
- **Early basic lands:** the inspected Forest scans in both sets print a tap
  ability and type “Land”; the current adapter/painter produces a large mana
  emblem and a modern type line. This is a presentation-policy error distinct
  from the frame asset backlog.
- **Existing frames:** `seventh/regular/b.png` scores 0.444/0.408 across confidently
  aligned Mirage/Tempest cards, `g.png` 0.558/0.599, and `gl.png` 0.487/0.528.
  These are region associations, not proof that replacing the source fixes them.
- **Symbols and other printing:** mana-cost regions flag in both sets; set-symbol
  medians are 0.414/0.409. Check glyph placement and the legacy recoloring policy.
  Title/type sizes, stats placement, and the centered artist credit also need
  review. Missing legal/footer content is kept outside typography aggregates.

All frame assets remain unchanged. The reviewed holdouts have now been observed;
reserve fresh cards before claiming an untouched evaluation of a policy based
on these examples.

```sh
# Repeat these four commands with --set tmp for Tempest:
npm run magic:reference:fetch -- --set mir
npm run magic:reference:render -- --set mir --run old-border
npm run magic:reference:compare -- --set mir --run old-border
npm run magic:reference:report -- --set mir --run old-border
npm run magic:reference:validate -- --set mir --run old-border
# Requires both reports; verifies frozen renderer/font/browser/metric fingerprints
# and exact shared alignment before summarizing the different card populations:
npm run magic:reference:survey -- --set tmp --run old-border
```

Open `test-results/magic-accuracy/{mir,tmp}/old-border/report.html` for the
side-by-side images, edge view, every-card CSV/JSON and asset backlog. The survey
is `tmp/old-border/survey.json`. Warm timings include 350 cache hits and PNG
checksum verification per set, without Chromium, download or capture. The cold
runs took about 216 seconds each while running concurrently with other work;
they are not isolated performance benchmarks. Downloads and local reports stay
ignored and outside the public showcase and release packages.

## Old-border typography transfer: Mirage → Tempest

Study `retro-type` keeps the existing art, frames, fonts and shared alignment.
Commit `2002a16` supplies the old renderer plus observation of its actual text
positions. All 16 development captures were pixel-identical to the archived
baseline at both tiers. Commit `4385eaa` freezes the new typography before fresh
holdout review: 22.5px maximum, 15px minimum, quarter-pixel fitting, 1em leading,
0.25em paragraph gaps and a 0.8em rules/flavor gap. It honors run italics and
explicit right-aligned attribution paragraphs, with no separator or modern
flavor-orphan heuristic. The pack owns this policy; the game-neutral renderer
and browser backend are unchanged.

The 16 previously reviewed Mirage cards became development data. Two already
flagged alignment cases were excluded from tuning aggregates. Across 24 shared
parameter candidates, selection maximized mean soft-wrap F1, breaking ties by
mean body edge F1. This matters: a larger setting raised median image similarity
while matching fewer printed wraps. The chosen candidate matches 7/14 development
cards' full wrapping and has mean soft-wrap F1 0.741. Candidate summaries are in
`mir/typography-selection-retro-type.json`.

Eight fresh Mirage cards and eight fresh Tempest cards were selected by printing
metadata before tuning, excluding previously reviewed names. Tempest also excludes
all Mirage names. Printed wording, type lines, styles and line targets were
reviewed only after the policy freeze. Both renderers receive those same inputs;
soft line breaks are measurement targets, never painter inputs. Dialogue,
poetry and attribution paragraphs preserve semantic breaks. The frozen Mirage
transform remains identical in Tempest, with no scan-specific adjustment.

Body layout is now observed on 330 nonbasic cards per set. The 20 basic lands per
set retain their existing large-symbol path, which has no body text layout and
still needs its separate historical presentation fix. The new painter rejects
unresolved overflow rather than clipping text. Legacy ink crossing the old clip
rectangle is reported separately from scan fidelity: most crossings are subpixel
horizontal glyph overhangs, so raw clipping counts must not be described as
hundreds of illegible cards.

The [frozen transfer measurement](fixtures/accuracy/tmp/transfer-measurement-retro-type.json)
records the paired results:

| Fresh holdouts                         | Mirage, 7 confident | Tempest, 8 confident |
| -------------------------------------- | ------------------- | -------------------- |
| Median body edge F1, inspect           | 0.245 → 0.458       | 0.306 → 0.500        |
| Median body edge F1, table             | 0.235 → 0.449       | 0.304 → 0.490        |
| Mean soft-wrap F1                      | 0.449 → 0.649       | 0.450 → 0.729        |
| Exact wrapping                         | 1 → 1               | 2 → 4                |
| Median block edge error, canonical px  | 7.5 → 8.0           | 5.75 → 5.25          |
| Inspect body gains / regressions >0.02 | 5 / 1               | 6 / 1                |

Rocky Tar Pit remains excluded from Mirage's holdout aggregate because of its
existing alignment flag. It remains visible in the full report. The paired
inspect-body median gain is +0.155 for Mirage and +0.158 for Tempest; the small
cohorts' bootstrap intervals are [0.010, 0.288] and [0.025, 0.217]. These intervals
describe these selected cards, not all Magic. Wrapping improves on average but
its intervals are wide, and median block geometry changes are within the roughly
2px measurement uncertainty. This is evidence of transfer, not uniform fidelity.

All 700 printings pair with identical inputs, with zero render/comparison failures.
Forty bodies have reviewed printed wording; 660 still use unverified Oracle text.
Across all confidently aligned reviewed bodies, 12/21 Mirage and 10/16 Tempest
improve by more than 0.02 inspect F1, while 5/21 and 4/16 regress. Mirage's review
list is Mtenda Herder, Lead Golem, Ekundu Cyclops, Sand Golem and Mangara's Blessing;
Tempest's is Steal Enchantment, Selenia, Dark Angel, Mogg Conscripts and Searing
Touch. Lead Golem wraps correctly after the change despite its edge regression.
Suq'Ata Firewalker shows the reverse tradeoff: higher edge similarity and better
block placement, but worse soft wraps. Keep these metrics separate.

The new 660 measured body layouts have no unresolved overflow. The legacy observer
finds vertical ink extending more than 2px past its clip on 16 Mirage and 6 Tempest
cards. The old raw clip-crossing totals, 187 and 142, mostly reflect subpixel
horizontal overhangs. Eight M21 holdouts remain pixel-identical at both tiers.
Frame assets and the outstanding early-basic-land, mana, set-symbol and footer
issues are unchanged. The next typography step is testing old-border font width
and weight with fresh evaluation cards, without per-card sizing exceptions.

Warm comparisons take 3.67s for Mirage and 3.22s for Tempest, each with 350 cache
hits including checksum verification and both tiers. Cold runs took 479–490s
while overlapping captures, tests and other comparisons; these are not isolated
benchmarks. Timings cover CPU file/metric work, not rendering or GPU completion.

To reproduce, use a worktree at `2002a16` for `retro-before`, with the study's
current annotation/cohort JSON and the baseline observer from `4385eaa`; use
`4385eaa` or the current unchanged production source for `retro-type`. Share the
local cache through `MAGIC_ACCURACY_CACHE`, and collect both worktrees' runs under
one ignored `test-results/magic-accuracy` directory. Then, in the current tree:

```sh
# Repeat for --set tmp, and for --run retro-before using the baseline worktree:
npm run magic:reference:render -- --set mir --study retro-type --run retro-type
# Compare both runs with the SAME current metric code:
npm run magic:reference:compare -- --set mir --study retro-type --run retro-before
npm run magic:reference:compare -- --set mir --study retro-type --run retro-type
npm run magic:reference:typography -- --set mir --study retro-type --run retro-before
npm run magic:reference:typography -- --set mir --study retro-type --run retro-type
npm run magic:reference:delta -- --set mir --baseline retro-before --run retro-type
npm run magic:reference:report -- --set mir --run retro-type
# After both sets are complete:
npm run magic:reference:transfer -- --set tmp --study retro-type --baseline retro-before --run retro-type
npm run magic:reference:examples -- --set tmp --study retro-type --baseline retro-before --run retro-type
```

The transfer command checks the frozen renderer hashes as well as paired inputs,
reference, metric, browser and alignment identities. The example page selects
two of the largest confidently aligned, reviewed body improvements in each set
and displays explicit review candidates alongside them. It is a curated review
page, not an overall accuracy claim. Full per-card metrics and the asset backlog
remain available in each set report. Only capture uses Chromium; comparisons,
typography metrics and page generation run in Node against cached pixels.

## Printed details: Mirage and Tempest

The detail pass responds to direct visual review of the earlier example page.
The current policy is frozen at `ff29ccd`: costs move right/up and lose their
shadows; MIR/TMP set symbols use black ink with white outlines and reviewed
footprints; stats have a lower-right shadow; artist credits are larger, left
aligned and higher; legal lines use the set's year and observed frame-dependent
ink polarity. The tap mark is Mana's tilted-card `tap-4ed` glyph, not the diagonal
T or modern hook. Existing frame and illustration assets remain unchanged.
An explicit `legalText` input can override the known legal line, and `null`
suppresses it. Missing required historical fonts now reject composition.

Canvas captures now use the same 0.058-card-width corner radius as the GPU recipe.
The silhouette is applied after painting to preserve interior antialiasing. Eight
modern M21 holdouts are byte-identical inside the corners at both tiers. This
corrects the formerly square raw previews; a scan-derived radius measurement
remains separate work.

[The detail measurement](fixtures/accuracy/tmp/details-measurement.json) compares
40 previously reviewed development cards with `40a3bbd`. Three existing Mirage
alignment flags remain visible but are excluded from the component aggregates.
These are not fresh holdouts and not a new independent transfer claim.

| Median fixed component F1 | Mirage             | Tempest            |
| ------------------------- | ------------------ | ------------------ |
| Mana cost                 | 0.495 → 0.786 (21) | 0.501 → 0.781 (14) |
| Light set-symbol outline  | 0.437 → 0.729 (21) | 0.441 → 0.770 (16) |
| Artist credit             | 0.283 → 0.589 (21) | 0.259 → 0.580 (16) |
| Copyright band            | 0.198 → 0.815 (21) | 0.201 → 0.726 (16) |
| Light stats ink           | 0.578 → 0.581 (11) | 0.519 → 0.579 (9)  |

Counts are in parentheses. These windows/polarities differ from the earlier broad
regions, so their scores must not be substituted into older measurements. All
35 confidently aligned costs and 37 artist credits improve by more than 0.02.
The copyright baseline score includes texture despite the line being absent;
F1 alone does not prove content presence. Stats and symbol regressions remain
listed per card rather than disappearing into an average.

All 700 ordinary printings have also been recaptured and scored at both tiers,
with zero failures, unchanged per-card inputs and unchanged body-layout geometry.
Forty bodies have reviewed printed wording; 660 remain Oracle diagnostics. Across
confident scans, all 633 mana-bearing cards improve by more than 0.02 in the
original broad mana ROI: median F1 rises 0.421 → 0.819 for Mirage and
0.411 → 0.826 for Tempest. Every confident footer improves (339 MIR, 350 TMP).
The broad set-symbol region improves on 271 MIR and 344 TMP cards but regresses
on 52 MIR and one TMP card. Some are texture/polarity interactions; they remain
review flags, not automatically excused failures. Aggregate light-ink stats
scores are nearly flat, so this metric does not validate the new dark shadow.
Eleven Mirage scans retain their existing alignment flags; Tempest has none.
Cold browser-free comparisons took 164.5s / 163.7s while running concurrently;
these are CPU file/metric workloads, not isolated benchmarks or GPU timings.
Warm repeats took 3.37s per set with all 350 comparison-cache hits, including
capture checksum verification.

A bounded component-translation diagnostic reports suggested offsets and shape
residuals without moving either image. It also flags ambiguous peaks and search
boundaries. In this pass it sometimes preferred a shared frame line over the
misplaced mana. The additional independent radial disc measurement detected that
failure: median rightmost-symbol center error fell from 4.47 to 0.50 canonical px
on 11 confident Mirage triples, and 4.92 to 0.75px on six Tempest triples. The other
18 cost examples did not pass its confidence gate. White sun glyphs and shadows
are notable failure cases, not quietly discarded successes.

The updated page includes the original seven cards plus Shaper Guildmage for tap
review. It has full-card, header, set, footer, rules and corner views, and per-card
edge overlays and offset flags. Regenerate the 40-card development comparison:

```sh
# Run for each of mir and tmp, preserving retro-type as the old capture:
npm run magic:reference:render -- --set mir --study retro-details --cohort calibration --run retro-details
npm run magic:reference:compare -- --set mir --study retro-details --run retro-details
npm run magic:reference:details -- --set mir --baseline retro-type --run retro-details
# Run tmp last to include both finished sets in its page:
npm run magic:reference:details -- --set tmp --baseline retro-type --run retro-details
```

Open `test-results/magic-accuracy/tmp/retro-details/details.html`. Downloads and
reference images remain local. The full-set capture uses `--cohort all --run
retro-details-all`; compare/report that run for every printing's current scores
and the asset backlog. Chromium is required only for capture, not the component
searches, landmark detection, comparison or HTML generation.

The [component review plan](component-review-plan.md) specifies the next detection
work: independent expected-content targets, foreground isolation, topology and
shadow/outline measurements, deliberate failure cases, calibrated review gates,
and required agent inspection of enlarged image crops. The
[working accuracy backlog](accuracy-backlog.md) separates assets from geometry,
unsupported layouts from unmeasured painter branches, and known historical
presentation gaps. Broad frame coverage remains ongoing.

## Historical basic-land presentation

The `retro-basics` policy was frozen at `3e40b7f` after measuring five Mirage
basic lands, one of each color. The other 15 Mirage and all 20 Tempest printings
were reserved. Every cached scan was then visually checked for the “Land” type
line and centered “{T}: Add {color} to your mana pool.” wording. Semantic subtype
metadata remains intact for frame selection; explicit paragraph overrides still
win. No per-card geometry was introduced.

[The transfer measurement](fixtures/accuracy/tmp/transfer-measurement-retro-basics.json)
pairs all 700 cards against `retro-details-all`, with identical face inputs and
frozen alignment. This corrects historical content and layout, not typography
alone. All 40 basic-land bodies and type lines improve by more than 0.02 at both
tiers, with no alignment exclusions among the basics. Median inspect body F1:

| Group              | Cards | Before | After |
| ------------------ | ----- | ------ | ----- |
| Mirage development | 5     | 0.263  | 0.915 |
| Mirage reserved    | 15    | 0.261  | 0.933 |
| Tempest reserved   | 20    | 0.233  | 0.776 |

All 660 nonbasic images and eight M21 holdouts are byte-identical at both tiers.
The report also checks the actual rendered sentence, single-line centering,
overflow, reference checksums and renderer identities. The all-card comparison
contains 80 reviewed bodies/printing targets and 620 Oracle diagnostics. Eleven
existing Mirage alignment flags remain on nonbasic cards; Tempest has none.
Cold comparisons took 129.9s / 128.9s concurrently. These are CPU file/metric
workloads, not isolated benchmarks or GPU-completion measurements.

The transfer gap remains visible: Tempest has lower edge agreement, despite
matching content and line placement. Enlarged crops show differences in glyph
weight, tap/mana contours and background texture. These holdouts were not used to
retune the frozen policy. Existing basic-land plates are visibly cloudier than
the flatter printed texture and remain asset-review candidates.

```sh
# Repeat capture/compare/report for --set tmp:
npm run magic:reference:render -- --set mir --study retro-basics --run retro-basics --offline
npm run magic:reference:compare -- --set mir --study retro-basics --run retro-basics
npm run magic:reference:report -- --set mir --run retro-basics
npm run magic:reference:render -- --set m21 --cohort held-out --run retro-basics-parity --offline
npm run magic:reference:basics -- --set tmp --study retro-basics --baseline retro-details-all --run retro-basics
```

The last command generates `test-results/magic-accuracy/tmp/retro-basics/basics.html`
without a browser. It shows six reserved scan/previous/current examples with
full-card, type, body and footer crops, and links every card's scores. The prior
printed-detail page remains linked. Reference/art images stay local.
