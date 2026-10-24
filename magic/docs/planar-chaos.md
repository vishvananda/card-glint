# Planar Chaos frames

[Magic pack](../README.md) · [Documentation index](README.md)

For Planar Chaos's color-shifted printings, retain the physical treatment with
`frameAssetFamily: 'eighth', frameTreatment: 'colorshifted'`, including when
showing Oracle wording. This selects the pinned Card Conjurer color-shifted
plates, white shadowed title/type/P/T ink and matching badges. Ordinary and shifted
PLC spells use a shared inner-frame fit and separately measured title/type sizes
and positions. The opt-in `set-hsb-v1` palette separates frame, rules paper,
title and type panels, retaining source colors where validation rejects a change.
[Frozen poses and regional measurements](../fixtures/accuracy/planar-normalization.json)
cover 156 accepted scans with 33 training and 123 held-out cards; these are not
whole-card accuracy scores. A shared mana fit and expansion-symbol rectangle
cover both treatments while preserving caller adjustment deltas.
[Symbol replay](../fixtures/accuracy/planar-symbols.json) and an independent
[text-only audit](../fixtures/accuracy/planar-lettering-audit.json) retain component
measurements; the latter excludes bevels that can confound lettering scores after
recoloring. [Rules and footer replay](../fixtures/accuracy/planar-text.json) records
shared body spacing and artist/legal/P/T ink fits. Body spacing retains existing
font sizes and line breaks: a font/reflow proposal was rejected after large
individual regressions. The repeated validation improves 96/123 body regions,
123/123 artist and legal lines. A subsequent [font and pinline replay](../fixtures/accuracy/planar-details.json)
uses MSE's native ModMatrix P/T face, including its proportional `1` and variable
stat star. All 84 validation P/T regions improve against the original imported
defaults. Six two-color gold cards use Card Conjurer's native pinline mask and
their colored frame materials; three-color cards retain gold rails. Remaining
text-size and wrapping outliers, badge shape and isolated color/source differences
stay in the review queue.
The [full-set report](../fixtures/accuracy/planar-fullset.json) scores all 156
accepted scans: the structural index rises from 64.6/100 to 81.3/100, with 155 cards
improving. Six rejected scans and three split cards remain excluded. The index
includes measured lettering, symbols, frames, art and credits; color is reported
separately. Corner regions and a separate full-raster diagnostic include the
silhouette. These are similarity indices, not percentages of correct pixels.
Unsupported colorshifted land/multicolor combinations fail explicitly. Ordinary
and shifted PLC cards include the verified 2007 legal line and `/165` numbers.
Source: [Card Conjurer's 8th colorshifted pack](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/js/frames/pack8thColorshifted.js).
The [8th pack's pinline mask](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/js/frames/pack8th.js)
and [MSE ModMatrix](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/blob/16f1d13bb7f5924613fc1ddc25da582beccfefb6/Magic%20-%20Fonts/ModMatrix.ttf)
remain external, pinned assets.
