# Magic drawing pack

This optional pack translates a card's presentation fields into card-glint
recipes: frame and text rasters, art windows, etching sources, and editable
regions. Frame definitions live here so new frames and rendering fixes can be
reviewed in public pull requests. There is no engine, editor or host-app dependency.

**Fan-content and external-asset terms:** read [NOTICE.md](NOTICE.md).
This Magic game pack is unofficial Fan Content permitted under the Fan Content
Policy. Not approved/endorsed by Wizards. Portions of the materials referenced
are property of Wizards of the Coast. ©Wizards of the Coast LLC.

## Use the pack

```ts
import { createRenderer, type CardDocument } from 'card-glint';
import { magic, type MagicCard } from 'card-glint/magic';
import 'card-glint/magic/fonts.css';

const renderer = await createRenderer({ canvas });
const face: MagicCard = {
  name: 'Example Adept',
  typeLine: 'Creature — Human Wizard',
  colors: ['U'],
  manaSymbols: ['2', 'U'],
  rulesText: 'When this creature enters, draw a card.',
  power: '2',
  toughness: '2',
  illustration: '/my-original-art.webp',
  setCode: 'GLINT',
  rarity: 'uncommon',
  frameStyle: 'modern',
  borderColor: 'black',
};
const card: CardDocument = { id: 1, revision: 1, recipe: magic.describe(face, 'inspect') };
renderer.upsertCards([card]);
await renderer.ready(card.id, card.revision);
// Place it with updateScene() and render(), as in the core README.
```

Use `frameColors` when a physical printing uses a different palette from its
rules colors. For example, `colors: ['U'], frameColors: ['G']` keeps the blue
card identity while selecting green frame/panel styling from the existing
assets. Mana symbols are supplied independently. An explicit empty array selects
a colorless palette; omitting the field uses `colors`. The recipe snapshots the
override with the rest of the presentation input. For historical `Summon` type
labels, supply `creature: true` so changing the visible type does not lose that
semantic flag.

For script-only inclusion, use `magic.js` and a stylesheet link to `magic.css`
beside `browser.js` in the browser release or version-pinned CDN tree.
The browser ZIP includes `magic.html`: serve the extracted directory over HTTP
and open that page to edit presentation JSON and inspect the resulting frame.
This optional page fetches external frame/font URLs; the default example does not.
The pack is a separate entry point: importing the core or original showcase
does not import Magic code or fonts. Font/frame URLs are pinned in
[assets.json](assets.json) and [fonts.css](fonts.css); illustrations come from
the caller. A `GLINT` set symbol is the default when no set is supplied.

`opticalDocument(id, revision, face, tone)` splits artwork from printing for
art-only rain, heat and pool treatments. `tone` selects gold, silver or prismatic
reflection on the sharp printed layer. `mtg` remains an alias for `magic`.

## Replacement asset candidates

`frameAssetFamily: 'eighth' | 'm15-accurate'` selects complete Card Conjurer base
plates with matching art apertures, text bounds, border masks and P/T badges.
The default keeps existing calibrated frames. These candidates cover ordinary
modern faces: five colors, gold, artifacts, colorless and lands. Two-color lands
blend the two colored land plates in mana order. Special layouts reject this
option; modern legend crowns and color-pair spell pinlines remain follow-up work.
Eighth Edition loads its Matrix header font only when selected. Frame geometry
also drives GPU art windows, optical layers, hit regions and cache identity.
Prior old-frame HSB and scan-offset profiles are not applied to these assets.

Set symbols now prefer complete styled SVGs where available, preserving their
white details, black outlines and metallic gradients. The
[versioned inventory](set-symbol-inventory.json) lists 1,880 rarity files for
383 set codes. These are the default for all available sets. Use
`setSymbolSource: 'keyrune'` to select the prior source. Frame-family
selection does not change the symbol-source policy. A missing exact rarity falls back to
Keyrune; unknown sets return no symbol instead of requesting a nonexistent file.
Pre-Exodus printings still use monochrome symbols. Host-owned `setSymbol` URLs
and the original GLINT/FORGE marks take precedence and preserve their colors.

The [SVG patch manifest](symbol-svg-patches.json) records local material fixes
for M15 uncommon/rare/mythic and Eighth/Ninth Edition uncommon/rare. Patches
verify SHA-256 before editing fills and outlines, run once before decoding, and
share the pack's encoded-source cache across direct and host rendering. Custom
URLs are untouched. Source bytes and patched SVGs remain external/local; only
transformation code, checksums and provenance are stored here.

