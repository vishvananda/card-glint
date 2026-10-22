// Shared M21 ability-text fit against frozen references; art and frames are never repainted.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { openBrowser } from './browser.mjs';
import { walkerTextStudy } from './modern-walker-text-study-plugin.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
const [inputFile, nativeDirectory, scoreDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: modern-walker-text-study.mjs INPUTS NATIVE SCORES OUTPUT_JSON');
const read = async (file) => {
  const bytes = await readFile(file);
  return { data: JSON.parse(bytes), sha256: hash(bytes) };
};
const inputs = await read(inputFile),
  native = await read(path.join(nativeDirectory, 'capture.json')),
  scores = await read(path.join(scoreDirectory, 'scores.json'));
assert.equal(inputs.data.set, 'm21');
assert.equal(inputs.data.entries.length, 14);
assert.equal(native.data.completed, 14);
assert.deepEqual(native.data.faults, []);
assert.equal(native.data.source.inputsHash, inputs.sha256);
assert.equal(scores.data.definition.inputsHash, inputs.sha256);
assert.equal(scores.data.definition.nativeCaptureHash, native.sha256);
assert.equal(native.data.source.rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
const fields = [],
  excluded = [];
for (const e of inputs.data.entries) {
  assert.equal(e.face.wordingMode, 'original');
  assert(/\bPlaneswalker\b/.test(e.face.canonicalTypeLine ?? e.face.typeLine ?? ''));
  if (!e.card.finishes.includes('nonfoil')) {
    excluded.push({
      id: e.id,
      name: e.card.name,
      reason: 'foil-only reference excluded from scan fit',
    });
    continue;
  }
  const n = native.data.rows.find((r) => r.id === e.id),
    r = scores.data.rows.find((r) => r.id === e.id);
  assert(n && r);
  assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(n.referenceHash, e.reference.sha256);
  const own = await readFile(path.join(nativeDirectory, n.layers.face.file)),
    ref = await readFile(path.join(scoreDirectory, r.normalizedReference.file));
  assert.equal(hash(own), n.layers.face.sha256);
  assert.equal(hash(ref), r.normalizedReference.sha256);
  fields.push({
    id: e.id,
    name: e.card.name,
    face: e.face,
    own: 'data:image/png;base64,' + own.toString('base64'),
    reference: 'data:image/png;base64,' + ref.toString('base64'),
  });
}
assert.equal(fields.length, 9);
assert.equal(excluded.length, 5);
const files = [
  'modern-walker-text-study.mjs',
  'modern-walker-text-study-plugin.mjs',
  'modern-walker-text-study-browser.mjs',
  'text-filled-objective.mjs',
  'native-text-window.mjs',
  'abu-type-objective.mjs',
  'edges.mjs',
];
const tools = await Promise.all(
  files.map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
);
const session = await openBrowser(inputs.data, { plugins: [walkerTextStudy()] });
try {
  const out = await session.page.evaluate(async (fields) => {
    const api = await import('/games/magic/tools/accuracy/modern-walker-text-study-browser.mjs');
    await api.prepareWalkerStudy();
    return api.walkerTextFields(fields);
  }, fields);
  assert.deepEqual(session.faults, []);
  for (const r of out.reports)
    assert.deepEqual(
      r.control.adjustment,
      { size: 0, dx: 0, dy: 0, width: 0, height: 0, leading: r.large ? 0.9 : 1 },
      'Own-render control did not recover the baseline',
    );
  out.schema = 1;
  out.status = 'shared-text-proposal-requires-native-replay';
  out.eligibleForPublication = false;
  out.denominator = 14;
  out.fitPrintings = 9;
  out.excluded = excluded;
  out.sources = {
    inputs: inputs.sha256,
    native: native.sha256,
    scores: scores.sha256,
    rendererHash: native.data.source.rendererHash,
    tools,
  };
  assert.deepEqual(
    await Promise.all(
      files.map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
    ),
    tools,
    'Study tools changed during fitting',
  );
  await writeJson(output, out);
  for (const r of out.reports)
    console.log(
      JSON.stringify({
        large: r.large,
        cards: r.count,
        before: r.baseline.score,
        after: r.selected.score,
        selected: r.selected.adjustment,
        control: r.control.adjustment,
        boundaries: r.atBoundary,
        candidates: r.candidates,
      }),
    );
} finally {
  await session.close();
}
