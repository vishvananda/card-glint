# M21 calibration evidence

## Type review proposal

`type-line-proposal.json` records the 297 reviewed physical type lines and exact
scan identities. `type-visual-review.json` records the contact-sheet review.
Only `typeLine` is certified: this does not approve body/flavor text, colors,
layout or the set as a whole. Massacre Wurm prints **Creature — Wurm**, and
Mazemind Tome prints **Artifact**.

The proposal is deliberately not named `annotations*.json`, so it does not enter
the generated public correction tables yet. The study's frozen Original inputs
already include it. Adopting it requires registering it as an annotation source,
rebuilding the catalogs and proving that unrelated historical native renders
and score receipts remain compatible. Keep the existing Unlimited source guards
until that scoped compatibility proof is in place.

## Production component fit on the calibration branch

`production-components-review.json` records the hashes and complete denominator
for the first adopted component fits. It is **not a set completion certificate**.

- Footer typography: credits diagnostic improves from **64.38 to 86.59/100**,
  all 297 printings improve. Every pixel above canonical y630 and every complete
  etching remain unchanged. The 13 reviewed artist-string corrections remain
  proposals and are not silently applied by the style profile.
- Large basic symbols: all 15 improve; the complete-set structure diagnostic
  increases **73.09 to 74.27/100**. All 282 other faces and all 297 etchings stay
  pixel-identical. Five shared, source-bound color/geometry profiles are used.
- Separate ink/paper checks measure glyph-body overlap of 97.61–99.77/100.
  These do not certify the baked bevels or cast shadows. Those remain under review.

The compressed parity receipts contain only hashes, counts and printing IDs.
Native PNGs and cached external assets stay outside the repository. Reproduce a
scope audit against local capture directories:

```sh
python games/magic/tools/accuracy/native-region-parity.py \
 BEFORE_NATIVE AFTER_NATIVE footer-parity.json.gz --region 0 630 488 50
```

For the basic-symbol change, use `--region 140 420 210 205` and repeat
`--allow-number NUMBER` for every collector number from 260 through 274.
Install the pinned Python dependencies from
`games/magic/tools/accuracy/modern-calibration-requirements.txt`.
The audit rejects incomplete captures, changed inputs/references, stale raster
hashes, any complete etching change and pixels outside the declared scope.

Production values live in `modern-printing-profiles.ts`; glyph color preparation
joins the existing bounded bitmap cache. The exact set and immutable source URL
must match. Uncalibrated sets, older frame families, special templates and custom
rules retain their existing behavior. Source-color mode skips the glyph recolor.

Required renderer checks and focused M21 tests pass. Release remains gated on
the scoped historical source/pixel compatibility proof for the new painter
paths. The broader Magic test also reproduces a separator fixture overflow on
the released 0.6.10 baseline with local substitute fonts; it is tracked separately
from these fits. Existing historical receipts are not rewritten or bypassed.
