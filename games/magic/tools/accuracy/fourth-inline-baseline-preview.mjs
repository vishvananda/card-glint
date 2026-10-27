import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';

const [inputFile, captureFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS CURRENT_CAPTURE NEW_DIRECTORY');
const raw = await Promise.all([inputFile, captureFile].map((f) => fs.readFile(f)));
const [input, capture] = raw.map((r) => JSON.parse(r));
const rendererHash = await sourceHash(root + '/games/magic/src');
assert.equal(capture.rendererHash, rendererHash);
assert.equal(capture.inputHash, hash(raw[0]));
const names = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Sunken City', 'Stasis'];
const entries = names.map((name) =>
  input.entries.find((e) => e.card.set === '4ed' && e.name === name),
);
assert(entries.every(Boolean));
await fs.mkdir(out);
const session = await openBrowser(
  { ...input, components: [...input.components, ...(capture.extraAssets ?? [])] },
  {
    plugins: [
      {
        name: 'fourth-inline-baseline-preview',
        enforce: 'pre',
        transform(code, id) {
          if (!id.split('?')[0].endsWith('/presentation/retro-details.ts')) return;
          const n =
            'export const paintFourthMana: typeof paintMana = (c, symbol, x, y, size, images) => {';
          assert.equal(code.split(n).length, 2);
          return code.replace(
            n,
            n + '\n if ((globalThis as any).__inlinePreview?.(c,symbol,x,y,size,images)) return;',
          );
        },
      },
    ],
  },
);
const rows = [];
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
      const { paintFourthMana } = await import('/games/magic/src/presentation/retro-details.ts');
      const signal = new AbortController().signal;
      const lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration);
      const modes = {};
      try {
        for (const dy of [0, -0.1]) {
          let active = false;
          const symbols = [];
          globalThis.__inlinePreview = (c, symbol, x, y, size, images) => {
            if (active || !['T', 'W', 'U', 'B', 'R', 'G'].includes(symbol)) return false;
            const m = c.getTransform();
            symbols.push({ symbol, x, y, size, matrix: [m.a, m.b, m.c, m.d, m.e, m.f] });
            c.save();
            active = true;
            try {
              c.translate(0, dy * size);
              paintFourthMana(c, symbol, x, y, size, images);
            } finally {
              active = false;
              c.restore();
            }
            return true;
          };
          const image = await composeCardTexture(
            { face: e.face, printingId: e.id, printedImage: null },
            'inspect',
            signal,
            { loadImages: async () => ({ ...lease, dispose() {} }) },
          );
          try {
            modes[dy === 0 ? 'current' : 'up'] = { png: image.toDataURL().split(',')[1], symbols };
          } finally {
            image.width = image.height = 0;
          }
        }
      } finally {
        delete globalThis.__inlinePreview;
        lease.dispose();
      }
      return modes;
    }, e);
    const baseline = capture.rows.find((r) => r.id === e.id).modes.original;
    assert.equal(hash(Buffer.from(result.current.png, 'base64')), baseline.sha256);
    const native = PNG.sync.read(Buffer.from(result.current.png, 'base64'));
    const row = { id: e.id, name: e.name, referenceHash: e.reference.sha256, modes: {} };
    const windows = result.current.symbols.map((s) => {
      assert.deepEqual(s.matrix, [1.5, 0, 0, 1.5, 0, 0]);
      return [
        Math.floor(s.x) - 2,
        Math.floor(s.y - s.size * 0.1) - 2,
        Math.ceil(s.size) + 5,
        Math.ceil(s.size * 1.1) + 5,
      ];
    });
    for (const [mode, r] of Object.entries(result)) {
      const bytes = Buffer.from(r.png, 'base64'),
        file = e.id + '-' + mode + '.png';
      if (mode === 'current')
        await fs.link(path.join(path.dirname(captureFile), baseline.file), path.join(out, file));
      else await fs.writeFile(path.join(out, file), bytes);
      const image = PNG.sync.read(bytes);
      let changed = 0;
      for (let y = 0; y < image.height; y++)
        for (let x = 0; x < image.width; x++) {
          const i = (y * image.width + x) * 4;
          if ([0, 1, 2, 3].some((k) => image.data[i + k] !== native.data[i + k])) {
            changed++;
            assert.equal(image.data[i + 3], native.data[i + 3]);
            assert(
              windows.some(
                ([a, b, w, h]) =>
                  x >= a * 1.5 && x < (a + w) * 1.5 && y >= b * 1.5 && y < (b + h) * 1.5,
              ),
              'Outside-symbol pixel changed',
            );
          }
        }
      row.modes[mode] = { file, sha256: hash(bytes), symbols: r.symbols, changedPixels: changed };
    }
    rows.push(row);
    console.log(e.name);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(root + '/games/magic/src'), rendererHash);
  await writeJson(path.join(out, 'study.json'), {
    schema: 1,
    status: 'inline-baseline-visual-prototypes-not-adopted',
    rendererHash,
    inputHash: hash(raw[0]),
    captureHash: hash(raw[1]),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    dy: -0.1,
    rows,
  });
} finally {
  await session.close();
}
