// Certify frozen scan-only poses without changing any pose or renderer profile.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { hash, root, writeJson } from './common.mjs';
import { projectScanPoint, inverseScanMatrix } from './scan-transform.mjs';
import { bounded } from './scan-gradient-fit.mjs';
import { unpackFramePatches } from './frame-patch-profiles.mjs';
const [
  observationsFile,
  templatesFile,
  normalizationFile,
  knownFile,
  confirmationFile,
  valueFile,
  visualFile,
  output,
] = process.argv.slice(2);
assert(
  output,
  'Usage: modern-normalization-certify.mjs OBSERVATIONS TEMPLATES NORMALIZATION KNOWN CONFIRMATION VALUE VISUAL_REVIEW OUTPUT',
);
const load = async (file) => {
  const bytes = await readFile(file);
  return { bytes, data: JSON.parse(bytes), sha256: hash(bytes) };
};
const [observations, templates, normalization, visual] = await Promise.all(
  [observationsFile, templatesFile, normalizationFile, visualFile].map(load),
);
const n = normalization.data,
  o = observations.data,
  t = templates.data;
assert.equal(n.set, 'm21');
assert.equal(n.rows.length, 297);
assert.equal(new Set(n.rows.map((r) => r.id)).size, 297);
assert.equal(n.observationsHash, observations.sha256);
assert.equal(n.templateHash, hash(JSON.stringify(t)));
assert.equal(t.observationsHash, observations.sha256);
assert.equal(visual.data.normalizationHash, normalization.sha256);
assert.equal(visual.data.observationsHash, observations.sha256);
assert.equal(visual.data.reviewed, true, 'Explicit complete visual review required');
const census = (rows) => rows.map((r) => [r.id, r.referenceHash]).sort();
assert.deepEqual(census(o.rows), census(n.rows));
assert.deepEqual(census(visual.data.rows), census(n.rows));
for (const p of visual.data.pages)
  assert.equal(hash(await readFile(path.join(path.dirname(visualFile), p.file))), p.sha256);
for (const review of t.reviews) {
  const data = await load(path.join(root, 'games/magic/fixtures/accuracy', review.file));
  assert.equal(data.sha256, review.sha256);
  assert.deepEqual(census(data.data.references), census(n.rows));
}
for (const [name, digest] of Object.entries(t.sources))
  assert.equal(
    hash(await readFile(new URL(name, import.meta.url))),
    digest,
    'Changed normalization method: ' + name,
  );
