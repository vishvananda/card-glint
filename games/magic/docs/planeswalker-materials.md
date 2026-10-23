# Standard planeswalker materials

[Magic pack](../README.md) · [Documentation index](README.md)

Standard planeswalkers use pinned Card Conjurer regular/tall background
textures in white, blue, black, red, green, gold and colorless. Each palette has a
shared HSB correction for both heights. Existing frame pinlines, type/title paper,
ability paper, typography, loyalty badges and footer remain separate components.
The original 0.6.3 material study changed the upper-right type-box curve.
Later releases also adjusted geometry and the inner bevel. Use the current
painter for layout; these background measurements do not freeze that older shape.

[Source selection and HSB defaults](../src/presentation/planeswalker-sources.ts),
[native evidence](../fixtures/accuracy/planeswalker-materials/native.json), and
[reproduction tools](../tools/accuracy/planeswalker-reconstruction/README.md) describe
the measured scope. This does not mark every planeswalker printing fully calibrated.
The additional source is fetched only for planeswalkers and prepared once per
material under a separate 64 MiB cache. `clearEarlyHsbBitmaps()` also retires these
derived backgrounds. `composeCardTexture` prepares them automatically; custom
low-level painters keep their existing source-asset behavior.
