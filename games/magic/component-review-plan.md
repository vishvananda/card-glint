# Detecting placement and shape errors

The first old-border review exposed a reporting failure: a mana score near 0.42
was already available, but a body-typography improvement dominated the report.
Missing legal text and incorrect symbol treatments were mixed with frame-asset
issues. Every visible component needs its own review status and examples.

## Implemented in the printed-detail pass

- Keep the frozen frame-family transform. Both old and new renders use exactly
  the same reference bytes, input, browser and alignment. No scan gets fitted.
- Score mana, the light set-symbol outline, artist, copyright and stats separately.
  Copyright uses the observed ink polarity for the frame. Tap windows are
  layout-assisted diagnostics, explicitly distinct from independent scan targets.
- Search bounded translations of component edges in both directions. Report raw
  F1, the suggested displacement, residual shape disagreement, alternative-peak
  ambiguity, and search-boundary failures. A suggested displacement never changes
  an image or replaces its raw score. Out-of-window edges remain penalized.
  The search evaluates all 441 integer offsets within ±10 canonical pixels,
  retaining both the maximum-overlap (edge F1) and minimum-edge-distance peaks.
  This implements the small positional bumps without stopping at a local peak.
  Peaks more than 2px apart trigger review. A boundary winner means the search
  has not located an interior optimum; a narrow/tied peak margin means the
  position is uncertain. Neither is accepted as a calibrated placement.
- Locate mana discs with a separate radial contrast measurement. The Fourth
  Edition pass extends this to every disc in the cost row, each searched around
  a fixed nominal position. It reports pitch, vertical spread, partial rows and
  conflicting disc order; no fitted disc anchors the next search. A compressed
  row with an unchanged rightmost disc is covered by the failure tests.
  Agreement around all four quadrants discounts straight frame lines. Glyphs and
  shadows can still confuse it: uncertain and boundary results remain unmeasured,
  never silently accepted. In particular, the white sun often needs visual review.
- Generate scan / previous / current full cards, region enlargements and cyan /
  magenta edge overlays. The agent opens these images before making a geometry
  change and after scoring it. The page exposes component data, not just a body
  average. All pixel comparison and page generation run in Node without Chromium.
- Test known displacements, contrast changes, missing ink, wrong shapes, search
  limits and a circle shifted independently of an unchanged frame line. A case
  with stationary background marks also verifies that maximum overlap can find
  the displaced shape when minimum distance favors a different position.

These are initial diagnostics, not validated pass/fail certification. Generic
region matching can still prefer a shared frame edge over a symbol, or align
repeated letters incorrectly. The independent mana landmark exists because this
failure was observed during the pass. Fourth Edition repeated the same failure
for titles: ambiguous generic offsets stayed near zero despite a visible left/up
error. Enlarged scan/render crops exposed it. Inspect uncertainty; never read
an ambiguous zero offset as evidence of correct placement. No single similarity score certifies a
correct tap glyph, shadow, outline, legal line or corner radius.

The full Fourth Edition search found a repeated stats displacement at
`dx=4, dy=3`. The initial shared shift improved ordinary expressions but failed
on wide ones: Angry Mob and Leviathan in development, and Shapeshifter in the
reserved Fifth Edition cohort. That failed trial remains archived. Its small
stats window also cropped the left side of long expressions.

The follow-up includes all three wide Fourth Edition expressions and measures
their full width. Production-matched candidate crops test a shared right edge
instead of a centered, width-constrained box. Eighteen development cards selected
`right=451`, `yOffset=3`, retaining the existing font and shadow. Fourth Edition's
printed Shapeshifter needs parentheses absent from Oracle. The new policy and
wider metric windows are [frozen together](fixtures/accuracy/4ed/stats-wide-plan.json)
before opening a fresh Revised transfer cohort. Previously viewed Fifth Edition
cards now count as development/exploratory evidence.

Include unusually wide content when selecting a cohort. Search position only
after checking content, anchoring and compression; a higher overlap score for
ordinary short text can conceal the wrong layout rule. Keep old score artifacts
when changing windows, and re-score identical baseline pixels under the new
metric definition.

## Next implementation steps, in order

1. **Freeze component targets for each frame family.** Record independent scan
   windows, expected component presence, ink polarity, symbol identity, approximate
   bounds and uncertainty. Store source image hashes and review provenance. Start
   with 8–16 diverse development cards per family and an untouched cross-set
   cohort. Make set exceptions only when several scans consistently demonstrate
   a different printing template. Reuse the shared frame alignment.
