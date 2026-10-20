// Falsification control: compare each reviewed dual outline with its other color.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { readJson, writeJson, hash, root, sourceHash } from './common.mjs';
const [study, out] = process.argv.slice(2);
assert(out, 'Usage: abu-outline-audit.mjs DUAL_REPLAY OUT');
const input = await readJson(path.join(study, 'inputs.json')),
  capture = await readJson(path.join(study, 'capture.json'));
assert.equal(capture.rows.length, 19);
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), capture.source.rendererHash);
await mkdir(out, { recursive: true });
const session = await openBrowser(input, {
  plugins: [
    {
      name: 'alternate-dual-outline',
      enforce: 'pre',
      transform(code, id) {
        if (!id.endsWith('/abu-land-palette.ts')) return;
        const original = "return ordered.length === 1 ? ordered[0] : OUTLINES[ordered.join('')];";
        assert(code.includes(original));
        return code.replace(
          original,
          "const selected=ordered.length === 1 ? ordered[0] : OUTLINES[ordered.join('')];return ordered.length===2?ordered.find(c=>c!==selected):selected;",
        );
      },
    },
  ],
});
const rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of input.entries) {
    const prev = capture.rows.find((r) => r.id === e.id);
    assert(prev);
    const b64 = await session.page.evaluate(async (e) => {
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
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
          return c.toDataURL().split(',')[1];
        } finally {
          c.width = c.height = 0;
        }
      } finally {
        lease.dispose();
      }
    }, e);
    const bytes = Buffer.from(b64, 'base64'),
      after = PNG.sync.read(bytes),
      beforeBytes = await readFile(path.join(study, e.set, e.id + '.png'));
    assert.equal(hash(beforeBytes), prev.renderHash);
    const before = PNG.sync.read(beforeBytes);
    let changed = 0,
      outside = 0;
    for (let y = 0; y < after.height; y++)
      for (let x = 0; x < after.width; x++) {
        const i = (y * after.width + x) * 4;
        if (![0, 1, 2, 3].some((c) => before.data[i + c] !== after.data[i + c])) continue;
        changed++;
        const xx = x / 1.5,
          yy = y / 1.5;
        if (
          !(
            xx >= 20 &&
            xx < 468 &&
            yy >= 20 &&
            yy < 663 &&
            (xx < 40 || xx > 448 || yy < 44 || yy > 637)
          )
        )
          outside++;
      }
    assert.equal(outside, 0, 'Outline control changed another region: ' + e.name);
    assert(changed > 0, 'Missing opposite-palette control');
    await writeFile(path.join(out, e.id + '.png'), bytes);
    rows.push({ ...prev, alternativeHash: hash(bytes), changed, outside });
    console.log(e.set, e.name, changed);
  }
  await writeJson(path.join(out, 'capture.json'), {
    schema: 1,
    rendererHash: capture.source.rendererHash,
    parentCaptureHash: hash(await readFile(path.join(study, 'capture.json'))),
    toolHash: hash(await readFile(new URL(import.meta.url))),
    browser: session.browser.version(),
    scope:
      'Frozen original-printing inputs and comparison transforms. Only the full-frame outline palette is switched to the other legitimate dual color. No candidate is promoted by this trial.',
    rows,
  });
} finally {
  await session.close();
}
