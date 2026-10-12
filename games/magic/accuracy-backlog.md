# Rendering accuracy review queue

This is a working queue from the measured M21, M20, Mirage, Tempest, Fourth/Fifth Edition and Revised sets, not
an assertion that every supported frame has been evaluated. Special treatments
remain outside the current study. Keep the original frame assets in use while
tracking the problems below. The local all-card reports contain asset URLs,
example UUIDs, alignment flags and scores for each affected group.

## Assets needing visual review

| Asset group                                             | Observed problem                                                                                                                                                                                          | Examples / next evidence                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Seventh-family artifact frame (`seventh/regular/a.png`) | Mirage's printed dark reddish texture differs strongly from the brown plate; text-box pattern is also conspicuous.                                                                                        | Lead Golem, Grindstone, Altar of Dementia; inspect both sets before choosing an era-specific replacement.                                                                                                                                                                                        |
| Other seventh-family colored plates                     | Texture, art borders and right rail differ from the older scans. Color-insensitive scores intentionally understate some visible color differences.                                                        | Blue Shaper Guildmage and red Viashino Warrior; keep texture/geometry and color observations separate.                                                                                                                                                                                           |
| Historic set symbols (`mir.svg`, `tmp.svg`)             | White outlines and monochrome treatment are now painted, but palm leaves/trunk and cloud/bolt contours still differ from the scans.                                                                       | Compare tight crops across all colors; frame ridges can contaminate whole-window scores.                                                                                                                                                                                                         |
| Fourth-family colored/artifact plates                   | Texture and border differences remain. Revised's outer rectangle is about 1.09px narrower and 4.30px taller at 488×680; art and text-panel lower/upper edges also differ.                                 | Revised frame-registration study confirms this across colors and artifact plates. Keep the assets; separate plate geometry from scan registration before changing typography.                                                                                                                    |
| Mana glyphs and historic tap font                       | MIR/TMP/Fourth use the tilted-card tap; Revised now uses the diagonal T. Inline numeric circles are present in the Revised scans and are retained. Printed stroke weight and exact contours still differ. | Seven reserved Revised taps verify identity; Royal Assassin retains a lower shape score and remains a metric/shape review case. Revised header placement and original white sun now pass a reserved study; remaining skull/tree/flame/numeral contours are recorded in `3ed/mana-transfer.json`. |
| Goudy / MPlantin font sources                           | Weight and width remain visibly different on some old-border titles, body text and credits. A better wrap score does not guarantee the same glyph outlines.                                               | Mtenda Herder, Mogg Conscripts, Lead Golem, Suq'Ata Firewalker; Fourth Edition titles and credits are also visibly heavy. Fit shared typography before considering a font replacement.                                                                                                           |
| Modern frame plates, type/stats borders and stamps      | Existing full-set asset associations need component inspection before assigning the error to an asset or placement.                                                                                       | M21/M20 `asset-backlog.json`; do not replace a plate on an aggregate score alone.                                                                                                                                                                                                                |

Frame sources and pinned revisions are listed in [NOTICE.md](NOTICE.md) and
[assets.json](assets.json). The historical tap uses a pinned external font; no
third-party binary was added to the repository. Original illustrations are not
identified as bad assets by this pass: Scryfall art crops and full scans can
have different color/scan processing, which must not become a geometry penalty.

## Implementation and coverage gaps

