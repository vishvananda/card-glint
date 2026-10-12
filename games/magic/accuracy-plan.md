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
rules no longer use character-count thresholds or silently clip overflow. Long
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
5. Add another frame/era and bulk ingestion and aggregation across sets.
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
