# Rendering accuracy review queue

Use the [set-completion checklist](calibration-completion.md) and
[per-variant progress ledger](fixtures/accuracy/calibration-progress.json) to
close work. They distinguish accepted fits, validated defaults, rejected
proposals and stale evidence. `npm run magic:calibration:report` summarizes
the active sets; append a set code for its unresolved checks.

This is a working queue from the measured M21, M20, Mirage, Tempest, Fourth/Fifth Edition and Revised sets, not
an assertion that every supported frame has been evaluated. Special treatments
remain outside the current study. Use pinned frame sources and compare replacements
before adopting them. The local all-card reports contain asset URLs,
example UUIDs, alignment flags and scores for each affected group.

## Next grouped calibration batch

Keep **Fallen Empires, Fourth Edition and Chronicles** together in one release:
690 ordinary printings, with frame, color, mana, expansion-symbol and typography
work reviewed together. The released renderer remains 0.5.1 during preparation.

The integration branch includes 27 shared frame geometries and 30 source-bound
material profiles. Basic-land plates and the gold/dark/generic land treatments
retain their printing identity when switching between original and Oracle text.
Frame and paper colors use separate masks; rejected component fits keep their
source pigment. Outer stock is cut independently of the frame texture.

Filled title/type typography and the shared artist, copyright and stats profiles
are integrated with exact native replay evidence. The footer pass also adds 61
printed artist corrections and Chronicles Sentinel's original `1/*`. Regional
regressions and rejected scan poses remain visible in the
[completion notes](calibration-completion.md). Body/flavor typography and the final
symbol review remain separate gates.
A trial that sampled median title-core brightness was rejected: scan blur and
shadow contamination made its gray too dark, especially on light frames. Keep
solid letter fills and compare stroke mass as well as edges. Neither a regional
score increase nor a successful implementation replay establishes a completed set.

## 0.5.1 calibration batch

Alpha filled body ink and darker headings, The Dark type lines, and The Dark
regular/compact body geometry are bundled together. See the
[release notes](../../docs/releases/0.5.1.md) and
[body evidence](fixtures/accuracy/dark-body.json). These are partial calibration
improvements, not completed-set approval.

The Dark body fit preserves the nominal size classes and large centered policy.
All 121 scorable native renders match the fitted prototypes; 278 unrelated cards
retain their pixels. The 87 repeated-validation full-card scores improve from
0.7794 to 0.8135, with seven regressions retained. Giant Shark, Runesword and
People of the Woods have the largest remaining body-overlap regressions. Review
wrapping, vertical placement, inline flavor attribution and font shape before
adding any exceptions. Ball Lightning remains unscored because normalization
was rejected. Gaea's Touch 77† remains a printing-shift diagnostic.

Goblin Wizard, Ghost Ship and Electric Eel have reviewed original-only activation
punctuation corrections. Compare identical corrected wording when measuring
layout changes; preserve the previous measurements as historical evidence.
The broad report frame strips overlap some body text. A future metric revision
should separate those supports; current native isolation proves the frame pixels
are unchanged even when that diagnostic moves.

## Early expansions after 0.4.1

The next calibration group is **Arabian Nights, Antiquities and The Dark**,
with the released Legends pass retained as a regression control. Fallen Empires,
Fourth Edition and Chronicles follow. This resumes the pre-Eighth sequence;
the incomplete Unlimited interior templates remain open rather than being
counted as finished.

The [baseline and normalization receipt](fixtures/accuracy/early-expansion-calibration.json)
records all 316 ordinary English nonfoil printings against 0.4.1. Every printing
renders; cached scans and art were reused. Frozen scan-only templates accept
309 outer-frame poses and 282 interior poses:

| Set            | Printings | Outer frame | Interior |
| -------------- | --------: | ----------: | -------: |
| Arabian Nights |        92 |          92 |       91 |
| Antiquities    |       102 |         102 |       94 |
| The Dark       |       122 |         115 |       97 |

These are normalization coverage counts, not renderer accuracy scores. Fitting,
model selection and certification use disjoint frame strips, followed by actual
warped-raster replay. All outer measurements and accepted interior rasters pass
content-isolation checks. Thirty known translation/scale/rotation/skew cases,
including saturation and brightness perturbations, recover frame positions to
within 0.062 canonical pixels. Those synthetic cases use one white calibration
card per set and do not certify the unsupported materials.

The remaining 34 interior cases are Antiquities and The Dark red materials,
The Dark's sparse land/multicolor groups, and Arabian Nights Bird Maiden 37.
Check frame-boundary anchors for these groups before fitting component offsets;
texture-template failure alone does not establish that a scan is bad. Keep all
34 in the coverage report. Seven rules bodies and every type line still need
printing-wording verification before they can contribute certified text scores.

Eighteen shared source/geometry profiles are now integrated on the calibration
branch. Black and green use ABU; white, blue and artifacts use Fourth. Arabian
Nights red and nonbasic lands use Fourth; Antiquities lands use ABU. Artwork
placement follows the measured source aperture with a one-source-pixel underlap,
and stock is recut independently. Arabian Nights Mountain is excluded from the
generic land fit and keeps its separate colored basic-land source.

The native painter renders all 316 cards: 282 changed, and the 34 unsupported
materials are pixel-identical to 0.4.1. All 92 calibration and 189 reserved
printings improve the fixed-support boundary diagnostic. Source candidates now
use identical pixels, plus a separate texture comparison. Reference profile
medians still suppress content statistically; these are not whole-card accuracy
scores. The private gallery has 36 examples with blend, difference and red/green
overlays. Color calibration is partially integrated below; symbols and typography
are unfinished. These renderer changes are prepared for 0.4.2; live scoring
templates remain separate and are not deployed by the renderer release.

The red texture-smoothing proposal is rejected. It appeared to accept 22 more
scans, but recovered only 9/20 known poses within the existing 0.3-pixel limit;
the full outer/interior pipeline passed only 2/20. Its largest residual was
1.84 pixels. None of those proposed poses is adopted. Keep the original 282
accepted interior poses and try independent boundary anchors next.

The [native color receipt](fixtures/accuracy/early-expansion-colors.json) adds
11 outer-frame and 15 text-box fits across the 18 source/geometry groups. A bounded
value exponent separates brightness from texture contrast. It runs only during
cached material preparation; existing profiles retain the exact HSV formula.
Every fit uses calibration names, with unchanged gates on the reserved cohort.
That cohort has been reused for model selection and is not a fresh test set.

All 316 cards are replayed through the painter. Their central artwork pixels stay
exact, and the 34 unsupported full rasters stay unchanged. The original model
missed resizing effects in three frame groups; a calibration-only native-response
refit resolves two. Arabian Nights' land frame still fails the shadow gate and
keeps raw pigment. Its paper fit passes. The other rejected frame fits are
Arabian Nights green, Antiquities blue/black/green/artifact, and The Dark artifact;
rejected paper fits are Arabian Nights white, Antiquities land, and The Dark green.
Keep all ten components visible in the review queue.

The adopted profiles use separate RGB 24/21/16 outer stock, measured from cached
scan margins. These processed display-reference values are not physical ink
measurements. Old source ink curves cannot attach to the replacement geometry;
interior black-level work remains open. All 276 unrelated calibration-selector
probes and all 288 tested mana targets are unchanged, including Alpha/Beta's
separate stock and interior policies. The gallery shows aligned scans, 0.4.1,
raw replacement frames and calibrated candidates with the same overlay modes.

The [full-card diagnostic receipt](fixtures/accuracy/early-expansion-full-scores.json)
scores the 282 accepted interior poses with fixed application regions. The
structural index improves from about 42.5 to 62.8 out of 100; 281 improve and the
unchanged Arabian Nights Mountain retains its score. None regress.
Arabian Nights improves 41.3 → 63.7, Antiquities 45.5 → 61.9, and The Dark
40.8 → 62.9. Unverified type lines and fallback rules do not enter the weighted
index. Their diagnostics and all 34 unresolved normalizations stay visible.
These are reused development references and incomplete component coverage,
not full-set compliance. No renderer parameters were selected from these scores.

Next: resolve the remaining frame/color cases, fit headings and symbols, verify
original wording, then fit rules, power/toughness and illustrator text. Preserve
reused-validation labels and update the full-card receipt after each batch.

### Dark short-text follow-up (0.4.8)

Shared short-text bounds and centering now handle Bog Imp, Bog Rats, Fountain of
Youth and Sunken City. The regional index improves on all 17 affected accepted
references; 80 other accepted Dark references stay unchanged. See the
[follow-up receipt](fixtures/accuracy/early-expansion-dark-short-text.json).
Five additional original bodies have scan-reviewed punctuation/attributions.

Next typography work: compare a shared ink-weight adjustment, review historical
activation symbol scale/circles, Electric Eel/Fire Drake activation punctuation
and Fissure quotation style, then investigate
regular-size wrapping on Drowned and Gaea's Touch and the first rule line on
Brothers of Fire. Preserve the frozen scan poses
and corrected-source baselines. Do not promote rejected poses or use overlapping
frame/text score bands to infer a geometry improvement.

## Modern land calibration coverage

M21-era component-built lands, including legendary lands, do not have source-bound
printing-color profiles. `printingColorSource` explicitly excludes them because
their paper tint is composed separately. Shared land-paper corrections are a
rendering default, not a measured M21 printing-color fit. The general M21 land
scan template does not independently certify the legendary crown treatment.

Add measured profiles for the assembled land background, rails, text-box tint,
and legendary crown. Cover colorless, single-color and paired-color lands;
validate any transfer between sets instead of inheriting creature coefficients.
Keep this gap visible in coverage reports. M21 calibration is partial. The M21
set itself has no legendary lands; validate that family using other sets.

The [showcased-set coverage audit](fixtures/accuracy/showcased-coverage-audit.json)
checks the current runtime against the frozen ordinary inventories. These counts
mean **some frame/paper pigment coverage**, not complete frame calibration:

This historical color-study inventory is narrower than the new ledger: M21
omits 14 planeswalker printings (nine nonfoil, five foil-only). Eighth has another
350 ordinary black-bordered foil-only printings in addition to the 357 nonfoil
eligible printings below. They remain visible in the new reference queue.

