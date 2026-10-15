# Existing old-frame source candidates

## Early expansion source review, 2026-10-15

The Legends review reopens the earlier retain-current decision below. The
Seventh family is too broad a fallback for early expansions, and the current
Legends gold plate has visibly smoother texture than the printings. Compare
ABU, Fourth and the existing Revised crop before fitting typography or HSB.

The [new source study](fixtures/accuracy/early-frame-source-review.json)
contains 72 Legends cards selected before measurement, split equally between
calibration and validation, plus 48 additional visual examples. Each source
shares the same frozen scan poses. Signed grayscale boundary profiles fit one
scale and translation per material; they do not fit scans to candidates or
reward matching hue/saturation. The other five sets—Arabian Nights,
Antiquities, The Dark, Fallen Empires and Ice Age—currently have visual transfer
controls only, not validated alignment measurements.

| Legends material                 | Selected source on the Legends branch                                               |
| -------------------------------- | ----------------------------------------------------------------------------------- |
| White, black                     | ABU: best held-out boundary result among these sources                              |
| Blue, red, green, artifact, land | Fourth: best held-out boundary result                                               |
| Gold                             | Fourth: printed grain is much closer; current gold still wins boundary-only scoring |

The gold case must not be hidden in a combined average. Its current source
scores 0.872 on held-out boundary cosine versus Fourth's 0.825 after fitting,
while the exploratory grayscale texture-spectrum distance is 1.010 versus
0.464 (lower is closer). The latter agrees with visual review but also responds
to halftoning and resampling. It is a diagnostic, not a new published accuracy
metric. Neither number is a whole-card accuracy percentage.

The existing Revised land crop does not transfer unchanged to all materials.
The alternative Card Conjurer Legends plate and MSE classic gold were also
visually inspected; neither supplies the grain visible in Fourth's plate.
Card Conjurer additionally has set-specific early land variants worth retaining
as controls when source colors and paper treatments are compared.

The study now uses the production 768-pixel asset decode width, superseding the
initial native-resolution comparison. Native alpha defines the art apertures;
the Fourth gold opening needed a small correction. All 83 ordinary Legends
examples reproduce the chosen geometry pixel-for-pixel in the production
painter. Actual held-out boundary cosines range from 0.646 (land) to 0.885 (red);
gold reaches 0.843. These are boundary diagnostics, not whole-card scores.

The [Legends color study](fixtures/accuracy/legends-colors.json) fits frame and
paper separately on the same 36 calibration cards, then checks 36 held-out
cards and ordinary production exports. It limits highlight clipping and rejects
improvements in median color that worsen shadow chroma, shadow lightness or
texture contrast. Black, red and gold retain their outer-frame colors; their
paper corrections pass. Adopted frame/paper corrections have actual held-out
component errors below 5 Oklab units. The land texture uses bounded RGB channel
gains: hue/saturation correction alone amplified its colored flecks and turned
its gold outlines lime. Source pigment masks now isolate the art and paper
outlines, preserving adjacent gray bevels and black keylines. The
[outline study](fixtures/accuracy/legends-land-pins.json) fits four land cards and
checks four held-out cards with the same frozen scan poses. Actual held-out land
frame color error falls from 9.74 to 2.68 Oklab units. Outline errors fall from
7.10 to 2.39 around the art and from 11.46 to 2.23 around the paper. These masks
and channel gains apply once during cached bitmap preparation. Source grain and
boundary mismatches remain visible; color correction does not repair them.
Irregular black/green masks preserve
shadows crossing the paper edge. Profiles bind to exact source URLs and geometry
and use the existing derived-material cache; no animation-time fitting is added.

The [title study](fixtures/accuracy/legends-titles.json) uses the same frozen
72-card cohort. Gold and other materials independently choose a shared shift of
18.5 canonical pixels left and 6 up. Actual painter replay improves every held-out
title: mean two-polarity edge F1 rises from 0.637 to 0.745 for gold and from 0.640
to 0.728 for the other materials. Font size and width still need review; these
title-only diagnostics are not whole-card accuracy scores.

