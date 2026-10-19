# Alpha and Beta 0.5.4 audit

`review.json` records the decisions, denominators, source hashes, methods and known limitations for all 295 Alpha and 302 Beta ordinary English nonfoil printings. The compressed files contain measurements and reference metadata, not artwork. They are offline evidence and are not included in the browser package.

The audit uses original printing wording. Scan translation, independent scale, rotation and bounded skew are fitted from frame strips, with separate certification strips. Text and mana searches reuse those frozen poses. Failed scans remain in the report denominator and diagnostic queue; they do not enter ranked averages. Sparse variants transfer shared font/material rules from the explicitly named set cohort and still receive an exhaustive native replay.

Mana geometry includes disc placement, scale, spacing, generic numerals and separate glyph geometry. After adopting the qualifying glyph changes, the whole-cost search was repeated. A candidate must improve both fitting and validation cohorts by more than 0.003 in the geometry objective. Retaining a measured default is a reviewed decision.

Rules text uses character-count and measured-wrap tiers. The width study records predeclared count bins and name-grouped validation. A proposed line-balancing change produced identical pixels and was discarded. Artist, heading and P/T gray measurements use filled stroke interiors rather than edge overlap, avoiding the preference for hollow lettering.

`*-scores.json.gz` contains local audit scores out of 100. These use canonical sampling followed by affine sampling. The review application uses single-pass raw-source sampling, so its freshly generated scores can differ; these audit averages must not be relabeled as live client measurements.

Reproduce with the `abu-calibration-normalize`, `abu-type-study`, `abu-mana-study`, `abu-color-audit`, `abu-mana-audit`, `abu-native-capture` and `abu-calibration-score` tools in `games/magic/tools/accuracy/`. Each tool documents its arguments. Restore matching source-cache objects by their recorded hashes, use the pinned assets/fonts, and keep original wording and poses fixed across candidates. Native captures record browser and tool identities. Cache statistics describe decoding reuse, not GPU completion time.

Completion means that every applicable task has been checked against the existing asset baseline. It does not mean an exact reproduction: texture, secondary inner-border details and some manual typesetting remain known limitations. Experimental reconstructed Alpha frames are excluded from this release. `release.json` records publication and the matching fresh single-pass scores; the three rejected Alpha alignments remain visible.

The integration receipt starts at development commit `5552458`, which already includes intermediate typography work; it is not the immutable published 0.5.3 raster. Its staged hashes certify isolated changes. The separate baseline score studies and their source identities determine comparisons against the published version.
