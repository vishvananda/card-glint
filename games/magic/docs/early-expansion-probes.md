# Frozen release probes for early expansion sets

Use these tools before changing Arabian Nights, Antiquities or The Dark. They
compare original wording against fixed scan poses. They do not mark a set
complete or publish calibration values.

Set `MAGIC_ACCURACY_CACHE` to your reference cache. Keep scans, artwork, native
PNGs and extracted release files outside Git. Use one browser per command; the
tools reuse loaded fonts and cached images between cards.

## Freeze the inputs and released baseline

Download a published browser ZIP and its `release.json` metadata. Use the same
renderer source revision to prepare the baseline. The capture tool checks the
archive size and SHA-256 before extracting it, and removes its temporary copy
when finished. It loads every external asset from the frozen local cache.

```sh
study_dir=./test-results/arn-recheck

node games/magic/tools/accuracy/early-printing-inputs.mjs arn "$study_dir/inputs"
node games/magic/tools/accuracy/early-calibration-normalize.mjs \
  "$study_dir/inputs/inputs.json" "$study_dir/normalization"
node games/magic/tools/accuracy/early-released-capture.mjs \
  "$study_dir/inputs/inputs.json" \
  "$study_dir/normalization/normalization.json" \
  ./card-glint-VERSION-browser.zip ./release.json "$study_dir/released"
```

Inspect the normalization boundaries. Rejected poses need review; do not adjust
a scan against the body text or a proposed symbol position to force acceptance.
The released capture records rejected poses too. The typography probe below
requires accepted poses for all of its supplied cards.

## Compare the existing source families

```sh
node games/magic/tools/accuracy/early-source-family-study.mjs \
  "$study_dir/inputs/inputs.json" \
  "$study_dir/normalization/normalization.json" "$study_dir/families"
```

An optional final JSON argument specifies each source plate's placement:

```json
{ "W": { "fourth": { "frame": [0.008, 0.006, 0.988, 0.993] } } }
```

Material keys are W, U, B, R, G, A and L; basic-land plates use WL, UL, BL,
RL and GL. Neutral lands include Fourth as a candidate. Source geometry belongs
to the renderer; it is separate from each scan's frozen normalization.

Compare geometrically compatible plates before choosing a family. The tool
records native plate pixels, asset hashes, support and regional scores. All
families use the same eroded opaque support so transparent art windows cannot
improve their scores. A default-placement run alone cannot establish which
source family fits best. A lone basic-land printing cannot provide an independent
within-material validation group.

## Test shared text policies

Create a definition file whose first candidate is the unchanged control:

```json
{
  "schema": 1,
  "candidates": [
    { "id": "current", "adjustment": {} },
    { "id": "fractional", "adjustment": { "fractionalMetrics": true } },
    { "id": "regular-22", "adjustment": { "regular": 22 } }
  ]
}
```

```sh
node games/magic/tools/accuracy/early-expansion-body-study.mjs \
  "$study_dir/inputs/inputs.json" \
  "$study_dir/normalization/normalization.json" "$study_dir/released" \
  ./body-candidates.json "$study_dir/body-matrix.json"
```

The study instruments the production expansion layout without installing those
controls in the shipped renderer. Each default must reproduce its released PNG.
The rules-only replay must also agree with the native control within one gray
level on the exact comparison grid, including inline symbol sampling.

Available probes are regular size, width and leading (`regular`, `textWidth`,
`regularLeading`); compact size, width and leading (`compact`, `compactWidth`,
`compactLeading`); centered size, width, leading and optical offset (`large`,
`largeWidth`, `largeLeading`, `largeOffset`); `bounds`, `largeBounds`;
and `fractionalMetrics`. Bounds use canonical 488 × 680 pixels. These are
measurement controls, not new public rendering options.

Select one shared policy using calibration names only. Report validation
separately. Previously inspected cards and alternate printings of one name
are development evidence, not fresh holdouts. Every accepted candidate must
preserve the complete text sequence and avoid overflow.

Append an output directory to the typography command to verify one selected
candidate through full native face and etching replays. This mode requires
exactly the control and one candidate. It records prediction parity and rejects
changes outside the rules region or to the silhouette and default etching.
Identical complete layouts reuse their measured rasters within each card; the
result records both candidate and raster-measurement counts.

Regional edge scores help fit layout. They do not certify filled ink, ink tone,
copyright, color, source texture or overall accuracy. Inspect the native full
card and overlays, replay the chosen values through the production painter,
and check Oracle and unaffected sets before adopting a profile. See
[the full calibration procedure](calibrating-a-set.md).
