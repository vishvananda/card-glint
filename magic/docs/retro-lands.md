# Revised land frame notes

[Magic pack](../README.md) · [Documentation index](README.md)

Revised lands use the pinned Fourth-family land texture with a fitted art opening,
white outer stock and a new inset dark outline. Colored pinlines and concentric
dual-land paper bands retain the original source texture. Semantic `frameColors`
select their palette independently of original versus Oracle wording. Materials
are prepared once in the bounded bitmap cache; color-option changes have distinct
cache keys. Printing HSB remains opt-in through `colorCalibration`.

Shared title, type, rules and artist defaults cover all 25 Revised land printings.
Artist credits include `Illus. ©`; nonland Revised cards already used this format.
[Calibration evidence](../fixtures/accuracy/3ed/land-fourth-calibration.json) records
thirteen calibration and twelve held-out printings with frozen scan poses. Mean
whole-card structural match rises from 40.9/100 to 75.7/100; the held-out mean rises
from 41.8/100 to 75.1/100. This is a structural similarity index, not a percentage of
correctness. A larger basic-land text-size proposal regressed held-out cards and
was rejected. Remaining source texture and art-color differences stay visible.
