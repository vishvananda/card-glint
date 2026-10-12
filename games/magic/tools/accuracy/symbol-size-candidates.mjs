import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { openBrowser } from './browser.mjs';
import { root, cacheRoot, outputRoot, fixtureRoot, readJson, writeJson, hash } from './common.mjs';

// Use an isolated checkout: candidate modules must never change the live painter.
const sourceRoot = path.resolve(process.argv[2] ?? '');
assert.notEqual(sourceRoot, root.replace(/\/$/, ''), 'Supply an isolated source checkout');
const variants = [
  { id: 'control', scale: 1, white: 1, black: 1 },
  { id: 's06-w15', scale: 1.06, white: 1.5, black: 1 },
  { id: 's08-w15', scale: 1.08, white: 1.5, black: 1 },
  { id: 's10-w15', scale: 1.1, white: 1.5, black: 1 },
  { id: 's08-w20', scale: 1.08, white: 2, black: 1 },
  { id: 's08-b15', scale: 1.08, white: 1.5, black: 1.5 },
  { id: 's10-b15', scale: 1.1, white: 1.5, black: 1.5 },
  { id: 's12-b15', scale: 1.12, white: 1.5, black: 1.5 },
  { id: 's10-w20-b15', scale: 1.1, white: 2, black: 1.5 },
  { id: 's10-b20', scale: 1.1, white: 1.5, black: 2 },
];
const directory = path.join(sourceRoot, 'games/magic/src/presentation'),
  symbolSource = await readFile(`${directory}/core-set-symbol.ts`, 'utf8'),
  faceSource = await readFile(`${directory}/canvas-face.ts`, 'utf8');
assert.ok(symbolSource.includes('c.lineWidth = 1;'));
assert.ok(faceSource.includes("'./core-set-symbol.js'"));
for (const v of variants) {
  const painter = symbolSource
      .replace(
        '  const common =',
        `  x -= width * ${v.scale - 1} / 2;\n  y -= height * ${v.scale - 1} / 2;\n  width *= ${v.scale};\n  height *= ${v.scale};\n  const common =`,
      )
      .replace('c.lineWidth = 1;', `c.lineWidth = common ? ${v.white} : ${v.black};`),
    face = faceSource.replace("'./core-set-symbol.js'", `'./core-symbol-${v.id}.js'`);
  await writeFile(`${directory}/core-symbol-${v.id}.ts`, painter);
  await writeFile(`${directory}/canvas-symbol-${v.id}.ts`, face);
  v.painterHash = hash(painter);
  v.faceHash = hash(face);
}
const snapshot = await readJson(`${cacheRoot}/sets/m21.json`),
  baseline = await readJson(`${outputRoot}/m21/symbol-final/capture.json`),
  out = `${outputRoot}/m21/symbol-size-candidates`,
  rows = [];
await mkdir(out, { recursive: true });
let previous;
try {
  previous = await readJson(`${out}/capture.json`);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const session = await openBrowser(snapshot, { sourceRoot });
try {
  await session.page.evaluate(async () => {
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    await loadCanvasFonts();
  });
  for (const card of baseline.results) {
    assert.equal(card.frame, 'normal');
    const images = {};
    const prior = previous?.rows.find((r) => r.id === card.id && r.inputHash === card.inputHash);
    for (const v of variants) {
      const p = previous?.variants.find((p) => p.id === v.id);
      const a = prior?.images[v.id];
      if (
        p?.painterHash === v.painterHash &&
        p?.faceHash === v.faceHash &&
        a &&
        hash(await readFile(`${out}/${a.file}`)) === a.sha256
      )
        images[v.id] = a;
    }
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
              `/games/magic/src/presentation/canvas-symbol-${variant.id}.ts`
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
      { face: card.face, variants: variants.filter((v) => !images[v.id]) },
    );
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
      'M21 normal development only. Uniform enlargement about the current center; rim widths vary separately. Control is byte-identical to production.',
    baselineRendererHash: baseline.rendererHash,
    variants,
    rows,
    studyHash: hash(await readFile(new URL(import.meta.url))),
  });
} finally {
  await session.close();
}
