import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, sourceHash, objectFile } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { openBrowser } from './browser.mjs';
const [inputFile, out] = process.argv.slice(2);
assert(out, 'Usage: abu-text-outliers.mjs INPUTS OUT');
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib);
const scores = JSON.parse(
  gunzipSync(
    await readFile(
      'games/magic/fixtures/accuracy/early-through-fourth/abu-art-current-scores.json.gz',
    ),
  ),
);
const names = ['Word of Command', 'Basalt Monolith', 'Howl from Beyond', 'Birds of Paradise'];
const extra = ['lea/False Orders', 'lea/Wall of Brambles', '2ed/Black Vise', 'lea/Stasis'];
const entries = inputs.entries.filter(
  (e) => names.includes(e.name) || extra.includes(e.set + '/' + e.name),
);
assert.equal(entries.length, 16);
const source = {
  rendererHash: await sourceHash('games/magic/src'),
  inputHash: hash(ib),
  toolHash: hash(await readFile(new URL(import.meta.url))),
};
assert.equal(source.rendererHash, scores.source.rendererHash);
assert.equal(source.inputHash, scores.source.inputsHash);
await mkdir(out, { recursive: true });
const session = await openBrowser({ ...inputs, entries }),
  rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of entries) {
    const result = await session.page.evaluate(async (e) => {
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
      const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
      const { rulesLayoutRequest } = await import('/games/magic/src/presentation/rules-layout.ts');
      const signal = new AbortController().signal,
        lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration);
      try {
        const c = await composeCardTexture(
          { face: e.face, printingId: e.id, printedImage: null },
          'inspect',
          signal,
          { loadImages: async () => ({ ...lease, dispose() {} }) },
        );
        try {
          const layout = retroTextLayout(c.getContext('2d'), e.face);
          return {
            png: c.toDataURL().split(',')[1],
            layout,
            request: layout ? rulesLayoutRequest(layout) : null,
          };
        } finally {
          c.width = c.height = 0;
        }
      } finally {
        lease.dispose();
      }
    }, e);
    const score = scores.rows.find((r) => r.id === e.id),
      bytes = Buffer.from(result.png, 'base64');
    assert.equal(hash(bytes), score.nativeFaceHash);
    assert.equal(hash(JSON.stringify(e.face)), score.inputHash);
    await writeFile(path.join(out, e.id + '-render.png'), bytes);
    const scan = await readFile(objectFile(e.reference));
    assert.equal(hash(scan), score.referenceHash);
    const image = normalize(PNG.sync.read(scan), e.pose.transform);
    await writeFile(path.join(out, e.id + '-scan.png'), PNG.sync.write(image));
    rows.push({
      id: e.id,
      set: e.set,
      name: e.name,
      inputHash: score.inputHash,
      referenceHash: score.referenceHash,
      poseHash: score.poseHash,
      nativeFaceHash: score.nativeFaceHash,
      score100: score.score100,
      rules100: score.components.rules.score100,
      face: e.face,
      layout: result.layout,
      request: result.request,
    });
    console.log(e.set, e.name, result.layout?.size);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash('games/magic/src'), source.rendererHash);
  source.closed = true;
  await writeFile(
    path.join(out, 'report.json'),
    JSON.stringify({ schema: 1, source, rows, faults: session.faults }, null, 2) + '\n',
  );
} finally {
  await session.close();
}
