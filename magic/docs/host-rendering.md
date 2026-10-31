# Host rendering and editor controls

[Magic pack](../README.md) · [Documentation index](README.md)

Use `card-glint/magic/presentation` for the shared geometry and raster painter.
The [host integration contract](../../../docs/host-integration.md) documents image
leases, custom set symbols, cached masks and shader integration without creating
another graphics context.
An editor can supply `printingOmissions` on the physical face, each containing
`rect: [x,y,width,height]` normalized to the whole card, optional rotation in
degrees, and the exact measured text runs in `texts`. The painter omits only
matching text ink whose baseline falls in that region. Geometry, frame identity,
calibration, mana assets and other printing stay unchanged; run the resulting
recipe through the renderer normally to retain its finish and wear. This is
transient editor presentation, not a change to the card's rules or wording.
Omissions affect Canvas text calls, not externally supplied lettering bitmaps.

`blackBorderLift` optionally sets a minimum sRGB ink level for the outer black
border (0..0.2). It leaves the interior, white/silver borders and layout intact.
The default preserves source pixels. The lift is painted before finish and wear.

`artworkFoilMask(face, url, {invert?, tier?})` returns a grayscale-to-alpha
`Raster` using the illustration's existing frame aperture, crop, placement and
zoom. Supply a mask matching the illustration's pixel dimensions. White enables
foil; black or transparent protects it. Use the raster in a document layer's
`finishCoverage.add` or `.exclude`; `invert` supports protection mattes. Prepare
it with the document and retain it across pose changes. Composite layouts should
project masks per physical face.
