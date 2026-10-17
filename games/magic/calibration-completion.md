# Completing a set calibration

The [progress ledger](fixtures/accuracy/calibration-progress.json) is the source of
truth for completion. It covers the frozen 272-major-set inventory and keeps an
explicit denominator for each frame/color/layout variant. The initial batch is
Alpha, Beta, Unlimited, Revised, Eighth, M21, Arabian Nights, Antiquities, The Dark,
and Legends. Other sets remain queued. A profile existing in the renderer does
not mean that its set, or even its entire frame, has been calibrated.

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
   old-version scores do not close this check.

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
