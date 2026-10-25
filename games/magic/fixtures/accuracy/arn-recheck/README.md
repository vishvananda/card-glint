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

- `body-style-verified.json.gz`: both baselines now use the same two corrected
  Original styles. The actual full-native mean is 75.40 → 78.88/100:
  83 improve, six regress and three are unchanged. All 92 frozen scan poses
  remain identical. These styles still await public resolver integration.
- `body-refinement-rejections.json.gz`: width, fractional metrics, greedy
  centering and last-line balancing probes. None replaces the selected shared
  model. Kird Ape's wrap remains a residual; no per-card layout exception is used.
- `color-native-development.json.gz`: 91 matching-source color audits and
  28 paired white/green native trials. Half-strength corrections improve both
  development cohorts. Green frame median perceptual distance is 3.34 → 1.98;
  white paper is 3.12 → 1.80. These distances are not compliance scores. Full
  green correction harms validation; white's full fit hits model bounds.
  Colors remain proposals pending integrated replay and final review.

- `lettering-development.json.gz`: all 92 Original printings, exact released
  controls and production-painter replay checks. The shared type-line geometry
  improves every printing in its initial sweep. Retain the current artist
  treatment: the alternative filled kernel loses. Title/P/T candidates and ink
  tone still need integrated full-face verification; edge fits do not select tone.
- `mana-development.json.gz`: 83 exact native controls and a retained-callback
  grid with actual full-native sentinel parity. Keep existing shared cost
  placement, sizing and spacing. All 69 colored rightmost discs are measurable;
  14 translucent dark generic bubbles remain explicitly unmeasured. The common
  ink candidate reduces validation pigment distance 16.52 → 1.43, while structural
  overlap changes by −0.13/100. Disc palettes and whole-cost shrink candidates
  are not adopted. These are component diagnostics, not whole-card scores.

Cohorts are reused development evidence, not fresh holdouts. Frame geometry,
pigment/black point, mana, expansion symbols, filled heading ink, footer/P/T,
Oracle safety and unaffected controls still require their scoped checks.
Mountain also needs its early land source in place of the later fallback.
Images and artwork stay outside Git.

See [the probe commands](../../../docs/early-expansion-probes.md) and
[the full calibration procedure](../../../docs/calibrating-a-set.md).