| Area                                                 | Current state                                                                                                                                                                                                                                     | Next action                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Old-border basic lands                               | MIR/TMP now render the historical type line and centered mana sentence; all 40 improve, including 35 reserved cards. Other early sets still use the later large symbol.                                                                           | Transfer the printing policy only after reviewing other eras; track basic-land plate texture separately.                                                                                                                                                                           |
| Fourth-family headers and typography                 | All 378 Fourth Edition cards measured; all 357 confident nonland pairs improve in title, mana and footer. Type placement has 155 gains and 12 regressions. A natural-width stats policy now improves all 150 confident Fourth Edition stat boxes. | Isolate title/type/credit ink and fit shared font weight/width. Fifth Edition stats still need weight/width review; Revised uses different numeric ink treatment. Inspect type regressions before transferring the header policy.                                                  |
| Old-border ABU and Legends multicolor families       | Alpha/Unlimited credits now pass reserved validation and are audited across 597 printings. Early-frame titles, types, mana, stats, body and silhouette still need work; Legends multicolor remains unvalidated.                                   | Retain shared identity and explicit frame uncertainty. The first early title candidate was rejected after visual review. Validate Beta credit transfer; correct historical fields before further type/stats/body fitting.                                                          |
| Modern planeswalkers                                 | All 26 M21/M20 walkers use printing wording and measured ability ink. Reserved M21 body F1 .365 → .508; M20 .316 → .486. “Large” means more than three parsed rows, not oversized physical cards.                                                 | The 70-card component pass improves Chandra and sparse WAR text. Audit type-strip/outline registration separately: combined scores still decline. Ugin’s text has user visual acceptance. Flat paper, badge bevels, footer/stamp and possible final-line loyalty occlusion remain. |
| Saga, Class and leveler                              | Painter branches exist; the current reference adapter accepts only `normal` Scryfall layout and lacks dedicated region metrics.                                                                                                                   | Add explicit eligible layouts and asset routing, then independent windows and cross-set examples. Do not call these unsupported renderers merely because evaluation is missing.                                                                                                    |
| Adventure, split and aftermath                       | Composition code exists, but multi-face reference/art selection and paired per-panel evaluation are missing from this pipeline.                                                                                                                   | Preserve printing identity and face ordering; add per-face art/cache records and panel metrics.                                                                                                                                                                                    |
| Transform, modal double-faced, meld, flip and Battle | No verified dedicated rendering/evaluation contract in this pass. Unknown layouts can currently fall through to an ordinary frame.                                                                                                                | Inventory routing and implement explicit support or a reported unsupported result; do not silently claim ordinary-frame output is correct.                                                                                                                                         |
| 2003-era modern and future frames                    | Reference policy currently accepts only Scryfall frame values `1993`, `1997`, `2015`.                                                                                                                                                             | Distinguish unsupported frame geometry from unsupported image/reference metadata; add families deliberately.                                                                                                                                                                       |
| Footer metadata and printed wording                  | MIR/TMP and Fourth Edition nonlands have reviewed legal defaults. Fourth Edition has 36 reviewed bodies, 325 source-backed texts and 17 explicit fallbacks. Revised now has a complete baseline with 290 source-backed texts and 16 fallbacks.    | Review original type lines, punctuation and paragraph styling separately. Fourth Edition lands still need their legal line and artist placement after calibration; Revised lettering placement is improved; weak/broken strokes remain under review.                               |

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
  scan has a green frame with a blue mana cost. The exact-printing annotation now
  selects the existing `old/fourth/g.png` through `frameColors`, preserving blue
  card colors and cost. Its large rules continuation now matches the printed
  line endings; weak title strokes and header mana still need work. The scan
  hash begins `d4df515ddc0674a4`.

The full stats study retains Fourth/Fifth Edition placement and rejects Revised's
transfer. Revised's old output is restored byte-for-byte across all 306 cards.
Fifth Edition's two confident regressions are Keldon Warlord and Lhurgoyf; their
larger/heavier printed stars need a shared font/width treatment, not individual
position fixes. The earlier Revised study had 61 alignment warnings among 105
stat boxes. The new outer-frame detector resolves the false bevel correspondences
for its 281 fourth-family cards; 25 cards in other families remain uncalibrated.
The later lettering study below adds a paired light/dark metric and improves
Revised stats placement; exact glyph weight and interiors remain unresolved.

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

Revised's `revised-symbols` run replaces the modern tap arrow on 59 faces;
247 faces and all layout metadata remain identical. Every changed pixel lies
inside an inline tap disc. Independent glyph crops confirm the symbol identity
on seven reserved cards across all colors, with a numeric-only control unchanged.
Whole-body F1 changes by less than .005, showing why small symbols need separate
scores. Royal Assassin's shape score still regresses despite the correct glyph
identity; retain it for foreground extraction / residual-position review.
The new crop review also finds roughly 5.5px of leftward body displacement on
five colored cards, and excessive paragraph/flavor gaps on several long texts.
The subsequent body-inset study is recorded below; residual symbol shape and
position remain separate from those shared body changes.

