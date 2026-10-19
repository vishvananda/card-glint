# Alpha and Beta mana audit follow-up

The geometry and pigment studies use the published 0.5.4 rendering and frozen
frame-only scan poses. `study-review.json` records selection and validation
results. Every active glyph/numeral family must change pixels and match a
separate full native trial exactly; the older no-op Alpha numeral search is
superseded. Width and height are checked independently. Disc placement and
spacing are also measured from perimeters, independently of glyph edge overlap.

The initial Alpha white proposal was tested on all 45 white printings. Its
calibration gain of 0.002900 falls below the predeclared greater-than-0.003 gate;
retain the current geometry. Generic numerals are judged across mixed colored
costs too. The existing per-color paper/ink targets remain: proposed pooled
changes either regress validation cards or offer too little improvement.

All 597 original headers were visually reviewed. `headers.json.gz` contains that
cost-only evidence. Alpha Cyclopean Tomb prints no cost; Orcish Artillery and
Orcish Oriflamme print 1R. Only those three exceptions enter runtime data. Oracle
wording and Beta costs remain independent. A weak perimeter on Cyclopean Tomb
was an incorrect input expectation, not a bad scan.

`native-review.json` binds final 0.5.5 candidate pixels to the actual published
0.5.4 parent hashes. The full replay contains 295 Alpha and 302 Beta cards;
only the three Alpha costs change, with no changes outside the header or in
artwork or silhouettes. Alpha's other 292 scores reuse exact native pixels.
Beta's complete native replay remains byte-identical. Cyclopean Tomb loses an
inapplicable mana metric, changing aggregate weights; that decrease is not a
pixel regression. These local two-stage scores are separate from Lab's raw
single-pass scores.

Retained limitations from the original audit still apply: source textures and
secondary inner-border details, some manual typesetting, three rejected Alpha
frame poses, and individual low-confidence perimeter measurements. No card gets
a renderer offset to compensate for its scan.

Reproduce with `abu-mana-study.mjs INPUTS POSES OUT MODE SELECTION`, where MODE
is `global`, `axes`, `glyphs`, or `glyphs-wide`, and SELECTION is `sample` (the
preselected names) or `all`. Use `abu-mana-audit.mjs` for disc pigment/perimeters,
`mana-spacing-audit.mjs` for pitch, and `abu-native-capture.mjs` for final replay.
The compressed JSON contains metadata and measurements, not artwork.