The major-set batch adds 219 symbol profiles across 157 sets and four frame
families, plus 17 component-frame inset profiles. Position and independent
width/height adjustments are shared by set, family and stock after per-scan
frame normalization and validation on reserved card names. Uncertain groups
retain their existing geometry. See the [calibration audit](calibration-rollout.md)
and the earlier [plate pilot evidence](fixtures/assets/styled-symbol-placement-calibration.json).

All source URLs include immutable revisions. The new collection uses GitHub raw
URLs because jsDelivr rejects uncached files from this oversized repository. Asset decoding uses the existing
host cache; full plates are bounded to 768 pixels wide during preparation.
No downloading, decoding or masking occurs in the animation loop. The local
accuracy cache stores reference bytes separately from the package. Regenerate
filename metadata with `node games/magic/tools/assets/symbol-inventory.mjs`
(optionally pass a cached Git tree JSON as its first argument).

## Where to make a change

| Change                                                 | Owner                                                                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Card inputs, ordinary rectangles, text sizes           | [face-layout.ts](src/presentation/face-layout.ts)                                                                        |
| Color pairs, artifacts, lands, legendary crowns        | [profile.ts](src/presentation/profile.ts)                                                                                |
| Planeswalker, Saga, Adventure, Class, leveler geometry | [special-frames.ts](src/presentation/special-frames.ts)                                                                  |
| Measured planeswalker ability text and badge rows      | [planeswalker-rules.ts](src/presentation/planeswalker-rules.ts)                                                          |
| Retro frame families, old-set mapping and geometry     | [retro-frame.ts](src/presentation/retro-frame.ts)                                                                        |
| Old/2003/M15 split and Fuse; Room remains a fallback   | [split-layout.ts](src/presentation/split-layout.ts)                                                                      |
| Frame URL selection and symbols                        | [assets.ts](src/presentation/assets.ts), [set-symbols.ts](src/presentation/set-symbols.ts)                               |
| Text wrapping, mana symbols and rules painting         | [canvas-text.ts](src/presentation/canvas-text.ts)                                                                        |
| Face composition and cache identity                    | [canvas-face.ts](src/presentation/canvas-face.ts)                                                                        |
| Visible art bounds, cropping, frame overlap            | [art-apertures.ts](src/presentation/art-apertures.ts), [illustration-layout.ts](src/presentation/illustration-layout.ts) |
| Pack boundary, etching and foil layer placement        | [index.ts](src/index.ts)                                                                                                 |

Geometry is normally normalized `[x, y, width, height]` with a top-left origin.
Typography uses the 488 × 680 reference face. Tier `inspect` paints at 732 × 1020;
`table` paints at 244 × 340. Some layouts override rectangles and wrapping.
These are TypeScript definitions, not a complete declarative frame schema.

Aftermath printings use dedicated native plates and measured rules in each
reading orientation. Set `layout: 'aftermath'` with two `faces`, or use
`layout: 'split'` with an Aftermath second half. Each half can supply independent
art and crop metadata; a parent illustration is treated as the shared split-art
sheet. Native geometry also drives optical and etching apertures. See the
[25-printing comparison and remaining limits](aftermath-layout.md). This does
not validate other split or Room frames.

Old-border and 2003 spell splits use dedicated era plates, per-panel credits,
optional guild watermarks, and one shared Fuse reminder. See the
[split validation and remaining limitations](split-layout.md). M15 spell splits
use high-resolution plates with separate hybrid/gold materials and a shared
footer. Rooms still use the previous fallback; do not reuse split calibration
numbers for them.

Adventure cards use native book plates with separate permanent and inset spell
materials and measured text. Supply `layout: 'adventure'` and two `faces`, ordered
permanent then spell. The parent owns full-card art and permanent identity.
Opt-in `colorCalibration: 'set-hsb-v1'` includes the admitted ELD/WOE spell-paper
profiles; CLB retains its source colors. `collectorFormat` can explicitly select
`number-first` or `rarity-first` for the native Adventure footer. See the
[Adventure comparison and limitations](adventure-layout.md).

