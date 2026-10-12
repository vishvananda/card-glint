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

## Where to make a change

| Change                                                 | Owner                                                                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Card inputs, ordinary rectangles, text sizes           | [face-layout.ts](src/presentation/face-layout.ts)                                                                        |
| Color pairs, artifacts, lands, legendary crowns        | [profile.ts](src/presentation/profile.ts)                                                                                |
| Planeswalker, Saga, Adventure, Class, leveler geometry | [special-frames.ts](src/presentation/special-frames.ts)                                                                  |
| Retro frame families, old-set mapping and geometry     | [retro-frame.ts](src/presentation/retro-frame.ts)                                                                        |
| Split, aftermath, room and multi-panel arrangements    | [split-layout.ts](src/presentation/split-layout.ts)                                                                      |
| Frame URL selection and symbols                        | [assets.ts](src/presentation/assets.ts), [set-symbols.ts](src/presentation/set-symbols.ts)                               |
| Text wrapping, mana symbols and rules painting         | [canvas-text.ts](src/presentation/canvas-text.ts)                                                                        |
| Face composition and cache identity                    | [canvas-face.ts](src/presentation/canvas-face.ts)                                                                        |
| Visible art bounds, cropping, frame overlap            | [art-apertures.ts](src/presentation/art-apertures.ts), [illustration-layout.ts](src/presentation/illustration-layout.ts) |
| Pack boundary, etching and foil layer placement        | [index.ts](src/index.ts)                                                                                                 |

Geometry is normally normalized `[x, y, width, height]` with a top-left origin.
Typography uses the 488 × 680 reference face. Tier `inspect` paints at 732 × 1020;
`table` paints at 244 × 340. Some layouts override rectangles and wrapping.
These are TypeScript definitions, not a complete declarative frame schema.

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
still use their existing `rulesText` painters. Font
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
