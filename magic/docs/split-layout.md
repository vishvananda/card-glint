# Old-border, 2003 and M15 split frames

Ordinary Instant/Sorcery split cards now have dedicated old-border and 2003
plates, including the connected name/type bars and shared Fuse strip. The
old-border path follows `frameStyle` and the known old sets; the 2003 path
recognizes DIS, PLC, CMD, PC2, DGM, MMA and C13. Hosts can select it explicitly
with `frameAssetFamily: 'eighth'`. This pass validates INV, APC, DIS and DGM;
the other routed sets still need their own scan cohorts.

The pinned Magic Set Editor templates are `magic-old-split`,
`magic-new-split` and `magic-new-split-fuse`. A single reading-orientation map
controls painting, art clipping, printing-layer holes, artwork edge sources and
foil apertures. The right Fuse plate extends into the join independently of
its artwork. Per-face art/crop overrides remain available; a parent art sheet
splits at its midpoint. Each panel keeps its own artist. Fuse is removed from
both child text representations and painted once with the supplied run styles.
Changing that reminder or a guild watermark invalidates the face cache.

Two-color 2003 plates retain their gold material and use the source's blend
mask for colored pinlines/paper. Converting the small RGB mask to alpha occurs
once per decoded mask during preparation. No image decode, font load or mask
readback is added to the display loop. Guild watermarks are optional presentation
metadata (`watermark: 'boros'`, for example), resolved to pinned pack-owned URLs.
Original and Oracle text remain host inputs; this renderer never substitutes
current wording during layout matching.

## Validation

The private cohort contains every ordinary English nonfoil split card in
Invasion (5), Apocalypse (5), Dissension (10), and Dragon's Maze (15). The
immutable baseline is v0.2.16 with the exact same input, art crop and original
wording. GRN/RNA baseline captures are also cached for the following M15 pass.

Frame normalization uses only four outside frame rails. Independent fit and
validation samples gate bounded translation, scale, rotation and skew. Art,
titles, rules, watermarks and expansion symbols cannot move the scan to improve
their own scores. Rejected models remain raw and unscored. Text comparison uses
local dark-letter contrast and edge distance, not RGB/color similarity.

Final measurements and hashes are recorded in
[the compact receipt](../fixtures/accuracy/split-native.json). They are exploratory
cohort results, not independent typography validation or whole-card accuracy
percentages. Size/spacing trials are shared by set, never saved per card.

## Reproduction

```sh
MAGIC_CAPTURE_ROOT=/path/to/v0216-checkout node games/magic/tools/accuracy/split-study.mjs --baseline
node games/magic/tools/accuracy/split-study.mjs split-native-verified
node games/magic/tools/accuracy/split-text-search.mjs split-native-verified
```

The tools reuse the ignored content-addressed source cache and refuse to
replace an existing audit. One browser session rasterizes a batch; frame fits
and structural metrics run on the CPU without Chromium. This is an accuracy
study, not a render-speed benchmark; CPU submission time would not establish
GPU completion time. Full scans, artwork, templates and trial images remain
outside the published package. The comparison page lives in the separate
maintainer application.

## M15 spell splits and Fuse

The M15 path uses CardConjurer's full split and Fuse plates, including joined
arrow-shaped name/type bars and the common Fuse strip. Two-color gold panels
retain gold outer stock with colored pinlines; hybrid panels use the ordered
color pair throughout with neutral MSE label paper. Prepared pair plates have
a 16 MiB LRU keyed by decoded source identity. Eviction releases canvas storage;
there is no mask readback or material work in the animation loop.

GRN/RNA use a 310.216-pixel panel separation in the reading orientation. Shared
GRN typography trials selected a 24.25-pixel maximum and 74-pixel left inset;
RNA is the transfer cohort. Modern Fuse has less rules-box height and uses a
separate 20.25-pixel maximum, with short rules centered. That trial uses GK1/CMR,
reserving DMC/MOC for transfer. Original wording and the exact same art sources
are used for both renderers. All typography values apply to a family, not an
individual card.

Modern frame normalization explicitly excludes the authenticity-stamp footprint
from the lower rail, in addition to excluding art, rules and symbols. This can
reject scans accepted by the exploratory first capture; scores are only reported
for the stricter accepted cohort. Missing Guild Kit expansion symbols, source
watermark omissions, artist capitalization, fine symbol sizing, paper colors
and occasional line wraps remain visible review items.

The [M15 receipt](../fixtures/accuracy/split-modern.json) records 14/20 accepted
fits. RNA left/right mean text-edge F1 changes from 0.406/0.371 to 0.552/0.380.
Expansion, Colossus and Deploy retain wrapping regressions and remain flagged.
The [modern Fuse receipt](../fixtures/accuracy/split-modern-fuse.json) records 4/5
accepted fits; both reserved Wear // Tear printings improve on both halves.
The 35 previous old/2003 split renders remain pixel-identical after this change.
These measurements concern the indicated rules regions, not color or total
card accuracy. The modern fit rejects seven of the combined 25 scans.

```sh
node games/magic/tools/accuracy/split-study.mjs split-m15-final-v2 --modern
MAGIC_CAPTURE_ROOT=/path/to/v0216-checkout node games/magic/tools/accuracy/split-study.mjs split-m15-fuse-v0216-v2 --baseline --sets=gk1,dmc,moc,cmr
MAGIC_SPLIT_BASELINE=split-m15-fuse-v0216-v2 node games/magic/tools/accuracy/split-study.mjs split-m15-fuse-final --modern --sets=gk1,dmc,moc,cmr
```

## Remaining work

- Rooms need a dedicated layout, continuous art and their shared type strip;
  they are explicitly excluded from the native spell-split adapter. Universes
  Beyond and other special treatments have not been validated by this cohort.
- MSE's old/2003 plate assets are only 236/244 × 338 pixels per panel. Some bevels,
  textures and inner edges differ from scans. Higher-resolution replacements
  should preserve the measured apertures and be recalibrated independently.
- No ordinary-card HSB or set-symbol offsets are transferred to these new
  assets. Colors, watermark palettes, fine symbol sizing and legal-line styling
  need separate calibration. Rejected scan fits and rules-wrapping regressions
  stay visible in the review gallery.
