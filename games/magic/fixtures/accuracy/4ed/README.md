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

See `nonland-body-adoption.json` for the integrated score and its limits. Gloom's
printed five-line centered passage remains an outlier; the shared rule does not
reproduce that line structure. This regional change does not close the complete
Fourth Edition audit.
