# Five-set printing colors

LEA, LEB, 3ED, 8ED and M21 have additional source-bound HSB profiles, enabled
with `colorCalibration: 'set-hsb-v1'`. Artwork and lettering keep their original
pixels. These corrections match the cached scans, not physical ink measurements.

The frozen selection covers 59 source/material groups and 689 printing samples.
UUID order determines disjoint fitting and validation cohorts, without sorting
by color error. Each scan is normalized with the previously validated frame
profile before sampling. No per-card color correction is installed.

Twenty-five shared profiles pass at least one component gate: seven for Alpha,
six for Beta, five for Revised, three for Eighth and four for M21. Frame and
paper are admitted independently. A rejected component retains its existing
approved correction or the unmodified source. Revised's existing approved
profiles remain available when a replacement fails. Basic-land variants,
composite lands, sparse multicolor groups, and rejected components are listed
in the reports; coverage is not complete for every color or every printing.

Validation checks median Oklab error, worst-card regression, clipping, prior
approved profiles, and luminance-ordered shadow/chroma/contrast residuals.
Candidates are also recolored and composited through the actual asset pipeline,
then checked again on reserved scans. Frame texture that an HSB transform cannot
reproduce remains an asset issue. Values do not claim whole-card accuracy.

- [Fit measurements, scan hashes and frozen poses](fixtures/accuracy/five-set-hsb-results.json)
- [Raster admission, retained components and asset hashes](fixtures/accuracy/five-set-hsb-adoption.json)

Reproduce with `five-set-hsb.mjs <inventory-directory>`, then
`five-set-hsb-texture.mjs` and `five-set-hsb-adopt.mjs` under `tools/accuracy/`.
The inventory contains cached Scryfall references and the full-set scan-template
measurements. Original image bytes stay in the local content-addressed cache.
A minimum of three fitting and three reserved cards is required per group.
The first two steps record evidence; only the final step writes runtime profiles.

These fits cover frame and paper. Previously validated mana-disc color targets
remain separate; replacing a glyph must retain the source-specific disc binding.
The existing bounded material cache prepares corrections once, before painting.
There is no recoloring or mask readback during animation.
