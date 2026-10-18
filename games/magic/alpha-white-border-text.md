# Alpha white: original wording, inner border and shared text

This follow-up preserves the earlier frame fits and replays them with verified
original wording. It also evaluates a supplied inner-border layer and the
archived shared Alpha text adjustments. These are local experiments, not
renderer defaults or a completed set calibration.

The machine-readable [result receipt](fixtures/accuracy/alpha-white-border-text-result.json)
records the input revision, source hashes, pixel-isolation checks, all 45 card
scores and the archived typography study. The [tool guide](tools/accuracy/frame_reconstruction/README.md)
documents capture and scoring. External images and comparison pages remain in
ignored experiment output; no external artwork is shipped with this report.

## Corrected inputs and controls

All 45 original rules bodies were already correct. The earlier input snapshot
retained 21 modern type-line fallbacks, now replaced with scan-reviewed original
types. The new input revision is `alpha-white-original-wording-v2`. Changed
pixels are confined to the type-line band; scan transforms, art and other input
fields are unchanged. Earlier reports retain their historical scores and state
the wording limitation.

All 45 released native baselines reproduce exactly. There are 585 candidate
captures, representing 13 variants per card. The inner-border variants preserve
the printed interior pixel for pixel; shared typography changes are confined to
the rules area. Every variant uses the same frozen scan normalization, including
scale, rotation and shear. These historical poses remain experimental.

## Supplied inner border

The supplied 1062 × 1482 transparent overlay was reconstructed from 14 land
scans. Its bottom inner boundary differs from the white-frame measurement.
One shared monotone remap brings its inner and outer edges to the previously
measured white boundaries. A separate robust color fit adds approximately
RGB (3.80, 1.07, 4.01) in 8-bit levels. It does not recolor the white frame,
illustration or outer stock.

| Inner-band RGB absolute error, 8-bit levels ↓ | As supplied | Geometry | Geometry + color |
| --------------------------------------------- | ----------: | -------: | ---------------: |
| All 45 cards                                  |       9.245 |    9.128 |            8.907 |
| 11 development comparison cards               |       9.174 |    9.091 |            8.973 |

The whole-card index changes by less than 0.02 points versus the earlier flat
two-band prototype and slightly declines. This result supports a modest band
color improvement, not a whole-card accuracy gain. The dedicated band diagnostic
is necessary because the ordinary frame region does not measure this stock area.

The extraction notes explicitly exclude bright corner marks and six-pixel corner
zones. The white frame keyline survives composition, but the bright corner mark
visible in the inspected reference is absent from the supplied overlay. Corrected
source corners are pending. Preserve this receipt before fitting that replacement.

The original texture backpropagation excluded dark stock, so adding the border
does not invalidate the existing white-texture fit. The next experiment will
nevertheless refit the corrected layer and test a bounded shared refinement with
the complete frame composite. Keep separate frame, inner-band and corner losses;
do not allow the white texture to compensate for an incorrect border. Freeze
lettering and artwork while measuring this change.

## Archived shared typography replay

The earlier full Alpha text study produced shared candidates but did not promote
them into the renderer. Its held-out rules result improved on 94 of 110 cards,
regressed on nine and changed little on seven; eleven layouts overflowed. Those
failures require refinement, but do not erase the substantial average gain.

This replay applies its shared centered, centered-long and regular layout models
to the current renderer, preserving the current ink weight. It makes no new
per-card fit. Of 45 white cards, 41 accept a shared adjustment. Balance, Reverse
Damage and Mesa Pegasus retain native text because of overflow; Blaze of Glory
has no matching shared dense-text model.

| Mean across 45 cards      | Before text replay | After text replay |
| ------------------------- | -----------------: | ----------------: |
| Rules structure /100      |              66.97 |             80.68 |
| Whole-card structure /100 |              79.27 |             83.75 |

Thirty-nine rules scores improve by at least 0.5 points, two decline and the four
fallbacks remain unchanged. The declines are Veteran Bodyguard (63.86 → 54.55)
and Personal Incarnation (65.06 → 56.39). Visual review of Personal Incarnation
finds improved printed line breaks despite the lower overlap score. Inspect line
baselines, filled ink and wrapping separately before treating either score as a
reason to discard the shared fit.

The largest gains include Resurrection (53.72 → 89.98), Animate Wall
(55.32 → 89.85), Savannah Lions (62.52 → 92.35) and Healing Salve
(66.11 → 94.97). These are indices, not percentages.

Both sides of the text-only comparison use the same reconstructed frame, inner
border, silhouette and full-scan-derived art. The rules difference is isolated.
The absolute whole-card score benefits from reusing reference artwork and is
not an independent prediction of art accuracy. The old typography model and the
development comparison cards have both been inspected before; this is a replay,
not a fresh held-out validation.

## Verification

`npm run build` and `npm run check` passed, including strict Clippy, rustfmt,
Rust tests, TypeScript, formatting and dependency boundaries. The seven numerical
model/refinement tests passed. Native baseline parity and image-isolation checks
passed for all 45 cards. No public renderer code or API changed in this follow-up.