Source, geometry, color and title changes are on the Legends branch, not released.
Next are mana, type, set-symbol, rules, artist and P/T calibration. Validate
transfer before changing other sets. External images remain in the private
reference cache and review page; the public showcase is unchanged. Fitting and
boundary scoring run on the CPU; browser captures prepare the rasters. These
measurements do not represent GPU completion time.

The first comparison is recorded in
[family results](fixtures/accuracy/old-frame-family-results.json): 35 source
plates, 2,767 cached full scans, 717 set/material/layout/stock groups across
63 major sets. The coverage inventory contains 13,603 printings; the comparison
is a sample study, not a full rerender of that inventory.

**Decision: retain the current source families for this color-calibration round.**
No alternative passed every admission check. Thirty-six groups support retaining
the current asset; 681 need further review because of sparse cohorts, weak or
ambiguous borders, region regressions, or unsettled scan registration. The
current family ranks first for 21 of 24 early-set nonland materials. Alpha
black's Fourth candidate does not transfer to reserved cards; Beta green's
Fourth candidate improves the combined score but regresses individual borders.
Unlimited red lacks enough usable structural regions.

The metric compares signed grayscale gradients and local intensity ordering.
All candidates share the intersection of their opaque frame pixels, eroded by
two canonical pixels, so internal artwork cannot win the comparison. Missing
candidate edges score zero on reference-defined support. Three fixed strips
per edge and separate calibration/reserved names limit text/texture interference.
This replaces an exploratory dark-keyline detector: some frame edges are light,
and strong interior artwork could steal its peak. These are structural scores,
not percentages of whole-card accuracy.

Only 26 of 66 shared set/frame/stock registration groups passed the independent
outer-anchor checks. The early sets retain raw normalized scans: their outer
frame proportions disagree with the fixed target by 2.8–4.3 pixels vertically.
Do not disguise a real frame-proportion difference as a per-scan warp or loosen
registration gates to force an asset winner. Review candidate gains for Arabian
Nights, Legends and Collector's Edition alongside their border regressions.
Typography remains tied to printing policy; no source switch has changed it.

Reproduce with `old-frame-cache.mjs`, `old-frame-templates.mjs`,
`old-frame-measure.mjs`, and `old-frame-select.mjs` in `tools/accuracy/`.
Source plates are captured once in Canvas; all scan measurement and selection
run on the CPU without Chromium. Detailed per-scan profiles stay in the local
cache, while source/method hashes and aggregate candidate scores are committed.
This measures image structure, not CPU submission or GPU completion time.

## Most useful existing asset