| Set            | Some pigment coverage | Ordinary inventory |
| -------------- | --------------------: | -----------------: |
| Alpha          |                   276 |                295 |
| Beta           |                   231 |                302 |
| Revised        |                   306 |                306 |
| Eighth Edition |                   201 |                357 |
| M21            |                   147 |                283 |

Additional gaps: Alpha/Beta lands and Beta green; Eighth black/red/artifacts and
nonbasic lands; M21 white/black/multicolor and all component-built lands. Several
admitted profiles correct paper while retaining identity outer-frame pigment:
Alpha red/blue, Beta black/blue, Revised black/artifact, Eighth white/blue/green,
and M21 green/artifact. Beta red retains identity paper instead. Ink-floor and
stock adjustments remain separate and can exist despite these pigment gaps.

Update: the [normal-black receipt](fixtures/accuracy/m21-normal-color-adoption.json)
now covers 39 accepted M21 black references with a shared curve (median regional
color error 2.14 → 1.43). Forty ordinary nonlegendary black cards change; 252 other
nonfoil cards, central art/paper pixels and all mana/stock targets are preserved.
Liliana's Scorn still needs independent scan registration. Legendary crowns and
colored artifacts do not inherit this fit. The earlier table remains a historical
snapshot; use the completion ledger for current measured coverage. The new
scan-only white/black templates accept 81/82 cards and are not yet deployed in
the review service. Other M21 pigment profiles need the corrected clear-rail
sampling audit before completion.

Mana-disc color targets are also partial: Eighth lacks white/black/red/green
targets; M21 lacks black/generic targets. Do not infer missing placement fits
from missing color targets, or completed color calibration from scan alignment.
Expose per-component absent/partial/accepted/failed status with evidence revision
and excluded layouts before presenting any set as fully calibrated.

## Legends normalization and text validation

The [stock calibration](fixtures/accuracy/legends-stock-calibration.json)
removes the tinted outer band on white/black Legends frames using one shared
stock aperture. The matching ABU interiors retain their geometry and pigment
fits. Fourth was tested and rejected after geometry/color validation. All 75
reserved white/black scans improve their stock-edge correlation; this is a
regional diagnostic, not a whole-card accuracy percentage.

The green vertical border seam is reproduced from a supplied Barbary Apes
Chrome export and fresh installed Chrome/WebKit renders. Bundled Chromium hid
it. The plate and stock mask's fractional outer edges are antialiased separately,
leaving white exposed. The fix on `codex/retro-stock-seams` paints stock across the
plate's outer edge before applying the unchanged mask. It preserves the inner
aperture and passes both-tier native replays plus a cross-browser regression.
This composition fix shipped in 0.4.1, alongside the black-point calibration.

Legends stock now uses the shared display-reference target RGB 38/38/38 when
`set-hsb-v1` is enabled, guarded by the reviewed source/geometry. This matches
34 calibration and 36 validation scans. Their flat margins appear processed;
these values are not physical ink measurements. An independent frame-only
shadow-lift fit selected zero in every material. Keep interior shadows unchanged;
most sources have too few near-black interior pixels to estimate an ink floor.
Alpha/Beta, other sets and manual border overrides retain their existing policies.
The [Planar Chaos colorshifted ink study](fixtures/accuracy/planar-blackpoint.json)
now fits source-specific shadow curves across all five colors, independently of
the shared RGB 24/21/16 stock target. Native-raster fitting avoids thin-line
sampling bias. All 29 validation printings improve inner-ink RGB error, averaging
17.74 to 7.96 bytes; this is not a whole-card score. In that initial study, every brighter source pixel
(maximum channel at least 96), alpha value and transparent pixel is unchanged.
Prodigal Pyromancer improves only marginally and remains a visual review case;
Vampiric Link remains excluded by its existing rejected registration. Other
frame families and separate P/T badge materials are outside this ink fit.

The [colorshifted outer-edge follow-up](fixtures/accuracy/planar-stock-edges.json)
corrects a shared narrow-frame error and makes the stock mask follow the plate's
geometry. Only the outer texture bands expand; the central 428 × 607 pixels
remain byte-identical on all 44 native renders. Boundary error improves from
1.69 to 0.12 pixels on all 25 held-out cards with identifiable edges. Most black
edges are too low-contrast for that estimator, and the green top edge is obscured
by its title bevel; these are excluded from the numeric claim.
The existing interior ink improvements survive this replay. Other frame families
retain their geometry; both Chromium and WebKit pass a synthetic mask regression
at table and inspect resolution. This correction is not yet released/deployed.

