# Alpha heading-spacing experiment

This adapter adds independent name/type-line controls and finer width steps.
The data-file defaults preserve 0.6.1. The fitted settings are experimental and
are not promoted into the set profile. Font choice remains the existing filled
ink; this experiment does not select hollow lettering.

The shared fit uses 18 names and reserves 18 names across six non-land materials.
All 292 real printings with accepted frozen frame poses are evaluated afterwards,
including lands. These are previously inspected development scans, not a blind
holdout. The three rejected Alpha poses stay excluded and visible as exclusions;
the synthetic Volcanic Island is not measured.

At 488 × 680 canonical size, the candidate name uses dx=1.5, dy=0,
size=27.4, width=0.984 and wordSpacing=-0.05. Type uses dx=-0.8, dy=-0.4,
size=23.1, width=0.973 and wordSpacing=0.4. Ink and shadow are unchanged.
Name scores improve from 70.32 to 71.24/100 (224 improve, 68 regress).
Type scores improve from 61.72 to 62.97/100 (272 improve, 20 regress).
These are heading-region structural indices, not whole-card accuracy.
Every default replay matches released pixels and fitted changes remain inside
the two heading regions. The largest title regressions remain under investigation;
do not infer per-card default offsets from an individually optimal diagnostic.

## Reproduce

Use a frozen observation directory containing inputs.json and W/U/B/R/G/A/L
observations.json files. Point the baseline at an extracted, immutable 0.6.1
browser bundle. Keep all scan and illustration bytes in the content-addressed
local cache; the runner refuses network downloads.

```sh
MAGIC_ACCURACY_CACHE=/path/to/cache \
HEADING_BASELINE_LIB=/path/to/released-0.6.1 \
node games/magic/tools/accuracy/heading-spacing.mjs /path/to/observations /path/to/results
```

Set HEADING_REFINE=1 to refine an existing fit.json. Set HEADING_VERIFY_ALL=1
to check its fixed values against the full accepted cohort. Add HEADING_ABLATE_ALL=1
to separate size, width, word spacing, position and kerning effects and test
horizontal shifts with the old font metrics. The individual dx sweep is -4..4px
in 0.5px steps; boundary optima need further investigation.

Set HEADING_REVIEW_NAMES='Sedge Troll|Serra Angel' to write before/after/reference
PNGs and review.json without replacing the full-cohort fit.json. Those images
contain external reference material; keep them local and out of the showcase.

```sh
node games/magic/tools/accuracy/heading-spacing-patterns.mjs /path/to/results/fit.json /path/to/analysis
```

The analysis exports separate old-better/new-better name lists, group summaries,
scan-pose correlations and any completed horizontal-only diagnostics. Opening-letter
associations are exploratory; confirm them across printings before changing font
bearings or kerning rules. Source-proof reverse edits preserve historical native
and calibration assertions; never replace the earlier frozen evidence hashes.

The separate ABU artist-credit audit records exact printed spellings and exceptions.
It preserves providers' canonical artist names. Those metadata corrections do not
explain heading-score changes, which use frozen heading text and input geometry.
