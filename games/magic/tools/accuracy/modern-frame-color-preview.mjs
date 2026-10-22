// Small native material preview; external rasters stay outside the repository.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { openBrowser } from './browser.mjs';
import { modernPlateControlsStudy } from './modern-plate-controls-study.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
const [inputFile, parameterFile, output] = process.argv.slice(2);
assert(output, 'Usage: modern-frame-color-preview.mjs INPUTS PARAMETERS OUTPUT');
const inputBytes = await readFile(inputFile),
  parameterBytes = await readFile(parameterFile);
const inputs = JSON.parse(inputBytes),
  parameters = JSON.parse(parameterBytes);
assert.equal(inputs.set, 'm21');
assert.equal(parameters.schema, 1);
const entries = parameters.ids.map((id) => inputs.entries.find((e) => e.id === id));
assert(entries.every(Boolean));
const known = new Set(inputs.components.map((a) => a.url));
assert(Object.keys(parameters.materials).every((url) => known.has(url)));
const materialPlugin = {
  name: 'm21-material-trial',
  enforce: 'pre',
  transform(source, id) {
    if (!id.endsWith('/presentation/early-hsb-material.ts')) return;
    const needle = '  const symbols = new Set([';
    assert.equal(source.split(needle).length, 2);
    const addition = [
      '  for (const [url, value] of Object.entries((globalThis as any).__m21MaterialTrial ?? {})) {',
      '    if (images.has(url)) adjustments.set(url, value as FrameHsb);',
      '  }',
      needle,
    ].join('\n');
    return { code: source.replace(needle, addition), map: null };
  },
};
const session = await openBrowser(
  { ...inputs, entries },
  { plugins: [modernPlateControlsStudy({ rules: true }), materialPlugin] },
);
await mkdir(output, { recursive: true });
const sourceInfo = {
  inputsHash: hash(inputBytes),
  parametersHash: hash(parameterBytes),
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  rasterHelpers: await Promise.all(
    ['canvas-images.ts', 'canvas-raster.ts', 'image-cover.ts', 'asset-fetch.ts'].map(
      async (file) => [file, hash(await readFile(path.join(root, 'packages/browser/src', file)))],
    ),
  ),
  packMetadata: await Promise.all(
    ['assets.json', 'fonts.css'].map(async (file) => [
      file,
      hash(await readFile(path.join(root, 'games/magic', file))),
    ]),
  ),
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  tools: await Promise.all(
    [
      'modern-frame-color-preview.mjs',
      'modern-plate-controls-study.mjs',
      'browser.mjs',
      'abu-assets.mjs',
    ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
  ),
};
const rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
  });
  for (const e of entries) {
    assert.equal(e.face.wordingMode, 'original');
    assert.equal(e.face.frameAssetFamily, 'm15-accurate');
    const variants = await session.page.evaluate(
      async ({ face, materials }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const lease = await loadAccuracyImages(
          canvasAssetUrls(face),
          new AbortController().signal,
          face.illustration,
        );
        const output = {};
        try {
          for (const [name, value] of [
            ['before', {}],
            ['after', materials],
          ]) {
            globalThis.__m21MaterialTrial = value;
            const canvas = await composeCardTexture(
              { face, printingId: null, printedImage: null },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            output[name] = canvas.toDataURL().split(',')[1];
            canvas.width = canvas.height = 0;
          }
          return output;
        } finally {
          delete globalThis.__m21MaterialTrial;
          lease.dispose();
        }
      },
      { face: e.face, materials: parameters.materials },
    );
    const row = {
      id: e.id,
      name: e.card.name,
      number: e.card.collector_number,
      referenceHash: e.reference.sha256,
      inputHash: hash(JSON.stringify(e.face)),
      variants: {},
    };
    for (const [name, png] of Object.entries(variants)) {
      const bytes = Buffer.from(png, 'base64'),
        file = e.id + '-' + name + '.png';
      await (await import('node:fs/promises')).writeFile(path.join(output, file), bytes);
      row.variants[name] = { file, sha256: hash(bytes) };
    }
    rows.push(row);
    console.log(e.card.name);
  }
  assert.deepEqual(session.faults, []);
  await writeJson(path.join(output, 'preview.json'), {
    schema: 1,
    status: 'native-material-preview-not-set-validation',
    source: sourceInfo,
    rows,
    faults: session.faults,
  });
} finally {
  await session.close();
}
