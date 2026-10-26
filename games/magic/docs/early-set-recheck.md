# Early-set recheck

This pass covers ordinary printings through Fourth Edition. Collector's Edition
(CED and CEI) and Summer Magic (SUM) are deferred.

| Set                                               | Current result                                                      | Next gate                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Alpha, Beta, Unlimited                            | 899 printings retain their completed review and exact native pixels | Preserve their existing evidence                                      |
| Arabian Nights                                    | 92 native Originals; mean 75.40 → 80.20/100                         | Component certification and bundled release                           |
| Antiquities                                       | 102 native Originals; mean 73.68 → 78.79/100                        | Printing-detail outliers, component certification and bundled release |
| Revised                                           | 306 original type lines reviewed, including 255 new transcriptions  | Independent frame normalization, then component fitting               |
| Legends, The Dark, Fallen Empires, Fourth Edition | Earlier profiles and evidence remain available                      | Current-source recheck in release order                               |

These are structural similarity indices, not percentages of correct pixels.
The two new profiles are committed work in progress; the published package remains
0.7.2. A native replay or a regional improvement alone does not complete a set.

## Antiquities changes

The profile retains the measured frame families and their existing placements:
Fourth Edition for white, blue, red and artifacts; ABU for black, green and lands.
A blue-frame color correction reduces median color distance from 5.55 to 0.71
across its seven printings. Other frame and text-box pigments retain their
existing values.

Rules fitting keeps the earlier layout for height-constrained regular blocks.
The refinement applies to compact text, or to regular blocks with more than
20 canonical pixels of unused height. It uses fractional metrics, slightly
tighter leading and a higher text position. Long flavor paragraphs can use the
existing orphan-line prevention. The set-specific threshold is 120 characters;
it fixes Su-Chi while preserving Shatterstorm's printed short final line.
These are shared size and space rules, not card-specific margins.

The type line moves one canonical pixel left and uses a 22.45 px size.
The title, artist credit and P/T retain the earlier geometry and separate
foreground/shadow treatment. The profile preserves the visible minus glyph in
Shapeshifter's P/T. Copyright remains within the artist credit; it does not gain
a separate legal line.

Keyrune supplies the default anvil contour. Its right edge moves one canonical
pixel left. The alternative Conjurer source has a checksum-bound repair for its
incorrect white exterior. Symbol fitting uses 101 printings: Reconstruction has
no printed anvil and is excluded.

Mana costs retain disc sizes, spacing, numeral controls and historical samplers.
The shared position moves down 0.25 canonical pixels. Colored ink uses RGB
23,24,18; only green's paper pigment changes. A proposed disc shrink was rejected
because it reduced alignment accuracy. Validation glyph color distance improves
substantially without changing the historical glyph shapes.

## Evidence and limits

The native census contains 102 Originals, three Oracle modes per printing and
the default etching output. No body overflows and no Original silhouette changes
were found. All 991 Original controls from Alpha, Beta, Unlimited and Arabian
Nights remain pixel-identical.

Whole-card measurements reuse the exact frozen scan transforms and reference
hashes. Of the 102 Antiquities printings, 101 improve. One Atog scan loses
0.034 points. Validation names were reused during development; this is not a
fresh holdout estimate.

Reconstruction still needs a reviewed printing-detail correction to suppress
the added anvil. Dense rules wrapping and immutable frame-texture differences
also remain reviewable residuals. The profile is not marked complete.

Machine-readable development, native, score and source-history receipts are in
[the Antiquities evidence directory](../fixtures/accuracy/atq-recheck/).
Historical evidence is retained. Exact source projections authenticate old
results; they do not approve the changed rendering or overwrite old scores.

Run the focused checks with:

```sh
npm run test:magic-atq
npm run test:magic-arn
npm run magic:calibration:check
```

See [Calibrating a set](calibrating-a-set.md) for the complete contribution process.