2. **Separate foreground from surrounding texture.** Use the whole-row mana landmarks
   to isolate discs, then compare their interior contours separately. Remove frame ridges from set-symbol
   windows using independently marked exclusion strips. Segment light outlines
   and dark symbol interiors separately. For credits, use reviewed text-line
   bounds and expected words instead of a texture-heavy footer rectangle. Add
   connected-component counts, holes and skeleton/junction descriptors to distinguish
   the historical tap shapes. Compare foreground templates at shared scale; any
   diagnostic scale/offset search must remain separate from the fixed score.
3. **Measure style explicitly.** Check outline thickness, displaced shadow ink,
   symbol radius/pitch, glyph width/weight, baseline and paragraph gaps. Fit a
   shared corner silhouette from multiple reference outer edges, with background
   and scan-cut uncertainty; report radius error separately from frame texture.
   The current Canvas correction matches the existing GPU silhouette, but does
   not constitute a calibrated scan-radius measurement.
4. **Build a labeled failure suite.** For each reviewed component, deliberately
   move it 2/4/6px, resize it, remove its shadow/outline, substitute the wrong tap,
   center the credit, delete copyright and square the corners. Keep the background
   fixed. Add benign saturation, color-cast, contrast, grain and mild scan-cut
   changes. Select thresholds on development data, then measure precision/recall
   on untouched cards. Freeze thresholds before reporting cross-set success.
5. **Promote visual review to an acceptance gate.** Provisional triggers: a
   component F1 below 0.65, a paired regression over 0.02, a confident offset over
   2px, missing expected content, disagreement between edge/landmark measurements,
   ambiguous peaks or boundary solutions. These trigger inspection, not automatic
   rejection. Require at least five confident examples and a consistent median
   direction before proposing a frame-wide placement change. Review alignment
   outliers separately and never tune the painter to an individual scan.
6. **Use diagnostic evidence to choose the right fix.** Placement error with good
   residual shape suggests a geometry change. Correct placement but mismatched
   contour suggests a symbol/font/asset issue. Missing expected words are a
   content error. Large frame-texture differences go to the asset backlog. Keep
   asset identity, affected frame/sets, example UUIDs, crop links and confidence
   on every backlog item. Existing frame assets remain unchanged until reviewed.
7. **Expand coverage and retain the denominator.** Run every ordinary printing at
   both tiers, including failures and unsupported layouts. Keep reviewed printed
   text distinct from Oracle diagnostics. Report per-component distributions,
   worst cases, error counts, asset groups and unmeasured reasons; do not call
   edge F1 a percentage of rendering accuracy. Promote a policy only after it
   improves its development family and transfers to another set without a
   material regression in existing families.

## Agent image-inspection procedure

For every triggered group, create a contact sheet with three to five cards from
at least two sets. Include original-color crops, local-contrast grayscale,
foreground masks and fixed-alignment overlays at 2–4× scale. Include old and new
renders and numeric bounds on the same sheet. Open the sheet with the image-view
tool and record what the pixels show: center/baseline error, radius, outline,
shadow direction, glyph topology, crop contamination, or uncertain scan evidence.
A diagnostic alignment preview may be shown separately, labeled as such; it must
never replace the fixed-alignment image. Inspect the full cards as well to catch
interactions and omitted content outside the small windows.

Use a shared parameter sweep only after that inspection identifies a plausible
cause. Evaluate a small bounded grid, inspect the best candidates and the worst
regressions, then freeze the production policy before opening the transfer set.
Use the same candidate displacement for every card in a frame-family cohort;
optimize the robust aggregate of their fixed component scores, retaining each
card's delta and alignment uncertainty. For mana rows, sweep pitch and radius
separately from row position. Per-card search peaks suggest candidates but must
never become per-scan corrections. Isolate the foreground first when either
objective is following a frame ridge or background mark.
For a wrong shape, inspect the existing source asset and verified historical
variants before changing code. Record unresolved visual questions on the example
page so the user can help without needing to reconstruct the diagnosis.

## Speed and reproducibility

Keep PNG/art downloads, fonts and component assets in the existing content-addressed
local cache. Rasterize changed faces with the persistent capture session; no
Chromium is needed to rerun measurements on those pixels. Cache segmentation and
distance fields by image hash, ROI/polarity and algorithm version before broad
all-card offset searches. Precompute radial samples for mana landmarks. Keep
capture time, cold comparison time and warm-cache time separate; these CPU
measurements are not GPU-completion or frame-rate measurements.

A replacement headless rasterizer is optional, not a prerequisite for fast
comparison. It would need a font-shaping and alpha-compositing parity suite
against the production Canvas backend before its scores could guide changes.
