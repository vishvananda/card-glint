# Calibrate a set

Use this checklist for a calibration PR. Work in the Magic pack; the Rust core,
browser backend and host apps should not need changes for a profile update.
Keep scans and derived comparison images in the ignored local cache or PR artifacts.
See [asset sources and fan notice](../NOTICE.md).

## Checklist

1. **Freeze the inputs and scope.** Download full-resolution PNGs, art crops,
   printing metadata and MTGJSON original text. Join by printing UUID. Review
   original names, type lines, flavor breaks/emphasis, artist names, stats and
   legal text against the scans. `originalType` can contain later errata; an
   `original` render flag alone does not prove original wording. Preserve
   semantic frame traits when replacing visible types such as “Summon.”
   Include ordinary English paper printings, basics, gold, lands and legendary
   variants. Track unsupported layouts and bad scans in the denominator. Use
   nonfoil references for pigment fitting; flag ambiguous finishes.

2. **Reserve validation names before fitting.** Split by card identity, keeping
   alternate art and repeated printings of a name together. Start with 8–16
   diverse names per frame/material, including long costs, wide titles, dense
   rules, italic flavor and wide P/T. Require at least three calibration and
   three validation names for a claimed group. Keep sparse groups partial or
   document a measured family transfer. Once you use a reserved card to choose
   values, label its results `reused-development`; it is no longer a fresh test.

3. **Normalize scans once, using frame edges only.** Establish template edges
   from scans, independent of the candidate renderer. Fit translation and uniform
   scale first; admit rotation/skew only if disjoint frame strips improve. Freeze
   the template, method, reference hash and accepted transform per scan. Reuse
   these exact poses for every candidate. Lettering, symbols and illustrations
   must not influence registration. Check recovery of known synthetic transforms
   and inspect rejected scans. Do not repair an asset's aspect ratio with a scan
   stretch, or ship per-scan transforms as rendering defaults.

4. **Choose assets, then fit geometry.** Compare compatible frame families before
   changing color. Measure stock, art aperture, rules/type boxes and their rims
   separately, including all four corners. Use `0.045 × card width` for non-Alpha
   outer corners unless evidence supports an exception; retain Alpha's current
   `0.058`. At 488 px these are 21.96 and 28.30 px. Scryfall's repeated alpha
   cutouts are reference masks, not independent measurements of physical dies.
   Record missing textures, reversed bevels and wrong symbol contours as asset
   issues instead of compensating with text offsets.

5. **Fit symbols and lettering with several measurements.** Measure the visible
   symbol ink, excluding transparent SVG padding. Fit horizontal/vertical size,
   right edge and vertical center separately. For mana, separate disc diameter,
   pitch, glyph size/centering, generic numerals and shadow. Check the correct
   historical glyph and cost order first. Choose fonts and filled stroke weight
   before margins. Fit title/type, rules/flavor, artist/legal/collector and P/T
   independently. Use non-centered passages to identify left/right margins;
   centered text cannot distinguish equivalent margin shifts. Determine short-text
   centering from the selected original/Oracle wording reference. Check wrapping,
   baseline spacing, flavor gaps and attribution alignment, including overflow.

   Fractional font-size steps and fractional glyph advances are separate settings.
   Keep measurement and painting in the same font realm and metric mode. Check
   small, regular and large text separately; a new wrapped row can move the whole
   block even when the size is unchanged. Preserve the physical inset, try a small
   size reduction, and retain every wrapping regression. See the
   [ABU fractional-text recheck](abu-fractional-text.md).

6. **Fit pigment after the geometry is fixed.** Fit frame and paper by material;
   retain separate masks where their adjustments differ, especially green and
   black. Measure interior black and outer stock separately; Alpha/Beta retain
   their distinct outer stock. Fit mana paper and glyph ink separately. Exclude
   illustration, text, shadows, foil reflections and bevel highlights from
   pigment samples. Compare median color _and_ low/high quantiles, local contrast
   and clipped-pixel counts. Reject a color improvement that erases texture or
   dirties highlights. Bind each correction to its pinned asset and geometry;
   changing that source invalidates the old pigment fit.

7. **Validate the native renderer and inspect outliers.** Render the whole scoped
   set with the same wording, browser, fonts and scan poses before and after.
   Record regional scores by frame/material, rarity and legendary status, split
   into calibration and validation cohorts. Include mean, median, lower decile,
   worst cards, regressions and unavailable counts. Use one-pixel edge F1 and
   distance for placement, plus filled-area overlap, local contrast and stroke
   width for lettering. An edge-only gain can incorrectly favor hollow text. A rules-area score also includes its background.
   Check isolated ink or a flat-background rendering before changing typography;
   moving frame patterns can change the area score with identical lettering.
   Keep color and corner metrics separate; these are similarity indices, not
   percentages of correctness. Check the integrated painter against the fitting
   prototype and verify unchanged pixels outside the intended regions. Review
   scan/before/after cards, 2–4× crops, transparent and red/green overlays. Inspect
   at least five improvements and five worst cases, plus every missing component,
   uncertain pose and material regression. Retain rejected trials and their reasons.

