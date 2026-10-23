// Offline native capture. Study parameters never become per-card scan offsets.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { eighthFooterStudy } from './eighth-footer-native-study.mjs';
import { eighthHeadingStudy } from './eighth-heading-study.mjs';
import { modernMaterialStudy } from './modern-material-study.mjs';
import { modernRulesStudyPlugin } from './modern-rules-study-plugin.mjs';
import { eighthRulesStudyPlugin } from './eighth-rules-study-plugin.mjs';
const [inputFile, out, studyFile] = process.argv.slice(2);
assert(out, 'Usage: printing-calibration-native.mjs INPUTS OUT [EIGHTH_STUDY]');
execFileSync(process.execPath, [path.join(root, 'games/magic/tools/build-set-data.mjs')], {
  cwd: root,
  stdio: 'inherit',
});
const inputBytes = await readFile(inputFile),
  inputs = JSON.parse(inputBytes);
assert(inputs.entries.length && inputs.entries.every((e) => e.face.wordingMode === 'original'));
const studyBytes = studyFile ? await readFile(studyFile) : null;
const study = studyBytes ? JSON.parse(studyBytes) : null;
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
const painterHash = hash(
  await readFile(path.join(root, 'games/magic/src/presentation/canvas-text.ts')),
);
if (study) {
  assert.equal(inputs.set, '8ed');
  assert.equal(study.schema, 1);
  assert.equal(study.inputsHash, hash(inputBytes));
  assert.equal(study.rendererHash, rendererHash);
  assert.equal(study.painterHash, painterHash);
  if (study.materials) {
    const known = new Set(inputs.components.map((a) => a.url));
    for (const [url, value] of Object.entries(study.materials)) {
      assert(known.has(url), 'Material is absent from frozen input assets');
      for (const p of [
        'mask' in value ? value.frame : value,
        ...('mask' in value ? [value.paper] : []),
      ]) {
        assert(Number.isFinite(p.hueDegrees) && Math.abs(p.hueDegrees) <= 180);
        assert(
          Number.isFinite(p.saturationScale) && p.saturationScale >= 0 && p.saturationScale <= 3,
        );
        assert(
          Number.isFinite(p.brightnessScale) && p.brightnessScale >= 0.3 && p.brightnessScale <= 2,
        );
      }
    }
  }
  if (study.rules) {
    for (const [key, value] of Object.entries(study.rules)) {
      if (key === 'typography') {
        const bounds = {
          leading: [0.8, 1.3],
          paragraphGap: [0.1, 1.2],
          flavorGap: [0.3, 2],
          textWidth: [0.85, 1.15],
        };
        for (const [k, v] of Object.entries(value)) {
          if (k === 'fractionalMetrics') assert.equal(typeof v, 'boolean');
          else assert(bounds[k] && Number.isFinite(v) && v >= bounds[k][0] && v <= bounds[k][1]);
        }
      } else {
        const bounds = {
          maximumSize: [15, 26],
          dx: [-10, 10],
          dy: [-10, 10],
          widthDelta: [-30, 30],
          heightDelta: [-30, 30],
        };
        assert(
          bounds[key] &&
            Number.isFinite(value) &&
            value >= bounds[key][0] &&
            value <= bounds[key][1],
        );
      }
    }
  }
  assert(
    inputs.entries.every((e) => e.face.frameAssetFamily === 'eighth' && !e.face.frameTreatment),
  );
}
await mkdir(out, { recursive: true });
const session = await openBrowser(inputs, {
  plugins: study
    ? [
        eighthHeadingStudy(study.headings, painterHash),
        ...(study.footer ? [eighthFooterStudy(study.footer, study.footerHash)] : []),
        ...(study.materials ? [modernMaterialStudy()] : []),
        ...(study.rules ? [modernRulesStudyPlugin(), eighthRulesStudyPlugin()] : []),
      ]
    : [],
});
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  const source = {
    inputsHash: hash(inputBytes),
    rendererHash,
    toolHash: hash(await readFile(new URL(import.meta.url))),
    studyHash: studyBytes ? hash(studyBytes) : null,
    studyToolHash: hash(await readFile(new URL('./eighth-heading-study.mjs', import.meta.url))),
    studyDependencies: await Promise.all(
      [
        'eighth-footer-native-study.mjs',
        'modern-material-study.mjs',
        'modern-rules-study-plugin.mjs',
        'modern-rules-orphan-study.mjs',
        'modern-rules-typography-study.mjs',
        'eighth-rules-study-plugin.mjs',
      ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
    ),
    painterHash,
    browser: await session.browser.version(),
    node: process.version,
    helpers: await Promise.all(
      [
        'games/magic/tools/accuracy/browser.mjs',
        'games/magic/tools/accuracy/abu-assets.mjs',
        'packages/browser/src/canvas-images.ts',
        'packages/browser/src/canvas-raster.ts',
        'packages/browser/src/image-cover.ts',
        'packages/browser/src/asset-fetch.ts',
        'games/magic/fonts.css',
        'games/magic/assets.json',
        'package-lock.json',
      ].map(async (f) => [f, hash(await readFile(path.join(root, f)))]),
    ),
    components: inputs.components.map((a) => [a.url, a.sha256]),
  };
  let rows = [];
  try {
    const prior = JSON.parse(await readFile(path.join(out, 'capture.json')));
    assert.deepEqual(prior.source, source, 'Changed capture inputs; use a new output directory');
    rows = prior.rows;
    for (const r of rows)
      for (const v of Object.values(r.layers))
        assert.equal(hash(await readFile(path.join(out, v.file))), v.sha256);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  await writeFile(path.join(out, 'inputs.json'), inputBytes);
  const save = () =>
    writeJson(path.join(out, 'capture.json'), {
      schema: 1,
      set: inputs.set,
      source,
      denominator: inputs.entries.length,
      scope: 'Original native face and etching replay; no metric or calibration approval.',
      completed: rows.length,
      faults: session.faults,
      rows,
    });
  for (const e of inputs.entries) {
    if (rows.some((r) => r.id === e.id)) continue;
    assert(/^[a-f0-9-]{36}$/.test(e.id));
    const rendered = await session.page.evaluate(
      async ({ e, study }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const lease = await loadAccuracyImages(
          canvasAssetUrls(e.face),
          new AbortController().signal,
          e.face.illustration,
        );
        const result = {};
        globalThis.__m21MaterialTrial = study?.materials ?? {};
        globalThis.__modernRulesStudy = study?.rules ?? {};
        globalThis.__eighthHeadingStudy = study?.headings
          ? { name: e.face.name, typeLine: e.face.typeLine }
          : undefined;
        try {
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
          delete globalThis.__eighthHeadingStudy;
          delete globalThis.__m21MaterialTrial;
          delete globalThis.__modernRulesStudy;
          lease.dispose();
        }
        return result;
      },
      { e, study },
    );
    const row = {
      id: e.id,
      name: e.card.name,
      number: e.card.collector_number,
      referenceHash: e.reference.sha256,
      artHash: e.art.sha256,
      inputHash: hash(JSON.stringify(e.face)),
      layers: {},
    };
    for (const [layer, v] of Object.entries(rendered)) {
      assert.equal(v.width, 732);
      assert.equal(v.height, 1020);
      const bytes = Buffer.from(v.png, 'base64'),
        file = e.id + (layer === 'face' ? '' : '-etching') + '.png';
      await writeFile(path.join(out, file), bytes);
      row.layers[layer] = { file, sha256: hash(bytes), width: v.width, height: v.height };
    }
    rows.push(row);
    await save();
    if (rows.length % 25 === 0) console.log(rows.length, '/', inputs.entries.length);
  }
  assert.equal(
    await sourceHash(path.join(root, 'games/magic/src')),
    rendererHash,
    'Source changed during capture',
  );
  assert.deepEqual(session.faults, []);
  await save();
  console.log(JSON.stringify({ completed: rows.length, study: Boolean(study) }));
} finally {
  await session.close();
}
