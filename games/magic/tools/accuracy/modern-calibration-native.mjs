import { modernLandLayerStudy } from './modern-land-layer-study.mjs';
import { modernOrdinaryBaselineStudy } from './modern-ordinary-baseline-study.mjs';
// Source-bound Original baseline. Registration and scoring are separate steps.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { openBrowser } from './browser.mjs';
import { modernPlateControlsStudy } from './modern-plate-controls-study.mjs';
import { modernMaterialStudy } from './modern-material-study.mjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
const [inputFile, outputDirectory, ...options] = process.argv.slice(2);
const allowed = ['--retain-modern-controls', '--retain-component-rules'];
const study = allowed.find((flag) => options.includes(flag));
const componentBaseline = options.includes('--component-source-baseline');
const landLayers = options.includes('--land-layer-study');
assert(
  !(landLayers && (study || componentBaseline)),
  'Land layers require their own retained-layout study',
);
assert(
  !(componentBaseline && study),
  'Do not combine a source baseline with a retained-layout trial',
);
const materialIndex = options.indexOf('--materials');
const materialFile = materialIndex < 0 ? undefined : options[materialIndex + 1];
assert(
  !(componentBaseline && materialFile),
  'A component-source baseline cannot recolor absent plates',
);
const expectedOptions = [
  ...(landLayers ? ['--land-layer-study'] : []),
  ...(componentBaseline ? ['--component-source-baseline'] : []),
  ...(study ? [study] : []),
  ...(materialFile ? ['--materials', materialFile] : []),
];
assert(
  options.length === expectedOptions.length &&
    options.every((flag) => expectedOptions.includes(flag)),
  'Unknown or duplicate native study option',
);
assert(
  outputDirectory,
  'Usage: modern-calibration-native.mjs INPUTS OUT [--retain-modern-controls|--retain-component-rules] [--materials PARAMETERS] [--component-source-baseline] [--land-layer-study]',
);
const bytes = await readFile(inputFile),
  inputs = JSON.parse(bytes);
assert(inputs.entries.length && inputs.entries.every((e) => e.face.wordingMode === 'original'));
const out = path.resolve(outputDirectory);
await mkdir(out, { recursive: true });
const materialBytes = materialFile ? await readFile(materialFile) : null;
const materials = materialBytes ? JSON.parse(materialBytes) : null;
const materialIds = new Set(materials?.ids ?? []);
if (landLayers) {
  assert(materials && inputs.set === 'm21');
  assert(
    inputs.entries.every(
      (e) =>
        e.face.frameAssetFamily === 'm15-accurate' &&
        (e.face.canonicalTypeLine ?? e.face.typeLine ?? '').includes('Land'),
    ),
  );
  assert.equal(materialIds.size, inputs.entries.length);
}

