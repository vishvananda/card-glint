# Indicator validation

This is implementation evidence, not a set calibration or scan-accuracy score.
The source baseline is `a39f137a23a8cac7b47fcaf31c18e88b1af4f241`.

- 84 default pixel controls cover 28 frame/layout cases at widths 244, 488 and 732. All default bytes match the baseline; enabled indicators change pixels.
  The same controls verify rotated semantic regions, artwork isolation, PNG
  export, composite bitmap reuse and cancellation.
- The existing native compatibility gate passes 870 pixel, measurement and
  layout probes against its independent historical baseline. Its source guards
  remain strict; unknown edits do not inherit this extension's ancestry.
- Twelve document/worker cases run against both source and packaged entries.
  All full-face output matches exactly, including two through five colors,
  neutral current-colorless display, hiding and scan/rebuild selection.
  The artwork-only control verifies unchanged pixels within each realm; it
  does not claim to fix existing cross-realm illustration resampling differences.
- Provider controls distinguish Time Spiral Ancestral Vision from its later
  indicator-bearing printing, isolate DFC faces and reject unverified physical
  visibility during scan scoring. Current-color display leaves frames and mana
  costs unchanged. Printing style and package consumer checks also pass.

Browser fixtures use synthetic ImageBitmap assets and locally available fonts.
They do not redistribute external card images. The source assets were separately
inspected: the mono-color MSE discs and neutral `aidentity.png` are opaque at the
center; `cidentity.png` is fully transparent and is not used for the neutral badge.

`source-proof.json.gz` stores the exact changed source bytes and measured default
controls. Its SHA is pinned in `color-indicator-ancestry.mjs`. Historical evidence
can reverse only those exact source changes and the generated manifest's source
metadata. Generated data payloads stay unchanged. Current rendering and input
identities remain current; the receipt does not approve reuse of scores for
cards whose indicator or type layout changes.

To reproduce:

```sh
npm run build
npm run test:color-indicators
node tests/magic-font-history.mjs
node tests/magic-host-worker-compatibility.mjs
node tests/magic-native-host-compatibility.mjs
```

After reviewing changed runtime code, regenerate the browser differential and
run `node games/magic/tools/accuracy/color-indicator-proof.mjs`. Review its scope
and source metadata before updating the pinned SHA. Keep the normal strict
checks and renderer/package/browser/showcase gates.
