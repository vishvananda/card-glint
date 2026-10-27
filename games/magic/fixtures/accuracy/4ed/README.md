# Fourth Edition calibration evidence

The set audit is still open.

- `basic-body-adoption.json` records the fifteen adopted basic-land text fits.
- `nonbasic-body-adoption.json` records the three adopted nonbasic-land text fits and Mishra's Factory wording correction.
- `nonland-text-review.json` records a rejected text-class experiment across all 360 nonland printings. Its regional text index is separate from the whole-card score.

The broad nonland policy reduced the regional text index from 58.34 to 56.46/100 on the 358 valid candidates. Tempest Efreet and Bronze Tablet overflowed. The renderer retains its existing nonland defaults.

The narrower character-count slices are exploratory. They reuse the same scans and are not an independent validation. Further work needs to preserve good regular-size text, measure both large centered sizes, handle dense passages, and review printing-style outliers.

## Repeat the text study

Prepare the frozen Original input recipes, their complete native capture, the stock-pose file, and the existing asset cache. Set `MAGIC_ACCURACY_CACHE` to that cache, then run:

```sh
node games/magic/tools/accuracy/fourth-nonland-text-study.mjs \
  INPUTS.json NATIVE/capture.json STOCK_POSES.json NEW_PRIVATE_OUTPUT
node tests/magic-fourth-nonland-study.mjs
```

The study checks source and input identities, all 360 default PNGs, and exact body-paint replay. It rejects candidate changes outside the rules region. Keep generated images in private storage; the repository evidence contains measurements and hashes.

Stock alignment remains provisional for this audit. Validate alignment against the printed frame before treating a text fit as final.

## Alignment investigation

`panel-normalization-review.json` rejects a local rules-panel warp as a replacement for stock alignment. Border checks alone passed for 368/378 printings, but independent texture checks elsewhere on the frame became worse. The regional text index barely changed. Keep the existing stock transforms.

Repeat the investigation with the same cached inputs:

```sh
node games/magic/tools/accuracy/fourth-panel-registration.mjs INPUTS.json STOCK_POSES.json PRIVATE_PANEL
node games/magic/tools/accuracy/fourth-panel-text-rescore.mjs INPUTS.json PRIVATE_PANEL/registration.json NATIVE/capture.json STOCK_POSES.json TEXT_STUDY.json TEXT_STUDY_DIRECTORY PRIVATE_TEXT.json
node games/magic/tools/accuracy/fourth-panel-texture-check.mjs INPUTS.json PRIVATE_PANEL/registration.json PRIVATE_TEXTURE.json
node tests/magic-frame-texture-objective.mjs
node tests/magic-fourth-panel-diagnostic.mjs
```

The texture command also writes grayscale patch observations. Keep those observations with the private cache. The repository stores the measured correlations and border profiles, not the patch pixels.

These tools use cached PNGs and CPU measurements. They do not launch Chromium or compose new faces. Their elapsed time is not renderer submission time or GPU completion time.

## Integrated nonland text classes

The optional `bodyClasses` profile refines pure rules passages. A new centered
passage must contain at most 130 normalized characters and fit within six lines
at 25 reference pixels. Compact passages use 15.5 pixels only when their existing
nominal size is at least 17.5 and below 21.75 pixels. Mixed rules/flavor passages,
already-centered text, denser text, explicit alignment and all land bodies retain
their existing policy. Classification follows the host-selected Original or
Oracle reference; the displayed wording is fitted separately.

These values and their bounds/spacing controls are available in the public set
profile editor. They can be changed in `calibration/sets/4ed.ts` without changing
the painter. The native review tool verifies all 378 cards in four modes and all
122 Dark printings as unaffected controls:

```sh
node games/magic/tools/accuracy/fourth-nonland-native-review.mjs \
 INPUTS.json BEFORE/capture.json AFTER/capture.json PROTOTYPE_DIRECTORY \
 SELECTED_IDS.json DARK_BEFORE/capture.json DARK_AFTER/capture.json NEW_PRIVATE_PROOF.json
node tests/magic-body-classes.mjs
node tests/magic-fourth-nonland-adoption.mjs
```

See `nonland-body-adoption.json` for the body-class score and its limits. The
subsequent `paragraph-adoption.json` corrects Gloom's Original source: the two
abilities are separate paragraphs. The shared 25-pixel class then reproduces all
five printed rows, improving its whole-card score from 68.32 to 83.57/100. Both
public wording resolvers apply the reviewed correction; Oracle is unchanged.
This source correction does not close the complete Fourth Edition audit.