Revised's intermediate `revised-long` change moves long/multiparagraph bodies to
x 70, width 346, removes extra paragraph/flavor gaps, and shifts the optical center
up 10px while keeping ink inside the physical panel. Across 198 changed faces,
inspect body F1 rises from median .324 to .587; 154 gain more than .02 and 22
regress. Table has 158 gains and 18 regressions. The 23 distinct regressions are
retained in `3ed/long-body-measurement.json` and shown in the local body review;
this is not completion of Revised typography. All 108 other faces are unchanged.

The 12 reserved cards all improve, but only seven match every printed line.
Drudge Skeletons and Dragon Whelp have missing activation colons in source data.
Dragon Whelp's flavor starts on the same line as the final rules sentence;
Fireball's parenthesis is upright, unlike the adapter's reminder heuristic.
Hypnotic Specter, Giant Spider and Library of Leng retain wrapping differences.
Do not tune geometry to compensate for those source/style errors.

Next work is the missing size/alignment classes: Animate Wall, Sacrifice,
Volcanic Eruption and Sengir Vampire use large centered passages; Clone,
Gaea's Liege, Earthbind and The Hive use substantially smaller printing. The
largest score regressions are Gaea's Liege, Earthbind, The Hive and Sorceress
Queen. Lord of Atlantis has a taller printed flavor block. Wall of Ice is a
particularly clear Oracle fallback error: its scan has only flavor, whereas the
input adds a modern defender/reminder line. Keep it outside source-backed
aggregates and correct its input independently. Existing font stroke weight and
plate texture differences remain asset work, not reasons to fit individual scans.

The source/style issues above for Drudge Skeletons, Dragon Whelp, Fireball and
Wall of Ice are now corrected in the separate `revised-text` baseline. All four
match printed line endings; stroke weight still differs. The other 302 cards
are unchanged. Other missing punctuation (including Holy Armor) still needs
review. The first dense-type candidate failed reserved transfer and was not
adopted; `dense-transfer.json` records the regression and missed classifications.

The `revised-dense` follow-up corrects the small type on 13 Revised cards,
including Clone, Earthbind, Gaea's Liege and The Hive. All 13 improve at both
sizes and match printed line counts; the other 293 faces are unchanged. This
resolves the size component of those earlier dense regressions. It does not
resolve remaining word wrapping, font stroke weight, larger centered passages,
or the other regular-type regressions. The final shared classifier was developed
with all affected scans visible; it has no untouched positive validation cohort.

Two particularly useful metric failures are preserved: Copy Artifact and Mons's
Goblin Raiders expose overclassification by character count; Aladdin's Ring
gets a better edge score despite visibly wrong small type. Use line counts,
word-line checks and direct crops together before accepting geometry. Aladdin's
Ring retains regular type and still needs its printed inline flavor attribution.
Newly inspected source issues include missing activation colons on Sedge Troll,
Frozen Shade and Zombie Master; Sedge Troll is excluded from the no-known-content-
issue aggregate. Correct those sources separately before finer placement tuning.

Revised lettering now has its own frozen candidate and reserved validation:
titles, illustrator credits and numeric stats use paired light/dark edges with
shared placement. The complete 306-card audit confirms all body layouts and 25
land faces are unchanged. At inspect size, paired-edge median F1 improves from
.390 to .480 for titles, .232 to .467 for credits and .209 to .365 for matching
stats. Animate Dead's title regresses; dark-frame letter interiors remain weak
or broken and some white-frame numerals are too thin/small. Keep these shape
issues open despite the aggregate gains. See `3ed/lettering-measurement.json` and
`3ed/lettering-audit-review.json` for the score disagreements and reviewed crops.

