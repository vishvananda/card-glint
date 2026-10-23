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
