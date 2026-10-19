import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readJson, writeJson, hash } from './common.mjs';

const [beforeFile, afterFile, nativeProofFile, outputFile] = process.argv.slice(2);
if (!outputFile) throw Error('Usage: abu-score-delta.mjs BEFORE AFTER NATIVE_PROOF OUT');
const [before, after, proof] = await Promise.all(
  [beforeFile, afterFile, nativeProofFile].map(readJson),
);
assert.equal(before.set, after.set);
assert.equal(proof.set, after.set);
assert.equal(before.metricGraph.hash, after.metricGraph.hash, 'Different scoring graph');
assert.equal(after.inputHash, proof.inputHash, 'Native proof uses different inputs');
assert.equal(before.rows.length, after.rows.length);
const previous = new Map(before.rows.map((r) => [r.id, r]));
const native = new Map(proof.native.rows.map((r) => [r.id, r]));
const rows = after.rows.map((r) => {
  const b = previous.get(r.id),
    p = native.get(r.id);
  assert.ok(b && p, 'Missing paired native receipt: ' + r.id);
  for (const key of [
    'name',
    'material',
    'cohort',
    'referenceHash',
    'poseHash',
    'normalizationAccepted',
  ])
    assert.deepEqual(r[key], b[key], 'Unpaired ' + key + ': ' + r.id);
  assert.equal(b.renderHash, p.before);
  assert.equal(r.renderHash, p.after);
  assert.equal(p.outside, 0);
  assert.equal(p.silhouette, 0);
  const accepted = r.normalizationAccepted && r.profileAccepted && b.profileAccepted;
  const components = Object.fromEntries(
    Object.entries(r.components).map(([name, a]) => {
      const old = b.components[name];
      assert.equal(a.eligible, old.eligible);
      return [
        name,
        {
          eligible: accepted && a.eligible,
          before: old.score100,
          after: a.score100,
          delta: a.score100 === null || old.score100 === null ? null : a.score100 - old.score100,
        },
      ];
    }),
  );
  return {
    id: r.id,
    name: r.name,
    material: r.material,
    cohort: r.cohort,
    accepted,
    before: b.structural100,
    after: r.structural100,
    delta: accepted ? r.structural100 - b.structural100 : null,
    components,
  };
});
const mean = (values) => (values.length ? values.reduce((s, n) => s + n, 0) / values.length : null);
function summary(group) {
  const accepted = group.filter((r) => r.accepted);
  const metric = (values) => ({
    count: values.length,
    before: mean(values.map((r) => r.before)),
    after: mean(values.map((r) => r.after)),
    delta: mean(values.map((r) => r.delta)),
  });
  return {
    total: group.length,
    ...metric(accepted),
    improvedAtLeastHalfPoint: accepted.filter((r) => r.delta >= 0.5).length,
    regressedAtLeastHalfPoint: accepted.filter((r) => r.delta <= -0.5).length,
    components: Object.fromEntries(
      Object.keys(rows[0].components).map((key) => [
        key,
        metric(accepted.map((r) => r.components[key]).filter((c) => c.eligible)),
      ]),
    ),
    creditsDiagnosticOnly: metric(
      accepted
        .map((r) => r.components.credits)
        .filter((c) => c.before !== null && c.after !== null),
    ),
  };
}
const groupBy = (key) =>
  Object.fromEntries(
    [...new Set(rows.map((r) => r[key]))]
      .sort()
      .map((value) => [value, summary(rows.filter((r) => r[key] === value))]),
  );
await writeJson(outputFile, {
  schema: 1,
  set: after.set,
  scope:
    'Paired full native original-wording replay with existing frame assets. Similarity indices on a 0–100 scale, not percentages of correctness. Reused development cohorts; no new sealed holdout. Credits remain diagnostic and excluded from the whole-card aggregate.',
  sources: await Promise.all(
    [beforeFile, afterFile, nativeProofFile].map(async (file) => hash(await readFile(file))),
  ),
  metricGraph: after.metricGraph,
  inputHashes: [before.inputHash, after.inputHash],
  normalizationHashes: [before.normalizationHash, after.normalizationHash],
  summary: summary(rows),
  materials: groupBy('material'),
  cohorts: groupBy('cohort'),
  rejected: rows.filter((r) => !r.accepted).map(({ id, name }) => ({ id, name })),
  rows,
});
console.log(JSON.stringify(summary(rows)));
