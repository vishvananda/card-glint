// Test a semantic Fourth layout fix without changing the production painter.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { hash, objectFile, sourceHash, root, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
const [inputFile, captureFile, posesFile, out] = process.argv.slice(2);
assert(
  out,
  'Usage: fourth-detail-classification-study.mjs INPUTS NATIVE_CAPTURE FROZEN_POSES NEW_OUTPUT',
);
const files = [inputFile, captureFile, posesFile],
  raw = await Promise.all(files.map((f) => fs.readFile(f)));
const [inputs, capture, poses] = raw.map((b) => JSON.parse(b));
assert.equal(inputs.set, '4ed');
assert.equal(inputs.entries.length, 378);
assert.equal(capture.status, 'complete');
assert.equal(capture.inputHash, hash(raw[0]));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(capture.rendererHash, rendererHash);
await fs.mkdir(out);
const plugin = {
  name: 'fourth-semantic-details-test',
  enforce: 'pre',
  transform(code, id) {
    if (!id.split('?')[0].endsWith('/presentation/retro-details.ts')) return;
    const from = "const fourth = set === '4ed' && !/\\bLand\\b/.test(face.typeLine ?? '');";
    assert.equal(code.split(from).length, 2);
    return code
      .replace('import { resolveFrameColors }', 'import { resolveFrameColors, resolveCardProfile }')
      .replace(
        from,
        "const fourth = set === '4ed' && ((globalThis as any).__fourthSemanticDetails ? !resolveCardProfile(face).land : !/\\bLand\\b/.test(face.typeLine ?? ''));",
      );
  },
};
const s = await openBrowser(inputs, { plugins: [plugin] }),
  rows = [];
try {
  for (const e of inputs.entries) {
    const n = capture.rows.find((n) => n.id === e.id),
      p = poses.rows.find((p) => p.id === e.id);
    assert(p.accepted);
    assert.equal(p.referenceHash, e.reference.sha256);
    const result = await s.page.evaluate(
      async ({ e }) => {
        await import('/games/magic/src/data/eager.ts');
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { retroPrintDetails } = await import(
          '/games/magic/src/presentation/retro-details.ts'
        );
        const signal = new AbortController().signal,
          lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration),
          out = {};
        try {
          for (const fix of [false, true]) {
            globalThis.__fourthSemanticDetails = fix;
            const c = await composeCardTexture(
              { face: e.face, printingId: e.id, printedImage: null },
              'inspect',
              signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              out[fix ? 'candidate' : 'current'] = {
                png: c.toDataURL().split(',')[1],
                details: retroPrintDetails(e.face),
              };
            } finally {
              c.width = c.height = 0;
            }
          }
        } finally {
          lease.dispose();
        }
        return out;
      },
      { e },
    );
    const before = Buffer.from(result.current.png, 'base64'),
      after = Buffer.from(result.candidate.png, 'base64');
    assert.equal(hash(before), n.modes.original.sha256, 'Native baseline drift ' + e.name);
    const changed = hash(before) !== hash(after);
    const expected = /^Enchant Land$/.test(e.face.typeLine) && e.face.land === false;
    assert.equal(changed, expected, e.name);
    if (changed) await fs.writeFile(path.join(out, e.id + '.png'), after);
    rows.push({
      id: e.id,
      name: e.name,
      referenceHash: e.reference.sha256,
      inputHash: hash(JSON.stringify(e.face)),
      poseHash: hash(JSON.stringify(p.transform)),
      before: hash(before),
      after: hash(after),
      changed,
      beforeDetails: result.current.details,
      afterDetails: result.candidate.details,
    });
    if (rows.length % 30 === 0)
      console.log('semantic details', rows.length, '/', inputs.entries.length);
  }
  assert.equal(rows.filter((r) => r.changed).length, 7);
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
  assert.deepEqual(
    await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
    raw.map(hash),
  );
  await writeJson(path.join(out, 'study.json'), {
    schema: 1,
    set: '4ed',
    status: 'complete-exploratory',
    rendererHash,
    inputHash: hash(raw[0]),
    baselineHash: hash(raw[1]),
    posesHash: hash(raw[2]),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    scope:
      'All378 Original native replays match the current production baseline. Only seven Enchant Land cards change under semantic classification;not a shipped fix or component certification.',
    summary: { cards: 378, changed: 7, unchanged: 371 },
    rows,
  });
} finally {
  await s.close();
}
