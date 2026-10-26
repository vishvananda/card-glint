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

The word-and-paragraph audit is now complete for all 306 Original bodies.
It records 24 exact printing corrections, each verified through isolated native
replays. The final additions include verse breaks, upright “(heads)” on Rock
Hydra, and explicit empty Original rules for Wall of Stone and Wall of Wood.
Those two cards had inherited modern wall reminders when source rules were
missing. Eighteen activation colons were confirmed across the full audit,
including inline and quoted abilities that the first paragraph-start detector
missed. No generic punctuation-insertion rule is added.

The [pre-fit review](../fixtures/accuracy/3ed-recheck/pre-fit-review.json)
records the complete denominator and native checks. Unchanged recipes match
current-source controls, and every changed pixel stays within the body.
Dwarven Weaponsmith and Plague Rats retain identical pixels because current
soft wrapping already produces their printed verse boundaries. Small negative
metrics on other corrections do not invalidate scan-confirmed content.
Soft wrapping, line-end hyphenation, font metrics, generic-mana drawing and
alignment remain separate work. Runtime correction promotion is pending.

The corrected baseline also rebuilds each Original alignment reference through
the production wording selector. All 306 references now match their selected
Original paragraphs. The 24 fresh native replays match the isolated wording
corrections exactly; the other 282 recipes, PNGs and scores are reused after
identity checks. The source-only aggregate changes from 71.14 to 71.24/100.
This small score change records correct content, not a shared typography fit.

Rebuild these inputs before fitting text, rather than patching display text
while leaving the automatic alignment reference unchanged:

```sh
node games/magic/tools/accuracy/reviewed-original-inputs.mjs \
  original-inputs.json wording-promotion-draft.json.gz corrected-inputs.json
```

This command requires the reviewed type inputs and exact scan identities.
It applies reviewed rich paragraphs through the public wording API without
loading fonts, images or Chromium. The source rules and flavor remain separate
in the promotion draft. Its resolver/catalog integration is the next step.

The artifact geometry trial is still unadopted. Under the original outer-stock
normalization, translating the shared frame 1.25 px left raises its mean from 66.60 to 70.42/100, but 15 of 51 artifacts
regress and the worst loss is 9.27 points. Neither rarity nor the card's earliest
appearance in Alpha, Arabian Nights or Antiquities cleanly separates the losses.

A scan-only check shows that printed type moves with the art and paper boxes.
An independent, ink-free frame-texture region also tracks that displacement
(correlation magnitude 0.98). This indicates printed-frame displacement relative
to the outer white border, rather than separate errors in every internal
element. It does not establish whether the cause is cutting, card centering,
scan processing or print-run variation. The texture target was selected using
the scan-only type position, so this is diagnostic evidence, not independent
alignment certification.

The follow-up below tests frame-only interior normalization with independent
verification strips. Keep the physical outer-stock pose for border and corner assessment.
Do not use title or body text to choose the pose, and do not hide stock errors
by treating an interior structural score as whole-card certification.

A high-resolution uncut Revised sheet would provide a useful control. This
[Heritage lot](https://comics.ha.com/itm/memorabilia/trading-cards/magic-the-gathering-revised-edition-uncut-sheets-group-of-3-wizards-of-the-coast-1994-/a/7386-36036.s)
documents three 11-by-11 sheets, but the usable image resolution remains
unverified. Rectify the sheet once from grid or registration landmarks and
compare frame geometry across cells; do not warp each card to its lettering.
One sheet controls cutting and separate scan crops for that sheet, not every
print run. The [investigation receipt](../fixtures/accuracy/3ed-recheck/artifact-alignment-review.json)
records candidate results, source identities, limitations and the sheet protocol.

## Revised artifact interior registration

The outer-stock pose does not account for all displacement of the printed
interior. The cached-scan command below tests paired text-box frame edges.
It supports only Revised artifacts; other materials need reviewed strip geometry.

```sh
MAGIC_ACCURACY_CACHE=/path/to/cache node \
  games/magic/tools/accuracy/revised-artifact-normalize.mjs \
  inputs.json outer-normalization.json interior-normalization.json
```

The target uses calibration scans only. Two aligned median-template passes
reduce single-scan noise. The median calibration translation stays zero, so the
fit does not move the group's shared layout to match the renderer. Separate
along-edge strips verify the proposed horizontal shift. Pixel replacement
outside every declared strip must leave all extracted profiles unchanged.
Inspect the strips themselves before applying this method to another frame.

The test accepts 46 of 51 artifact poses numerically. On those same 46 cards,
the shared 1.25 px left frame translation improves every interior structural
score: 67.51 to 73.64/100. Horizontal frame-edge overlap improves from 70.76 to
92.38/100. All 15 regressions from the previous outer-stock comparison are in
this accepted group and now improve. These figures compare two renderer
geometries under the same new scan poses; old-pose scores are not reused.

Aladdin's Ring, Conservator, Dingus Egg, Ivory Tower and Meekstone remain flagged
for frame-edge support or independent residual disagreement. They are excluded
from both aggregate columns, not assigned a fallback interior pose. The portable
tool reproduces all 51 prototype decisions and transforms exactly. Prior
texture-only translation and affine proposals did not pass enough independent
checks and remain unadopted.

The [registration receipt](../fixtures/accuracy/3ed-recheck/interior-registration-review.json)
retains all candidates and source identities. The renderer is unchanged.
Review independent art-frame boundaries and full-card overlays, resolve the
flagged cases, and verify source-local color/native parity before adopting
shared geometry. Use each row's original stock pose for physical borders and
corners; the interior index does not certify them.