The subsequent `revised-fields` run corrects seven historical type lines,
Vesuvan Doppelganger's `*/*` and Drain Life's `{1}{B}` across eight cards. The
renderer, body layouts and remaining 298 faces are unchanged. `revised-frame`
then corrects Serendib's printed palette/type only. Field-specific scan reviews
do not certify body wording, and these source corrections are not renderer gains.
Type-line geometry/ink, header mana and the larger centered body classes remain
the next rendering studies after source validation.

The `revised-large` study now covers 25 larger centered passages, including
Animate Wall, Serendib Efreet, Sacrifice and Sengir Vampire. Production matches
the frozen prototype at both sizes; all 281 other Revised faces are unchanged.
24 changed cards gain edge F1 at both sizes; Disrupting Scepter regresses and
still has four lines instead of its printed five. That card needs a shared
line-breaking/size study, not a fitted card offset. Web, Reverse Damage, Karma
and Lifeforce also retain different line endings. Deathgrip adds a confirmed
source omission: the colon after its two black mana symbols. Correct its input
separately before refining typography. Of 25 changed bodies, 24 match the printed
line count and 19 match every line ending; stroke weight still differs.

The Revised interior-fill trial in `3ed/letter-fill-transfer.json` is rejected:
the frozen neutral fill slightly reduces reserved inspect-title paired F1
(.493 to .491), table-stat F1 and stats contrast correlation. No production
renderer change is adopted. It improves some white-frame strokes but leaves
dark-frame contours weak; this is still an ink/font investigation, not a proven
replacement-asset requirement. The 12 reserved examples now count as seen.

Development-only glyph-bound windows reduce empty title/footer area, but texture
and nearby frame edges still change the preferred translation. Competing title
peaks and stats window sensitivity make those offsets unsuitable for adoption.
Inspect the local `3ed/letter-fill-development-neutral/foreground-windows.png`
alongside `3ed/letter-foreground-development.json` before another geometry study.
The private `3ed/letter-fill-validation/index.html` labels the candidate rejected
and preserves the current renderer alongside it.

Mesa Pegasus's Revised scan credits "Melissa Benson"; the input credits
"Melissa A. Benson". The exact scan hash is recorded in the transfer fixture.
Correct this presentation field separately and exclude the footer from further
fitting in the meantime. MTGJSON original rules text does not certify artist
spelling, historical type, punctuation or paragraph styling.

Revised header mana now uses the cached historic font's original spiked sun,
without a disc, and removes the previous down-left shadow. A shared center at
x=435/y=44.5 and 27px pitch passes all 13 reserved mana rows at both tiers,
including Force of Nature's five symbols. Titles and inline rules symbols keep
their previous policies. This is a Revised-only calibration; other sets still
need independent historical-header review.

`3ed/mana-transfer.json` records exact retained SVG URLs/checksums and scan IDs
for skull teeth (`B.svg`), tree details (`G.svg`), flame contour (`R.svg`) and
numeral weight/height (`1.svg`). Disenchant's printed numeric disc has very low
contrast against its white frame; our numeral is thicker/shorter and its disc
darker. Geometry gains do not resolve these asset/style differences. The local
`3ed/mana-validation/index.html` shows all reserved costs at the same scale.

The full Revised mana audit has 276/281 inspect gains and 275/281 table gains
above .02. Dingus Egg regresses at both sizes; Keldon Warlord, Lightning Bolt
and Wall of Fire regress at table size. All four were inspected at both tiers
and remain in `3ed/mana-corpus-review.json`. The low blue-card crops also show a
taller/narrower historic droplet than `U.svg`. No card-specific shifts were added.

Alpha/Unlimited artist and stat source corrections are recorded separately in
`early-printing-field-review.json`. The printed X/X on Alpha Plague Rats and
Unlimited Keldon Warlord still needs the historical glyph shape and light/dark
ink treatment. Both now use the correct letters, but overlap can fall relative
to the incorrect stars. Alpha Jade Statue now includes the printed 3/6; its
stat treatment also remains uncalibrated. Do not tune placement against the old
incorrect fields or count these input corrections as typography improvements.

