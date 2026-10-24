// Native shared-frame trials only; no production values or scan transforms change.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { hash, sourceHash, writeJson, root } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { earlyFrameTrialPlugin } from './early-frame-trial-plugin.mjs';
const [inputFile, nativeDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: abu-dual-geometry-trials.mjs INPUTS NATIVE OUT');
const inputBytes = await readFile(inputFile),
  snapshot = JSON.parse(inputBytes);
const nativeBytes = await readFile(path.join(nativeDirectory, 'proof.json'));
const native = JSON.parse(nativeBytes);
assert.equal(hash(inputBytes), native.source.inputsHash);
assert.equal(native.completed, 899);
const entries = snapshot.entries.filter(
  (e) => ['lea', 'leb'].includes(e.set) && e.face.frameColors?.length === 2,
);
assert.equal(entries.length, 19);
const trials = [
  { id: 'current', dy: 0, dh: 0 },
  { id: 'up2', dy: -2, dh: 0 },
  { id: 'up2-shorter2', dy: -2, dh: -2 },
];
const transformed = {},
  session = await openBrowser(
    { ...snapshot, entries },
    { plugins: [earlyFrameTrialPlugin(transformed)] },
  );
await mkdir(output, { recursive: true });
const rows = [];
try {
  for (const e of entries) {
    const values = await session.page.evaluate(
      async ({ e, trials }) => {
        await import('/games/magic/src/data/eager.ts');
        await import('/games/magic/src/data/eager-wording.ts');
        const { retroRects } = await import('/games/magic/src/presentation/retro-frame.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const rect = retroRects(e.face);
        if (JSON.stringify(rect.frame) !== JSON.stringify([0, 0, 1, 1]))
          throw Error('Unexpected AB frame transform');
        const lease = await loadAccuracyImages(
          canvasAssetUrls(e.face),
          new AbortController().signal,
          e.face.illustration,
        );
        const values = [];
        try {
          for (const trial of trials) {
            const sy = (680 + trial.dh) / 680;
            const study = {
              frame: [0, trial.dy / 680, 1, sy],
              art: [rect.art[0], rect.art[1] * sy + trial.dy / 680, rect.art[2], rect.art[3] * sy],
              stockMaskFrame: rect.frame,
            };
            const face = trial.id === 'current' ? e.face : { ...e.face, __earlyFrameTrial: study };
            const c = await composeCardTexture(
              { face, printingId: e.id, printedImage: null },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              values.push({
                id: trial.id,
                study: trial.id === 'current' ? null : study,
                png: c.toDataURL().split(',')[1],
              });
            } finally {
              c.width = c.height = 0;
            }
          }
        } finally {
          lease.dispose();
        }
        return values;
      },
      { e, trials },
    );
    const before = native.rows.find((r) => r.id === e.id);
    assert.equal(
      hash(Buffer.from(values[0].png, 'base64')),
      before.afterFaceHash,
      'Instrumented historical face must match: ' + e.name,
    );
    for (const value of values) {
      const bytes = Buffer.from(value.png, 'base64');
      await writeFile(path.join(output, e.id + '-' + value.id + '.png'), bytes);
      rows.push({
        id: e.id,
        set: e.set,
        name: e.name,
        trial: value.id,
        study: value.study,
        referenceHash: e.reference.sha256,
        poseHash: hash(JSON.stringify(e.pose)),
        renderHash: hash(bytes),
      });
    }
    console.log(e.set, e.name);
  }
  assert.deepEqual(session.faults, []);
  await writeJson(path.join(output, 'capture.json'), {
    schema: 1,
    status: 'shared-geometry-development-not-adopted',
    source: {
      rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
      inputHash: hash(inputBytes),
      nativeHash: hash(nativeBytes),
      toolHash: hash(await readFile(new URL(import.meta.url))),
      pluginHash: hash(await readFile(new URL('./early-frame-trial-plugin.mjs', import.meta.url))),
      transformed,
      browser: session.browser.version(),
    },
    scope:
      'Nineteen fixed Original historical face inputs and unchanged scan transforms. All current controls reproduce native census bytes. Two bounded shared frame/art transforms preserve stock-mask geometry and typography; no per-card renderer fit. The frozen Tropical Island artist is historical Jesper Myrfors, not the current reviewed Mark Poole; geometry comparisons do not approve that credit.',
    trials,
    rows,
    faults: session.faults,
  });
} finally {
  await session.close();
}
