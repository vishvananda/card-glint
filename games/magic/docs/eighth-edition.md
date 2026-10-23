# Eighth Edition frames

[Magic pack](../README.md) · [Documentation index](README.md)

Eighth Edition loads its Matrix header font only when selected. Frame geometry
also drives GPU art windows, optical layers, hit regions and cache identity.
Prior old-frame HSB and scan-offset profiles are not applied to these assets.

Ordinary white-border Eighth Edition basics use a shared inner-frame stretch,
measured on ten printings and validated on nine others. Their art aperture follows
the fitted frame; the outer stock, corners and independently calibrated lettering
stay fixed. [Measurement and exclusions](../fixtures/accuracy/8ed/basic-land-geometry.json)
record the exact source revision and frozen scan poses. Other Eighth-family sets
and black-border treatments retain their existing geometry.
With `colorCalibration: 'set-hsb-v1'`, these basics also receive separately masked
header, paper and pinline colors, a shared outer-texture tone curve, and calibrated
large mana-symbol fills. The source's black lines, transparent art aperture and
neutral glyph shadows/highlights are preserved. Derived materials share the
existing bounded cache; warm preparation adds no pixel readback.
[Color measurements and limitations](../fixtures/accuracy/8ed/basic-land-colors.json)
include all nineteen aligned printings and the remaining rejected scan.

## Full-set audit

The current audit covers 707 ordinary English printing records: 357 nonfoil
references and 350 foil-only references. Foil references remain in the inventory
but do not supply ordinary ink-color measurements. The
[baseline report](../fixtures/accuracy/8ed/audit-baseline.json) lists the component
scores, rejected scan poses, reviewed corrections and remaining work.
These measurements are development diagnostics, not complete-set certification.

Original types are reviewed against the printing rather than copied from Oracle
or assumed correct because MTGJSON calls a field `originalType`. The
[type reviews](../fixtures/accuracy/8ed/annotations-types.json) correct creature
errata and pre-Aura enchantment labels. Each correction is bound to its printing
UUID and scan hash; it leaves Oracle wording and unrelated original text alone.

Eighth's rainbow-land provider inputs now select the gold plate. Semantic colors
remain unchanged, and the selected black or white surround remains explicit.
Other unreviewed rainbow-land eras retain their previous import policy.

To reproduce the baseline, run these commands from the repository root. Keep the
cache and study output outside Git. Source images stay in the private cache.

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
```

The input builder rejects nonempty Oracle body fallbacks. It records unresolved
printed types for scan review. Registration uses frozen physical scan targets and
disjoint fit/validation strips, without consulting renderer pixels.
The native sampler and fixed affine model accept all 357 nonfoil references.
Replacing the central printed content leaves every fit unchanged; 144 known
full-resolution raster-warp controls pass the fixed corner-error limits. The
[normalization receipt](../fixtures/accuracy/8ed/native-normalization-review.json)
records exact sources, numerical bounds and limitations. These are comparison
poses, never per-card renderer adjustments.

The separate
`printing-calibration-score.mjs` takes a reviewed metric module explicitly;
rejected poses remain listed with no numeric score. Do not mix metric identities
when comparing runs or importing scores into a host.

`printing-lettering-masks.mjs NATIVE OUT` records filled glyph coverage from the
actual painter. Every instrumented full-card image must exactly match the frozen
native capture before its masks are kept. It supports placement and size studies;
it does not approve a typography fit on its own.

Before using Eighth as a shared default, verify the corrected native output and
cross-check matching white-border and black-border sets. Exact independent set
profiles must win over inherited defaults. Transfer only values measured for the
same frame source and layout; keep outer-stock colors separate, and do not treat
inherited values as measurements of the receiving set.

Native heading studies use an explicit, source-bound parameter file passed as
the third argument to `printing-calibration-native.mjs`. A Vite study plugin
applies the proposed size, width and position before the production painter
measures the text. Zero-delta replays must match the unmodified capture. Study
hooks are development tools and are absent from the shipped renderer.
