# Arabian Nights recheck

This is development evidence for the through-Fourth audit. No renderer values
are installed and no set-completion stage is approved by these files.

- `baseline.json.gz`: 92 frozen nonfoil references, original-wording inputs,
  scan-only poses, published 0.7.2 native hashes and diagnostic scores. The
  archived release's own fonts, decoder and painter reproduce all 92 PNGs.
- `body-grid*.json.gz` and `body-position*.json.gz`: the complete initial
  size/width/leading sweep and the later coupled size/position sweep.
- `body-selected-definition.json.gz`: one shared candidate selected using
  calibration names. Regular: 22.5px, leading 0.98, offset −14px. Compact:
  16.5px, leading 1.15, offset −14px. Centered: 27.25px, leading 1.1,
  offset −15px. No card-specific layout or row-retention exception is selected.
- `body-selected-native.json.gz`: all 92 actual full native replays. Predicted
  regional scores match exactly; silhouette and etching remain unchanged, and
  no pixels outside the rules region change.
- `body-selected-native-scores.json.gz`: whole-card diagnostic mean
  75.39 → 78.70/100, with 81 improvements, eight losses and three unchanged
  cards. Worst loss: City in a Bottle, −2.65 points. Legal text remains
  unverified; these are not complete-set compliance claims.
- `body-cache-parity.json`: 10,028 identical trial records with 2,898 raster
  measurements. This measures an analysis optimization, not runtime GPU speed.
- `printing-style-proposals.json`: two scan-reviewed source-formatting gaps
  discovered while inspecting losses. City in a Bottle needs italic set names;
  King Suleiman needs an inline flavor attribution. Integrate these in the
  reviewed Original resolver, replay both baselines with the same corrected
  input, and confirm the candidate before finalizing text values.

Cohorts are reused development evidence, not fresh holdouts. Frame geometry,
pigment/black point, mana, expansion symbols, filled heading ink, footer/P/T,
Oracle safety and unaffected controls still require their scoped checks.
Mountain also needs its early land source in place of the later fallback.
Images and artwork stay outside Git.

See [the probe commands](../../../docs/early-expansion-probes.md) and
[the full calibration procedure](../../../docs/calibrating-a-set.md).
