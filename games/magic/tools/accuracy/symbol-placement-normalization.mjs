import assert from 'node:assert/strict';
import { fixtureRoot, outputRoot, readJson, writeJson, hash } from './common.mjs';
import { fittedSymbolBounds } from './symbol-bounds.mjs';
import { median } from './metrics.mjs';

// Candidate derivation only. This never edits a painter or optimizes a scan.
// UUID partitioning is reproducible development validation, not a fresh holdout.
const [set, stage = 'after'] = process.argv.slice(2);
assert.match(set ?? '', /^[a-z0-9]{2,6}$/);
assert.match(stage, /^after(?:-[a-z0-9]+)*$/);
assert.ok(
  ['all', 'arn', 'drk', 'fem', 'hml', 'leg', 'mir', 'por', 'sth', 'tmp', 'vis', 'wth'].includes(
    set,
  ),
  'Rarity-dependent stencils require separate template groups',
);
const poses = await readJson(`${fixtureRoot}/${set}-symbol-scan-pose.json`),
  bounds = await readJson(`${fixtureRoot}/${set}-symbol-bounds-${stage}.json`),
  capture = await readJson(`${outputRoot}/${set}-symbol/${stage}/capture.json`),
  adoption = await readJson(
    `${fixtureRoot}/${set}-symbol-${set === 'por' && stage === 'after-normalized' ? 'scan-adoption-plan' : 'adoption-plan'}.json`,
  );
assert.equal(bounds.captureHash, hash(JSON.stringify(capture)));
// Blank subtraction is available for calibration captures. These pre-Exodus
// sets have one symbol treatment across rarities; reuse its measured center
// within the identical material/geometry group, retaining template provenance.
const templates = Object.fromEntries(
  [...new Set(poses.rows.map((r) => r.material))].map((material) => {
    const measured = bounds.rows.filter(
      (b) =>
        b.renders.after?.stable && poses.rows.find((p) => p.id === b.id)?.material === material,
    );
    const centers = measured.map((b) => fittedSymbolBounds(b.renders.after.rect));
    return [
      material,
      {
        ids: measured.map((b) => b.id),
        centerX: median(centers.map((c) => c.centerX)),
        centerY: median(centers.map((c) => c.centerY)),
      },
    ];
  }),
);
const policy = {
  minimumTrain: 4,
  minimumValidation: 4,
  maxMedianDeviation: 1.25,
  maxPartitionDisagreement: 1,
  maxShift: 4,
  minimumValidationGain: 0.15,
  grid: 0.25,
};
const rows = poses.rows.map((p) => {
  const b = bounds.rows.find((r) => r.id === p.id),
    c = capture.rows.find((r) => r.id === p.id);
  assert.ok(b && c);
  assert.equal(b.referenceHash, p.referenceHash);
  assert.equal(c.referenceHash, p.referenceHash);
  const reason = !p.accepted
    ? p.reason
    : !b.reference?.stable
      ? 'reference-symbol-uncertain'
      : !templates[p.material].ids.length
        ? 'render-symbol-uncertain'
        : null;
  const ref = reason ? null : fittedSymbolBounds(b.reference.rect, p.transform),
    render = reason ? null : templates[p.material];
  return {
    id: p.id,
    name: p.name,
    material: p.material,
    referenceHash: p.referenceHash,
    partition: parseInt(hash(p.id).slice(0, 2), 16) < 128 ? 'train' : 'validation',
    reason,
    dx: ref ? ref.centerX - render.centerX : null,
    dy: ref ? ref.centerY - render.centerY : null,
  };
});
const groups = {};
for (const material of [...new Set(rows.map((r) => r.material))].sort()) {
  const usable = rows.filter((r) => r.material === material && !r.reason),
    train = usable.filter((r) => r.partition === 'train'),
    validation = usable.filter((r) => r.partition === 'validation'),
    rawShift = { dx: median(train.map((r) => r.dx)), dy: median(train.map((r) => r.dy)) };
  const shift = Object.fromEntries(
    Object.entries(rawShift).map(([k, v]) => [
      k,
      v === null ? null : Math.round(v / policy.grid) * policy.grid,
    ]),
  );
  const spread = Object.fromEntries(
      ['dx', 'dy'].map((k) => [k, median(train.map((r) => Math.abs(r[k] - rawShift[k])))]),
    ),
    partitionDisagreement = Object.fromEntries(
      ['dx', 'dy'].map((k) => [
        k,
        validation.length && train.length
          ? Math.abs(median(validation.map((r) => r[k])) - rawShift[k])
          : null,
      ]),
    );
  const before = median(validation.map((r) => Math.hypot(r.dx, r.dy))),
    after = median(validation.map((r) => Math.hypot(r.dx - shift.dx, r.dy - shift.dy)));
  const reasons = [];
  if (train.length < policy.minimumTrain || validation.length < policy.minimumValidation)
    reasons.push('insufficient-stable-symbols');
  if (Object.values(spread).some((v) => v > policy.maxMedianDeviation))
    reasons.push('variable-placement');
  if (Object.values(partitionDisagreement).some((v) => v > policy.maxPartitionDisagreement))
    reasons.push('partition-disagreement');
  if (Object.values(shift).some((v) => Math.abs(v) > policy.maxShift))
    reasons.push('large-shift-review');
  if (before !== null && after !== null && before - after < policy.minimumValidationGain)
    reasons.push('no-validation-improvement');
  const prior = adoption.materialGroups?.[material]?.geometry ?? adoption.geometry;
  groups[material] = {
    accepted: reasons.length === 0,
    reasons,
    train: train.length,
    validation: validation.length,
    rawShift,
    shift,
    spread,
    partitionDisagreement,
    validationCenterError: { before, after },
    geometry: reasons.length
      ? null
      : { ...prior, right: prior.right + shift.dx, centerY: prior.centerY + shift.dy },
    priorGeometry: prior,
    ids: rows.filter((r) => r.material === material).map((r) => r.id),
    supportIds: usable.map((r) => r.id),
  };
}
const result = {
  schemaVersion: 1,
  scope:
    'Frozen per-card frame normalization precedes symbol measurement. Propose shared set/material translations from native symbol bounds only, preserving width/height and assets. Deterministic development train/validation partition; all references previously observed. Rendering, color-insensitive scores, control/type checks and visual review are required before adoption.',
  captureStage: stage,
  captureHash: hash(JSON.stringify(capture)),
  boundsHash: hash(JSON.stringify(bounds)),
  poseHash: hash(JSON.stringify(poses)),
  policy,
  templates,
  groups,
  rows,
};
await writeJson(`${fixtureRoot}/${set}-symbol-pose-placement-candidates.json`, result);
console.log(
  set,
  Object.fromEntries(
    Object.entries(groups).map(([k, g]) => [
      k,
      {
        accepted: g.accepted,
        shift: g.shift,
        train: g.train,
        validation: g.validation,
        reasons: g.reasons,
      },
    ]),
  ),
);
