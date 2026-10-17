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

The [current color-gap study](fixtures/accuracy/showcased-color-gap-review.json)
records three native candidates without adopting them. M21's historical color
sampling windows overlapped the black art keyline; fixed clear-rail windows now
separate pigment from geometry. The black candidate passes the 20-card component
study (reserved median color error 2.29 → 1.84) and awaits full coverage. An expanded
quiet-rail check also passes for all 41 accepted black scans (2.15 → 1.76); four
normalization failures remain visible, and crowns are still unmeasured. White
and Beta green remain rejected. This finding also puts the other historical
M21 outer-frame pigment fits back in the audit queue; paper fits are independent.
