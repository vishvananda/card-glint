import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { fixtureRoot, readJson, writeJson, hash, sourceHash, root } from './common.mjs';
import { median } from './metrics.mjs';
import { SCAN_ANCHOR_METHOD_HASH, SCAN_FIT_METHOD_HASH } from './scan-frame-cache.mjs';

const [stage = 'after-pose-final', ...requested] = process.argv.slice(2);
assert.match(stage, /^after(?:-[a-z0-9]+)*$/);
const names = await readdir(fixtureRoot),
  sets = requested.length
    ? requested
    : names
        .filter((n) => n.endsWith('-symbol-pose-final-adoption-plan.json'))
        .map((n) => n.split('-')[0])
        .sort(),
  rendererHash = await sourceHash(`${root}/games/magic/src`),
  rows = [];
for (const set of sets) {
  assert.match(set, /^[a-z0-9]{2,6}$/);
  const after = await readJson(`${fixtureRoot}/${set}-symbol-${stage}-registered.json`),
    before = await readJson(`${fixtureRoot}/${set}-symbol-after-pose-baseline-registered.json`),
    raw = await readJson(`${fixtureRoot}/${set}-symbol-${stage}-measurement.json`),
    adoption = await readJson(`${fixtureRoot}/${set}-symbol-pose-final-adoption-plan.json`);
  assert.equal(after.rendererHash, rendererHash);
  assert.equal(raw.rendererHash, rendererHash);
  assert.equal(after.rawMeasurementHash, hash(JSON.stringify(raw)));
  assert.equal(after.scanRegistrationHash, before.scanRegistrationHash);
  const pairs = after.rows
    .filter((r) => r.status === 'measured')
    .map((a) => {
      const b = before.rows.find((r) => r.id === a.id);
      assert.equal(b.status, 'measured');
      assert.deepEqual(a.transform, b.transform);
      return { a, b };
    });
  function summarize(ps) {
    return Object.fromEntries(
      ['inspect', 'table'].map((t) => [
        t,
        {
          before: median(ps.map((p) => p.b.scores[t].after.edgeF1)),
          after: median(ps.map((p) => p.a.scores[t].after.edgeF1)),
          beforeCensus: median(ps.map((p) => p.b.scores[t].after.censusSimilarity)),
          afterCensus: median(ps.map((p) => p.a.scores[t].after.censusSimilarity)),
          improved: ps.filter((p) => p.a.scores[t].after.edgeF1 > p.b.scores[t].after.edgeF1 + 0.02)
            .length,
          regressions: ps
            .filter((p) => p.a.scores[t].after.edgeF1 < p.b.scores[t].after.edgeF1 - 0.02)
            .map((p) => ({
              id: p.a.id,
              name: p.a.name,
              delta: p.a.scores[t].after.edgeF1 - p.b.scores[t].after.edgeF1,
            })),
        },
      ]),
    );
  }
  rows.push({
    set,
    ordinary: after.rows.length,
    normalized: pairs.length,
    controls: raw.summary.controls,
    captureFailures: raw.summary.failures,
    afterHash: hash(JSON.stringify(after)),
    beforeHash: hash(JSON.stringify(before)),
    rawHash: hash(JSON.stringify(raw)),
    adoptionHash: hash(JSON.stringify(adoption)),
    referenceCoverage: after.summary.all.referenceCoverage,
    tiers: summarize(pairs),
    adoptedGroups: Object.keys(adoption.materialGroups),
    rejectedGroups: adoption.rejectedGroups,
    groups: Object.fromEntries(
      Object.keys(adoption.materialGroups).map((m) => {
        const ps = pairs.filter((p) => p.a.material === m);
        return [m, { count: ps.length, tiers: summarize(ps) }];
      }),
    ),
    typeChanged: raw.rows
      .filter((r) => r.scores && Object.values(r.scores).some((t) => t.typeChanged > 0))
      .map((r) => ({ id: r.id, name: r.name })),
    worst: pairs
      .toSorted((p, q) => p.a.scores.inspect.after.edgeF1 - q.a.scores.inspect.after.edgeF1)
      .slice(0, 6)
      .map((p) => ({ id: p.a.id, name: p.a.name, score: p.a.scores.inspect.after.edgeF1 })),
  });
}
const normalization = [];
for (const name of names.filter((n) => n.endsWith('-symbol-scan-pose.json')).sort()) {
  const p = await readJson(`${fixtureRoot}/${name}`);
  assert.equal(p.scanAnchorMethodHash, SCAN_ANCHOR_METHOD_HASH);
  assert.equal(p.scanFitMethodHash, SCAN_FIT_METHOD_HASH);
  normalization.push({
    set: name.split('-')[0],
    file: name,
    hash: hash(JSON.stringify(p)),
    cards: p.rows.length,
    summary: p.summary,
  });
}
const counts = {};
for (const n of normalization)
  for (const [k, v] of Object.entries(n.summary)) counts[k] = (counts[k] ?? 0) + v;
const result = {
  schemaVersion: 1,
  scope:
    'Final subset of the all-set recalibration. Each score compares the previous shared placement and final material placement using identical frozen per-card frame fits. Native assets and sizes retained; no renderer scan poses. Previously observed development data, not fresh holdouts. Missing templates and weak frame fits remain unresolved; no entire set marked complete.',
  rendererHash,
  stage,
  normalization: {
    sets: normalization.length,
    cards: normalization.reduce((s, r) => s + r.cards, 0),
    counts,
    groups: normalization,
  },
  printingCoverage: rows.reduce((s, r) => s + r.ordinary, 0),
  normalizedComparisons: rows.reduce((s, r) => s + r.normalized, 0),
  rows,
};
await writeJson(`${fixtureRoot}/symbol-pose-final-review.json`, result);
console.log(
  JSON.stringify(
    {
      normalization: result.normalization.counts,
      sets: rows.map((r) => ({
        set: r.set,
        ordinary: r.ordinary,
        normalized: r.normalized,
        inspect: [r.tiers.inspect.before, r.tiers.inspect.after],
        table: [r.tiers.table.before, r.tiers.table.after],
      })),
    },
    null,
    2,
  ),
);
