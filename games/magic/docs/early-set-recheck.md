# Early-set recheck

This pass covers ordinary printings through Fourth Edition. Collector's Edition
(CED and CEI) and Summer Magic (SUM) are deferred.

| Set                                               | Current result                                                      | Next gate                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| Alpha, Beta, Unlimited                            | 899 printings retain their completed review and exact native pixels | Preserve their existing evidence                          |
| Arabian Nights                                    | 92 native Originals; mean 75.40 → 80.20/100                         | Component certification and bundled release               |
| Antiquities                                       | 102 native Originals; mean 73.68 → 80.87/100                        | Component certification and bundled release               |
| Revised                                           | 306 original type lines reviewed; native baseline 71.14/100         | 306 frozen poses ready; body-source review before fitting |
| Legends, The Dark, Fallen Empires, Fourth Edition | Earlier profiles and evidence remain available                      | Current-source recheck in release order                   |

These are structural similarity indices, not percentages of correct pixels.
The two new profiles are committed work in progress; the published package remains
0.7.2. A native replay or a regional improvement alone does not complete a set.

## Antiquities changes

The profile retains the measured frame families and their existing placements:
Fourth Edition for white, blue, red and artifacts; ABU for black, green and lands.
Neutral lands use a shared vertical scale of 1.006 and a -0.625 canonical px
offset for the frame, art and stock window. Lettering and symbols do not move.
A blue-frame color correction reduces median color distance from 5.55 to 0.71
across its seven printings. Other frame and text-box pigments retain their
existing values. The neutral-land correction now preserves the source gold
rims around the art and text box with the existing source-local accent mask.
A hue, saturation and brightness feather protects the dark outline and shadow;
the accent uses saturation 1.1 and brightness 0.95. It does not recolor the
outer stock border.

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
were found. All 1,297 Original controls from Alpha, Beta, Unlimited, Arabian
Nights and Revised remain pixel-identical. Every body layout is unchanged by
the land revision. The 81 nonland cards also retain identical Original, Oracle
and etching images.

All 21 lands improve: their mean rises from 69.32 to 79.43/100. The shared
vertical edge-band index rises from 63.26 to 90.51/100. Only these changed
land faces are rescored; the other 81 scores are reused after exact PNG,
recipe, reference, pose and metric-graph checks.

Whole-card measurements reuse the exact frozen scan transforms and reference
hashes. Of the 102 Antiquities printings, 101 improve. One Atog scan loses
0.034 points. Validation names were reused during development; this is not a
fresh holdout estimate.

Reconstruction already omits its anvil through the native retro painter. Its
low-level asset URL is not the final symbol selection; no renderer fix is needed.
Dense rules wrapping and immutable frame-texture differences remain reviewable
residuals. All 21 land variants were inspected. The source gold bevel remains
heavier than some references and is tracked for asset review. The profile is not marked complete.

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

## Measuring frame edges

Use the offline frame-band diagnostic with a complete native capture:

```sh
MAGIC_ACCURACY_CACHE=/path/to/cache node \
  games/magic/tools/accuracy/early-frame-band-audit.mjs \
  inputs.json normalization.json native-capture frame-bands.json
```

It compares median RGB gradients in fixed strips at the stock, art and
text-box edges, using the existing scan-only transforms. The report separates
materials, land palettes and calibration cohorts. A nonflat signal is not proof
that it found the intended boundary: inspect multiple-edge ambiguity and
search-limit winners in a zoom. These measurements do not adjust individual
renders, certify scan alignment, or measure corners.

## Revised preparation

All 306 original type lines have target-scan review, and the 306 frozen scan-only
poses and native baseline are available. The initial 71.14/100 score is a
diagnostic baseline. It does not certify every original rules or flavor passage.

A zoomed low-score sample found two source punctuation errors and different
printed attribution boundaries. Both activation colons are absent from MTGJSON
originalText. Aladdin's Ring prints the attribution inline; Wall of Brambles
starts it on a new line. The two scan-backed corrections and native replays are
in the [pre-fit review](../fixtures/accuracy/3ed-recheck/pre-fit-review.json).
They preserve frame geometry and affect only body pixels.

With the same renderer, Aladdin's Ring returns from 20.25 to 22.5 px and gains
10.42 whole-card points. Wall of Brambles' score changes by less than 0.002
points; its corrected colon is required regardless of the metric. The other
304 recipes match the fresh current-source controls. These corrections still
need runtime promotion, and the remaining body content needs review before
shared typography fitting. Do not compensate for text differences with margins
or font sizes.

The remaining paragraph-start mana costs were also checked directly in their
scans. Seven more need a colon: Deathgrip, Pestilence, Wall of Bone, Goblin
Balloon Brigade, Sedge Troll, Uthden Troll and Regeneration. These are exact
printing corrections queued for promotion. No automatic colon-insertion rule
is added to the renderer.

The broader word-and-paragraph audit has checked the first 160 of 306 cards
alphabetically. Six additional exact corrections record missing pump-cost colons
and printed verse or attribution breaks on Bog Wraith, Dwarven Weaponsmith,
Firebreathing, Frozen Shade, Granite Gargoyle and Holy Armor. Their native replays
change only body pixels; the other 300 recipes are unchanged. Dwarven
Weaponsmith's explicit breaks produce the same pixels as its current soft
wrapping, so its score is reused. Holy Armor loses 0.11 points despite its
scan-confirmed colon; source correctness takes priority over the score.

The [pre-fit review](../fixtures/accuracy/3ed-recheck/pre-fit-review.json)
records the reviewed prefix, evidence and next index. Soft wrapping, printed
line-end hyphenation, font size and generic-mana glyph style are separate
typography questions. These source corrections still await runtime promotion.

The frame-band diagnostic also suggests a shared internal horizontal residual
in the artifact frames, while their outer stock is close. This is a measurement
lead, not an approved frame adjustment.
