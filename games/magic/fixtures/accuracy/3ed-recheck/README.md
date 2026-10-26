# Revised recheck evidence

This directory contains metadata and content hashes, not card artwork. Original
wording is used for calibration. Scan transforms are comparison inputs and never
become per-card rendering offsets.

## Current body fit

The shared Original-only fit uses fractional font advances. It preserves the
existing first baseline and line budget. Large text keeps its width; regular
letters and their panel widen by 1%, and constrained/compact letters and panels
widen by 2%, with a right limit of 424 canonical pixels. Inline mana discs retain
their physical size. Oracle, land and explicit alternate-frame layouts retain
their earlier policies.

The complete native replay contains 281 nonland Originals. All match the selected
prototype exactly, with changed pixels confined to the body region and no alpha
changes. Every printed word is retained. The 843 Oracle/etching variants and 25
land Originals are unchanged. The replay also preserves 1,001 Alpha, Beta,
Unlimited and Antiquities Originals.

The 270 accepted text references improve from 64.67 to 68.63/100 on the regional
text objective: +4.07 on 178 calibration references and +3.74 on 92 validation
references. These validation names were already used during development; this is
not an independent holdout. Eleven rejected scan references are excluded from
those means.

There are 215 gains and 55 losses. Energy Flux, Grizzly Bears, Frozen Shade,
War Mammoth, Goblin Balloon Brigade and Mahamoti Djinn retain visible wrapping or
flavor-line issues. Those outliers, vertical interior registration, headings,
artist/P-T and complete component certification remain open. This regional
improvement does not mark Revised complete.

## Reproduction tools

- `revised-body-native-study.mjs INPUTS BASELINE_CAPTURE COLORED_POSES ARTIFACT_POSES NEW_OUTPUT [selected|grid]`
  compares the frozen pre-fit painter with shared text candidates. Set
  `NATIVE_RENDERER_ROOT` to the baseline checkout at commit `9718d69`.
  The selected mode saves full native PNGs and checks body-only pixel isolation.
- `printing-native-replay.mjs INPUTS NEW_OUTPUT [original|variants] [input|reviewed-artist]`
  renders frozen inputs with the production painter. It supports a separate
  `NATIVE_RENDERER_ROOT` and cached Oracle assets. It never installs trial hooks.
- Both tools require the content-addressed cache supplied by
  `MAGIC_ACCURACY_CACHE`. They refuse to overwrite an existing output.
- The study uses the earlier native capture schema: `source.rendererHash`,
  `source.inputHash` and per-mode `sha256`/`file` fields, with PNGs beside the
  capture. When regenerating that baseline with the replay tool, copy its top-level
  `rendererHash` and `inputHash` into a `source` object.
- `body-coupled-study.json.gz`, `body-regular-fine.json.gz`,
  `body-policy-study.json.gz` and `body-width-study.json.gz` retain the evaluated
  candidates. `body-selected-native.json.gz` records the portable reproduction.
- `body-artist-source-delta.json.gz` records the exact before/after source,
  native controls, regional results and artifact hashes. The source projector
  restores only exact reviewed bytes; unknown edits remain visible.

The artist entries in the combined receipt are a separate six-printing Arabian
Nights macron correction. They change no font or layout values and certify no
complete footer component.

## Whole-card baseline

`current-stock-full-scores.json.gz` is the pre-body-fit, 306-card structural
baseline using the stock scan poses. Its mean is 71.97/100. It reuses 255 exact
scores and freshly measures 51 artifact frames after their shared horizontal
adjustment. Do not compare that whole-card number directly with the regional
text objective above.

The subsequent body-fit comparison is in `body-whole-card-scores.json.gz`,
joined to `body-native-originals.json.gz`. All 306 current Originals use the
same stock transforms and metric graph: 71.97 → 73.04/100, with 215 gains,
66 losses and 25 unchanged lands. The scorer recalculates the 281 changed native
faces and reuses the 25 byte-identical land scores. This is a whole-card diagnostic,
separate from the interior-normalized regional text fit.

