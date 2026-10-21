// Whole-card regional scores use a supplied, hash-bound host metric.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [directory, scorerFile, output] = process.argv.slice(2);
assert(output, 'Usage: early-integrated-profile-score.mjs NATIVE_PROFILE_CAPTURE SCORER OUTPUT');
const raw = await Promise.all(
  ['capture.json', 'inputs.json'].map((f) => readFile(path.join(directory, f))),
);
const [capture, inputs] = raw.map((b) => JSON.parse(b));
assert.equal(capture.completed, 302);
assert.equal(capture.rows.length, 302);
assert.equal(inputs.entries.length, 302);
const graph = await metricSourceGraph(scorerFile),
  { scoreRegions } = await import(pathToFileURL(path.resolve(scorerFile))),
  rows = [];
const source = {
  schema: 1,
  nativeCaptureHash: hash(raw[0]),
  nativeInputsHash: hash(raw[1]),
  rendererHash: capture.source.rendererHash,
  profileHash: capture.source.profileHash,
  metricGraph: graph,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  scope:
    '302 current Original inputs and exact saved before/after native faces, with the same independently normalized scan for both. This runs the supplied whole-card regional metric without per-candidate scan registration or color normalization. Frame pose visual review and final profile adoption remain separate. Numeric scores are indices out of 100, not percentages.',
};
for (const e of inputs.entries) {
  const native = capture.rows.find((r) => r.id === e.id);
  assert.equal(native.currentFaceInputHash, hash(JSON.stringify(e.face)));
  assert.equal(native.poseHash, hash(JSON.stringify(e.pose.transform)));
  assert(e.pose.accepted);
  const load = async (file, digest) => {
    const b = await readFile(path.join(directory, file));
    assert.equal(hash(b), digest);
    return normalize(PNG.sync.read(b, { checkCRC: true }));
  };
  const scan = await load(e.id + '-scan.png', native.scanHash),
    scores = {};
  for (const variant of ['current', 'candidate']) {
    const image = await load(variant + '/' + e.id + '.png', native.rasters[variant].face);
    const value = scoreRegions(scan, image, e.card, e.face);
    scores[variant] = {
      structural100: value.structuralScore === null ? null : 100 * value.structuralScore,
      coverage: value.coverage,
      components: Object.fromEntries(
        Object.entries(value.components).map(([key, v]) => [
          key,
          {
            score100: v.score === null ? null : 100 * v.score,
            eligible: v.eligible,
            status: v.status,
            weight: v.weight,
          },
        ]),
      ),
      weakest: value.weakest,
      color: value.color,
    };
  }
  rows.push({
    id: e.id,
    name: e.name,
    material: e.material,
    profileFrame: native.selectedFrame.material,
    cohort: e.pose.cohort,
    referenceHash: e.reference.sha256,
    poseHash: native.poseHash,
    numericallyAccepted: true,
    visualCertification: 'pending',
    wordingMode: e.face.wordingMode,
    renderHashes: native.rasters,
    scores,
  });
  if (rows.length % 25 === 0) console.log('Whole-card metric ' + rows.length + '/302');
}
assert.deepEqual(await metricSourceGraph(scorerFile), graph, 'Metric changed during scoring');
const q = (v, p) => {
  const a = [...v].sort((a, b) => a - b),
    n = (a.length - 1) * p;
  return a[Math.floor(n)] * (1 - (n % 1)) + a[Math.ceil(n)] * (n % 1);
};
const mean = (v) => v.reduce((s, x) => s + x, 0) / v.length;
const groups = {};
for (const key of [
  'all',
  'calibration',
  'validation',
  ...new Set(rows.map((r) => r.profileFrame)),
]) {
  const rs = rows.filter((r) => key === 'all' || r.cohort === key || r.profileFrame === key);
  const components = {};
  for (const role of ['structural100', ...Object.keys(rs[0].scores.current.components)]) {
    const measurable = rs.filter((r) =>
      role === 'structural100'
        ? r.scores.current.structural100 !== null && r.scores.candidate.structural100 !== null
        : r.scores.current.components[role]?.eligible &&
          r.scores.candidate.components[role]?.eligible,
    );
    if (!measurable.length) continue;
    const values = measurable.map((r) =>
      role === 'structural100'
        ? [r.scores.current.structural100, r.scores.candidate.structural100]
        : [
            r.scores.current.components[role].score100,
            r.scores.candidate.components[role].score100,
          ],
    );
    components[role] = {
      count: values.length,
      beforeMean: mean(values.map((v) => v[0])),
      afterMean: mean(values.map((v) => v[1])),
      beforeMedian: q(
        values.map((v) => v[0]),
        0.5,
      ),
      afterMedian: q(
        values.map((v) => v[1]),
        0.5,
      ),
      beforeLowerDecile: q(
        values.map((v) => v[0]),
        0.1,
      ),
      afterLowerDecile: q(
        values.map((v) => v[1]),
        0.1,
      ),
      improved: values.filter((v) => v[1] > v[0] + 1e-9).length,
      regressed: values.filter((v) => v[1] < v[0] - 1e-9).length,
      worstRegression: Math.max(0, ...values.map((v) => v[0] - v[1])),
    };
  }
  groups[key] = { count: rs.length, components };
}
await writeJson(output, {
  schema: 1,
  status: 'complete-native-profile-study-scores-not-set-certification',
  source,
  summary: groups,
  rows,
});
console.log(JSON.stringify(groups.all, null, 2));
