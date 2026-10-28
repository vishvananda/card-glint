# Mirage and Onslaught calibration study

This study prepares independent defaults for Mirage (MIR) and Onslaught (ONS).
Fourth Edition is the provisional donor for Ice Age. Other later old-frame sets
keep their current defaults until the three donor profiles have been compared.

The study is in progress. No new rendering defaults or completion checkmarks have
been promoted.

## Freeze the inputs

Use a local reference cache. The frozen rollout inventory must already exist.
Run these commands from the repository root, replacing the output names with new
files:

```sh
export MAGIC_ACCURACY_CACHE=/path/to/reference-cache
node games/magic/tools/accuracy/old-frame-set-inputs.mjs mir mir-inputs.json
node games/magic/tools/accuracy/old-frame-set-inputs.mjs ons ons-inputs.json
```

The tool checks printing identities, scan hashes, decoded dimensions and English
nonfoil eligibility. It preserves excluded printings in the inventory. Mirage
has 351 eligible scans, including the Savage Twister variation. Onslaught has
350; its foil-only Embermage Goblin variant is excluded from pigment fitting.

Original types must not fall back to Oracle types. The exact scans exposed 191
different Mirage labels and 107 different Onslaught labels compared with the
initial provider-based inputs. All 701 type lines now have field-specific scan
reviews in each set's `type-printing-review.json`. These reviews certify
only the printed type. They are calibration inputs and are not promoted into the
public correction catalog until the corresponding profiles are ready. Provider
body text, flavor, artist and layout need their
own checks.

Rules-only corrections preserve the caller's flavor paragraphs and Oracle
wording. A different scan hash cannot inherit an exact-scan correction.

## Normalize source scans

```sh
node games/magic/tools/accuracy/old-frame-peer-registration.mjs mir-inputs.json mir-poses.json
node games/magic/tools/accuracy/old-frame-peer-registration.mjs ons-inputs.json ons-poses.json
```

The original luminance-peak detector often selected interior texture instead of
the outside frame on blue, black and gold Mirage cards. Median gradient profiles
from scans of the same material avoid requiring one brightness peak to represent
every frame. Basic lands have separate treatment groups, with four source scans
per color in these inventories.

The profiles use fixed frame strips outside lettering and artwork. Search
overscan is clamped too, so shifted samples cannot enter the heading or copyright.
Alternating,
nonoverlapping strips select and validate translation, scale, rotation and shear.
Existing displacement and residual limits still apply. Small cohorts and rejected
scans remain explicit. The templates use development scans; independent strips
do not make them held-out cards.

The current scan-only fits accept 348/351 Mirage and 340/350 Onslaught references.
These transforms are comparison inputs. They do not move rendered cards, certify
source-frame geometry, or allow rejected scans to acquire accepted scores.

Freeze the pose file before comparing assets. Reuse it for every candidate.

## Measure the baseline and source families

Capture the checksum-verified published browser archive with
`early-released-capture.mjs`. It paints Original wording through the released
pipeline and records the face, scan, art, browser and release hashes. Scan poses
are metadata; they are applied to reference images when scoring.

```sh
node games/magic/tools/accuracy/early-released-capture.mjs \
  mir-inputs.json mir-poses.json browser.zip release.json mir-baseline

node games/magic/tools/accuracy/old-frame-set-baseline-score.mjs \
  mir-inputs.json mir-poses.json mir-baseline/capture.json \
  /path/to/pinned/accuracy-metrics.mjs mir-baseline-scores.json

node games/magic/tools/accuracy/old-frame-set-family-screen.mjs \
  mir-inputs.json mir-poses.json mir-family-screen.json
```

The scorer verifies exact captured face and pixel hashes. It records its metric
dependency graph. Provisional type labels are ineligible, and rejected scan fits
receive no accepted score. A body score from provider Original text does not
certify a manual transcription review.

The family screen compares ABU, Fourth and Seventh sources where those assets
exist. It uses the same opaque profile support and reference poses for each
candidate. Source rectangles are still the existing defaults. Its numbers are
preliminary frame-profile similarity, not whole-card accuracy or a final source
choice. Shared geometry must be fitted and replayed before adoption.

## Remaining work

1. Inspect the remaining rejected scans and verify normalized frame overlays.
2. Fit shared frame and art-window geometry for each source family. Compare the
   candidate families again after fitting, including separate land treatments.
3. Fit frame/paper colors and black levels only after selecting the assets.
4. Fit headings, mana and set symbols, rules/flavor, artist, legal text and stats.
   Recheck physical wording before interpreting typography mismatches.
5. Replay native renders across each full set. Preserve regressions and missing
   evidence in the review queue.
6. Compare Fourth, Mirage and Onslaught as donors for the later old-frame sets.
   Promote only measured defaults and update the completion ledger by component.