Alpha/Unlimited mana now uses the original sun and shared measured placement.
`early-mana-corpus-review.json` records the remaining failures: Unlimited single
red costs are farther right than the Alpha-derived policy, and Wild Growth/Sol
Ring regress at table size. Recalibrate Unlimited with a broader cost cohort;
do not repair individual scans with individual offsets. Alpha Cyclopean Tomb's
absent printed cost needs a source override in original-printing mode. Exact
SVG URLs and checksums for the remaining contours accompany the review.

User review identifies two immediate typography corrections: illustrator text
should use the title face with gray fill and a shadow, not transparent interiors
and paired highlight edges; Unlimited Howling Mine needs larger centered body
text and its printed Continuous Artifact type. Add explicit Oracle/original
wording and symbol selection, with original type-line provenance and missing
field diagnostics. Revised's original creature types must retain Summon; early
artifacts may be Mono, Poly or Continuous. Do not infer historical subtypes from
modern Oracle subtypes.

## Follow-up from the centering/source audit

- Fourth's five-line flavor rule now also requires at most 150 visible characters.
  Sisters of the Flame returns to left alignment (.367 → .629 inspect body F1);
  the other 373 unchanged-input cards retain identical body rasters. Twelve Fifth
  boundary controls are all left aligned: this rule must remain Fourth-specific.
- Deathgrip's regression was a missing canonical source correction. Its reviewed
  activation colon and Regeneration's are now in the corpus annotations, alongside
  newly reviewed Brothers of Fire and Wall of Brambles colons. Source changes are
  excluded from paired geometry scores.
- Establish the later core-set cutoff with short, flavor-free controls. Centered
  examples are confirmed through M14; longer or flavor-bearing M15/Origins/M19
  examples cannot identify the transition. Normal 2003 frame geometry still
  needs a validated adapter.
- Repair original type coverage: the preview correctly labels unverified source
  data, but Alpha Benalish Hero still receives a modernized MTGJSON originalType.
  Its scan says “Summon Hero.” Keep this separate from Oracle type semantics.
- Follow [MTGJSON PR #1748](https://github.com/mtgjson/mtgjson/pull/1748) and the
  corresponding Scryfall submission for Northern Paladin's eight missing flavor
  attribution breaks. Both upstream changes are pending review.

## Planeswalker component follow-up

The latest [70-card review](fixtures/accuracy/planeswalker-materials-plan.json)
retains the existing assets. Paper clipping, colon identity, badge dimensions and
row spacing are implemented; type-strip shape/position is still under review.

- Ability badges: the source image includes a hard bottom/right shadow and an
  angular bevel. An added soft shadow improves spread but cannot remove that
  baked shape. Replace or separate those asset layers later.
- Paper/frame plates: flat color still hides the illustration and printed paper
  texture. Colorless paper and type/title fills now use a shared brightness
  correction developed on M21 Ugin and WAR Ugin/Karn; outer-frame tone is unchanged.
  Karn's brighter title and variable outer-frame grays remain unresolved.
  Restore illustration composition before treating all remaining differences
  as a color-calibration problem.
- Bottom curve: the existing source assets contain it; their complete heights
  now render instead of being cropped. Placement still needs review: inspect
  overlap improves while table overlap declines, and the restored outer edge
  sits low in the M21 Ugin sample. Separate inner rim, outer curve and missing
  stamp targets before tuning geometry. This is not yet evidence that a new
  frame asset is required.
- Type strip: isolate printed letters, uniform outline and soft shadow into
  separate targets. Existing registration and raw scores disagree; most registered
  type crops decline after the visually directed shifts. Keep this flagged.
  Independent straight-edge and interior-ink diagnostics now retain ambiguous
  cases explicitly; curved ends and shadow shape still need separate targets.
- Final ability text: check actual ink against the starting-loyalty silhouette;
  rectangle intersections alone flag many harmless transparent badge corners.
- Original wording: M15’s six type lines now have partial scan reviews. Its
  source line-ending artifacts are normalized with raw provenance retained.
- Sparse typography: WAR’s one-activation cards now allow larger text. The final
  70-card pass reuses examined cards; reserve another set before claiming transfer.
