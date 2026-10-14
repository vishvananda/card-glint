# Saga layout: native plates and measured chapters

This is a measured improvement pass, not a claim of scan identity. It compares
all 14 ordinary Dominaria Sagas plus six Saga faces from THB, KHM, MH2, DMU and
NEO against the frozen v0.2.15 audit. The receipt is
[`fixtures/accuracy/saga-native.json`](fixtures/accuracy/saga-native.json).

## Assets and rules investigated

[Card Conjurer’s Saga pack](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/js/frames/packSagaRegular.js)
has complete frame plates, a chapter badge, divider, stamp and native bounds.
Its older `data/images/cardImages/saga/` colored plates retain texture; the
newer `img/frames/saga/regular/` colored plates are visibly smoother. The older
colored set is used with the current land and transforming plates. This keeps
the art aperture, bookmark and lower type bar in one coordinate system.
The advertised regular artifact/colorless URLs do not exist in this revision;
unsupported neutral nonland Sagas report an error instead of inventing a frame.

[Magic Set Editor’s Saga style](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/blob/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-saga.mse-style/style)
uses separate reminder and chapter areas, measured text, movable cell divisions
and grouped badges. Both editors permit manual chapter heights. Neither provides
an automatic formula guaranteed to reproduce every printed Saga.

The pack now uses actual Canvas text measurements, shared chapter padding,
a fixed reminder region, and a common font size that shrinks until all chapters
fit. Sparse two-cell layouts with merged opening chapters retain some space at
the bottom. This policy uses text and chapter structure, never a card identity
or scan. Badges are spaced independently of their height; Roman numerals use
the pinned Plantin Semibold face. Long chapters cannot overflow silently.

A bounded parameter study selected shared defaults using Dominaria, with the
other sets reported separately. The selected padding also avoids a material
transfer regression seen with the best Dominaria-only score. These are validation
sets for this iteration, not an untouched scientific test set.

`reverseStats: { power, toughness }` supplies the small reverse-face reminder
on transforming Saga fronts. The NEO front icon and plate are included. This
field and the physical layout participate in face cache identity. Fonts load
once during preparation; small decoration images retain their native dimensions.
No work was added to the animation/render loop. `sagaRuleLayout` is available
from the Magic presentation entrypoint for hosts needing the measured layout.

## Comparison and normalization

`node games/magic/tools/accuracy/saga-study.mjs saga-native-final` reuses cached
references and printed wording from the initial audit. It loads assets once into
one browser for raster capture. Alignment and edge comparisons run on the CPU.
The comparison does not measure GPU completion or rendering throughput.

Each scan is fitted against its exact, checksum-identified native plate, before
scoring text. Two methods are available: signed outer-edge detection where four
straight boundaries are visible, and local gradient-profile matching where the
lower frame is curved or the stock is textured. Both exclude title, artwork,
rules and symbols. Fit and validation strips are disjoint. Existing translation,
scale, rotation, skew and residual bounds are unchanged. When both methods pass,
their corner transforms must agree within 1.25 canonical pixels.

The same frozen scan transform is used for before and after. Per-card transforms,
rejections and asset/source hashes are retained in the local audit. Three cases
remain unscored: The Antiquities War (methods disagree), The Eldest Reborn
(validation failure), and The Cruelty of Gix (insufficient frame support).

A second text metric suppresses low-contrast paper motifs before structural edge
comparison. Both the ordinary local-contrast metric and this dark-ink metric are
reported. This is suitable for these nonfoil scans; it is not a general foil or
light-ink policy. Edge F1 is not a percentage of overall visual accuracy.

Across the 17 accepted frames, mean dark-ink edge F1 within one canonical pixel:

| Region   | v0.2.15 | Current |
| -------- | ------: | ------: |
| Name     |   0.356 |   0.800 |
| Reminder |   0.239 |   0.758 |
| Chapters |   0.339 |   0.494 |
| Type     |   0.687 |   0.888 |

Chapter F1 improves from 0.308 to 0.473 on the 12 accepted DOM cards, and from
0.415 to 0.546 on five accepted faces from other sets. Three individual chapter
scores regress: The Mirari Conjecture, Time of Ice and Rite of Belzenlok. They
remain explicit review candidates, not hidden by the aggregate improvement.

The study supplies collector totals and release-year legal lines from cached
MTGJSON set metadata, and normalizes its type separator to an em dash. These are
comparison input improvements, not inferred runtime vocabulary. Footer fidelity
is not included in the table. Original printed artist aliases may still differ
from the current artist name in both Scryfall and MTGJSON.

## Remaining work

### Two-color gold Saga follow-up

The gold plate alone omits the paired colors. Ordinary two-color Sagas now
composite the source's pinline, bookmark and right-bookmark masks with the two
colored plates, then restore the narrow gold center stripe. The color order
uses the existing WUBRG pair order. Gold paper and frame material remain intact;
land and transforming plates keep their existing treatment. The prepared
overlay is cached by decoded source identity, with no mask readback.

The [Kaldheim receipt](fixtures/accuracy/saga-colors.json) covers all 20 ordinary
nonfoil Sagas and all ten color pairs against identical v0.2.16 inputs. Seven
scans pass the existing frame registration gates; the other thirteen remain
visibly raw and unscored. This is visual coverage of the missing pieces, not a
new HSB calibration. Chapter scores do not measure their colors.

The Trickster-God's Heist exposed a literal `|` separator before chapter III in
the supplied printed text. Saga parsing now recognizes that separator only
when followed by an explicit Roman chapter label and dash. Other literal bars
are preserved. Its chapter F1 improves from 0.376 to 0.765; the other six scored
Kaldheim cards' chapter scores are unchanged. No text-size defaults changed.

Reproduce with `saga-color-study.mjs --baseline` using `MAGIC_CAPTURE_ROOT`
pointing to a v0.2.16 checkout, followed by `saga-color-study.mjs`. The audit
retains exact input, source, renderer and scan-transform hashes. Local review
images remain outside the library.

### Open issues

- Dominaria's large paper motifs are absent from all inspected candidates.
  The replacement paper texture and hologram remain approximations.
- Chapter divisions, line breaking and vertical spacing still have visible
  outliers. More printed line/divider annotations are needed before claiming
  matching typography; retain the regressions above in the next study.
- Complete reliable registration on the three rejected faces. Do not tune their
  text against unnormalized scans or loosen the residual checks to admit them.
- Validate more transforming Saga fronts and their reverse sides, four-plus
  chapters, Read ahead, and other special Saga treatments before broad claims.
- Then apply the same source-led process to split, aftermath, DFC/MDFC and Room
  layouts identified in the initial audit.

Reference images and review HTML stay in the ignored cache/private review project,
not the public showcase or release assets.