`body-request-source-delta.json.gz` and `body-request-native.json.gz` close a
metadata-only follow-up: the translated fractional layout now retains its
editable request even without an outer caller wrapper. All 306 production
Original PNGs remain byte-identical. This preserves the preceding score census
and face-cache revision.

The metadata-only closure also has a complete score-reuse replay in
`body-request-score-reuse.json.gz`: 306 reused scores, zero fresh calculations,
and the same 73.04/100 mean. Native bytes, inputs, references, poses and the metric
import graph all match.

## Vertical registration for regional fits

`vertical-parent-poses.json.gz` retains the 281 existing horizontal interior poses.
They match `colored-horizontal-normalization.json.gz` and
`artifact-pixel-normalization.json.gz` exactly. Physical frame colors govern
membership: Serendib Efreet belongs to the green frame group.

`vertical-interior-normalization.json.gz` adds comparison-only vertical
translation and scale. It samples the original scan once at each candidate pose,
using dark-going luminance transitions to avoid bright bevel and illustration
edges. Only calibration names choose the templates and their zero-median
translation/scale gauges. Validation names reuse earlier development data.

Two disjoint strips select each pose. Four other strips check the frozen pose:
each needs overlap of at least 90/100 and residual displacement no greater than
0.5 reference pixels. Search limits and prior rejections remain exclusions.
The resulting sample contains 223 accepted cards: 152 calibration and 71
validation. All 58 excluded cards remain in the report. This does not classify
their scans as bad.

The art-bottom and exterior-rim bands remain diagnostics. In particular, the
outer perimeter can align while the interior panels do not. Neither its high
overlap nor a separately optimized check-strip score can approve an interior
pose. These regional poses do not replace the stock poses used by the
73.04/100 whole-card baseline and do not certify complete frame geometry.

To reproduce with the local reference cache:

```sh
gzip -dc games/magic/fixtures/accuracy/3ed-recheck/corrected-original-inputs.json.gz > inputs.json
gzip -dc games/magic/fixtures/accuracy/3ed-recheck/vertical-parent-poses.json.gz > parents.json
MAGIC_ACCURACY_CACHE="$CACHE" node games/magic/tools/accuracy/revised-vertical-register.mjs \
  inputs.json parents.json new-vertical-results.json
node tests/magic-printed-vertical-fit.mjs
node tests/magic-revised-vertical-registration.mjs
```

The tool uses CPU scan decoding and registration, without Chromium or card
composition. Synthetic controls cover fractional translation/scale, stock
rotation/shear, brightness changes, missing or conflicting independent lines,
and validation isolation. Removing every check-strip edge leaves the selected
poses unchanged and rejects the cohort. Exact native painter checks and
component comparisons are still required before adopting any renderer changes.

## Footer workbench

`footer-coarse-study.json.gz` retains the initial shared geometry sweep.
`footer-fine-study.json.gz` refines it with the production painter.
Every one of the 223 current Original cards must match its stored native PNG
hash, and all 302 artist/P/T default replays must match before fitting starts.
The public tool reproduces 683 common candidate scores from the earlier sweep
exactly. The compressed reports contain measurements and hashes, not card art.

The current proposals keep the font sizes:

- Artist: move left 2 pixels and down 0.5 pixels; multiply glyph width by 1.02.
- P/T: move left 0.5 pixels and down 0.5 pixels; keep glyph width.

The artist regional objective improves from 68.53 to 72.31/100; 208 cards
improve and 15 regress. The P/T result and per-color/cohort breakdowns are in
`footer-proposal-review.json`. Both fitting cohorts improve, but validation
names are reused development data. These are regional objectives, not new
whole-card scores. Individual regressions remain listed for review.

These geometry proposals are now runtime defaults for Revised nonland cards.
Font sizes and ink colors remain unchanged. Black/white foreground inversion
also supplies tone diagnostics. Those estimates can be biased by residual
misalignment, thin strokes and scan sharpening; check native-resolution glyph
interiors before adopting new gray values. The selected tone geometry is
recorded separately from the final geometry proposal.

To repeat the refinement at the recorded renderer source:

