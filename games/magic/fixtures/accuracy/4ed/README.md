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
disclosed. At that checkpoint, production profiles and the 79.70/100 whole-card mean
were unchanged. The remaining fit needs shared size/width and centering rules, with
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

## Reviewed Original centering

The [reviewed formatting](annotations-typography.json) adds centered alignment to
twelve exact Original printings. One editable `body.centered` profile supplies
size and spacing. There are no per-card size, offset or soft-wrap overrides.
The words, runs and logical paragraphs are unchanged. A rules-only review
preserves caller flavor; a mixed-body review retains the exact printed body.

The [adoption receipt](reviewed-centering-adoption.json) binds the source delta,
portable fitting study, all 1,512 native variants and 378 whole-card scores.
The mean is 79.70 → 80.02/100: twelve gains, no regressions and 366 exact score
reuses. Both Oracle modes, etching masks and all pixels outside those twelve
bodies are unchanged. These scans were used in fitting; they are not a holdout.

Run the shared recipe comparison with the captured inputs before the formatting
change. Every current default replay must match that native baseline before a
trial is scored. Asset fetching is disabled; the snapshot and cache supply bytes.

```sh
MAGIC_ACCURACY_CACHE=/path/to/cache node \
  games/magic/tools/accuracy/fourth-centered-policy-study.mjs \
  before-inputs.json before-native/capture.json stock-poses.json new-output \
  games/magic/fixtures/accuracy/4ed/reviewed-centering-study-definition.json

node games/magic/tools/accuracy/fourth-centered-native-review.mjs \
  private-native-config.json native-isolation.json

node tests/magic-fourth-reviewed-centering.mjs
```

The private native configuration names `beforeInputs`, `afterInputs`,
`beforeCapture`, `afterCapture` and `prototype` files. The prototype is the
portable study's `study.json`; its saved candidate PNGs are checked against the
integrated production captures. No images or private paths are shipped.

The global character limit stays unchanged. The separate
[expanded-cutoff definition](expanded-centering-study-definition.json) runs the
rejected count-only approach across all 360 nonlands. Similar word lengths do
not prove the same printed alignment. Mind Twist still has a wrapping residual;
other text and component audits remain open.

## Enchant Land detail policy

The [semantic-detail adoption](semantic-details-adoption.json) fixes seven Enchant
Land cards that bypassed Fourth's ordinary cost placement. The selector now uses
the semantic land trait. Their mana index rises from 58.77 to 95.32/100, and the
whole-set mean rises from 80.02 to 80.09/100: seven gains, no losses.

The 1,512-variant native replay changes only those seven Original cost regions
and their cache keys. The other 371 Originals, both Oracle modes and all etching
masks retain exact pixels and keys. All words, reference scans and poses stay
fixed. Exact graph and image joins reuse 371 prior scores and seven prototype
scores. The metadata-only capture refresh is separately verified and recorded;
the raw capture's terminal source guard failed when the build manifest refreshed.
This regional adoption does not complete the full Fourth audit.

## Pure-flavor fractional metrics

The [pure-flavor adoption](flavor-fractional-adoption.json) enables the profile's
existing fractional-metrics policy for flavor-only bodies. It reuses the native
layout request, including its bounds, type range, spacing and alignment.
Centered sizes and explicit material choices remain authoritative. There are
no per-card geometric values or new font assets.

All 19 pure-flavor Originals were measured. Sixteen change; three centered
cards retain their pixels. Their regional filled-ink/edge mean improves from
45.97 to 55.53/100, with 15 gains, one 0.05-point loss and three ties.

The full 378-card mean rises from 80.09 to 80.22/100. Sixteen changed pairs are
rescored after reproducing their previous metrics; 362 exact native matches
reuse their scores. Gray Ogre loses 0.0184 whole-card points. Water Elemental
and other wrapping outliers remain open.

The 1,968-variant replay includes 378 Fourth cards, 110 existing later-set
controls and four additional Ice Age flavor-only cards. Twenty Original bodies
change, including the four inherited Ice cases; all changes stay inside the
text region. Oracle versions and etching masks retain exact pixels and keys.
Three centered Fourth cards share the new semantic cache revision while
retaining identical pixels. Byte-identical PNG controls skip decoding; all
changed pixels and the fixed prototypes receive full RGBA checks.

The source graph, original inputs, references, poses, metric definitions and
historical guards are bound in the evidence. The normalization remains a
development result awaiting visual boundary review. This regional change does
not complete the Fourth or Ice Age audit.

## Exact group membership and component applicability

The [membership review](membership-review.json) binds all 378 frozen Original
inputs to the unchanged 18 catalog groups. Each group now records its printing
IDs, membership identity and applicable components. Sixty component tasks are
not applicable: six land groups have no mana cost, five groups have no flavor,
twelve have no statistics, all eighteen have no printed expansion symbol, and
thirteen have no dedicated layout component. Inline land symbols remain part
of rules and special-component review.

This repairs the checklist; it adds no calibration or completion approval.
Existing component fits, unresolved audits, source wording and scores are
unchanged. The tool rejects missing, duplicated, foreign or regrouped printings,
changed scan/art identities, and Original content that contradicts an exclusion.
It preserves every other set's ledger bytes.

```sh
node games/magic/tools/accuracy/fourth-membership-review.mjs \
  games/magic/fixtures/accuracy/4ed/flavor-fractional-inputs.json.gz \
  review.json
node tests/magic-fourth-membership.mjs
```

