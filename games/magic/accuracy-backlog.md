# Rendering accuracy review queue

This is a working queue from the measured M21, M20, Mirage, Tempest, Fourth/Fifth Edition and Revised sets, not
an assertion that every supported frame has been evaluated. Special treatments
remain outside the current study. Keep the original frame assets in use while
tracking the problems below. The local all-card reports contain asset URLs,
example UUIDs, alignment flags and scores for each affected group.

## Assets needing visual review

| Asset group                                             | Observed problem                                                                                                                                                          | Examples / next evidence                                                                                                                                                               |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seventh-family artifact frame (`seventh/regular/a.png`) | Mirage's printed dark reddish texture differs strongly from the brown plate; text-box pattern is also conspicuous.                                                        | Lead Golem, Grindstone, Altar of Dementia; inspect both sets before choosing an era-specific replacement.                                                                              |
| Other seventh-family colored plates                     | Texture, art borders and right rail differ from the older scans. Color-insensitive scores intentionally understate some visible color differences.                        | Blue Shaper Guildmage and red Viashino Warrior; keep texture/geometry and color observations separate.                                                                                 |
| Historic set symbols (`mir.svg`, `tmp.svg`)             | White outlines and monochrome treatment are now painted, but palm leaves/trunk and cloud/bolt contours still differ from the scans.                                       | Compare tight crops across all colors; frame ridges can contaminate whole-window scores.                                                                                               |
| Fourth-family colored/artifact plates                   | Texture and border differences remain. Revised's outer rectangle is about 1.09px narrower and 4.30px taller at 488×680; art and text-panel lower/upper edges also differ. | Revised frame-registration study confirms this across colors and artifact plates. Keep the assets; separate plate geometry from scan registration before changing typography.          |
| Mana glyphs and historic tap font                       | Mana placement is corrected and the tilted-card tap variant is selected. Printed stroke weight, circle and internal glyph shapes still deserve independent review.        | White sun is a known difficult landmark case; Shaper Guildmage and Grindstone expose tap details.                                                                                      |
| Goudy / MPlantin font sources                           | Weight and width remain visibly different on some old-border titles, body text and credits. A better wrap score does not guarantee the same glyph outlines.               | Mtenda Herder, Mogg Conscripts, Lead Golem, Suq'Ata Firewalker; Fourth Edition titles and credits are also visibly heavy. Fit shared typography before considering a font replacement. |
| Modern frame plates, type/stats borders and stamps      | Existing full-set asset associations need component inspection before assigning the error to an asset or placement.                                                       | M21/M20 `asset-backlog.json`; do not replace a plate on an aggregate score alone.                                                                                                      |

Frame sources and pinned revisions are listed in [NOTICE.md](NOTICE.md) and
[assets.json](assets.json). The historical tap uses a pinned external font; no
third-party binary was added to the repository. Original illustrations are not
identified as bad assets by this pass: Scryfall art crops and full scans can
have different color/scan processing, which must not become a geometry penalty.

## Implementation and coverage gaps

| Area                                                 | Current state                                                                                                                                                                                                                                     | Next action                                                                                                                                                                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Old-border basic lands                               | MIR/TMP now render the historical type line and centered mana sentence; all 40 improve, including 35 reserved cards. Other early sets still use the later large symbol.                                                                           | Transfer the printing policy only after reviewing other eras; track basic-land plate texture separately.                                                                                                                           |
| Fourth-family headers and typography                 | All 378 Fourth Edition cards measured; all 357 confident nonland pairs improve in title, mana and footer. Type placement has 155 gains and 12 regressions. A natural-width stats policy now improves all 150 confident Fourth Edition stat boxes. | Isolate title/type/credit ink and fit shared font weight/width. Fifth Edition stats still need weight/width review; Revised uses different numeric ink treatment. Inspect type regressions before transferring the header policy.  |
| Old-border ABU and Legends multicolor families       | Painter branches exist but lack calibrated accuracy evidence. Alpha has 295 cached printings and frozen metadata cohorts.                                                                                                                         | Calibrate independent frame landmarks and component windows before geometry changes. Alpha development examples show incorrect title/type ink treatment, credits and historical body presentation.                                 |
| Modern planeswalkers                                 | Both normal and taller rules-panel branches are captured in M21/M20. “Large” means the rules panel for more than three parsed rows, not oversized physical cards.                                                                                 | Replace estimated row sizing with measured text and independently reviewed badge/loyalty regions.                                                                                                                                  |
| Saga, Class and leveler                              | Painter branches exist; the current reference adapter accepts only `normal` Scryfall layout and lacks dedicated region metrics.                                                                                                                   | Add explicit eligible layouts and asset routing, then independent windows and cross-set examples. Do not call these unsupported renderers merely because evaluation is missing.                                                    |
| Adventure, split and aftermath                       | Composition code exists, but multi-face reference/art selection and paired per-panel evaluation are missing from this pipeline.                                                                                                                   | Preserve printing identity and face ordering; add per-face art/cache records and panel metrics.                                                                                                                                    |
| Transform, modal double-faced, meld, flip and Battle | No verified dedicated rendering/evaluation contract in this pass. Unknown layouts can currently fall through to an ordinary frame.                                                                                                                | Inventory routing and implement explicit support or a reported unsupported result; do not silently claim ordinary-frame output is correct.                                                                                         |
| 2003-era modern and future frames                    | Reference policy currently accepts only Scryfall frame values `1993`, `1997`, `2015`.                                                                                                                                                             | Distinguish unsupported frame geometry from unsupported image/reference metadata; add families deliberately.                                                                                                                       |
| Footer metadata and printed wording                  | MIR/TMP and Fourth Edition nonlands have reviewed legal defaults. Fourth Edition has 36 reviewed bodies, 325 source-backed texts and 17 explicit fallbacks. Revised now has a complete baseline with 290 source-backed texts and 16 fallbacks.    | Review original type lines, punctuation and paragraph styling separately. Fourth Edition lands still need their legal line and artist placement after calibration; Revised credits and outlined header/stats ink remain incorrect. |