## Paragraph-correction verification

The paragraph update raises the 378-card whole-card mean to 79.66/100. Its native
receipt retains all 377 other Originals, all Oracle renders and all etching
masks. Only Gloom's Original recipe key changes. Scores are reused only after
checking exact native bytes, reference identities, scan transforms and metric
region plans.

```sh
node games/magic/tools/accuracy/fourth-paragraph-native-review.mjs \
  BEFORE_INPUTS.json AFTER_INPUTS.json BEFORE/capture.json AFTER/capture.json \
  REVIEWED_PROBE/capture.json ANNOTATION.json NEW_PRIVATE_PROOF.json
node tests/magic-fourth-paragraph-adoption.mjs
node tests/magic-unlimited-worker-parity.mjs --fourth
node tests/magic-unlimited-worker-parity.mjs --fourth --built
```

The worker checks use synthetic bitmaps and installed fonts. They verify exact
text calls/metrics, assets and masks across four sizes, three wording/symbol
modes and 13 faces. Face-filter differences use the established M21 raster
envelope: at most one 8-bit level of mean error per card and three per 64-pixel
tile, with exact alpha. They are portability checks, not scan-calibration scores.

## Empty Wall rules

The later Wall source review removes unprinted reminder rules from Fourth's
Wall of Stone and Wall of Wood. Caller flavor and Oracle are retained. Its two
fresh scores and 376 exact score reuses raise Fourth's whole-card mean to
79.70/100. See [the four-printing review](../early-through-fourth/wall-wording-review.json),
which also covers the two Unlimited printings.

```sh
node tests/magic-wall-wording.mjs
node games/magic/tools/accuracy/wall-wording-native-review.mjs PRIVATE_CONFIG.json NEW_PRIVATE_PROOF.json
```

The private configuration lists the two sets and each before/after input file
and native capture. All 680 printings in four modes must pass. The committed
receipt contains hashes and measurements; scan images stay in the local cache.

## Native request and printed-row audit

The two studies replay all 360 nonland Originals against the same frozen stock
poses and exact native baseline. The inner-paper objective excludes the bevel.
All 720 baseline replays match the native PNGs exactly. Lands are excluded from
these typography trials.

Unconstrained fractional refitting raises the regional text index from 58.30 to
62.19/100. Capping each request at its existing fitted size and row budget, with
at most a 0.5 px reduction, gives 61.96/100. Both policies have 250 gains, 66
losses and 44 changes within 0.05 points. These are regional measurements, not
new whole-card scores.

Neither policy is promoted. Bird Maiden grows from six rows to eight in the
unconstrained trial; the bounded trial keeps six. Hill Giant still has five rows,
but fractional refitting changes correct word breaks while increasing pixel
overlap. Scathe Zombies improves from eight to its seven printed rows. The six
[printed-row targets](printed-row-targets.json) check exact normalized words and
row boundaries independently of overlap. Content mismatches remain explicit.

The [review](native-request-review.json) binds both full studies, reports,
definitions, fitting tools and objective sources. Reused development data is
disclosed. Current production profiles and the 79.70/100 whole-card mean stay
unchanged. The remaining fit needs shared size/width and centering rules, with
separate review of mixed and flavor passages.

Run either definition against current, Original-wording inputs and a matching
native capture:

```sh
MAGIC_ACCURACY_CACHE=/path/to/cache node \
  games/magic/tools/accuracy/fourth-nonland-text-study.mjs \
  inputs.json native/capture.json stock-poses.json output-directory \
  games/magic/fixtures/accuracy/4ed/native-request-budget-definition.json

node games/magic/tools/accuracy/fourth-body-request-report.mjs \
  inputs.json output-directory/study.json \
  games/magic/fixtures/accuracy/4ed/printed-row-targets.json report.json

node tests/magic-text-row-agreement.mjs
node tests/magic-fourth-request-measurement.mjs
```

For the unconstrained control, use
`native-request-unconstrained-definition.json`. Historical receipts retain
their original tool sources; exact numerical reproduction needs the matching
renderer, assets, fonts, poses and objective versions.

The next fit can use the [twelve-target extension](printed-row-targets-extended.json).
It adds reviewed rows for Purelace, Mind Twist, Drain Power, Simulacrum, Brainwash
and Wooden Sphere. The original six targets and both historical study receipts
remain unchanged. These examples include centered and left-aligned blocks of
similar length; a character cutoff alone cannot distinguish them.
