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
