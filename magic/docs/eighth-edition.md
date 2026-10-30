# Eighth Edition frames

[Magic pack](../README.md) · [Documentation index](README.md)

Version 0.7.0 uses Eighth Edition as the default for ordinary cards that select
`frameAssetFamily: 'eighth'`. Exact set and component fits take precedence.
Black and white surrounds use separate colors; changing the surround does not
recolor the interior frame.

The authoritative values live in
[`calibration/eighth/8ed.ts`](../src/calibration/eighth/8ed.ts).
The profile owns frame geometry, materials, headings, rules, mana, credits,
stats and large basic-land symbols. Matrix fonts load only when needed.
Derived masks and materials use the existing bounded cache. Animation performs
no decoding, font loading or pixel readback.

## Heading baselines

From 0.7.3, Matrix names and type lines use explicit alphabetic baselines.
The source font has a positive descender in its hhea and OS/2 typo metrics.
Linux and macOS interpret its middle baseline differently, so a middle anchor
can place the same letters about 7–9 canonical pixels apart. The calibrated
positions are alphabetic anchors; changing their values would break the Linux fit.

The [portability evidence](../fixtures/accuracy/8ed/heading-baseline/source-parity.json.gz)
records four platform/engine metric probes, macOS Original/Oracle comparisons,
and 714 byte-identical Linux native layers. This fix applies wherever the Matrix
heading painter is used, including inherited Eighth defaults. Other fonts keep
their existing baseline policy. It does not recalibrate any set or certify old
client scores whose native images differ.

## Audit results

The [full audit](../fixtures/accuracy/8ed/full-audit.json) covers all 357 ordinary
English nonfoil printings, including the seven starter cards. Another 350
foil-only records stay in the inventory and wording review; they do not fit
ordinary pigment colors.

The diagnostic structure index improved from **70.19 to 81.36/100** using
corrected Original wording, identical references, frozen scan poses and the same
metric. The uncorrected 0.6.12 provider baseline scored 70.09/100 on those poses.
These are development measurements, not a percentage of visual fidelity.

| Component        | Before /100 | After /100 |
| ---------------- | ----------: | ---------: |
| Title            |       62.67 |      93.27 |
| Type line        |       75.61 |      95.49 |
| Cost symbols     |       75.20 |      88.01 |
| Rules region     |       47.27 |      58.43 |
| Expansion symbol |       87.51 |      89.53 |
| Power/toughness  |       78.82 |      81.70 |
| Frame            |       82.03 |      89.53 |
| Credits          |       58.28 |      72.28 |

The fitted geometry follows the source frame, art aperture and rules box.
An outline derived from the existing stock mask restores the missing thin
inner line without a rectangular crop. Separate frame, paper and header
adjustments preserve source texture. The black frame uses a measured tone
curve so a flat brightness adjustment does not erase its highlights.

Mana fitting treats disc diameter, row pitch, glyph placement and generic-number
geometry separately. Paper colors come from ink-excluded annuli. The large
basic-land symbols have separate contour fits and a shared canonical shadow.
Expansion-symbol fitting uses the filled, styled SVG rather than its view box.

Titles and type lines use native filled-letter measurements. Rules use a shared
size ceiling and one-line centering for this printing. A bounded compact-leading
rule keeps six crowded cards readable. Three Original land passages have
content-bound size limits. Oracle wording fits its own text.

[Exact printing reviews](../fixtures/accuracy/8ed/annotations-types.json) correct
historical type lines. [Artist reviews](../fixtures/accuracy/8ed/annotations-artists.json)
preserve printed names. The [serial review](../fixtures/accuracy/8ed/collector-review.json)
covers starter denominators and foil metadata stars. City of Brass selects the
Eighth gold land plate while preserving its semantic colors.

## Scan normalization and regression checks

The [normalization receipt](../fixtures/accuracy/8ed/native-normalization-review.json)
accepts all 357 nonfoil scans. A fixed six-parameter affine fit accounts for
translation, scale, rotation and shear using physical frame strips.
Replacing central printed content changes none of the poses. All 144 known
full-resolution raster-warp controls pass the fixed error limits.
The renderer never receives these per-scan comparison poses.