Run `npm run test:magic-old-frame-census` for input identity, correction isolation,
profile-content exclusion, known-pose recovery and rejection checks. The usual
renderer checks also apply when changing public data or rendering.

## Recover normalization without moving accepted references

The recovery pass preserves all 688 previously accepted scan transforms byte for
byte. It removes an absolute gradient-energy cutoff that rejected dim but coherent
frame edges. Correlation, side coverage, independent residual, rotation and skew
gates remain unchanged. Synthetic dim frames pass; flat and noise-only images
remain rejected.

Mirage now accepts 350/351 scans; Onslaught accepts 344/350. Six additional scans
were recovered. The seven remaining scans remain rejected and visible in evidence.
They receive no accepted accuracy score.

The offline baseline scorer accepts optional parent score and pose files.
It reuses a row only when the input, native face, reference, metric graph and
transform identities match. Changed transforms rescore only affected rows.
Changing a metric dependency invalidates the parent scores. The regression test
covers unchanged rows, a two-pixel displacement, rejected registration and a
changed metric graph.

## Compare source geometry and texture separately

Export fixed, normalized references before fitting shared source geometry:

```sh
node games/magic/tools/accuracy/old-frame-geometry-inputs.mjs \
  inputs.json poses.json family-screen.json geometry-inputs
python3 -m venv .venv-calibration
.venv-calibration/bin/pip install -r games/magic/tools/accuracy/requirements-old-frame.txt
.venv-calibration/bin/python tests/magic_old_frame_geometry_test.py
.venv-calibration/bin/python tests/magic_old_frame_paper_test.py
.venv-calibration/bin/python games/magic/tools/accuracy/old_frame_geometry.py \
  geometry-inputs "$MAGIC_ACCURACY_CACHE" geometry.json
.venv-calibration/bin/python games/magic/tools/accuracy/old_frame_texture.py \
  geometry-inputs geometry.json "$MAGIC_ACCURACY_CACHE" rails.json
.venv-calibration/bin/python games/magic/tools/accuracy/old_frame_paper_texture.py \
  geometry-inputs geometry.json "$MAGIC_ACCURACY_CACHE" paper.json
```

The four shared parameters are horizontal/vertical translation and scale.
Name-hash cohorts are balanced within each frame material; alternate printings
of one name remain together. Fit, validation and certificate strips do not
share pixels. Small cohorts are development checks, not independent validation.

A sharp rim can score well while the paper pattern is wrong. Side rails and
paper therefore have separate diagnostics. Paper reports both lightness and a
fixed yellow-blue color direction. Onslaught blue reverses the lightness balance
of some source textures: its negative grayscale correlation does **not** indicate
a different pattern. The fixed color-direction correlation reaches approximately
0.84 on calibration names with the ABU source. Do not select a source from
grayscale correlation alone.

Pinned MSE old-style sources are also being compared. Their illustration field
is explicitly removed in private diagnostic derivatives using the source style's
45/51/286/233 rectangle at 375×523. Original cached assets remain unchanged.
The additional-source exporter records source and derivative hashes. These
experiments do not install new frame assets or certify a whole set.

The compact measurements in
[`geometry-source-review.json`](../fixtures/accuracy/mirage-onslaught/geometry-source-review.json)
are candidates. Native rendering, color, headings, mana, set symbols, body text,
artist, copyright and stats still need validation before adoption.

## Native source replay

The painter can now test pinned ABU, Fourth, Seventh and MSE old-style sources
through the same profile contract. MSE's opaque illustration placeholder is
clipped using its declared image field; source images are never mutated. Paper
and gold-bevel repairs follow a calibrated Seventh plate's placement.

The adapter retains the existing default output. An exact parent-source replay
checks 65 material/basic probes across Mirage, Unlimited, Fallen Empires, Fourth
and Chronicles, using each set's normal border stock. All native PNGs are
byte-identical. The source-history receipt restores only those exact reviewed
bytes; unknown revisions remain visible to older audit guards.

Source-family pilots contain 77 Mirage and 71 Onslaught native renders.
Typography is held at Fourth's values in these pilots, so their text and
copyright are **unfitted controls**. In particular, each set needs its own
copyright text. Color proposals use the frozen calibration names and report
validation names separately.

Onslaught nonbasic lands cannot share one paper-color fit: scans include gray,
single-color, gold and two-color gradient panels. Separate those printed
treatments before fitting their pigment or judging land-source candidates.
The new families are available for experiments; no MIR/ONS defaults have yet
been installed.

Run `old-frame-native-source-study.mjs` with the frozen input, pose, exported
reference directory, comma-separated geometry reports and a new output directory.
Then run `old-frame-native-source-colors.mjs` with that exported directory,
the native output and a new JSON filename. Both tools require the local cache;
native capture rejects every uncached external request.
