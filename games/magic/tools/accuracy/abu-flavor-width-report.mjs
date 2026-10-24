// Diagnostic report, separate from the published whole-card metric.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
export function auditFlavorWidthStudy(capture, native, selected, nativeHash, poses) {
  assert.equal(capture.status, 'complete');
  assert.equal(capture.source.rendererHash, native.source.afterRenderer);
  assert.equal(capture.source.nativeHash, nativeHash);
  assert.equal(capture.completed, 237);
  assert.equal(capture.total, 237);
  const controlNames = new Set(['Keldon Warlord', 'Animate Dead', 'Warp Artifact']);
  const expected = selected.rows.filter(
    (r) => r.afterLayout?.lines.some((l) => l.role === 'flavor') || controlNames.has(r.name),
  );
  assert.equal(expected.length, 237);
  assert.deepEqual(capture.rows.map((r) => r.id).sort(), expected.map((r) => r.id).sort());
  assert.equal(new Set(capture.rows.map((r) => r.id)).size, 237);
  assert.equal(capture.trials.length, 6);
  assert.deepEqual(capture.trials.slice(0, 2), [
    { id: 'current', scale: null },
    { id: 'reflow-control', scale: 1 },
  ]);
  for (const row of capture.rows) {
    const member = native.rows.find((r) => r.id === row.id);
    for (const field of ['referenceHash', 'inputHash'])
      assert.equal(row[field], member[field], 'Changed study identity: ' + field);
    const pose = poses.find((p) => p.id === row.id);
    assert(pose, 'Missing pose identity join');
    assert.equal(pose.normalizationHash, member.poseHash);
    assert.equal(hash(JSON.stringify(pose.transform)), row.poseHash, 'Changed sampler transform');
    assert.equal(row.variants[0].renderHash, member.original.hashes['after-face']);
    assert.deepEqual(
      row.variants.map((v) => v.id),
      capture.trials.map((t) => t.id),
    );
    assert.equal(
      row.flavor,
      row.variants[0].layout.lines.some((l) => l.role === 'flavor'),
    );
    const baseline = row.variants[0];
    for (const v of row.variants) {
      assert.equal(v.outside, 0);
      assert.equal(v.alpha, 0);
      assert.equal(v.layout.size, baseline.layout.size);
      assert.deepEqual(
        v.layout.lines.map((l) => [l.role, l.baseline]),
        baseline.layout.lines.map((l) => [l.role, l.baseline]),
      );
      const painted = (l) => ({ x: l.x, baseline: l.baseline, runs: l.runs, width: l.width });
      assert.deepEqual(
        v.layout.lines.filter((l) => l.role === 'rules').map(painted),
        baseline.layout.lines.filter((l) => l.role === 'rules').map(painted),
      );
      assert.equal(v.layout.overflow, false);
      assert(
        Number.isFinite(v.objective.score) && v.objective.score >= 0 && v.objective.score <= 1,
      );
      assert(
        Math.abs(v.objective.score - (0.55 * v.objective.edge + 0.45 * v.objective.filled)) < 1e-12,
      );
      if (v.id === 'reflow-control' || !row.flavor || v.proposal?.rejected)
        assert.equal(v.renderHash, baseline.renderHash, 'Noncandidate control changed');
      if (v.id === 'reflow-control') assert.equal(v.proposal.rejected, false);
    }
  }
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  const quantile = (a, q) => [...a].sort((a, b) => a - b)[Math.floor((a.length - 1) * q)];
  const summaries = [];
  for (const set of ['lea', 'leb', '2ed']) {
    const all = capture.rows.filter((r) => r.set === set);
    assert.equal(all.filter((r) => r.flavor).length, 76);
    assert.equal(all.filter((r) => !r.flavor).length, 3);
    for (const tier of ['all', 'large', 'regular', 'small']) {
      const rows = all.filter(
        (r) =>
          r.flavor &&
          (tier === 'all' ||
            (r.variants[0].layout.size >= 30
              ? 'large'
              : r.variants[0].layout.size >= 19
                ? 'regular'
                : 'small') === tier),
      );
      if (!rows.length) continue;
      for (const trial of capture.trials.slice(2)) {
        const changes = rows.map((r) => {
          const v = r.variants.find((v) => v.id === trial.id);
          return {
            id: r.id,
            name: r.name,
            delta100: 100 * (v.objective.score - r.variants[0].objective.score),
            rejected: v.proposal.rejected,
          };
        });
        const a = changes.map((r) => r.delta100);
        summaries.push({
          set,
          tier,
          names: rows.length,
          trial: trial.id,
          deltaMean100: mean(a),
          deltaMedian100: quantile(a, 0.5),
          deltaP10: quantile(a, 0.1),
          gains: changes.filter((r) => r.delta100 > 0.5).length,
          regressions: changes.filter((r) => r.delta100 < -0.5).length,
          withheld: changes.filter((r) => r.rejected).length,
          changes: changes.sort((a, b) => a.delta100 - b.delta100),
        });
      }
    }
  }
  return summaries;
}
