# Loading only the sets you display

Use `card-glint/canvas` for game-neutral Canvas2D helpers. It exports `canvas`,
`closeRaster`, `decodeCanvasImage`, `sizedCanvasSvg`, `ellipsizedText`, `coverImage`,
and `setAssetFetcher`. This entry imports no Magic data, fonts, or painters.

For Magic collections, use `card-glint/magic/lazy` instead of
`card-glint/magic/presentation`:

```ts
import {
  prepareMagicCards,
  canvasAssetUrls,
  cardTextureKey,
  composeCardTexture,
} from 'card-glint/magic/lazy';

// Once when a visible cohort changes, before synchronous layout/key queries.
await prepareMagicCards(visibleCards.map((card) => card.face));
for (const card of visibleCards) {
  const urls = canvasAssetUrls(card.face);
  const key = cardTextureKey(card, 'table');
  // Supply the same host image/font hooks as the synchronous compatibility API.
  const image = await composeCardTexture(card, 'table', signal, hooks);
}
```

`composeCardTexture` also prepares its own input automatically. If you need
synchronous geometry, asset URLs, calibration descriptions, or texture keys
before painting, await `prepareMagicCards` first. `loadMagicSet('lea')` prepares a
single set. Concurrent requests share one import; loaded data is immutable and
reused for the session. Unprepared known-set queries throw an actionable error.
Unknown sets retain the existing uncalibrated defaults.

Automatic or named modern calibration may require the M21 donor profile.
`prepareMagicCards` includes that dependency when the face requests it, and walks
both faces of a composite card. It does not fetch scans, illustrations, frame
images, or fonts. The existing asset/font hooks still own those resources.

Wording has a separate small entry, suitable for import pipelines without a
renderer:

```ts
import { resolveSetPrintingWording } from 'card-glint/magic/printing';

const resolved = await resolveSetPrintingWording('lea', printingId, {
  oracle: providerOracleText,
  original: providerOriginalText,
});
```

`resolveSetPrintingArtist` works the same way. These helpers load only that set's
reviewed corrections, independently of calibration data. They preserve Oracle
wording and the existing printing-ID, face-name, and optional scan-hash guards.
A wrong set cannot borrow a correction from another loaded set.

The result retains field-level changes, catalog revision, scan identity and an
evidence locator. Long review notes are stored in repository fixtures, including
`fixtures/accuracy/printing-review-catalog.json`; they are not shipped as browser
JavaScript. `provenance.corrections[].reason` is now a concise pointer to that
source evidence.

The existing `card-glint/magic` and `card-glint/magic/presentation` entries remain
synchronous compatibility APIs. They initialize all required tables. Importing
one anywhere in a page deliberately opts that page into the eager data path;
avoid mixing them with the lazy entry when measuring download savings. For direct
CDN/browser imports, use `magic-lazy.js`, `magic-printing.js`, or `canvas.js` from
the same version-pinned directory and keep their relative chunks available.

Calibration contributors still edit the authoritative set profile. The build
regenerates per-set payloads; generated files are ignored by Git. Run
`npm run magic:data:build` after changing source evidence, and
`npm run magic:data:check` to verify the generated output. No payload file edits
are required in a calibration pull request.
