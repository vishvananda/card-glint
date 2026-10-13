import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readJson, writeJson, fixtureRoot, cacheRoot, hash } from './common.mjs';
import { median } from './metrics.mjs';
const plan = await readJson(`${fixtureRoot}/old-frame-family-plan.json`);
const measured = await readJson(`${cacheRoot}/rollout/old-frame-family-measurements.json`);
assert.equal(measured.planHash, hash(JSON.stringify(plan)));
// Frozen before reviewing the held-out family results. Small cohorts certify
// only a candidate for review; they never authorize a whole-set asset switch.
const policy = {
  calibration: 3,
  validation: 2,
  minimumScore: 0.65,
  minimumMargin: 0.025,
  minimumGain: 0.015,
  maximumCardRegression: 0.04,
  maximumRegionRegression: 0.08,
};
const groups = [];
for (const set of plan.sets)
  for (const group of set.groups) {
    const rows = measured.rows.filter((r) => r.set === set.set && r.group === group.key);
    const cal = rows.filter((r) => r.cohort === 'calibration'),
      hold = rows.filter((r) => r.cohort === 'validation');
    const choices = [...new Set(rows.flatMap((r) => Object.keys(r.candidates ?? {})))];
    const value = (r, k) => r.candidates?.[k]?.normalized.score ?? null;
    const summaries = Object.fromEntries(
      choices.map((k) => [
        k,
        Object.fromEntries(
          [
            ['calibration', cal],
            ['validation', hold],
          ].map(([c, rs]) => {
            const vs = rs.map((r) => value(r, k)).filter((x) => x !== null);
            return [c, { count: vs.length, score: median(vs) }];
          }),
        ),
      ]),
    );
    const rank = choices
      .filter((k) => summaries[k].calibration.score !== null)
      .sort((a, b) => summaries[b].calibration.score - summaries[a].calibration.score);
    const winner = rank[0] ?? null,
      baseline = [...new Set(rows.map((r) => r.baseline))];
    const flags = [];
    if (cal.length < policy.calibration || hold.length < policy.validation)
      flags.push('sparse-cohort');
    if (rows.some((r) => r.registration !== 'accepted')) flags.push('unsettled-registration');
    if (group.layout !== 'normal' || group.material.startsWith('dual-'))
      flags.push('specialized-material');
    if (baseline.length !== 1 || !baseline[0]) flags.push('mixed-baseline');
    let gain = null,
      margin = null,
      worstRegression = null,
      regionRegression = null;
    if (!winner) flags.push('no-measurement');
    else {
      const s = summaries[winner];
      if (s.calibration.count !== cal.length || s.validation.count !== hold.length)
        flags.push('incomplete-support');
      if (s.calibration.score < policy.minimumScore || s.validation.score < policy.minimumScore)
        flags.push('weak-match');
      margin = rank[1] ? s.calibration.score - summaries[rank[1]].calibration.score : 0;
      if (margin < policy.minimumMargin) flags.push('ambiguous-family');
      const gains = hold.flatMap((r) => {
        const a = value(r, winner),
          b = value(r, r.baseline);
        return a === null || b === null ? [] : [a - b];
      });
      gain = median(gains);
      worstRegression = Math.max(0, ...gains.map((v) => -v));
      if (winner !== baseline[0] && (gain === null || gain < policy.minimumGain))
        flags.push('no-reserved-gain');
      if (worstRegression > policy.maximumCardRegression) flags.push('reserved-card-regression');
      const other = choices.filter((k) => k !== winner && summaries[k].validation.score !== null);
      if (other.some((k) => summaries[k].validation.score > s.validation.score))
        flags.push('reserved-winner-disagrees');
      const regionGains = hold.flatMap((r) =>
        Object.entries(r.candidates?.[winner]?.normalized.regions ?? {}).flatMap(([k, v]) => {
          const b = r.candidates?.[r.baseline]?.normalized.regions[k]?.score;
          return v.score == null || b == null ? [] : [v.score - b];
        }),
      );
      regionRegression = Math.max(0, ...regionGains.map((v) => -v));
      if (regionRegression > policy.maximumRegionRegression)
        flags.push('reserved-region-regression');
    }
    groups.push({
      set: set.set,
      key: group.key,
      material: group.material,
      printings: group.printings,
      referenceReady: group.referenceReady,
      issues: group.issues,
      baseline: baseline.length === 1 ? baseline[0] : baseline,
      winner,
      margin,
      gain,
      worstRegression,
      regionRegression,
      candidates: summaries,
      flags,
      status: flags.length
        ? 'review-only'
        : winner === baseline[0]
          ? 'retain-supported'
          : 'candidate-for-visual-review',
      selected: 'retain-current-pending-full-audit',
    });
  }
const result = {
  schemaVersion: 1,
  planHash: measured.planHash,
  measurementHash: hash(JSON.stringify(measured)),
  methodHash: measured.methodHash,
  selectionHash: hash(await readFile(new URL(import.meta.url))),
  metric: measured.metric,
  support: measured.support,
  policy,
  registrations: measured.registrations,
  scope:
    '2767 sampled full scans across 717 groups; coverage inventory includes 13603 printings. Scores are frame-only structural similarities, not whole-card accuracy. All source mappings remain unchanged until visual review and full group audit. No per-scan transform or HSB is fitted.',
  summary: {
    sets: plan.summary.sets,
    groups: groups.length,
    printings: plan.summary.printings,
    samples: measured.rows.length,
    statuses: groups.reduce((a, g) => ((a[g.status] = (a[g.status] ?? 0) + 1), a), {}),
  },
  groups,
};
await writeJson(`${fixtureRoot}/old-frame-family-results.json`, result);
console.log(result.summary);
console.log(
  groups
    .filter((g) => ['lea', 'leb', '2ed', '3ed'].includes(g.set) && /^[WUBRGA]$/.test(g.material))
    .map((g) => ({
      set: g.set,
      material: g.material,
      baseline: g.baseline,
      winner: g.winner,
      gain: g.gain,
      status: g.status,
      flags: g.flags,
    })),
);
