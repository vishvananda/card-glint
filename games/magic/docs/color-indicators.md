# Color indicators

[Magic pack](../README.md) · [Documentation index](README.md)

The pack draws a color indicator to the left of the type text and reserves its
space before fitting the text. The frame palette and mana cost stay independent.
Available in card-glint 0.7.14 and later. The default shows only the physical
printing's indicator; frame and mana-cost colors do not trigger one.

## Printed indicators

Supply `colorIndicator` on the face that has the printed dot:

```ts
import type { MagicCard } from 'card-glint/magic';

const face: MagicCard = {
  name: 'Example Back Face',
  typeLine: 'Creature — Insect',
  colors: ['U'],
  colorIndicator: ['U'],
  manaSymbols: [],
};
```

The five accepted colors are `W`, `U`, `B`, `R` and `G`. Order and duplicates are
normalized. An empty array means no physical indicator. A multicolor indicator
uses separate color sectors. Its source is pinned in the Magic asset manifest;
the rim and mono-color discs come from Full Magic Pack. Invisible indicators
load no indicator images. Decoded discs are limited to 128 pixels wide and go
through the existing preparation/image cache.

## Current-color display

The host supplies resolved current colors. The renderer does not interpret
spells, effects, layers or timestamps. For a Sol Ring made blue:

```ts
const visible: MagicCard = {
  ...printedSolRing,
  colors: [], // base card's colors
  currentColors: ['U'],
  colorIndicatorDisplay: 'current-if-changed',
};
```

This adds a blue badge beside the type text. It keeps the artifact frame, mana
cost and rules. Set `currentColors: []` when the effect ends: the badge disappears
because those colors match the base card again. If a colored card becomes
colorless, an opaque neutral badge shows “Currently colorless” through the
resolver's accessibility label. This application badge is not an official
sixth color; `['C']` is rejected.

Always retain the base card's `colors`. Do not replace them with current colors
when using this comparison. Missing base colors cause an error rather than being
treated as colorless. Set state on individual child faces for composite cards.

| `colorIndicatorDisplay` | Result                                                                            |
| ----------------------- | --------------------------------------------------------------------------------- |
| Omitted or `printed`    | Physical indicator only.                                                          |
| `oracle`                | `oracleColorIndicator`, falling back to the physical indicator.                   |
| `current-if-changed`    | Current colors when different from base colors; otherwise the physical indicator. |
| `hidden`                | No indicator and no reserved space.                                               |

These are raster inputs. Prepare a new face revision when they change; card
movement still reuses the prepared texture. Visible colors participate in the
face cache key. Invisible indicator data, artwork-only pixels and the existing
art/set-symbol etching mask keep their prior keys. No new finish shader is used.

## Provider and printing data

`fromScryfallCard()` and `fromMtgjsonCard()` preserve provider indicator colors
as `oracleColorIndicator`. They resolve physical visibility from the printing's
release date, known set era, or an explicit override. A 2015 frame is also a
known later-era printing. The provider's colors and Commander identity are not
used to invent a dot.

This distinction matters for Ancestral Vision: Scryfall reports a blue Oracle
indicator for both Time Spiral and Time Spiral Remastered. The first scan has
no dot and states its color in the rules text; the second has a blue dot.
Switching Original/Oracle wording does not silently change printing appearance.
Use `colorIndicatorDisplay: 'oracle'` to modernize the indicator deliberately.

Scryfall supplies its printing date in `released_at`. For MTGJSON, pass the set's
date as `printingDate` when needed. The card's `originalReleaseDate` is not used:
that can be the date of an earlier printing.

```ts
const face = fromMtgjsonCard(record, {
  printingDate: '2021-03-19',
});

const reviewed = fromScryfallCard(record, {
  colorIndicators: [null], // reviewed absence on the supplied face
});
```

`colorIndicators` contains one entry per supplied face, in supplied order.
An array specifies the physical colors; `null` explicitly suppresses the dot.
MTGJSON face reordering preserves the association with each override. The
optional import setting `colorIndicatorDisplay` selects the display policy.

When a provider supplies Oracle indicator colors but physical visibility cannot
be determined, `colorIndicatorPrinting` is `unknown`, the physical dot stays
absent, and Oracle colors remain available. The scan adapter rejects that case
until a printing date or reviewed `colorIndicator` annotation resolves it.
Explicit `colorIndicators` overrides mark physical visibility as known.

## Geometry, layouts and scans

`resolveColorIndicator(face)` returns visible colors, their source (`printed`,
`oracle` or `current`) and an accessibility label, or `null`. The lazy and
presentation entries also export:

- `colorIndicatorLayout(face, typeRect, referenceWidth?)`: badge and remaining
  type-text rectangles in the caller's local coordinates.
- `colorIndicatorRegions(face)`: labelled badge regions in normalized physical
  card coordinates, including rotated panels.
- `paintTypeColorIndicator(...)`: paint a prepared badge and return the remaining
  type rectangle for a host-owned type painter.
- `prepareColorIndicators(face, images, signal)`: acquire cached multicolor
  composites before calling the synchronous painter. Paint using its `images`,
  then release the returned lease with `dispose()`. `composeCardTexture` does
  this automatically. The 4 MiB cache is bounded and cleared by pack disposal;
  direct hosts can call `clearColorIndicatorBitmaps()` during teardown.

High-level Magic recipes include `color-indicator`, `spell-color-indicator` or
`face-N-color-indicator` hit regions. The dedicated paths cover ordinary modern
components and plates, retro, Futureshifted, planeswalker, Saga, Class, leveler,
Adventure, Prepared, split/Room, Aftermath, flip and Battle layouts. Indicators
belong to the selected physical face or child panel; one child's colors do not
leak onto the other. Local geometry defaults are not a claim of scan calibration
for every printing.

An unchanged `printedImage` already includes its printed indicator and stays on
the scan path. Changing/removing that indicator needs the rebuilt face so text
can move and the old dot can disappear. The compositor automatically selects
that path. Supply complete face content and illustration data for the rebuild;
missing illustration data raises an error instead of replacing the scan with a
card missing its art. Artwork-only composition and etching are unaffected.
Custom composers own their own indicator handling.

The feature uses Canvas2D preparation and supports worker OffscreenCanvas and
transferable ImageBitmap output. PNG export uses the same prepared printing.

## Checks and upstream research

Run `npm run test:color-indicators` after building. The controls cover provider
history, current colors, invalid inputs, cache/scan routing, default pixel
parity, small/large faces, rotated semantic regions, worker composition and PNG
round trips. The default pixel controls use synthetic assets and compare against
the pinned parent source; they do not measure scan accuracy or GPU throughput.

See the [investigation and plan](color-indicator-plan.md) for pinned MSE/Card
Conjurer references and source coordinates. External assets retain their own
rights; see the [Magic source notice](../NOTICE.md).