Prepared cards have a separate native painter with the creature on the left and
the inset spell on the right. Supply `layout: 'prepare'` and two `faces`, ordered
creature then spell, with the full illustration on the parent. Materials and text
fit independently; legendary two-color crowns and hybrid spell headers retain
their own treatments. See the [Prepared comparison and limitations](prepare-layout.md).

## Contribute a frame or fix

1. Identify the selection rule, geometry and painting owners above. Keep game
   semantics here; do not add Magic branches to the Rust or browser core.
2. Add or update a pinned external asset reference, with attribution here. Do
   not commit third-party frame/font/image binaries or official card scans.
3. Update geometry, art windows and hit regions together. Include a new cache
   key component whenever visible content or a rendering option is added.
4. Add a focused case to the Magic pack tests. Check both raster tiers, art-only
   effects, editable bounds and affected special frames. Use original artwork
   or synthetic fixtures in checked-in evidence.
5. Run `npm run check`, `npm run build`, `npm run test:package`, `npm run test:magic`, and the focused
   browser checks. For a visual change, show before/after images in the PR and
   identify the browser; Safari and Chromium do not always rasterize alike.

The library owns caching and graphics resources. Painting happens during recipe
preparation; pointer movement and finish changes should reuse prepared assets.
The original showcase remains independent of this optional pack and its assets.

## Rendering accuracy

The [accuracy pipeline](accuracy-plan.md) covers 1,340 ordinary printings across M21,
M20, Mirage, and Tempest,
with a local Scryfall PNG/art cache, frozen frame/set alignment, per-card structural
metrics, and an asset improvement list. Existing frame assets are retained.

```sh
npm run magic:reference:fetch
npm run magic:reference:render
npm run magic:reference:compare
npm run magic:reference:report
```

Open `test-results/magic-accuracy/m21/current/report.html`. Only raster capture
requires Playwright Chromium; comparison and report generation run in Node and
reuse cached results. Downloaded art/scans stay local and out of the showcase.
Scores distinguish reviewed printed wording from unverified Oracle text.
The [M20 transfer test](fixtures/accuracy/m20/transfer-measurement.json) keeps
M21's typography and alignment fixed. Vertical spacing improves on the new set,
while wrapping remains a review issue. Use `--set m20 --run typography` on the
reference commands to reproduce that set's current renderer report.
For the reviewed line-break/spacing fixtures, run `magic:reference:typography`
after comparison and before report generation. Its soft-wrap score excludes
forced paragraph breaks; geometry errors are in reference pixels. See the
[typography measurement](fixtures/accuracy/m21/typography-measurement.json) for
the frozen M21 calibration and holdout results.

The [old-border baseline](fixtures/accuracy/tmp/survey-measurement.json) adds 350
Mirage and 350 Tempest printings with unchanged existing frame assets. Use
`--set mir --run old-border` or `--set tmp --run old-border` on the reference
commands, then `npm run magic:reference:survey -- --set tmp --run old-border`.
Tempest uses Mirage's frozen alignment. The subsequent `retro-type` study compares
the archived legacy painter with measured old-border typography on the same 700
printings, including fresh holdouts in both sets.

For ordinary modern and old-border faces, `rulesParagraphs` optionally replaces
`rulesText`:

```ts
face.rulesParagraphs = [
  { role: 'rules', runs: [{ text: 'Draw a card.' }] },
  { role: 'flavor', runs: [{ text: 'An original quotation.', italic: true }] },
];
```

Runs support `{mana}` notation and explicit italic styles. The painter measures
wrapping and font size and rejects unresolved text overflow. Modern faces draw a
flavor separator; old-border faces use their own spacing without a separator.
Short Fourth Edition and Revised passages use centered, balanced lines. Revised
uses larger type and more space between lines, validated separately from Fourth
Edition. Explicit paragraph alignment and hard breaks take precedence; other
old-border sets retain their separate typography policies.
Use paragraph `align: 'right'` for a printed flavor attribution. Other layouts
still use their `rulesText` as the source. Planeswalker rows now measure loaded
font outlines, preserve italic runs from matching `rulesParagraphs`, and report
overflow rather than clipping. Passive paragraphs have no loyalty-badge indent;
two-row panels allow larger text, and four-row panels keep room for short static
abilities with tighter leading. Paper is clipped below the existing frame outline. The public
`planeswalkerRuleRows` helper exposes the same layout used by the canvas painter.
Font
preparation now rejects missing CSS or failed font loads and can retry after they
become available; load `card-glint/magic/fonts.css` before preparing cards.