8. **Submit the profile and evidence.** Change the set's values, increment both
   `profile.revision` and `review.revision`, update its evidence links and pending
   tasks, and run the checks below. Attach the reproducible study, score JSON,
   comparison page and selected crops to the PR. State the covered variants,
   reference/wording hashes, baseline/candidate commits, asset/font hashes,
   browser, metric/template hashes, validation independence, changed values and
   remaining errors. Mark a component complete only when its whole applicable
   scope passes the [completion contract](../tools/accuracy/calibration-ledger.mjs).
   A successful regional fit does not complete the set or publish a release.

## Measurement settings

All pixel distances refer to the **488 × 680** canonical card. Inspect captures
use **732 × 1020**. Resize a scan to canonical dimensions, then apply its frozen
transform; changing the resampling order changes the comparison.

| Operation          | Starting settings and acceptance checks                                                                                                                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scan fit           | ±6 px translation, ±2% uniform scale, ±0.6° rotation, ±0.4° skew; at least 8 anchors per side in each disjoint fit/validation group, spanning 60% of the measured side. Validation RMS ≤0.8 px and each side's P90 ≤1.25 px.                       |
| Extra scan freedom | Rotation must improve RMS by at least max(0.12 px, 20%); skew by max(0.15 px, 20%); no side may regress by more than 0.15 px. These are the current `SCAN_FRAME_POLICY` limits, not permission to mark a template reliable without review.         |
| Placement search   | Try both directions; coarse 1 px, then 0.5 and 0.25 px steps. Set bounds before validation. Inspect a boundary winner, tied peak, or disagreement between edge/fill objectives. Restart from several plausible positions when parameters interact. |
| Scale search       | Start at 2%, refine to 1% and 0.25%; measure width and height independently where the source shape warrants it. Keep circle size separate from the ink inside.                                                                                     |
| Review triggers    | Edge F1 below 0.65, regression greater than 0.02, a confident residual shift over 2 px, missing ink, inconsistent wrapping, or conflicting shape/contrast scores. These trigger inspection, not automatic rejection or approval.                   |
| Negative controls  | Deliberately move a component 2 px, change size 2%, remove a rim/shadow or substitute a wrong glyph. The relevant metric should worsen. Benign color changes should not dominate the structural score.                                             |

Cache decoded references, scan poses, distance maps, masks and prepared native
layers. Use CPU region comparisons and bounded searches for trials; keep one
browser for native captures. Do not start Chromium or reload fonts for each
candidate. Benchmark preparation and CPU submission separately from GPU completion.

## One file for a profile update

The first consolidated profiles are:

- [`src/calibration/sets/fem.ts`](../src/calibration/sets/fem.ts)
- [`src/calibration/sets/4ed.ts`](../src/calibration/sets/4ed.ts)
- [`src/calibration/sets/chr.ts`](../src/calibration/sets/chr.ts)

Each file owns frame/stock/art geometry, source-bound frame/paper/black adjustments,
heading and footer typography, mana geometry/pigment, and optional body and set-symbol
profiles. Export `profile` with `satisfies SetCalibrationProfile` and keep the review
record in the same file. Values use normalized rectangles for frames and canonical
pixels for text/symbols; `width` in lettering is a horizontal scale. Paragraph and
flavor gaps are multiples of font size, as defined by `RulesTypography`.

A contributor improving one of these sets edits **only its file**; evidence can
be attached to the PR instead of committing scans or changing shared painters.
Explicit host controls keep their existing precedence. Revision changes invalidate
prepared face keys. Source fingerprints also change with the values.

This adapter currently supports ordinary old-border ABU/Fourth plates. Adding a
set needs one registration in [`profiles.ts`](../src/calibration/profiles.ts) and a
scope/selector review; unsupported layouts need a painter adapter first. Other
sets still have legacy tables. Migrate their existing values without pixel changes
when opening their next calibration pass, then use this one-file contribution
path. Do not claim that a new numeric profile adds missing frame support. Historical
receipts keep their original values and scores; a new revision needs new evidence.

## Commands and artifacts

