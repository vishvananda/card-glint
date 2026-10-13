# Magic rendering accuracy

## Current rollout: old frames, then new frames

Current priority: **select source-frame families across all old-frame groups
before applying HSB calibration**. The set-symbol expansion remains paused.
The [family coverage plan](fixtures/accuracy/old-frame-family-plan.json) freezes
set/material cohorts and candidate families; its choices are not yet measured.
Separate source-asset choice from printing typography, compare structure with
color-insensitive metrics, validate on reserved card names, and retain ambiguous
matches for review. Freeze the chosen asset and geometry before refitting HSB.
Use per-color corrections, with one shared adjustment for the frame and paper.
The [early HSB experiment](hsb-calibration.md) remains opt-in evidence; do not
transfer its numbers onto a different source asset. See also the
[asset-source findings](frame-asset-research.md), including the missing dual-land
stripe mask already available in the pinned collection.

The agreed scope is **major sets with at least 50 distinct ordinary English
paper cards**, including large supplemental/reprint sets. Count distinct card
identities for admission so art/printing variants cannot inflate a small set;
then measure **every ordinary printing** within an admitted set. Keep smaller
sets in a follow-up queue. Unsupported layouts, missing assets and low-quality
references remain in coverage totals; they must not make a set appear smaller
or improve its measured success rate.

Arabian Nights and Antiquities are explicitly included. The cached English
paper inventories, now including printing variations explicitly, contain 92
Arabian Nights printings representing 78 distinct cards and 102 Antiquities
printings representing 85 distinct cards. Thus both clear 50
regardless of whether printing variants are counted. Do not use Scryfall's
unfiltered set count as the final eligibility test.

Execute **two waves**, completing the three passes across the old-frame cohort
before moving to the new-frame cohort:

| Order | Cohort     | Pass                                   |
| ----- | ---------- | -------------------------------------- |
| 1     | Old frames | Set-symbol drawing, size and placement |
| 2     | Old frames | Frame geometry and border alignment    |
| 3     | Old frames | Component HSB adjustment               |
| 4     | New frames | Set-symbol drawing, size and placement |
| 5     | New frames | Frame geometry and border alignment    |
| 6     | New frames | Component HSB adjustment               |

Old frames include the 1993/1997 families and their white-border variants.
New frames include both the 2003-era and 2015-era families. Route by the
actual printing/frame family, not release date alone. Mixed-frame sets can
contribute distinct printing groups to both waves. Special treatments remain
out of scope. Ordinary special layouts stay in the coverage ledger with
supported, reference-unavailable or adapter-needed status; never silently
paint them as an ordinary frame. The current evaluator's 2003-frame and
multi-face gaps must be surfaced during inventory.

### Shared preparation and coverage ledger

1. Freeze the major-set inventory, corpus policy and printing IDs. Audit the
   treatment filter so normal frame features are not mistaken for alternate
   treatments. Separate classification from reference quality and adapter
   support. Record the smaller-set queue at the same time.
2. Cache full-resolution Scryfall references, matching art crops and source
   metadata by checksum. Reuse existing immutable objects. Fetch original
   wording by exact printing identity for visual comparisons; typography is
   not part of these three passes and unreviewed wording cannot certify it.
3. Establish independent frame registration before symbol measurements:
   shared uniform scale per frame family, split by set only when transfer
   fails, plus the bounded frame-only translation diagnostic. Use separate
   calibration/validation cards. Freeze the target and transforms before
   comparing renderer candidates. A failed registration is a review item,
   never a license to fit on text, symbols or the box under evaluation.
4. Maintain one row per set/frame group with eligible, reference-ready,
   rendered, measured, uncertain and unsupported counts; pass status;
   candidate/reference/method hashes; metrics; failures; asset flags; and
   review-gallery links. Keep per-printing results beneath that summary.

Existing evidence is a starting baseline, not automatic certification of every
printing. Raw and normalized metrics must remain available. Where a common
scale fails, retain the failure and diagnose anchor/asset/reference differences
before attempting anisotropic correction. Do not optimize individual scans.

### Inventory checkpoint (2026-10-12)

`fixtures/accuracy/rollout-inventory.json` records the complete metadata
inventory: 409 candidate sets examined, 272 admitted major sets and 72,998
ordinary printings. There are 63 old-frame and 221 new-frame set groups,
including twelve mixed sets. Enumeration is complete; these totals do not
certify rendering or completion of a pass. Every group starts as not started.

Keep 221 printings with unresolved frame effects in the major-set review count.
MPS and BRR are separate classification-review sets because their premium
product metadata does not reliably distinguish ordinary retro reprints from
custom frames. Reference quality and adapter support never exclude a printing
from the ordinary denominator. The ledger also retains the smaller-set queue.

Reproduce the ledger with `node games/magic/tools/accuracy/rollout-inventory.mjs
report`; source metadata and policy hashes are recorded. The first old-symbol
baseline contains 85 cards from 17 sets, with printing IDs frozen in
`fixtures/accuracy/old-symbol-survey-plan.json`. Next inspect historical
monochrome rarity treatment, original-expansion symbols on Chronicles and
missing glyph aliases before fitting size or placement.

### Pass 1: set symbols

Cover symbol identity and negative space, black/white outlines, opaque interior
components, rarity fill/gradient shape, size, aspect ratio and placement.
Verify the correct absence of a symbol for sets that originally had none;
user-facing alternate-symbol options do not change the accuracy reference.

Start from the existing stencils. Isolate symbol ink and outline from the type
plate so its border cannot dominate the score. Sample every available rarity
across contrasting frame materials, then validate on reserved cards and run the
entire set. Small shared x/y and size searches can propose candidates, but
cannot introduce per-card placement exceptions. Keep color calibration for
pass 3; pass 1 establishes the correct painted shape and gradient structure.
If a stencil is substantially wrong, retain the existing asset and record its
URL/hash, affected sets, example cards and contour mismatch for later replacement.

Deliver a symbol profile per reusable family/set where needed, all-printing
symbol metrics at inspect and table sizes, explicit regressions and a local
scan/before/current/tinted-overlay review page. Already measured M15/WAR and
M19/M20/M21 treatments remain controls for the new-frame wave.

### Reusable symbol measurement workflow

Use the native-pixel measurement approach from Exodus for future symbols.
`symbol-bounds.mjs` is the shared analysis entry point; set studies supply a
frozen search window, broad component limits and threshold sweep. Measure
width and height independently, and report center/placement separately.
Measure original source pixels before resampling. Keep raw measurements and
any existing shared frame transform distinct; do not fit transforms to symbols.

- Start with separate dark-ink and light-rim masks. Sweep multiple thresholds
  to expose fragile segmentation. Reject components touching the search-window
  boundary, competing components and dimensions that vary beyond the stated
  uncertainty. Preserve every uncertain/missing row in coverage.
- Fine or disconnected linework may need the contrast-envelope mode. It uses
  a 3 × 3 native-pixel contrast operator and removes its known one-pixel support
  per side. This measures an outline envelope, not interchangeable ink bounds;
  inspect annotated crops before using it as geometry evidence.
- For detached ink parts such as Fallen Empires' crown foot, a fixed
  `componentGap` joins nearby components without expanding their measured
  bounds. Declare the gap before fitting geometry and keep it shared across the
  set. Groups reaching the window boundary still fail; never bridge to a frame
  just to obtain a measurement.
- For renders, subtract an exact matched blank-symbol face when frame lines
  touch the symbol. `measureRenderedSymbol` isolates renderer-owned pixels
  without letting the frame dictate its measured dimensions. Never apply this
  synthetic-mask shortcut to reference scans.
  Optional `foreground: "dark"` or `"light"` then measures that ink alone within
  the changed pixels, so a white rim does not inflate a black-ink comparison.
- Freeze representative cards across colors/materials and rarities before
  choosing one shared profile. Correct each axis from measured differences,
  verify the actual rasterized bounds, then audit every ordinary printing at
  both tiers with grayscale edge/Census scores and outside-region byte checks.
  A higher overlap score cannot override visibly wrong contours or dimensions.
- Keep threshold spread and native pixel size visible in the report. Agreement
  below one scan pixel does not establish subpixel precision. Annotated scan,
  previous and current bounds plus red/green overlays belong in the local
  review page. Record contour/asset errors separately from geometry.

The shared utility is tested for independent axes, native resolution, contrast,
light rims, detached parts, touching frame edges, ambiguous/missing symbols and frozen shared
transforms in `tests/magic-symbol-bounds.mjs`, included in `test:magic-accuracy`.
Historical measurement fixtures retain their original method hashes; a method
revision never silently rewrites an earlier measurement.

New ordinary retro-symbol studies can use the shared set runner. Freeze a
`<set>-symbol-study.json` recipe with additional calibration collector numbers,
adjacent-set controls and a Chronicles control, plus a separate
`<set>-symbol-measurement-profile.json` for scan/render segmentation. The runner
retains every ordinary printing, caches its inputs and records missing references
or rendering failures. It uses explicit Oracle wording with original symbols.

```sh
node games/magic/tools/accuracy/symbol-study.mjs drk prepare
node games/magic/tools/accuracy/symbol-study.mjs drk before
node games/magic/tools/accuracy/symbol-study-templates.mjs drk
node games/magic/tools/accuracy/symbol-study-bounds.mjs drk before
```

Inspect calibration crops and freeze the measured geometry, profile hashes,
allowed change envelope and score region in `<set>-symbol-adoption-plan.json`
before changing production code. Matched blank templates remove both the glyph
and any derived opaque backing. Capture/measure a `candidate` first, then `after`
for the full set. A calibration revision can use a named stage such as
`candidate-raster`; all three shared scripts accept these labels. Preserve the
earlier adoption plan and its linked measurements when revising geometry; do
not overwrite historical captures with a different source revision. Existing
baselines must be reproduced from their recorded revision.

```sh
node games/magic/tools/accuracy/symbol-study.mjs drk after
node games/magic/tools/accuracy/symbol-study-bounds.mjs drk after
node games/magic/tools/accuracy/symbol-study-audit.mjs drk after
```

The audit verifies reference/capture hashes, inventory coverage, shared geometry,
full-card pixel containment and unchanged controls. Failures remain in the
denominator; a coverage change requires separate review. Comparison and native
measurement run on the CPU; only actual face/template capture needs Chromium.
Keep preview pages outside the repository.

### Pass 2: frame geometry

With symbol styling fixed, measure the outer silhouette, frame rails, art
aperture/rim, title/type plates, rules-box boundaries, stat/loyalty boxes and
relevant special-layout shapes. Report widths, heights and centers separately;
translation must not absorb a width error. Check neighboring overlaps and
clipping as well as each boundary independently.

Prefer shared frame-family geometry. Add a set/material variant only when the
same discrepancy repeats across cards and passes reserved-set validation.
The recent-set survey does not support a single M21 cutoff. Keep typography
fixed during this pass, including font metrics and line wrapping; record text
issues in their existing queue. Separate defects in an asset's contour/texture
from a placement fix that the painter can make using that asset.

Deliver frozen geometry profiles, per-boundary residuals and structural scores,
all-printing coverage at both tiers, and overlays for the largest gains and
remaining outliers. Recheck symbol alignment after geometry changes. Reject
changes that make adjacent regions worse even if a combined score improves.

### Pass 3: HSB by set, material and component

Freeze geometry and registration first. Estimate hue, saturation and brightness
from masked frame material, title/type backgrounds, rules paper, mana discs
and symbol fill separately. Exclude illustration pixels, text, hard outlines,
foil/stamp areas and unreliable highlights. Group by set, frame family and
color/artifact/land material, merging groups when transfer supports it.

Use several references per group with robust statistics so one faded or unusually
processed scan does not set the palette. Treat neutral colors separately because
hue becomes unstable at low saturation. Fit hue circularly, bound corrections,
track clipping, and retain uncertainty where references disagree. Preserve
texture, gradients and black/white ink; do not apply a whole-card filter to art
and lettering. Original art crops and full-card references may have independent
color processing, so their difference is not a frame-color target.

Validate color with perceptual color differences and component distributions,
while retaining the unchanged structural checks. A better HSB match cannot
hide a geometric regression. Deliver versioned component color profiles and
before/after galleries; mark texture/shape mismatches that HSB cannot fix as
asset work. Sparse material groups stay pending instead of receiving guessed
per-card adjustments.

### Pass completion and handoff

For each pass, every admitted printing must have either measured results or an
explicit unresolved status. Review per-card regressions and worst cases rather
than accepting an improving median alone. Report median, lower-tail quality,
regression counts and registration uncertainty per set/frame/material, alongside
coverage; do not call a structural F1 score a whole-card accuracy percentage.
All renderer changes need the required package/browser/showcase checks and
Magic accuracy checks. Commit each validated batch on the working branch.

Advance when the supported cohort is validated and remaining exceptions are
recorded with a reason and next action. A blocked adapter/asset group must not
silently count as complete or halt unrelated sets indefinitely. Keep the local
review browser outside the repository, retain the existing frame assets and
maintain the separate asset-improvement queue.

**Next implementation step:** build the complete 50-card inventory/coverage
ledger, verify old-frame registration, then begin old-frame symbol profiles.
Finish that symbol sweep before starting the old-frame geometry sweep.

## Earlier measurements and reproduction

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
npm run magic:reference:text -- --set m21
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