For a local scan / old / new example page, first generate the paired reports and
typography metrics described in the [accuracy plan](accuracy-plan.md), then run:

```sh
npm run magic:reference:examples -- --set tmp --study retro-type --baseline retro-before --run retro-type
```

Open `test-results/magic-accuracy/tmp/retro-type/examples.html`. It includes full
cards, enlarged text boxes, measured gains and specific visual review questions.
The page and downloaded images remain local.

The Revised `registration-verified` run measures all 306 printings with cached
printing text. A validated outer-frame detector separates scan registration from
frame-size mismatches: 281 fourth-family cards have coherent boundaries, while
25 lands retain alignment warnings. The alignment transform remains unchanged.
The report includes optional frame guides and center/size differences in JSON
and CSV. See the [Revised registration study](accuracy-plan.md#revised-frame-registration)
and [validation measurements](fixtures/accuracy/3ed/frame-registration-measurement.json).

The subsequent `revised-centered-final` run applies Revised's larger short-body
type, leading and shared 348px text box. All 80 changed identical-input bodies
improve at both tiers; 223 other faces retain their pixels. All 32 reviewed
line-ending targets match. Three source punctuation corrections are measured
separately. See the [typography study](accuracy-plan.md#revised-short-body-typography)
for the full-set check that caught wrapping errors missed by the initial holdouts.
Revised inline tap symbols now use the diagonal-T glyph from the existing
historical-symbol font; later old-border sets keep their tilted-card mark.

## Measured set colors

Set `colorCalibration: 'set-hsb-v1'` to opt into admitted old-frame color profiles.
Separate HSB adjustments cover the outer frame and rules paper; mana discs
have independent targets. Source-derived masks follow irregular green/black
paper edges, including their shadows. Other paper interiors use fixed masks. `early-hsb-v1` restricts the trial to Alpha,
Beta, Unlimited and Revised. Omission keeps original source colors. Unsupported,
sparse and rejected groups stay unchanged; this option is not an assertion that
every printing is calibrated. The default artwork and lettering are untouched.

Profiles are shared by set, border stock and material. A different source URL or
placement disables its frame profile. The [calibration report](hsb-calibration.md)
records coverage, reserved results and exclusions. These are matches to cached
scan colors, not measurements of physical printing ink.

`colorCalibrationCoverage(face)` reports whether the exact face receives a
frame profile and which visible mana symbols have targets. Hosts should use
this to distinguish adjusted materials from source colors. Rejected profiles
do not fall back to older combined frame/paper coefficients. The
[Revised audit](calibration-rollout.md#revised-color-audit) explains why one HSB
multiplier cannot match both frame and paper reliably. Admission checks frame
chroma, shadow tint and texture contrast independently of average color, using
frame-normalized scans and reserved cards.

Recolored bitmaps are prepared once and shared across cards and raster tiers in
a 16 MiB Magic-owned LRU cache, in addition to the host's source-image budget.
Whole-face admission waits when concurrent work exhausts that budget. This limit
counts retained and pending decoded results; temporary Canvas/ImageData staging
is additional. Pack disposal retires cached results after active leases finish.
No decoding, pixel readback or color conversion occurs during animated frames.
Historical symbol backings use the same source resolver in direct composition
and the public pack, preserving white details in both paths.

## Existing scene or DOM editor

Use `card-glint/magic/presentation` for the shared geometry and raster painter.
The [host integration contract](../../docs/host-integration.md) documents image
leases, custom set symbols, cached masks and shader integration without creating
another graphics context.

The [printed-detail study](fixtures/accuracy/tmp/details-measurement.json) follows
up the old-border visual review with corrected cost placement, symbol outlines,
credits, copyright, tap glyph and Canvas corners. Its local scan/previous/current
page is `test-results/magic-accuracy/tmp/retro-details/details.html`, generated
with `magic:reference:details`. See the [component review plan](component-review-plan.md)
for detecting missing content, displacement and wrong shapes, and the
[working backlog](accuracy-backlog.md) for assets and frame-coverage gaps.

Historical Mirage/Tempest basic lands now retain their semantic subtype while
printing “Land” and a centered mana sentence. All 40 basics improve, including
35 reserved printings; 660 nonbasic cards and eight modern holdouts remain
pixel-identical. See the [basic-land transfer results](fixtures/accuracy/tmp/transfer-measurement-retro-basics.json).
`magic:reference:basics -- --set tmp --study retro-basics --baseline retro-details-all --run retro-basics`
generates the local `tmp/retro-basics/basics.html` comparison after capture and
scoring. Paragraph alignment also accepts `center` for explicit printed layouts.

The [Fourth Edition measurement](fixtures/accuracy/4ed/details-measurement.json)
adds all 378 ordinary printings. Header and credit placement improve on all 357
confidently aligned nonland pairs, including six reserved examples; font weight,
type-line regressions and the land branch remain flagged. Generate its local
scan/previous/current page with
`magic:reference:details -- --set 4ed --baseline fourth-details-before-all --run fourth-details-all`.
It includes maximum-overlap and minimum-distance offset searches, independent
whole-row mana measurements, and links to the earlier Mirage/Tempest comparisons.

### Original printing and Oracle wording

`withCardWording(face, { oracle, original }, mode)` keeps the selected printing's
frame, art and typography while choosing supplied wording and symbol style. The
mode defaults to `oracle`; requesting an absent `original` throws. Each wording
requires `typeLine` and `rulesText`, with optional styled `rulesParagraphs`, mana
cost and stats. Missing paragraph overrides are cleared when switching modes.

```ts
import { withCardWording, magic } from 'card-glint/magic';
const visible = withCardWording(
  face,
  {
    oracle: { typeLine: 'Creature — Elemental', rulesText: currentRules },
    original: { typeLine: 'Summon Force', rulesText: printedRules },
  },
  'original',
  { rulesAlignment: 'original' },
);
const recipe = magic.describe(visible, 'inspect');
```

The optional fourth argument also accepts `symbolStyle: 'original' | 'modern'`.
For example, `withCardWording(face, wordings, 'oracle', { symbolStyle: 'original' })`
keeps Oracle wording and types while using the printing's supported historical
symbols. It covers both header mana and inline symbols. Omission defaults to
modern symbols with Oracle wording and original symbols with original wording.
This choice is independent of centering. Before Revised, tapping was written
out; Oracle `{T}` tokens on those printings use Revised's tilted T as the
earliest-symbol fallback. Original written-out wording is unchanged. Revised
uses the tilted T and Fourth through Seventh use the tilted-card mark where
that era is supported.
[Wizards' history of the tap symbol](https://magic.wizards.com/en/news/making-magic/25-random-things-about-magic-2009-02-16)
describes those transitions.

The fourth argument chooses `rulesAlignment: 'left' | 'original' | 'oracle'`.
`left` forces left alignment. The other choices determine automatic centering
from that wording, independently of which wording is displayed. The default is
the displayed mode; requesting a missing alignment source throws. Explicit
paragraph alignment takes precedence over automatic centering.

The early-set rule is empirical: in Alpha, Beta, Unlimited and Revised, a
rules-only passage that fits in five lines at the set's large size is centered.
A short keyword heading can precede it; flavor blocks and longer passages use
the smaller left-aligned layout. Aura eligibility (`Enchant …`) remains with
the centered body. Styling such as italic reminder text does not change the
panel inset. This is a shared set policy, not a claim to reproduce every
historical typesetting decision. Oracle mode may shrink below the original
printing's minimum size to fit full modern reminders without deleting text.

Flat inputs can force `rulesAlignment: { mode: 'left' }` or supply
`{ mode: 'auto', reference: paragraphs }` for the same classification behavior.
The reference affects layout only; its words are never painted.

The helper selects one face; apply it to each supplied child of a split card.
Flat presentation inputs still work. Their optional `wordingMode` controls
the default symbol era; an explicit `symbolStyle` overrides it. Omitting both
preserves the existing set-based policy.
Oracle mode also disables automatic historical basic-land vocabulary and Fourth
Edition stat notation. Modes are included in raster cache identity. The helper
does not fetch or certify printing data, and never guesses historical subtypes
from Oracle types. Hosts should retain field-level provenance: MTGJSON's
`originalType` is modernized for some early printings, including Revised Force
of Nature and Unlimited Howling Mine. The accuracy fixtures contain scan-hashed
corrections for those two examples.
