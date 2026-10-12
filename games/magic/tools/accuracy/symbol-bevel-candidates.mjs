import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { openBrowser } from './browser.mjs';
import { root, cacheRoot, outputRoot, fixtureRoot, readJson, writeJson, hash } from './common.mjs';

// Use an isolated checkout: candidate modules must never change the live painter.
const sourceRoot = path.resolve(process.argv[2] ?? '');
assert.notEqual(sourceRoot, root.replace(/\/$/, ''), 'Supply an isolated source checkout');
const variants = [
  { id: 'control', alpha: 0 },
  { id: 'bevel20', alpha: 0.2 },
  { id: 'bevel30', alpha: 0.3 },
  { id: 'bevel40', alpha: 0.4 },
];
const directory = path.join(sourceRoot, 'games/magic/src/presentation'),
  symbolSource = await readFile(`${directory}/core-set-symbol.ts`, 'utf8'),
  faceSource = await readFile(`${directory}/canvas-face.ts`, 'utf8');
assert.ok(symbolSource.includes('c.lineWidth = 1;'));
assert.ok(faceSource.includes("'./core-set-symbol.js'"));
for (const v of variants) {
  const painter = symbolSource;
  const overlay = `else {
    draw(assets.boxes, rects.type, 'bottom');
    if (kind === 'normal') {
      const [x, y, w, h] = px(rects.type);
      context.save();
      context.shadowColor = 'transparent';
      const bevel = context.createLinearGradient(x, 0, x + w, 0);
      bevel.addColorStop(0, 'rgba(255,255,255,0)');
      bevel.addColorStop(0.025, 'rgba(255,255,255,${v.alpha})');
      bevel.addColorStop(0.975, 'rgba(255,255,255,${v.alpha})');
      bevel.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = bevel;
      context.fillRect(x, y + h - 4, w, 2.3);
      context.restore();
    }
  }`;
  const face = faceSource
    .replace("'./core-set-symbol.js'", `'./core-bevel-${v.id}.js'`)
    .replace("else draw(assets.boxes, rects.type, 'bottom');", overlay);

  await writeFile(`${directory}/core-bevel-${v.id}.ts`, painter);
  await writeFile(`${directory}/canvas-bevel-${v.id}.ts`, face);
  v.painterHash = hash(painter);
  v.faceHash = hash(face);
}
const snapshot = await readJson(`${cacheRoot}/sets/m21.json`),
  baseline = await readJson(`${outputRoot}/m21/symbol-final/capture.json`),
  out = `${outputRoot}/m21/symbol-bevel-candidates`,
  rows = [];
await mkdir(out, { recursive: true });
const session = await openBrowser(snapshot, { sourceRoot });
try {
  await session.page.evaluate(async () => {
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    await loadCanvasFonts();
  });
  for (const card of baseline.results.filter((r) =>
    ['2', '46', '87', '132', '176', '215', '228'].includes(r.collectorNumber),
  )) {
    assert.equal(card.frame, 'normal');
    const captures = await session.page.evaluate(
      async ({ face, variants }) => {
        const { loadCanvasImages, canvasAssetUrls } = await import(
          '/games/magic/src/presentation/canvas-assets.ts'
        );
        const loaded = await loadCanvasImages(canvasAssetUrls(face), new AbortController().signal),
          result = {};
        try {
          for (const variant of variants) {
            const { composeCardTexture } = await import(
              `/games/magic/src/presentation/canvas-bevel-${variant.id}.ts`
            );
            const canvas = await composeCardTexture(
              { face, printingId: null, printedImage: null },
              'inspect',
              new AbortController().signal,
              {
                loadImages: async (urls) => {
                  if (urls.some((url) => url && !loaded.images.has(url)))
                    throw Error('Missing candidate bitmap');
                  return { images: loaded.images, dispose() {} };
                },
              },
            );
            result[variant.id] = canvas.toDataURL('image/png').split(',')[1];
            canvas.width = canvas.height = 0;
          }
        } finally {
          loaded.dispose();
        }
        return result;
      },
      { face: card.face, variants },
    );
    const images = {};
    for (const [variant, base64] of Object.entries(captures)) {
      const bytes = Buffer.from(base64, 'base64'),
        file = `${card.id}.${variant}.png`;
      await writeFile(`${out}/${file}`, bytes);
      images[variant] = { file, sha256: hash(bytes) };
    }
    // Reusing decoded assets and a no-op candidate must preserve actual pixels.
    assert.equal(
      images.control.sha256,
      card.images.inspect.sha256,
      'Candidate control differs from production',
    );
    rows.push({
      id: card.id,
      number: card.collectorNumber,
      name: card.name,
      rarity: card.face.rarity,
      inputHash: card.inputHash,
      reference: card.images.reference,
      images,
    });
    console.log(`Candidates ${rows.length}/${baseline.results.length}`);
  }
  assert.deepEqual(session.faults, []);
  await writeJson(`${out}/capture.json`, {
    schemaVersion: 1,
    scope:
      'M21 normal development only. Lower inset bevel only, three overlay levels; symbol and outer border geometry unchanged. Control is byte-identical to production.',
    baselineRendererHash: baseline.rendererHash,
    variants,
    rows,
    studyHash: hash(await readFile(new URL(import.meta.url))),
  });
} finally {
  await session.close();
}
