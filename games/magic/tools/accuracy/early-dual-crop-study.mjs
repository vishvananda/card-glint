import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { openBrowser } from './browser.mjs';
import { hash, sourceHash, root } from './common.mjs';
const [base, out] = process.argv.slice(2);
assert(out, 'Usage: early-dual-crop-study.mjs INSTALLED_NATIVE OUT');
const input = JSON.parse(await fs.readFile(path.join(base, 'inputs.json')));
const entries = input.entries.filter((e) => e.face.land && e.face.frameColors?.length === 2);
assert.equal(entries.length, 10);
const source = {
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  inputsHash: hash(await fs.readFile(path.join(base, 'inputs.json'))),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
};
assert(entries.every((e) => e.face.setCode === '2ed' && e.face.wordingMode === 'original'));
await fs.mkdir(out, { recursive: true });
const session = await openBrowser(input);
const rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of entries) {
    const result = await session.page.evaluate(async (e) => {
      const { describeSetCalibration, createSetCalibrationCandidate } = await import(
        '/games/magic/src/calibration/editor.ts'
      );
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
      const desc = describeSetCalibration('2ed'),
        values = Object.fromEntries(desc.controls.map((c) => [c.id, c.value]));
      const placements = [
        ['current', 0, 0, 0, 0],
        ['up-2.5-art', 0, -2.5, 0, 2.5],
        ['up-3-art', 0, -3, 0, 3],
        ['up-3.5-art', 0, -3.5, 0, 3.5],
      ];
      const faces = placements.map(([name, dx, dy, dw, dh]) => {
        if (name === 'current') return { name, face: e.face };
        const v = {};
        for (const [i, delta] of [dx / 488, dy / 680, dw / 488, dh / 680].entries())
          v['frames.L-dual.frame.' + i] = values['frames.L-dual.frame.' + i] + delta;
        for (const [axis, size] of [
          [0, 488],
          [1, 680],
        ]) {
          const p = 'frames.L-dual.',
            a = values[p + 'art.' + axis],
            w = values[p + 'art.' + (axis + 2)],
            x = values[p + 'frame.' + axis],
            s = values[p + 'frame.' + (axis + 2)],
            nx = v[p + 'frame.' + axis],
            ns = v[p + 'frame.' + (axis + 2)];
          v[p + 'art.' + axis] = nx + ((a - x) * ns) / s - 0.5 / size;
          v[p + 'art.' + (axis + 2)] = (w * ns) / s + 1 / size;
        }
        return {
          name,
          face: {
            ...e.face,
            setCalibrationCandidate: createSetCalibrationCandidate('2ed', desc.revision, v),
          },
          values: v,
        };
      });
      const lease = await loadAccuracyImages(
        faces.flatMap((f) => canvasAssetUrls(f.face)),
        new AbortController().signal,
        e.face.illustration,
      );
      const results = [];
      try {
        for (const f of faces) {
          const image = await composeCardTexture(
            { face: f.face, printingId: e.id, printedImage: null },
            'inspect',
            new AbortController().signal,
            { loadImages: async () => ({ ...lease, dispose() {} }) },
          );
          try {
            results.push({
              name: f.name,
              values: f.values ?? {},
              png: image.toDataURL().split(',')[1],
            });
          } finally {
            image.width = image.height = 0;
          }
        }
      } finally {
        lease.dispose();
      }
      return results;
    }, e);
    for (const r of result) {
      const bytes = Buffer.from(r.png, 'base64');
      await fs.mkdir(path.join(out, r.name), { recursive: true });
      await fs.writeFile(path.join(out, r.name, e.id + '.png'), bytes);
      delete r.png;
      r.hash = hash(bytes);
    }
    const expected = await fs.readFile(path.join(base, 'original', e.id + '.png'));
    assert.equal(hash(expected), result[0].hash, 'Baseline drift ' + e.name);
    rows.push({
      id: e.id,
      name: e.name,
      referenceHash: e.reference.sha256,
      poseHash: hash(JSON.stringify(e.pose.transform)),
      variants: result,
    });
    await fs.writeFile(
      path.join(out, 'capture.json'),
      JSON.stringify(
        {
          source,
          scope:
            'Shared profile geometry candidates; fixed original inputs and scan poses, no runtime adoption.',
          rows,
        },
        null,
        2,
      ) + '\n',
    );
    console.log(e.name, 'baseline exact');
  }
  assert.equal(session.faults.length, 0);
} finally {
  await session.close();
}