if (materials) {
  assert.equal(materials.schema, 1);
  assert.equal(materialIds.size, materials.ids.length, 'Duplicate material study IDs');
  assert(materialIds.size > 0);
  const knownIds = new Set(inputs.entries.map((e) => e.id));
  assert(
    [...materialIds].every((id) => knownIds.has(id)),
    'Unknown material study printing',
  );
  const knownUrls = new Set(inputs.components.map((a) => a.url));
  assert(
    (materials.additionalAssets ?? []).every((url) => knownUrls.has(url)),
    'Unbound auxiliary asset',
  );
  if (materials.landTexture) {
    assert(landLayers);
    assert.deepEqual(Object.keys(materials.landTexture).sort(), ['adjustment', 'mask', 'source']);
    assert(
      [materials.landTexture.mask, materials.landTexture.source].every((url) => knownUrls.has(url)),
    );
    assert(materials.materials[materials.landTexture.source], 'Unbound texture material');
  }
  if (materials.landHeaders) {
    assert(landLayers && materials.dualHeaderMaterial);
    assert.deepEqual(Object.keys(materials.landHeaders).sort(), ['source', 'title', 'type']);
    assert(
      Object.values(materials.landHeaders).every((url) => knownUrls.has(url)),
      'Unbound header source',
    );
  }

  assert(Object.keys(materials.materials).length > 0);
  assert(
    Object.keys(materials.materials).every((url) => knownUrls.has(url)),
    'Unbound material source',
  );
}
const session = await openBrowser(inputs, {
  plugins: [
    ...(landLayers ? [modernLandLayerStudy()] : []),
    ...(componentBaseline ? [modernOrdinaryBaselineStudy()] : []),
    ...(study ? [modernPlateControlsStudy({ rules: study === '--retain-component-rules' })] : []),
    ...(materials ? [modernMaterialStudy()] : []),
  ],
});
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  const source = {
    ...(landLayers
      ? {
          landLayerStudy: {
            toolHash: hash(
              await readFile(new URL('./modern-land-layer-study.mjs', import.meta.url)),
            ),
          },
        }
      : {}),

    ...(componentBaseline
      ? {
          componentSourceBaseline: {
            toolHash: hash(
              await readFile(new URL('./modern-ordinary-baseline-study.mjs', import.meta.url)),
            ),
          },
        }
      : {}),
    ...(materialBytes
      ? {
          materialStudy: {
            parametersHash: hash(materialBytes),
            toolHash: hash(await readFile(new URL('./modern-material-study.mjs', import.meta.url))),
            selectedPrintings: materialIds.size,
            unchangedMaterialControls: inputs.entries.length - materialIds.size,
          },
        }
      : {}),
    ...(study
      ? {
          study: {
            name: study,
            toolHash: hash(
              await readFile(new URL('./modern-plate-controls-study.mjs', import.meta.url)),
            ),
          },
        }
      : {}),
    rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
    // Styles/descriptors and URL aliases live outside src. Bind them explicitly
    // so a font-weight-only change cannot resume an older pixel capture.
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
        async ({
          face,
          id,
          materialValues,
          extraAssets,
          landLayers,
          landHeaders,
          landTexture,
          dualHeaderMaterial,
        }) => {
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const { canvasAssetUrls } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
          const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
          const result = {};
          let lease;
          globalThis.__m21LandLayers = landLayers;
          globalThis.__m21LandHeaders = null;
          globalThis.__m21LandTexture = landTexture;
          delete globalThis.__m21LandTextureMask;
          delete globalThis.__m21LandHeaderMask;
          try {
            if (landLayers && landHeaders) {
              const { framePlate } = await import('/games/magic/src/presentation/frame-plates.ts');
              if (framePlate(face)?.rightFrame) {
                globalThis.__m21LandHeaders = landHeaders;
                materialValues = { ...materialValues, [landHeaders.source]: dualHeaderMaterial };
              }
            }
            lease = await loadAccuracyImages(
              [...canvasAssetUrls(face), ...extraAssets],
              new AbortController().signal,
              face.illustration,
            );
            globalThis.__m21MaterialTrial = materialValues;
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
                if (layer === 'face' && globalThis.__m21LandTextureMask)
                  result.textureMask = {
                    png: globalThis.__m21LandTextureMask,
                    width: image.width,
                    height: image.height,
                  };
                if (layer === 'face' && globalThis.__m21LandHeaderMask)
                  result.headerMask = {
                    png: globalThis.__m21LandHeaderMask,
                    width: image.width,
                    height: image.height,
                  };
              } finally {
                image.width = image.height = 0;
              }
            }
          } finally {
            lease?.dispose();
            delete globalThis.__m21MaterialTrial;
            delete globalThis.__m21LandLayers;
            delete globalThis.__m21LandHeaders;
            delete globalThis.__m21LandHeaderMask;
            delete globalThis.__m21LandTexture;
            delete globalThis.__m21LandTextureMask;
          }
          return result;
        },
        {
          face: e.face,
          id: e.id,
          materialValues: materialIds.has(e.id) ? materials.materials : {},
          extraAssets: materials?.additionalAssets ?? [],
          landLayers,
          landHeaders: materials?.landHeaders ?? null,
          landTexture: materials?.landTexture ?? null,
          dualHeaderMaterial: materials?.dualHeaderMaterial ?? null,
        },
      );
      for (const [layer, value] of Object.entries(rendered)) {
        if (layer === 'headerMask' || layer === 'textureMask') {
          const png = Buffer.from(value.png, 'base64'),
            file = e.id + '-' + layer + '.png';
          await writeFile(path.join(out, file), png);
          row.aux = {
            ...row.aux,
            [layer]: { file, sha256: hash(png), width: value.width, height: value.height },
          };
          continue;
        }
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