The pinned Card Conjurer collection already contains
[`old/abu/dualLand.png`](https://github.com/Investigamer/cardconjurer/blob/2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/dualLand.png),
a 1500 × 2100 alpha mask for alternating nested land bands. The
[ABU pack definition](https://github.com/Investigamer/cardconjurer/blob/2fcddba8966156d484cedf54d8214996748dd5e1/js/frames/packABU.js)
associates it with the neutral and five colored land frames. Composite two
colored land assets through its alpha; its blue RGB is mask visualization,
not printed blue ink. Validate both color ordering and geometry against scans.

This explains the missing stripes in our duals: the current painter chooses a
single generic land frame for a card with two basic-land types. Oracle and
original-wording views must retain the same semantic land palette, even when
the printed type line is only "Land". Avoid substituting color identity for
printed frame colors on arbitrary utility lands.

The Fourth directory has a neutral land asset but no five colored-land assets.
The Seventh directory has those colored lands. ABU and Revised dual scans do
not have identical art-window geometry, so adding the ABU overlay alone does
not certify Revised alignment. Test this as part of source selection before
recalibrating land colors.

## Other source collections inspected

- [Magic Set Editor Full Magic Pack, ABU style](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/tree/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old-abu.mse-style)
  has 750 × 1054 card JPEGs, separate alpha/land blending masks and historical
  symbol resources. The inspected textures appear closely related to the
  current source family; no demonstrated quality improvement yet. Its art
  overlay is a halftone layer, not a replacement bevel/shadow component.
- [Proxyshop's template manifest](https://github.com/Investigamer/Proxyshop/blob/9be3f1a4058f09fd5eedc890ee27f0e665c6b25c/src/data/manifest.yml)
  lists layered Classic and Classic Remastered templates. Their previews target
  later old-frame styling; they are candidates for later geometry/asset work,
  not established Alpha–Revised replacements. Full PSDs have not been evaluated.

White-card texture was visually confirmed to match the existing asset. Remove
it from replacement candidates. A difference in measured contrast spread is
insufficient evidence of a different texture.

Downloads stay in the local cache/review workspace. Do not add these external
images to the public showcase or README. Inspect provenance and redistribution
terms before adopting assets from a new collection; repository code licensing
does not establish rights to every contained card-frame image.

## MSE and Card Conjurer investigation, 2026-10-13

Calibration was paused for this investigation. No renderer, source selection,
calibration profile, or asset URL was changed. The findings below identify
candidates; they do not establish scan-accuracy improvements.

### Sources and revisions

| Collection                                                                 | Inspected revision                         | Main value                                                            |
| -------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------- |
| [Full-Magic-Pack](https://github.com/MagicSetEditorPacks/Full-Magic-Pack)  | `16f1d13bb7f5924613fc1ddc25da582beccfefb6` | Layout rules, shared modules, historical and special frame families   |
| [Investigamer/Card Conjurer](https://github.com/Investigamer/cardconjurer) | `2fcddba8966156d484cedf54d8214996748dd5e1` | Existing pinned source; many assets remain unused by our pack         |
| [joshbirnholz/Card Conjurer](https://github.com/joshbirnholz/cardconjurer) | `33f2547137fe366b40e9e8dba4eb591af190fddf` | Preferred additional source for current frames and styled set symbols |
| [shopglobal/Card Conjurer](https://github.com/shopglobal/cardconjurer)     | `f9b854c728ca0efd44097e9da52a009f0fc4dafb` | Older 2018 implementation and component library                       |

Josh's [publish workflow](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/.github/workflows/publish.yaml)
syncs `master` to the `cardconjurer.app` S3 bucket. Its frame menus match the
live site. The live `img/frames/m15/new/w.png` sample was downloaded through
the browser and matched the existing pinned archive byte for byte:
SHA-256 `8f14e393efdc056cf86a3942a923e89a096f6840d5843d642a4723a319090dff`.
This verifies that sample, not the entire deployment revision.

Complete GitHub tree inventories, with no truncated responses, found 2,018
added frame-image paths and 283 changed existing paths in Josh's revision
relative to our pin. This count covers PNG/JPEG/SVG/WebP under `img/frames/`,
excluding filenames containing `thumb` or `sample`; masks, custom frames, and
variants count as files, not distinct official frame families. There are 121
new `js/frames/pack*` files. Changed bytes alone do not establish changed
appearance or better accuracy.

The same frame paths and blob hashes were present in AModSoul's default branch
at `d3c6706692898d596ec6a5be0be44f63062c9e12`. Its unmerged feature branches
were not exhaustively inspected. Boffo90, thedeveloloper and rssilver had no
different frame-asset content at their inspected default heads despite recent
push dates. Pixel64 added 16 frame files. This was a targeted fork survey,
not an exhaustive audit of every fork.

### Layout techniques worth adopting

MSE separates game fields (`.mse-game`), styles (`.mse-style`), shared code/assets
(`.mse-include`), and symbol fonts. The inspected pack has 366 Magic-named style
packages, including deprecated and custom designs; that is not a count of
official frame families. Use `magic-m15-altered.mse-style` (M15 Main), not the
deprecated `magic-m15.mse-style`, when studying current ordinary layouts.

- **Explicit composition order.** The [modules guide](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/blob/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-modules.mse-include/readme.txt)
  distinguishes art, frame, trim effects, pinlines, border, movable plates,
  watermark/ability backgrounds, attachments, text, overlays, and corners.
  This makes interactions such as Nyx plus Adventure or DFC plus crown explicit.
- **Measured dependencies.** [M15 Main](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/blob/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-altered.mse-style/style)
  reserves title width from measured mana width and type width from measured
  rarity width. Its prototype components use measured content dimensions.
  These are useful constraints, though some other decisions still use character
  counts and manual overrides.
- **Separate spacing controls.** The [engine's style contract](https://github.com/twanvl/MagicSetEditor2/blob/master/doc/type/style.txt)
  distinguishes wrapped lines, explicit newlines, paragraph separators, minimum
  padding, and bounded expansion of line spacing. Text masks define irregular
  usable areas. This is directly relevant to crowded flavor text and loyalty
  indentation, without requiring us to replace Canvas typography.
- **Attachments follow text layout.** The [shared game script](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/blob/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic.mse-game/script)
  obtains loyalty ability bounds from measured text blocks and derives stripes
  and badge positions from those bounds. Colons are separate Beleren Bold text
  fields in the loyalty module. This is a reference implementation, not proof
  of the font used on every physical printing.
- **Preserve edge shapes when resizing.** The [Saga style](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/blob/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-saga.mse-style/style)
  uses nine-slice resizing for selected components: corners/endcaps stay fixed
  while the middle grows. The loyalty stripe builder does this too. Selective
  resizing is a better candidate than stretching a complete textured frame.

MSE does not supply a universal historically accurate centering rule. Its ABU
template defaults to never centering; its optional short-text rule checks for
no explicit newline, no flavor, and at most two measured lines. It would not
replace the per-printing work already done here.

Card Conjurer packs are executable JavaScript containing frame-image choices,
mask lists, normalized art/symbol bounds and text presets. Its compositor blends
masked layers, applies opacity and optional HSL, and measures words while
shrinking overflowing text. The useful extraction is the asset/mask metadata
and layout relationships. Do not import its DOM-dependent editor into the pack
or move its image readbacks into the animated rendering path. HSL controls are
also not equivalent to our calibrated HSB parameters.

### Asset candidates

| Candidate                                                                                                                                                                 | Verified file evidence                                                                                     | Relevance                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [Card Conjurer Accurate Frames](https://github.com/joshbirnholz/cardconjurer/tree/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new)                            | Sample white plate and component masks are 2010 × 2814                                                     | Ordinary modern alternative to our wingedsheep components; already present in our pinned archive      |
| [Updated Eighth Edition](https://github.com/joshbirnholz/cardconjurer/commit/ad3b19809c9352a6f67cef41121ff3451a533c18)                                                    | White plate changed from 1500 × 2100 to 2010 × 2814 in November 2025                                       | Real additional family candidate for 2003-era modern frames                                           |
| [Rooms](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/js/frames/packRoom.js)                                                 | Dedicated plates, half masks, rotated text presets                                                         | Our current split painter has no dedicated Room branch despite an older README table mentioning rooms |
| [Battles](https://github.com/joshbirnholz/cardconjurer/tree/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/battle)                                               | Inspected Card Conjurer plate is 2814 × 2010; MSE sample is 523 × 375                                      | Missing landscape layout, defense region, and reverse-face reminder                                   |
| [Current pack catalog](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/js/frames/groupStandard-3.js)                           | Prototype, mutate, Case, Omen, Prepare, Station, flip and DFC variants; creature Sagas in the Saga catalog | Missing dedicated layouts/treatments or more complete alternatives to existing layouts                |
| [MSE old gold](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/blob/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/mcard.jpg)                   | 375 × 523 JPEG, visibly different rules-box bevel shading                                                  | Candidate for the old gold bevel problem; texture and resolution need scan validation                 |
| [MSE ABU](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/tree/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old-abu.mse-style)                              | White plate and blending masks are 750 × 1054                                                              | Additional blending reference; not demonstrated to improve our existing ABU plate                     |
| [MSE historical Future Sight](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/tree/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style)           | Separate card, textbox, typeline and PT assets; inspected white JPEG is 375 × 527                          | Missing family; Card Conjurer also has `packFutureRegular.js`                                         |
| [MSE Mystical Archive](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/tree/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-showcase-strixhaven.mse-style) | Inspected white card component is 744 × 1039                                                               | Later special-treatment support                                                                       |

Josh's ABU, Fourth and Seventh source assets are unchanged from our pin. More
recent repository activity does not provide another early-frame replacement.
Shopglobal's inspected M15 white plate is 375 × 523; prioritize it as historical
reference rather than a resolution upgrade. MSE's old/Portal samples are also
375 × 523, and its ordinary shared M15 sample is that size. Higher nominal image
dimensions alone do not prove more source detail.

The ABU alternating-band mask is still useful for duals. MSE provides
`alpha_blend.png` and `land_blend_card*.png`, with scripted choices between
colored land plates and neutral land areas. No inspected file has yet been
validated as the exact missing **Revised dual rules-box treatment**. Custom
dual-land templates must not be mistaken for historical printing references.

### Styled set-symbol library

Josh's [official-symbol directory](https://github.com/joshbirnholz/cardconjurer/tree/33f2547137fe366b40e9e8dba4eb591af190fddf/img/setSymbols/official)
has 2,537 SVG files, compared with 1,835 files in our pinned archive (1,767 SVG
and 68 PNG). There are 770 added paths, 26 changed retained paths and 68 removed
PNG paths. Counts include rarity variants and watermarks, not unique sets.

This is a separate candidate from the Keyrune silhouette source currently used
by our renderer. Inspected `tmp-c.svg` has explicit white and black contour
paths; `exo-r.svg` includes a gold radial gradient and outline geometry. WAR,
M21, Arabian Nights, Legends and Stronghold also have styled variants. These
could reduce the need to reconstruct outlines and metallic fills ourselves.
Check their visible bounds, historical treatment and contour accuracy against
normalized scans before adoption; fictitious rarity variants exist even for
sets whose original symbols did not encode rarity.

This library is not uniformly new: many inspected historical variants are
already in our pinned Card Conjurer archive but unused. MSE's rarity module
mostly applies customizable fills/borders to a supplied set symbol; this audit
did not find an equivalent comprehensive historical symbol collection there.

### Availability and provenance

The images and masks are ordinary files in the repositories; MSE does not need
to be installed or run to retrieve them. Asset URLs can be pinned to revisions
just as our current references are. Keep source repository, path, blob/content
hash, native dimensions, alpha or luminance mask semantics, visible bounds,
credit, and known reuse terms with each admitted source.

There is no repository-wide license file in the inspected Full-Magic-Pack or
modern Card Conjurer forks. Full-Magic-Pack has an MIT license specifically
inside `magic-m15-bigtext.mse-style`; that is not evidence of a pack-wide grant.
The modern Card Conjurer [notice](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/legal/index.html)
credits several frame contributors, identifies third-party game imagery, and
describes personal/noncommercial service use. Shopglobal has GPL-3.0 code and
a separate [asset disclaimer](https://github.com/shopglobal/cardconjurer/blob/f9b854c728ca0efd44097e9da52a009f0fc4dafb/Disclaimer.txt)
that describes some material as CC BY-NC-SA 2.5. Availability is established;
blanket asset redistribution permission is not. Preserve these distinctions
when selecting assets, especially fonts. No external binaries were added here.

### Recommended follow-up after the pause

1. Test the styled Tempest, Stronghold, Exodus, WAR and M21 symbols against
   our current silhouettes/treatments with the stored scan normalization.
2. Compare Accurate M15 and the updated Eighth Edition plates against current
   components across several sets. Keep geometry scoring separate from color.
3. Compare MSE old gold shading and dual blending on a small historical sample;
   retain the existing early plates unless an alternative earns admission.
4. Introduce typed layout definitions within the Magic pack: native dimensions,
   regions, masks, attachments, text constraints, and explicit supported
   combinations. Start with Battles and Rooms, then prototype/mutate and DFC
   treatments. Keep game definitions out of the neutral renderer.
5. Preserve our cache strategy: prepare/decode/mask/recolor once per immutable
   asset/profile key. Use selective resizing only for known stretchable regions.
   If a frame source changes, remeasure frame geometry, HSB and dependent
   placements; stored scan transforms must retain their target/source hashes.

These sources supply assets and design references. They do not replace scan
normalization, original-printing text, or our accuracy measurements.

### First asset import and font comparison (2026-10-13)

The Magic pack now has an explicit `frameAssetFamily` option for the updated
Eighth Edition and M15 Accurate base plates. Geometry, art windows, border
masks and P/T badges switch together. Existing component frames remain the
default; the calibrated retro families and their HSB policies are unchanged.
The new source uses commit-pinned GitHub raw URLs: jsDelivr returned HTTP 403
with its 50 MB package-size restriction for uncached files from this repository.

A generated inventory covers **1,880 styled rarity vectors in 383 sets**.
Complete vectors bypass Keyrune cropping, recoloring and added outlines.
Reviewed historical/M15/M19/M20/M21/WAR profiles remain on their existing source
unless explicitly selected for comparison. Missing exact rarity files fall
back to Keyrune; custom URLs retain their own colors. Original showcase assets
and the game-neutral renderer are unaffected.

The local review contains 15 scan/current/styled-symbol/replacement-frame
examples, including Eighth/Ninth/Tenth, M15, M19, M21, WAR, WOE and TDM, plus
dual lands. This is asset acceptance work, not a new set-alignment calibration.
Review candidates still include core-set rarity treatment (particularly
Eighth/Ninth), frame borders, P/T and footer sizing, modern legendary crowns,
and colored spell pinlines. The new base plates do not yet supply those crowns
or spell pinlines. Revised dual-land paper remains unresolved.

Twenty font files from the current pack, Card Conjurer and Full Magic Pack were
loaded and inspected. The [font study](fixtures/assets/font-import-study.json)
compares 19 body-text examples and 15 title examples across 23 cards. Within a
comparison, the text, layout settings, frame and scan transform remain fixed.
A separate diagnostic permits a small translation only. Header fonts are
registered across the requested weights to avoid synthetic bold.

| Candidate                 | Result in this exploratory sample                                                                                                    | Decision                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| Card Conjurer Matrix Bold | All four 2003-frame titles improve; the two passing frame normalization improve by an average **6.41 percentage points** of edge F1. | Use in the optional Eighth Edition family. |
| Card Conjurer MPlantin    | Mean body delta +0.076 points across 19 samples; only +0.010 points on the three normalized samples.                                 | Keep current body default.                 |
| MSE MPlantin              | Mixed wrapping/shape changes; mean body delta −0.167 points.                                                                         | Retain as a candidate, no global switch.   |
| Plantin Semibold          | Four gains and eight regressions larger than half a point; mean −5.19 points.                                                        | Do not promote globally.                   |
| Card Conjurer Beleren2016 | No material win on the 11 modern titles; mean −0.109 points. None pass the frame-normalization gate.                                 | Keep existing Beleren.                     |

Only five of the 34 region comparisons pass the strict frame-only normalization
gate. Other scores are clearly labeled diagnostic; some card text also differs
from the printing. These results do not establish per-set defaults. The useful
font finding is Matrix for the 2003-era title/type style; further body-font
selection should follow the larger original-wording and aligned-scan study.

The existing Beleren and MSE Beleren have identical tested outlines and advances.
Card Conjurer/MSE medieval outlines also match; the Card Conjurer italic and
medieval files have not changed from our existing pinned source. Merely swapping
those files cannot solve the early-set weight or spacing issues. Small-caps
fonts and treatment-specific families are inventoried for later P/T and special
layout comparisons.

## Replacement plate review: paper and placement

The new dual-land paper initially joined at 47–53% of card width, producing a
visible seam. Its blend now spans 27–73% inside the paper; the colored outer
rails retain their narrow join. Both original textures, grain and inset shadows
remain in place. The local review includes WB, BR, UG and UR lands. The
additional UG example exposed reversed halves: both native plate families now
follow the printed color wheel for RW, GW and GU, with all ten pairs checked.

Frame-family selection no longer implicitly changes set-symbol sources. The
existing reviewed-source policy applies with either family; explicit imported
symbols remain available for comparison. This fixes the M15 uncommon regression
without a new per-rarity branch. Enlarged scans also show inverse coloring in the
imported M15 rare and different numeric-shield treatment in 8ED/9ED. Seven
inspected repositories carry identical M15 files, so switching among these forks
cannot fix the source. The [source audit](fixtures/assets/styled-symbol-source-audit.json)
records blob identities, confirmed findings and remaining review work. This was
a targeted audit, not validation of the entire imported inventory.

Mana and set-symbol placement now have independent family geometry. At 488×680,
M15 costs move left 1 px and up 4 px. Eighth-family costs move left 2 px and down
1 px, with diameter reduced from 23 to 22 px. Both families' symbols move left
2 px and scale to 95%. No card-specific renderer offsets were introduced.

The [calibration report](fixtures/assets/frame-plate-import-calibration.json)
records 23 source pairs, hashes and frozen per-card frame transforms. Eleven
passed independent frame validation; the other twelve have no alignment score.
M15 uses its lower rules-frame boundary because the collector area lacks an
outer bottom rail. The existing fit/validation separation, uniform scale and
bounded rotation/skew policy remain unchanged. Do not fit or score through a
failed normalization.

| Family       | Accepted cards |  Mana edge F1 | Symbol edge F1 |
| ------------ | -------------: | ------------: | -------------: |
| Eighth       |              4 | 80.9% → 88.6% |  91.2% → 92.1% |
| M15 Accurate |              7 | 72.1% → 86.7% |  88.1% → 93.9% |

These are development examples at 1 px tolerance, not corpus accuracy numbers.
Symbol deltas include restoring the reviewed source policy. Every accepted
card's mana score improved. Symbol regressions over two percentage points remain
flagged for 9ED Sengir Vampire, M15 Negate and WOE Glass Casket. Avoid fitting
per-card exceptions to them; examine source shape and wider set cohorts first.

`node games/magic/tools/accuracy/frame-plate-review.mjs CAPTURE_DIRECTORY`
recomputes scores from local `examples.json`, `snapshot.json` and frozen
`*-reference.png`, `*-before.png`, `*-plate.png` captures. It persists
`placement-normalization.json`, rejects changed source/template identities,
and emits normalized references plus red/green overlays. Scoring is pure Node
PNG/geometry work and does not launch Chromium; browser rendering is only used
to prepare source captures. Neither CPU scoring nor capture time measures GPU
completion time. The HTML review and all external images remain outside the
repository and public showcase.

## Styled symbol default and local SVG corrections

Styled Card Conjurer symbols now replace the prior source exemptions for every
available set/rarity. Explicit Keyrune and caller-owned URLs remain supported.
Seven checksum-verified source patches correct the M15 uncommon/rare/mythic
metal/ink polarity and Eighth/Ninth Edition uncommon/rare material topology.
The patch runs once before decoding in the shared encoded-source cache. It does
not add a branch to an animated painter or redistribute vector path data.

The [placement study](fixtures/assets/styled-symbol-placement-calibration.json)
covers 63 captures in nine sets, with 37 accepted frame fits across seven sets. Thirty-five
accepted scans form the development cohort; two additional blue/green M21
scans confirm the selected profile without refitting. Twenty-six frame fits
remain rejected. The symbol region excludes most neighboring frame lines and
uses grayscale edge F1 with one-pixel tolerance. Fit translation, scale,
rotation and skew from frame-only anchors first, freeze the result and source
hashes, then search symbol position and independent horizontal/vertical scale.

| Set | Accepted development cards | Before | After |
| --- | -------------------------: | -----: | ----: |
| M15 |                          4 |  91.4% | 95.3% |
| M21 |                          9 |  71.8% | 95.9% |
| WOE |                          7 |  78.8% | 90.6% |
| TDM |                          5 |  84.1% | 92.9% |
| 8ED |                          3 |  62.9% | 79.6% |
| 9ED |                          4 |  75.1% | 85.1% |
| 10E |                          3 |  95.7% | 95.7% |

These are final full-card raster measurements of the symbol region, not whole-card
accuracy. Candidate search uses a 2× region capture; final verification uses the
ordinary 732×1020 card export, so antialiasing produces slightly different scores.
Both sets of scores are retained in the fixture. No development card regresses
by more than two percentage points in the final raster check.
Profiles are shared per set, with leave-one-out checks; Tenth Edition retains
its placement because its fitted change did not transfer. Replacement plate
profiles must not be applied to the component or retro frame families without
new measurements. The Eighth/Ninth numeral outline weights still need visual
review. Other set symbols remain outside this initial placement cohort.

Reproduce candidate capture/scoring with
`node games/magic/tools/accuracy/styled-symbol-placement.mjs CAPTURE_DIRECTORY [GRID_JSON]`.
The optional grid maps each set code to `{dx,dy,sx,sy}` candidates. Candidate
geometry starts at the unadjusted family bounds, so adoption does not shift a
later search's origin. Source capture uses one cached browser session; score
calculation and report aggregation use Node CPU code. These measurements do
not measure GPU completion time. Combine successive grids with
`node games/magic/tools/accuracy/styled-symbol-report.mjs CAPTURE_DIRECTORY GRID_JSON...`.
The local source capture remains external, and the fixture records the measured
source revision, source hashes, normalization hashes and selected transforms.

Verify normal full-card exports after adopting the profile with
`node games/magic/tools/accuracy/styled-symbol-final-review.mjs CAPTURE_DIRECTORY REPORT_JSON`.
Keep each baseline as `CARD-pre-calibration.png`, the new export as
`CARD-plate.png`, and the frozen frame registration beside the reference scans.
This check records final raster hashes and scores separately from search scores.

## Revised color alternatives after the major-set pass

A color-only recheck of the existing ABU, Fourth and Seventh plates is recorded
in [candidate measurements](fixtures/accuracy/revised-frame-color-candidates.json).
It reuses the normalized Revised development and reserved cohorts from the color
audit, so it is exploratory evidence rather than a fresh admission test.

For green, one shared HSB fit gives median reserved border/paper Oklab errors of
1.33/1.84 for ABU, 11.69/3.39 for Fourth, and 18.17/5.43 for Seventh (lower is
better). ABU also has a more compatible starting brightness balance for white.
This does not settle asset selection: the earlier green structural comparison
favored Fourth (0.604 reserved score) over ABU (0.388), and flagged unsettled
registration for both. Compare color and geometry separately before switching.

The user has reopened separate border/paper calibration as an alternative.
The next comparison uses source-derived masks for green and black, following
the irregular paper boundary and preserving the inset shadow. Compare the
current frame with separate transforms against ABU with one shared transform,
using original wording, full cards and fixed-pose red/green overlays. Masks and
derived colors should be prepared once per immutable source/profile; no scan
segmentation or mask readback belongs in the animation loop. No candidate in
this study changes released frame selection or color defaults.

### Complete Legends type-line review

The original-type review now covers all 310 ordinary English printings: 152
creatures and 158 noncreatures. Forty-two noncreature labels differ from Oracle,
including `Interrupt`, `Enchant World`, `Enchant Creature`, `Enchant Land` and
`Enchant Artifact`. The exact-printing fixture
`fixtures/accuracy/leg/annotations-noncreature-types.json` binds each transcription
to its scan hash. These partial reviews certify only type labels; modern wording
and caller overrides stay independent. Use these original labels before fitting
type-line width or placement, so text changes cannot bias the geometry.
