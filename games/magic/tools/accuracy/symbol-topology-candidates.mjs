import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { root, cacheRoot, outputRoot, fixtureRoot, readJson, writeJson, hash } from './common.mjs';

const [set, checkout] = process.argv.slice(2),
  sourceRoot = path.resolve(checkout ?? '');
assert.ok(['m15', 'war'].includes(set));
assert.notEqual(sourceRoot, root.replace(/\/$/, ''), 'Supply an isolated checkout');
const plan = await readJson(`${fixtureRoot}/set-symbol-topology-plan.json`),
  baselineBytes = await readFile(`${outputRoot}/${set}/symbol-topology-before/capture.json`),
  baseline = JSON.parse(baselineBytes),
  snapshot = await readJson(`${cacheRoot}/sets/${set}.json`),
  rect = plan.regions.normal,
  directory = `${sourceRoot}/games/magic/src/presentation`,
  faceSource = await readFile(`${directory}/canvas-face.ts`, 'utf8'),
  symbolSource = await readFile(
    new URL('./templates/shaped-symbol.ts.txt', import.meta.url),
    'utf8',
  ),
  scales = set === 'm15' ? [0.96, 1, 1.04] : [0.85, 0.9, 0.95, 1],
  variants = [
    { id: 'control' },
    ...scales.flatMap((scale) =>
      [0.7, 1.2].map((rim) => ({ id: `s${Math.round(scale * 100)}-r${rim * 10}`, scale, rim })),
    ),
    ...(set === 'm15'
      ? [0.88, 0.9, 0.92, 0.96, 1].flatMap((scale) =>
          [0, -1].map((dy) => ({ id: `s${scale * 100}-r7-x2-y${dy}`, scale, rim: 0.7, dx: 2, dy })),
        )
      : [0.8, 0.82].flatMap((scale) =>
          [0.7, 1.2].map((rim) => ({ id: `s${scale * 100}-r${rim * 10}`, scale, rim })),
        )),
    ...(set === 'm15'
      ? [0, -1].map((dy) => ({ id: `s92-r12-x2-y${dy}`, scale: 0.92, rim: 1.2, dx: 2, dy }))
      : []),
  ],
  out = `${outputRoot}/${set}/symbol-topology-candidates`,
  rows = [];
assert.equal(baseline.rendererHash, plan.baselineRendererHash);
assert.equal(hash(faceSource), plan.baselineFaceHash);
assert.equal(baseline.snapshotIdentity, plan.sets[set].snapshotIdentity);
assert.deepEqual(
  baseline.results.map((r) => r.id).sort(),
  plan.sets[set].development.map((r) => r.id).sort(),
);
await mkdir(out, { recursive: true });
let previous;
try {
  previous = await readJson(`${out}/capture.json`);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
if (previous?.baselineCaptureHash !== hash(baselineBytes)) previous = null;
for (const v of variants) {
  const face =
    v.id === 'control'
      ? faceSource
      : `import { paintShapedSetSymbol } from './topology-${set}-${v.id}.js';\n` +
        faceSource.replace(
          'else paintSetSymbol(context, setIcon, face.setCode, face.rarity, ...symbolBounds, setCrop);',
          `else paintShapedSetSymbol(context, setIcon, '${set}', face.rarity, ...symbolBounds, setCrop);`,
        );
  assert.ok(v.id === 'control' || face.includes(`else paintShapedSetSymbol`));
  const painter = symbolSource.replace(
    '[1, 0, 0, 1]; // candidate geometry',
    `[${v.scale}, ${v.dx ?? 0}, ${v.dy ?? 0}, ${v.rim}]; // candidate geometry`,
  );
  assert.ok(v.id === 'control' || painter !== symbolSource);
  await writeFile(`${directory}/topology-${set}-${v.id}.ts`, painter);
  await writeFile(`${directory}/face-topology-${set}-${v.id}.ts`, face);
  v.faceHash = hash(face);
  v.painterHash = hash(painter);
}
function crop(image, rect) {
  const factor = image.width / 488,
    [x, y, w, h] = rect.map((v) => v * factor);
  assert.ok([x, y, w, h].every(Number.isInteger));
  const data = Buffer.alloc(w * h * 4);
  for (let row = 0; row < h; row++)
    data.set(
      image.data.subarray(((y + row) * image.width + x) * 4, ((y + row) * image.width + x + w) * 4),
      row * w * 4,
    );
  return { width: w, height: h, data };
}
const session = await openBrowser(snapshot, { sourceRoot });
try {
  await session.page.evaluate(async () => {
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    await loadCanvasFonts();
  });
  for (const card of baseline.results) {
    assert.equal(card.frame, 'normal');
    const images = {},
      prior = previous?.rows.find((r) => r.id === card.id && r.inputHash === card.inputHash);
    for (const v of variants) {
      const p = previous?.variants.find((p) => p.id === v.id),
        a = prior?.images[v.id];
      if (
        p?.faceHash === v.faceHash &&
        p?.painterHash === v.painterHash &&
        a &&
        hash(await readFile(`${out}/${a.file}`)) === a.sha256
      )
        images[v.id] = a;
    }
    const captures = await session.page.evaluate(
      async ({ face, variants, set, rect }) => {
        const { loadCanvasImages, canvasAssetUrls } = await import(
          '/games/magic/src/presentation/canvas-assets.ts'
        );
        const loaded = await loadCanvasImages(canvasAssetUrls(face), new AbortController().signal),
          result = {};
        try {
          for (const v of variants) {
            const { composeCardTexture } = await import(
              `/games/magic/src/presentation/face-topology-${set}-${v.id}.ts`
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
            const factor = canvas.width / 488,
              [x, y, w, h] = rect.map((v) => v * factor),
              roi = document.createElement('canvas');
            roi.width = w;
            roi.height = h;
            roi.getContext('2d').drawImage(canvas, x, y, w, h, 0, 0, w, h);
            result[v.id] = roi.toDataURL('image/png').split(',')[1];
            roi.width = roi.height = canvas.width = canvas.height = 0;
          }
        } finally {
          loaded.dispose();
        }
        return result;
      },
      { face: card.face, variants: variants.filter((v) => !images[v.id]), set, rect },
    );
    for (const [id, base64] of Object.entries(captures)) {
      const bytes = Buffer.from(base64, 'base64'),
        file = `${card.id}.${id}.png`;
      await writeFile(`${out}/${file}`, bytes);
      images[id] = { file, sha256: hash(bytes) };
    }
    const old = await readFile(
      `${outputRoot}/${set}/symbol-topology-before/${card.images.inspect.file}`,
    );
    assert.equal(hash(old), card.images.inspect.sha256);
    assert.deepEqual(
      PNG.sync.read(await readFile(`${out}/${images.control.file}`)).data,
      crop(PNG.sync.read(old), rect).data,
      'No-op candidate crop differs',
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
    console.log(`${set} candidates ${rows.length}/${baseline.results.length}`);
  }
  assert.deepEqual(session.faults, []);
  await writeJson(`${out}/capture.json`, {
    schemaVersion: 1,
    set,
    scope:
      'Development-only fixed-position topology and scale candidates. Native inspect symbol crops; byte-exact control against full production. No scan fitting.',
    rect,
    variants,
    rows,
    baselineCaptureHash: hash(baselineBytes),
    studyHash: hash(await readFile(new URL(import.meta.url))),
  });
} finally {
  await session.close();
}
