// Text-region report from direct native output, retaining every printing and regression.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { hash, writeJson } from './common.mjs';
const [directory, inputFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-fractional-direct-report.mjs NATIVE INPUTS OUTPUT');
const raw = await readFile(path.join(directory, 'proof.json')),
  capture = JSON.parse(raw);
const inputBytes = await readFile(inputFile),
  inputs = JSON.parse(inputBytes);
assert.equal(capture.source.mode, 'native-direct');
assert(capture.source.census);
assert.equal(capture.completed, 899);
assert.equal(capture.denominator, 899);
assert.equal(capture.rows.length, 899);
assert.equal(capture.source.inputsHash, hash(inputBytes));
assert.deepEqual(capture.faults, []);
assert.equal(new Set(capture.rows.map((r) => r.id)).size, 899);
const rows = [];
for (const row of capture.rows) {
  const e = inputs.entries.find((e) => e.id === row.id);
  assert(e);
  assert.equal(row.referenceHash, e.reference.sha256);
  assert.equal(row.poseHash, hash(JSON.stringify(e.pose)));
  assert(row.sourceBound && !row.prototypeMatch);
  assert.equal(row.outside, 0);
  assert.equal(row.alpha, 0);
  assert.equal(hash(await readFile(path.join(directory, row.id + '.png'))), row.afterFaceHash);
  assert(row.afterLayout && !row.afterLayout.overflow);
  assert(
    row.afterLayout.lines.length <= row.beforeLayout.lines.length,
    'Added printed row: ' + row.name,
  );
  const compact = (l) => ({
    size: l.size,
    x: l.x,
    top: l.top,
    width: l.width,
    height: l.height,
    horizontalScale: l.horizontalScale ?? 1,
    fractionalMetrics: l.fractionalMetrics ?? false,
    lines: l.lines.map((line) => ({
      text: line.runs.map((r) => r.text).join(''),
      x: line.x ?? l.x,
      baseline: line.baseline,
      width: line.width,
      role: line.role,
    })),
  });
  rows.push({
    id: row.id,
    set: row.set,
    name: row.name,
    material: e.material,
    accepted: row.accepted,
    score: {
      before100: row.scores.before100,
      after100: row.scores.after100,
      delta100: row.scores.delta100,
    },
    beforeLayout: compact(row.beforeLayout),
    afterLayout: compact(row.afterLayout),
    changed: row.changed,
    referenceHash: row.referenceHash,
    poseHash: row.poseHash,
    beforeFaceHash: row.beforeFaceHash,
    afterFaceHash: row.afterFaceHash,
    cohort:
      row.beforeLayout.size >= 30 ? 'large' : row.beforeLayout.size >= 19 ? 'regular' : 'small',
  });
}
const mean = (v) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : null);
const q = (a, p) => {
  if (!a.length) return null;
  const s = [...a].sort((a, b) => a - b),
    i = (s.length - 1) * p;
  return s[Math.floor(i)] + (s[Math.ceil(i)] - s[Math.floor(i)]) * (i - Math.floor(i));
};
const summary = (items) => {
  const a = items.filter((r) => r.accepted);
  return {
    inventory: items.length,
    accepted: a.length,
    scored: a.length,
    changed: items.filter((r) => r.changed).length,
    before100: mean(a.map((r) => r.score.before100)),
    after100: mean(a.map((r) => r.score.after100)),
    delta100: mean(a.map((r) => r.score.delta100)),
    medianBefore100: q(
      a.map((r) => r.score.before100),
      0.5,
    ),
    medianAfter100: q(
      a.map((r) => r.score.after100),
      0.5,
    ),
    lowerDecileBefore100: q(
      a.map((r) => r.score.before100),
      0.1,
    ),
    lowerDecileAfter100: q(
      a.map((r) => r.score.after100),
      0.1,
    ),
    improvedHalfPoint: a.filter((r) => r.score.delta100 > 0.5).length,
    regressedHalfPoint: a.filter((r) => r.score.delta100 < -0.5).length,
    fontSizeChanges: items.filter((r) => r.beforeLayout.size !== r.afterLayout.size).length,
    changedLineCount: items.filter(
      (r) => r.beforeLayout.lines.length !== r.afterLayout.lines.length,
    ).length,
    addedRows: items.filter((r) => r.afterLayout.lines.length > r.beforeLayout.lines.length).length,
  };
};
const sets = Object.fromEntries(
  ['lea', 'leb', '2ed'].map((set) => {
    const a = rows.filter((r) => r.set === set);
    return [
      set,
      {
        ...summary(a),
        cohorts: Object.fromEntries(
          ['large', 'regular', 'small'].map((c) => [c, summary(a.filter((r) => r.cohort === c))]),
        ),
        materials: Object.fromEntries(
          [...new Set(a.map((r) => r.material))].map((m) => [
            m,
            summary(a.filter((r) => r.material === m)),
          ]),
        ),
        regressions: a
          .filter((r) => r.score.delta100 < -0.5)
          .sort((a, b) => a.score.delta100 - b.score.delta100)
          .map((r) => ({
            id: r.id,
            name: r.name,
            delta100: r.score.delta100,
            accepted: r.accepted,
          })),
        normalizationReview: a
          .filter((r) => !r.accepted)
          .map((r) => ({ id: r.id, name: r.name, score: r.score })),
      },
    ];
  }),
);
await writeJson(output, {
  schema: 1,
  status: 'complete-development-census',
  source: capture.source,
  nativeHash: hash(raw),
  inputsHash: hash(inputBytes),
  summary: summary(rows),
  sets,
  rows,
  limitations: [
    'Text-region similarity indices out of100; not whole-card compliance or percentage fidelity.',
    'Same cached Original inputs and frozen scan poses; three historical Alpha rejections remain outside accepted means.',
    'Reused development data; no independent holdout is claimed.',
    'Direct native scoring, not an independent fitting-prototype replay.',
    'Manual flavor wrapping and typeface residuals remain visible.',
  ],
});
console.log(
  JSON.stringify(
    {
      summary: summary(rows),
      sets: Object.fromEntries(
        Object.entries(sets).map(([s, v]) => [
          s,
          {
            before100: v.before100,
            after100: v.after100,
            regressedHalfPoint: v.regressedHalfPoint,
          },
        ]),
      ),
    },
    null,
    2,
  ),
);