for (const row of o.rows) {
  assert.equal(row.contentIsolationPassed, true);
  const bytes = await readFile(path.join(path.dirname(observationsFile), row.framePatches.file));
  assert.equal(hash(bytes), row.framePatches.sha256);
  unpackFramePatches(bytes, row.framePatches.description);
}
const support = (row) => {
  assert.equal(row.accepted, true, row.id);
  assert.equal(row.fit.accepted, true, row.id + '/fit');
  assert.equal(row.certification.accepted, true, row.id + '/held-fields');
  assert.equal(row.fit.count, 24);
  assert.equal(row.certification.count, 12);
  assert(bounded(row.parameters), row.id + '/bounds');
  assert.equal(row.model, 'affine-joint-2d');
  projectScanPoint(0, 0, row.transform);
};
for (const row of n.rows) support(row);
const multiply = (a, b) => [
  a[0] * b[0] + a[2] * b[1],
  a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3],
  a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4],
  a[1] * b[4] + a[3] * b[5] + a[5],
];
const controls = [];
for (const [kind, file, count] of [
  ['known', knownFile, 231],
  ['confirmation', confirmationFile, 891],
  ['value', valueFile, 594],
]) {
  const result = await load(file),
    r = result.data;
  const input = await load(path.join(path.dirname(file), 'controls.json'));
  assert.equal(r.definition.controlsHash, input.sha256);
  assert.equal(r.definition.normalizationHash, normalization.sha256);
  assert.equal(r.definition.observationsHash, observations.sha256);
  assert.equal(r.definition.templatesHash, templates.sha256);
  assert.equal(r.rows.length, count);
  assert.equal(input.data.controls.length, count);
  assert.equal(r.summary.completed, count);
  assert.equal(r.summary.passed, count);
  assert.deepEqual(r.definition.limits, { cornerRms: 0.35, cornerMax: 0.6 });
  assert.equal(
    hash(await readFile(new URL('modern-known-pose-score.mjs', import.meta.url))),
    r.definition.toolHash,
  );
  for (const [name, digest] of Object.entries(r.definition.sources))
    assert.equal(
      hash(await readFile(new URL(name, import.meta.url))),
      digest,
      'Changed recovery method: ' + name,
    );
  for (const graph of Object.values(r.definition.sourceGraphs)) {
    for (const [name, digest] of graph.sources)
      assert.equal(hash(await readFile(new URL(name, import.meta.url))), digest);
    assert.equal(hash(JSON.stringify({ node: graph.node, sources: graph.sources })), graph.hash);
  }
  const keys = new Set();
  for (const row of r.rows) {
    const key = row.id + '/' + row.label;
    assert(!keys.has(key));
    keys.add(key);
    const control = input.data.controls.find((c) => c.id === row.id && c.label === row.label);
    assert(control, key);
    assert.equal(control.sha256, row.controlHash);
    const base = n.rows.find((b) => b.id === row.id);
    assert(base, key);
    assert.equal(base.referenceHash, row.referenceHash);
    assert.deepEqual(
      row.expected,
      multiply(base.transform.matrix, inverseScanMatrix({ matrix: control.matrix })),
    );
    support(row);
    const errors = [
      [20, 20],
      [468, 20],
      [20, 630],
      [468, 630],
    ].map(([x, y]) => {
      const a = projectScanPoint(x, y, { matrix: row.expected }),
        b = projectScanPoint(x, y, row.transform);
      return Math.hypot(a[0] - b[0], a[1] - b[1]);
    });
    const rms = Math.hypot(...errors) / 2,
      max = Math.max(...errors);
    assert(Math.abs(rms - row.cornerRms) < 1e-10);
    assert(Math.abs(max - row.cornerMax) < 1e-10);
    assert(rms <= r.definition.limits.cornerRms && max <= r.definition.limits.cornerMax, key);
    assert.equal(row.passed, true);
    assert.equal(row.baselineAccepted, true);
  }
  if (kind !== 'known') assert.equal(new Set(r.rows.map((row) => row.id)).size, 297);
  controls.push({
    kind,
    sha256: result.sha256,
    inputHash: input.sha256,
    definition: r.definition,
    summary: r.summary,
    rows: r.rows.map(
      ({
        id,
        label,
        geometry,
        referenceHash,
        controlHash,
        expected,
        transform,
        cornerRms,
        cornerMax,
      }) => ({
        id,
        label,
        geometry,
        referenceHash,
        controlHash,
        expected,
        transform,
        cornerRms,
        cornerMax,
      }),
    ),
  });
}
const rows = n.rows.map(
  ({
    id,
    name,
    family,
    geometry,
    referenceHash,
    nonfoilEligible,
    transform,
    fit,
    certification,
  }) => ({
    id,
    name,
    family,
    geometry,
    referenceHash,
    nonfoilEligible,
    transform,
    fit,
    certification,
  }),
);
const detail = {
  schema: 1,
  set: 'm21',
  status: 'validated-scan-only-normalization',
  definition: {
    observationsHash: observations.sha256,
    templatesHash: templates.sha256,
    normalizationHash: normalization.sha256,
    visualReviewHash: visual.sha256,
    toolHash: hash(await readFile(fileURLToPath(import.meta.url))),
  },
  policy: n.policy,
  templates: t,
  controls,
  rows,
  visual: {
    reviewedAt: visual.data.reviewedAt,
    finding: visual.data.finding,
    pages: visual.data.pages,
  },
};
const raw = Buffer.from(JSON.stringify(detail) + '\n'),
  compressed = gzipSync(raw);
await writeFile(output + '.gz', compressed);
const result = {
  ...detail,
  templates: undefined,
  rows: undefined,
  controls: controls.map(({ rows, ...c }) => c),
  summary: {
    printings: 297,
    nonfoil: rows.filter((r) => r.nonfoilEligible).length,
    foilOnly: rows.filter((r) => !r.nonfoilEligible).length,
    accepted: 297,
    knownControls: 231,
    confirmationControls: 891,
    valueControls: 594,
    allControlsPassed: 1716,
    maxRecoveryError: Math.max(...controls.map((c) => c.summary.maxCornerError)),
    frameFamilies: Object.keys(t.templates).length,
  },
  evidence: {
    file: path.basename(output) + '.gz',
    sha256: hash(compressed),
    contentSha256: hash(raw),
  },
  limitations:
    'Comparison-only scan poses. Same development scans and population templates; no held-out-name transfer claim. Fit uses two disjoint strip partitions and certification uses the third; validation and certification share that held partition. These controls certify numerical recovery and physical boundary support, not renderer geometry, text alignment, frame color, foil pigment or complete-set fidelity.',
};
await writeJson(output, result);
console.log(JSON.stringify(result.summary));
