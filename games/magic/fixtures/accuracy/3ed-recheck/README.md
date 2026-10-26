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
