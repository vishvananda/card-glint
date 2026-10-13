import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readJson, writeJson, cacheRoot, fixtureRoot, outputRoot, hash } from './common.mjs';
import { openBrowser } from './browser.mjs';
const snapshot = await readJson(`${cacheRoot}/rollout/old-symbol-material.json`),
  capture = await readJson(`${outputRoot}/old-symbol-material/geometry/capture.json`),
  session = await openBrowser(snapshot);
try {
  const rows = await session.page.evaluate(async (rows) => {
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    const { retroPx, retroRects } = await import('/games/magic/src/presentation/retro-frame.ts');
    const { retroSymbolGeometry } = await import(
      '/games/magic/src/presentation/retro-symbol-geometry.ts'
    );
    await loadCanvasFonts();
    const c = document.createElement('canvas').getContext('2d');
    c.font = '21.7px "CardRenderer MTG MPlantin", Georgia';
    return rows.map((r) => {
      const g = retroSymbolGeometry(r.face),
        [x, y, w, h] = retroPx(retroRects(r.face).type),
        actual = c.measureText(r.face.typeLine).width,
        before = w - 48,
        after = g ? Math.min(before, g.right - g.width - x - 6) : before;
      return {
        id: r.id,
        name: r.name,
        typeLine: r.face.typeLine,
        measuredWidth: actual,
        beforeMaximum: before,
        afterMaximum: after,
        needsCompression: after < before && actual > after,
        typeRegion: [x - 2, y - 1, w, h + 2],
      };
    });
  }, capture.rows);
  assert.deepEqual(session.faults, []);
  await writeJson(`${fixtureRoot}/old-symbol-type-clearance.json`, {
    schemaVersion: 1,
    scope:
      'Same pinned MPlantin font and 21.7px type size at both stages. Measure when a wider symbol requires compressing a long supplied Oracle type line to retain a six-pixel gap. This does not certify original printing wording or allow changes elsewhere.',
    rendererHash: capture.rendererHash,
    methodHash: hash(await readFile(new URL(import.meta.url))),
    rows,
  });
  console.log(rows.filter((r) => r.needsCompression));
} finally {
  await session.close();
}
