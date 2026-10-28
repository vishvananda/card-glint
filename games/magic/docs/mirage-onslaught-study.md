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
body text, flavor and layout need their own checks. Artist credits now have
separate exact-scan reviews for all 701 printings; 29 Mirage and 14 Onslaught
credits differ from the providers' normalized aliases. The input producer reads
those literal credits without promoting them into the public correction catalog.

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

## Pigment spread and native text trials

Median color alone can match a background's average while losing its contrast.
Use clean native material controls to fit both average pigment and texture spread.
The distribution fitter uses six shared parameters: hue, saturation, value gain,
value exponent and two white-balance gains. It uses the same filtering on source
and reference pixels. Dark keylines stay out of this fit because black level is a
separate measurement.

```sh
node games/magic/tools/accuracy/old-frame-native-source-study.mjs \
  inputs.json poses.json geometry-inputs geometry.json material-controls \
  candidate-profile.json --material-only
python3 games/magic/tools/accuracy/old_frame_color_distribution.py \
  geometry-inputs material-controls initial-colors.json pigment-proposal.json
python3 tests/magic_old_frame_color_test.py
```

The default family is `mse-old` and the default materials are `WUBRGMA`.
Use `--family seventh-mirage --materials L` for the Mirage-specific land source.
Do not mix different nonbasic-land paper treatments into one pigment target.
A fixed clipping limit can reject a proposal even when its average color improves.
Inspect a native replay after fitting; a numerical proposal does not certify the
mask, source texture or black level.

The body and heading tools replay the production painters. They first require
an exact match to the frozen full-card native control. Candidate lettering is
then painted on a neutral background. The text objective combines symmetric
edges with filled-ink overlap, so hollow outlines cannot win just by adding edges.
Heading strips exclude the frame rails. Light lettering is measured separately
from its dark shadow.

```sh
node games/magic/tools/accuracy/old-frame-body-study.mjs \
  inputs.json poses.json geometry-inputs/inputs.json native-capture \
  candidate-profile.json body-candidates.json body-study.json
node games/magic/tools/accuracy/old-frame-heading-study.mjs \
  inputs.json poses.json geometry-inputs/inputs.json native-capture \
  candidate-profile.json heading-candidates.json heading-study.json
```

Start a body definition with `{"id":"current"}`, then add candidates with numeric
`adjustment` deltas. For example:

```json
{
  "maximumPerCohort": 3,
  "candidates": [
    { "id": "current" },
    {
      "id": "spacing-trial",
      "adjustment": { "leading": 0.04, "rightMargin": -2, "paragraphGap": 0.1 }
    }
  ]
}
```

Omit `maximumPerCohort` for the full nonland body inventory. The heading tool
takes a `roles` list, such as `["title", "type", "artist", "stats"]`.
Its candidates use `delta: { dx, dy, size, width }`, or role-specific deltas.
Width is a multiplier; the other values use canonical pixels. A centered artist
credit also needs an explicit `maxWidth`; a left-aligned width limit cannot be
reused after moving its anchor to the center.

Select shared values using calibration names. Report validation names separately,
then run the complete inventory. Inspect changed line counts and sizes, especially
flavor text and dense passages. The full body trials exposed substantial
regressions on Feral Shadow, Nettletooth Djinn and Sage Aven despite better
aggregate scores. Those proposals have not been adopted.

The compact measurements and review queue are in
[`typography-color-study.json`](../fixtures/accuracy/mirage-onslaught/typography-color-study.json).
Its text scores are offline fitting objectives, not published whole-card scores.
Artist wording, copyright and collector text still require their own source
review. For example, Mirage's Crystal Vein prints “Pat Morrissey”; the imported
artist string says “Pat Lewis.” That difference must not become a geometry fix.

## Keep art content and frame rims separate

Rim-only registration does not certify the art aperture. A candidate can match
the frame well while placing its illustration several pixels too high. Compare
the interior illustration gradients using the already frozen scan poses. Use
calibration-name medians for shared aperture changes; report validation names and
small basic-land development groups separately. Diagnostic per-card transforms
must never become per-card rendering corrections.

Moving the whole frame to correct the illustration improved art overlap to more
than 96/100, but damaged frame and type-line scores. That candidate was rejected.
An optional `frames[material].artWindow` instead maps the source image field to
the calibrated `art` rectangle. It keeps the original whole-image affine sampling
below a declared source anchor. Preserve the type-line region as well as rules
and footer pixels; an anchor below the type line changed its bezel and was also
narrowed. Source colors stay bound to the unchanged frame placement.

The optional painter changes no existing defaults: all 65 preexisting native
family controls are byte-identical. A second check compares every candidate's
RGBA pixels below its anchor with the unchanged parent:

```sh
node games/magic/tools/accuracy/old-frame-art-window-parity.mjs   parent-native candidate-native candidate-profile.json lower-parity.json
```

This check includes rejected scan poses because it compares native renders,
without resampling scans. The two native pixels at the clipping boundary are
excluded to avoid counting antialias support.

## Measure mana paper before fitting glyphs

Mirage and Onslaught have light mana-disc paper over the frame. The general
two-polarity detector sometimes preferred a stronger dark edge inside a glyph.
The study-specific detector declares the light-paper polarity for the whole set;
it does not choose a polarity per scan. Synthetic tests reject flat backgrounds,
noise, inverted discs and out-of-bounds circles while retaining a paper rim
around a stronger internal glyph.

The frozen name-hash sample measures 53 Mirage and 55 Onslaught costs, covering
all five colors and generic discs. Scan transforms remain unchanged. Circle size,
position, pitch, paper pigment and ink are reported separately. Adjacent-disc
pitch needs its own radius, vertical-consistency and physical-spacing checks.

```sh
node tests/magic-old-frame-mana-disc.mjs
node games/magic/tools/accuracy/old-frame-native-mana-measure.mjs   inputs.json poses.json exported-inputs.json native-directory mana.json
node games/magic/tools/accuracy/old-frame-mana-glyph-study.mjs   inputs.json poses.json native-directory mana.json glyph-proposals.json
```

Glyph proposals use three relative ink thresholds, filled-mask overlap and edge
overlap within measured circles. They preserve the glyph's position and size
relative to its disc. Calibration names select one transform per color with a
worst-regression penalty; validation remains separate. Binary mask resizing is
only a proposal: replay the actual native painter before adopting values.

Text trials that change width, fractional fitting and paragraph spacing together
can improve the mean while breaking printed quote wrapping. Preserve the
existing font size and line breaks when testing baseline placement. Full-set
trials are required: even a retained-wrap leading adjustment can regress dense
seven-line passages that already fit correctly. Such passages need a shared
height constraint rather than card-specific fixes.
