import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { hash, writeJson } from './common.mjs';
import { textRowAgreement } from './text-row-agreement.mjs';
const [inputFile, studyFile, targetsFile, output] = process.argv.slice(2);
assert(output, 'Usage: fourth-body-request-report.mjs INPUTS STUDY PRINTED_ROWS OUTPUT');
const raw = await Promise.all([inputFile, studyFile, targetsFile].map((f) => fs.readFile(f)));
const [inputs, study, targets] = raw.map((b) => JSON.parse(b));
assert.equal(inputs.set, '4ed');
assert.equal(inputs.entries.length, 378);
assert.equal(study.status, 'complete-exploratory');
assert.equal(study.requestStudy.mode, 'native-request');
assert.equal(study.inputHash, hash(raw[0]));
assert.equal(study.rows.length, 360);
assert.equal(new Set(study.rows.map((r) => r.id)).size, 360);
assert.equal(targets.set, '4ed');
assert.equal(targets.wordingMode, 'original');
assert.equal(targets.rows.length, new Set(targets.rows.map((r) => r.id)).size);
assert.deepEqual(
  study.rows.map((r) => r.id).sort(),
  inputs.entries
    .filter((e) => !e.face.land)
    .map((e) => e.id)
    .sort(),
);
const comparisonCandidate = study.requestStudy.candidates.find(
  (c) => c.fractionalMetrics && !c.preserveBaseline && c.dy === 0,
)?.id;
assert(comparisonCandidate, 'Need a shared center-anchored fractional candidate');
const metrics = new Map(),
  rowChecks = [],
  outliers = [];
for (const r of study.rows) {
  const e = inputs.entries.find((e) => e.id === r.id);
  assert.equal(e.face.wordingMode, 'original');
  assert.equal(r.referenceHash, e.reference.sha256);
  assert.equal(r.replayDifference, 0);
  const current = r.trials[0];
  assert.equal(current.candidate.id, 'current');
  assert.equal(current.invalid, undefined);
  const roles = [...new Set(e.face.rulesParagraphs.map((p) => p.role))].sort().join('+');
  const target = targets.rows.find((t) => t.id === r.id);
  if (target) {
    assert.equal(target.referenceHash, r.referenceHash);
    assert.equal(target.name, r.name);
    const original = e.face.rulesParagraphs.map((p) => p.runs.map((r) => r.text).join(''));
    assert.equal(
      textRowAgreement(target.printedRows, original).status,
      'measured',
      'Printed-row target has different wording: ' + r.name,
    );
  }
  for (const t of r.trials) {
    const candidate = t.candidate.id;
    if (!metrics.has(candidate)) metrics.set(candidate, []);
    if (t.invalid) {
      metrics
        .get(candidate)
        .push({ id: r.id, name: r.name, roles, invalid: true, reason: t.reason });
      continue;
    }
    assert.equal(t.outside, 0);
    assert.equal(t.alpha, 0);
    const delta100 = 100 * (t.metric.score - current.metric.score);
    metrics.get(candidate).push({
      id: r.id,
      name: r.name,
      roles,
      before100: 100 * current.metric.score,
      current100: 100 * t.metric.score,
      delta100,
    });
    if (target)
      rowChecks.push({
        id: r.id,
        name: r.name,
        candidate,
        overlap100: 100 * t.metric.score,
        rows: textRowAgreement(
          target.printedRows,
          t.layout.lines.map((l) => l.text),
        ),
      });
    if (candidate === comparisonCandidate)
      outliers.push({
        id: r.id,
        name: r.name,
        roles,
        delta100,
        beforeRows: current.layout.lines.length,
        afterRows: t.layout.lines.length,
        beforeSize: current.layout.size,
        afterSize: t.layout.size,
        referenceHash: r.referenceHash,
        baselineHash: r.baselineHash,
      });
  }
}
const summary = (rows) => {
  const valid = rows.filter((r) => !r.invalid);
  const mean = (key) =>
    valid.length ? valid.reduce((n, r) => n + r[key], 0) / valid.length : null;
  return {
    printings: rows.length,
    measured: valid.length,
    invalid: rows.length - valid.length,
    before100: mean('before100'),
    current100: mean('current100'),
    delta100: mean('delta100'),
    improved: valid.filter((r) => r.delta100 > 0.05).length,
    regressed: valid.filter((r) => r.delta100 < -0.05).length,
    within005: valid.filter((r) => Math.abs(r.delta100) <= 0.05).length,
  };
};
const candidates = Object.fromEntries(
  [...metrics].map(([id, rows]) => [
    id,
    {
      all: summary(rows),
      roles: Object.fromEntries(
        [...new Set(rows.map((r) => r.roles))].map((role) => [
          role,
          summary(rows.filter((r) => r.roles === role)),
        ]),
      ),
    },
  ]),
);
await writeJson(output, {
  schema: 1,
  set: '4ed',
  status: 'exploratory-not-promoted',
  rendererHash: study.rendererHash,
  scope:
    '360 nonland Originals; exact isolated native replay, frozen stock transforms and an inner-paper filled-ink/edge objective. Seven shared request policies. No renderer, scan pose, wording, whole-card metric or set-completion change.',
  sources: { inputs: hash(raw[0]), study: hash(raw[1]), printedRows: hash(raw[2]) },
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  rowToolHash: hash(await fs.readFile(new URL('./text-row-agreement.mjs', import.meta.url))),
  objective: study.objective,
  comparisonCandidate,
  candidates,
  rowChecks,
  worstRegressions: outliers.sort((a, b) => a.delta100 - b.delta100).slice(0, 20),
  limitations: [
    'Same scans and diagnostic examples reused during development; no independent holdout.',
    'Regional text indices are not whole-card scores or component certification.',
    'Row agreement requires the same normalized words. Content mismatches stay explicit, not scored.',
    'A larger overlap score can prefer incorrect wrapping. Inspect printed row agreement and glyph size before promoting a policy.',
    'No global translation or per-card best candidate is adopted.',
  ],
});
console.log(JSON.stringify(candidates[comparisonCandidate]));
