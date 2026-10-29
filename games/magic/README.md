# Magic drawing pack

Use this optional pack to render Magic card frames, symbols, text and artwork
with card-glint. It supplies the Magic layout and typography. Your application
supplies card data, illustration URLs, persistence and UI.

[Documentation](docs/README.md) · [Calibration and review Lab](https://cardforge.fyi/lab/) ·
[Asset sources and terms](NOTICE.md)

This pack is unofficial Fan Content permitted under the Fan Content Policy.
Not approved or endorsed by Wizards. Portions of the referenced materials are
property of Wizards of the Coast. © Wizards of the Coast LLC.

## Render a card

Install a [card-glint release](https://github.com/vishvananda/card-glint/releases/latest),
then import the pack and its fonts:

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
const card: CardDocument = {
  id: 1,
  revision: 1,
  recipe: magic.describe(face, 'inspect'),
};
renderer.upsertCards([card]);
await renderer.ready(card.id, card.revision);
```

Use `updateScene()` and `render()` to display the card, as shown in the
[core usage guide](../../README.md#use-it-in-an-application). Dispose the renderer
when your view closes. The host controls canvas size, animation and accessibility.

The pack references pinned external frames, symbols and fonts. It does not
supply illustrations or fetch card records. See [asset references](assets.json)
and the [source notice](NOTICE.md). The core and original showcase imports do
not load Magic code or assets.

For plain HTML, use `magic.js` and `magic.css` beside `browser.js` from the same
version-pinned browser release. Serve the extracted browser ZIP over HTTP and
open `magic.html` for a JSON-based example.

## Choose an integration

| Need                                            | Entry or guide                                                    |
| ----------------------------------------------- | ----------------------------------------------------------------- |
| Pack recipes with synchronous data              | `card-glint/magic`                                                |
| Collections that load calibration per set       | [`card-glint/magic/lazy`](docs/lazy-loading.md)                   |
| Reviewed wording corrections without a renderer | [`card-glint/magic/printing`](docs/wording.md)                    |
| Geometry and painting in an existing renderer   | [`card-glint/magic/presentation`](../../docs/host-integration.md) |
| Canvas helpers without Magic data               | `card-glint/canvas`                                               |

Use the lazy entry for large collections. Await `prepareMagicCards(faces)` before
synchronous geometry, asset or cache-key queries. Avoid importing the eager entry
elsewhere on the same page if you want to keep those downloads small.

## Choose a printing and wording

Use [printing presets](docs/printing-presets.md) to select a frame, or
[printing styles](docs/printing-styles.md) to define reusable alternatives.
Keep the source card and saved selection separate. Provider adapters accept
[Scryfall and MTGJSON records](docs/provider-cards.md).

Original and Oracle wording share the selected printing's appearance:

```ts
import { withCardWording } from 'card-glint/magic';

const visible = withCardWording(face, { oracle, original }, 'original');
const oracleWithFlavor = withCardWording(face, { oracle, original }, 'oracle', {
  includeFlavorText: true,
});
```

Supply the wording records; the helper does not fetch them. For scan comparisons,
use original wording and let that wording control text fitting. You can choose
historical or modern symbols separately. See [wording and reviewed corrections](docs/wording.md).

Compatible modern frames can inherit the shared M21 calibration. Exact profiles
take precedence. Use `resolvePrintingCalibration(face)` to inspect the selected
profile and inherited defaults. Color calibration and explicit source policies
are described in [calibration defaults](docs/calibration-defaults.md).

A frame that renders may still need calibration. Check
[frame support and limitations](docs/standard-templates.md) and the
[Lab set overview](https://cardforge.fyi/lab/) before treating it as validated.
The [documentation index](docs/README.md) links individual frame notes.

## Contribute

Report rendering errors in [Lab](https://cardforge.fyi/lab/) or open a GitHub
issue. Include the printing ID, renderer version, wording mode and a description
of the mismatch.

For a calibration PR, follow [Calibrate a set](docs/calibrating-a-set.md).
See [old-frame starting defaults](docs/old-frame-defaults.md) for measured donor
choices and their coverage limits.
It covers original data review, frame-only scan normalization, component fitting,
validation, one-file set profiles and evidence. Read the
[source map](docs/source-map.md) before changing a painter.

Keep game-specific assets, geometry and text policy in this pack. Pin external
asset revisions and record attribution. Keep downloaded art and scans in a local
cache; do not add them to the repository or public showcase. Update art windows,
hit regions and cache identity when changing layout.

For renderer changes, run:

```sh
npm run check
npm run build
npm run test:package
npm run test:magic
npm run preview
# In another terminal, while preview is running:
npm run test:browser
npm run test:showcase
```

Run the focused checks for the affected frame too. A PR should include the tested
scope, before/after measurements, comparison images, browser, regressions and
remaining problems. Record scores as similarity indices out of 100, rather than
percentages of correctness. A regional fit does not certify an entire set.
