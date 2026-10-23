# Completing a set calibration

The [progress ledger](fixtures/accuracy/calibration-progress.json) is the source of
truth for completion. It covers the frozen 272-major-set inventory and keeps an
explicit denominator for each frame/color/layout variant. The initial batch is
Alpha, Beta, Unlimited, Revised, Eighth, M21, Arabian Nights, Antiquities, The Dark,
and Legends. Fallen Empires, Fourth Edition and Chronicles form the next grouped
release. Other sets remain queued. A profile existing in the renderer does
not mean that its set, or even its entire frame, has been calibrated.

[Version 0.4.2](https://github.com/vishvananda/card-glint/releases/tag/v0.4.2)
publishes the early-expansion frame/color batch and the ordinary M21 black
pigment fit at commit `fd52ddf008c7afea8b17cee658a7da3356425d3e`. Both main and
release CI passed; package, browser archive and immutable CDN assets are
published. This is a partial calibration checkpoint. Local scan templates and
diagnostic scores are not automatically deployed to a review service, and the
ledger's complete-set release checks remain open.

The early-reprint group now has integrated frame/color, original-mana and heading
candidates. [Title evidence](fixtures/accuracy/early-reprint-title.json) covers
690 native renders and 683 accepted scan comparisons. Names use filled gray
Goudy lettering with a dark shadow; both wording modes share the printing style.
The repeated-validation title index improves as follows:

| Set            | Printings | Before | After | Regressions |
| -------------- | --------: | -----: | ----: | ----------: |
| Fallen Empires |        89 |  0.285 | 0.622 |           0 |
| Fourth Edition |       315 |  0.469 | 0.641 |          53 |
| Chronicles     |        66 |  0.308 | 0.578 |           1 |

These are regional similarity indexes, balanced by material and distinct name,
not whole-card correctness percentages or a fresh holdout. Both comparison crops
improve on average in every frame/color group. The evidence retains all regressions,
seven rejected scan poses and a separate Fourth Edition ink/geometry diagnostic.
Most Fourth Edition regressions involve placement; the evidence does not establish
whether the remaining offsets come from normalization or printing variation.
There are no per-card title offsets. Other text, expansion symbols, final
whole-card review and publication remain part of the grouped release work.

The [type-line evidence](fixtures/accuracy/early-reprint-type.json) adds 690 exact
native replays and 683 scan comparisons, using filled MPlantin strokes and the
existing frame registrations. Fourth Edition lands now share the other materials'
absolute type-line origin. Reused-validation type indexes rise from 0.525 to 0.772
for Fallen Empires, 0.409 to 0.802 for Fourth Edition, and 0.383 to 0.752 for
Chronicles. Every material improves on average in both crops. One training and
six validation regressions remain visible, with the latter all on Chronicles gold
cards. A separate gold-profile experiment did little to resolve that cluster, so
the shared set profile is retained. These results do not close the remaining
heading outliers or the overall set review.

The [original-wording catalog](fixtures/accuracy/early-reprint-wording.json) now
includes 690 reviewed type lines, 27 additional rules/flavor entries, three printed
artist credits and Fourth Edition Drain Life's original cost. The public resolvers
reproduce the 690 original calibration inputs, preserve 37 earlier body reviews
and leave Oracle wording unchanged. This validates the supplied text, not its
typography; most rules still come from the caller's printing-specific provider data.

The [footer evidence](fixtures/accuracy/early-reprint-footer.json) adds shared
artist, copyright and power/toughness profiles for the same three sets. Credits
use filled MPlantin ink with a separate shadow; copyright uses light or dark ink
according to the printed material. Explicit host visibility, translation, legal
text and stats-ink controls still apply. The exact-printing catalog adds 61 artist
corrections and Chronicles Sentinel's original `1/*`, preserving Oracle `1/1`.
All 690 credits and all 333 printed power/toughness expressions were reviewed.

Combined-footer reused-validation indexes improve as follows. These are regional
similarities on fixed scan poses, not whole-card compliance percentages.

| Set            | Artist        | Copyright     | Power/toughness |
| -------------- | ------------- | ------------- | --------------- |
| Fallen Empires | 0.302 → 0.738 | 0.398 → 0.799 | 0.341 → 0.854   |
| Fourth Edition | 0.422 → 0.740 | 0.571 → 0.775 | 0.764 → 0.871   |
| Chronicles     | 0.290 → 0.694 | 0.246 → 0.726 | 0.321 → 0.836   |

All material means improve in both crops. The evidence retains 18 regional
regressions: four Thallid stats, eleven Fourth Edition stats, Fourth Edition
Leviathan's credit and two Chronicles gold stats. Thallid's printed stats sit
farther left than the shared profile; no per-card position was added. A separate
gold-stats profile gave too little improvement to justify another default.
All 690 full native renders match the independent footer prototype, including
the seven cards excluded from scan scoring; 98 unrelated cards are unchanged.
Rules/flavor, expansion symbols and final set review remain open in this release
batch.

[Version 0.4.3](https://github.com/vishvananda/card-glint/releases/tag/v0.4.3)
publishes the M21 stock-coverage correction and refined comparison evidence at
commit `862e34605ee18b0e77fa9c3497a86ca1118cdd10`. Release CI passed and the package,
browser archive and immutable CDN assets are published. The stock extension and
231 accepted comparison poses are described below; no additional pigment
candidates are included. This remains a partial set-calibration checkpoint.

Run `npm run magic:calibration:report` for the active-set summary, or
`npm run magic:calibration:report -- m21` for that set's unresolved variant checks.
Add `--json` for machine-readable status. The report checks source-file guards
and marks changed evidence stale without rewriting the stored receipt.

## Required work, in order

1. **Inventory and references.** Include every ordinary printing, all colors,
   basic/nonbasic lands, legendary treatments, artifacts, special layouts,
   stamps, rarities and reference finishes. Verify scan/art bytes, printing wording, artist and
   footer data. Keep missing, rejected and foil-only references visible.
2. **Normalize scans.** Freeze independent frame translation, scale, rotation
   and skew before measuring components. Record confidence and rejected cases.
   Per-card scan normalization is comparison data, never a rendering override.
3. **Frame sources and geometry.** Choose the asset family first. Fit stock and
   corners, art aperture, panels, borders, crowns and bevels. Review every distinct
   treatment; a normal creature does not certify a legendary land or planeswalker.
4. **Frame and paper colors.** Fit shared set/material pigment, contrast and
   gradients on ink-free regions. Measure interior ink and outer stock separately.
   Recheck masks and seams, and preserve Alpha/Beta's separate outer-stock policy.
5. **Mana and expansion symbols.** Check glyph version, order, disc and glyph
   sizes, generic numbers, position, spacing, colors, shadows, rarity gradients
   and outlines. Sample each applicable rarity and palette. Color targets alone
   do not certify geometry.
6. **Typography and lower components.** Fit headings, rules, flavor/dividers and
   attributions, illustrator, copyright/collector information, and stats. Verify
   original wording before text scores; preserve Oracle as a separate mode.
   Check basic-land glyphs, stamps, loyalty, chapters and other layout components.
7. **Native replay and review.** Render every in-scope printing, align the frozen
   references, store regional and full-card scores, and inspect outliers and
   overlays. Check art isolation and unrelated-frame regressions. Shared fits
   need independent names; sparse groups need an explicit family-transfer study.
8. **Release.** Run renderer/package/browser/showcase checks. Publish the renderer
   and record its revision with the corresponding scores. Local candidates and
   old-version scores do not close this check. Bundle several reviewed calibration
   changes into a release; a single component fit does not require its own version.
   Keep per-component evidence and unresolved outliers visible within the batch.

The machine ledger splits these into 18 checks so frame/paper colors, mana
geometry/colors, and the different text regions cannot conceal one another.
Rarities are counted within a variant; a set-symbol check must cover them all.
Foil-only printings have a separate reference queue and cannot be used as
nonfoil color targets. Their presence must never silently shrink the denominator.

## Evidence and states

- `pending`: no fit/evidence attached to this scope yet.
- `needs-audit`: earlier work exists or may apply, but its current source and full
  variant coverage have not been verified. It is not a claim that no work was done.
- `in-progress` / `partial`: work underway or only part of a check is supported.
- `rejected`: a proposal failed its frozen gates; the prior/default renderer stays.
- `needs-reference` / `needs-asset`: record the specific missing input and next action.
- `stale`: a source, geometry, guarded implementation, or printing scope changed.
- `validated`: source-bound measurements and native replay pass for this scope.
- `validated-default`: the unchanged source was measured and accepted. An absent
  override is insufficient evidence.
- `not-applicable`: explicitly justified by this variant's contents.

Validated entries record source, renderer, method, normalization, native replay
and metric identities; printing coverage; calibration/validation name counts;
and whether validation is fresh, reused development data or family transfer.
Retain the receipt and its limitations. Do not relabel reused scans as a fresh
test or tune individual renderings to their scans. Full-card completion also
requires an outlier disposition, not merely an improved average.

Refresh the cached inventory with `npm run magic:calibration:inventory` after
reviewing the rollout catalog. This command is offline and fails on a catalog
identity mismatch. Set `MAGIC_ACCURACY_CACHE` when using a shared cache. Deliberate
task reviews carry `reviewedAt` and survive refreshes; changed source identities
make their proofs stale. Add new receipts to the inventory importer as batches
are finished, so regeneration preserves their provenance.

## Current gap-closing order

1. Repair the showcased-set color-study windows and replay rejected fits against
   current sources. Keep raw defaults where proposals fail. Revalidate historical
   mana defaults separately from missing targets.
2. Finish Alpha/Beta/Unlimited/Revised land, Eighth black/red/artifact/land, and
   M21 white/black/multicolor/land/planeswalker material coverage. Validate shared
   M21-era legendary-land treatments using sets which actually contain them;
   the M21 set itself contains no legendary lands.
3. Close ARN/ATQ/DRK's remaining frame/reference and color cases, then headings,
   symbols, original wording, rules, artist, stats and black levels. Their 26
   accepted component-color fits are already linked in the ledger. Keep the
   Legends stock/source work as a regression control.
4. Continue the pre-Eighth chronological batches (Fallen Empires, Fourth,
   Chronicles next), then newer frames. Use the same checklist for each batch,
   including validated shared defaults and explicit exceptions.

The historic major-set audit's `complete` field means that its sampled audit
finished. It must not be used as this ledger's set-completion flag.

The [initial color-gap study](fixtures/accuracy/showcased-color-gap-review.json)
is retained as historical evidence. M21's old color sampling windows overlapped
the black art keyline; fixed clear-rail windows now separate pigment from geometry.
White and Beta green candidates remain rejected. Other historical M21 outer-frame
pigment fits need this audit too; paper fits are independent.

The [M21 black adoption](fixtures/accuracy/m21-normal-color-adoption.json) closes
the ordinary nonlegendary black-frame pigment gap where scan registration passes.
All 292 nonfoil printings were rendered: 40 change, 252 stay byte-identical, and
central artwork, rules-box paper and outer-stock targets remain unchanged. The
39 measured black cards improve median rail-color error from 2.14 to 1.43;
reserved names improve from 2.15 to 1.79. These are regional color distances,
not whole-card accuracy percentages. All cohorts reuse development references.

The [boundary receipt](fixtures/accuracy/m21-normal-boundaries.json) stores
independent scan-only scale/translation/rotation/skew transforms, reference
hashes and frozen templates. It accepts 81 of 82 ordinary white/black scans and
passes all 20 known-pose tests with a maximum residual of 0.19 canonical pixels.
Peer into the Abyss and Crypt Lurker now pass; Liliana's Scorn still fails
independent right-frame support. Its shared rendering changes but its color and
normalization checks remain partial. These templates are local evidence until
installed in the review service. Colored artifacts, legendary crowns and
planeswalkers remain separate gaps. Full-card, typography and release checks
remain open; this is not complete-set certification.

The [mono-color extension](fixtures/accuracy/m21-mono-boundaries.json) keeps the
white/black templates and poses identical and adds 41 blue and 41 green scans
with passing method checks. Across all five colors, 205/206 scans pass boundary
consistency, but only 163 are validated: red's known scale/skew recovery misses
the fixed 0.30-pixel limit in two tests (0.35 pixels). Its 42 apparently consistent
scan poses remain rejected until the method improves. Passing real-scan
correlations alone cannot close normalization. The independent test result is
48/50, with 10/10 passing separately for white, blue, black and green.

The [existing-pigment audit](fixtures/accuracy/m21-existing-pigment-audit.json)
remeasures blue, red and green in the corrected rail windows. Blue still needs a
shared refit: its median error is 6.26 and 36 of 41 references exceed 5. Green's
unchanged source passes aggregate gates, but five absolute outliers and visible
hue/texture differences keep its task open. Red's diagnostics remain unvalidated
until its normalization method passes. No new rendering values are adopted by
this audit, and no scan is excluded merely for having an inconvenient color.

The [refined boundary study](fixtures/accuracy/m21-component-boundaries-v2.json)
supersedes those comparison poses. Cubic edge-profile interpolation and finer
fitting steps pass all 80 known-transform tests, including the previously failing
red and dual-land cases; the worst residual is 0.22 canonical pixels. The mono-color
templates, cohorts, acceptance thresholds and disjoint checking strips stay frozen.
The study validates 231 of 239 scans: all 42 red cards now pass, alongside 26 of
33 lands. Liliana's Scorn, Blossoming Sands, Fabled Passage, Temple of Triumph,
Wind-Scarred Crag and three Plains scans remain rejected. These local comparison
transforms do not change renderer geometry or replace historical color scores.
Color proposals must be rescored against the refined poses before adoption.

The [stock coverage receipt](fixtures/accuracy/modern-land-stock-transfer.json)
extends the existing M21 outer-border target to 33 lands and 12 two-color cards.
Native replay checks all 292 nonfoil M21 printings plus 13 actual legendary lands
from other sets: 45 change and 260 remain pixel-identical. Thirteen synthetic
M21-style legendary-land controls check the composition path separately; they do
not establish an M21 legendary-land reference cohort. All 645 selector controls
preserve pigment and mana settings. Central art, paper and silhouette alpha stay
identical; translucent component edges can change by one RGB byte as the stock
underneath them changes.

On 26 accepted land scans, the median regional stock error falls from 10.67 to
0.00 RGB byte units. This measures three flat-border color medians, not texture
or whole-card accuracy; a zero here does not mean a perfect card. Seven rejected
poses are excluded from that metric and retained in the ledger. Interior ink,
land paper/gradients, crowns, typography, foil-only references and full-card scores
remain open. The black-level task stays partial until its interior-ink obligation
is met.

The [white-source review](fixtures/accuracy/m21-white-default.json) validates the
unchanged ordinary M21 white-frame pigment. All 42 references have accepted
normalization and native replay. Their largest regional color distance is 2.87;
every one of ten ordered texture-bin colors is within 3.80, below the existing
5-unit absolute color tolerance. Eight calibration and twelve reserved names
remain separate. The three largest regional differences were visually reviewed.
An extra color curve made reserved cards worse, so this is a measured
`validated-default`, with no new rendering coefficients. Paper/plates, texture
frequency, geometry, crowns and typography remain open; this does not certify
the complete white card treatment.

The [M21 wording audit](fixtures/accuracy/m21-original-wording.json) supplies
original rules to all 292 ordinary nonfoil inputs: 287 exact-printing MTGJSON
records and five scan-reviewed empty bodies. The earlier land color comparison
accidentally used Oracle fallback despite its original-mode flag. Both released
renderers have now replayed all 33 lands with original wording. Every sampled
stock/frame pixel and central-art pixel is unchanged, so those regional color
measurements remain valid with their original provenance. They were never
original-text scores. The refreshed comparison uses these new original inputs.

Use `calibrationPresentation` from `tools/accuracy/calibration-wording.mjs` when
preparing original-text calibration inputs. It rejects missing original rules
and paragraphs that disagree with their source; setting `wordingMode` alone is
insufficient. Each rules task records input coverage separately from alignment
approval. Original type lines, flavor formatting and MTGJSON transcription
outliers still require their own review. No typography task is closed by this
input audit.

The [early-expansion wording audit](fixtures/accuracy/early-expansion-original-wording.json)
provides original inputs for all 316 ordinary Arabian Nights, Antiquities and
The Dark printings. Every type line was read from its exact scan; 215 differ from
the previous Oracle-based inputs. Rules use 309 exact-printing MTGJSON records
and seven newly transcribed scan bodies where the provider has no original entry.
These field corrections are also exposed by `resolvePrintingWording`; Oracle
wording is preserved. The ledger records rules and type-line input readiness
separately from typography approval. Flavor formatting, source transcription
outliers, names, artist/footer data and placement still need review. The existing
282-card diagnostic scores retain their original excluded type regions and do
not become typography evidence retroactively. All 34 unresolved scan poses stay
in the denominator.

[Version 0.4.5](https://github.com/vishvananda/card-glint/releases/tag/v0.4.5)
publishes this wording batch and PR #3's liquid-surface controls at commit
`b1d3705d057adbb6611ccc58681e8f4dff27bdec`. Main and release CI passed. The
downloaded package, browser archive and release metadata match `SHA256SUMS`;
the immutable `cdn-v0.4.5` build reports the same source commit and archive hashes.
This release does not close the ledger's complete-set certification checks.
The corrected 316-card native replay
preserves every pixel outside type/rules/flavor regions. Arabian Nights Mountain
retains its red palette when the type becomes `Land`; Goblin Caves and Goblin
Shrine retain enchantment frames for `Enchant Land`. Explicit frame palettes
also survive wording changes. The [compatibility receipt](fixtures/accuracy/early-expansion-wording-frame-compatibility.json)
preserves the three failed first-pass renders as evidence, checks all 316
historical and original-input frame/material selectors, and regenerates all
292 M21 inputs byte-for-byte unchanged. This clears the wording regressions;
unsupported frame materials, text fitting and the 34 unresolved scan poses
remain open.

The [original-wording text pilot](fixtures/accuracy/early-expansion-text-pilot.json)
fits 18 existing development names, six per early-expansion set, using the
previous Alpha search objective and frozen scan-only rasters. Each untouched
layout and raster replays exactly; every fitted raster preserves all pixels
outside the text region. Comparing native alignment with an explicit centered
layout raises the mean development text index from 0.397 to 0.567. Five cards
prefer the centered hypothesis, and four selected fits reach a search boundary.
These are best-of-two development results, not reserved-name measurements or
new runtime defaults. Centered margins cannot establish shared left/right
insets. The next fit covers the remaining development names before deriving
shared rules and testing untouched names; all 34 unresolved scan poses remain
excluded from fitting and present in the denominator.

The pilot also records 18 visually read illustrator credits. These ARN/ATQ
examples print `Illus. ©` without a year; the six DRK examples include `1994`.
All artist names match their provider metadata, but the renderer's fallback
credit lacks the printed copyright prefix and uses different geometry. This
is wording evidence only. Aladdin's Lamp additionally needs its original two
`5` cost numerals and the disc around the inline `X`; those are separate from
the text-fit parameters.

The [complete footer wording review](fixtures/accuracy/early-expansion-footer-wording.json)
extends that inspection to all 316 ARN/ATQ/DRK printings, including the 34 whose
scan geometry remains rejected. ARN and ATQ print `Illus. ©` without a year;
DRK adds `1994`. Nineteen printed artist strings differ from canonical metadata:
six ARN credits omit the comma in Ken Meyer Jr.; four Factory credits use
Kaja & Phil Foglio; Hurkyl's Recall uses Néné Thomas; Shatterstorm credits Mark
Poole; and seven DRK cards print Denise Detwiler. These are printing-specific
strings, not corrections to the artists' canonical identities. Geometry, ink,
font and spacing remain a separate fitting task. The 19 spelling/attribution
exceptions are now included in the public artist resolver and accuracy adapter;
no rejected scan pose is certified by this wording review.

The [shared text candidate study](fixtures/accuracy/early-expansion-shared-text.json)
uses 79 development names to select one layout per set, then freezes those values
for 189 reserved printings. Regional text indices improve from 0.424 to 0.540
on ARN, 0.408 to 0.556 on ATQ, and 0.396 to 0.481 on DRK. Every candidate fits
within the panel and preserves pixels outside the rules/flavor region. These
are candidate diagnostics against the 0.4.5 source baseline, not adopted defaults
or whole-card accuracy. Nineteen reserved printings regress by more than 0.05;
the smaller printed type-size class still needs modeling. ATQ's development
passages are too long to establish its short-text centering cutoff.

Visual review also found [two DRK source outliers](fixtures/accuracy/drk/annotations-text-outliers.json):
Carnivorous Plant has no printed rules, despite MTGJSON's `originalText` saying
Defender; Hidden Path's flavor attribution is inline. The public resolver now
preserves those original forms without changing Oracle wording. The historical
candidate scores retain the incorrect input and expose it as a limitation;
refresh those inputs before the next fitting/replay pass. Renderer adoption,
illustrator geometry, native full-set replay and release remain open.

The [corrected-input replay](fixtures/accuracy/early-expansion-corrected-inputs.json)
now renders all 316 cards with those reviewed corrections. Exactly 21 renders
change: 19 artist credits and two text bodies. Every pixel outside the affected
regions remains identical to the preserved baseline. Original-input readiness
is current again; the shared typography study above still uses its original
historical inputs. A separate smaller-type-size trial uses the new baseline.

The [M21 input compatibility check](fixtures/accuracy/m21-original-input-compatibility.json)
also repeats all 292 original inputs with their printing-source records and
reviewed annotations. They remain identical. This extends input readiness;
it does not relabel the existing native images or scores as a new measurement.

The [compact-size trial](fixtures/accuracy/early-expansion-compact-text.json)
uses that corrected baseline and the same 79 development names. Its shared
per-set size classes improve 166 of 189 reserved printings with no overflow.
Reserved mean text indices are ARN 0.424 → 0.546, ATQ 0.408 → 0.560, and
DRK 0.395 → 0.511. These remain regional measurements, not whole-card accuracy.
Visual checks show better dense text on Guardian Beast, Old Man of the Sea,
Tetravus and Wand of Ith. Sixteen regressions greater than 0.05 remain, including
eleven in DRK; Candelabra of Tawnos still needs the sparse-text centering rule.
Keep these candidates provisional while refining shared size/centering rules
and fitting artist-credit placement and lettering. No per-card text defaults
or scan-pose changes were adopted.

A [width/leading refinement](fixtures/accuracy/early-expansion-width-text.json)
retains the same compact candidate for ARN and ATQ. The DRK training winner
widens the panel four pixels and reduces leading, but its 71 reserved printings
fall from 0.511 to 0.494. Forty-three worsen relative to the prior candidate;
twenty-six improve. Reject that refinement rather than adopting the training
gain. Neither text study has changed runtime defaults.

A separate [em-dash diagnostic](fixtures/accuracy/early-expansion-dash-text.json)
identifies an unbreakable-token problem: `creature—comes` forces Rukh Egg into
the compact size class. Allowing a break after the inline dash restores regular
type and improves its two text indices from 0.393/0.395 to 0.627/0.623. Banshee
improves from 0.371 to 0.619, matching its printed three-line rules paragraph;
Scavenger Folk remains byte-identical. Wording, shared layout parameters and
scan poses are fixed, and pixels outside text do not change. This private
prototype uses previously inspected examples; it is not independent validation
or a released renderer change. Test style boundaries and broad layout behavior
before adoption. Rukh Egg's printed discretionary hyphen in `ex-actly`, residual
font weight and sparse-text centering remain separate review items.

The [native dash integration](fixtures/accuracy/early-expansion-dash-native.json)
extends that rule across style-run boundaries and tests attribution prefixes,
inline symbols, explicit newlines, unused-break shaping and soft hyphens. Its
316-card replay changes only the two Rukh Egg printings and Goblin Shrine;
313 cards remain byte-identical, as do all pixels outside body text. The two
accepted Rukh Egg references improve from 0.485/0.485 to 0.504/0.501 under the
text-fit objective. The larger prototype gains above also require the proposed
shared typography, which was unadopted at that stage. Goblin Shrine's pose remains
rejected and unscored. No set-wide text-calibration approval follows from this
wrapping fix; historical 0.4.6 measurements remain separately identified.

The [font-proportion study](fixtures/accuracy/early-expansion-text-proportions.json)
keeps mana discs round while measuring letter width independently. Stable size
classes improve the reused reserved sample to ARN 0.570 and ATQ 0.597; DRK keeps
its earlier candidate at 0.515 because the new proportions regress there. These
were private candidates at this stage, not independent validation. Runtime
adoption follows below.
Thirteen regressions greater than 0.05 remain across 189 reserved printings.
The [short ATQ review](fixtures/accuracy/atq/short-text-review.json) supports
large centered flavor on Candelabra, while the next longer passages stay left
aligned. The 130-character gate remains a shared hypothesis, not a proven
historical typesetting formula.

Before final typography adoption, seven original inputs receive exact-printing
corrections: [Rukh Egg](fixtures/accuracy/arn/annotations-text-outliers.json)
allows the printed `ex-actly` break; [Mishra's Factory and Candelabra](fixtures/accuracy/atq/annotations-text-outliers.json)
retain the final `Assem-bly` break, printed apostrophe, and missing activation
colon respectively. Soft hyphens permit wrapping without forcing a line.
The public resolver preserves Oracle wording and records scan provenance.
Recheck candidates against these corrected inputs on both sides. The scans
also show uncircled generic activation costs; review that broader symbol-style
policy before treating body text calibration as complete.

The [native typography adoption](fixtures/accuracy/early-expansion-text-runtime.json)
replays the retained shared settings with those corrected original inputs on
both sides. All 316 cards render and every pixel outside body text is unchanged;
all 282 accepted comparisons match the private candidate painter exactly. The
default-width wrapper remains identical on every input, and Oracle text fits
under all three alignment modes. Mean regional text indices improve from
0.421 to 0.592 for ARN, 0.415 to 0.604 for ATQ, and 0.393 to 0.514 for DRK.
There are 256 improvements and 17 regressions greater than 0.05; 34 rejected
poses remain unscored. Reserved examples have been inspected repeatedly and
are not independent validation. The ledger keeps rules and flavor partial.

Version 0.4.7 includes these shared defaults and the original-text corrections.
Review Gaea's Touch for narrower wrapping, Bog Imp and Sunken City for short
heading/vertical placement, King Suleiman for quotation formatting, and
Transmute Artifact for compact-text placement. Investigate shared frame/color
insets and source-style rules before introducing any printing-specific layout.
The [input compatibility extension](fixtures/accuracy/early-expansion-break-inputs.json)
proves that the new reviews change only seven bodies, preserve all unrelated
face fields, and leave all 292 M21 adapter outputs identical.

Fresh [whole-card scores](fixtures/accuracy/early-expansion-text-scores.json)
increase the existing structural aggregate from 0.652 to 0.702 for ARN,
0.634 to 0.692 for ATQ, and 0.645 to 0.681 for DRK. The separately labeled
reviewed-credit aggregation improves too. Frame scoring strips overlap body
ink on 220 cards, so their score changes do not demonstrate a frame-geometry
change; native pixels outside text remain identical. Isolate those strips from
rules ink in a new metric revision and rescore both sides before using the
frame component to judge geometry independently. Hosted charts have not
adopted these local development scores or their reviewed-credit policy.

The [Dark short-text follow-up](fixtures/accuracy/early-expansion-dark-short-text.json)
uses a narrower centered block and a shared line-count optical offset. Against
identical corrected wording and fixed scan poses, all 17 affected scored cards
improve and 80 remain unchanged: mean text-fit index 0.520 → 0.577. The 316-card
native replay preserves every non-body pixel and every ARN/ATQ face. Oracle
fitting covers all three alignment choices. These repeatedly inspected scans
remain development references, not independent validation.

The [five-body wording receipt](fixtures/accuracy/early-expansion-followup-wording.json)
isolates activation punctuation and inline flavor attributions on Drowned,
Miracle Worker, Marsh Gas, Grave Robbers and Brothers of Fire. Other fields and
all 292 M21 adapter outputs remain exact. Font weight, historical activation
symbol style, Electric Eel punctuation and regular-text outliers such as Drowned
still need review. The 34 unresolved poses remain unscored. Full-card aggregates
for DRK are marked historical until they are recomputed with frame regions that
do not include rules ink. This batch is included in 0.4.8; rules/flavor stay partial.

The [red-frame boundary extension](fixtures/accuracy/early-expansion-boundary-normalization.json)
adds comparison poses for seven Antiquities and seventeen The Dark scans. It fits
the art-box outline and checks the rules box independently, so a misplaced panel
cannot help choose the scan transform. All 240 known-pose probes for the accepted
scans recover within 0.286 canonical pixels; replacing their art and rules text
does not change the fits. All 52 negative controls reject missing outlines or a
two-pixel rules-box displacement. The earlier joint-box fit failed that last
test and is not adopted.

Coverage increases from 282 to 306 of 316 printings. Ball Lightning and one Atog
scan fail the fixed recovery gate and join the eight other unresolved references.
This qualifies those 24 scans individually, not every scan of these frame types.
The new manifest preserves all previous accepted poses and historical scores;
rasters use the tested canonical-resize-then-affine path. Renderer defaults and
hosted review templates are unchanged. Red source/geometry and color fitting are
next; outer-stock/corner certification and complete-set checks remain open.

The [red-frame integration](fixtures/accuracy/early-expansion-red-frame.json)
uses those 24 qualified poses to compare ABU, Fourth and Seventh assets on
identical opaque regions. Fourth wins for both Antiquities and The Dark, including
the reserved geometry and texture checks. Shared set/color transforms replace
the previous geometry; separate frame and paper adjustments preserve texture
contrast and keep the illustration unchanged.

On reserved names, native frame-boundary correlation improves from -0.011 to
0.930 for Antiquities and from 0.039 to 0.962 for The Dark. Frame color distance
falls from 8.37 to 1.50 and from 6.27 to 2.88 respectively; paper distance falls
from 11.22 to 1.10 and from 9.22 to 2.14. These regional diagnostics measure
different properties and are not full-card accuracy percentages. All four native
color components pass the color, contrast, clipping and prediction checks.

The 316-card native replay changes only the 26 intended red printings, preserves
all text layouts and leaves the other 290 faces pixel-identical. Ball Lightning
and the rejected Atog printing receive shared defaults but never influence the
fit or scores. Existing profile bytes are preserved by an exact two-key extension
proof. This batch targets 0.4.9. Red headings, mana, set symbols and lower details
still need calibration; outer-stock/corner checks, fresh full-card aggregates and
hosted template updates remain open.

The [artist integration](fixtures/accuracy/early-expansion-artist.json) adopts
shared MPlantin credit geometry and edge lettering for ARN, ATQ and DRK, including
the reviewed copyright prefix/year. All 316 cards render; 268 match the fitting
painter exactly. Every pixel outside the artist region is unchanged. Artist
overlap improves on all 282 accepted scans and all 189 reserved study printings.
The 34 unresolved poses remain unscored. Artist task approval is recorded per
variant only where its full printing scope has accepted measurements.

Fresh [whole-card diagnostics](fixtures/accuracy/early-expansion-artist-scores.json)
retain the older aggregate alongside a separately named, reviewed-credit
aggregation. The older client policy excludes legal credits, so its aggregate
does not change when only the artist region improves. With those reviewed
credits included on both sides, structural overlap changes from 0.646 to 0.656
for ARN, 0.628 to 0.638 for ATQ, and 0.638 to 0.650 for DRK. These are similarity
indices, not percentages of correctness. Carry the exact printing-credit proof
through client/server score validation before using this aggregation in hosted
charts; do not mix it with the old eligibility policy.

The [ordinary red adoption](fixtures/accuracy/m21-red-color-adoption.json)
measures all 42 ordinary red M21 printings against the refined scan-only poses.
One curve fitted on seven names passes every regional color/texture gate for
ten reserved and twenty-five additional names. Median rail-color error improves
from 3.22 to 1.50; reserved names improve from 3.78 to 2.34. The native replay uses
original rules in both revisions for all 292 nonfoil cards: 42 change and 250
stay identical. Central art/paper, outer stock and silhouette alpha are unchanged.
All 645 selector probes preserve mana and stock, and 601 unrelated material
configurations are identical. Separate ordinary profiles retain the existing
crown and paper adjustments. These are regional pigment results, not complete
card certification. [Version 0.4.4](https://github.com/vishvananda/card-glint/releases/tag/v0.4.4)
publishes this curve and the original-wording input guard at commit
`5a5e7fc7c5f87458dac5f6164ce003b2507d873f`. Release CI passed; package and browser
checksums match the release manifest, and immutable CDN assets are published.
Complete-set checks remain open.

Chandra's Firemaw has the largest remaining red pigment error (3.90) and a visible
reference tint difference. It stays in the printing-batch/reference review queue.
Fiery Emancipation is the largest accepted regression (1.18); Unleash Fury is the
largest improvement. Blue and green candidates remain rejected by shadow or
contrast gates. Previously stale historical audits are retained as stale rather
than advanced through an unproven compatibility chain.

The [Dark land/gold extension](fixtures/accuracy/early-expansion-dark-frames.json)
adds the seven previously excluded materials to frame/color coverage. Scan-only
affine normalization passes all 18 directed same-material comparisons and
independent synthetic recovery checks. Source geometry was selected before
component color fitting; the original two/two land and one/two gold
training/reserved groups remain fixed. All seven native candidates improve
boundary and color diagnostics. The 316-card replay changes exactly those seven
cards, matches every prototype, and preserves 309 other faces plus 84 unrelated
printing controls. Existing source proofs are reconstructed without relabeling
historical scores. The ledger keeps these small cohorts partial: title, type,
rules, mana/set symbols, artist and stats still need review, and land bevel and
thin outer-outline differences remain visible. No hosted scores were uploaded.

The [Dark typography transfer](fixtures/accuracy/early-expansion-dark-typography.json)
extends the existing set title, artist and power/toughness profiles to those
seven cards without fitting new values. All seven improve on fixed original
inputs and scan poses. The local whole-card structural index changes from
0.6985 to 0.7255; the separately labeled reviewed-credit aggregation changes
from 0.7038 to 0.7301. Every native candidate matches, with 309 other corpus
faces and 84 unrelated controls unchanged. Frame, art, symbols, type and body
pixels remain exact. Land title/artist stroke-width error remains visible even
though the group edge, contrast and filled-area metrics improve. City of
Shadows has a small title-contrast regression. This batch targets
0.4.18; type/body layout, the crescent symbol's pale rim, measured mana transfer
and complete-set certification remain open. These are local development
diagnostics; hosted charts have not adopted them.

The [Dark symbol fit](fixtures/accuracy/early-expansion-dark-symbols.json)
measures the crescent on frozen scan-only poses, after comparing the Conjurer
and Keyrune contours. Independent width/height and placement replace the former
bulk profile. The oversized white source backing is removed; shared filled ink
and a faint contour for black paper are prepared once from the pinned SVG.
All 122 native prototypes match, with exact pixels outside the symbol region,
194 other corpus faces and 84 unrelated controls unchanged. On the reused
validation group, material-balanced symbol edge overlap improves from 0.5433
to 0.8588 and filled-area similarity from 0.4519 to 0.8068. 119/120
geometry-qualified cards improve both crops on edge/fill/contrast. Water Wurm
is retained as a regression, Gaea's Touch 77† as a shifted-ink diagnostic, and
Ball Lightning as unscored. Black stroke-width mismatch and frame-texture color
remain review items. The ledger retains partial status; these are regional
0.4.19 measurements, not complete-set certification or hosted scores.

The [Dark mana refinement](fixtures/accuracy/early-expansion-dark-mana.json)
uses opaque-source paper sampling and a shared 0.2 px ink expansion for black
and red. Filled overlap, continuous coverage, area and outline diagnostics
replace the initial overlap-only selection, which made red too heavy. Values
are fitted only on ordinary calibration names; the reserved ordinary and gold
groups retain their development status. Ordinary validation filled overlap
improves from 0.8910 to 0.9190 for black and 0.8726 to 0.8981 for red. Gold
transfer improves too, while red outline regressions remain recorded.
All 122 native prototypes match, 194 other corpus faces and 84 controls remain
exact, and changes stay within costs/rules. White pigment fitting is deferred
after a known-palette blur test exposed estimator bias. Circle geometry and
rendered paper medians are preserved. The ledger remains partial; type/body
layout, generic numeral shape, text/frame metric separation and complete-set
certification remain open. These are local 0.4.20 diagnostics, not hosted scores.

## M21 scan normalization census

The [scan-only certificate](fixtures/accuracy/m21/normalization-native-review.json)
covers all 297 ordinary printings in 17 physical frame families. All 1,716
known-raster recovery controls pass the predeclared 0.35-pixel RMS and 0.6-pixel
maximum corner-error limits in the 488×680 comparison space; the largest measured
corner error is 0.548 pixels. These controls include scale, translation, rotation,
shear and brightness perturbations. They reuse development scans and population
templates, so this is a complete source census rather than an independent-name
holdout.

Two disjoint strip partitions fit each comparison-only affine transform; a third
partition checks boundary support. Validation and certification use that same
held partition and must not be counted as separate tests. The full scan-boundary
contact review covers all 297 printings. The certificate retains every transform,
reference identity, control result, method identity and source-window review.
The compressed evidence contains measurements and metadata, without scan pixels.

Reproduce the certificate from a cached study with:

```sh
node games/magic/tools/accuracy/modern-normalization-certify.mjs \
  observations.json templates.json normalization.json \
  known/results.json confirmation/results.json value/results.json \
  boundary-review/review.json normalization-native-review.json
```

The tool checks source/window identities, native field bytes, complete printing
membership, declared control limits and recovered corner errors before writing
the receipt. The five foil-only scans can validate physical boundary alignment;
they remain excluded from nonfoil pigment calibration. This narrow normalization
eligibility does not approve foil references for color work or change Unlimited's
nonfoil certification. Frame geometry, typography, color, full-card outliers and
release status remain separate checks.

### Shared modern stock and explicit profile selection

The M21 stock adoption is recorded separately from the historical modern-default
and style receipts in
[stock-native-review.json](fixtures/accuracy/m21/stock-native-review.json).
It covers all 297 native faces and etchings, 292 nonfoil edge references, and
native parity with named-M21 selection. The five foil-only printings are
transfer controls, never pigment targets. Small changes to translucent interior
colors remain visible in the fixed-window measurements.

Reproduce with the canonical Original input manifest, complete before/after
native captures, and frozen score references from your local cache:

```sh
node games/magic/tools/accuracy/modern-stock-native-audit.mjs \
  INPUTS BEFORE_NATIVE AFTER_NATIVE FROZEN_SCORES stock-audit.json
node games/magic/tools/accuracy/modern-stock-policy-audit.mjs \
  INPUTS AFTER_NATIVE NAMED_REFERENCE_NATIVE stock-policy.json
```

The policy tool checks all four material-selection modes and compares full
native output against a separately captured named-M21 reference. It does not
claim to render all four modes. The ancestry layer reverses only the five
reviewed source edits to keep older receipts verifiable; unknown edits still
fail. This stock receipt does not certify the rest of M21.