From a fresh checkout, install Node 22+, the pinned Rust toolchain and the
[build prerequisites](../../../README.md#build-and-run). Then:

```sh
npm ci
npx playwright install chromium
export MAGIC_ACCURACY_CACHE="$PWD/games/magic/.cache/accuracy"
npm run magic:reference:fetch -- --set 4ed
npm run magic:reference:text -- --set 4ed
node games/magic/tools/accuracy/calibration-study.mjs init 4ed test-results/4ed-draft.json
```

Review the draft's original fields and exclusions. Add independent frame templates
keyed by each entry's `group`, and component regions. Use the formats in
[`calibration-study-example.json`](../tools/accuracy/calibration-study-example.json).
The example contains synthetic values; it does not certify any real printing.
For an ink region, list its `fields` and review each field's wording provenance.
Keep an unavailable field unmeasured instead of copying Oracle text into it.

```sh
node games/magic/tools/accuracy/calibration-study.mjs normalize test-results/4ed-draft.json test-results/4ed-study.json test-results/4ed-templates.json
node games/magic/tools/accuracy/calibration-evidence.mjs check test-results/4ed-study.json
node games/magic/tools/accuracy/calibration-evidence.mjs assets test-results/4ed-study.json
node games/magic/tools/accuracy/calibration-evidence.mjs capture test-results/4ed-study.json test-results/4ed-before
# Edit the set profile; increment its revision. Fetch newly selected pinned assets if needed.
npm run magic:calibration:check
node games/magic/tools/accuracy/calibration-evidence.mjs capture test-results/4ed-study.json test-results/4ed-after
node games/magic/tools/accuracy/calibration-evidence.mjs compare test-results/4ed-study.json test-results/4ed-before test-results/4ed-after test-results/4ed-review
```

Open `test-results/4ed-review/index.html`. Capture requires Chromium; normalization,
comparison, profile checks and report generation do not. Capture refuses to
replace a completed run, loads cached assets only, and fails on missing assets.
The evidence runner reports fixed-window edge and filled-ink metrics; attach
separate pigment, corner and layout measurements when those components change.
It does **not** automatically choose fonts, certify templates or approve a fit.

Use these shared modules for component-specific searches, retaining the final
native replay as the acceptance check:

| Task                        | Tool                                                                                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Outer-corner alpha          | `node games/magic/tools/accuracy/corner-radius.mjs INPUT.json OUTPUT.json`; accepts a cached set snapshot or the committed non-Alpha corner study.                                                                  |
| Scan-only pose/cache        | [`scan-frame-cache.mjs`](../tools/accuracy/scan-frame-cache.mjs), [`scan-frame-fit.mjs`](../tools/accuracy/scan-frame-fit.mjs); templates remain separate from renderer profiles.                                   |
| Bounded numeric fitting     | [`calibration-search.mjs`](../tools/accuracy/calibration-search.mjs), `searchCalibration(initial, parameters, score)`; supply a cached regional painter/metric, use multiple starts and inspect boundary/tie flags. |
| Fast lettering + filled ink | [`lettering-metrics.mjs`](../tools/accuracy/lettering-metrics.mjs), [`letter-fill-metrics.mjs`](../tools/accuracy/letter-fill-metrics.mjs).                                                                         |
| Pigment and texture         | [`hsb-color.mjs`](../tools/accuracy/hsb-color.mjs), [`hsb-texture.mjs`](../tools/accuracy/hsb-texture.mjs); freeze text-free sampling masks first.                                                                  |
| Coverage inventory/report   | `npm run magic:calibration:inventory`, `npm run magic:calibration:report`; use the completion contract for task evidence.                                                                                           |

Before opening the PR:

```sh
npm run check
npm run build
npm run test:package
npm run test:magic
npm run test:magic-accuracy
npm run preview
# In another terminal, while preview runs:
npm run test:browser
npm run test:showcase
```

Use a branch and commit the profile. In the PR description, link the evidence
bundle, summarize before/after results and regressions, and list incomplete tasks.
Exclude downloaded assets, caches, private paths and host-specific code from the
commit. Keep the public showcase on original repository assets.

## Host calibration candidates

`describeSetCalibration(set)` reports supported control IDs, effective values,
units, scopes and bounds. Initially it covers ordinary ABU/Fourth-family FEM,
4ED and CHR profiles. Use `createSetCalibrationCandidate(set, revision, values)`
to validate a sparse proposal and `withSetCalibration(face, candidate)` to render
it through the normal painter. `exportSetCalibrationProfile(candidate)` returns
a detached, revision-incremented profile for a single-file contribution.
Candidates never change global defaults. Keep original wording and scan poses
fixed; fitting/validation cohorts, proposal storage and release approval belong
to the host. An empty candidate preserves the released printing policy.

LEA currently has a **name and type-line** adapter (`description.adapter === 'title'`).
It exposes horizontal/vertical deltas, font size, horizontal scale (0.001 ratio
steps), independent word spacing in canonical 488 × 680 pixels, filled gray ink
and shadow for both headings. Word spacing is applied before horizontal scaling.
The existing frame, rules and footer painters remain
authoritative. Unsupported groups are deliberately unavailable rather than
substituting another set's layout. Export an evaluated heading proposal with
`exportSetTitleCalibration(candidate)` into `calibration/sets/lea-title.ts`.
Do not use `exportSetCalibrationProfile` for a title-only description. Empty
proposals preserve the native pixels, including the original filled lettering.

The LEA title file is scoped calibration data. Its revision participates in the
face texture key, and its hash guards LEA calibration evidence. Updating it does
not require rewriting the historical shared-code migration proof. Keep the
module inert and literal; shared painter changes still require separate review.

### Independent historical stock masks and mana source ink

ABU/Fourth full profiles may specify `frames[material].stockMaskFrame`, a normalized
rectangle for the pinned family stock mask. The mask preserves the source aperture's
curves independently of the texture placement in `frame`. When present, it replaces
`stockWindow` for painting and editor controls; retain `stockWindow` as fallback data.
The asset loader prepares the mask with the other static face assets and rejects a
missing mask. A per-color land requires its own `L-W`, `L-U`, `L-B`, `L-R` or `L-G`
frame entry; an absent plate is not substituted from another color. Multicolor land
plates use the optional source-bound dual adapter below.

`mana.sourceInk[color]` may bind stroke expansion to `family: 'conjurer-old'` or
`'mse-old'`, with `pixels` from 0 to 1 per nominal 24-pixel disc. It only applies
when the selected original glyph family matches. An optional
`paperSample: 'opaque-percentile'` keeps dark expanded strokes out of the paper
sample; fit stroke and sampling policy together. Modern-symbol and explicit custom
frame choices keep their own policy. The editor exposes the numeric expansion;
source family and sampler remain fixed source decisions in the same profile file.
Check these additions with `npm run magic:calibration:check` and
`npm run test:calibration-editor`. Run `node tests/magic-profile-preparation.mjs`
with Chromium installed for native stock-mask placement and source-ink validation;
the full accuracy suite includes it after browser installation.

These optional capabilities do not themselves complete a set. The preparation
receipt contains 302 actual native Original Unlimited before/after pairs and
25,200 metadata cases across 15 sets. Other sets have metadata parity only in that
receipt. Historical helper guards are reconstructed only for exact reviewed source
bytes with unchanged, inactive profile data. New or changed full profiles retain
current source guards and need fresh fit evidence; they cannot inherit the old fit.

### Shared dual plates, footer and early text policy

A full profile can add `frames['L-dual']` and `dualLand`. The latter binds all five
pinned ABU source plates to that shared frame rectangle, independently assigns
`outlines` by the semantic `WUBRG` pair, and stores the paper `pinline` box,
physical widths, five-color palette and edge ink. `dualLand.stock` is the outer
stock color. Missing or stale source bindings bypass the new dual adapter as a
whole. Editor geometry proposals update these bindings while retaining source
URLs; plate tones and band geometry/colors have bounded controls.

Optional `footer.artist` fields are `prefix`, `align`, `baseline` and `maxWidth`.
An empty `footer.legal.defaultText` suppresses the set's fallback legal row; an
explicit host legal string remains authoritative. `footer.stats.baseline` can
retain middle anchoring. Existing profiles keep their previous defaults.

`textTiers` configures the shared early count/wrap model. Its optional
`retainRegularAboveLines` applies only to Original medium text. Oracle uses the
safe physical inset and shrinks to fit; it must not inherit Original density
retention. Fit font tiers, wrapping and margins before publishing these values,
and run `node tests/magic-profile-adapters.mjs` for source-binding and proposal
validation. Neither adding these fields nor passing compatibility tests completes
a set: the integrated native Original/Oracle faces and outliers still need review.

### Finite printing groups

When a variant has fewer than three distinct names, use a `source-census`
receipt instead of inventing holdout independence. Replay every ordinary
nonfoil printing in that variant against its frozen, independently validated
scan pose. Record the complete printing membership, unique names, shared
parameter hash, and each reference, pose, input and native-face hash. State
`heldOut: false`; this certifies the observed population only, with no claim
of transfer to unseen printings. Regional measurements, outlier review and
release checks still apply. The ledger rejects missing or duplicate members.

For frozen released-browser baselines and native ARN/ATQ/DRK text-policy probes,
see [early expansion probes](early-expansion-probes.md).
