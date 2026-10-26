// Observe actual painted black-symbol bounds; reject changes elsewhere.
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs/promises';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';
const [inputFile, beforeDirectory, afterDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: revised-black-paper-review.mjs INPUTS BEFORE AFTER NEW_OUTPUT');
const inputBytes = await fs.readFile(inputFile),
  inputs = JSON.parse(inputBytes),
  beforeBytes = await fs.readFile(path.join(beforeDirectory, 'capture.json')),
  afterBytes = await fs.readFile(path.join(afterDirectory, 'capture.json')),
  before = JSON.parse(beforeBytes),
  after = JSON.parse(afterBytes),
  rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(before.status, 'complete');
assert.equal(after.status, 'complete');
assert.equal(after.rendererHash, rendererHash);
assert.equal(before.inputHash, hash(inputBytes));
assert.equal(after.inputHash, hash(inputBytes));
assert.deepEqual(before.faults, []);
assert.deepEqual(after.faults, []);
assert.equal(inputs.entries.length, 306);
assert.deepEqual(
  before.rows.map((r) => r.id),
  after.rows.map((r) => r.id),
);
const ssr = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false } });
let wording;
try {
  await ssr.ssrLoadModule('/games/magic/src/data/eager.ts');
  await ssr.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  wording = (await ssr.ssrLoadModule('/games/magic/src/presentation/wording.ts')).withCardWording;
} finally {
  await ssr.close();
}
const hook = [
  "  if (symbol === 'B') {",
  '    const t = context.getTransform();',
  '    const p = [[x,y],[x+size,y],[x,y+size],[x+size,y+size]]',
  '      .map(([u,v]) => [t.a*u+t.c*v+t.e,t.b*u+t.d*v+t.f]);',
  '    const left=Math.floor(Math.min(...p.map(v=>v[0])))-2;',
  '    const top=Math.floor(Math.min(...p.map(v=>v[1])))-2;',
  '    const right=Math.ceil(Math.max(...p.map(v=>v[0])))+2;',
  '    const bottom=Math.ceil(Math.max(...p.map(v=>v[1])))+2;',
  '    (globalThis.__blackPaperBounds ??= []).push([left,top,right-left,bottom-top]);',
  '  }',
  '',
].join('\n');
let transformed = 0;
const session = await openBrowser(
  { ...inputs, components: [...(inputs.components ?? []), ...after.extraAssets] },
  {
    plugins: [
      {
        name: 'observe-black-mana-bounds',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('/games/magic/src/presentation/canvas-text.ts')) return;
          const needle = "  if (symbol === 'W' && images.originalWhiteGlyph) {";
          assert.equal(code.split(needle).length, 2);
          transformed++;
          return code.replace(needle, hook + needle);
        },
      },
    ],
  },
);
const rows = [],
  counts = {};
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
try {
  for (const e of inputs.entries) {
    const b = before.rows.find((r) => r.id === e.id),
      a = after.rows.find((r) => r.id === e.id);
    assert.equal(b.referenceHash, a.referenceHash);
    assert.equal(b.artHash, a.artHash);
    const modes = {};
    for (const mode of ['original', 'oracle', 'oracle-modern', 'etching']) {
      const v = b.modes[mode],
        w = a.modes[mode],
        bb = await fs.readFile(path.join(beforeDirectory, v.file)),
        ab = await fs.readFile(path.join(afterDirectory, w.file));
      assert.equal(hash(bb), v.sha256);
      assert.equal(hash(ab), w.sha256);
      assert.equal(v.inputHash, w.inputHash);
      assert.deepEqual(v.layout, w.layout);
      const changed = v.sha256 !== w.sha256,
        keyChanged = v.keyHash !== w.keyHash;
      if (changed) assert(keyChanged, 'Visible change without fresh key');
      if (['oracle-modern', 'etching'].includes(mode)) {
        assert(!changed);
        assert(!keyChanged);
      }
      const item = {
        before: v.sha256,
        after: w.sha256,
        inputHash: w.inputHash,
        keyBefore: v.keyHash,
        keyAfter: w.keyHash,
        changed,
        keyChanged,
      };
      if (changed) {
        const face =
          mode === 'original'
            ? e.face
            : wording(
                e.face,
                {
                  original: e.face,
                  oracle: {
                    typeLine: e.card.type_line,
                    rulesText: e.card.oracle_text ?? '',
                    power: e.card.power,
                    toughness: e.card.toughness,
                  },
                },
                'oracle',
                { symbolStyle: 'original' },
              );
        assert.equal(hash(JSON.stringify(face)), w.inputHash);
        const observed = await session.page.evaluate(
          async ({ face, id }) => {
            await import('/games/magic/src/data/eager.ts');
            await import('/games/magic/src/data/eager-wording.ts');
            const { composeCardTexture } = await import(
                '/games/magic/src/presentation/canvas-face.ts'
              ),
              { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts'),
              { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs'),
              signal = new AbortController().signal,
              lease = await loadAccuracyImages(canvasAssetUrls(face), signal, face.illustration);
            globalThis.__blackPaperBounds = [];
            try {
              const c = await composeCardTexture(
                { face, printingId: id, printedImage: null },
                'inspect',
                signal,
                {
                  loadImages: async () => ({ ...lease, dispose() {} }),
                },
              );
              try {
                return { png: c.toDataURL().split(',')[1], bounds: globalThis.__blackPaperBounds };
              } finally {
                c.width = c.height = 0;
              }
            } finally {
              lease.dispose();
            }
          },
          { face, id: e.id },
        );
        assert.equal(
          hash(Buffer.from(observed.png, 'base64')),
          w.sha256,
          'Observation changed raster',
        );
        assert(observed.bounds.length);
        const p = PNG.sync.read(bb),
          n = PNG.sync.read(ab);
        assert.equal(p.width, 732);
        assert.equal(p.height, 1020);
        assert.equal(n.width, p.width);
        assert.equal(n.height, p.height);
        let pixels = 0,
          outside = 0,
          alpha = 0;
        for (let i = 0; i < p.width * p.height; i++) {
          const at = i * 4;
          if (p.data[at + 3] !== n.data[at + 3]) alpha++;
          if ([0, 1, 2].every((c) => p.data[at + c] === n.data[at + c])) continue;
          pixels++;
          const x = i % p.width,
            y = Math.floor(i / p.width);
          if (!observed.bounds.some(([l, t, w, h]) => x >= l && x < l + w && y >= t && y < t + h))
            outside++;
        }
        assert(pixels);
        assert.equal(outside, 0, e.name + '/' + mode);
        assert.equal(alpha, 0);
        item.isolation = { pixels, outside, alpha, bounds: observed.bounds };
      }
      const c = (counts[mode] ??= { changed: 0, unchanged: 0, keysChanged: 0 });
      c[changed ? 'changed' : 'unchanged']++;
      c.keysChanged += +keyChanged;
      modes[mode] = item;
    }
    rows.push({
      id: e.id,
      name: e.name,
      referenceHash: a.referenceHash,
      artHash: a.artHash,
      modes,
    });
    if (rows.length % 25 === 0)
      console.log('Black mana isolation', rows.length, '/', inputs.entries.length);
  }
  assert.equal(transformed, 1);
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
  await writeJson(output, {
    schema: 1,
    status: 'native-revised-black-paper-isolation',
    scope:
      'All 306 printings and four modes; observed native bounds, no scan-alignment or whole-set certification claim.',
    beforeRenderer: before.rendererHash,
    afterRenderer: rendererHash,
    inputHash: hash(inputBytes),
    beforeCaptureHash: hash(beforeBytes),
    afterCaptureHash: hash(afterBytes),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    hookHash: hash(hook),
    browser: session.browser.version(),
    faults: session.faults,
    counts,
    rows,
  });
  console.log(JSON.stringify(counts));
} finally {
  await session.close();
}
