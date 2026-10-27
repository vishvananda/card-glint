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
