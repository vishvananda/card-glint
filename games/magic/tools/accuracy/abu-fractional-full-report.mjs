// Report common metric coverage separately from each version's raw score.
import assert from 'node:assert/strict';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { hash, writeJson, root } from './common.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { abuFractionalAncestry } from './abu-fractional-ancestry.mjs';
const [input, output] = process.argv.slice(2);
assert(output, 'Usage: abu-fractional-full-report.mjs FULL_SCORE OUTPUT');
const raw = await readFile(input),
  data = JSON.parse(raw),
  proof = await abuFractionalAncestry();
assert.equal(data.status, 'paired-native-development-census');
assert.equal(data.source.nativeHash, proof.evidence.native.contentSha256);
assert.equal(data.rows.length, 899);
assert.equal(new Set(data.rows.map((r) => r.id)).size, 899);
const preprocessingBase = 'edf504e25213e15528d3c3ccabc40edbe567e896';
const preprocessGraph = await metricSourceGraph(
  new URL('./pixels-pure.mjs', import.meta.url).pathname,
);
for (const [name, digest] of preprocessGraph.sources) {
  const file = path.relative(
    root,
    path.resolve(path.dirname(new URL('./pixels-pure.mjs', import.meta.url).pathname), name),
  );
  assert.equal(
    hash(execFileSync('git', ['show', preprocessingBase + ':' + file], { cwd: root })),
    digest,
    'Preprocessing changed after the native study',
  );
}
const rows = data.rows.map((r) => {
  const a = r.scores.before,
    b = r.scores.after;
  assert.equal(a.expectedWeight, b.expectedWeight);
  const common = Object.keys(a.components).filter(
    (k) => a.components[k].eligible && b.components[k].eligible,
  );
  const eligibilityChanges = Object.keys(a.components).filter(
    (k) => a.components[k].eligible !== b.components[k].eligible,
  );
  let weight = 0,
    before = 0,
    after = 0;
  for (const k of common) {
    const av = a.components[k],
      bv = b.components[k];
    assert.equal(av.weight, bv.weight);
    assert(Number.isFinite(av.score100) && Number.isFinite(bv.score100));
    weight += av.weight;
    before += av.weight * av.score100;
    after += bv.weight * bv.score100;
  }
  const before100 = weight ? before / weight : null,
    after100 = weight ? after / weight : null;
  return {
    ...r,
    comparison: {
      commonComponents: common,
      commonWeight: weight,
      commonCoverage: weight / a.expectedWeight,
      before100,
      after100,
      delta100: weight ? after100 - before100 : null,
      eligibilityChanges,
    },
  };
});
const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null);
const quantile = (a, p) => {
  if (!a.length) return null;
  const b = [...a].sort((a, b) => a - b),
    at = (b.length - 1) * p;
  return b[Math.floor(at)] + (b[Math.ceil(at)] - b[Math.floor(at)]) * (at - Math.floor(at));
};
function summarize(group) {
  const accepted = group.filter((r) => r.accepted),
    measured = accepted.filter((r) => r.comparison.before100 !== null);
  const before = measured.map((r) => r.comparison.before100),
    after = measured.map((r) => r.comparison.after100);
  return {
    inventory: group.length,
    accepted: accepted.length,
    paired: measured.length,
    before100: mean(before),
    after100: mean(after),
    delta100: mean(measured.map((r) => r.comparison.delta100)),
    medianBefore100: quantile(before, 0.5),
    medianAfter100: quantile(after, 0.5),
    p10Before100: quantile(before, 0.1),
    p10After100: quantile(after, 0.1),
    meanCommonCoverage: mean(measured.map((r) => r.comparison.commonCoverage)),
    eligibilityChanges: accepted
      .filter((r) => r.comparison.eligibilityChanges.length)
      .map((r) => ({ id: r.id, name: r.name, components: r.comparison.eligibilityChanges })),
    gainsAboveHalfPoint: measured.filter((r) => r.comparison.delta100 > 0.5).length,
    regressionsAboveHalfPoint: measured.filter((r) => r.comparison.delta100 < -0.5).length,
    worstRegressions: measured
      .filter((r) => r.comparison.delta100 < -0.5)
      .sort((a, b) => a.comparison.delta100 - b.comparison.delta100)
      .map((r) => ({ id: r.id, name: r.name, delta100: r.comparison.delta100 })),
    rejectedDiagnostics: group.filter((r) => !r.accepted).map((r) => ({ id: r.id, name: r.name })),
  };
}
const sets = Object.fromEntries(
  ['lea', 'leb', '2ed'].map((s) => [s, summarize(rows.filter((r) => r.set === s))]),
);
await writeJson(output, {
  schema: 1,
  status: 'common-coverage-development-census',
  scope:
    'Direct native before/after regional metrics, recombined using only the same eligible components and weights on both sides of each printing. Raw per-version scores, all coverage changes and rejected pose diagnostics remain visible. Values are whole-card structural indices out of 100 with the measured component coverage shown, not fidelity percentages or complete-set certification. Preprocessing source matches the named pinned development commit; no resampling or scan fit was added here.',
  source: {
    ...data.source,
    rawScoreHash: hash(raw),
    preprocessingBase,
    preprocessGraph,
    reportToolHash: hash(await readFile(new URL(import.meta.url))),
  },
  summary: summarize(rows),
  sets,
  materials: Object.fromEntries(
    ['lea', 'leb', '2ed'].flatMap((s) =>
      [...new Set(rows.filter((r) => r.set === s).map((r) => r.material))].map((m) => [
        s + '/' + m,
        summarize(rows.filter((r) => r.set === s && r.material === m)),
      ]),
    ),
  ),
  rows,
});
console.log(JSON.stringify(sets));
