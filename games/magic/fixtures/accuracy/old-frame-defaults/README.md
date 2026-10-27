# Old-frame default comparison

The table below records the original development pilot. The subsequent
[Ice Age adoption](ice-inheritance.json) is an inherited starting point in the
pending release; none of these results completes a target-set calibration.
The [live comparison](https://tetrarcum.com/early-sets/old-defaults/) contains all
110 examples, including rejected alignments.

| Set         | Accepted / pilot | Current | Fourth layout | Fourth frames + layout |
| ----------- | ---------------: | ------: | ------------: | ---------------------: |
| Ice Age     |          17 / 29 |   44.54 |         47.19 |                  60.77 |
| Mirage      |          17 / 29 |   66.29 |         61.72 |                  45.12 |
| Urza’s Saga |          20 / 26 |   65.90 |         62.60 |                  49.63 |
| Onslaught   |          15 / 26 |   60.19 |         56.33 |                  45.44 |

The captures are flat printed faces, without foil, wear or print-dot shaders.
This study does not measure GPU finish completion.

These are structural indices out of 100 for the accepted subset. Color groups
with no accepted pose have no measured mean. The other 41 cards stay visible as
diagnostics. The development examples were selected by printed-body length:
short, median and long per color/material, plus each basic and three nonbasic
lands. This is not an independent holdout.

Fourth is promising for the early post-Fourth family. It is a poor blanket donor
for the later sets in this pilot. Keep their existing later-frame sources while
calibrating a middle-period donor, such as Mirage, and a late donor, such as
Onslaught. Urza’s Saga provides an intervening transfer check. Seventh’s distinct
assets and white/black stock need separate validation.

## What changes in each trial

- **Current:** unmodified production painter and frozen Original inputs.
- **Fourth layout:** shared Fourth headings, body classes, footer and mana
  geometry; exact existing frame sources, placement and art bounds.
- **Fourth frames + layout:** additionally use the available Fourth frame
  definitions and their source-bound pigment correction. Keep the target stock
  color. Gold without a Fourth donor keeps its existing source.

All trials retain printing identity, rules, flavor, artist, historical symbol
era and current copyright strings. Target-set mana paper and ink remain local.
All 110 type lines were read from the exact scans; 51 imported types had modern
errata or labels. These changes exist only in the experimental inputs, not the
shipped wording catalog. Imported Original rules and current copyright still need
their own source audits.

Every current control matches its independently captured native PNG. Exact
native frame strips and art interiors also remain unchanged in the layout-only
trial. The broad frame score can change when shifted text overlaps a metric
region. There are no text overflows in the 330 trial faces.

## Scan alignment

Registration uses only outer-frame strips. A target side requires consistent
alternating scan-strip observations. Ambiguous copyright/boundary observations
are excluded from target construction. Per-card fits retain disjoint strip
validation and bounded translation, scale, rotation and shear. A diagnostic
affine fallback can account for unequal scan axis scale; its stretch does not
certify physical frame geometry.

One pose is frozen for all three candidates. Rejected cards remain unranked;
there is no per-candidate or text-based scan fit. The committed receipts preserve
all transforms, rejection reasons, input/reference hashes and numerical source
graphs.

## Repeat

The compressed inputs, native receipts and tool snapshots are bound in
[review.json](review.json). Images stay outside the repository. Restore the
matching content-addressed cache, then unpack a set’s input fixture:

```sh
gzip -dc games/magic/fixtures/accuracy/old-frame-defaults/ice-inputs.json.gz > inputs.json

MAGIC_ACCURACY_CACHE=/path/to/cache node \
  games/magic/tools/accuracy/printing-native-replay.mjs inputs.json native original

MAGIC_ACCURACY_CACHE=/path/to/cache node \
  games/magic/tools/accuracy/old-frame-default-study.mjs \
  inputs.json native/capture.json fourth-inputs.json \
  accuracy-metrics.mjs accuracy-policy.mjs new-study

node tests/magic-old-frame-default-study.mjs
```

The Fourth input snapshot supplies its pinned component cache inventory. Use
matching renderer, fonts and assets for the frozen controls. The numerical source
archive includes the scoring modules and registration graph. Current tools may
evolve; archived sources bind the reported experiment.

To select a fresh pilot from the cached set inventory, use
`old-frame-default-inputs.mjs SET NEW_OUTPUT`. Its imported type candidates
require scan review before scoring. A changed scan, source or wording needs new
evidence. No library interfaces or runtime defaults are changed here.

## Release sequence

The pending release enables inherited Fourth defaults for ordinary Ice Age
monocolor, artifact and supported land materials. Gold and custom frames keep
their existing sources. This is a starting point, not an independently calibrated
Ice Age profile or a completed set audit. Exact-printing policy opts out.

The following release should:

1. Calibrate Mirage and Onslaught independently, including frame geometry,
   source-bound frame/text-box colors and black level, headings, body, mana and
   set symbols, artist, legal text and power/toughness.
2. Compare Fourth, Mirage and Onslaught as complete donor profiles for each
   remaining major old-frame set. Use unchanged Original printing inputs and art,
   one frozen scan-only normalization per card, and identical metric definitions.
3. Report alignment coverage and component/color breakdowns alongside the whole
   score. Exclude rejected poses from the mean and retain them for review.
   Compare every cached ordinary nonfoil printing when available, rather than
   selecting only examples that favor a candidate.
4. Select the best donor per set, preserving target wording, symbol eras and
   surround color. Keep exact independent profiles and host overrides ahead of
   inherited defaults. Record unavailable materials and unresolved close results;
   inheritance must never mark a set independently complete.

The first comparison already shows why this needs three donors: Fourth improves
the Ice Age development cohort, while current Mirage/Urza/Onslaught sources beat
the Fourth replacement. Those pilot numbers do not certify entire sets.

## Ice Age integration check

The unmodified production painter renders 488 frozen cards in four modes
(1,952 variants). All 378 Fourth cards retain exact Original, both Oracle and
etching pixels/keys. All 81 Mirage, Urza's Saga and Onslaught Original controls
also remain exact. The 29 Ice Age examples use the new inherited policy except
for three gold cards, which retain their existing defaults.

The 17 accepted Ice Age poses reproduce the pilot's 44.54 → 60.77/100 mean:
16 gains and one loss. The other 12 scans are retained but excluded. This does
not measure an entire set or certify every material/color.

The production footer adds the matching 1995 copyright line. That line falls
outside this pilot metric's legal-text coverage, so its appearance does not
change the reported mean. Original printed artist names still need an Ice Age
source audit. The archived review records these limits and the exact source,
native, input, metric and parent-evidence bindings.