`magic:reference:text` caches MTGJSON's set-specific
[`originalText`](https://mtgjson.com/data-models/card/card-set/#originaltext), matched by
Scryfall printing UUID and verified against set, number and name. Capture reads
that local cache without downloading. Scan-reviewed annotations take precedence.
Reports distinguish `scan-reviewed`, `printing-reference` and `oracle-unverified`;
downloaded wording is not a certification of typography or paragraph styling.
Legacy `ocT` tap codes are converted to `{T}`; the raw source remains available.
Missing original text remains explicit, and Oracle fallbacks do not enter the
reviewed-body aggregate. `originalType` is retained for audit but is not applied:
Fourth Edition Angry Mob has a modern type in that field despite its printed
“Summon Mob” type. MTGJSON supplies its correct original rules wording.
The cache includes original wording for these printing records:

| Set            | Populated `originalText` / cached printings |
| -------------- | ------------------------------------------- |
| Alpha          | 279 / 295                                   |
| Unlimited      | 286 / 302                                   |
| Revised        | 290 / 306                                   |
| Fourth Edition | 361 / 378                                   |
| Fifth Edition  | 436 / 449                                   |
| Mirage         | 347 / 350                                   |
| Tempest        | 346 / 350                                   |

Fetch another cached set with `npm run magic:reference:text -- --set lea`.
The [source manifest](fixtures/accuracy/printing-text-sources.json) records the
upstream URLs, checksums, snapshot identities and missing printing IDs. These
counts measure source coverage, not agreement with the scans. Alpha and Unlimited
each have 16 missing entries: 15 with no Oracle rules and one with Oracle rules.
Neither case certifies an empty printed rules box. The source import preceded
reserved-image review; the subsequent early-lettering study used separate runs
and inspected only its declared title and credit crops.

Source errors still need reviewed overrides: Fourth Edition Deathgrip's
`originalText` omits the colon after its two black mana symbols. Its scan and
source identity are recorded in `centered-transfer-review.json`.

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

### Revised frame registration

Revised's old dark-ridge detector often matched different inner/outer bevels in
the two images. The replacement measures the first strong transition from white
paper to the outer printed frame at twelve fixed strips. It diagnoses positions
without fitting or applying any per-card transform. It is enabled only for
Revised white-border `retro-fourth` cards; other sets and families retain their
existing method. Synthetic shifts, brightness changes, grain, competing bevels,
missing boundaries and frame-size changes exercise the distinction between a
registration failure and a confidently measured shape mismatch.

Six development cards and six newly reserved examples validate the detector.
The reserved cohort was selected by metadata, before examining its images. The
entire corpus had been captured and scored previously, so this is not an untouched
set. Every reserved boundary overlay was visually checked. Across all 281 cards
in this family, the outer boundary is coherent; 176 previously had ridge-based
warnings. The remaining 25 cards use other frame families and retain warnings.

The frozen alignment stays at identity. A proposed similarity transform improves
outer residual by only about 0.23px but regresses the internal-frame score on four
of six development cards and five of six reserved cards. The render's outer
rectangle is about 1.09px narrower and 4.30px taller than the scan median. That
shape difference is reported separately as a frame-size flag, not hidden by
alignment. Raw region scores are unchanged by the diagnostic replacement.

`registration-verified` refreshes all 306 Revised printings using the current
painter and cached printing text: 290 source-backed rules texts, 16 explicit
unverified fallbacks, no capture failures or reported text overflow. This is a
new absolute baseline; changed wording must not be counted as a typography gain.
The report has a frame-size filter, measured center/size differences and optional
pink boundary guides. JSON and CSV retain those measurements and the original
ridge diagnostics remain in JSON.

Reproduce the fixed diagnostic study without a browser:

```sh
node games/magic/tools/accuracy/frame-registration.mjs development
node games/magic/tools/accuracy/frame-registration.mjs validation
node games/magic/tools/accuracy/frame-registration.mjs corpus
```

The study checks the frozen capture, image bytes and detector hash. Its source
capture contains older Oracle text; only frame pixels enter its decision. See
the [selection plan](fixtures/accuracy/3ed/frame-registration-plan.json),
[frozen candidate](fixtures/accuracy/3ed/frame-registration-candidate.json) and
[validation and corpus measurements](fixtures/accuracy/3ed/frame-registration-measurement.json).

## Printed wording and text insets

The `text-insets` round captures and measures all **1,078** ordinary printings in
Fourth Edition (378), Mirage (350) and Tempest (350), at both tiers, with no failed
captures. It uses the cached MTGJSON printing text where available: 90 bodies have
scan-reviewed annotations, 965 use source-backed printing text, and 23 retain an
explicit unverified fallback. These absolute scores are not paired improvement
claims, because importing original wording changes many inputs.

Among 48 reviewed, identical-input pairs, the selected policy improves Mtenda
Herder and four Fourth Edition long passages, with no expanded-body F1 regression
over .02 at either tier. The examples are already viewed development data, not
fresh holdouts; aggregates retain alignment warnings. Mtenda's font is unchanged:
the white MIR/TMP plate allows 10 more pixels on the right. Fourth Edition long
blocks use x=72, width=344, and no extra paragraph/flavor gaps. Short centered
passages and other sets retain their previous policies. The wider all-color trial
was rejected because it regressed Energy Bolt.

- [Policy and rejected trials](fixtures/accuracy/text-insets-plan.json)
- [Paired measurements](fixtures/accuracy/text-insets-measurement.json)
- [Full denominator and text-source counts](fixtures/accuracy/text-insets-corpus.json)
- [Printing text source metadata](fixtures/accuracy/printing-text-sources.json)

The local `text-insets-review/index.html` page shows scan/before/corrected crops;
`main-review/index.html` separately compares against actual `main`. All examples
use reviewed printed wording on both sides, including Angry Mob's “Summon Mob”
type. Both pages live under `test-results/magic-accuracy`. The white frame's gray
text-box bevel remains an asset review item. `width-sweep.mjs` reproduces the
0/10/12px MIR trial and 0/10px TMP trial. `fourth-insets-sweep.mjs` takes a checkout
at `2b738ef` to reproduce its production-matched controls before the geometry fix.

### Short centered passages: width trials and validation

The balanced-line trial uses the same 25px font size, 320px width and vertical
position for every card. It improves all six Fourth Edition development examples,
but the frozen trial fails three of six reserved Fourth Edition examples:
Spell Blast, Red Elemental Blast and Meekstone acquire an extra line. Its median
body F1 rises from .385 to .447 despite these visible regressions. An aggregate
gain alone is therefore insufficient to accept a typography policy.

Five of six Revised examples improve numerically, but five have uncertain shared
alignment. Fifth Edition has five regressions and no gains over .02; its short
multi-line examples use left alignment. No renderer change is adopted from this
trial. Both sides use identical printing-specific inputs, and all 18 control
crops match production pixels exactly. The newly spotted Deathgrip punctuation
error remains in both frozen trial inputs and is flagged for correction before
further fitting.

`centered-sweep.mjs SET transfer` reproduces the frozen candidate on these reserved
printings. [Selection and candidate](fixtures/accuracy/centered-text-plan.json)
and [transfer review](fixtures/accuracy/centered-transfer-review.json) record scan
line endings, input/source hashes, scores and exclusions. These examples are now
exposed development evidence. Next trials need fresh validation printings, an
independent line-count/line-ending check, and a validated shared Revised alignment
profile. Fifth Edition's tilted-card tap mark and Revised's bare numeric mana and
earlier tap mark remain separate symbol-policy issues.

A subsequent Fourth Edition study reserved 12 more printings before testing a
340px width. Eleven improved, but Fear acquired an extra line; the independent
line-count check rejected that candidate despite a higher median edge score.
The final 344px width keeps all 24 exposed examples' printed breaks. It uses the
same 25px size and y=406.556 as the earlier trial, centered at x=244, with balanced
line lengths. Six further printings were reserved before this refinement was
measured. All six improve and retain the printed line count; four match every
soft break. Righteousness and Phantasmal Terrain still wrap one word differently.

The adopted policy applies only to Fourth Edition nonland faces with one plain
rules paragraph of 1–100 characters. Explicit host alignment, forced breaks,
styled passages, longer text and other sets retain their existing policies.
The shared wrapper preserves shaping, styles and inline symbols, bounds its
balancing work, and never receives scan-derived soft breaks.

The final `centered` run renders and scores all 378 Fourth Edition cards at both
tiers, with no failures or clipping. Of 348 identical-input pairs, 285 are byte
identical and 63 changed bodies all improve by more than .02 at both tiers. Their
median body F1 rises from .374 to .678 at inspection size and .312 to .593 at
table size. These 63 bodies use printing-source wording, not scan certification.
Thirty newly annotated inputs are reported separately from those deltas. Across
the 30 reviewed centered passages, 28 match all soft breaks and all 30 match the
line count. Geometry MAEs remain null because these new targets annotate text,
not measured ink boxes. Deathgrip and Regeneration receive scan-reviewed colon
corrections; Fear receives its printed “Enchant Creature” type.

Production reproduces all 30 frozen prototype crops exactly when given the same
inputs. Another 53 representative cards across M21, Mirage, Tempest, Revised and
Fifth Edition remain byte identical at both tiers. These are preservation checks,
not exhaustive accuracy claims for those sets. Renderer, package, browser,
showcase, Magic and accuracy tests, rustfmt and native/WASM strict Clippy pass.

- [Reservations and width candidates](fixtures/accuracy/4ed/centered-width-plan.json)
- [Final six-card transfer](fixtures/accuracy/4ed/centered-final-transfer.json)
- [Corpus metrics and line-ending checks](fixtures/accuracy/4ed/centered-measurement.json)
- [Pixel-preservation evidence](fixtures/accuracy/4ed/centered-capture-check.json)

The Fourth Edition refresh of local `main-review/index.html` adds Fear and Healing Salve alongside
the existing examples, plus Righteousness as a remaining wrap-review case. All
columns use identical reviewed input. Main's original font stylesheet remains
unchanged. Inline historical mana shapes, the two soft-break differences and
uncalibrated early-border layouts remain follow-ups.
The example capture tool now rejects empty or mostly transparent card PNGs and
retries once in a fresh document, recording the attempt count. Two main captures
needed that retry; all six unchanged main examples match their previously saved
pixels exactly. A separate audit confirms all 756 final Fourth Edition images
have at least 99.8% visible pixels. Empty captures never count as low fidelity.

### Revised short-body typography

After validating Revised's shared frame registration, six development cards and
15 reserved printings established a 27.5px maximum size and 30.25px baseline
spacing. All 15 reserved scans matched their printed line breaks at both raster
tiers. The complete 306-card run then exposed a width problem: a 344px box added
lines on Wanderlust, Unholy Strength, Raise Dead and Holy Strength. The first
two also regressed by more than .02 F1. Small validation cohorts alone were
insufficient to approve the layout.

Those four cases and the earlier 21 examples became development data for a
width-only refinement. Widths 348–356 produced identical pixels and exact wraps
on all 25; widths of 360 or more broke El-Hajjâj and Kird Ape. The smallest
passing change, 348px, was frozen before viewing six more reserved scans across
colors and artifacts. All six match their printed lines and preserve the
earlier candidate's pixels. These are fresh image reviews within an already
captured/scored corpus, not an untouched dataset. No per-card geometry or scan
transform is fitted.

The final `revised-centered-final` run captures all 306 cards at both tiers,
with zero failures or clipping. Of 303 identical-input pairs, 223 remain byte
identical and all 80 changed bodies improve by more than .02 at both tiers.
Median body F1 rises from .248 to .495 at inspection size and .232 to .511 at
table size. Source-backed text is not scan certification. Thirty-two reviewed
bodies match all line endings; geometry MAEs remain null because their targets
do not include measured ink boxes. Blessing's missing colon and Cursed Land /
Wanderlust apostrophes are corrected separately and excluded from paired deltas.

All 612 PNGs pass the visible-pixel check. Thirty-six unchanged-input prototype
crops match production exactly; 53 representatives of other policies and 30
Fourth Edition prototype crops also retain their pixels. Required renderer,
package, browser, showcase, Magic and accuracy checks and native/WASM strict
Clippy pass. The 96.8-second Node comparison measures offline scoring work, not
renderer CPU submission or GPU completion time.

- [Initial frozen candidate](fixtures/accuracy/3ed/centered-candidate.json)
- [Width reservation and candidate](fixtures/accuracy/3ed/centered-width-plan.json)
- [Six-card width validation](fixtures/accuracy/3ed/centered-width-transfer.json)
- [Full-set metrics](fixtures/accuracy/3ed/centered-measurement.json)
- [Capture and preservation checks](fixtures/accuracy/3ed/centered-capture-check.json)

The local main comparison now has 13 examples, adding Flashfires, Hurricane,
Crusade and Sol Ring. All nine previous examples retain both main and branch
pixels. Sol Ring flags the wrong historic tap shape even though its wrapping
matches. Font weight, historical numeric symbols, original type lines, outlined
headers/stats and credits remain separate work; existing frame plates are retained.

### Revised inline tap symbols

`inline-symbols-plan.json` reserves eight printings before viewing their scans:
seven taps across all five colors and artifacts, plus a numeric-only control.
Four previously reviewed artifacts supply development evidence. Enlarged scans
reject the earlier assumption that generic numbers should lose their circles;
the pale numeric discs remain unchanged. The existing pinned Mana font contains
the correct diagonal-T glyph, U+E61C, distinct from the later tilted-card mark.

Three independent tap windows compare glyph size and vertical offset at both
tiers. A font size of .8 times the disc diameter, centered with no offset, gives
the best mean edge F1 and symmetric distance. Mean tap F1 rises from .603 to
.791 at inspection size and .621 to .740 at table size. Whole-body F1 barely
moves because the symbol occupies so little of the region. The candidate is
frozen before inspecting the reserved images; no scan transform changes.

All seven reserved glyph identities match, and Atog's numeric-only rendering
stays identical. Separate center-matched crops diagnose shape without changing
the displayed full-body alignment. Six improve at both tiers; Royal Assassin
regresses and remains explicitly flagged. These diagnostics are not replacement
placement scores: five colored bodies start about 5.5px too far left, and several
long passages have incorrect vertical gaps. Neither issue is hidden by shifting
the actual card or supplying a scan-specific symbol offset.

The final `revised-symbols` run measures all 306 cards at both tiers with no
failures or clipping. All inputs and layout metadata are unchanged; 59 cards
change only within padded tap discs, and 247 retain identical PNGs. Body F1
changes remain between -.003 and +.005, with no >.02 regression. All 32 reviewed
line-ending targets remain exact. Production matches all 24 frozen development
and validation PNGs; 56 representatives of other set policies, including named
historic-tap examples, remain identical at both tiers. Required checks pass.

The offline `revised-symbols-review.mjs` tool builds a self-contained local page
at `3ed/inline-symbols-validation/index.html`, with full-body crops, isolated
glyphs, fixed-window scores, shape scores and retained failures. It uses cached
PNGs in Node without launching a browser. `revised-symbols-parity.mjs` checks
the complete Revised pixel boundary and other-policy preservation. The full
Node comparison took 84.3 seconds; this is offline image-scoring time, not CPU
submission or GPU completion time.

- [Frozen glyph candidate](fixtures/accuracy/3ed/inline-symbols-candidate.json)
- [Independent reserved tap targets](fixtures/accuracy/3ed/inline-symbols-targets.json)
- [Transfer review and failed score](fixtures/accuracy/3ed/inline-symbols-transfer.json)
- [Complete-set measurements](fixtures/accuracy/3ed/inline-symbols-measurement.json)
- [Pixel scope and preservation checks](fixtures/accuracy/3ed/inline-symbols-capture-check.json)

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

## Fourth Edition headers and credits

The [Fourth Edition plan](fixtures/accuracy/4ed/details-plan.json) freezes a
separate policy for nonland cards using the fourth-family plate. Six development
cards established title and type placement, the complete mana row, credits,
copyright and historical tap treatment. The six reserved nonland cards were
opened after the header policy was frozen at `2178f86`. A development stats
regression was then removed at `0467153`, restoring the previous shadow. At both
tiers, every pixel outside the stats window matches the frozen header policy,
and every pixel inside it matches the original baseline, across all 378 cards.

[The paired measurement](fixtures/accuracy/4ed/details-measurement.json) covers
all 378 ordinary printings at both tiers with identical input, reference bytes,
fonts and fixed alignment. Nine bodies/printing targets are reviewed; 369 remain
Oracle diagnostics. A warning on either side excludes a card from paired
headline metrics: 18 lands lack calibration, and Balance, Plague Rats and Sleight
of Mind have uncertain frame landmarks. All remain in the individual results.
There are 20 current-render warnings and 21 warnings across the pair.

| Group                            | Cards | Title F1      | Mana F1       | Footer F1     |
| -------------------------------- | ----- | ------------- | ------------- | ------------- |
| Development nonlands             | 6     | 0.411 → 0.653 | 0.446 → 0.826 | 0.331 → 0.622 |
| Reserved nonlands                | 6     | 0.423 → 0.627 | 0.467 → 0.846 | 0.309 → 0.620 |
| All confidently aligned nonlands | 357   | 0.410 → 0.638 | 0.470 → 0.816 | 0.320 → 0.624 |

These are median inspect-tier edge F1 values, not accuracy percentages. All 357
cards improve by more than 0.02 in those three regions. Type placement has mixed
results: 155 improve and 12 regress by more than 0.02. Stats pixels and scores
are unchanged. Existing frame assets remain in use, and 24 Mirage, 16 Tempest
and eight modern regression examples are byte-identical at both tiers. This is
within-set confirmation; another set using the fourth-family frame is still
needed for an independent transfer result.

The component search now reports both maximum edge overlap and minimum edge
distance over all 441 integer offsets within ±10px. Disagreement, ambiguous peaks
and search-boundary winners trigger inspection. Whole-row radial landmarks
separately measure every mana disc and the pitch between them. These searches
do not modify the render, the frozen frame transform or the fixed scores. The
next geometry sweep must apply each candidate to the whole development cohort,
then freeze its result before looking at a new transfer cohort.

Typography remains visibly heavier than the scans, Fourth Edition stats need
placement and numeric-stroke review, and the land branch needs independent calibration
and historical wording. The tap-layout window can miss the actual scan glyph
when body placement differs; low tap scores require foreground inspection before
attributing them to a glyph asset. These are retained in the
[working review queue](accuracy-backlog.md).

```sh
# Preserve the baseline capture from c239e96; use the same annotations on both sides.
npm run magic:reference:compare -- --set 4ed --run fourth-details-before-all
npm run magic:reference:compare -- --set 4ed --run fourth-details-all
npm run magic:reference:details -- --set 4ed --baseline fourth-details-before-all --run fourth-details-all
npm run magic:reference:report -- --set 4ed --run fourth-details-all
```

Open `test-results/magic-accuracy/4ed/fourth-details-all/details.html` for full
cards, header/footer enlargements, old/current edge overlays and both offset
objectives. Pixel measurements and HTML generation run in Node. Chromium is
needed only to capture changed production renders. The final comparison took
53.8s with 227 cache hits; this mixed cold/warm CPU workload is not a cold
benchmark or GPU-completion measurement. The uncached component search over
2,083 paired windows took 279.3s. Independent full mana rows were measurable in
169 scan/old/new triples, including 75 multi-disc rows; their median absolute
pitch error fell from 1.5px to 0.5px. The other 191 cost rows remain uncertain or
unmeasured, including alignment exclusions.

## Natural-width stats and the main-branch comparison

The [stats plan](fixtures/accuracy/4ed/stats-wide-plan.json) replaces the initial
centered-offset trial with a shared right edge at 451px and a 3px downward shift.
Wide expressions retain their natural width. Fourth Edition's subtractive
Shapeshifter toughness includes its printed parentheses. The original failed
trial remains archived; the new metric windows include the complete expression.

[Paired measurements](fixtures/accuracy/3ed/stats-wide-measurement.json) cover
all 1,133 Fourth Edition, Fifth Edition and Revised cards without capture failures.
The inspect-tier results below exclude the union of alignment warnings:

| Set            | Confident stat boxes | Median F1   | Gains / regressions over .02 | Decision                                    |
| -------------- | -------------------- | ----------- | ---------------------------- | ------------------------------------------- |
| Fourth Edition | 150 of 151           | .313 → .870 | 150 / 0                      | Retain shared anchor                        |
| Fifth Edition  | 163 of 182           | .403 → .566 | 154 / 2                      | Retain; review numeric weight and stars     |
| Revised        | 44 of 105            | .298 → .324 | 24 / 11                      | Reject transfer; restore previous placement |

Fifth Edition's regressions are Keldon Warlord and Lhurgoyf. Shapeshifter also
remains a width/shape review case. Revised uses dark numeric strokes with pale
edges; light-ink scores cannot certify that treatment. Only four of its six
reserved examples have confident alignment, with three gains and one regression.
The [visual review](fixtures/accuracy/3ed/stats-wide-review.json) records the
reference hashes and next experiments. No per-card offsets were introduced.

All 1,133 pairs preserve every pixel outside the expanded stats window at both
tiers, and 48 MIR/TMP/M21 regression examples are byte-identical. After rejecting
Revised, [adoption checks](fixtures/accuracy/3ed/stats-wide-adoption.json) verify
all 306 restored cards match their original baseline exactly; 18 Fourth Edition
and six Fifth Edition examples still match the measured candidate. Both tiers
are checked. Existing frame assets and numerical font sources are retained.

The local `main-review/index.html` compares the actual `main` commit `0b0d408`
with the current branch, using identical inputs and cached art. It includes five
improvement examples and a clearly labeled Mtenda Herder typography regression.
Each revision uses its original font stylesheet; main's failed italic face is
recorded and its fallback is preserved. [Source hashes and scores](fixtures/accuracy/main-comparison.json)
are committed; PNGs remain local. Reproduce with an isolated checkout of `main`
and its dependencies available:

```sh
node games/magic/tools/accuracy/main-examples.mjs ../card-glint-main
```

The page supports full-card, header, rules and footer views. The separate
`3ed/stats-wide/stats.html` retains the rejected Revised candidate, explicitly
labeled, alongside the Fourth/Fifth Edition improvements. Archived run names
must not be overwritten when capturing a later renderer revision.

Unlimited's 302 printings are cached for the early-frame follow-up. Its cohorts
were selected before viewing its scans. Basic-land names repeat; Keldon Warlord
was subsequently viewed in Fifth Edition and is also excluded from any fresh-name
subtotal. These exposures are recorded in its cohort fixture.

### Revised long-body placement (intermediate)

The long-body study starts at `revised-symbols` and freezes 11 development and 12
reserved body examples in `3ed/long-body-plan.json`. Full-set metrics already
existed; reserved means new body-image review after candidate freeze, not an
untouched dataset. The frozen trial checks complete control-PNG equality, then
varies shared bounds, size, leading and paragraph gaps. A width refinement
resolves wrapping thresholds; a minimum top position prevents optical centering
from moving dense type into the frame. No scan is fitted independently.

`revised-long.mjs development clamped` and `validation` reproduce the final trial
only on the baseline renderer. The candidate was committed before reserved scans
were viewed. `revised-long-review.mjs` audits independent line targets offline
and creates a private scan/before/new page, including all full-set regressions.
The source data, fonts, frame assets and alignment profile are unchanged.

The shared x70/width346 layout, zero paragraph/flavor gaps and bounded -10 px
optical shift improve all 12 reserved image scores. Seven match every line; two
have content errors and three have remaining wrapping differences. Fireball
also has a styling error despite exact word wrapping. Development has nine of 11
exact line patterns, versus one before; Animate Wall and Clone remain failures.

The complete run captures 306 cards at both tiers with zero failures or clipping.
198 faces change only within the body; 108 are byte-identical. All 46 frozen trial
PNGs match production, and 56 representatives from M21/MIR/TMP/4ED/5ED retain
both PNGs. These are preservation checks, not complete accuracy claims for the
other sets. Existing 32 reviewed short-body targets remain unchanged.

The full corpus reveals 22 inspect and 18 table regressions (23 distinct cards),
despite median body F1 rising from .324 to .587 at inspect size. The branch
retains this as an intermediate improvement while the size/alignment classes
are resolved; it is not a final calibration. Complete denominators, per-card
scores and regressions are in `3ed/long-body-measurement.json`. 16 Oracle inputs
are included only in the all-changed diagnostic aggregate; 182 changed inputs
have printing-source text and confident alignment. Source fields still require
scan review. Comparison uses offline Node workers; its elapsed time is neither
renderer CPU submission time nor GPU completion time.

### Revised printing-input corrections and dense-type transfer

`revised-text` establishes a separate baseline on the unchanged `revised-long`
renderer. Four scan-hashed annotations restore Drudge Skeletons' activation
colon, Dragon Whelp's colon and inline italic flavor, Fireball's upright
parenthesis, and Wall of Ice's flavor-only poem. All four match the independently
transcribed printed line endings. `revised-text-review.mjs` checks every cached
image hash and confirms the other 302 cards retain identical inputs, layout and
both full PNGs. Scores and source-only deltas are recorded in
`3ed/text-corrections-measurement.json`; they are not renderer gains.

The first small-type candidate was frozen before seven reserved body scans were
reviewed. It improves all four development cards, but fails transfer: Bottle of
Suleiman regresses, and five reserved cards needing small type are excluded by
the initial >300-character/single-paragraph gate. The candidate is rejected;
`3ed/dense-transfer.json` retains every result. Round two reserves eight new body
reviews before fitting, broadens the shared hypothesis to >260 characters, and
allows dense text more vertical space within the existing panel. No per-card
alignment or new assets are introduced.

The second character-count trial improves Living Wall and Sedge Troll, but
incorrectly shrinks Copy Artifact and Mons's Goblin Raiders. A fit-only trial
then fails Aladdin's Ring: edge F1 improves while the image visibly loses three
printed lines. Both failures are retained in `dense-refine-transfer.json` and
`dense-fit-transfer.json`. Edge overlap alone is insufficient to accept a change.

The adopted Revised-only rule requires more than 270 source characters and a
regular layout that would shrink below 22px. It uses 15.5px type, 1.25 leading,
16px more available panel height and a correspondingly adjusted optical offset.
No individual names, coordinates, frame assets or scan transforms enter the
policy. All positive examples had been seen by the time this classifier was
chosen: this is a full-corpus audit, **not fresh validation** or evidence of
transfer to another set. Earlier reservation/failure records remain intact.

`revised-dense` measures all 306 cards at both sizes on the separately corrected
`revised-text` inputs. Exactly 13 change; 293 preserve complete PNGs and layout
metadata. All 54 frozen final trial PNGs match production. All changed pixels
remain inside the body, with zero failures or clipping. Another 56 representatives
from M21/MIR/TMP/4ED/5ED preserve their full images at both sizes. These checks
establish preservation, not comprehensive accuracy for those sets.

All 13 changed cards improve by more than .02 at both sizes: median inspect F1
.346 → .664, table .338 → .648. Their manually reviewed line counts all match,
versus one before. Four have independently transcribed full line targets; two
match every ending. Sedge Troll's missing source colon remains explicitly
flagged and excluded from the additional source-qualified aggregate (12 cards).
`dense-measurement.json`, `dense-line-review.json` and `dense-capture-check.json`
retain complete denominators, image hashes and per-card evidence. The private
`3ed/dense-review/index.html` includes every change and Aladdin's Ring as a
negative control; the main comparison adds Earthbind and Gaea's Liege.

### Revised titles, credits and stats

`3ed/lettering-plan.json` reserved 12 title/credit examples before fitting seven
development cards. Enlarged scans show paired pale upper-left and dark lower-right
letter edges. Solid dark fill can score higher while visibly filling the wrong
part of the glyph. The selected candidate uses the existing fonts and frame
assets, with two translated glyph masks subtracted during cached face composition.
There is no pixel readback or per-frame font/mask work.

The shared Revised nonland policy uses a 26px title at x=40, 22px left-aligned
credits at x=50/baseline=642 including `Illus. ©`, and 26px stats at right=451,
12px below the former middle baseline. Type and mana remain unchanged. This is
a set-scoped policy; it is not extrapolated to another frame era. The candidate
was committed in `f344cb1` before reserved crops were opened. All 12 reserved
titles and credits and all five matching numeric stats improve paired edge F1
at both tiers. Census medians also improve; Hill Giant's inspect title census
falls and remains flagged. `lettering-transfer.json` preserves every result.

`lettering-metrics.mjs` averages separate light/dark boundary F1 and retains
Census local-order similarity. Its test demonstrates the failure of dark-only
matching: removing the highlight retains .948 dark F1 but drops paired F1 to
.474; an affine tone change still matches exactly. This experimental component
metric is separate from the existing structural-v2 corpus report. Neither
metric certifies fill style or glyph topology without image inspection.

The complete `revised-lettering` capture has 306 cards/612 PNGs, no failures or
clipping, and the same source inputs and body layout as `revised-dense`. All 281
nonlands change only in title/footer regions; silhouette alpha and all 25 land
PNG pairs are unchanged. Production matches all 38 frozen development/reserved
PNG candidates. Another 56 representatives from M21/MIR/TMP/4ED/5ED preserve both
full PNGs. All required renderer checks, package/browser/showcase tests, Magic
tests, accuracy tests and strict native/WASM Clippy pass.

| Inspect component | Diagnostic count | Paired F1 median | Gains / regressions > .02 |
| ----------------- | ---------------: | ---------------: | ------------------------: |
| Title             |              281 |      .390 → .480 |                   268 / 1 |
| Credits           |              281 |      .232 → .467 |                   280 / 0 |
| Stats             |              104 |      .209 → .365 |                    98 / 0 |

`lettering-measurement.json` contains every card, both tiers, image/source hashes,
Census disagreements and a separate 19-card reviewed-component subset (10
matching stats). The complete component measurement took 129 seconds in Node,
including PNG decode and normalization; it did not launch a browser or measure
GPU time. Other printing fields remain unverified, so these corpus numbers are
diagnostics rather than a percentage of rendering accuracy. Vesuvan's printed
`*/*` versus cached `0/0` is excluded from stats fitting/scoring. Drain Life's
printed `{1}{B}` versus cached `{X}{1}{B}` is separately recorded, along with seven
type-line mismatches, for the next source-correction baseline.

The post-adoption image audit retains Animate Dead's title F1 regression and
the largest Census disagreements. Some dark-frame letter interiors look too
weak/broken; white numeric glyphs can still be too thin/small. These need a new
reserved-component study, not per-card shifts. Serendib Efreet still needs its
printing-specific green-frame routing. Existing frame textures and font glyph
shapes also remain open. `lettering-audit-review.json` records eight inspected
cases without refitting the frozen candidate. The private
`3ed/lettering-validation/index.html` shows the reserved crops; the full comparison
against main has been refreshed with the current renderer.

### Revised printing fields and printed frame palette

The separate `revised-fields` baseline corrects eight previously inspected cards
without changing the renderer or rules layout: seven historical type lines,
Vesuvan Doppelganger's printed `*/*`, and Drain Life's printed `{1}{B}`. Its
1836-image audit confirms the other 298 cards preserve inputs and both full PNGs;
changed pixels stay in the corrected field regions. Partial field reviews are
tied to the exact scan hash and do not promote the body to `scan-reviewed`.
`printing-fields-measurement.json` records scores separately from painter gains.

The Magic presentation now accepts optional `frameColors`, defaulting to `colors`.
This preserves semantic card colors while selecting a printing's frame palette.
The scan-hashed Serendib Efreet annotation uses the existing green plate and
`Summon Efreet`, retaining blue colors, `{2}{U}`, artwork, stats and body layout.
No card-name branch or per-scan alignment was added. `frame-selection-check.json`
verifies all 305 other Revised faces and 56 representatives from five other sets
retain both full PNGs. All 306 rules layouts and silhouette alpha are unchanged.

The complete `revised-frame` run measures 306 cards at both tiers with no failures
or clipping. Inspect frame-rail edge F1 changes from .797 to .880 on the left and
.224 to .337 on the right. Left-rail Census falls despite the correct palette;
the report retains both measurements. Body F1 also changes with the background
while text geometry is identical, so it is not evidence of typography progress.
`frame-selection-measurement.json` retains those disagreements and source hashes.
Serendib's large centered continuation, weak title strokes, header mana and frame
texture remain open review items.

Check/build, package, browser, showcase, Magic and accuracy tests pass, including
strict native/WASM Clippy. The private `3ed/revised-fields/index.html` shows the
eight input corrections; `3ed/revised-frame/index.html` shows the frame correction
and links to every card's scores. Main comparisons for Earthbind, Gaea's Liege
and Prodigal Sorcerer now pass the corrected type to both renderers. Their body
review proofs still verify identical rules wording/style and the same scan;
reviewing a type line does not certify unrelated text.

### Revised large rules passages

`revised-large` extends the existing 27.5px centered style beyond the former
100-character cutoff. A plain rules passage must fit in at most five lines at
that size; a short keyword heading stays left-aligned above a centered second
paragraph. Explicit alignment, styling and hard breaks retain their existing
policy. The 348px width and 30.25px baseline spacing are shared across the set;
there is no name-based routing or scan offset. Inputs, fonts and assets are
unchanged from `revised-frame`.

Candidate `393021b` was frozen before ten reserved images were opened for this
study. All eight applicable cards improve at both tiers; both controls remain
unchanged. Six of the eight match every printed line ending; Web and Reverse
Damage still wrap differently. Some cards appeared in earlier work, so this is
a reservation for this study rather than a claim of first exposure. The three
development positives also match every line; a 27px candidate was rejected
because it incorrectly enlarged both development controls.

The complete 306-card capture changes 25 bodies and preserves the other 281
full PNG pairs and layouts. All changes stay in the body region. Production
matches all 30 frozen development/reserved images, and 56 representatives from
M21/MIR/TMP/4ED/5ED remain byte-identical. Every changed scan was then inspected;
24/25 match printed line counts and 19 match all word-line targets. Disrupting
Scepter has four lines instead of five and regresses in edge F1 at both tiers.
This remains an intermediate improvement, with that failure explicitly retained.

Inspect body F1 rises from median .258 to .569 across the 25 changed cards:
24 gains and one regression greater than .02. Table results have the same counts
and median .256 to .559. Deathgrip's source omits an activation colon; it is
excluded from the no-known-content-error subset. The measurement retains Census
and edge-distance pairs as well as F1. These are structural diagnostics, not an
accuracy percentage or a certification of glyph shape. Font strokes remain
heavier than the scans.

Check/build, strict native/WASM Clippy, package, browser, showcase, Magic and
accuracy tests pass. The synthetic-font Magic test checks heading/continuation
alignment; real-font capture parity supplies exact raster/line evidence. The
local `3ed/large-body-review/index.html` shows all changed cards and four controls,
including the regression; `3ed/revised-large/report.html` contains every card's
metrics. Frozen plans, transfer results, corpus targets, image checks and line
reviews are recorded in the `3ed/large-body-*` fixtures.

### Revised letter interiors: rejected candidate

The `letter-fill-*` study holds all fonts, sizes, positions, body layout and
existing frame assets fixed. Light underlays make the lettering too bright and
heavy; a neutral gray underlay improves all six development medians for paired
edge overlap and local contrast. The neutral candidate was committed in
`00a7dd4` before the 12 reserved crops were measured and opened. The reservation
is specific to this lettering study; earlier work had exposed this set.

The frozen gate requires nonregressing paired-edge and contrast medians in each
component at both sizes. Inspect-title F1 falls .493 to .491, table-stat F1 falls
.374 to .372, and stats contrast falls at both sizes. No individual paired-F1
regression exceeds .02, but the gate still fails. Production remains unchanged.
`letter-fill-transfer.json` records all 12 cases, both sizes and image hashes.
The local `3ed/letter-fill-validation/index.html` marks the candidate rejected.
Mesa Pegasus adds a source error: its scan says "Melissa Benson", while its input
says "Melissa A. Benson". That footer is excluded from future fitting pending a
separate source correction; the frozen trial is preserved as measured.

The new local-contrast metric retains signed stroke interiors instead of only
boundaries. Positive affine luminance differences cancel; color-dependent
contrast and background texture can still interfere. The seven development
cards also expose excessive background in the broad lettering windows.
`letter-foreground-development.json` records a diagnostic using unchanged font
bounds with fixed padding. All seven controls reproduce the baseline PNG hash.
The glyph probe uses Canvas; pixel scoring and shift searches use Node.

These narrower windows are not a validated replacement metric. Their crop review
required more horizontal padding to retain wide scan lettering, and the widened
stats window approaches the frame edge. Competing horizontal title peaks and
stats sensitivity to padding block a placement recommendation. Shared shift
searches remain diagnostic; no card or scan is repositioned. Preserve the failed
candidate decision and freeze a new window/shape study before using fresh
reserved cards. The image-inspection and validation steps are in
`component-review-plan.md`.

### Revised header mana

The header study restores Mana's cached `w-original` sun (U+E997), omits its
modern disc, removes cost shadows, and uses a shared rightmost center x=435,
y=44.5 and 27px pitch. Other SVGs retain their 23.4px diameter. Title fitting,
inline symbols, inputs and frame assets remain unchanged. This policy applies
only to Revised nonlands; it does not extrapolate placement to another set.

Twelve development cards cover every color, repeated symbols, X and two-digit
costs. A 45-point shared geometry grid includes an expanded horizontal range to
bracket the first boundary winner. Candidate `d985c61` was committed before 13
reserved mana rows were measured and inspected. All 13 gain more than .02 at
both tiers, including the five-symbol Force of Nature cost. Median dark-ink F1
rises .533 to .765 at inspection size and .462 to .721 at table size. Local
contrast and Census medians also improve. The cards were seen in earlier studies;
this is a reservation of their mana components, not first exposure.

The full 306-card capture changes all 281 nonland mana rows. The other 25 PNG
pairs, every body layout, input and frame asset remain identical. No changed
pixels lie outside the mana rows; silhouette alpha is unchanged. All 50 frozen
prototype images match production. Another 56 M21/MIR/TMP/4ED/5ED representatives
remain identical at both sizes. These preservation checks are not cross-set
accuracy validation.

Across the 281 changed rows, inspect F1 median rises .486 to .760 with 276 gains
and one regression greater than .02. Table median rises .462 to .728 with 275
gains and four regressions. Dingus Egg regresses at both sizes; Keldon Warlord,
Lightning Bolt and Wall of Fire regress only at table size. Every regression
was inspected at both sizes. Dingus Egg retains a visible horizontal residual;
red glyph/disc contrast and rasterization remain diagnostic questions. No
per-card offsets were added. The broad structural-v2 window and tighter frozen
study window disagree on Keldon Warlord's inspect delta; both are preserved.

`mana-plan.json`, `mana-candidate.json`, `mana-transfer.json`,
`mana-measurement.json` and `mana-corpus-review.json` retain the evidence and exact
source identities. Existing skull, tree, flame, droplet and numeral contours
remain in the asset review queue. The local `3ed/mana-validation/index.html`
shows the reserved rows; `3ed/revised-mana/report.html` contains all cards.
The Node full-card comparison took 84.9 seconds, including decoding and both
sizes; this is not renderer submission time or GPU completion time.

Check/build, strict native/WASM Clippy, package/browser/showcase, Magic and
accuracy tests pass. The comparison against main includes reviewed mana examples
without promoting their unreviewed body typography to scan-reviewed status.

## Alpha and Unlimited credit placement

The early-frame study now covers all 295 Alpha and 302 Unlimited printings.
The accepted change enlarges the artist credit to 22.5px, restores its left
anchor at x49 and alphabetic baseline at y631, and adds the printed © mark.
It uses the existing MPlantin font with paired light/dark edges. Beta retains
its previous painter until a separate transfer check.

The [frozen candidate](fixtures/accuracy/early-lettering-candidate.json) was
committed before opening the sixteen reserved title/credit crops. Credits pass
on all thirteen reserved examples whose artist text matches the scan: five
Alpha and eight Unlimited. Three Alpha source mismatches are excluded and
recorded separately in the [transfer review](fixtures/accuracy/early-lettering-transfer.json).
The same review rejects the title change despite aggregate overlap gains:
several strokes look broken, individual titles regress, and Alpha's signed
contrast correlation falls. Production titles are unchanged.

| Set / tier          | Cards | Median credit F1 before → after | Gains > .02 | Regressions > .02 |
| ------------------- | ----- | ------------------------------- | ----------- | ----------------- |
| Alpha / inspect     | 295   | .386 → .631                     | 295         | 0                 |
| Alpha / table       | 295   | .357 → .562                     | 294         | 0                 |
| Unlimited / inspect | 302   | .426 → .626                     | 297         | 0                 |
| Unlimited / table   | 302   | .391 → .576                     | 295         | 0                 |

These full-corpus values are diagnostics, not certification that every artist
credit matches its printing. [Alpha measurements](fixtures/accuracy/lea/early-credits-measurement.json)
and [Unlimited measurements](fixtures/accuracy/2ed/early-credits-measurement.json)
retain every pair. All pixels outside the credit area and the silhouette alpha
are unchanged. All 64 development/reserved component rasters match the frozen
prototype exactly. [Other-policy checks](fixtures/accuracy/early-credits-controls.json)
verify complete PNG equality for 64 cards at both sizes, including Revised after
extracting its unchanged lettering helper.

Shared identity registration remains explicit. The eight Unlimited development
outer frames are centered within .4px; fitting internal art ridges would move
that correctly centered outer frame. The [frame review](fixtures/accuracy/early-frame-review.json)
keeps the internal detector diagnostic because bevel/art peaks are ambiguous on
several cards. Alpha's outer frame edge remains uncertain. No per-scan transform
or coordinate adjustment is introduced. The paired audits run in Node; each took
about 107 seconds with both sets being audited concurrently, including decoding
and pixel invariants. This is CPU workload timing, not GPU completion time.

The local `early-lettering/validation/index.html` preserves the rejected title
experiment as well as the accepted credit candidate. `main-review/index.html`
shows the production credit change against actual main with identical inputs.

Six [printing-field corrections](fixtures/accuracy/early-printing-field-review.json)
are captured separately in `early-printing-fields`: three Alpha artist credits,
Alpha Jade Statue's 3/6, and the printed X/X on Alpha Plague Rats and Unlimited
Keldon Warlord. The [source-only audit](fixtures/accuracy/early-printing-field-measurement.json)
verifies the same renderer, frame assets and body layout, checks all 3,582 image
files, and confirms identical full PNGs for the other 591 cards at both sizes.
The local `early-printing-fields/index.html` shows all six corrected footers.
Correcting Plague Rats to X/X lowers overlap at both sizes because its remaining
glyph treatment differs from the scan. Source correctness takes precedence over
that score; these deltas are excluded from renderer gains. The original credit
trial inputs and measurements remain frozen.

## Alpha mana and Unlimited transfer

The [mana study](fixtures/accuracy/early-mana-plan.json) trains on twelve Alpha
costs and reserves twelve Alpha plus thirteen Unlimited costs. The candidate
was committed before validation: rightmost center (432, 46), pitch 27, diameter
23.9, and the existing historic font's original sun at 20.5px. It removes the
cost shadow while retaining the existing frame and other SVG assets. Two rounds
of half-pixel neighbors followed the initial shared grid; no per-scan fitting
or whole-frame registration change was made.

All reserved Alpha costs improve at both sizes. All reserved Unlimited costs
improve at inspect size; Sol Ring loses .031 at table size and remains explicitly
flagged. The [transfer review](fixtures/accuracy/early-mana-transfer.json) records
every crop, score and the independent disc-center diagnostic.

| Set / tier          | Changed costs | Median F1 before → after | Gains > .02 | Regressions > .02 |
| ------------------- | ------------- | ------------------------ | ----------- | ----------------- |
| Alpha / inspect     | 276           | .518 → .811              | 275         | 0                 |
| Alpha / table       | 276           | .503 → .770              | 273         | 1                 |
| Unlimited / inspect | 277           | .516 → .746              | 263         | 5                 |
| Unlimited / table   | 277           | .485 → .711              | 262         | 7                 |

The full-corpus audit found limitations missed by the small reserved cohort:
several single red costs in Unlimited need a farther-right position, especially
Lightning Bolt. Alpha Cyclopean Tomb has no printed cost, so its Oracle {4}
is a source mismatch. All eight regression strips are inspected and recorded in
[the corpus review](fixtures/accuracy/early-mana-corpus-review.json). Keep these
failures visible; do not certify the transferred geometry for every card.

All 74 frozen prototype PNGs match production exactly, 44 cards with no supplied
cost retain identical full PNGs, and pixels outside the mana envelope are
unchanged across all 597 cards. A further 64 cards from six other policies retain
identical PNGs at both sizes. The two Node audits each took about 92 seconds while
running concurrently, including decoding and invariants; this is CPU workload
time, not renderer submission or GPU completion time. Local comparisons are in
`early-mana/lea-validation/index.html` and `early-mana/2ed-validation/index.html`.

### User-reviewed sun discs and filled lettering

The previous mana and lettering acceptance missed two visible properties: the
original white sun retains a pale circular background, and early/Revised title
and credit ink has a solid gray interior with a lower-right shadow. Paired edge
F1 can remain high when both are wrong. User review supersedes those earlier
style conclusions; their original measurements remain reproducible.

`printing-style-plan.json` records the selected development examples and the
Beta credit transfer before its crops were opened. The first candidate used the
title font for credits. `printing-style-goudy-measurement.json` retains that
candidate; its narrower letterforms were rejected. The existing MPlantin credit
font scores higher than that candidate for every sampled credit and has closer
word widths. The final treatment retains its geometry, fills the letters gray,
and paints a lower-right shadow. Beta's six credits improve over its previous
small centered fallback; because their crops informed the font decision, the
final font comparison is development evidence, not a fresh holdout claim.

`printing-style-measurement.json` measures 16 selected cards at both raster tiers
with identical source inputs and identity frame alignment. Alpha Cockatrice's
credit remains an edge-F1 regression. Revised title scores are mixed. Restoring
Disenchant's white disc has almost no effect on the whole-row score, despite
correcting a visible omission. Neither score is a percent-accuracy claim.
The local crop report retains scan / prior branch / corrected branch views.

The next detector pass should evaluate component anatomy explicitly:

1. Separate a mana symbol's outer disc from its interior glyph. Compare radial
   boundary support and disc coverage after local contrast normalization; retain
   a missing-disc flag even when the black glyph's edge match is high.
2. Compare letter interiors as well as both edge polarities. Use isolated
   renderer glyph masks and signed local-contrast residuals to distinguish solid
   ink, outlined ink and shadows. Broad textured windows cannot certify fill.
3. Keep the existing shared-set/frame alignment, then search bounded component
   offsets on development cards and freeze the policy before transfer. Do not
   optimize each scan or fit color/saturation to inflate a score.
4. Include source identity and symbol-era checks before geometry scoring.
   Original type, rules and symbols are independent provenance fields. Review
   mismatches in magnified scan/render crops, including examples where shape
   corrections leave aggregate scores unchanged.

These diagnostics run on cached PNGs in Node. Chromium remains a raster/font
capture step, never a requirement for scoring or searching local comparisons.

### Early text centering and styled margins

The [27-card diagnostic](fixtures/accuracy/early-centered-measurement.json)
compares nine shared names across Alpha, Beta and Unlimited. Larger 32.5px
printing reproduces the centered line endings on Howling Mine, Disenchant and
Healing Salve; transferring Revised's 27.5px size directly did not. Mean body
edge F1 increases from .425 to .467 at inspect size and .399 to .448 at table
size. Twenty-one cards improve; all six Disenchant/Healing Salve scores regress.
The [visual review](fixtures/accuracy/early-centered-review.json) retains those
failures, remaining vertical offsets, font-weight differences and a source
mismatch on Alpha Force of Nature. These are development diagnostics, not
whole-set accuracy or an independent holdout.

Automatic centering now uses measured line fit and paragraph structure, with
the source selectable independently from visible wording. Purelace exposed a
separate margin bug: italic reminder runs bypassed both short and long text
paths. Early/Revised text now retains the panel inset regardless of styling.
Full Oracle reminders can shrink to fit, including Mesa Pegasus; they are not
dropped to force agreement with scans. See the [wording API](README.md#original-printing-and-oracle-wording).

## Queued experiments after the early-set work

Requested order; these remain experiments to try, not completed calibrations.
Keep the existing frame assets and shared set/frame policies while evaluating
them. Preserve geometry scores independently of color matching.

1. **HSB adjustments by set, frame color and component.** Sample representative
   white, blue, black, red, green, artifact and land frames from cached scans.
   Use approximate frame regions, then isolate the outer frame, mana symbols
   and text-box background; exclude illustration and printed ink from background
   estimates. Estimate robust hue, saturation and brightness adjustments for
   each component and combination, preserving texture and gradients. Compare
   several scans to identify common printing appearance, freeze the adjustments,
   and test other cards from the set. Do not fit individual scans. Report sparse
   or inconsistent samples rather than inventing a correction. Keep color
   agreement separate from shape/placement metrics so tint changes cannot hide
   alignment failures.
2. **More faithful set symbols.** Compare original contours, black outlines,
   white interior components and rarity fills. Reproduce the silver/gold
   gradients, including their direction and tonal range, rather than a flat
   metallic color. Measure silhouette, outline thickness and placement
   separately from fill color, and retain a list of source assets whose shapes
   cannot be corrected through rendering alone.
3. **Modern-frame alignment.** Run a component-by-component pass on ordinary
   modern cards: frame and art edges, title/mana row, type/set-symbol row,
   text panel, stats and footer. Use shared frame geometry first, with per-set
   exceptions only when repeated evidence supports them. Freeze changes before
   testing transfer to another set using the same frame.
4. **Planeswalker components and layout.** Review ability-text origins,
   paragraph spacing, loyalty-cost symbols and their relation to each ability
   row. Also inspect the lower frame, text-panel boundary and loyalty area.
   Evaluate different supported ability counts separately; keep unsupported
   layouts and frame-asset defects explicit rather than masking them with text
   offsets.

### Wording-independent symbols and preview coverage

`symbolStyle` now selects original or modern glyphs independently of wording
and centering. It applies to both mana costs and inline symbols, and participates
in the raster cache key. Original-symbol Oracle text on Alpha, Beta, Unlimited,
Arabian Nights and Antiquities uses Revised's tilted T when Oracle introduces a
`{T}` token; original written-out tapping instructions are retained as text.
The local review browser exposes this option without changing its original column.
API, raster-region, package, browser, showcase and accuracy checks pass.

The local browser now previews normal 2003-frame cards, including white-border
9ED and black-border DDK/DPA, through the existing modern assets. Those previews
are explicitly unvalidated; the accuracy corpus still excludes this frame until
its geometry and assets receive their own study. BRB's pinned Keyrune SVG exists
and decodes after a successful fetch. A local-browser fallback fetches and caches
the official Scryfall set SVG if the pinned asset fails, with visible provenance.
No browser code or downloaded assets are included in the package or showcase.

Unlimited Samite Healer is another counterexample to trusting MTGJSON's
`originalType`: the source says Creature – Human Cleric while the scan says
Summon Cleric. A hash-bound partial type review corrects this printing without
certifying its body wording. Do not infer historical subtypes from Oracle types.

### Full early-set typography audit before inset/weight follow-up

The frozen `early-centered-corpus` captures contain every eligible card in Alpha
(295), Beta (302) and Unlimited (302), with zero rendering failures or reported
text overflows. The Node-only audit verifies input/reference/raster hashes and
scores the same body rectangle at both texture tiers, using shared identity
registration. No per-scan alignment is fitted.

At inspect size, the paired Alpha body edge F1 mean changes from .443 to .485;
Unlimited changes from .442 to .488 across 301 unchanged-input pairs. Alpha has
173 gains and 38 declines larger than .02; Unlimited has 180 and 30. Howling
Mine's changed input is excluded from the paired Unlimited result. Beta has no
full-corpus baseline and receives absolute diagnostics only. All per-card scores,
fit summaries and regressions are retained in each set's
`early-centered-corpus-measurement.json`.

These are structural diagnostics, not accuracy percentages: texture and scan
placement still affect them. There are 48 Oracle-unverified source rows across
the three sets, and most remaining original text is imported rather than
scan-reviewed. Independent OCR line-geometry checks remain pending. The capture
renderer predates the independent-symbol option and the subsequent Alpha inset
and weight investigation; its hashes preserve that boundary.

### Alpha ink weight and minimum panel inset

Alpha Oracle wording now constrains body ink to canonical y=428..590, preserving
the existing optical center wherever the text already fits. This also applies
to the dense Oracle fallback; complete reminders and flavor text shrink instead
of occupying the panel margins. Original printing text retains its prior margins. Benalish Hero fits at 13.5px with its full Oracle reminder and
flavor passage. All 295 original-input Alpha cards render at both tiers with no
fit failures or overflow reports.

A .012em outline inset reduces the visible weight of the existing static MPlantin
font on Alpha. Text is composed on a temporary transparent layer so thinning
cannot erase frame texture or alter mana glyphs. It requires no pixel readback
and runs only during cached face composition. Eight development examples were
compared at 0/.008/.012/.016em. Structural edge scores barely respond to this
small weight change; the choice rests on visual review and remains an optical
approximation. The font asset still needs review for shape and weight fidelity.

The frozen [plan](fixtures/accuracy/alpha-ink-insets-plan.json) and
[per-card audit](fixtures/accuracy/lea/alpha-ink-insets-measurement.json) retain
the rejected trial: applying the inset to original text reduced paired inspect
body F1 from .485 to .427, with 94 declines over .02. Visual review of Gaea's
Liege, Ironroot Treefolk and Shivan Dragon confirmed that the scan typography
uses tight margins. The retained policy therefore limits the inset to Oracle
wording; its [plan](fixtures/accuracy/alpha-ink-retained-plan.json) and
[measurements](fixtures/accuracy/lea/alpha-ink-retained-measurement.json) preserve
the follow-up evidence. Northern Paladin's corrected
flavor attribution/type changes its input, so it is excluded from paired scores.
Check, strict native/WASM Clippy, build, Magic, package, browser, showcase and
accuracy tests pass. The local browser keeps option changes in the existing
feed and pins the search header while scrolling; that browser remains local.

The retained Alpha run renders all 295 cards with no failures or overflow. All
294 unchanged-input original layouts are byte-identical to the earlier layout
records. Body F1 is .485 → .482 at inspect and .473 → .471 at table, with zero
changes over .02 in either direction. The slight score decline is retained
alongside the visual weight correction; these edge metrics do not establish
correct font shape or stroke weight.

### Fourth and later core-set centering

Fourth Edition now also centers short rules/flavor blocks that fit within five
measured lines at the printed size, including attribution lines. Northern Paladin
uses this path; longer Black Knight, Serra Angel and Pearled Unicorn passages
remain left aligned. Explicit host alignment wins, and classification uses the
chosen original/Oracle reference independently of the visible wording.

Tenth Edition and M10–M14 use centered balanced lines for short rules-only blocks
(up to three measured lines). Eighth/Ninth Wrath of God scans are left aligned,
so the policy is set-scoped instead of inferred from the 2003 frame. The
[visual survey](fixtures/accuracy/centering-era-review.json) records scan hashes,
wording and sources. Later M15/Origins/M19 samples have flavor or longer text;
they do not establish when centering disappeared. Other sets and the precise
length boundary remain review work. Post-audit inspection of the 17 newly centered
Fourth flavor blocks found 16 centered scans and one exception, Sisters of the
Flame. Its five measured lines qualify but the scan is left aligned. This is
flagged for shared threshold review; no card-name/tap-symbol exception was added.
The 2003 geometry remains an explicitly
unvalidated preview and is excluded from validated corpus accuracy claims.

The [Fourth corpus report](fixtures/accuracy/4ed/centering-flavor-measurement.json)
covers all 378 cards without render failures or overflow. Against the older
`text-insets` baseline, 376 unchanged-input pairs move from .534 → .590 inspect
body F1 and .499 → .558 table F1, with 107 gains and two declines over .02 at
both tiers. These are cumulative changes since that baseline. Sisters of the
Flame (−.262 inspect) and Deathgrip (−.064) are explicit review flags; Northern
Paladin and the other changed-source input are excluded from paired aggregates.
The newly centered flavor subset has 16 comparable inputs: inspect .435 → .588,
table .394 → .560, with 15 gains and one decline over .02 at both tiers.

The subsequent [isolated boundary audit](fixtures/accuracy/4ed/centering-boundary-measurement.json)
resolves both flags. A Fourth-only 150-character gate (mana tokens count as one)
returns Sisters of the Flame to left alignment: body F1 .367 → .629 inspect and
.336 → .596 table. Of 374 unchanged-input pairs, only Sisters changes; the other
373 body rasters remain identical, preserving the 16 reviewed centered examples.
All 378 cards render without overflow. Deathgrip and Regeneration's reviewed
activation colons were stranded in a study annotation file; promoting them to the
canonical annotations restores their exact-wording corpus captures. Newly reviewed
Brothers of Fire and Wall of Brambles receive their printed colons too. These four
changed inputs are excluded from geometric deltas. Deathgrip's corrected absolute
inspect body F1 is .547, with 5px p95 edge distance.

The [frozen Fifth boundary sample](fixtures/accuracy/centering-length-boundary-plan.json)
contains twelve nearest examples on either side of 150 characters, selected by
color/artifact before viewing their scans. All twelve scans are left aligned.
This rejects a cross-set transfer of the Fourth rule; it does not establish
Fifth's own centering policy. The 150-character Fourth cutoff is an empirical
approximation, not a recovered historical typesetting specification.

On the single Tenth Edition Wrath development example, a fixed body crop and
identity registration give edge F1 .204 → .337 and p95 edge distance 49.1 → 7.2px
when switching from forced-left to automatic centering with identical words and
assets. [The diagnostic](fixtures/accuracy/tenth-wrath-centering-measurement.json)
records raster hashes and scope. This is neither a held-out test nor a
whole-card/2003-frame validation.

Fourth Edition now uses the newer white sun in both costs and inline text while
retaining its historical tilted-card tap symbol when original symbols are chosen.
Raster tests check that Fourth's white header glyph remains identical when
switching symbol modes, while its inline tap changes; Revised changes both.

### Northern Paladin source correction

The [13-printing audit](fixtures/accuracy/northern-paladin-flavor-review.json)
finds the missing flavor attribution newline in LEA, LEB, 2ED, CED, CEI, 3ED, SUM
and retro 30A #326. Both Scryfall and MTGJSON have the defect; switching providers
would not repair it. Hash-bound partial corrections restore the break locally
without claiming that the original rules wording has been scan-certified.
Original and Oracle previews share the printing's corrected flavor.

[MTGJSON PR #1748](https://github.com/mtgjson/mtgjson/pull/1748) supplies the eight
UUID-specific flavor overrides. MTGJSON imports Scryfall bulk card data, maps
`flavor_text` to `flavorText`, and applies manual overrides later. The same report
was submitted to Scryfall's official card-issue form, which confirmed receipt;
both upstream corrections are pending review. No general flavor-source migration
is implied.

### Measured planeswalker abilities across M21 and M20

The [frozen anchor policy](fixtures/accuracy/planeswalker-anchor-text-plan.json)
replaces estimated character widths with measured MPlantin runs. Normal panels
keep equal badge anchors while fitting actual ink and checking adjacent text gaps.
Taller panels allocate room from measured row demand. Passive text uses a smaller
left inset; matching explicit paragraph runs retain italic reminders. The existing
frame, paper and badge assets remain. Oversize content produces an explicit error,
and cached captures retain the per-ability layout diagnostics.

All 26 eligible planeswalkers (14 M21, 12 M20) now have exact-printing MTGJSON
wording in both sides of the comparison. This avoids falsely attributing shortened
names, “mana value” and Oracle reminder changes to geometry. It does not certify
every source character against a scan. Six M21 cards formed development; eight
M21 printings and all twelve M20 cards were reserved before the final geometry
was selected. The three additional Teferi illustrations share wording and are not
independent typesetting cases.

| Cohort          | Cards | Inspect body edge F1 | Table body edge F1 | Inspect gains / declines > .02 |
| --------------- | ----: | -------------------- | ------------------ | ------------------------------ |
| M21 development |     6 | .400 → .504          | .386 → .482        | 5 / 1                          |
| M21 reserved    |     8 | .365 → .508          | .351 → .488        | 8 / 0                          |
| M20 transfer    |    12 | .316 → .486          | .302 → .473        | 11 / 0                         |

The [development report](fixtures/accuracy/walker-text-final-dev-development-measurement.json),
[same-set report](fixtures/accuracy/walker-text-anchors-same-set-reserved-measurement.json)
and [transfer report](fixtures/accuracy/walker-text-anchors-set-transfer-measurement.json)
contain all per-card body, badge and loyalty scores, raw and registered. Registration
uses the previously frozen M21 frame transform, transferred unchanged to M20; no
scan receives a fitted offset. Node scores frozen rasters without Chromium or a
GPU. The scores are regional diagnostics, not percent accuracy. All captures have
zero render failures and zero measured overflow. Earlier development trials with
variable normal row heights or a global downward offset were rejected; their
reports remain as diagnostic history, not held-out evidence.

Two explicit review flags remain. Ugin's body F1 falls .463 → .407, although badge
F1 improves .586 → .615: line wrapping and the text's position relative to its
badge still disagree. Chandra, Awakened Inferno's badge F1 falls .556 → .482 while
body F1 changes .377 → .392. Its short passive paragraph receives too little
vertical space ahead of three denser abilities. Teferi's long passive paragraph
benefits from the new policy, so another global taller-panel offset is unsuitable.
Revisit shared row allocation with separately reserved examples of both patterns.
Do not add card-name exceptions or per-scan corrections.

Visual review also separates asset/composition defects from this text work:
planeswalker paper is flat and opaque instead of showing the printed texture and
underlying illustration; horizontal separators are too explicit; loyalty badge
bevels and silhouettes differ; the bottom foil stamp and complete collector/legal
printing are missing. Several line endings and glyph weights still differ despite
correct source wording. These remain work items, not reasons to retune registration.

### Planeswalker component review and sparse text

The [reviewed component plan](fixtures/accuracy/planeswalker-reviewed-components-plan.json)
records 70 cards: 14 M21, 12 M20, six M15 and 38 WAR. M15/WAR were initially
reserved, but subsequent user review and iteration consumed that reservation.
The final reports are confirmation on examined cards, not fresh held-out evidence.
No registration was fitted per scan. M15/WAR use the frozen M21 transform as an
explicitly unvalidated transfer; raw scores remain alongside it.

The painter now uses regular MPlantin for the colon instead of the bold Beleren
number font, taller ability badges with a soft shadow, and a wider starting-loyalty
plate. A [bounded component search](fixtures/accuracy/planeswalker-loyalty-offset-study.json)
across the 26 development cards identifies a shared right/up correction for the
widened plate. Distance and overlap optima disagree by only about one pixel;
the selected correction is +1px horizontally and −3px vertically. The source
badge still contains a baked shadow and angular bevels.

Paper is clipped to the existing frame aperture before the frame is painted.
This prevents the rectangular underlay leaking through the type opening and
lower corners. The generic frame drop shadow is omitted for planeswalkers.
The type strip reuses the existing texture with a separate outline and left/down
shadow, excluding the baked bottom edge. Its position and contour are still
under review; this is not an accepted whole-frame calibration.

Four-row panels retain equal anchors even with a short static paragraph, use
0.9-em baseline spacing and a 17.5px font ceiling. One-/two-row panels allow 24px
text and a larger vertical budget; three-row layouts retain the previous 19px
policy. All 70 captures succeed with no measured text overflow. This does not
prove absence of text/plate occlusion: final-line ink near the loyalty silhouette
needs an independent foreground check, beyond a conservative bounding rectangle.

| Examined cohort | Cards | Inspect body F1 | Inspect starting loyalty F1 | Inspect type-strip F1 |
| --------------- | ----: | --------------- | --------------------------- | --------------------- |
| M21/M20         |    26 | .497 → .507     | .459 → .622                 | .571 → .504           |
| M15/WAR         |    44 | .374 → .411     | .457 → .640                 | .569 → .466           |

The [M21/M20 report](fixtures/accuracy/walker-review-refined-development-measurement.json)
and [M15/WAR report](fixtures/accuracy/walker-review-refined-set-transfer-measurement.json)
include every card and both raster tiers. Chandra, Awakened Inferno's body F1
improves .392 → .516 and Kasmina's .359 → .532. Ugin retains the text layout the
user preferred; body F1 is nearly unchanged (.407 → .404). These are regional
structural scores, not percentages of accuracy. Frozen rasters are compared in
Node without Chromium or GPU work; the report timing states that scope.

Do not hide the regressions: type-strip registered overlap declines on 60 of 70
cards by more than .02. Chandra's raw type score improves .535 → .615 while its
registered score declines .611 → .473. This disagreement calls for separate
text-ink and outline targets and a frame-registration audit; neither optimizing
the combined crop nor fitting each scan is an appropriate resolution. Ability
badge and left-border scores also remain mixed. Keep the revised visuals
reviewable while measuring those components independently.

M15 exposed source errors: literal backslash-r line-ending artifacts and the
later Legendary erratum in MTGJSON's `originalType`. The raw original text is
retained, with only line-ending artifacts normalized. All six printed type lines
were checked against the cached scans and recorded as hash-bound partial
annotations, not full rules certification. Both sides of the final M15 comparison
use these corrections: the old renderer was recaptured at `08fa0e5`. Earlier M15
reports containing the source artifacts are diagnostic history only.

The subsequent [one-pixel type-strip follow-up](fixtures/accuracy/planeswalker-type-lowered-plan.json)
lowers the strip again after user visual review. All 70 inputs and measured
ability layouts are identical to the preceding pass, and all 70 render without
overflow. The [M21/M20 follow-up](fixtures/accuracy/walker-type-lowered-development-measurement.json)
and [M15/WAR follow-up](fixtures/accuracy/walker-type-lowered-set-transfer-measurement.json)
retain the unchanged baseline and registration. Inspect type-strip F1 is now
.466 and .465 respectively; the type/registration review flag remains open.

The next [fractional-shadow follow-up](fixtures/accuracy/planeswalker-type-shadow-plan.json)
adds another 1px downward shift and extends the downward shadow offset from 2px
to 2.5px. Canvas preserves fractional offsets at each raster density. All 70
captures retain identical inputs and ability layouts, with no measured overflow.
Compared with the preceding follow-up, inspect type-strip F1 changes .466 → .460
for M21/M20 and .465 → .472 for M15/WAR; table-tier F1 improves .440 → .453 and
.433 → .460 respectively. The [development report](fixtures/accuracy/walker-type-shadow-development-measurement.json)
and [transfer confirmation](fixtures/accuracy/walker-type-shadow-set-transfer-measurement.json)
retain raw and registered scores. Individual results remain mixed: Ugin's
registered type F1 improves .434 → .514 while Chandra's declines .453 → .386.
Keep the independent outline/ink and registration review open. The local
comparison displays this latest version.

The [type-box and symbol follow-up](fixtures/accuracy/planeswalker-type-symbol-plan.json)
raises the plate's bottom edge 1px while extending its shadow offset by 1px,
preserving the top and typography anchors. The initial top-trim interpretation
was superseded by the user's clarification. M15 and M20 now crop the transparent
padding in their pinned Keyrune vectors, as M21 already did; their visible glyphs
grow from about 30px to 54px wide. Custom symbols retain their viewport. The
regression check paints padded synthetic symbols at both raster tiers.

All 70 cards render without measured ability overflow. Inspect type-region F1
is .473 for M21/M20 and .476 for M15/WAR; the
[development](fixtures/accuracy/walker-type-symbol-development-measurement.json) and
[confirmation](fixtures/accuracy/walker-type-symbol-set-transfer-measurement.json)
reports retain every raw/registered result. These remain mixed regional scores,
not proof of complete frame accuracy.

The new [independent geometry audit](fixtures/accuracy/walker-type-symbol-geometry-measurement.json)
measures signed paper transitions in three fixed strips and lettering in a
separate interior sample. It confirms the approximately 1px bottom-edge lift
on 50/70 inspect pairs; 20 ambiguous cases remain uncertain. The straight lower
shadow sample is byte-identical before/after on all 70 cards at both tiers.
Against raw scans, only 39/70 plate pairs and 35 text samples pass confidence
checks. Curved ends, bevels and competing edges still need dedicated targets;
these measurements do not authorize another positioning change. Reproduce with
`node games/magic/tools/accuracy/walker-type-geometry.mjs`. This runs on cached
rasters in Node, without Chromium or GPU execution.

The [material and lower-curve pass](fixtures/accuracy/planeswalker-materials-plan.json)
restores the full native heights of the existing planeswalker background and
frame. The previous bounds cropped about 9px from each source at canonical size,
hiding the lower curve. All 34 unique cached frame/background assets used by
these cards share the respective 2736×3810 and 2778×3793 dimensions. Width and
top anchors are unchanged; this does not replace or stretch the source artwork.

Colorless title/type textures contain gray pixels with approximately 70% opacity.
A shared partial second pass raises their coverage to about 85%; the rules paper
also receives a lighter neutral fill. The outer frame's tone is unchanged.
M21 Ugin, WAR Ugin and WAR Karn all had dark paper and type fills. In fixed blank
patches, median absolute luminance error across these three printings falls from
18.8 to 0.4 for paper and 26.9 to 2.1 for the type fill (encoded 0–255 scale).
Karn's title remains brighter than both Ugin scans, so the shared title correction
does not fully match Karn. These are development measurements, not independent
validation or a complete HSB calibration; printed texture and illustration
composition remain missing.

The [isolated comparison](fixtures/accuracy/walker-materials-isolation-measurement.json)
checks the curve-only intermediate separately from the gray-fill change. All 70
inputs and ability layouts are unchanged, with no measured overflow; the 67
other cards have byte-identical rasters between the curve-only and final passes
at both tiers. Reproduce with `node games/magic/tools/accuracy/walker-material-audit.mjs`.
This is CPU analysis of cached PNGs, without Chromium or GPU work.

Lower-curve placement remains open: registered inspect F1 rises .174 → .300
(55 gains and 8 declines over .02), while table F1 falls .180 → .091
(2 gains and 54 declines). Raw scores show the same disagreement between tiers.
The crop includes the missing stamp and other frame details, and thin edges
change under downsampling. A fixed straight sample on M21 Ugin also shows the
restored outer edge lower than the scan. Do not interpret the restored curve or
the inspect gain as an accepted alignment. Measure the inner rim, outer curve
and stamp separately before another shared geometry correction.
The full [M21/M20](fixtures/accuracy/walker-materials-development-measurement.json)
and [M15/WAR](fixtures/accuracy/walker-materials-set-transfer-measurement.json)
reports preserve raw and registered scores for every region and card.

The [lower-panel study](fixtures/accuracy/planeswalker-lower-panel-plan.json)
separates the inner paper rim from the outer colored curve using signed vertical
transitions in four fixed strips. Single, merged, competing and boundary peaks
remain uncertain. Synthetic tests cover displacement, brightness, gamma, grain,
missing transitions and distractors. No image registration is fitted by this tool.

Both edges were 4–6px too low across the four examined sets. A shared 5px lift
compresses only the existing background/frame/paper below the type opening;
upper geometry, text and badge anchors are preserved. The
[80-card geometry report](fixtures/accuracy/walker-lower-panel-geometry-measurement.json)
records source/capture hashes and both raster tiers. Upper pixels differ by at
most one channel unit from source-rectangle rounding. On the 70 development
cards, raw inspect median absolute error falls from 4.78 to .59px for the inner
rim and 5.23 to .50px for the outer curve, with 208/280 paired samples reliable.

Ten M19 planeswalkers were selected by metadata and reserved before their scans
or results were viewed. Their 33/40 reliable strips all improve: inspect inner
error 4.44 → .31px and outer error 4.95 → .30px; table errors improve to .34 and
.45px. Seven uncertain strips remain in the denominator. This validates the
lower-panel correction on this set, not all typography, source wording or frame
details. Raw measurements are primary; M19 receives no fitted registration.
Run `node games/magic/tools/accuracy/walker-lower-frame-audit.mjs` to reproduce
the CPU measurements from cached rasters.

The stricter rim check also exposes a separate layout bug: dense two-row WAR
abilities can extend below the paper while the old overflow flag reports false.
Narset, Tibalt, Angrath, Ashiok, Dovin and Saheeli need a final glyph-bound fit
against the actual paper aperture. This is visible in the new captures and must
be corrected; nominal row-height checks are insufficient.

The [paper-fit correction](fixtures/accuracy/planeswalker-paper-final-plan.json)
now constrains actual glyph blocks to the aperture, propagating downward from
the top limit and upward from the bottom limit while preserving at least 8px
between abilities. The existing divider is constrained to that gap. Only an
impossible fit needs a smaller font; final overflow checks actual glyph bounds.
An original dense two-row fixture exercises this failure in `test:magic`.

The [80-card confirmation](fixtures/accuracy/walker-paper-final-measurement.json)
keeps every font size, printed input, line wrapping and loyalty anchor unchanged.
34 cards move text or dividers; 46 retain byte-identical images at both tiers.
All final ink lies inside the paper with at least an 8px inter-ability gap.
The lowest glyph ends at y=616.33. These are now examined cards, including M19;
the earlier independent lower-frame validation remains separate. This fixes
the collision invariant, not sparse-row typography or loyalty-badge placement.
Run `node games/magic/tools/accuracy/walker-paper-fit-audit.mjs` to reproduce.
Raw overlap remains mixed: Saheeli's body F1 falls .371 → .246 while p95 edge
distance improves 18 → 12px and the formerly clipped final line becomes visible.
Keep typography accuracy separate from the now-enforced paper-bound invariant.

## Core-set symbol treatment and M19 transfer

The M21 symbol study separates silhouette/placement from color. The existing
Keyrune shields encode letters as transparent holes: that exposed the plate
instead of printing opaque black letters on uncommon/rare/mythic shields, or
white letters on common shields. The painter now supplies those letter inks,
a one-pixel outer rim and a shaded rarity field using the existing stencil.
M19 also receives the visible-viewport crop already used for M20/M21. Custom
symbols retain their existing behavior. These changes run only during cached
face preparation, with no pixel readback or additional asset download.

[The frozen plan](fixtures/accuracy/set-symbol-plan.json) selects the first
normal card in each rarity/color bucket: 26 M21 development cards and 26 M19
cards reserved before their scans were inspected. Previously seen M19
planeswalkers are excluded. A shared 81-offset search favored two pixels left
and one up on normal core shields; the distance objective preferred zero up,
so the one-pixel vertical ambiguity remains recorded. The production capture
uses one position for the entire family. Planeswalker positions are unchanged.

| Cohort                | Cards | Inspect symbol edge F1 | Table symbol edge F1 | Inspect gains / regressions |
| --------------------- | ----: | ---------------------: | -------------------: | --------------------------: |
| M21 development       |    26 |            .312 → .597 |          .336 → .601 |                      24 / 1 |
| M19 reserved transfer |    26 |            .286 → .626 |          .301 → .590 |                      26 / 0 |

Gains/regressions require an absolute .02 change; the remaining M21 card is
stable. M19 also improves signed contrast and Census on every card at both
tiers. M21 Alchemist's Gift has an inspect edge regression; Cancel and
Alchemist's Gift have contrast/Census regressions. Enlarged scan/before/after
crops confirm corrected white letter ink but expose remaining stencil size and
contour differences. Shared scale needs a separate check before those differences
are attributed to the SVG asset. Do not tune those scans individually or hide their scores.
The approximate rarity gradients are not calibrated print colors or HSB fits.

Measurements use identical printing inputs, fixed raw normalization and a
fixed symbol window. CPU comparison of both sizes takes about 16 seconds for
M21 and 19 seconds for M19 in this run, including PNG decoding and bounded
translation diagnostics; it uses no Chromium or GPU work. Raster capture still
uses the browser. These are component scores, not percentages of card accuracy.
The window can contain nearby frame/type ink; this is not a foreground-certified
metric. M20 uses the same shield treatment but still needs a full-set follow-up,
as do every-card M19/M21 coverage and non-shield symbols such as WAR/M15.

Reproduce with `magic:reference:render -- --set m21 --study set-symbol --cohort
calibration --run symbol-final` and M19's `held-out` cohort. Then run
`node games/magic/tools/accuracy/set-symbol-audit.mjs symbol-final development`
and the same command with `reserved`. Baseline images and source hashes remain
in the local capture cache. The local review browser remains outside the repo.

## Uniform core-symbol scale and type-plate bevel

The next pass addresses the observed width and height deficit together. The
[policy](fixtures/accuracy/set-symbol-size-plan.json) freezes a 1.10 uniform scale
about the existing normal-frame center and a 1.5px white or black rim. The type
line reserves half the added width. Custom symbols and planeswalker geometry
retain their existing behavior. Existing shield vectors and frame sprites remain.

Ten candidates separate scale and rim thickness on the same 26 M21 development
cards. The selected candidate improves every card by more than .02 on all three
inspect diagnostics: median paired edge F1 .597 → .920, signed contrast .556 →
.907, Census .680 → .908. The 12% trial declines; 2px rims have mixed effects.
These are component diagnostics, not percentages of whole-card accuracy.
The [measurements](fixtures/accuracy/set-symbol-size-development-measurement.json)
retain each candidate, source hashes, fixed window and per-card results.

The dark inset immediately above the normal type plate's lower outline now has
a 20% white blend in a 2.3px band, faded at the ends. Six material examples improve
in a separate [tone diagnosis](fixtures/accuracy/set-symbol-bevel-development-measurement.json);
gold worsens and remains unchanged, as do unexamined land/colorless materials.
The tone diagnosis samples one shared two-pixel displacement between the scanned
and rendered bevel. It neither fits individual scans nor certifies the remaining
plate-height error. Geometry and tone remain separate review items.

M20's 28 normal-card material/rarity examples were selected from metadata before
viewing their symbol crops or scores. The policy is frozen before that validation.
The paired production captures confirm the change at both tiers:

| Cohort          | Cards | Inspect edge F1 | Table edge F1 | Edge gains / regressions at either tier |
| --------------- | ----- | --------------- | ------------- | --------------------------------------- |
| M21 development | 26    | .597 → .920     | .601 → .830   | 26 / 0                                  |
| M20 reserved    | 28    | .627 → .890     | .598 → .808   | 28 / 0                                  |

All 54 cards also improve inspect signed contrast and Census by more than .02.
At table size, M20 has 27 contrast gains and one stable result; none regress.
The [M21](fixtures/accuracy/set-symbol-size-m21-measurement.json) and
[M20](fixtures/accuracy/set-symbol-size-m20-measurement.json) reports retain
per-card and per-tier scores. Mazemind Tome M21 #232 retains a shared-coordinate
placement residual: its diagnostic peak is 2px right, with F1 .635 → .972.
Cavalier of Night M20 #94 peaks at (1,1), .659 → .914 inspect. Those fitted
diagnostic values are not the reported accuracy scores; neither card receives
an individual rendering or scan transform. Both remain in the local review page.

The [full-set plan](fixtures/accuracy/set-symbol-all-plan.json) covers 952 eligible
M19/M20/M21 printings, retaining unsupported-layout exclusions in the denominator.
Its complete before captures precede the initial symbol treatment. Intermediate
v49 full captures were superseded by v50; partial captures are never scored.

The comparison cache hashes source PNG bytes on every call and stores exact
canonical grayscale regions with method and payload hashes. Cold sampling is
bit-identical to full normalization followed by cropping; warm sampling skips PNG
decoding and whole-image resampling. The ten-candidate warm audit took 14.9s for
286 regions on this machine while other jobs were running. This includes CPU
hashing and metrics, no Chromium or GPU work. Capture still uses Chromium;
sharing each card's decoded source lease between inspect/table preserved all six
PNG hashes and layout outputs in a three-card parity check.

## Complete core-set symbol coverage

The frozen v47-to-v50 audit now measures all 952 captured eligible printings:
312 M19, 343 M20 and 297 M21. The 1,055-printing corpus contains 102 excluded
special treatments and one unsupported ordinary transform, M19 #218 Nicol
Bolas, the Ravager // Nicol Bolas, the Arisen. Its cached `originpwdfc` exclusion
is retained as a structural failure in the denominator: coverage is 952/953,
not 952/952. There are no capture failures among the 952 measured printings.

The reports separate ordinary nonbasic cards, basic lands and planeswalkers.
Ordinary nonbasic symbol-window results at inspect size are:

| Set | Cards | Median edge F1 | Gains / regressions |
| --- | ----: | -------------: | ------------------: |
| M19 |   282 |    .274 → .634 |             282 / 0 |
| M20 |   311 |    .469 → .894 |            290 / 15 |
| M21 |   268 |    .355 → .932 |             266 / 0 |

Gains/regressions require an absolute .02 change. These comparisons include
the lettering, rim, viewport and scale changes together, not just the final
10% enlargement. All fifteen M20 ordinary inspect regressions are commons;
eight are black cards. Feral Abomination #101, Mind Rot #108 and Maniacal Rage
#149 remain review examples. The subset's gains do not certify the full set.
M19 retains a larger contour mismatch despite its consistent improvement.
Planeswalker windows contain nearby frame ink and are flagged separately;
their declines must not be interpreted as isolated shield regressions.

The [M19](fixtures/accuracy/set-symbol-all-m19-measurement.json),
[M20](fixtures/accuracy/set-symbol-all-m20-measurement.json) and
[M21](fixtures/accuracy/set-symbol-all-m21-measurement.json) reports preserve
every card, category, both tiers, paired metrics, diagnostic offsets and source
hashes. No diagnostic offset is applied to a scan or individual card. Reproduce
with `node games/magic/tools/accuracy/set-symbol-all-audit.mjs m19` (and m20/m21).
Cold CPU audits took approximately 222–240 seconds per set while running
concurrently, including PNG decoding, cached-region generation and bounded
offset searches. This excludes raster capture and measures no GPU completion.

## One-pixel normal-frame borders

User review selected two small changes using the existing bitmaps: extend the
type plate's top outline 1px inward, and expand the rules box upward by 1px.
The original type pass retains its silhouette; a clipped repeated upper cap
adds ink around the curved ends. Only the frame band containing the rules
box's upper border shifts. Its bottom, rules text and other frame geometry
retain their positions. This applies to normal frames, not planeswalkers.

The [M21](fixtures/accuracy/normal-border-m21-measurement.json) and
[M20](fixtures/accuracy/normal-border-m20-measurement.json) diagnostics revisit
the 54 previously examined cards with fixed normalization and no fitted scan
alignment. The audit requires byte-identical pixels outside the upper type
and rules-border bands at both tiers, including the complete lower rules box,
and identical text layout. All 54 pass.

| Region / set    | Inspect edge F1 | Gains / regressions | Table edge F1 |
| --------------- | --------------: | ------------------: | ------------: |
| Type top / M21  |     .285 → .836 |              26 / 0 |   .574 → .992 |
| Type top / M20  |     .750 → .973 |              26 / 2 |   .679 → .948 |
| Rules top / M21 |     .942 → .892 |              5 / 19 |   .907 → .914 |
| Rules top / M20 |     .892 → .926 |              19 / 4 |   .873 → .891 |

The thicker type outline has strong aggregate support. The one-pixel rules
expansion was accepted in visual review, but its mixed edge scores remain
recorded; this is not a uniformly improving metric change. Thin-border
diagnostics still need to separate shared scan alignment, edge thickness and
bevel shape before any further adjustment. Do not introduce per-card or
per-set offsets from these results alone. The local comparison includes both
top and bottom crops plus full cards, and stays outside the repository.
Run `node games/magic/tools/accuracy/normal-border-audit.mjs m21` (and m20)
to reproduce from the cached v50/v51 rasters.

## M15 and WAR symbol ink, outlines and geometry

The [topology study](fixtures/accuracy/set-symbol-topology-plan.json) retains
the pinned M15 and WAR SVG stencils. Their interior holes now receive opaque
white ink on commons and black ink on other rarities. Backing contours follow
the stencil envelopes, with an outer rim and the existing core-symbol rarity
gradient. Caller-supplied symbols keep their own painting behavior. These
operations run during static face preparation without bitmap readback.

The first normal nonbasic card in each material/rarity bucket supplies 28 M15
and 30 WAR development examples; the next printing was reserved before its
scan was inspected. Candidate crops reuse decoded images and must match the
production control pixel-for-pixel. The CPU sampling path must also match
full-card canonical normalization. The candidate template, source hashes and
all trials are retained in the development measurement reports.

M15 uses 92% of the previous size, shifted 2px right and 1px up, with a .7px
outline stroke. WAR initially used 85% size and a 1.2px outline. WAR's .82 and
.85 trials are nearly tied; .85 retains more of the original size. Geometry
is shared by set symbol, never fitted to individual printings. Other modern
frame types receive the ink treatment while preserving their geometry.

The first frozen pass validates all 50 reserved normal cards:

| Reserved cohort | Cards | Inspect symbol edge F1 | Table symbol edge F1 | Edge gains / regressions at either tier |
| --------------- | ----: | ---------------------: | -------------------: | --------------------------------------: |
| M15             |    21 |            .502 → .935 |          .479 → .902 |                                  21 / 0 |
| WAR             |    29 |            .622 → .806 |          .570 → .734 |                                  29 / 0 |

All M15 diagnostics improve on every reserved card. WAR's Cruel Celebrant #188
loses local-contrast agreement at both tiers despite edge/Census gains. The
[M15](fixtures/accuracy/set-symbol-topology-m15-reserved-validation.json) and
[WAR](fixtures/accuracy/set-symbol-topology-war-reserved-validation.json)
reports retain that result. Narrow symbol windows reduce frame-line distraction;
larger contextual windows remain alongside them. Neither is a percentage of
whole-card accuracy.

The 58 development cards and 44 previously examined planeswalkers are separate
confirmation cohorts. All 152 first-pass comparisons preserve every pixel
outside their symbol windows and all text layouts. Planeswalker context crops
still contain frame ink and have weak absolute agreement; their improvements
do not establish isolated symbol placement accuracy.

### WAR common rim and vertical follow-up

Visual review identified a weak common white rim and symbols sitting low.
The [follow-up policy](fixtures/accuracy/set-symbol-war-rim-plan.json) compares
0/1/2px lifts and three common outline widths on the examined development
cards. A 1px lift improves the aggregate diagnostics more than 0 or 2px. A 2px
outline stroke leaves approximately 1px of white outside the black stencil;
2.8px looks too heavy despite a small common-edge advantage. Other rarity rims
remain 1.2px, and planeswalker positions remain unchanged.

Twenty additional normal cards were selected from metadata and reserved before
their scans were viewed. Against the previous topology pass, their narrow
symbol-window median edge F1 improves .808 → .844 inspect and .758 → .775
table; signed contrast improves .789 → .834 and .765 → .811. Twelve improve
edge F1 by more than .02 at each tier. Three regress on all three diagnostics
at both tiers: Bolas's Citadel #79, Charity Extractor #81 and Dreadhorde Invasion
#86. They are all black cards. Keep them flagged for shared frame/scan-alignment
analysis; do not add individual offsets. The [full reserved report](fixtures/accuracy/set-symbol-rim-war-reserved-validation.json)
also verifies unchanged pixels outside the symbol window and unchanged text.

Reproduce the initial comparisons with
`node games/magic/tools/accuracy/symbol-topology-validation.mjs m15 reserved`
(or war, and development/walkers). The follow-up uses
`node games/magic/tools/accuracy/symbol-topology-validation.mjs war reserved set-symbol-war-rim-plan`.
These commands compare cached rasters on the CPU; they do not start Chromium
or measure GPU completion. Source captures remain separate. Full-set coverage
for M15/WAR and additional symbol topologies are still required.

### Complete M15/WAR symbol coverage

The frozen [full-set plan](fixtures/accuracy/set-symbol-topology-all-plan.json)
now covers 284 M15 and 274 WAR printings, including basics and planeswalkers.
WAR's one special treatment is excluded explicitly. All 558 captures succeeded
at both tiers, and every pixel outside the permitted symbol region is unchanged
between v51 and v53. This extends the examined corpus by 386 cards.

| Ordinary nonbasic cohort | Cards | Inspect symbol F1 | Table symbol F1 |
| ------------------------ | ----: | ----------------: | --------------: |
| M15                      |   258 |       .563 → .948 |     .553 → .894 |
| WAR                      |   221 |       .620 → .848 |     .576 → .786 |

M15 has no edge regressions. WAR retains Mountain #260 at both tiers and
Tomik #34 at table tier. Liliana's Triumph #98 loses inspect contrast; Census
regresses on #34/#98/#260 at inspect and Sorin #217 at table. These are v51→v53
results, distinct from the earlier rim-only regressions. All individual scores
remain in the [M15](fixtures/accuracy/set-symbol-topology-all-m15-measurement.json)
and [WAR](fixtures/accuracy/set-symbol-topology-all-war-measurement.json) reports.

Planeswalker context scores improve but still mix symbol and frame ink. The six
M15 planeswalker captures also missed the base annotations' reviewed original
type lines because study-specific annotation loading did not inherit them.
Before/after inputs are identical, so the symbol comparison remains valid;
these captures cannot validate original typography. Fix annotation inheritance
before the next typography capture.

Independent [M15](fixtures/accuracy/normal-plate-symbol-m15-measurement.json) and
[WAR](fixtures/accuracy/normal-plate-symbol-war-measurement.json) plate reports
retain raw signed edge positions and confidence. Charity Extractor and
Dreadhorde Invasion have similar title/type displacement, consistent with the
whole-scan offset confirmed in visual review. Translation-only scan
normalization is the next measurement pass; it must use independent frame
landmarks, retain raw scores, and reject inconsistent geometry rather than
fitting individual text or symbols. Bolas's Citadel's title width and rules
typography require separate study.

## Frame translation and ordinary title size

The translation pass freezes a baseline frame template before comparing any
typography candidates. It measures three strips at each art edge and three
at each opposing outer rail. The first strong paper-to-border transition
avoids following a dark feature in the illustration. It accepts only a
translation within 4px, with at least two usable strips per edge and at most
.8px disagreement within/across edges. Each uncertain axis remains at zero.
No scale, rotation, text, mana or set-symbol fit is performed. The lower rules
edge remains a diagnostic because stamped and unstamped frames differ there.

The frozen [WAR](fixtures/accuracy/scan-normalization-war-profile.json) and
[M15](fixtures/accuracy/scan-normalization-m15-profile.json) templates currently
support nonlegendary normal modern frames. The CPU pass records raw and
normalized scores for 485 such printings; the other 73 retain explicit
unsupported status. Accepted y corrections cover 135/215 WAR and 181/270 M15
cards; x coverage is 67/215 and 210/270. These are independent per-axis
confidence decisions, not a claim that every scan is fully registered.

Charity Extractor receives a -1.46px y correction and Dreadhorde Invasion
-1.03px. Their symbol F1 changes .862→.955 and .793→.822 without moving our
symbols. Dreadhorde's rules score declines after alignment, exposing a distinct
body-layout problem. Do not choose registration by whichever text score wins.
Bolas's Citadel keeps its raw scan until crowned-frame registration is validated.
Older frozen studies remain unchanged. Run
`node games/magic/tools/accuracy/scan-normalization-audit.mjs war` (or m15).
The report retains each anchor, rejected axis and method/capture hash.

The ordinary Canvas title now uses 26px instead of 24px, preserving its font,
tracking, position and width-fitting policy. Special-layout title sizes remain
24px. Ten WAR development cards and 50 additional WAR/M15 cards improve title
edge overlap at both raster tiers, with raw and normalized references. All
native pixels outside the title region remain identical. Full available name
width is measured, excluding mana. The [WAR](fixtures/accuracy/normal-title-war-measurement.json)
and [M15](fixtures/accuracy/normal-title-m15-measurement.json) reports retain
each result; these reused symbol cohorts are additional typography checks,
not unseen scans. Transfer to other frame eras still needs measurement.
Run `node games/magic/tools/accuracy/normal-title-study.mjs war capture` once
for the cached rasters, then omit `capture` for CPU-only comparisons.

### Dense-body experiment remains unaccepted

Citadel's 1% smaller body trial restores the scan's line breaks. Tighter
paragraph gaps and a small upward preference then improve its measured body
overlap much more than widening the box alone. These are distinct from line
leading, which stays unchanged in the strongest shared trial. Short cards
must retain their existing layout.

The same density-conditioned trial was checked on 23 additional cards and
regresses on seven, including God-Eternal Oketra, God-Eternal Bontu, Blindblast,
Planewide Celebration, Roalesk, Genesis Hydra and Grindclock. The
[experiment record](fixtures/accuracy/normal-dense-text-experiment.json) and
frozen candidate template retain the results. Do not promote that rule yet.
Next separate actual line widths, paragraph baselines and bottom/stat clearance;
test margin changes without changing the font size. The local comparison's
“Dense-text trial” remains an explicitly experimental view.

### Window and type-width pass (v55)

The [frozen selection](fixtures/accuracy/normal-window-plan.json) covers 167
ordinary cards across WAR, M15, M19, M20 and M21 at both raster tiers. Art now
has a separate inner aperture (4.5px inset per side) and a 1.5px black rim;
previous painting covered that rim. Type lettering expands 2% where it fits,
while already width-fitted lines preserve their font height. Modern corners
use a 0.045 radius in card widths; historical corners retain 0.058. The Canvas
and GPU policies agree, including art/finish apertures.

Normalized inspect art edge F1 medians improve: WAR .400→.766, M15 .473→.835,
M19 .492→.855, M20 .425→.718 and M21 .554→.838. There are 165 gains above .02
and no inspect art regressions. Type medians improve in all five sets; M20
Skyknight Vanguard retains a small inspect regression. These are component
overlap scores, not percentages of total card fidelity. The reports retain
raw scores, both raster tiers and all regressions.

The 1.5px horizontal frame inset preserves height and is enabled only for the
four measured sets WAR/M15/M19/M20. M21 rejects it: its rules paper is wider in
the reference cohort. Unknown sets keep the existing panel width pending the
release-era study. Do not infer a universal historical cutoff from M21 alone.
Land split-color frames and several colored bevels still regress in border
strips; retain these as asset/geometry review items, rather than hiding them
behind the improving median.

`normal-window-study.mjs SET capture` captures the current painter; omit
`capture` for CPU-only re-scoring. `baseline PATH_TO_BASELINE_CHECKOUT` renders
the frozen v54 baseline with a required source hash. `window-geometry.mjs`
measures paired edges and separates width errors from translation. Tests cover
known translations, changed widths, tone/grain and absent edges.

The [Revised](fixtures/accuracy/old-window-3ed-measurement.json),
[Mirage](fixtures/accuracy/old-window-mir-measurement.json) and
[Tempest](fixtures/accuracy/old-window-tmp-measurement.json) audits cover another
61 cards without changing their rendering. They retain raw and existing frozen
set/frame transforms. Unreviewed type wording is explicitly uncertified:
Blue Elemental Blast still has `Instant` in the capture input while its scan
says `Interrupt`. Type overlap cannot certify typography until this source
mismatch is corrected. Zombie Mob, Steal Enchantment and Selenia expose body
font/line-break differences; old art borders also need separate left/right
inspection. Reproduce with `old-window-audit.mjs SET capture`.

### Recent-set transfer and shared scan scale

The release-era survey caches 267 high-resolution references and matching art
crops across M15, WAR, M19, M20, IKO, M21, ZNR, MID, DMU, WOE, FDN and TDM.
Selection is deterministic: the first three eligible ordinary nonlegendary
cards per material/color bucket. This is a diagnostic sample, not a full-set
census. Reports retain rejected/ambiguous edges and the source inventory.
TDM has only five eligible high-resolution references in this snapshot; 242
otherwise queried references fail the quality gate. It cannot support a
balanced scale estimate yet.

`scan-scale.mjs` adds one uniform factor per set/normal-frame group, measured
against the previously frozen WAR baseline frame template. The first two
U/B/R/G cards per color calibrate opposing outer rails; the third validates.
At least six calibration cards across three colors and two validation cards
are required. A separate vertical span checks the uniform-scale hypothesis;
it does not choose the scale. Missing anchors, excessive spread, an out-of-range
scale or disagreement between horizontal and vertical geometry rejects the
fit. Text, mana, set symbols and horizontal art/rules-box widths never fit it.
These previously inspected references are validation samples, not blind holdouts.

Accepted factors include IKO 1.00046, M21 1.00007, ZNR 1.00001, MID 1.00099,
WOE 1.00408 and FDN 1.00436. M15 and M19 also accept small corrections.
WAR, M20 and DMU fail the vertical consistency check and retain unit scale.
TDM lacks enough anchors. Each card then uses the existing independent bounded
translation detector; uncertain axes stay at zero. The final transform is
applied to the source PNG in one resampling pass. No per-card scale, rotation
fit, anisotropic stretch or component warp is allowed by this experiment.
The raw images and raw scores remain available.

The roughly 0.4% WOE/FDN corrections account for almost two pixels of outer
frame width, but do not explain all window differences. For example, median
art widths in the balanced U/B/R/G samples are approximately 414.3px for IKO,
415.8px for M21, 415.9px for ZNR, 414.2px for MID and 413.6–413.7px for WOE/FDN
after their accepted shared scales (488×680 comparison grid). The later sets
do not support one permanent M21 cutoff. Reference cropping, digitization,
frame assets and physical printing differences are not yet separated enough
to claim a manufacturing change. White, artifact, gold and land bevels remain
separate diagnostic buckets because strong neighboring transitions can
confuse their edge measurements.

The exact v54 baseline and v55 painter were captured for 72 additional cards:
12 U/B/R/G cards each in IKO, ZNR, MID, DMU, WOE and FDN. All 72 improve art-edge
F1 by more than .02 at both inspect and table tiers after accepted normalization;
there are no art regressions. Inspect medians:

| Set | Before | Current |
| --- | -----: | ------: |
| IKO |   .496 |    .854 |
| ZNR |   .459 |    .837 |
| MID |   .493 |    .790 |
| DMU |   .589 |    .797 |
| WOE |   .419 |    .767 |
| FDN |   .438 |    .743 |

These are border-overlap scores, not whole-card accuracy percentages. The rules
frame remains unchanged in these six sets. Their symbols and original wording
have not been certified, so this study deliberately does not score typography.
Each `window-era-SET-render-measurement.json` retains both raster tiers, raw and
normalized scores, source hashes, individual transforms and every result.
Earlier v55 reports keep their original translation-only results; this study
does not rewrite earlier evidence under a different normalization policy.

Reproduce the geometry survey with
`node games/magic/tools/accuracy/window-era-study.mjs fetch` (cache downloads)
and `compare` (CPU only). Optional set codes follow either command. Render
with `window-era-render.mjs capture`, generate controls with
`window-era-render.mjs baseline PATH_TO_CLEAN_V54_CHECKOUT`, then run
`window-era-render.mjs compare`. Capturing uses Chromium once per revision;
geometry and edge comparisons use Node on cached PNGs, with no GPU or browser.
The local review page includes raw, translation-only and shared-scale overlays;
the page and downloaded imagery remain outside the tracked repository.
