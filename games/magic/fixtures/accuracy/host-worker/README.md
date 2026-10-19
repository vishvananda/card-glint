# Portable composition compatibility

This receipt preserves historical **flat Canvas2D** calibration identities for
the exact reviewed 0.6 worker refactor. It does not certify foil shader pixels,
new bitmap/R8 outputs or native/numeric tiers against older releases. Battle
uses PR 8 as its baseline; its intentional geometry correction remains separate.

- `source-proof.json` binds source bytes, helper dependencies and reversible
  edits to the 0.5.5 source (or PR 8 for its changed files).
- `browser-parity.json` records 56 independent before/after table/inspect
  compositions across ten ordinary set families, dual lands, a planeswalker,
  Saga, Battle and Futureshifted card. Inputs use original synthetic bitmaps and
  local system outlines; this checks implementation parity, not scan accuracy.
- `tests/magic-host-worker-compatibility.mjs` erases types and verifies that
  ordinary painters have identical JavaScript after replacing just the two
  document-backed helpers. Explicit wrappers are checked through composition,
  artwork-mask and host-mask tests. Finish/backend changes are outside the flat
  measurement path and have separate WebGL and performance tests.
- `tests/magic-worker-browser-parity.mjs` independently replays both source
  graphs. Its normal mode writes no fixtures. Font raster differences between
  operating systems are allowed; differences between the two implementations
  in the same run are not.

The compatibility reader accepts only the frozen proof hash and exact current
source bytes. A later source edit keeps its new identity and becomes stale
normally. Existing receipts and ledger guard hashes have not been overwritten.

To renew this specific experiment, first review the complete source diff, then
run the Python generator in `tests/tools/generate-host-worker-proof.py` and run
the browser replay with `--capture`. Update the explicit proof hash only after
reviewing zero-difference evidence, then run `npm run test:host` and
`npm run test:magic-accuracy`. Do not reuse this receipt for a changed layout,
wording, font asset or frame calibration.
