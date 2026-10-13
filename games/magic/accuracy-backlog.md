# Rendering accuracy review queue

This is a working queue from the measured M21, M20, Mirage, Tempest, Fourth/Fifth Edition and Revised sets, not
an assertion that every supported frame has been evaluated. Special treatments
remain outside the current study. Keep the original frame assets in use while
tracking the problems below. The local all-card reports contain asset URLs,
example UUIDs, alignment flags and scores for each affected group.

## Agreed execution order

Use the [current rollout plan](accuracy-plan.md#current-rollout-old-frames-then-new-frames):
major sets contain at least 50 distinct ordinary English paper cards; measure
every ordinary printing in admitted sets. Arabian Nights and Antiquities are
included. Smaller sets follow later.

1. Old-frame set symbols, then border geometry, then component HSB.
2. New-frame set symbols, then border geometry, then component HSB, including
   both 2003-era and 2015-era families.

Build the inventory and coverage ledger first. Keep unsupported cards and
registration failures visible. Existing typography/font issues below remain
queued separately during these three component passes.

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
  now render instead of being cropped. Separate rim/curve landmarks establish a
  shared 5px lower-panel lift, confirmed on ten reserved M19 printings at both
  tiers. The missing central stamp and curved endpoints still need separate
  targets. This is not evidence that a replacement frame asset is required.
- Type strip: isolate printed letters, uniform outline and soft shadow into
  separate targets. Existing registration and raw scores disagree; most registered
  type crops decline after the visually directed shifts. Keep this flagged.
  Independent straight-edge and interior-ink diagnostics now retain ambiguous
  cases explicitly; curved ends and shadow shape still need separate targets.
- Final ability text: check actual ink against the starting-loyalty silhouette;
  rectangle intersections alone flag many harmless transparent badge corners.
  The new lower-rim audit also reveals real text/paper collisions on dense WAR
  two-row cards that the nominal row-height overflow check missed. The final
  glyph-bound fitter now resolves these across 80 examined cards without
  changing font sizes or line wrapping. Sparse static/activated row placement
  (especially Narset/Tibalt) remains a later study; it is not a clipping problem.
- Original wording: M15’s six type lines now have partial scan reviews. Its
  source line-ending artifacts are normalized with raw provenance retained.
- Sparse typography: WAR’s one-activation cards now allow larger text. The final
  70-card pass reuses examined cards; reserve another set before claiming transfer.

## Core-set symbol follow-up

M19/M20/M21 now paint opaque lettering, an outer rim and shaded rarity fields;
M19's padded viewport no longer shrinks its symbol. Normal shields share a
2px left / 1px up correction. All 26 independently reserved M19 examples improve
at both tiers; this does not certify every symbol or every card in those sets.

- Existing `m21.svg` (`6535b31dcb289af1f58f33f200e536cad9392465ad947462585ca06e491b23d0`)
  still needs numeral-contour and letter-weight review. The short/narrow envelope
  was primarily rendering geometry: a shared 10% uniform enlargement and 1.5px
  rim improve all 26 development cards on paired edges, signed contrast and Census.
  Keep contour residuals separate from that corrected scale; the original glyph
  remains in use. See `set-symbol-size-plan.json` for the frozen policy and
  independent M20 reservation.
- Existing `m19.svg` (`cc9bce99d9170a8110235826bb06b6e735615559b0c932206c39d246a0a30c24`)
  no longer suffers viewport-padding shrinkage, but enlarged scans show differences in the M and 9
  outlines/weight. Examples: Aegis of the Heavens #1, Angel of the Dawn #7 and
  Resplendent Angel #34. Keep the pinned glyph; do not compensate per scan.
- Rarity gradients are an approximate material treatment. Per-set/color HSB
  calibration remains a separate task, and the scan's grain is not a geometry
  target.
- Normal type plates: a narrow lighter inset corrects the dark lower bevel in
  W/U/B/R/G/artifact materials. Gold, land and colorless plates retain their
  existing tone. The lower edge is still about two canonical pixels high in
  the examined M21 scans; examine the whole plate geometry separately from tone.
- Full core-set coverage now measures 952/953 ordinary-treatment printings,
  including basics and planeswalkers; M19 #218's unsupported transform remains
  in the denominator. Repair its cached exclusion policy separately from the
  frozen captures. All per-card results are in `set-symbol-all-*-measurement.json`.
- M20 has fifteen ordinary nonbasic inspect edge regressions, all commons;
  eight are black. Review Feral Abomination #101, Mind Rot #108 and Maniacal
  Rage #149 before assuming the selected material/rarity cohort covered every
  placement variant. Keep raw scores and diagnostic offsets separate.
- The top type outline now extends 1px inward. The rules box expands upward
  1px with byte-identical lower geometry and unchanged text. Visual review
  accepted both. Rules-top scores remain mixed (M21 inspect median .942 → .892,
  M20 .892 → .926); investigate border shape and shared scan alignment before
  another shift. See `normal-border-*-measurement.json`.
- M15 and WAR provide the first non-shield treatments. Extend black outlines,
  white components, negative space and gradients to other symbol families,
  retaining the pinned assets. Separate stencil holes from intentional white
  ink; do not assume every symbol has the core-set shield topology.

## M15 / WAR symbol follow-up

- M15 and WAR now have opaque interior ink, outlines and shaded rarity fields.
  M15 uses a shared 8% reduction, 2px right / 1px up placement; normal WAR uses
  a shared 15% reduction and 1px lift. WAR commons have a stronger white rim.
  All 50 originally reserved normal cards improve edge overlap at both tiers
  after the first topology pass. The subsequent rim/lift pass improves the
  median on 20 newly reserved cards but retains three black-card regressions.
- Independent frame landmarks support upward scan translations of 1.46px for
  Charity Extractor and 1.03px for Dreadhorde Invasion. Their horizontal axes
  remain uncertain. Bolas's Citadel still needs crowned-frame registration.
  Renderer component positions remain shared; retain the earlier raw reports.
- Add distinct foreground, outer-rim and interior-ink targets. A contextual
  crop can hide a weak white border behind a strong type-plate edge; evaluate
  common white rims separately from colored-rarity black outlines. Preserve
  both the narrow symbol score and surrounding-frame diagnostics.
- Retained M15 stencil `7e234ce3ffbc59c06283c92eeb6f8f93bbd69b2a23ac1bea631ce5c5d147b057`
  still needs close letter/serif contour review. WAR stencil
  `00c515430c162efe2d396a1d359333af538c5ada94c4de8b15fb50d8d6c6f1b9` retains
  differences around its horn bases and central cutout. Keep those potential
  asset changes separate from corrected opacity and geometry. Exact gradient
  colors remain part of the pending set/material color study.
- Every-card M15/WAR symbol coverage is complete: 558 supported printings,
  with unchanged pixels outside symbols at both tiers. Keep WAR #260/#34 edge
  regressions, #98 contrast regression and #217 table Census regression visible.
  Extend treatments to further symbol families; existing set-specific backing
  contours must not be used indiscriminately for other SVGs or custom artwork.
- Repair study annotation inheritance before new typography captures: the full
  symbol study did not inherit M15's six reviewed original planeswalker type
  lines. Symbol comparisons remain controlled; printing typography is uncertified.
- Normal modern title size is now 26px; all 60 measured WAR/M15 titles improve
  at both tiers. Validate the remaining frame eras before claiming transfer.
- Translation-only scan normalization now measures 485 nonlegendary ordinary
  WAR/M15 scans against frozen frame templates, retaining raw scores and
  uncertain axes. Add crowned/special/old-border templates next. Curved frame
  ends and lower rules edges need independent validation; do not align on text.
- Keep the dense-body policy experimental: 1% headroom, tighter paragraph gaps
  and a slight upward preference help Citadel but regress on seven of 23
  additional dense cards. Review those failures and isolate margin/fitter
  effects before shipping a text-length rule. The local overlay has raw/aligned,
  red/green and before/current/trial controls for this inspection.
- Window pass v55: shared modern art aperture, visible inner rim, narrower type
  lettering deficit and excessive corner radius corrected across five measured
  sets. Rules-panel narrowing transfers to WAR/M15/M19/M20, but M21 rejects it.
  Check Ikoria, Zendikar Rising and later releases before inferring an era boundary.
- Retain border-strip regressions: split-color lands (Cinder Barrens, Caves of
  Koilos, Bloodfell Caves) were missing adapter frame palettes. Corrected in v56;
  remeasure their bevels with the corrected inputs before calling this an asset defect;
  WAR Ashiok's Skulker/Krenko/Roalesk and M20 Gargos/Risen Reef need edge review.
  M20 Skyknight Vanguard has a small type-width regression; long fitted types
  now keep their old font height. All per-card scores remain in window reports.
- Old-border overlap audit: 61 Revised/Mirage/Tempest cards. Resolve unreviewed
  historical type inputs before interpreting type scores (e.g. Interrupt vs
  Instant). Review Zombie Mob's wrapping, Steal Enchantment's flavor layout and
  Selenia's body size/line breaks. Existing set-level scan transforms help some
  edges and worsen others; validate independent anchors before replacing them.
- Release-era check: 267 references across twelve sets, including IKO, ZNR,
  MID, DMU, WOE, FDN and the limited TDM sample. No universal M21 cutoff:
  window proportions vary even after accepted shared scale corrections.
  WOE/FDN need roughly +0.4% reference scale; retain distinct set/frame groups
  until broader cohorts support merging them. Do not add date-based geometry
  switches from these samples.
- Review scale failures for WAR, M20 and DMU. Outer width and vertical span
  disagree with a uniform zoom against the frozen template. Investigate
  independent vertical outer-frame anchors, reference aspect/crop and asset
  geometry; do not resolve the conflict with arbitrary per-scan warps.
  TDM needs more high-resolution references before calibration.
- Recent-set transfer: all 72 additional IKO/ZNR/MID/DMU/WOE/FDN art borders
  improve at both raster tiers. Remaining WOE/FDN rules-panel widths and
  body baselines need review after registration. Newer set symbols still use
  generic treatments: the FDN reference shows a larger outlined, shaded star
  than the current flat symbol. Record topology/material fixes separately from
  aperture geometry. Do not certify text overlap until printing text is checked.

### Flavor separators and land input palettes (v56)

- Cached ordinary cohort: 262 cards across 11 modern sets; 175 rules/flavor
  separators, 168 intersecting text before, zero after. The separator now uses
  measured ink boundaries rather than a baseline estimate. Minimum clearance
  is 8.71 reference pixels. All text lines, sizes and wrapping are unchanged.
- Forty cards captured at inspect and table tiers. For unchanged inputs, pixel
  changes are confined to the old/new separator strips. This is a structural
  collision audit, not a scan-similarity or original-wording certification.
- Sixteen modern land inputs now pass one/two produced mana colors as
  `frameColors`, retaining colorless semantic `colors`. Explicit reviewed
  palettes win, including an empty palette. Basic, artifact, retro, rainbow
  and fetch-land inference remain excluded pending printing review.
- Evidence: `fixtures/accuracy/flavor-land-plan.json` and
  `flavor-land-measurement.json`; repeat comparisons with
  `node games/magic/tools/accuracy/flavor-land-study.mjs compare`. Comparisons
  read saved layouts/PNGs without Chromium. The local review page shows scans,
  before/after renders and optional normalized red/green overlays.

### Shared text-alignment review browser (after the set passes)

User priority: finish the old/new set passes before building this service. Keep
its application, deployment and database outside this library repository.

- Queue the worst **text alignment** results, separating different wording,
  unavailable references and renderer overflow from actual placement errors.
  Use region scores and collision flags, not a whole-card color error ranking.
- Show the printing scan, original reconstruction and optional Oracle version,
  with frame-normalized red/green overlays. Keep raw scan view available.
- Provide small reversible adjustments for left/right/top/bottom margins, text
  width or horizontal scale, font size, line spacing, paragraph gap and gap
  before flavor text. Expose these as separate controls so a width error cannot
  silently become a size change. Include reset, keyboard nudges and before/after.
- Save append-only review observations: printing ID, set/frame/material,
  reference and art hashes, renderer/config version, original/Oracle source
  identity, frozen frame transform, starting settings, proposed deltas,
  resulting line geometry/scores, reviewer and confidence. Preserve disagreements
  and stale reviews when data or rendering changes. Do not overwrite scans.
- Treat per-card slider values as observations for shared calibration. Fit robust
  frame/set/material policies using a calibration partition, then validate on
  held-out cards and other sets with the same frame. Do not ship individual
  per-scan/per-card layout adjustments or refit scan alignment to the text.
- Start with a small local database and the existing local review browser; choose
  shared hosting, authentication and reviewer access when deployment work begins.
  Accepted policies should export as versioned pack configuration plus measured
  evidence and a reviewed commit, not become live unreviewed renderer defaults.

### Gold paper bevel and printed credit (v57, shadow correction v59)

- The historical survey has 25 scans across 13 sets. The checked Ice Age,
  Alliances, Mirage, Visions, Tempest, Stronghold, Invasion, Planeshift,
  Apocalypse, Odyssey, Scourge and Time Spiral timeshifted examples share
  light left/bottom and dark top/right paper bevels. Legends has a separate
  paper treatment. No date transition was found in this sample.
- The existing seventh-family `m.png` has reversed lighting. Lighten the left
  and bottom facets with multiplicative brightness and darken the top and right
  facets in place during face preparation. A white overlay retains a faint
  shadow but washes out its strength. Keep the baked shadow contrast and coordinates;
  rotating the rim moves those shadows. Center texture, keyline and geometry
  are unchanged. No new asset, decode or readback enters the render loop.
- Audit: 45 Mirage/Tempest gold cards and 10 monocolor controls. Forty-four
  gold frames changed; all changes stay within the bevel or separately reviewed
  credit. Controls are pixel-identical at inspect and table sizes. All 176
  inspected gold edges previously had reversed contrast; all 176 now match the
  scan direction. Highlight strength and texture remain on the HSB/asset list.
  Table edges also match, but their tiny rasterized keyline makes polarity a
  diagnostic rather than an acceptance criterion. Synthetic asymmetric shadow
  checks cover both tiers and two decoded asset sizes. The saved-render left
  shadow profile retains 99.4% of relative contrast at inspect size and 97.8% at
  table size across all 44 corrected gold cards. The metric rejects both moved
  shadows and a white overlay that erases their contrast.
- Wellspring is retained as an input/adapter review item: its original
  `Enchant Land` label selects a land frame in the historical asset heuristic.
  Exclude it from bevel certification, not the coverage denominator. Preserve
  semantic card kind when restoring original type wording in that adapter.
- Selenia's reviewed printed artist credit is `Matthew Wilson`. Both cached
  Scryfall and MTGJSON return `Matthew D. Wilson`; a scan-hash-bound artist
  annotation now preserves the printing without changing artist identity.
- Evidence: `fixtures/accuracy/retro-bevel-{history,plan,measurement}.json`.
  The local gallery includes Selenia and Asmira before/after plus the history
  sheet. Bevel metrics use signed local contrast and distinguish missing or
  uncertain keylines; they do not fit scan transforms to individual components.

### Flavor-divider era and land paper review (v58–v59)

- The subtle ordinary-frame divider belongs to the 2018 template update,
  first seen in DDU, then DOM. Known earlier ordinary sets including M15, ORI,
  SOI, XLN, RIX and A25 suppress it even with Oracle wording. Retro layouts
  retain their separate policy; Portal's historical bar is a different treatment.
  Source: [Wizards' template announcement](https://magic.wizards.com/en/news/announcements/dominaria-frame-template-and-rules-changes-2018-03-21).
- The existing 262-card audit now retains 161 separators and removes fourteen
  incorrect M15 bars. Zero collisions remain, minimum clearance is still 8.71px,
  and text positions are unchanged. `flavor-land-measurement.json` contains the
  latest saved-capture comparison; its renderer hash identifies v58 independently
  of the unrelated v59 retro-bevel correction.
- BR/WB land paper is too pale in the existing frame assets. Six Bloodfell Caves
  and Caves of Koilos printings from M15/M20/M21/IKO/DMU/FDN show the same issue.
  Broad interior patches put rendered luminance near 229–237 versus scan
  medians of 158–183; side-to-side color distance is only 13–30% of the scan.
  These are raw-scan review diagnostics, not calibrated color coefficients.
- Keep the accepted land borders. During the new-frame HSB pass, adjust the
  rules-paper component separately and test matching-palette nonlands before
  changing the shared assets. Source URLs/hashes, reference/render hashes and
  patches are in `fixtures/accuracy/land-paper-review.json`; reproduce with
  `node games/magic/tools/accuracy/land-paper-study.mjs`. This asset/material
  issue was confirmed at v59; the shared-palette v62 correction below addresses
  its dominant brightness/gradient error without replacing those assets.

### Old-frame symbol treatment survey (v61)

- Frozen v59 baseline and v61 candidate cover 85 printings from seventeen sets
  at both raster tiers. Sixty-five cards receive historical black ink or the
  restored Chronicles glyph; twenty Exodus/no-symbol controls remain identical.
  Every changed pixel stays inside the fixed symbol region. This is an initial
  survey, not completed all-printing coverage or accepted symbol geometry.
- Before Exodus, rarity does not change symbol ink. Separate the black outer
  contours of ARN/ATQ/LEG/DRK from later light rims. Thirty-five additional
  black/green/artifact scans establish that distinction. Opaque white interior
  details are a separate pending topology pass, especially ARN/LEG/WTH.
  [Wizards' card anatomy guide](https://magic.wizards.com/en/news/feature/anatomy-magic-card-2006-10-21)
  documents the rarity boundary.
- Chronicles now resolves all 125 English printings (116 names) to ARN/ATQ/LEG/DRK
  by exact Oracle identity in the cached printing inventories. The painter uses
  that English name-to-origin map; explicit `setSymbol` still wins and unknown
  custom names have no guessed symbol. The five photographed examples validate
  the identity change, not every printing's shape. Portal Second Age's `p02`
  code now resolves to the existing `po2` asset.
- Keep 27 survey cards flagged, including all five Chronicles shape reviews.
  The raw-window edge/Census diagnostics can be influenced by neighboring text,
  wrong glyph dimensions and unregistered scans. Ink correctness alone is not
  a reason to dismiss their regressions or certify the overall symbol.
- Next: fit visible symbol dimensions on independent frame registration, then
  validate on darker-material and held-out cards. ARN/ALL/EXO are substantially
  undersized because transparent SVG padding shrinks wide glyphs; WTH and LEG
  also need sizing review. Retain the original stencils while testing cropped
  visible bounds. ICE's printed fine snowflake differs from the current glyph;
  inspect available pinned variants before flagging a replacement asset.
- Evidence: `old-symbol-treatment-{plan,measurement}.json`,
  `old-symbol-material-review.json`, `old-symbol-stencil-bounds.json` and
  `chronicles-symbol-identities.json` under `fixtures/accuracy/`. The audit reads
  cached PNG regions without Chromium. Full rendering is captured once per
  candidate; no image readback enters the runtime painter.

### BR/WB land rules-paper correction (v62)

- The original BR/WB frame images contain nearly white, opaque rules paper;
  a missing background layer is not the cause. Apply a multiplicative gradient
  only inside ordinary land rules boxes, preserving the source grain and inset
  shadows. Two palette-wide corrections serve every set; no per-card or per-scan
  parameters. Colored rails, name/type plates, art, typography, special layouts
  and nonland uses of these assets are unchanged.
- Freeze twelve inputs before changing the painter: the six reported printings,
  two different M19 lands reserved for validation, and four controls (WR land,
  colorless land, BR nonland and WB nonland). All eight corrected printings
  improve at both table and inspection sizes. Inspection mean patch RGB error
  falls from 114.5 to 11.7 on the six calibration printings, and 112.1 to 8.4 on
  Cinder Barrens/Forsaken Sanctuary. Every changed pixel intersects the paper
  interior; all four controls and all text layouts remain identical.
- This metric is mean Euclidean sRGB distance between broad median patches,
  not perceptual Delta E or overall rendering accuracy. Raw-scan color variation
  remains. Paper texture is still more mottled than the scans, and exact gradient
  transitions/per-set color calibration stay on the new-frame HSB review list.
  Other land color pairs are unchanged and still need that pass. The local
  comparison offers close-ups/full cards and the existing frozen frame
  registration; wording is not certified by this material study.
- Reproduce with `land-paper-correction.mjs before|after` and
  `land-paper-audit.mjs` under `tools/accuracy/`. The baseline command refuses to
  overwrite another renderer revision. Evidence is in
  `fixtures/accuracy/land-paper-{plan,measurement}.json`; original source assets
  and the pale-paper diagnostic remain in `land-paper-review.json`. Comparison
  uses cached PNGs without Chromium; runtime painting needs no pixel readback.

### Remaining dual-land palettes and neutral land material (v64)

- Extend the paper correction to all ten dual-color palettes. The eight new
  palettes share five color tints; the previously reviewed BR/WB values stay
  unchanged. Frame asset keys use sorted WUBRG names, while their visible halves
  follow the two-color wheel order: WG → GW, WR → RW, UG → GU. This agrees with
  [Wizards' explanation of two-color mana order](https://magic.wizards.com/en/news/making-magic/split-odds-ends-2006-04-17).
  Mana costs keep their supplied sequence; asset lookup does not sort costs.
- Detection Tower's blue paper and pale gray rails came from reusing the
  artifact frame image. For ordinary neutral lands, desaturate that image and
  use separate shared brightness factors for its rails and paper. Preserve
  source texture, alpha and shadow placement; surrounding land background,
  plates, art, typography and nonland artifact frames stay unchanged. This is
  composition-time filtering, with no extra decode or pixel readback.
- Freeze 32 printings: eleven calibration lands (eight M21 duals, M21 Animal
  Sanctuary, M15 Battlefield Forge and M19 Detection Tower), eleven reserved
  lands (eight FDN duals plus FDN Soulstone Sanctuary, M15 Radiant Fountain and
  M20 Cryptic Caves), and ten controls (four BR/WB lands and six nonlands).
  Every corrected card improves its broad paper-patch RGB error at both
  rendering sizes. Inspection mean error falls 75.08 → 7.21 on calibration
  cards and 66.09 → 11.85 on reserved cards. All ten controls and every text
  layout remain identical; no pixels change outside the permitted materials.
- Neutral-land rail patches also improve on all five printings, including
  Detection Tower (141.33 → 12.76). These narrow raw-scan patches are sensitive
  to registration and are only diagnostic; full-card visual review confirms
  the direction. Color metrics remain Euclidean sRGB patch distance, not
  Delta E, alignment accuracy or an overall card score. No scan-specific tint.
- Reproduce with `land-palette-correction.mjs prepare|before|after` and
  `land-palette-audit.mjs` in `tools/accuracy/`; plan and measurements are
  `fixtures/accuracy/land-palette-{plan,measurement}.json`. Preparation and
  baseline capture refuse to overwrite a frozen study with another revision.
  Cached PNG comparison does not require Chromium. Local review includes all
  32 examples with full-card, close-up and red/green overlay modes.
- Still flagged: source paper texture is too mottled, colored rail saturation
  differs from scans, and per-set tone/gradient transitions need the later HSB
  pass. Single-color, rainbow and special land treatments were not validated
  by this round. This targeted correction does not complete the set passes.

### Old-symbol white details and visible sizing (v66)

- The pinned ARN, LEG, ALL, WTH and EXO vectors encode printed white details as
  transparent holes. During asset preparation, derive a separate white bitmap
  from selected existing closed subpaths. Do not copy vector paths into the
  repository or invent replacement contours. Leave ARN hilt openings, the ALL
  pole gap and the EXO arch transparent. Validate the pinned path structure;
  preserve the original bitmap and release the extra bitmap with its owner.
  Explicit custom symbols retain their original rendering. No new fetches,
  runtime pixel readback or animation-frame preparation.
- Fit visible ink bounds, removing transparent viewport padding, for ARN, LEG,
  ALL and WTH. One geometry per set, shared by all colors and rarities; no
  card-specific placement. The bounded coordinate search uses cached stencils
  plus the new white details and symbol-only regions. Both edge polarities,
  edge distance and Census scores remain available. Candidate bounds must fit
  the region, and boundary peaks stay flagged. CPU candidate comparisons need
  no Chromium; final decisions use actual renderer captures at both sizes.
- Sixty frozen examples: five calibration and three reserved dark/green/artifact
  cards for each of five sets, five Chronicles transfers, ten ATQ/DRK controls,
  and five explicit-symbol controls. All 32 cards receiving geometry changes
  improve edge overlap at both tiers, with no edge/Census regression flags.
  Fifteen controls are pixel-identical. Forty-four cards receive some material
  or geometry correction; all pixels outside the symbol/type allowance remain
  identical. Only Aesthir Glider needs narrower type compression: its supplied
  Oracle type is 337.17 px wide, while the new symbol leaves 311.59 px instead
  of 335.18 px. Its original scan says only “Artifact Creature”; original-wording
  typography is not certified by this study.

| Set            | Calibration median edge F1 | Reserved median edge F1 | Reserved table-size F1 |
| -------------- | -------------------------- | ----------------------- | ---------------------- |
| Arabian Nights | .388 → .668                | .264 → .514             | .260 → .548            |
| Legends        | .475 → .834                | .480 → .727             | .444 → .649            |
| Alliances      | .377 → .760                | .282 → .549             | .252 → .522            |
| Weatherlight   | .471 → .768                | .392 → .788             | .393 → .687            |

- These are symbol-region grayscale scores, not total card accuracy. Frame-only
  shared registration passes for LEG/ALL/EXO; ARN's scale fit is rejected and
  WTH's proposed registration worsens independent frame strips. Both keep raw
  coordinates and an explicit registration flag. Raw metrics are retained for
  every example. Do not use these samples to certify every printing in a set.
- Reject EXO's size candidate: it hits the height boundary while the painter
  still lacks the printed outer white rim and metallic treatment. Its white
  interior details are restored, but sizing remains unchanged pending that
  material pass. Chronicles gets appropriate inherited white details while
  retaining its own unresolved printing geometry. The previous ATQ candidate
  is also rejected: a broad window rewarded moving its anvil into a frame edge.
  ATQ remains an unchanged control in this round.
- Still flagged: source ARN blade/hilt contours differ from print; the old black
  type-panel texture is much darker than scans and hides black outlines;
  WTH/ALL fine contours and rim weight need further review. ICE's alternate
  pinned stencil is still pending comparison. Complete old-set symbol coverage,
  then frame alignment, then HSB; the major-set scope is unchanged.
- Reproduce material and geometry captures with `old-symbol-material.mjs`, then
  run `old-symbol-material-audit.mjs`, `old-symbol-clearance.mjs` and
  `old-symbol-geometry-audit.mjs`. Registration, blank backgrounds/stencils and
  bounded search are `old-symbol-registration.mjs`, `old-symbol-templates.mjs`
  and `old-symbol-search.mjs`. Evidence is in `old-symbol-material-*.json`,
  `old-symbol-type-clearance.json` and `old-symbol-geometry-measurement.json`.
  The material-only capture is an intermediate candidate; the final renderer
  is the `geometry` capture. The local comparison exposes full cards, symbol
  close-ups and the red/green overlay, with unresolved cases labeled.

### Visual follow-up: Legends height and Arabian Nights gray blade (v67)

- Move the shared Legends symbol up one canonical pixel (center Y 395 → 394),
  following visual review. Tint only the Arabian Nights blade backing to 70%
  brightness, a neutral gray, retaining the original outline and open hilt.
  Chronicles keeps its existing white detail material. Explicit symbols are
  unchanged. The existing mask and geometry are reused; no extra decoding or
  readback is needed.
- Recapture the same sixty cards at both tiers. Sixteen change; the other 44 are
  pixel-identical. Every pixel outside the symbol windows and every text layout
  stays identical. These examples have already been reviewed, so their original
  calibration/held-out labels do not constitute a fresh validation cohort.
- ARN median inspection edge F1 improves .668 → .671 on the original calibration
  sample and .514 → .529 on the original reserved sample. Its blade-tone
  diagnostic improves, but remains sensitive to the unresolved registration and
  source contour mismatch. The gray is a shared visual correction, not a finished
  per-set HSB calibration. Small renders have no fully opaque blade interior;
  tone diagnostics use inspection captures only.
- LEG scores are mixed: inspection medians .834 → .803 (original calibration)
  and .727 → .734 (original reserved). At table size they change .800 → .755
  and .649 → .698. Keep the requested visual adjustment and retain regressions
  for Alabaster Potion, Fortified Area, Akron Legionnaire and Arboria. Do not
  describe the shift as an across-the-board metric improvement or refit scan
  registration to hide these differences.
- Reproduce with `old-symbol-material.mjs review` and
  `old-symbol-review-audit.mjs`; the v66 `geometry` capture is the immediate
  baseline. Evidence is `fixtures/accuracy/old-symbol-review-measurement.json`.
  The local review shows the previous version beside the new one and keeps
  accepted frame alignment, full-card views and red/green overlays available.
- The Exodus full-set baseline was captured before these changes: 143 ordinary
  printings plus seven controls. Its plan and capture tool are frozen in
  `exo-symbol-plan.json` and `exo-symbol-study.mjs`. ARN/LEG controls in that
  baseline intentionally predate this separate correction; future Exodus-only
  audits must account for that provenance, rather than attribute their changes
  to Exodus. Its symbol material and geometry pass remains pending.

### Legends frame confounds the one-pixel symbol decision

- User review correctly identified that the frames differ. The eight sampled
  single-color/artifact Legends cards use `seventh/regular` frame assets;
  multicolor Legends follows a separate asset path and is not covered here.
  The prior accepted fit used internal art/rules borders, with 1.69 px residual.
  It improved frame-edge overlap but cannot independently establish scan
  registration closely enough to certify a one-pixel symbol adjustment.
- Add a cached-PNG diagnostic with broad signed-gradient strips, retained
  profiles/competing peaks, and explicit weak-boundary results. Compare inner
  dimensions as fractions of the outer colored-frame span. Those proportions
  distinguish internal geometry from uniform scale/translation without fitting
  any individual scan. They do not establish absolute print scale, and different
  bevel styles still affect the measured transition locations.
- On the five original white/blue calibration cards, the median colored-frame
  span is approximately 449.5 × 639.1 px in scans versus 439.5 × 626.7 px in our
  rendering. Even after accounting for that size difference, our art bounds are
  about 1.9 px narrower and 2.5 px shorter, while the type band is 2.1 px taller.
  The previously reviewed green/artifact examples support that direction; the
  black card has weak boundaries and remains flagged. This is an eight-card
  diagnostic, not a Legends-wide geometry certification.
- Keep the current symbol placement provisional; do not fit another offset to
  compensate for these frame differences. During the old-frame alignment pass,
  separate outer-frame geometry, art keylines, paper transitions and bevel
  thickness, then repeat symbol placement checks. Existing source textures and
  bevel treatments also differ and remain on the asset improvement list.
- Reproduce with `tools/accuracy/legends-frame-audit.mjs`; evidence is
  `fixtures/accuracy/legends-frame-diagnostic.json`. The local full-card review
  offers raw scans, an explicitly provisional shared internal-frame fit,
  red/green overlays and measured boundary guides. Symbol review pages now label
  that alignment's limitation rather than imply independent scan normalization.
  Runtime rendering is unchanged by this diagnostic.
- Correct the local review pages' overlay filter references and blend mode.
  The newer pages copied `redInk`/`greenInk` definitions but referenced different
  IDs and used screen blending. They now use the defined ink filters with
  multiply blending, verified visually; shared dark ink stays dark while
  mismatches separate into red/green. This browser-only fix stays outside the
  repository, as requested.

### Exodus symbol material and full-set size validation (v69)

- Restore the printed white outer rim on every ordinary Exodus rarity. Reuse
  the pinned bridge stencil and existing opaque window backing; leave the arch
  open. The common bridge has dark ink, while uncommon/rare use shared silver
  and gold gradients with pale centers. Explicit custom symbols retain their
  previous paint path. This uses the existing composition canvas, with no new
  network assets, pixel readback or animation-frame preparation.
- The padded source viewport made the bridge much too small. Fit the visible
  bounds after including the rim/material: 55 × 19 px, right edge 430 and center
  Y 389, with a 1.25 px rim. The cached-stencil search uses only the five frozen
  calibration cards and production palettes, with 56 bounded candidates and
  half-pixel final bumps. Its selected solution does not hit a search boundary.
  Actual production captures confirm the candidate before full-set validation.
- Validate all 143 ordinary printings: 55 common, 44 uncommon and 44 rare, plus
  seven controls, at inspection and table sizes. All 143 improve grayscale
  symbol-edge F1 by more than .02 at both sizes, under both raw scan coordinates
  and the frozen shared fit. The five-card inspection median changes .316 →
  .745; the other 138 cards change .240 → .686. That larger check includes some
  previously reviewed examples and is not an entirely unseen cohort.

| Scope                | Raw inspection F1 | Shared-fit inspection F1 | Shared-fit table F1 |
| -------------------- | ----------------- | ------------------------ | ------------------- |
| All 143 Exodus cards | .262 → .586       | .253 → .687              | .240 → .744         |
| Common (55)          | .268 → .624       | .294 → .760              | .254 → .767         |
| Uncommon (44)        | .257 → .573       | .223 → .662              | .211 → .721         |
| Rare (44)            | .249 → .582       | .261 → .693              | .243 → .799         |

- These are symbol-region shape scores, not whole-card accuracy percentages.
  The shared fit uses internal frame borders and remains provisional pending
  the frame pass. No individual scan or card placement is fitted. Gradient
  colors are a shared printing treatment; they do not complete HSB calibration.
- All seven controls are byte-identical. The frozen v66 baseline predates the
  separately committed ARN/LEG refinements, so those two controls use their v67
  captures; the other five use v66. This provenance is recorded explicitly.
  Every pixel outside the symbol/type allowance stays identical.
- Three supplied Oracle types require narrower fitting to clear the enlarged
  symbol: Ertai, Wizard Adept; Thalakos Scout; and Mirri, Cat Warrior. Their
  maximum type width changes 335.18 → 316.59 px. Font measurements determine
  the allowed type envelope; those rows are flagged because the wording and
  compression can affect the symbol score window. The other 140 cards improve
  without type changes. Original printing typography is not certified here.
- Keep Aether Tide's inspection Census regression (.467 → .432), despite its
  improved edge overlap, visible for review. The weakest remaining matches also
  include Keeper of the Mind, Fade Away, Rootwater Mystic and Pit Spawn.
  Inspection shows frame/symbol offsets in the blue examples; do not compensate
  with individual-card symbol adjustments. Fine tower/foot contours, arch shape,
  rim weight and metallic colors remain candidates for the frame/HSB/asset pass.
- Reproduce captures with `exo-symbol-study.mjs material|candidate|after`, the
  CPU search with `exo-symbol-search.mjs`, and comparisons with
  `exo-symbol-audit.mjs candidate|after`. The immutable input plan and candidate
  are `exo-symbol-plan.json` and `exo-symbol-candidate.json`; both production
  stages have `exo-symbol-*-measurement.json` evidence. The audit verifies source
  identity, controls, both tiers, all non-symbol pixels and type clearance.
  The local page provides 21 examples, including the weakest matches and all
  three type exceptions, plus metrics for all 143 cards and red/green overlays.

### Ice Age baseline and existing snowflake variants

- Cache and freeze all 383 ordinary printings before the symbol correction,
  plus six controls. Eleven calibration cards span every mono-color, gold,
  artifact and land; the remaining printings are reserved for validation.
  The baseline keeps rules-overflow failures explicit instead of removing
  those cards from the coverage denominator. See `ice-symbol-baseline.json`.
- Rasterize the existing pinned `ice.svg` and `ice2.svg` once, then compare
  cached stencils without Chromium. The alternative has finer contours.
  White plate and central-star candidates reuse closed source subpaths.
  Search records 0, 0.5 and 1 px rim variants and bounded shared geometry;
  no per-scan transform or placement is fitted. Several candidates hit bounds,
  and the best shape scores do not clearly distinguish the alternatives.
- These are exploratory calibration results, **not adopted geometry or a
  completed Ice Age pass**. Production candidate captures and full-set
  validation remain necessary. Exodus rim review takes priority before
  continuing this study. Reproduce the frozen captures with
  `ice-symbol-study.mjs before`, template rasterization with
  `ice-symbol-templates.mjs`, and CPU candidates with `ice-symbol-search.mjs`.