The command previews changes. Add `--apply` to update only Fourth's ledger entry.
Re-running it against the reviewed ledger produces no further task changes.

## Land normalization and heading diagnostics

The [land review](land-normalization-review.json) tests all fifteen basic-land
scans using separate color templates. Panel fitting, model selection and
certification use disjoint scan strips. Six other frame-texture patches must
also improve against two different, well-supported peer scans. Replacing every
pixel outside the panel strips leaves their extracted profiles unchanged.

Thirteen panel fits pass, but only Forest #378 also passes the independent
texture gates. Its texture correlation improves from 0.570 to 0.876, and its
mean residual displacement falls from 2.06 to 0.60 pixels. The other fourteen
poses remain unchanged. These are reused development scans, not a blind holdout.

With the renderer, wording and metric fixed, Forest rises from 62.96 to
79.88/100. Its title rises from 32.84 to 83.03/100. Art and credits lose some
overlap; those losses remain in the report. Across all 378 cards, one new pose
is scored and 377 exact scores are reused: 80.22 becomes 80.27/100. The stored
transform is for comparison only. It adds no renderer offset or per-card layout.

The scoring tool recreates the complete scan-only registration from cached
reference bytes and requires exact evidence reproduction before scoring. The
receipt binds the source methods, frozen parent poses, native capture, inputs,
region plans and full metric/policy graphs. Numerical source artifacts are
included; external scan and rendered image files remain in the local cache.

```sh
gzip -dc games/magic/fixtures/accuracy/4ed/flavor-fractional-inputs.json.gz > inputs.json
gzip -dc games/magic/fixtures/accuracy/4ed/land-normalization-parent.json.gz > poses.json
MAGIC_ACCURACY_CACHE=/path/to/cache node \
  games/magic/tools/accuracy/fourth-land-registration.mjs \
  inputs.json poses.json new-land-registration.json
node tests/magic-fourth-land-normalization.mjs
```

Run `fourth-land-pose-score.mjs` with those inputs, the matching native capture
and PNG directory, parent poses, new registration, previous whole scores and
unchanged metric/policy modules. Its usage message gives the argument order.

The separate [heading-window diagnostic](header-region-diagnostic.json) measures
fifteen basics and twelve deterministic nonland controls. Empty heading windows
contain substantial frame edges. Tighter windows change the metric but do not
consistently improve it or resolve Forest #378. No scoring-window change is
adopted. The scan normalization explains that outlier more convincingly.

The remaining source, typography, black-level, land-asset and visual boundary
audits stay open. The checklist records measured work as partial and absent
components as not applicable; neither state approves the entire set.

## Public Original input replay

The compressed [input review](original-input-review.json.gz) checks all 378
Fourth printings against the native capture. It independently reconstructs
Original text from cached MTGJSON and Scryfall fields, then applies the public
reviewed-correction resolver. Both eager and per-set lazy APIs produce the
exact frozen face, including paragraph structure and Original alignment inputs.
The lazy wording path loads no calibration tables.

This is input readiness evidence, not approval of scan transcription, layout,
black levels or the whole set. Existing checklist audits remain open. Negative
controls cover stale scan hashes, absent Original wording, caller immutability
and unchanged Oracle wording. Reproduce with the pinned provider cache:

```sh
MAGIC_ACCURACY_CACHE=/path/to/cache node \
  games/magic/tools/accuracy/fourth-original-input-review.mjs \
  games/magic/fixtures/accuracy/4ed/flavor-fractional-inputs.json.gz \
  games/magic/fixtures/accuracy/4ed/flavor-fractional-native-capture.json.gz \
  original-input-review.json
node tests/magic-fourth-original-inputs.mjs
```

## Frame shadow and keyline measurements

The [dark-frame diagnostic](frame-dark-audit.json.gz) measures every current
Original face against the frozen normalized scan. Four frame patches exclude
all card content. Four separate outer-stock patches and six vertical strips
outside the art measure the surround and thin dark-line regions independently.

The table gives rendered minus reference RGB in the darkest five percent of
the frame patches, in 8-bit channel values:

| Material | Cards | Dark-tail RGB difference |
| -------- | ----: | ------------------------ |
| A        |    70 | 6, 6.5, 6                |
| B        |    58 | 2, 3.5, 2                |
| G        |    58 | 1, 7, 4                  |
| L        |    18 | 7, 3, 4.5                |
| R        |    58 | 10, -1, 0.25             |
| U        |    58 | -9, 0, -4.5              |
| W        |    58 | -3, -1, 1                |

There is no single neutral black correction: blue needs different channel
changes from red, green and artifact. Median surround values match the
provider's cleaned white background; that does not certify physical paper.
Dark-line strips have larger mismatches on artifact, red, white and land.
Their values also depend on line width, bevel color and resampling, so they
must not be used as a pure-black target without a geometry check. No color,
geometry, score or completed-task approval is changed by this diagnostic.

The output binds every scan, native face and pose, including the Forest #378
refinement, and the measurement sources. It contains numerical observations
only. Run the following with the matching native PNGs and cached scans:

```sh
MAGIC_ACCURACY_CACHE=/path/to/cache node games/magic/tools/accuracy/fourth-frame-dark-audit.mjs \
  inputs.json native/capture.json poses.json land-registration.json frame-dark-audit.json
```