```sh
gzip -dc games/magic/fixtures/accuracy/3ed-recheck/vertical-interior-normalization.json.gz > vertical.json
gzip -dc games/magic/fixtures/accuracy/3ed-recheck/body-request-native.json.gz > native.json
gzip -dc games/magic/fixtures/accuracy/3ed-recheck/footer-fine-definition.json.gz > definition.json
MAGIC_ACCURACY_CACHE="$CACHE" node games/magic/tools/accuracy/revised-footer-native-study.mjs \
  inputs.json vertical.json native.json definition.json new-footer-results.json
node tests/magic-revised-footer-study.mjs
```

Use the coarse definition instead to repeat the wider sweep. The tool uses one
browser for the entire set and reads only the affected native region during
candidate scoring. The host CPU, Canvas2D and objective wall time does not
measure GPU completion. The historical workbench requires the pre-footer renderer at commit eae3a50.
Run the archived study from that checkout. A different renderer needs a matching
study definition and native capture; a changed PNG cannot silently serve as an
old control. Pigment and outlier review remain required before closing the
complete footer audit.

## Footer adoption

The footer-source-delta receipt records the exact source and cache-key change.
The production painter reproduces all 1,224 prototype variants exactly.
Its 843 changed nonland face variants are confined to footer RGB pixels, with
unchanged alpha. All 306 etching masks and all 75 land wording variants remain
byte-identical. The body layouts also remain unchanged.

The 302 regional artist/P/T scores reproduce the selected proposals exactly.
The footer-whole-card-scores fixture checks all 306 Originals with the same stock
poses and metric graph: 73.04 → 73.07/100. It freshly scores 281 changed faces and
reuses all 25 unchanged lands. This structural metric is less sensitive to the
footer than the regional objective, so keep both measurements visible.

The cache revision applies only to assembled Revised nonland cards with visible
artist or P/T text. Scans, artwork-only output, masks, hidden or absent footer
text, ordinary land recipes and other sets retain their keys. A host-supplied
P/T pair on a land uses the revision because that text is drawn too. Source-history projection restores
only exact reviewed bytes. It does not approve unknown source changes or carry
older footer/full-card evidence forward as current validation.

Native-resolution ink probes avoid the extra canonical downsample, but their
gray estimates remain sensitive to the stroke mask, especially on black cards.
No new ink palette is adopted from those probes. Frame, headings, mana, pigment
and complete outlier/component review remain open for Revised.

The final cache-scope closure also has 1,224 byte-identical native variants and
306 exact score reuses in footer-final-score-reuse.json.gz. It changes no
published metric or face pixels.

## Mana perimeter and glyph review

The current cost study uses 223 independently checked nonland frame poses.
The other 58 nonland scans stay excluded from fitting. There are 413 cost
symbols on the accepted cards; 360 pass the additional perimeter checks.
Low-contrast circles and detector results that contradict the known native
circle construction remain explicit exclusions.

The detector can measure either contrast direction. The scan must use the
same physical edge polarity as the validated native circle. Choosing the
strongest edge of either sign can select the glyph inside the circle instead.
All 826 original positive-polarity results remain exactly unchanged by the
optional detector extension. Synthetic subpixel, inverted-contrast, flat and
search-boundary controls run in tests/magic-mana-ring.mjs.

The rightmost-disc median radius difference is zero. Across accepted discs,
the median scan-minus-render radius difference is -0.125px, horizontal offset
is +0.375px, and vertical offset is zero. Adjacent pitch differs by -0.25px
in both fitting cohorts. Color/material differences and low-contrast exclusions
remain visible; these measurements do not yet select new shared cost geometry.

The glyph audit preserves each glyph's size relative to its measured circle;
it does not normalize ink bounds. Three relative ink thresholds reduce pigment
and saturation sensitivity. Filled overlap contributes 70% and edge agreement
30% to this regional objective. It is not a whole-card score.

The binary-mask search proposes these relative glyph changes:

| Glyph | Scale | Horizontal offset | Current /100 | Proposed mask /100 |
| ----- | ----: | ----------------: | -----------: | -----------------: |
| White |  1.04 |            -0.5px |        84.48 |              87.72 |
| Blue  |  1.06 |                 0 |        86.73 |              87.68 |
| Black |  1.04 |                 0 |        82.30 |              83.63 |
| Red   |  1.06 |                 0 |        69.70 |              77.15 |
| Green |  1.14 |            -0.5px |        69.42 |              89.53 |