Before expanding, follow the [component review plan](component-review-plan.md):
independent component targets, multiple structural measurements, visual crop
inspection, shared geometry, frozen transfer cohorts, and complete denominators.
Unsupported cards must remain in coverage reports with an explicit reason.

Fourth Edition paired summaries exclude 21 alignment warnings: 18 uncalibrated
lands, Balance, Plague Rats and Sleight of Mind. The latter is flagged only in
the baseline; a landmark may be following nearby text. Keep the union of both
sides' warnings when comparing versions. Maximum-overlap and minimum-distance
component searches now expose competing peaks; agreement still needs an
isolated foreground check before a shared placement change.

## Stats transfer findings

The centered-offset trial is retained in
[Fifth Edition's first measurement](fixtures/accuracy/5ed/stats-measurement.json)
as a failed wide-expression validation. The replacement
[right-anchor study](fixtures/accuracy/4ed/stats-wide-plan.json) includes complete
wide-expression windows and all three Fourth Edition wide cases. Positions stay
shared; no card gets a fitted scan offset. Numeric font files and shadow assets
remain unchanged.

- Fourth Edition: the shared right edge fixes compressed expressions. Numeric
  strokes and stars remain visibly heavier/different in some scan comparisons.
- Fifth Edition: printed stats appear heavier than our regular numeric font.
  Shapeshifter retains a width/shape mismatch after its right edge is corrected.
  These cards are already seen development evidence, not fresh validation.
- Revised: reserved crops reveal dark strokes with pale edges, unlike our light
  fill. Four of six reserved cards have confident alignment; three improve and
  Wall of Water regresses. Zombie Master and Primal Clay have frame-alignment
  warnings. Light-ink-only scores cannot certify the different treatment.
- Revised Serendib Efreet (`35415199-0f1d-4398-a48f-f78697a51105`): its reviewed
  scan has a green frame with a blue mana cost; semantic color currently selects
  `old/fourth/u.png`. This needs printing-specific frame selection, separate from
  any asset replacement. The cached scan hash begins `d4df515ddc0674a4`.

The full stats study retains Fourth/Fifth Edition placement and rejects Revised's
transfer. Revised's old output is restored byte-for-byte across all 306 cards.
Fifth Edition's two confident regressions are Keldon Warlord and Lhurgoyf; their
larger/heavier printed stars need a shared font/width treatment, not individual
position fixes. The earlier Revised study had 61 alignment warnings among 105
stat boxes. The new outer-frame detector resolves the false bevel correspondences
for its 281 fourth-family cards; 25 cards in other families remain uncalibrated.
Its numeric ink still needs a dark-stroke/pale-outline metric before stats work.

Mtenda Herder's regression against `main` was principally a wrapping boundary
problem: allowing 10 more canonical pixels on the white frame restores all seven
printed lines with the same fonts, raising body edge F1 from .177 to .704. This
is a shared MIR/TMP white-plate policy, not a card-name exception. Extending every
color regressed Energy Bolt, so other colors retain their existing widths.

The white `seventh/regular/w.png` frame has a gray bevel along the left and bottom
of its text box, absent from Mtenda Herder's scan. This is embedded in source
asset `2fc988fc7aeb82d6183200dbfdb9e0de5196197ada5d8e4eac7afff24cec2091`;
retain it in the asset improvement list while existing assets remain in use.
Shaper Guildmage's set-symbol score also falls against main (.465 → .401); its
white outline is restored, but the palm shape and frame contamination remain.

Fourth Edition long text blocks now use an inset left edge at 72px and a 344px
width, with no extra paragraph/flavor gap. Uncle Istvan's wrapping and inset
improve substantially. Angry Mob now has scan-verified original rules and type,
so its placement comparison no longer uses Oracle wording. Fourth Edition short
passages now use 25px centered balanced lines in a 344px width; 63 identical-input
full-set pairs improve at both tiers. Of 30 reviewed line targets, 28 wrap exactly;
Righteousness and Phantasmal Terrain still have a word on the wrong line. This
policy has not been transferred to Fifth Edition. Revised now uses a separately
validated 27.5px size, 30.25px baseline spacing and 348px width. The initial 344px
trial passed 15 reserved scans but introduced extra lines elsewhere in the full
set. A four-pixel expansion fixes the four reviewed wrapping failures and keeps
the earlier 21 line targets exact; six newly reserved scans also match exactly.
This shows why full-corpus checks must follow small validation cohorts. Revised
font weight, historic symbols, type lines and outlined header/stats ink remain
open issues. Blessing's source omitted a colon; its correction is tracked
separately from geometry changes.
