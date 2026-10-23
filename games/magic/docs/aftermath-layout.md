# Aftermath native-frame pass

The first pass covers all 15 ordinary AKH and 10 HOU aftermath printings with a
nonfoil finish. It replaces two resized ordinary frames with pinned complete
CardConjurer plates, clipped by half to preserve each color. No reference scans
or illustration binaries are shipped. Source attribution is in [NOTICE](../NOTICE.md).

The upper and rotated lower art apertures, image clipping, foil windows and
etching targets share the same panel geometry. Mana shadows rotate with the
reading direction. The split helper also removes Fuse from both text
representations so it cannot appear in a panel and the common strip.

## Text and data

Each panel uses measured text with bounded shrinking and explicit inline
italics. The exploratory AKH/HOU search selects a 22.5 px upper maximum for AKH,
24.5 px for HOU, and a shared 22 px lower maximum. Upper text moves 2.5 canonical
pixels below geometric centering. A tiny final line in one upper paragraph can
trigger a reduction of at most 10%; a one-line upper passage centers unless the
caller chooses left alignment. Explicit original/Oracle alignment references
use the existing library option. These are shared policies, not card-name or
per-scan runtime adjustments.

The lower box uses 232 × 169 canonical pixels. Enlarging it to 177 px helped
Memory but caused line-wrap regressions elsewhere. The selected compromise was
checked across both sets. Some printings still need a different size or
paragraph gap; Rags // Riches remains a measured regression.

MTGJSON repeats the other half's `originalType` on 13 faces in this cohort. The
accuracy adapter records each conflict and uses the agreeing per-face MTGJSON
`type` and Scryfall `type_line` only for the narrow duplicated Instant/Sorcery
case. It never replaces historical creature subtypes. Original rules wording
remains MTGJSON's per-printing text. The corrected inputs were rendered again
through v0.2.16 so before/after images use identical wording and metadata.
These provider conflicts remain a source-data follow-up, not silently certified
original-type provenance.

## Normalization and measurements

The scan is normalized against the source plate's outer side rails, top rail
and horizontal join. No title, art, rules or set-symbol ink is used to fit its
own position. Independent fit/validation samples use the existing bounded
translation, scale, rotation and skew policy; no thresholds were relaxed.
The same frozen scan transform is used for both renderer versions.

Nineteen of 25 fits pass. Never // Return lacks sufficient frame support.
Start // Finish, Cut // Ribbons, Consign // Oblivion, Claim // Fame and
Driven // Despair fail model validation. They remain visibly unaligned and
unscored in the local gallery.

Mean dark-letter edge F1 within one canonical pixel, on the 19 accepted scans:

| Region      | v0.2.16 | Native pass |
| ----------- | ------: | ----------: |
| Upper name  |    .163 |        .837 |
| Lower name  |    .248 |        .732 |
| Upper rules |    .130 |        .702 |
| Lower rules |    .285 |        .623 |

This is an exploratory cohort fit, not an independent typography holdout or a
whole-card accuracy percentage. The dark-letter mask suppresses paper texture
and brightness differences; it is not a color metric. The lower rules score for
Rags // Riches falls from .318 to .249. Colors, foil stamp and footer lettering
remain approximate. The source plate's window/border details can still differ
from the printed card; scan normalization must not hide those asset errors.

## Type-line alignment follow-up

The lower type text shared an offset for every type label, including Instant
and Sorcery. Move its reading-orientation rectangle 3 canonical pixels earlier
and 9 pixels upward; on the upright card that moves the text right and up.
The shared rectangle also keeps semantic hit regions aligned with the plate.
Upper type text and artwork geometry are unchanged.

A local offset sweep against the same 19 accepted reference registrations raised
mean lower type dark-letter edge F1 at one pixel from .136 to .423. This is a
position correction, not a claim of complete typography matching; font shape,
size and scan variation remain. Rejected registrations were excluded.

## Reproduction

Use the cached major-set metadata inventory and a clean checkout of v0.2.16:

```sh
MAGIC_CAPTURE_ROOT=/path/to/v0216-checkout node games/magic/tools/accuracy/aftermath-study.mjs --baseline
node games/magic/tools/accuracy/aftermath-study.mjs aftermath-native-final-v2
node games/magic/tools/accuracy/aftermath-text-search.mjs aftermath-native-final-v2
```

Captures refuse to overwrite an existing audit. Full source hashes, input
records, registration matrices, rejected fits and raster hashes live under
ignored `test-results/magic-accuracy/`. The compact
[receipt](../fixtures/accuracy/aftermath-native.json) binds the final audit. The local
review application supplies original / v0.2.16 / current / red-green views and a
button to inspect the lower panel upright. No review UI is included in the lib.

Regression tests cover physical art/printing/etching apertures, rotated mana
shadows, cache invalidation, duplicate Fuse, original-type conflict boundaries,
missing-frame rejection, and recovery of known scan transforms independently
of art/text. The integration suite paints 17 synthetic Magic layouts at both
tiers; its inputs and assets do not use reference art.
