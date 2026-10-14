# Old-border and 2003 split frames

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
[the compact receipt](fixtures/accuracy/split-native.json). They are exploratory
cohort results, not independent typography validation or whole-card accuracy
percentages. Size/spacing trials are shared by set, never saved per card.

## Reproduction

```sh
MAGIC_CAPTURE_ROOT=/path/to/v0216-checkout node games/magic/tools/accuracy/split-study.mjs --baseline
node games/magic/tools/accuracy/split-study.mjs split-native-final
node games/magic/tools/accuracy/split-text-search.mjs split-native-final
```

The tools reuse the ignored content-addressed source cache and refuse to
replace an existing audit. One browser session rasterizes a batch; frame fits
and structural metrics run on the CPU without Chromium. This is an accuracy
study, not a render-speed benchmark; CPU submission time would not establish
GPU completion time. Full scans, artwork, templates and trial images remain
outside the published package. The comparison page lives in the separate
maintainer application.

## Remaining work

- Newer M15 split cards need their own geometry, hybrid/gold material treatment,
  collector/stamp/footer and validation against GRN/RNA. Their existing fallback
  remains; this adapter does not claim those cards or Rooms.
- MSE's old/2003 plate assets are only 236/244 × 338 pixels per panel. Some bevels,
  textures and inner edges differ from scans. Higher-resolution replacements
  should preserve the measured apertures and be recalibrated independently.
- No ordinary-card HSB or set-symbol offsets are transferred to these new
  assets. Colors, watermark palettes, fine symbol sizing and legal-line styling
  need separate calibration. Rejected scan fits and rules-wrapping regressions
  stay visible in the review gallery.