The [source compatibility receipt](../fixtures/accuracy/8ed/source-compatibility.json)
records 266 unaffected cases and 1,596 exact native face/etching comparisons.
It permits unchanged families to retain their scores while changed Eighth
families require a fresh review. Unknown executable changes invalidate reuse.
The final lazy-preparation fix also preserves all 714 Eighth face/etching images.

Cross-stock samples improved from 73.96 to 76.22/100 on twelve 9ED cards and
58.10 to 61.32/100 on seven nonfoil Mirrodin cards. These checks support using
the default; they do not certify either receiving set.

The [native pigment diagnostics](../fixtures/accuracy/8ed/native-pigment.json)
retain fixed-window color and contrast differences separately from the structure
index. Land groups use their physical frame palette, including City of Brass.

## What transfers

Ordinary Eighth-style frames inherit compatible geometry, typography, mana,
materials, basic-land glyphs and footer style when no exact fit exists.
The recipient retains its set symbol, copyright year, collector denominator,
printed wording and independently reviewed overrides. Black stock stays black;
white stock stays white.

Printing-specific one-line centering and Original text exceptions do not transfer.
Planar Chaos, colorshifted, retro, planeswalker, split and other dedicated layouts
retain their independent policies. Source assets without a measured color fit
remain unchanged. The resolver reports inherited, exact and source components;
a default does not mark a receiving set complete.

Use `calibration: 'printing'` for exact-only data or `calibration: 'source'`
for source colors with the selected layout. With `card-glint/magic/lazy`,
await `prepareMagicCards(faces)` before synchronous asset or layout queries.
Face-aware preparation avoids unrelated donor tables.

## Remaining review

Some source textures and baked bevels differ from the references. The large white
basic-land symbol has a heavier inner ring. Some manually typeset flavor passages
and line breaks need further work. A universal flavor-text shrink rule was
rejected because it damaged other cards. The full audit includes a low-text
review list and keeps these limitations visible.

Foil-only appearance and full receiving-set calibration remain separate work.
The audit does not grant complete-set or score-publication approval.

## Reproduce the measurements

Keep scans and generated images outside Git. Run from the repository root:

```sh
export MAGIC_ACCURACY_CACHE=/path/to/private-cache
node games/magic/tools/accuracy/fetch.mjs --set 8ed
node games/magic/tools/accuracy/fetch-printing-text.mjs --set 8ed
node games/magic/tools/build-printing-corrections.mjs
node games/magic/tools/build-set-data.mjs
node games/magic/tools/accuracy/printing-calibration-inputs.mjs \
  8ed /path/to/study/inputs.json --fetch-assets
node games/magic/tools/accuracy/printing-calibration-native.mjs \
  /path/to/study/inputs.json /path/to/study/native
node games/magic/tools/accuracy/printing-calibration-normalize.mjs \
  /path/to/study/inputs.json \
  games/magic/fixtures/accuracy/full-set-scan-templates/8ed.json \
  /path/to/study/normalization --eighth-native-affine
node games/magic/tools/accuracy/printing-calibration-score.mjs \
  /path/to/study/inputs.json /path/to/study/native \
  /path/to/study/normalization \
  /path/to/reviewed/accuracy-metrics.mjs /path/to/study/scores --diagnostic
```

Use the same frozen poses and metric module for before/after results.
`printing-lettering-masks.mjs NATIVE OUT` records actual filled glyphs; every
instrumented full-card image must match the native capture before its masks are
accepted. `printing-rules-study.mjs` reuses native text measurements for bounded
parameter trials. Empty study adjustments must reproduce production output.

`eighth-audit-report.mjs PRIVATE_STUDY OUTPUT_JSON` joins the named complete
audit stages and checks all native hashes. The optional
`eighth-native-pigment-audit.py PRIVATE_STUDY OUTPUT_JSON` measures fixed-window
pigment statistics using NumPy and OpenCV. Neither tool changes scan poses or
grants publication approval. See the general
[calibration guide](calibrating-a-set.md) for submitting evidence.
