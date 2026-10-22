// Full ordinary M21 text study. Reuses cached scans/fonts/glyphs; artwork is
// never decoded and no frame is repainted for a text-only parameter trial.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { openBrowser } from './browser.mjs';
import { modernRulesStudyPlugin } from './modern-rules-study-plugin.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';

const [inputFile, nativeDirectory, scoreDirectory, parameterFile, output] = process.argv.slice(2);
assert(output, 'Usage: modern-rules-study.mjs INPUTS NATIVE SCORES PARAMETERS OUTPUT');
const read = async (file) => {
  const bytes = await readFile(file);
  return { data: JSON.parse(bytes), sha256: hash(bytes) };
};
const inputs = await read(inputFile),
  native = await read(path.join(nativeDirectory, 'capture.json')),
  scores = await read(path.join(scoreDirectory, 'scores.json')),
  parameters = await read(parameterFile);
assert.equal(inputs.data.set, 'm21');
assert.equal(inputs.sha256, native.data.source.inputsHash);
assert.equal(inputs.sha256, scores.data.definition.inputsHash);
assert.equal(native.sha256, scores.data.definition.nativeCaptureHash);
assert.equal(native.data.completed, 297);
assert.equal(inputs.data.entries.length, 297);
assert.equal(scores.data.rows.length, 297);
assert.deepEqual(native.data.faults, []);
assert(inputs.data.entries.every((e) => e.face.wordingMode === 'original'));
const p = parameters.data;
assert.equal(p.schema, 1);
assert.deepEqual(p.candidates[0], { id: 'current', adjustment: {} });
assert.equal(new Set(p.candidates.map((c) => c.id)).size, p.candidates.length);
const families = new Set(['CardRenderer MTG MPlantin', ...(p.fonts ?? []).map((f) => f.family)]);
for (const c of p.candidates) {
  assert.match(c.id, /^[a-z0-9.-]+$/);
  for (const [key, value] of Object.entries(c.adjustment)) {
    if (key === 'retainSize') {
      assert.equal(typeof value, 'boolean');
      continue;
    }
    if (key === 'fontFamily') {
      assert(families.has(value));
      continue;
    }
    if (key === 'typography') {
      const ranges = {
        leading: [0.8, 1.3],
        paragraphGap: [0.1, 1.2],
        flavorGap: [0.3, 2],
        textWidth: [0.85, 1.15],
        centerOffset: [-15, 15],
      };
      for (const [k, v] of Object.entries(value))
        assert(ranges[k] && Number.isFinite(v) && v >= ranges[k][0] && v <= ranges[k][1]);
      continue;
    }
    const ranges = {
      maximumSize: [15, 26],
      dx: [-10, 10],
      dy: [-10, 10],
      widthDelta: [-30, 30],
      heightDelta: [-30, 30],
    };
    assert(
      ranges[key] && Number.isFinite(value) && value >= ranges[key][0] && value <= ranges[key][1],
    );
  }
}
const toolFiles = [
  'modern-rules-study.mjs',
  'modern-rules-study-plugin.mjs',
  'modern-rules-study-browser.mjs',
  'text-filled-objective.mjs',
  'abu-type-objective.mjs',
  'native-text-window.mjs',
  'edges.mjs',
  'abu-assets.mjs',
  'browser.mjs',
];
const definition = {
  schema: 1,
  set: 'm21',
  inputsHash: inputs.sha256,
  nativeHash: native.sha256,
  scoresHash: scores.sha256,
  parametersHash: parameters.sha256,
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
  tools: await Promise.all(
    toolFiles.map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
  ),
  scope:
    'Native1.5x isolated rules painting, fixed frozen scan pixels and semantic badge exclusions. No artwork or frame is redrawn. Shared candidates only; no scan pose changes. Search objective combines symmetric edge distances with filled-ink overlap and is distinct from the published score. All297 sources retained, with separate basic/PW rows. Selection requires complete comparable candidate coverage, then full-card native validation.',
};
assert.equal(definition.rendererHash, native.data.source.rendererHash);
assert.deepEqual(
  native.data.source.rasterHelpers,
  definition.rasterHelpers,
  'Refresh the native baseline: generic raster helpers changed',
);
assert.deepEqual(
  native.data.source.packMetadata,
  definition.packMetadata,
  'Refresh the native baseline: font styles and asset aliases must be explicitly bound',
);
const rows = [];
try {
  const previous = await read(path.join(output, 'study.json'));
  assert.deepEqual(previous.data.definition, definition);
  rows.push(...previous.data.rows);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await mkdir(output, { recursive: true });
const snapshot = { ...inputs.data, components: [...inputs.data.components, ...(p.fonts ?? [])] };
const session = await openBrowser(snapshot, { plugins: [modernRulesStudyPlugin()] });
const save = () =>
  writeJson(path.join(output, 'study.json'), {
    definition,
    parameters: p,
    faults: session.faults,
    rows,
  });
try {
  await session.page.evaluate(async (fonts) => {
    const api = await import('/games/magic/tools/accuracy/modern-rules-study-browser.mjs');
    await api.prepareRulesStudy(fonts);
    globalThis.__modernRulesApi = api;
  }, p.fonts ?? []);
  for (const e of inputs.data.entries) {
    if (rows.some((r) => r.id === e.id)) continue;
    const original = native.data.rows.find((r) => r.id === e.id),
      reference = scores.data.rows.find((r) => r.id === e.id);
    assert(original && reference);
    assert.equal(original.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(original.referenceHash, e.reference.sha256);
    assert.equal(reference.referenceHash, e.reference.sha256);
    const row = {
      id: e.id,
      name: e.card.name,
      number: e.card.collector_number,
      inputHash: original.inputHash,
      referenceHash: e.reference.sha256,
      nativeFaceHash: original.layers.face.sha256,
      normalizedHash: reference.normalizedReference.sha256,
      nonfoil: e.card.finishes.includes('nonfoil'),
    };
    const supported = await session.page.evaluate(
      (face) => globalThis.__modernRulesApi.supportsRulesStudy(face),
      e.face,
    );
    if (!supported) row.status = 'separate-basic-or-special-frame';
    else {
      const png = await readFile(path.join(scoreDirectory, reference.normalizedReference.file));
      assert.equal(hash(png), reference.normalizedReference.sha256);
      Object.assign(
        row,
        await session.page.evaluate(
          async ({ face, url, candidates }) =>
            globalThis.__modernRulesApi.measureRulesStudy(face, url, candidates),
          {
            face: e.face,
            url: 'data:image/png;base64,' + png.toString('base64'),
            candidates: p.candidates,
          },
        ),
      );
      row.status = 'measured';
    }
    rows.push(row);
    if (rows.length % 10 === 0) {
      await save();
      console.log('rules study', rows.length, '/297');
    }
  }
  assert.deepEqual(session.faults, []);
  await save();
  const measured = rows.filter((r) => r.status === 'measured');
  const comparable = measured.filter((r) => r.trials.every((t) => !t.invalid));
  const summary = p.candidates
    .map((c) => {
      const values = comparable.map((r) => r.trials.find((t) => t.id === c.id));
      return {
        id: c.id,
        comparable: values.length,
        invalid: measured.filter((r) => r.trials.find((t) => t.id === c.id).invalid).length,
        mean100: values.length
          ? (100 * values.reduce((n, v) => n + v.score, 0)) / values.length
          : null,
      };
    })
    .sort((a, b) => b.mean100 - a.mean100);
  await writeJson(path.join(output, 'summary.json'), {
    schema: 1,
    status: 'search-proposal-requires-native-validation',
    sourceHash: hash(JSON.stringify(definition)),
    total: rows.length,
    measured: measured.length,
    comparable: comparable.length,
    candidates: summary,
  });
  console.log(JSON.stringify(summary));
} finally {
  await session.close();
}
