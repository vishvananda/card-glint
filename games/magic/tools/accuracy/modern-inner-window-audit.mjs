// Read-only geometry audit on frozen, hash-bound native faces and normalized references.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { normalize } from './pixels-pure.mjs';
import { measureWindows, windowDifference, WINDOW_GEOMETRY_VERSION } from './window-geometry.mjs';
import { median } from './metrics.mjs';
const [inputFile, nativeDirectory, scoreDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: modern-inner-window-audit.mjs INPUTS NATIVE SCORES OUTPUT.json');
const read = async (file) => {
  const bytes = await readFile(file);
  return { bytes, data: JSON.parse(bytes) };
};
const inputs = await read(inputFile);
const native = await read(path.join(nativeDirectory, 'capture.json'));
const scores = await read(path.join(scoreDirectory, 'scores.json'));
assert.equal(inputs.data.set, 'm21', 'This initial audit is scoped to the reviewed M21 census');
assert.equal(native.data.source.inputsHash, hash(inputs.bytes));
assert.equal(scores.data.definition.inputsHash, hash(inputs.bytes));
assert.equal(scores.data.definition.nativeCaptureHash, hash(native.bytes));
assert.deepEqual(native.data.faults, []);
for (const list of [inputs.data.entries, native.data.rows, scores.data.rows]) {
  assert.equal(list.length, inputs.data.entries.length);
  assert.equal(new Set(list.map((r) => r.id)).size, list.length);
}
const rows = [];
for (const e of inputs.data.entries) {
  const n = native.data.rows.find((r) => r.id === e.id);
  const s = scores.data.rows.find((r) => r.id === e.id);
  assert(n && s && !n.issue);
  assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(n.layers.face.sha256, s.renderHash);
  assert.equal(e.reference.sha256, s.referenceHash);
  const row = {
    id: e.id,
    name: e.card.name,
    number: e.card.collector_number,
    geometry: s.geometry,
    family: s.family,
    poseHash: s.poseHash,
    referenceHash: s.normalizedReference.sha256,
    renderHash: s.renderHash,
  };
  if (!s.poseAccepted) row.status = 'unaccepted-pose';
  else if (!s.geometry.startsWith('normal-')) row.status = 'separate-planeswalker-audit-required';
  else {
    const a = await readFile(path.join(scoreDirectory, s.normalizedReference.file));
    const b = await readFile(path.join(nativeDirectory, n.layers.face.file));
    assert.equal(hash(a), row.referenceHash);
    assert.equal(hash(b), row.renderHash);
    const reference = PNG.sync.read(a);
    assert.deepEqual([reference.width, reference.height], [488, 680]);
    row.reference = measureWindows(reference);
    row.rendered = measureWindows(normalize(PNG.sync.read(b)));
    row.difference = windowDifference(row.reference, row.rendered);
    row.status = 'audited';
  }
  rows.push(row);
}
const summary = (list) => ({
  total: list.length,
  audited: list.filter((r) => r.status === 'audited').length,
  ...Object.fromEntries(
    ['art', 'rules'].map((part) => {
      const measured = list.filter((r) => r.difference?.[part].status === 'measured');
      return [
        part,
        {
          measured: measured.length,
          uncertain: list.filter((r) => r.status === 'audited').length - measured.length,
          median: Object.fromEntries(
            ['left', 'right', 'width', 'center'].map((k) => [
              k,
              measured.length ? median(measured.map((r) => r.difference[part][k])) : null,
            ]),
          ),
        },
      ];
    }),
  ),
});
const report = {
  schema: 1,
  set: 'm21',
  diagnosticOnly: true,
  definition: {
    inputsHash: hash(inputs.bytes),
    nativeCaptureHash: hash(native.bytes),
    scoresHash: hash(scores.bytes),
    rendererHash: native.data.source.rendererHash,
    detector: WINDOW_GEOMETRY_VERSION,
    detectorGraph: await metricSourceGraph(
      new URL('./window-geometry.mjs', import.meta.url).pathname,
    ),
    preprocessingGraph: await metricSourceGraph(
      new URL('./pixels-pure.mjs', import.meta.url).pathname,
    ),
    toolHash: hash(await readFile(new URL(import.meta.url))),
    policy:
      'No pose fitting or image movement. Existing fixed-strip detector measures horizontal art/rules edges on the frozen accepted scan poses. Positive delta means native edge right of reference. Ambiguous, weak, boundary and inconsistent strips remain uncertain. Median proposals are observations, not adopted geometry. Planeswalkers require separate semantic windows. This does not validate vertical edges or corner curves.',
  },
  summary: summary(rows),
  families: Object.fromEntries(
    [...new Set(rows.map((r) => r.geometry))]
      .sort()
      .map((g) => [g, summary(rows.filter((r) => r.geometry === g))]),
  ),
  rows,
};
await writeJson(output, report);
console.log(JSON.stringify(report.summary));
