# Special-frame audit against 0.2.15

This is an initial visual and routing audit, not completed calibration. The
renderer is unchanged from release source `bc93999921bd3b4f77f826aac89651e55df0bb60`.
All 29 physical faces render, but none passes the existing ordinary-frame
registration policy. Accuracy scores remain null; the diagnostic overlays are
explicitly unaligned. Their large structural differences are useful evidence,
but pixel-sized placement conclusions must wait for proper frame templates.

## Reference coverage

The cohort contains all 14 ordinary Dominaria Sagas, plus Elspeth Conquers Death,
Medomai's Prophecy, The Trickster-God's Heist, Urza's Saga, The Cruelty of Gix,
and both sides of Fable of the Mirror-Breaker. This covers all five colors,
grouped chapters, four chapters, multicolor and land frames, Read ahead and a
transforming Saga. The second group contains Fire // Ice, Wear // Tear,
Dusk // Dawn, Dollmaker's Shop // Porcelain Gallery, and both sides of Delver
of Secrets and Bala Ged Recovery. In total: 26 printings, 29 physical faces,
12 sets. Special treatments and printings without a nonfoil option are excluded.

Full PNG scans and art crops come from cached Scryfall metadata. Each physical
side gets its own scan/art pair. Printing wording comes from MTGJSON joined by
Scryfall ID, face name, collector number and language, with duplicate/missing
joins rejected. Split cards retain one physical reference and shared art sheet.

Some MTGJSON split records contain the entire joined `originalText` on both
faces. The audit separates this only when both records agree exactly and there
is one `//` delimiter. An extra second-face type label is removed only by an
exact match. Each face uses its own colors; parent-card color unions cannot
choose a split panel's frame. Synthetic regression tests cover these boundaries.

## Findings

| Family                | Observed defects                                                                                                                                                                                                                                                                | Required work                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ordinary Saga         | History of Benalia's reminder is too far inward and consumes excessive height; chapter blocks and grouped badges fall below their reference positions. The decorative vertical chapter rail and paper pattern are missing. The title/type frame, footer and stamp still differ. | Dedicated frame-only normalization; measure real text before assigning chapter heights; separate reminder geometry, grouped chapter spacing, rail/paper and dividers. |
| Read ahead Saga       | The Cruelty of Gix paints the whole introductory row upright. Parenthetical reminder text should be italic.                                                                                                                                                                     | Preserve styled runs inside special rules instead of treating an entire row as one style.                                                                             |
| Transforming Saga     | Fable lacks the top-left transforming indicator and reverse-side 2/2 hint. Its reverse uses an ordinary frame instead of the printed enchantment/transform treatment.                                                                                                           | Explicit physical-side and frame-effect data, correct front/back plates, hints and title clearances.                                                                  |
| Old split             | Fire // Ice gets modern component frames and fonts despite explicit retro inputs. `isRetro` rejects split-half layout, so old-frame intent does not reach a dedicated split painter.                                                                                            | Old-border split assets and geometry; independent panel typography and credits.                                                                                       |
| Fuse split            | Wear // Tear has two isolated rounded frames instead of the joined frame, an incorrect Fuse strip and duplicated Fuse reminder. The painter filters `rulesText` while retained `rulesParagraphs` still contains Fuse.                                                           | Joined split plates, one shared Fuse region, synchronized text inputs, watermark and per-panel footer treatment.                                                      |
| Aftermath             | Dusk // Dawn has the correct relative panel rotation but wrong panel proportions, art apertures and frame joins.                                                                                                                                                                | Dedicated aftermath geometry/assets; validate each panel after whole-card registration.                                                                               |
| Room                  | Dollmaker's Shop // Porcelain Gallery is routed through ordinary split panels. The continuous illustration, shared type/reminder strip and asymmetric boxes are missing.                                                                                                        | Dedicated Room layout rather than a split alias.                                                                                                                      |
| Transform / modal DFC | Delver's reverse lacks the moon icon, dark back-face title/type/PT treatment and color indicator. Bala Ged Sanctuary lacks the reverse-side header treatment and bottom other-face type/cost banner.                                                                            | Per-side frame variants and explicit indicator/banner fields. A rendered raster is not evidence of correct DFC support.                                               |

The browser currently rejects these layouts at its reference adapter. That gate
is separate from the renderer limitations above. Keep unsupported cases explicit
until each family has accurate inputs and appropriate comparison regions.

## Next implementation order

1. Ordinary Dominaria Sagas: inspect native source boundaries/masks and establish
   frame-only anchors. The current bottom search window mostly finds no stable
   Saga edge; relaxing its acceptance threshold would produce misleading fits.
2. Replace character-count height estimates with the actual measured layout.
   Give the reminder its own inset/height; attach badges and dividers to measured
   chapter blocks. Preserve the decorative rail when compositing the paper.
3. Verify on reserved Dominaria names, then THB/KHM/MH2 without per-card renderer
   tuning. Add Read ahead and transforming-Saga variants separately.
4. Implement split/aftermath and physical DFC variants, then Rooms. Use the
   [previous asset research](frame-asset-research.md#asset-candidates) for the
   pinned Room/DFC candidates and MSE's Saga resizing/layout references.
5. Extend the review browser's per-face cache/input adapter and region scoring
   after library support is validated. Never fit text or symbols to themselves
   when normalizing a scan.

## Reproduction

After the major-set metadata inventory is cached:

```sh
node tests/magic-special-frame-input.mjs
node games/magic/tools/accuracy/special-frame-audit.mjs
```

The audit saves captures and a detailed manifest under the ignored
`test-results/magic-accuracy/special-frames-v0215/` directory. It uses one browser
for raster preparation and CPU calculations for registration. The manifest
retains renderer/font/study hashes, exact source objects, per-face inputs and
rejected registration details. A compact receipt lives in
`fixtures/accuracy/special-frame-audit.json`. The local review gallery is kept
outside this library, and no scan/art raster is added to the public showcase.
