# Set symbol assets and source patches

[Magic pack](../README.md) · [Documentation index](README.md)

Set symbols now prefer complete styled SVGs where available, preserving their
white details, black outlines and metallic gradients. The
[versioned inventory](../set-symbol-inventory.json) lists 1,880 rarity files for
383 set codes. These are the default for all available sets. Use
`setSymbolSource: 'keyrune'` to select the prior source. Frame-family
selection does not change the symbol-source policy. A missing exact rarity falls back to
Keyrune; unknown sets return no symbol instead of requesting a nonexistent file.
Pre-Exodus printings still use monochrome symbols. Host-owned `setSymbol` URLs
and the original GLINT/FORGE marks take precedence and preserve their colors.

Etched and Opal set marks extract dark ink from the styled common SVG, so opaque
white backing, borders and internal holes do not turn into a solid embossed
silhouette. Common art is also selected when a symbol-code override has resolved
to an explicit uncommon/rare styled URL, using that symbol’s own set identity.
The small printed rarity symbol is unchanged. Keyrune and custom
symbols retain their alpha by default. For a custom dark-on-white SVG or bitmap,
set `setSymbolMask: 'ink'`; use `'alpha'` to retain the whole silhouette, including
white or colored areas, or `'auto'` to restore the source default. This field can
also be supplied in printing preset/style `overrides` and inherited by split
panels, with a per-panel value taking precedence.

Ink extraction multiplies inverse sRGB luminance by source alpha. It reads the
decoded symbol once per source bitmap on a derived-cache miss, bounded to 512 px
per side and a separate 4 MiB cache. It does not read a GPU etching mask or run
during tilt/animation. `magic.dispose()` clears these retained derivatives.
Changing mask mode invalidates etching rasters, leaving printed-color caches
intact. Print dots affect printed color before foil shading; cardstock relief
modulates the resulting reflection. Neither feeds the artwork/symbol etching
sources or generates additional embossing contours.

The [SVG patch manifest](../symbol-svg-patches.json) records local material fixes
for M15 uncommon/rare/mythic and Eighth/Ninth Edition uncommon/rare. Patches
verify SHA-256 before editing fills and outlines, run once before decoding, and
share the pack's encoded-source cache across direct and host rendering. Custom
URLs are untouched. Source bytes and patched SVGs remain external/local; only
transformation code, checksums and provenance are stored here.

The major-set batch adds 219 symbol profiles across 157 sets and four frame
families, plus 17 component-frame inset profiles. Position and independent
width/height adjustments are shared by set, family and stock after per-scan
frame normalization and validation on reserved card names. Uncertain groups
retain their existing geometry. See the [calibration audit](calibration-rollout.md)
and the earlier [plate pilot evidence](../fixtures/assets/styled-symbol-placement-calibration.json).

All source URLs include immutable revisions. The new collection uses GitHub raw
URLs because jsDelivr rejects uncached files from this oversized repository. Asset decoding uses the existing
host cache; full plates are bounded to 768 pixels wide during preparation.
No downloading, decoding or masking occurs in the animation loop. The local
accuracy cache stores reference bytes separately from the package. Regenerate
filename metadata with `node games/magic/tools/assets/symbol-inventory.mjs`
(optionally pass a cached Git tree JSON as its first argument).
