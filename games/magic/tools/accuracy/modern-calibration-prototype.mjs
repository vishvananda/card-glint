// Full Original face/etching replay for a shared experimental profile, never publication evidence alone.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { modernPrototypePlugin } from './modern-prototype-materials.mjs';
const [inputFile, beforeDirectory, parameterFile, out] = process.argv.slice(2);
assert(out, 'Usage: modern-calibration-prototype.mjs INPUTS NATIVE_BEFORE PARAMETERS OUT');
const read = async (file) => {
  const bytes = await readFile(file);
  return { bytes, data: JSON.parse(bytes) };
};
const inputs = await read(inputFile),
  before = await read(path.join(beforeDirectory, 'capture.json')),
  p = await read(parameterFile),
  parameters = p.data;
assert(inputs.data.entries.every((e) => e.face.wordingMode === 'original'));
assert.equal(parameters.schema, 1);
assert.equal(parameters.set, inputs.data.set);
assert.equal(before.data.source.inputsHash, hash(inputs.bytes));
const source = {
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  inputsHash: hash(inputs.bytes),
  baselineHash: hash(before.bytes),
  parametersHash: hash(p.bytes),
  tools: Object.fromEntries(
    await Promise.all(
      [
        'modern-calibration-prototype.mjs',
        'modern-prototype-materials.mjs',
        'modern-prototype-images.mjs',
        'modern-footer-study-plugin.mjs',
      ].map(async (file) => [file, hash(await readFile(new URL(file, import.meta.url)))]),
    ),
  ),
};
assert.equal(source.rendererHash, before.data.source.rendererHash);
const manifest = JSON.parse(await readFile(path.join(root, 'games/magic/assets.json')));
const font = await cachedFetch(manifest.CONJURER_ROOT + '/data/fonts/gotham-medium.ttf', {
  offline: true,
});
source.extraFonts = [font];
for (const g of Object.values(parameters.largeLandSymbols ?? {})) {
  assert.deepEqual(g.body.length, 3);
  assert.deepEqual(g.sourceInk.length, 3);
  const source = inputs.data.components.find((a) => a.url === g.source);
  assert(source);
  assert.equal(source.sha256, g.sha256);
}
await mkdir(out, { recursive: true });
await writeFile(path.join(out, 'inputs.json'), inputs.bytes);
await writeFile(path.join(out, 'parameters.json'), p.bytes);
const session = await openBrowser(
  { ...inputs.data, components: [...inputs.data.components, font] },
  { plugins: [modernPrototypePlugin()] },
);
const rows = [];
try {
  await session.page.evaluate(
    async ({ parameters, url }) => {
      await import('/games/magic/src/data/eager.ts');
      await import('/games/magic/src/data/eager-wording.ts');
      const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
      await loadCanvasFonts();
      const font = new FontFace('Study M21 Gotham', `url("${url}")`);
      document.fonts.add(await font.load());
      globalThis.__m21FooterCandidate = parameters.footer ?? {};
      globalThis.__m21LargeLandStudy = parameters.largeLandSymbols ?? {};
    },
    { parameters, url: font.url },
  );
  for (const e of inputs.data.entries) {
    const b = before.data.rows.find((r) => r.id === e.id);
    assert(b && !b.issue);
    assert.equal(b.inputHash, hash(JSON.stringify(e.face)));
    const rendered = await session.page.evaluate(
      async ({ e, parameters }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { prototypeGlyphImages } = await import(
          '/games/magic/tools/accuracy/modern-prototype-images.mjs'
        );
        const lease = await loadAccuracyImages(
          canvasAssetUrls(e.face),
          new AbortController().signal,
          e.face.illustration,
        );
        try {
          const images = await prototypeGlyphImages(lease.images, parameters),
            result = {};
          for (const layer of ['face', 'etching']) {
            const image = await composeCardTexture(
              {
                face: e.face,
                printingId: e.id,
                printedImage: null,
                layer: layer === 'face' ? undefined : layer,
              },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, images, dispose() {} }) },
            );
            result[layer] = image.toDataURL().split(',')[1];
            image.width = image.height = 0;
          }
          return result;
        } finally {
          lease.dispose();
        }
      },
      { e, parameters },
    );
    const row = {
      id: e.id,
      name: e.card.name,
      number: e.card.collector_number,
      inputHash: b.inputHash,
      referenceHash: e.reference.sha256,
      layers: {},
      invariants: {},
    };
    const basic = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.test(
      e.face.canonicalTypeLine ?? e.face.typeLine,
    );
    for (const [layer, data] of Object.entries(rendered)) {
      const bytes = Buffer.from(data, 'base64'),
        image = PNG.sync.read(bytes),
        previousBytes = await readFile(path.join(beforeDirectory, b.layers[layer].file));
      assert.equal(hash(previousBytes), b.layers[layer].sha256);
      const previous = PNG.sync.read(previousBytes);
      assert.deepEqual([image.width, image.height], [previous.width, previous.height]);
      let outside = 0,
        alpha = 0,
        changed = 0;
      for (let y = 0; y < image.height; y++)
        for (let x = 0; x < image.width; x++) {
          const at = (y * image.width + x) * 4;
          const differs = [0, 1, 2, 3].some((k) => image.data[at + k] !== previous.data[at + k]);
          if (image.data[at + 3] !== previous.data[at + 3]) alpha++;
          if (!differs) continue;
          changed++;
          const cx = (x + 0.5) / 1.5,
            cy = (y + 0.5) / 1.5;
          const footer = cx >= 20 && cx <= 468 && cy >= 628 && cy <= 672;
          const glyph = basic && cx >= 128 && cx <= 368 && cy >= 425 && cy <= 630;
          if (!footer && !glyph) outside++;
        }
      const file = e.id + (layer === 'face' ? '' : '-etching') + '.png';
      await writeFile(path.join(out, file), bytes);
      row.layers[layer] = {
        file,
        sha256: hash(bytes),
        bytes: bytes.length,
        width: image.width,
        height: image.height,
      };
      row.invariants[layer] = {
        changedPixels: changed,
        outsideApprovedRegions: outside,
        alphaChanged: alpha,
      };
    }
    rows.push(row);
    await writeJson(path.join(out, 'capture.json'), {
      schema: 1,
      set: inputs.data.set,
      scope:
        'Complete shared-profile Original prototype only. Fixed input/asset identities; full native face and etching, with strict regional/alpha deltas. No renderer adoption, Oracle-mode validation, registration certification or set-completion claim.',
      source,
      denominator: inputs.data.entries.length,
      completed: rows.length,
      faults: session.faults,
      rows,
    });
    assert(
      Object.values(row.invariants).every(
        (r) => r.outsideApprovedRegions === 0 && r.alphaChanged === 0,
      ),
      'Prototype changed an unapproved region or silhouette: ' + e.card.name,
    );
    if (rows.length % 25 === 0)
      console.log('prototype', rows.length, '/', inputs.data.entries.length);
  }
  assert.deepEqual(session.faults, []);
  console.log(
    JSON.stringify({
      completed: rows.length,
      layers: rows.length * 2,
      faults: 0,
      regionalInvariants: true,
    }),
  );
} finally {
  await session.page
    .evaluate(async () => {
      const { clearPrototypeGlyphs } = await import(
        '/games/magic/tools/accuracy/modern-prototype-images.mjs'
      );
      clearPrototypeGlyphs();
    })
    .catch(() => {});
  await session.close();
}