The [texture/bevel follow-up](fixtures/accuracy/planar-frame-texture.json)
retains that geometry and the existing ink lifts across all five colors.
Native pinline selections expand outward seven canonical pixels, clipped by the
native frame selection, to soften the baked ridges. Separate tone curves fit
clean texture distributions with bevels excluded. Source masks are pinned to the
same [Conjurer revision](https://github.com/joshbirnholz/cardconjurer/tree/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th).
These are selection masks, not separate bevel artwork; no hidden underlying
texture is reconstructed.

Three calibration scans per color fit shared material profiles, then 29 held-out
cards validate them on frozen poses. Bevel RGB error improves in every color
(on 28/29 individual validation cards). White, blue and black adopt texture tone
curves; red and green retain their prior texture tones after their trial curves
failed to improve contrast and color together. The broader texture check includes
clean lower-background regions as well as side strips. Black's held-out contrast
error falls 5.97 → 1.39, while its mean RGB error rises 4.35 → 5.27. These are
regional 0–255 byte errors, not full-card accuracy. Its narrow rails and lower
texture have different source means; one curve cannot match both exactly, and
the texture pattern itself remains an asset limitation.

All 44 native replays preserve artwork and title/type/rules-panel interiors
exactly. Material alpha and transparent pixels are unchanged. This supersedes
the initial ink study's brighter-pixel invariance only inside the new selections.
Two mask readbacks and linear-time selection expansion happen only on derived
material cache misses; animation does no new work. The candidate is awaiting
visual review and has not been released.

The [normalization audit](fixtures/accuracy/legends-normalization-review.json)
found inherited sampling bands crossing title and artist lettering. Search
padding now stays within clean outer-frame pixels, and separate edge strips
validate each pose. All 310 scans pass content-isolation checks; **303 pass
alignment and seven remain flagged**. Poses affect comparison scans only.
The equivalent Alpha/Beta/Unlimited/Revised audit is now recorded below. Its new
comparison poses are frozen offline; the live review application still uses its
previous templates until the next validated renderer/scoring update.

Rechecking unchanged renderer crops with corrected poses preserves every held-out
improvement: titles 63.4% → 72.4%, types 76.4% → 80.2%, mana 47.0% → 84.4%, and
set symbols 60.3% → 82.8%. These are component edge-overlap scores.

The [frame refinement](fixtures/accuracy/legends-frame-refinement.json) preserves
land shadows: held-out shadow-lightness error is now 4.0634, close to the
unadjusted 4.0385 and within the 0.25 guard. Color error improves from 9.7750 to
2.2021. The shared gold geometry improves held-out boundary correlation from
0.8408 to 0.8553. Torsten improves within this source family but remains an asset
outlier relative to its older, blurrier frame; no individual geometry override.

The [text runtime verification](fixtures/accuracy/legends-text-runtime.json)
adopts the frozen shared size/centering rule. All 104 actual painter outputs
match the proposal exactly. The initial independent validation improves 18/19
cards, from **38.3% to 64.5%** text-region overlap. Original and Oracle wording
both fit on **all 310 cards**, with every word retained and no overflowing lines.
Host left alignment, explicit paragraph alignment and the selected original or
Oracle centering reference remain respected. Sentinel's wrapping, Fallen Angel's
mixed line alignment and Dream Coat's spacing remain flagged. The
[frozen proposal](fixtures/accuracy/legends-rules-clean-proposal.json) preserves
its original measurements; the final release evaluation is recorded below.

The [first text study](fixtures/accuracy/legends-rules-proposal.json) and
[measured-fit follow-up](fixtures/accuracy/legends-rules-fit-proposal.json) preserve
historical results from the superseded normalization. Their numbers must not be
presented as current frame-only validation or whole-card compliance.

Fourteen scan-bound original-body reviews, uncircled inline generic values and
explicit discretionary hyphenation are independent fixes. Hazezon Tamar,
Hyperion Blacksmith and Knowledge Vault now retain their printed word breaks
without putting visible hyphens into plain wording or changing Oracle. Their
follow-up measurements are development diagnostics, not new reserved validation.
The fitting tool retains before/proposal images and every regression.
Wall of Earth and Wall of Heat are explicitly flavor-only for original wording;
source gaps or incorrect reminders no longer introduce unprinted abilities. The [footer calibration](fixtures/accuracy/legends-footer.json) restores the
left-aligned “Illus. © 1994” credit, moves stats to the printed baseline, and uses
independent shadows with slightly lighter solid ink. All 70 renderer replays
match the fitted candidates exactly. Reserved credit overlap rises 43.8% → 71.6%
(36/36 improve), and P/T 45.0% → 75.1% (20/20 improve).

The [full-set evaluation](fixtures/accuracy/legends-fullset.json) compares all
310 printings with identical original wording and art. Across the 303 accepted
scan poses, structural match rises **46.0% → 76.2%**, with every card improving.
Rules overlap rises 28.5% → 64.3%. These fixed-region indices exclude color and
unverified legal text; they are not percentages of pixel correctness. Seven
rejected scans remain outside the average. Patch 0.3.5 packages this pass.

## Completed Future Sight and Planar Chaos passes

The requested Future Sight and Planar Chaos passes have shipped. Their studies
keep ordinary, futureshifted and colorshifted frame families separate, use frozen
scan normalization, and retain explicit exclusions and component regressions.

The initial inventory contains 81 futureshifted printings; all render with the
0.3.5 defaults, while 99 ordinary FUT printings remain outside this pass.
The [source audit](fixtures/accuracy/future-source-audit.json) records pinned
frame and mana assets, baseline identities, the full-art and transparent-frame
variants, and required input corrections. The branch now has shared frame/art,
mana, expansion-symbol, header/footer and body-placement corrections. Ordinary
five-color materials are calibrated. A separate sparse-source study adds
artifact colors, shared land footer/neutral panels, land white/green paper,
colorless and four textless-color corrections. Failed transfers retain source
values; Ghostfire is a singleton study, and full-art black has no accepted pose.
Broader body font/reflow changes
were rejected for wrapping regressions. The [full-frame report](fixtures/accuracy/future-fullset.json)
improves 53.0% → 72.6% on all 80 accepted poses; Mass of Ghouls remains excluded.
The Future Sight work, wear options, public reviewed-printing wording resolver,
and cardstock changes are released. Planar Chaos followed in **0.3.8**, including
its colorshifted frames, copyright/collector lines, frame/paper colors and shared
alignment defaults. All 165 printings render. The [full-set report](fixtures/accuracy/planar-fullset.json)
scores 156 accepted scans; six alignment exclusions and three split cards remain
visible. Ordinary and colorshifted families have separate results.

Planar Chaos follow-up: resolve rules font-size and wrapping outliers before
further text fitting. Visual review found missing em dashes after “Choose one”
in all five cached Charm original texts; exact-printing corrections now restore
them through the public wording resolver. Keep the 0.3.8 score report frozen:
these source corrections need their own measurements. Heroes Remembered remains
the sole whole-card regression in that report; Saltblast, Retether and Ghost
Tactician also show substantial font-size/wrapping differences. Do not compensate
for missing source text with layout parameters. Variable-stat stars, P/T badge
shapes and isolated printing-color differences remain queued for review.

The [Planar text follow-up](fixtures/accuracy/planar-text-followup.json) retains
the existing typography after testing alternate fonts, shared size caps,
horizontal glyph scaling and a shallow content-based size rule. The latter
fails validation, including a 22.8-point regional regression. Per-card exact-size
diagnostics improve the text-region mean from 57.6% to 72.1%, but those values
are fitted to each reference and are not predictive scores or printing-specific
renderer defaults. Keep these candidates for the later outlier-review workflow;
do not replace the shared defaults with a lookup table. The five Charm wording
corrections ship in **0.3.9**. Original wording gains the printed separator;
Oracle wording and shared typography remain unchanged.

Planar **0.3.10** includes a [validated variable-stat star fit](fixtures/accuracy/planar-stars.json).
ModMatrix's stars use 77.5% of their original ink size and a 1.25 px downward
shift while retaining the font advances and slash. Both calibration cards and
all six reused validation cards improve; the latter regional ink score rises
from 82.0% to 89.2%. Full native rendering confirms all 157 non-star printings
are byte-identical to 0.3.9 and the eight changed cards differ only inside the
P/T area. The single colorshifted star card is in calibration, so that treatment
has no separate validation member.

The [badge geometry replay](fixtures/accuracy/planar-badges.json) moves the
ordinary and colorshifted P/T plates down and fits their width and height
separately. Conjurer assets beat or matched the MSE alternatives on calibration;
no new asset source is needed. All 105 accepted P/T cards improve, including
84 reused validation cards. The 58 non-P/T cards remain byte-identical. Rules
clearance stays independent of the badge bitmap: all 165 rules rasters remain
unchanged. The initial coupled trial reflowed 22 cards, including four measured
regressions, and was rejected.

The [0.3.10 full-set comparison](fixtures/accuracy/planar-badge-fullset.json)
against released 0.3.9 raises structural similarity from **81.34 to 82.45 / 100**
across 156 accepted scans. All 105 scored P/T cards improve; 51 other cards are
unchanged. P/T-region similarity rises from 76.33 to 96.08 / 100. Six rejected
single-face scans and three split cards remain excluded. These are edge-based
similarity indices, not percentages of flawless pixels. Rules font size/wrapping,
remaining numeric P/T glyph differences and local pigment differences stay open.

The [short-passage follow-up](fixtures/accuracy/planar-short-rules.json) removes
short rules endings and single-word flavor orphans with a bounded size reduction.
It changes five original printings: Dawn Charm, Ghost Tactician, Saltblast,
Piracy Charm and Serendib Sorcerer. All 160 other original rasters are byte-exact.
An initial broader rule damaged Serra Sphinx; retaining multiword flavor endings
avoids that regression. This is repeated validation after reviewing that failure,
not an untouched holdout. No printing-ID layout overrides are introduced.

With the live scoring method and its source-verification exclusions, mean
structural match rises **80.89 → 81.57 / 100** over 156 accepted cards; all five
changed cards improve and 151 are unchanged. These figures are not directly
comparable to the older offline index. All changed pixels lie inside the rules
box. One thin frame metric strip overlaps italic ink, producing a tiny incidental
frame-score change; the frame geometry is unchanged. All 324 original/Oracle
layouts retain their text and fit. Roiling Horror's longer Oracle wording now
fits at 14.25px using a bounded fallback below the normal 15px minimum.
Dense original-text outliers, including Retether and Heroes Remembered, remain
queued for the next typography pass.

The [dense-text fitting trial](fixtures/accuracy/planar-dense-fit-rejected.json)
rejects applying measured spacing before sizing as a general solution. The
training-selected bounded rule improves Retether and Aven Riftwatcher, but native
whole-card replay finds five substantial regressions among eleven changed cards.
All release-baseline hashes, frozen scan poses and component coverage agree.
Reality Acid, Extirpate and other existing good matches would lose their printed
line breaks. Keep these development diagnostics for outlier review; do not ship
per-printing font-size values or claim the dense-text problem is resolved.

The [printed-artist review](fixtures/accuracy/planar-artist-review.json) identifies
five PLC credits reading “Dan Scott” while both Scryfall and MTGJSON supply
“Dan Murayama Scott”. Retether, Dismal Failure, Serendib Sorcerer, Kavu Predator
and Intet were checked against their exact cached scans. Keep canonical artist
metadata and printed credit separate. The 0.4.0 public
`resolvePrintingArtist` helper and accuracy adapter apply these exact credits;
original and Oracle views retain the same physical credit. The public catalog
also includes the six previously reviewed Alpha, Unlimited and Tempest credits.
Unknown printings retain provider values; optional scan hashes guard reuse.

The [artist-only replay](fixtures/accuracy/planar-artist-replay.json) renders all
165 PLC cards. Exactly five change, only within the artist line; the other 160
rasters are byte-identical to 0.3.12. At unchanged, browser-decoded scan poses,
mean artist-region edge overlap rises **69.13 → 88.74 / 100**, with all five
improving and every unrelated component unchanged. The whole-card mean remains
**81.57 / 100** across 156 accepted scans: reviewing artist names does not certify
copyright text, so the combined credit component stays excluded. No font,
geometry, color or eligibility changes are implied by this source correction.

Next typography experiment: measure roman and italic/reminder advances
separately on the existing calibration cohort before selecting any new shared
policy. Retether and Heroes Remembered have different wrapping and line counts;
a universal size increase fixes some passages while damaging well-matched ones.
Use the already-frozen scan poses and original wording, retain unchanged-card
controls, and verify whole native renders before adoption. Reused validation
remains explicitly reused; per-card optima remain diagnostics.

The [isolated italic-width trial](fixtures/accuracy/planar-italic-width-rejected.json)
also fails to transfer. Training selects 98% width for italic/reminder ink and
advances, with roman text unchanged. Across 123 reused validation cards its
whole-card mean rises only 0.24 points, with 46 improvements, 46 regressions and
21 losses exceeding one point. All 156 baseline hashes/scores match the release,
and poses and coverage remain fixed. Retain the original width; this is evidence
against another blanket typography adjustment, not a new renderer default.

## Early core scan normalization

The [Alpha/Beta/Unlimited/Revised audit](fixtures/accuracy/early-core-normalization-review.json)
checks all **1,205** cached scans. Bounded strips exclude the header and artist
areas, including search padding. All scans pass exact interior-isolation checks.
Fixed calibration targets, disjoint model-selection strips and a third
certification group separate pose fitting from verification. A broader initial
search avoids choosing the wrong bevel peak without relaxing acceptance gates.

Outer-strip coverage is **292/295 Alpha, 297/302 Beta, 302/302 Unlimited and 306/306
Revised**. Every accepted pose also passes replay on the warped raster. These
are comparison-only transformations; renderer defaults have not changed.
Earlier-used validation cards are explicitly reused validation. Eight uncertain
scans remain flagged, and Beta Twiddle retains a small regression relative to
the first clean-strip trial while improving over its raw scan.

The [baseline frame diagnostic](fixtures/accuracy/early-core-frame-diagnostics.json)
captures all **1,205** unchanged 0.3.8 rebuilds with no render failures. Its
whole-frame transform is not adopted: Revised lands regress on validation.
Removing artwork-sensitive source pixels makes the art-bevel measurements more
reliable; all 84 source variants pass an exact perturbation check. Reference-side
interior isolation is still unproven, and weak edges remain explicitly unmeasured.

Unlimited/Revised scans have a further registration problem: the outer border
can agree while art and rules-box edges vary together by roughly 1–3 pixels.
Outer-strip certification does not certify the printed interior. The follow-up
below establishes scan-only interior anchors; preserve outer-border disagreement
as a separate diagnostic. Alpha/Beta
white examples give more consistent inner-edge measurements. Original type lines
also remain unverified on 912 faces, and original rules on 16 Unlimited faces;
do not include those components as verified printing accuracy until reviewed.

The [interior normalization follow-up](fixtures/accuracy/early-core-interior-normalization-review.json)
uses narrow frame-texture strips beside the art and rules box. Fixed calibration
cohorts select scan-only templates; separate bands fit, choose model complexity
and certify. It passes **304/306 Revised** and **187/302 Unlimited** scans, with
every accepted pose passing actual warped-raster replay and region-isolation
checks. Five known translation/scale/rotation/skew perturbations are recovered
within 0.04 canonical pixels. Reviewed visible frame material controls scan
grouping, so Revised Serendib Efreet uses the green template while retaining its
blue semantic color and mana.

On reused validation cards with eligible baseline rules-box edges, mean absolute
scan-to-scan edge residual falls **0.90 → 0.24 px for Revised** and
**0.71 → 0.33 px for Unlimited**. These are registration diagnostics, not renderer
accuracy scores. Four Revised and twelve Unlimited cards retain multiple
rules-box edge outliers; they remain explicit review cases. Revised Gaea's Liege
and Roc of Kher Ridges fail texture confidence checks. Unlimited red/artifact
groups lack template support, and some blue/green scans remain rejected. A
calibration-only smoothing trial helps green/artifact texture but not red; it is
not adopted. No renderer default, live scoring template or release changes here.

## Revised frame geometry candidate

The [native frame replay](fixtures/accuracy/revised-frame-native.json) tests six
shared Fourth-source placements against 304 accepted Revised interior poses.
All 279 nonland cards improve in both the blank-frame boundary diagnostic and
the full-raster gradient check. Full-raster edge F1 at one-pixel tolerance rises
from 60.66% to 75.03%; this is a diagnostic, not the component-weighted score.
The 231 reused validation nonlands improve; 25 lands and 42 ABU controls remain
byte-identical. Two uncertain Revised poses remain excluded.

Changing placement initially invalidated the source-bound HSB profiles. The
candidate explicitly rebinds the same six pinned source images, source-local
masks and HSB transforms to the new placements. It does not bypass source
identity checks or claim a new color fit. All 44 source-opacity perturbation
checks pass. Reference-side content isolation for the boundary windows remains
unproven; full native replay and visual review provide separate evidence.
Typography and local pigment outliers remain open. Patch **0.3.12** packages
this validated frame placement.

The [0.3.11 integration replay](fixtures/accuracy/revised-frame-integration.json)
freshly captures all 306 Revised cards, 42 ABU controls and all 165 Planar
printings. Both sides exactly reproduce the frozen baseline/candidate rasters;
the 25 Revised lands, ABU controls and released Planar fixes remain unchanged.
Code/package/browser/showcase checks pass. Review-app integration now reproduces
all 306 frozen interior poses exactly, including 304 accepted scans and two
rejections; the browser bundle and server validation agree. Planar registration
remains unchanged. Fresh deployed scores must use this interior normalization,
not the older outer-border poses.

## Current execution checkpoint

1. Revised land frames, colored pinlines, striped paper, shared text positions
   and the missing copyright marker shipped in 0.2.24. All 25 land printings
   and the complete five-set corpus have versioned historical scores; regenerate
   them for each subsequent renderer/normalization generation.
2. Audit the recorded fixes against shipped code, then address remaining defects:
   original wording/score coverage, early glyph and shadow outliers, missing
   historical symbol sources/materials, shared security stamps and holographic
   treatment, and dedicated special-frame layouts. Keep already-shipped Split/Fuse
   and early artifact-type fixes closed unless regression evidence reopens them.
3. Calibrate all ordinary pre-Eighth Edition printings in small set groups. Within
   each group: validate frame-only scan normalization; fit shared frame alignment;
   fit mana and expansion symbols; fit frame/paper and mana colors; fit rules and
   illustrator typography. Validate shared defaults on reserved printings, update
   versioned scores and release accepted changes before moving to the next group.

Begin with Alpha/Beta/Unlimited/Revised, then the early expansions and
Fallen Empires/Fourth/Chronicles, Mirage/Tempest blocks, Urza/Sixth, Mercadian/Seventh, Invasion, Odyssey,
and Onslaught. Portal and starter printings need their own frame groups. Preserve
coverage denominators and explicit exclusions; a rejected fit must not disappear
from reports. Never reuse a prior renderer's score under a new version.

The Revised land implementation is measured in
[the Fourth-land calibration](fixtures/accuracy/3ed/land-fourth-calibration.json).
All fifteen basics and ten duals now have colored pinlines, textured paper bands
where appropriate, shared lettering and `Illus. ©` credits. Whole-card structural
mean: 40.9% → 75.7%; held-out mean: 41.8% → 75.1%. The basic-land font-size refit
was rejected on validation. This supersedes the older pending-land notes below;
historical study records remain unchanged.

The input-data correction released in 0.2.25 reviews 73 previously excluded printings in
Alpha, Beta, Revised, Eighth Edition and M21. Their rules are explicitly empty;
their flavor and printed types are checked against exact scan hashes. Wall of
Ice must not acquire Oracle Defender in original mode. These corrections remain
separate from typography fitting, and missing source fields elsewhere remain
unverified. Eighth Edition includes obsolete types such as Eel and Monster;
Oracle mode retains current types. Fresh scores now cover all 1,543 showcased
printings: 1,517 scored and 26 explicitly awaiting alignment review. Release
0.2.26 fixes dense Revised land text under Oracle-based centering without changing
the original-wording score rasters.

The next Eighth basic-land correction fits the inner frame before color fitting.
One shared transform improves nine reserved printings' edge cosine from 0.524 to
0.916 and whole-card structural similarity from 68.5% to 74.8%; every accepted
printing improves. The outer border and corners remain fixed. Swamp 339 retains
its alignment exclusion. See [the measured geometry](fixtures/accuracy/8ed/basic-land-geometry.json).
Source-UV masks now separate headers, paper, pinlines and brown texture. Actual
reserved color medians improve for every material; calibrated large glyph fills
retain their white highlights and neutral shadows. Combined geometry/color
raises reserved whole-card similarity from 68.5% to 75.6%, and all nineteen
accepted printings improve versus 0.2.26. See
[the color study](fixtures/accuracy/8ed/basic-land-colors.json).
The structural metric remains contrast-sensitive around large glyphs and frame
edges: Island 338 loses 3.1 points from color alone while gaining 7.3 points versus
the released renderer. Review that scoring sensitivity separately; do not distort
the calibrated palette to maximize an edge threshold. Printed legal text and
header/font differences remain in the review queue.

Static ordinary/planeswalker security stamps now use physical printing metadata,
family-specific colored mounts and shared native bounds. Twenty-four accepted
examples place the oval center within 0.48 px horizontally and 0.61 px vertically
on average. Five failed frame fits remain visible. Six reserved ordinary examples
improve mean structural similarity from 70.0% to 71.2%; Vito's changed flavor wrap
is a retained typography outlier. See [the stamp audit](fixtures/accuracy/security-stamps.json).
Localized hologram animation, other stamp shapes and footer legal text remain pending.
Full-set 0.2.28 verification additionally flags dense stamp-clearance typography
on Liliana’s Scorn, Terror of the Peaks and Volcanic Salvo. Keep these in the
reported averages. A generic upward-clearance fitter worsened the complete M21
stamped cohort and was rejected; calibrate size, wrapping and leading together.

## Release 0.2.21 checkpoint

The release branch now includes 129 scan-bound original artifact type reviews
for LEA, LEB and 2ED, including Mono, Poly and Continuous Artifact and plain
Artifact on Jade Statue. Oracle wording remains independent. It also includes
five-set scan templates, cached regional symbol fitting and the `symbols-v3`
controls for cost spacing, numeral size/offsets and per-color glyph size/offsets.

The five-set color pass admits 25 source/material profiles with independently
validated frame/paper components. Failed components retain their prior approved
correction or the original asset; this is not complete calibration of every
color. Historical mana artwork and printed cost order are documented in
[historical mana](historical-mana.md). Mana-disc color coverage, especially early
black discs, still needs extension independently of glyph selection.

Split/Fuse gradients, matching-guild watermark inheritance, per-half tint,
plain oval sizing, raised copyright text and small-cap modern artist credits
are included. Twenty INV/APC/DIS legal lines are scan-bound; synthesized legal
text elsewhere remains unverified. The pinned MSE Fuse bridge has been checked
through its identical GitHub source after intermittent CDN failures.

The separate review application now stores versioned whole-card and regional
scores, scan normalization, notes and adjustments. Its full-set templates cover
LEA, LEB, 3ED, 8ED and M21; rejected alignments are available for review rather
than included in aggregate accuracy. New renderer generations must be rescored.
Historical sampled reports must not be presented as current full coverage.

### Still queued

- Shared security-stamp coverage on ordinary modern cards and planeswalkers,
  followed by a localized WebGL holographic interior that works on nonfoil cards.
  Keep the printed surround static and specific to its frame family; Split/Fuse
  stamps have no colored surround.
- Rooms, Battles, physical double-faced layouts and the remaining special-frame
  queue. Keep missing Guild Kit expansion symbols and text-wrap/registration
  outliers visible.
- Continue set-symbol calibration after this release. Keep per-scan normalized
  references distinct from shared renderer geometry; no scan-specific renderer
  placement or color adjustments.
- Revised dual-land textbox treatment and further frame/texture replacements.

The mana follow-up records 684 nonfoil production comparisons in
[the validation report](fixtures/accuracy/mana-location-verified.json). Twenty-six
shared set/stock rows pass (661 cards); The List retains its existing placement
because a reserved card regressed. These are sampled component scores, not
whole-card accuracy percentages or complete per-card coverage.

The [geometry correction record](fixtures/accuracy/frame-corrections.json)
tracks the Fourth-family art opening, white-paper keylines, and the centered,
curved planeswalker art aperture. Ordinary Scryfall `frame: 2003` inputs now
select the existing Eighth Edition plate in the reference adapter. Hosts must
preserve that family when switching wording modes.

Foil-only references are excluded before new HSB sampling and at adoption.
[The printing-scope audit](fixtures/accuracy/hsb-printing-scope.json) removed five
active mana-color targets and found no active frame-color target to remove.
A printing available in both finishes still uses Scryfall's default scan; this
metadata guard cannot certify that every mixed-availability image is nonfoil.

Seventh Edition uncommon/rare symbols use a checksum-guarded local SVG patch
for their outer white rim. The common source already has the white rim.
Urza rarity gradients, every-set footer typography, and rejected/sparse symbol
cohorts remain review items. Revised dual-land paper remains in the asset queue.

The [symbol follow-up](fixtures/accuracy/major-symbol-followup.json) accounts for
all 445 major-set groups: 165 retain identity proposals, 96 need review, 147 lack
enough validated scan fits, 23 lack a symbol source, 11 have no printed symbol,
and three have unsupported layouts. No new candidate passed all reserved
production-render gates; existing shared placements remain unchanged. Exact
comparison-region pixels and icon bounds guard transfers from earlier captures.

The [Urza footer check](fixtures/accuracy/urza-footer-final.json) records artist
and copyright improvements on 49 reserved examples. Larger power/toughness was
rejected; its existing geometry remains. Long supplied artist credits are
constrained to avoid overlapping the creature's stats.

## Agreed execution order

Earlier rollout priority (superseded by the execution checkpoint above): redo all old-frame color profiles with separate frame and
paper transforms, source-derived masks for irregular edges, and stock-correct
per-scan frame normalization. Urza's Saga white's pink cast and Urza's Destiny
white's brown shadows/excess contrast are required regression examples. Gate
component hue, shadow color and texture contrast separately from median color.
Then resume the remaining old-frame and new-frame set-symbol passes.

For that symbol pass, review rarity materials as well as placement: user review
flags Urza's Saga as flat-filled and Urza's Legacy as using only a subtle
gradient. Compare uncommon and rare scans before changing the shared historical
material policy; record this separately from alignment scores.

Use the [current rollout plan](accuracy-plan.md#current-rollout-old-frames-then-new-frames):
major sets contain at least 50 distinct ordinary English paper cards; measure
every ordinary printing in admitted sets. Arabian Nights and Antiquities are
included. Smaller sets follow later.

1. Old-frame set symbols, then border geometry, then component HSB.
2. New-frame set symbols, then border geometry, then component HSB, including
   both 2003-era and 2015-era families.
3. Automatically fit text on every eligible ordinary printing, derive and
   validate shared set defaults, then rescore the corpus with those defaults.
4. Use human review for the remaining outliers and local glyph/spacing defects.
   Keep a small random audit of high-scoring cards to detect metric blind spots.

The inventory and coverage ledger are established. Keep unsupported cards and
registration failures visible. Current component comparisons must normalize
each scan's translation and uniform scale from frame-only anchors before
measuring placement. Freeze and reuse fits across candidates; keep them out of
renderer settings. Historical shared-offset results remain diagnostic evidence.
Recalibrate every set-symbol placement using these stored per-card poses;
evaluate rotation and global skew against independent frame samples as part of
the normalization work. The [rollout ledger](fixtures/accuracy/symbol-normalization-rollout.json)
keeps every major-set group pending until that work is validated.
Existing typography/font issues below remain
queued separately during the component passes. The
[text-calibration handoff](accuracy-plan.md#automatic-text-calibration-after-both-waves)
defines fitting, shared defaults and outlier review.

### Frame-normalized placement review

- Stored translation/scale/rotation/shear model checks now cover 3,084 printings
  in 15 old-frame sets. Only 1,073 have accepted fits; 724 fail frame validation
  and 1,287 lack an admitted template. Preserve these coverage failures.
- Extend frame targets and reliable edge extraction for black, gold and land
  materials. Revisit Antiquities' frame aspect/anchors before learning placement
  from its single accepted scan. Continue the complete old/new rollout ledger.
- Reject the trial LEG/W and TMP/R,G placements: native bounding-box center
  improvement did not survive raster overlap validation. Use shared overlap
  search and contour review for these outliers; never tune individual scans to
  the symbol. Keep the retained assets and record bolt/cloud contour differences.
- Stronghold white has mixed edge-F1 results with improved Census agreement;
  retain its explicit regressions for review. Revisit those narrow gate strokes
  and raster phase alongside the remaining source-shape differences.
- ATQ/ICE/EXO have stored poses but still need their specialized measurement
  adapters migrated. Fallen Empires has placement proposals awaiting raster
  validation. These are unfinished work, not completed sets.

### Stored normalization and Portal follow-up

The [Portal pilot](fixtures/accuracy/por-symbol-normalized-review.json) improves
inspection F1 .649 → .736 on the same 152 normalized scans. Two baseline and
five previous-shared-placement regressions remain explicit review flags.
Rotation/skew model validation, weak anchors and missing material templates
remain open. Tempest has 231 stored accepted fits and awaits recalibration.
Neither set completes the full rollout. Keep Portal radial contour/panel-tone
mismatches separate from placement.

### Revised dual-land text-box treatment

Check and reproduce the printed Revised dual-land rules-box background/treatment
across all ten dual lands. This is separate from the missing striped outer-frame
overlay; completing one does not close the other. Compare scans with the retained
frame assets, record missing components, and validate the paper treatment with
the frame/HSB work before learning text defaults. Do not let a background mismatch
drive text size or margin corrections.

### Homelands globe follow-up

The native-size and opaque-interior correction is validated on all 140 ordinary
printings, with eight unchanged controls. Shared symbol placement still needs
the frame-normalization pass: An-Havva Township, Aysen Abbey, Castle Sengir and
Wizards' School have the lowest residual scores and scans displaced to the right
of the main material cohort. Do not add individual symbol offsets. Keep internal
globe contour/ink-weight differences in the retained-stencil review, and light
detail tone in the later color pass. The corrected globe uses the existing
Keyrune asset and its closed inner-circle path; no source asset was replaced.

### Visions V follow-up

The measured size, opaque white V and removal of the false exterior white rim
are retained after auditing all 167 printings. Placement remains provisional.
Eight cards regress by more than .02 edge F1 in at least one tier: Necromancy,
Necrosavant, Pillar Tombs of Aku, Goblin Recruiter, Heat Wave, Solfatara, Song of
Blood and Talruum Champion. Their scan/before/after crops were inspected; retain
the exact scores in [vis-symbol-review.json](fixtures/accuracy/vis-symbol-review.json).
Separate scan pose from frame geometry before revising placement, and keep the
remaining internal V stroke/proportion differences in the source-stencil queue.
Do not hide these regressions in the improving median or add per-card offsets.

### Alliances banner follow-up

The independent-axis size correction and smoother mask sampling are measured
across all 199 ordinary printings. The shared raw placement remains provisional:
21 printings regress by more than .02 edge F1 in at least one tier, concentrated
in black and gold frames. All regression crops were inspected; these materials
repeatedly put the printed banner farther left. Separate scan pose from frame
geometry before changing placement again. Keep every score and the 11 derived
type-clearance changes in
[all-symbol-review.json](fixtures/accuracy/all-symbol-review.json).
The retained stencil's folds, dark central curl, shaded interior and exterior
rim still need review; black-ink dimensions do not validate the white rim.

### Weatherlight book follow-up

High-quality temporary-mask downsampling removes broken fine book lines while
retaining the measured geometry. All 167 ordinary printings were audited;
Odylic Wraith and Lotus Vale regress by more than .02 at table size, despite
improving at inspect size. Both were visually inspected and remain in
[wth-symbol-review.json](fixtures/accuracy/wth-symbol-review.json).
The tenth-percentile table score also falls slightly (.559 to .553). Keep the
left spine contour/hatching and gray page shading in the asset/color queues,
and recheck placement after independent frame normalization.

### Arabian Nights and Legends normalization follow-up

The six next baselines are now frozen: ARN, LEG, MIR, TMP, STH and POR, totaling
1,474 ordinary printings plus controls, with no capture failures. Component
preparation now enumerates the exact study face; the failed initial Mirage and
Tempest snapshots omitted Oracle basic-land assets and remain preserved.

Independent frame registration covers W/U/R/A for Arabian Nights and W/U/A for
Legends. Sparse/weak materials remain outside those profiles. Normalization
invalidated the proposed Arabian Nights width increase, so its geometry stays
unchanged. Smoother symbol-mask sampling is retained, but its structural scores
are neutral or slightly lower; the hilt hook, cord and blade shading still need
asset review. See [arn-symbol-review.json](fixtures/accuracy/arn-symbol-review.json).

Legends' shared correction improves both tiers on all 114 complete comparisons
with validated frame registration. This is partial coverage of 310 printings:
195 still lack a validated frame/material model, and Equinox has a partial
reference region. The raw audit has 224 distinct regressions over .02, including
136 on unvalidated materials; keep them visible until those frame models exist.
Do not present the aligned subset as validation of every material. The six worst
unvalidated raw regressions were inspected and remain frame-review cases.
See [leg-symbol-review.json](fixtures/accuracy/leg-symbol-review.json).

Equinox's full scan places its column unusually far right, outside part of the
fixed score window. Its partial scores are preserved but excluded from complete
symbol summaries. A broader reference-only coverage check now catches this
automatically; a complete-region comparison is still needed. Do not compensate
with a per-card renderer offset.
Keep the column capital, rounded channels and contour differences on the
retained-stencil list.

The 1997 extension now covers admitted materials in MIR/TMP/STH/POR. Extend the
remaining material/source groups, preserving weak anchors and unvalidated counts
rather than borrowing a transform silently.

### Mirage, Tempest, Stronghold and Portal follow-up

All 1,072 ordinary printings are scored, with zero capture failures and 32
unchanged controls. Independent frame registration admits 690 comparisons;
382 frame/material cases remain unvalidated. The native coverage check verifies
409 silhouettes inside their scoring windows and marks 281 inconclusive. Unknown
coverage does not certify a complete symbol, and the raw audit retains every card.

Mirage improves on all 186 aligned comparisons at both tiers. Stronghold improves
on 82 of 86; four smaller declines remain below .02. Preserve the remaining palm
contours, segmented trunk, gate arch and fine grille differences as asset issues.

Tempest retains 73 aligned regressions over .02 across white/red/green/artifact
materials. Its cloud and bolt proportions cannot both be corrected by stretching
the whole stencil. Measure the bolt separately, retain the new opaque inner
detail, and review the repeated placement residuals after material frame checks.

Portal's opaque panels and larger silhouette improve overall scores, but 53
aligned regressions remain on white (29) and blue (24) frames. Calibration showed
different printed centers for W/U versus R/G. Validate the frame/material source
groups before adopting shared material placement variants. Its panel tone is
too white and the radial/outer-ring contours still differ from the scan; these
belong in the color/asset work, not individual card offsets.

See the [1997-frame checkpoint](accuracy-plan.md#1997-frame-symbol-checkpoint-2026-10-13)
and the four per-set symbol review fixtures. These studies do not close the
material-specific placement issues or certify whole-set fidelity.

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

### Ice Age baseline and existing snowflake variants (superseded by v74 below)

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
- The four baseline failures are an input-mode issue, not unsupported frames.
  Unverified Oracle text was supplied without `wordingMode`, retaining the
  15 px historical floor. Explicit `wordingMode: 'oracle'` with
  `symbolStyle: 'original'` renders every supplied paragraph: Cooperation at
  14.75 px, Formation at 13.5, Kjeldoran Knight at 14.5 and Dance of the Dead at 14. Both raster tiers are captured and hashed in `ice-wording-fit.json`;
  reproduce with `ice-wording-fit.mjs`. Preserve the original frozen failures
  and input identities. A follow-up corpus using explicit Oracle mode needs
  its own matched baseline; it must not silently replace historical inputs or
  count these alternate-mode renders as original-text accuracy validation.

### Exodus wider rim review (v70)

- Follow the visual review request to double the nominal white rim while
  splitting the added width equally inward and outward. The outside radius
  changes 1.25 → 1.875 px; the ink gains a 0.625 px inset. The original 55 × 19
  glyph bounds, center, palette and type widths remain fixed. Only the visible
  outside silhouette grows by 0.625 px per side.
- Intersect shifted copies of the existing filled silhouette during static
  composition. Reuse opaque window backing so the inset acts on the exterior
  and open arch, preserving the window contours. No replacement vector,
  pixel readback or per-animation-frame preparation is introduced.
- All 143 printings and seven controls were recaptured at both tiers. Every
  changed pixel lies in the tight rim envelope `[371, 376, 64, 27]`. All controls,
  type measurements and pixels outside that envelope are identical to v69.
- Inspection median edge F1 improves .687 → .725 with the frozen provisional
  frame fit (.586 → .594 raw). Sixty-two cards improve by more than .02;
  thirty-nine regress. The common median falls .760 → .724 while uncommon
  improves .662 → .711 and rare improves .693 → .772. Overall inspection
  Census is essentially unchanged, .743 → .742.
- **Keep small-size rendering and common ink under review.** Table median F1
  falls .744 → .714 (.632 → .626 raw), with twelve improvements and seventy-seven
  regressions over .02. Table Census falls .801 → .779. Allay and Cataclysm
  are explicit examples where widening the rim worsens edge diagnostics.
  This is a user-directed visual refinement, not an across-the-board metric
  improvement or a reason to refit scans/individual symbols.
- Reproduce with `exo-symbol-study.mjs rim-candidate|rim` and
  `exo-rim-audit.mjs rim-candidate|rim`. Reports are
  `exo-symbol-rim-{candidate-measurement,measurement}.json` (the full-set file
  is `exo-symbol-rim-measurement.json`). The local comparison retains v69 next
  to the balanced rim, raw/provisional-fit scans, overlays and every card's
  scores, including regressions. Fine bridge contours remain an asset-review
  item; frame normalization remains provisional.

### Exodus exterior-only rim (v71, supersedes the v70 inset)

- Visual review found that the inward expansion removed too much colored ink.
  Use the requested **2 px outside rim, zero inset**. Restore the original
  colored bridge silhouette and remove the unused erosion helper. Geometry,
  gradients, window backing and type widths remain unchanged.
- Compare all 143 printings against the v70 balanced rim at both tiers, with
  the same seven controls. Changes are confined to the rim envelope; boundary
  texel footprints may intersect it at table resolution. Controls, type
  measurements and all pixels away from that envelope remain identical.
- Shared-fit median F1 improves .725 → .770 at inspection and .714 → .749 at
  table size. Raw medians also improve, .594 → .612 and .626 → .637. Census
  improves .742 → .793 and .779 → .810. Inspection has 83 improvements and
  20 regressions over .02; table has 88 improvements and nine regressions.
  Against the earlier v69 thin rim, inspection/table medians were .687/.744.
- Common and rare medians improve at both sizes. Uncommon inspection improves
  .711 → .736, while its table median is nearly flat (.725 → .719). Keep the
  remaining blue-frame offsets and fine bridge contour mismatches flagged;
  none of these scores certifies scan normalization or overall card accuracy.
- Reproduce with `exo-symbol-study.mjs rim-outer-candidate|rim-outer` and
  `exo-rim-audit.mjs rim-outer-candidate|rim-outer`. The corresponding
  `exo-symbol-rim-outer-*-measurement.json` candidate report and
  `exo-symbol-rim-outer-measurement.json` full-set report retain both tiers,
  all rows and regressions. The local comparison places the balanced rim next
  to the 2 px exterior-only version, with full cards, table rasters and overlays.

### Exodus independently measured symbol axes (v73)

- Supersede the unadopted 58 × 20 proportional enlargement trial. Measure
  native scan pixels before resampling, with independent width/height bounds,
  connected-component boundary rejection and a grayscale threshold sweep.
  All 55 commons are the measurement cohort; 54 have stable ink bounds and
  Culling the Weak is explicitly threshold-sensitive. The 88 metallic
  printings provide separate white-rim checks, not reliable dark-ink masks.
  Across all rarities, 107 rim measurements are stable; retain the other
  36 as uncertain rather than silently dropping them.
- Common ink measures 55.577 × 21.577 canonical px in raw scans. The existing
  provisional shared frame scale gives 55.214 × 21.436. Previous rendered
  ink was 54.667 × 19.333, so the height error is much larger than the width
  error. Native scan pixels represent approximately 0.65 canonical px;
  numerical differences below this are not precision claims.
- Use shared geometry **55.5 × 21**, right **430.5**, center Y **390**.
  Its center (402.75, 390) rounds the measured shared-frame median
  (402.703, 389.957). The 2 px exterior rim, pinned stencil, white backing,
  rarity palettes and symbol left edge remain unchanged. Actual rendered
  ink measures **55.333 × 21.333**. Paired median absolute width/height
  errors fall from .547/2.103 to **.119/.103 px** on the 54 stable commons.
- Validate all 143 printings at both tiers against v71; seven controls and
  all typography are byte-identical, including the three previously
  compressed Oracle type lines. Every changed pixel stays inside the
  symbol envelope. No per-card profiles or scan transforms were fitted.
- Inspection symbol F1 median improves **.770 → .877**, table **.749 → .803**.
  Raw medians improve .612 → .752 and .637 → .727. Inspection/table Census
  improves .793 → .857 and .810 → .829. There are 111/103 improvements
  and 21/23 regressions exceeding .02 at inspection/table size respectively.
  These are symbol-region diagnostics, not full-card accuracy percentages.
- Position remains provisional: white-frame scan centers differ from blue
  and black centers by approximately 2.6 px after the shared fit. Most
  inspection regressions are white cards. Resolve this with the frame pass;
  do not introduce per-scan offsets. The retained bridge stencil also has
  squarer tower/foot contours than the printed symbol, which remains an
  asset-review item even when its outer dimensions match.
- Reproduce native measurements with `exo-symbol-bounds.mjs rim-outer|measured`;
  captures with `exo-symbol-study.mjs measured-candidate|measured`; and
  shape/containment checks with `exo-rim-audit.mjs measured-candidate|measured`.
  `exo-symbol-measured-plan.json` freezes the measurement cohort and choice.
  The earlier `size` reports preserve the rejected proportional trial.
  The local comparison includes measured common-ink rectangles, full cards,
  table rasters and red/green overlays. Legacy five-card/remaining-card
  metric groups are retained for continuity; they are not an untouched
  holdout for this new 55-common measurement selection.

### Ice Age measured snowflake and reusable bounds (v74)

- Reuse native symbol measurements for later sets through `symbol-bounds.mjs`.
  Set studies supply a frozen region, broad dimensions and threshold sweep;
  width, height and placement stay separate. Shared tests cover resolution,
  tone changes, light rims, touching frames, ambiguous/missing components and
  fixed transforms. The refactor preserves all 594 previous Exodus scan
  threshold bounds; `symbol-bounds-reuse.json` records that check.
- Ice Age's fine linework fragments under solid-ink segmentation. Add a
  contrast-envelope mode with its known one-native-pixel kernel support
  removed, and use exact matched blank-face subtraction for renderer bounds.
  Reference envelopes and dark-ink bounds are distinct measurements. Four of
  eleven calibration references are stable; seven remain uncertain. Full-set
  measurement finds 121 stable references out of 383, with a median envelope
  20.269 × 21.577 canonical px; keep the other 262 explicitly uncertain.
  Artifact/land textures are particularly difficult for this segmentation.
- Select the already pinned **ice2.svg** finer snowflake. Reuse its closed
  outer subpath as the opaque white plate and retain the existing black
  contours; no added outer rim. Shared geometry is **20 × 21**, right
  **443.5**, center Y **394.5**. The actual inspection raster's isolated
  envelope is 20.667 × 21.333. Stable calibration pairs have median absolute
  width/height differences of .397/.247 px, below a source pixel (~.65 px).
  That agreement is not a claim of subpixel scan precision.
- The earlier overlap-only no-rim candidate was taller and narrower. Direct
  axis measurements and visual contour review replaced it; no scan-specific
  transforms or card-specific positions were introduced. Raw scan offsets,
  tiny-stroke rasterization and mismatched frame textures remain separate
  review items. The original coarse `ice.svg` remains unchanged for explicit
  custom URLs and modern-frame overrides.
- Freeze a separate explicit-Oracle/original-symbol baseline. All 383 ordinary
  printings and six controls render at both tiers, including Cooperation,
  Formation, Kjeldoran Knight and Dance of the Dead. The historical four
  failures stay in the older report; do not call this original-wording
  validation. Six v73 control captures account for the separately committed
  Exodus correction before evaluating the Ice Age change.
- All 383 production faces pass the full-card audit at both tiers: changed
  pixels stay inside `[405, 375, 44, 37]`; six controls, type clearance and
  typography remain identical. Inspection median symbol F1 improves
  **.370 → .591**, table **.394 → .538**. Census improves .550 → .699 and
  .551 → .688. Inspection has 354 improvements and six regressions over .02;
  table has 308 improvements and 53 regressions. The 372 reserved printings
  show similar median gains, .370 → .593 and .395 → .538 respectively.
- Keep blue-frame table rasters and land-region scores flagged. Hydroblast,
  Zuran Spellcaster and four basic-land printings regress at inspection size;
  land results are the weakest overall. Raw regional scores include nearby
  frame edges and texture, so they cannot alone distinguish fine-stencil
  errors from frame/background mismatch. No registration was refitted to
  improve those numbers.
- Reproduce with `ice-symbol-study.mjs before|controls|candidate|after oracle`,
  `ice-symbol-baseline.mjs`, `ice-symbol-audit.mjs candidate|after`, and
  `ice-symbol-bounds.mjs variants|candidate|after`. The separate Oracle plan,
  adoption plan, measurement reports and control hashes freeze provenance.
  The local review retains all scores, uncertain bounds, calibration examples,
  strongest changes, regressions and the four resolved wording-mode failures.

### Antiquities measured anvil and printed omission (v75–v76)

- Freeze all **102 ordinary printings** (85 distinct cards), with sixteen
  calibration cards spanning W/U/B/R/G, artifacts and lands, then reserve the
  remaining 86. Cache every scan/art asset and render explicit Oracle wording
  with original symbols at both tiers. Eight controls cover adjacent sets,
  Chronicles' inherited anvil, an explicit custom URL and a modern-frame card.
  The baseline and final capture both contain all 110 faces with no failures.
- Reuse native symbol bounds. The initial wide dark threshold sweep merges
  background texture or cuts off the anvil tip; retain the calibration-only
  segmentation screen. A shared 60/70/80/90 sweep supplies six stable references
  across W/U/artifact/land, median **32.856 × 16.183** canonical px. Ten calibration
  references remain uncertain. Full-set measurements find 28 stable references;
  one of the remaining 74 is the known absent symbol, not an unmeasured anvil.
  No thresholds, offsets or scales are fitted to individual cards.
- The existing padded stencil painted only **24 × 12.667**, around twenty pixels
  too far right. Crop its existing alpha bounds and use shared geometry
  **33 × 16**, right **415**, center Y **391.5**, with no outer rim. Actual
  inspection ink bounds are **33.333 × 16.667**. Paired calibration median
  absolute width/height error falls **8.856/3.516 → .490/.987** px. Source pixels
  represent about .65 canonical px; raw scan registration is still provisional.
- The geometry-only pass improves 101 cards and reveals Reconstruction as its
  sole substantial inspection regression. Its [Antiquities printing scan](https://scryfall.com/card/atq/12/reconstruction)
  has **no anvil**. Preserve the geometry-only capture/report and fix this
  printing detail separately. Both mana/tap symbol styles keep the omission in
  the original frame; explicit custom symbols and modern-frame behavior remain
  unchanged in targeted captures. This is a printing exception discovered in
  validation, so the final report separately identifies 85 untouched validation
  cards. It is not per-card alignment tuning.
- All 102 final faces improve symbol-region edge F1 by more than .02 at both
  sizes, with no edge/Census regressions. Median inspection F1 is
  **.338 → .717**, table **.315 → .689**; Census **.570 → .823** and
  **.611 → .850**. The 85 untouched validation cards show **.352 → .725** and
  **.319 → .700** F1. These are raw symbol-region metrics, not whole-card fidelity.
- All eight controls are byte-identical. All other changes stay inside the
  symbol envelope, except necessary type-only compression for the long Oracle
  labels on Priest of Yawgmoth and Dragon Engine (335.178 → 323.589 px maximum).
  The final omission correction leaves every other v75 face byte-identical.
  No original-wording typography claim is made.
- Keep the anvil's horn/stem contours flagged for asset review. Blue/black frame
  texture, artifact type-strip geometry and gold-tinted land framing differ
  visibly from scans; retain them for the frame and HSB passes. The local page
  includes all calibration cards, strongest/weakest changes, Reconstruction and
  both compressed labels, with full cards, measured bounds and red/green overlays.
- Reproduce current results with `atq-symbol-study.mjs after`,
  `atq-symbol-audit.mjs after`, `atq-symbol-bounds.mjs after`, and
  `atq-symbol-exception.mjs after`. Earlier baselines require their recorded
  renderer revisions. Geometry-only captures are retained under `geometry-only`;
  fixtures preserve the original capture/method hashes and all 102 scores.
  `npm run check`, build, package, browser, showcase, Magic layouts and accuracy
  checks passed on v76. The review page remains local and outside the repository.

### The Dark measured crescent and shared study runner (v77)

- Freeze **122 ordinary printings** (119 distinct cards), eighteen calibration
  examples across W/U/B/R/G/gold/artifact/land and **104 reserved validation
  printings**. All scans/art and components are cached. Both baseline and final
  captures contain all 130 faces at both tiers, including eight controls; no
  missing references or rendering failures. Use explicit Oracle wording with
  original symbols, without claiming original-printing text alignment.
- Eight calibration scans have stable native dark-ink bounds. Their median
  dimensions are **20.923 × 18.635**, right edge **445.058**, center Y **397.212**.
  Ten calibration scans remain uncertain. The original rendered crescent was
  around **19.333 × 19**, starting near **416, 382**; it was roughly nine pixels
  left and six pixels high. Crop the existing pinned vector and use one profile:
  **21 × 18.5**, right **445**, center Y **397.25**, with no added outer rim.
- Actual final inspection ink is approximately **20.667 × 18.667**, starting
  **424, 388**. Seven stable calibration pairs have median absolute width/height
  differences **.256/.359** px. Full-set reference measurement finds 56 stable
  bounds and retains 66 uncertain rows. Native scan pixels are about .65
  canonical px; no subpixel precision or per-scan alignment is claimed.
- Full-set median symbol-region F1 improves **.275 → .434** at inspection and
  **.245 → .478** at table size; Census **.490 → .652** and **.458 → .665**.
  Reserved validation follows the same pattern: **.275 → .435** and
  **.245 → .491** F1. 103 printings improve by more than .02 at both sizes;
  nineteen remain within that band, with no edge regressions beyond .02.
  Every changed pixel stays within the symbol envelope, all typography is
  byte-identical, and all eight controls remain byte-identical.
- Keep four inspection Census regressions: **Ashes to Ashes, Frankenstein's
  Monster, Murk Dwellers and Nameless Race**. Black-frame crescents nearly vanish
  against the much darker rendered frame; their regional scores are the weakest.
  Frame texture, rules-box placement, artifact/gold/land panels and fine crescent
  contours remain visible review items. Do not adjust individual symbols to
  compensate for these frame/background differences. The local page retains
  these examples, the stable bounds, strongest changes and all 122 score rows.
- Also flag the Gaea's Touch **77†** reference for verification. Scryfall marks
  it as a variation, and the cached image shows different title/type/credit
  typography plus a smaller crescent farther left. This does not establish a
  new rendering profile: verify the reference first. Keep it in all 122 scores;
  `drk-symbol-review.json` records the image hash and visual finding without
  changing geometry or hiding the result.
- Introduce shared `symbol-study.mjs`, `symbol-study-templates.mjs`,
  `symbol-study-bounds.mjs` and `symbol-study-audit.mjs`. A set recipe freezes
  calibration and controls; a separate native segmentation profile and adoption
  plan freeze measurement and geometry. Unsupported adapters and failures stay
  in coverage. Match blank templates by removing glyph and derived opaque
  backing. Audits verify identities, profile hashes, full-card pixel containment
  and controls; native measurement/comparison stays CPU-only.
- Reproduce with `symbol-study.mjs drk after`, `symbol-study-bounds.mjs drk after`
  and `symbol-study-audit.mjs drk after`. Historical before/candidate/template
  captures retain their original source/method hashes. Required check/build,
  package, browser, showcase, Magic-layout and accuracy suites pass on v77.
  Review HTML remains outside the repository.

### Fallen Empires crown and detached-foot measurement (v78)

- Freeze all **187 ordinary printings** (102 distinct cards), including alternate
  artwork. Eighteen predetermined calibration printings cover W/U/B/R/G,
  artifact and land; reserve **169 validation printings**. All references and
  components are cached. Both captures contain 195 faces at both tiers,
  including eight unchanged controls; no missing references or rendering
  failures. Oracle wording with original symbols is explicit.
- Extend native component measurement with a declared `componentGap`: the
  crown's detached foot otherwise disappears from its height measurement.
  Group within two canonical pixels without expanding the original ink bounds;
  a group touching the window boundary remains invalid. Add rendered foreground
  selection after exact blank subtraction so the white rim does not inflate a
  black-ink measurement. Numerical tests cover multiple resolutions, excluded
  distant parts, grouped frame contamination and separate rim/ink bounds.
- Seven calibration references are stable; eleven remain uncertain. Median
  reference black ink is **19.615 × 15.692**, right edge **441.135**, center Y
  **390.673**. Original rendered ink is about **20.333 × 16**, starting at
  **415, 383.333**, roughly six pixels too far left. The first cropped candidate
  rasterized about one pixel too small on each axis; preserve its adoption plan,
  capture and measurements, then correct only from the calibration ink bounds.
- Final shared nominal geometry is **20.75 × 16.75**, right **441.75**, center Y
  **390.75**, using the existing vector crop and one-pixel white rim. Actual
  inspection black ink is **20 × 15.333**, starting **421.333, 383.333**. Median
  paired width/height errors are **.385/.359** px, below the roughly .65 canonical
  px native scan pixel. Full-set measurement retains **77 stable references and
  110 uncertain rows**, with the same reference median as calibration. No
  per-scan transform or subpixel precision claim.
- All **187 printings improve by more than .02 edge F1** at both sizes. Median
  inspection F1 **.375 → .695**, table **.373 → .653**; Census **.514 → .818** and
  **.462 → .783**. Reserved validation gives **.375 → .695** and **.374 → .653**
  F1. No edge or Census regression flags. All changed pixels stay inside the
  symbol envelope; every type line and all eight controls stay byte-identical.
- Remaining review: crown line thickness, rim tone and the gap above its foot
  differ slightly. Lands have the weakest regional scores, especially Rainbow
  Vale, Ruins of Trokair, Dwarven Ruins and Svyelunite Temple. Their frame rails
  and stone texture differ from the current generic seventh-edition land asset.
  Other colors and artifacts also show texture, bevel and rules-box differences.
  In the frame pass, compare existing frame-family choices before treating these
  as requirements for new assets; do not compensate through symbol placement.
- Shared study scripts now support named calibration revisions such as
  `candidate-raster`, and reject overwriting captures from another renderer
  revision. Blank templates require the recorded baseline source. Original and
  corrected candidate hashes remain linked in the adoption plan. Local review
  HTML includes annotated native bounds, full cards and red/green overlays;
  images and HTML remain outside the repository.

### Source-frame selection before color calibration

- User priority: pick the best existing old-frame family per set/material before
  applying HSB. Cover all old-frame groups in the 50-card-cutoff inventory.
  Preserve typography while evaluating alternative source plates.
- Retain per-color HSB rather than one adjustment per set. Use the same transform
  for frame and text-box paper; mana colors are a separate fitted component.
  The [experiment](hsb-calibration.md) records global/per-color comparisons,
  raster validation and full-inventory color predictions. It remains opt-in.
- Revised green demonstrates a component tradeoff that the combined color score
  can conceal. Resolve source choice and geometry first, then refit; do not
  compensate with per-card colors or split the paper/frame correction again.
- Include the ABU dual-land stripe mask and compatible colored land plates in
  source evaluation. Revised land geometry differs and requires review.
  [Source research](frame-asset-research.md) records provenance and limitations.

### Revised Lightning Bolt: contaminated art crop and stale ranking

- The Scryfall art crop includes the pink left bevel and its keyline, while
  omitting about 6–7 pixels on the right. The same printing's full PNG contains
  that missing artwork. [Reviewed crop metadata](fixtures/accuracy/art-crops.json)
  selects its illustration interior, guarded by both cached source hashes.
  The painter's aperture is unchanged. A replacement scan/crop requires review.
- Reported the source issue through Scryfall's card issue form on 2026-10-12;
  the site confirmed receipt. Alternative Scryfall printings with the same
  illustration ID were checked; Fourth Edition has a cleaner crop, but using
  Revised's own PNG also preserves its print color and grain.
- Source QA should detect continuous frame-colored strips and keylines along
  art-crop edges and compare available same-illustration crops. Flag suspect
  assets for review; do not silently trim every image or stretch the aperture.
- Historical body scores cannot rank current previews. A review comparison must
  bind the renderer/adapter, exact wording and assets, and shared registration
  hashes. Score the exact normalized scan displayed in the overlay. Rejected
  registration remains visibly unaligned, never a certified identity transform.
- Register scan translation and uniform scale against the actual rendered stock
  transitions independently of text. Current comparisons store per-scan fits;
  the earlier shared-only registration is historical evidence. Keep opposing
  residual edge errors as asset geometry issues; never use text to fit its own
  comparison transform.

## Special-frame validation after 0.2.15

The [special-frame audit](special-frame-audit.md) captures 26 printings / 29
physical faces, starting with all 14 ordinary Dominaria Sagas. All render, but
all fail the existing ordinary-frame registration gate; numeric accuracy remains
unscored. Saga reminder/chapter geometry, rail/paper compositing and Read ahead
styling are first. Split-era routing, Fuse duplication, aftermath proportions,
Room layout and physical DFC indicators/back-face treatments follow. No runtime
calibration was adopted from these unaligned examples.

### Special-frame queue after the Saga release

Saga improvements shipped as 0.2.16. Continue one family at a time, with
original wording, immutable before captures, cached full scans/art, and
frame-only normalization before component metrics:

1. Aftermath: all 15 AKH and 10 HOU ordinary nonfoil printings. Dedicated pinned
   CardConjurer plates and shared art/effect apertures; preserve failed scan fits.
2. Old-border/2003 split and Fuse now have dedicated plates and a 35-card
   INV/APC/DIS/DGM study; see [results and limitations](split-layout.md). M15
   now has native hybrid/gold plates and a GRN/RNA study, plus a modern Fuse
   cohort from GK1/CMR/DMC/MOC. CardConjurer's M15 split/Fuse plates
   cannot stand in for APC old-border or DGM 2003-frame stock. MSE provides
   `magic-old-split`, `magic-new-split`, `magic-new-split-fuse` and
   `magic-m15-split-fusable` source styles. Validate shared art sheet cropping,
   joined border geometry, per-half credits and one Fuse reminder strip.
3. Adventure shipped in 0.2.19: native plates, independent materials, measured
   typography and 111 ordinary ELD/WOE/CLB comparisons. See the
   [retained limits and rejected fits](adventure-layout.md).
4. Prepared now has a distinct native painter and 36 ordinary SOS comparisons,
   with independent right-inset materials and scan-verified original wording.
   See [validation and remaining limits](prepare-layout.md), including seven
   rejected black-card fits and typography outliers. No per-card tuning was
   installed; SOS paper calibration and Nyx treatments remain follow-ups.
5. Rooms: dedicated CardConjurer `packRoom.js` / `packRoomUB.js`; replace the
   generic split fallback with continuous art, shared type/reminder strip and
   asymmetric rules panels. DSK is the initial validation set.
6. Battles: CardConjurer `packBattle.js` and MSE
   `magic-m15-mainframe-battles`; validate landscape front, defense badge and
   independent reverse physical face on MOM.
7. Transform and modal DFC: explicit front/back plates, indicators, color
   markers, reverse hints and other-face banners. Preserve the ISD, ZNR and NEO
   audit examples; do not reuse a front scan or art image on the reverse.
8. Class and level-up creatures: existing painter branches need source-led
   replacement and scan validation, including level bands, costs and statistics.
9. Kamigawa flip and meld: opposing text orientation and combined reverse faces
   require dedicated geometry, art bounds and physical-face identity.
10. Prototype and Omen inset layouts; audit material variants such as Vehicles,
    Nyx enchantment creatures, devoid and snow separately from ordinary stock.
11. Tokens, emblems and nonstandard formats (planes, schemes, conspiracies and
    related extras). Inventory each explicitly rather than treating ordinary
    fallback output as validation. Showcase/borderless treatments remain deferred.

The dedicated review browser remains separate from the library. Add supported
input/routing/scoring only after each family has its own validated geometry.

## Released Revised frame evaluation (0.3.12)

The [paired component report](fixtures/accuracy/revised0312-live-metrics.json)
uses the same independently normalized scans and source eligibility for both
0.3.11 and 0.3.12. Across all **304 accepted Revised scans**, structural match
rises **59.30 → 76.63 / 100**: 279 nonlands improve, 25 lands are unchanged, and
none regress. Every released-browser component score and coverage matches the
native candidate. Two uncertain scan poses remain excluded.

The comparison's lower-art rim window moved down five pixels to include the
measured y=374 aperture edge and its border. Its old crop ended above the rim,
incorrectly making Disenchant, Circle of Protection: Black and Steal Artifact
low-signal cases. Scan poses and renderer pixels did not change for this metric
correction. Planar remains 81.57 / 100 over 156 accepted scans; all 162 single-face
capture results preserve their 0.3.11 scores, coverage and normalized pixels.

### Integrated for 0.4.1: foil fixes

Merged `codex/continuous-foil-lighting` (`f17bffa`), including `aa8b277`
(preserve set-symbol ink in etch/emboss masks) and `a6badc5` (common contours
for rarity overrides). Foil-continuity and symbol-mask/material regressions
are now part of CI. The release refreshes both showcase animations.

### Black-level calibration across active HSB profiles

[Reproducible numeric evidence](fixtures/accuracy/printing-blackpoints.json)
records all 37 sets with active pigment profiles: 1,037 sampled cached nonfoil
printings, 1,021 accepted reference-bound frame poses and 16 excluded poses.
Twelve new interior curves pass independent calibration/reserved-card checks.
Their reserved shadow RGB RMSE falls from 13.26 to 6.64 byte units (about 50%).
This is a regional color error, not a whole-card accuracy percentage.

Eighteen set-level outer-stock targets are accepted separately. Alpha/Beta
retain neutral charcoal distinct from their interior ink; white borders keep
their existing treatment. The five approved PLC colorshifted curves replay
pixel-identically. Native source masks and edge-connected stock selection keep
bright bevels, alpha and illustration interiors unchanged. Derived materials
are cached by source, dimensions and all adjustment parameters; no extra
animation-time readbacks or decoding are introduced.

Keep existing values for the 32 material cohorts with insufficient independent
scans and for candidates that fail validation. Stock measurements describe
Scryfall's displayed scan margins, not physical printed ink. Unlimited has no
active HSB profile in this renderer and is not included in the 37-set claim.
Review typography, geometry and remaining pigment differences separately.

### PLC colorshifted heading weight

[Native heading evidence](fixtures/accuracy/planar-heading-weight.json) uses one
shared 0.5 px outline subtraction on white names and type lines. Existing Matrix
advances, size, positioning and shadow geometry remain. Calibrated PLC heading
shadows share the measured outer-stock black; uncalibrated inputs retain black. Glyph preparation uses
a small temporary canvas during static composition, without pixel readbacks.
MSE Matrix Medium was rejected because its changed letter proportions reduced
reserved-card overlap even after a shared width fit.

Across 29 reserved cards, name overlap improves 76.67 → 77.22 and type overlap
74.21 → 74.54. Median excess normalized ink coverage falls from 26% to 5.3%
(names) and 27% to 3.6% (types). All 44 native samples preserve pixels outside
the heading bands and preserve alpha. Some individual type-line edge scores
still regress slightly; these are regional metrics, not whole-card scores.
