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

## Stable rules-spacing fit

The [body review](body-production-review.json) records the full-card replay after
the text-only search. Leading is 0.975 and paragraph gap is 0.4 em. Font size remains
capped at the existing fit. All 268 ordinary font sizes and line counts are unchanged;
all 29 other faces and all 297 etchings remain pixel-identical.

The complete-set structure diagnostic improves **74.27 to 75.08/100** and its
rules component improves **56.81 to 59.45/100**. The report keeps every regression
and three lower-frame coverage changes visible. This remains partial calibration.

The text search paints isolated native 1.5x rules layers and reuses cached fonts
and glyphs. It never decodes artwork or changes a scan pose. Its search objective
combines symmetric edge distances with filled-ink overlap; it is distinct from
the full-card metric. Full-card validation is required before adopting values.

New native captures also hash the font stylesheet, asset URL manifest and four
shared raster helpers, which live outside the game source directory. Text studies reject older captures without this metadata;
refresh the baseline before another search. The recorded source commits for the
existing body comparison have identical pack metadata, checked in its review.

## Replacement-plate color proposals

The [color review](frame-color-proposal-review.json) keeps the six material
fits separate from production data. The 219 nonfoil sources drive shared frame
and paper targets. One measured dark-template mask identifies the three paper
panels; all six pinned assets have the same thresholded alpha shape. Native
previews apply paper correction to the name and type panels as well as rules,
so a dark frame correction does not dim their light paper.

These values are not adopted. Red clipping, weak white-frame improvement,
texture contrast and stock black point still need review. Other source families
and donor transfer remain separate work. External source/preview PNGs stay local.

The [constrained follow-up](frame-color-constrained-review.json) fixes periodic
tile sampling and bounds pooled component clipping. The red frame prediction
moves from 5.47 to 2.52 Oklab delta with no clipped sampled tiles. Black and green
fits improve after retaining every region of their repeated source strips.
Six new native previews use the revised values, retaining identity for the weak
white-frame fit. Pixel-level color, texture and full-set replay remain open.
The replacement plates also need their own stock binding: measured outer black
is zero, while all 219 reference stock medians agree with the existing M21
target of RGB (22, 19, 14). These are separate from the component-source binding.
