# Frame asset selection

[Magic pack](../README.md) · [Documentation index](README.md)

Choose the physical frame before fitting colors or text. A source change can
invalidate geometry and pigment profiles that were measured against the old asset.
Use the [template catalog](standard-templates.md) to check support and the
[calibration guide](calibrating-a-set.md) to compare candidate assets.

`frameAssetFamily: 'eighth' | 'm15-accurate'` selects complete Card Conjurer
base plates. The painter uses the matching art aperture, text bounds, border
mask and P/T badge. These plates cover ordinary faces in five colors, gold,
artifact, colorless and land palettes. Two-color lands blend colored land plates
in mana order. Dedicated layouts can reject an incompatible asset-family choice;
check [printing compatibility](printing-presets.md) before offering it in an editor.

Frame geometry also controls art windows, optical layers, hit regions and cache
identity. Prepare decoded images and derived materials once; reuse them during
animation. Supply illustrations separately.

## Frame notes

- [Futureshifted](futureshifted.md): curved art, incomplete crops and measured components.
- [Planar Chaos](planar-chaos.md): ordinary and colorshifted plates.
- [Eighth Edition](eighth-edition.md): headers and basic-land materials.
- [Future, Flip and Battle templates](template-frames.md): input and orientation contracts.
- [Planeswalkers](planeswalker-materials.md): background materials.
- [Set symbols](set-symbol-assets.md): rarity sources, masks and local SVG patches.
- [Asset research](frame-asset-research.md): source comparisons and earlier proposals.

The individual study results describe their recorded versions and cohorts.
Use current set profiles and Lab for current calibration status.