All proposed vertical offsets are zero. Calibration rows select the transforms;
the separately reported validation names are reused development data. Every
red and green sample improves in this approximate mask search. Smaller gains
for other colors include individual regressions. These are proposals, not
runtime defaults. Full native rendering, disc/background isolation and actual
regional scores must confirm them before adoption.

Numerals are audited separately and are not changed by this colored-glyph
proposal. In particular, 2 and 4 need further shape/font review. Eroded-disc RGB
samples are diagnostics only: print dots and weak contrast can bias them, so
they are not adopted as new paper colors.

The compressed evidence contains metadata, scores and hashes, not artwork:

- mana-ring-positive-control: original one-polarity results.
- mana-ring-checked: both polarities, known native controls and explicit exclusions.
- mana-glyph-audit: shape, threshold stability and separate paper-color probes.
- mana-glyph-fit: shared per-color proposal search and individual regressions.

To repeat with cached art and a matching production native capture:

```sh
gzip -dc games/magic/fixtures/accuracy/3ed-recheck/corrected-original-inputs.json.gz > inputs.json
gzip -dc games/magic/fixtures/accuracy/3ed-recheck/vertical-interior-normalization.json.gz > poses.json
MAGIC_ACCURACY_CACHE="$CACHE" node games/magic/tools/accuracy/printing-native-replay.mjs \
  inputs.json new-native original input
MAGIC_ACCURACY_CACHE="$CACHE" node games/magic/tools/accuracy/revised-mana-ring-study.mjs \
  inputs.json poses.json new-native rings.json
MAGIC_ACCURACY_CACHE="$CACHE" node games/magic/tools/accuracy/revised-mana-glyph-audit.mjs \
  inputs.json poses.json new-native rings.json glyphs.json
MAGIC_ACCURACY_CACHE="$CACHE" node games/magic/tools/accuracy/revised-mana-glyph-fit.mjs \
  inputs.json poses.json new-native rings.json glyphs.json proposals.json
node tests/magic-mana-ring.mjs
node tests/magic-revised-mana-study.mjs
```

These measurements run on the CPU from cached images; the capture step uses
one browser. No per-card scan transforms are added to the renderer. No complete
mana, color, frame or set certification follows from this regional study.

### Native proposal check

The full production replay confirms improvements for blue, black, red and
green, but rejects the white mask proposal:

| Glyph | Current /100 | Actual native proposal /100 | Result                                               |
| ----- | -----------: | --------------------------: | ---------------------------------------------------- |
| White |        84.48 |                       82.98 | Reject this proposal                                 |
| Blue  |        86.73 |                       87.73 | Improves both cohorts; individual regressions remain |
| Black |        82.30 |                       86.74 | All 54 measured glyphs improve                       |
| Red   |        69.70 |                       78.67 | 55 improve; one loses 0.81                           |
| Green |        69.42 |                       91.55 | All 37 measured glyphs improve                       |

White regresses in both cohorts despite improving in the binary-mask search.
Keep its existing runtime values. This is an explicit negative control for
using an approximate resize objective without checking actual rasterization.

The replay uses the public relative glyph controls on 223 complete native
faces. All changed RGB pixels stay inside the cost area; alpha, nearby text
and artwork are unchanged. All 33 artifact controls remain byte-identical.
The 116 measured generic numerals have identical masks and scores. The actual
source-scan objectives also reproduce every baseline mask and score exactly.

The prototype inputs, native capture metadata and review are stored in
mana-glyph-prototype-inputs, mana-glyph-prototype-native and
mana-glyph-native-review. Only hashes and metadata are committed. The
revised-mana-native-review.mjs tool takes the original inputs, poses, two
native directories, rings, glyph audit, proposal definition, candidate inputs
and a new output path. It rejects candidate recipes changed beyond the proposed
glyph controls.

The nonwhite proposals remain unadopted pending the complete mana review,
including physical cost placement, pigment, numerals and outliers. These glyph
scores do not replace full-card or full-set scores.
