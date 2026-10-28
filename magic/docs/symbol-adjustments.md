# Symbol adjustment controls

[Magic pack](../README.md) · [Documentation index](README.md)

Ordinary faces accept `symbolAdjustment: { mana, set }`. Each transform supports
`dx`, `dy` (canonical 488 × 680 pixels, −8 to +8) and `scaleX`, `scaleY`
(0.75–1.25). The anchor is the group's right edge and vertical center. Mana
scaling includes the complete cost and its spacing; set-symbol width and height
can vary independently. Title/type fitting respects adjusted symbol bounds.
Zero/absent transforms preserve the default raster. Unsupported special layouts
are rejected. These opt-in controls do not alter any calibrated defaults.

The opt-in symbol experiment also accepts `mana.numberScale` (0.75–1.25),
`numberDx`/`numberDy` (±4 canonical pixels), and `spacing` (±4 pixels).
Numeric glyph adjustments preserve the disc and its shadow. Spacing changes
inter-symbol gaps with the rightmost disc fixed, before whole-cost scaling.
Glyph separation happens once during preparation in a bounded cache; it does
not read back masks while painting. Identity adjustments preserve release pixels.

Historical glyph selection and printed cost order are documented in
[historical mana](historical-mana.md), with a 51-set study through Eighth Edition.
