// Source-bound Original baseline. Registration and scoring are separate steps.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { openBrowser } from './browser.mjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
const [inputFile, outputDirectory] = process.argv.slice(2);
assert(outputDirectory, 'Usage: modern-calibration-native.mjs INPUTS OUT');
const bytes = await readFile(inputFile),
  inputs = JSON.parse(bytes);
assert(inputs.entries.length && inputs.entries.every((e) => e.face.wordingMode === 'original'));
const out = path.resolve(outputDirectory);
await mkdir(out, { recursive: true });
const session = await openBrowser(inputs);
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  const source = {
    rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
    inputsHash: hash(bytes),
    toolHash: hash(await readFile(new URL(import.meta.url))),
    commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    browser: await session.browser.version(),
    node: process.version,
    components: inputs.components.map((a) => [a.url, a.sha256]),
  };
  let rows = [];
  try {
    const prior = JSON.parse(await readFile(path.join(out, 'capture.json')));
    assert.deepEqual(prior.source, source, 'Use a new directory when inputs or renderer change');
    rows = prior.rows;
    for (const r of rows)
      for (const layer of Object.values(r.layers ?? {}))
        assert.equal(hash(await readFile(path.join(out, layer.file))), layer.sha256);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await writeFile(path.join(out, 'inputs.json'), bytes);
  const save = () =>
    writeJson(path.join(out, 'capture.json'), {
      schema: 1,
      set: inputs.set,
      scope:
        'Native Original face and etching baseline only; no normalization, layout/overflow certification, score or completion claim.',
      source,
      denominator: inputs.entries.length,
      completed: rows.length,
      faults: session.faults,
      rows,
    });
  for (const e of inputs.entries) {
    if (rows.some((r) => r.id === e.id)) continue;
    assert(/^[a-f0-9-]{36}$/.test(e.id));
    const row = {
      id: e.id,
      name: e.card.name,
      number: e.card.collector_number,
      referenceHash: e.reference.sha256,
      artHash: e.art.sha256,
      inputHash: hash(JSON.stringify(e.face)),
      layers: {},
    };
    try {
      const rendered = await session.page.evaluate(
        async ({ face, id }) => {
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const { canvasAssetUrls } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
          const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
          const lease = await loadAccuracyImages(
            canvasAssetUrls(face),
            new AbortController().signal,
            face.illustration,
          );
          const result = {};
          try {
            for (const layer of ['face', 'etching']) {
              const image = await composeCardTexture(
                {
                  face,
                  printingId: id,
                  printedImage: null,
                  layer: layer === 'face' ? undefined : layer,
                },
                'inspect',
                new AbortController().signal,
                { loadImages: async () => ({ ...lease, dispose() {} }) },
              );
              try {
                result[layer] = {
                  png: image.toDataURL().split(',')[1],
                  width: image.width,
                  height: image.height,
                };
              } finally {
                image.width = image.height = 0;
              }
            }
          } finally {
            lease.dispose();
          }
          return result;
        },
        { face: e.face, id: e.id },
      );
      for (const [layer, value] of Object.entries(rendered)) {
        assert.equal(value.width, 732);
        assert.equal(value.height, 1020);
        const png = Buffer.from(value.png, 'base64'),
          file = e.id + (layer === 'face' ? '' : '-etching') + '.png';
        await writeFile(path.join(out, file), png);
        row.layers[layer] = {
          file,
          sha256: hash(png),
          bytes: png.length,
          width: value.width,
          height: value.height,
        };
      }
    } catch (error) {
      row.issue = String(error.stack ?? error);
    }
    rows.push(row);
    await save();
    if (rows.length % 25 === 0) console.log(inputs.set, rows.length, '/', inputs.entries.length);
  }
  await save();
  assert.equal(session.faults.length, 0, 'Uncached or missing sources');
  assert.equal(rows.filter((r) => r.issue).length, 0, 'Native failures retained in capture');
  console.log(
    JSON.stringify({ set: inputs.set, completed: rows.length, layers: rows.length * 2, faults: 0 }),
  );
} finally {
  await session.close();
}
