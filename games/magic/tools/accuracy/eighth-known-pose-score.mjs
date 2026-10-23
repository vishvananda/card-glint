// Numerical known-raster checks for the Eighth physical-frame recovery model.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { inverseScanMatrix, projectScanPoint } from './scan-transform.mjs';
import {
  eighthScanRegistration,
  eighthPrintedContentControl,
} from './eighth-scan-registration.mjs';
const [inputFile, templateFile, controlsDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: eighth-known-pose-score.mjs INPUTS TEMPLATE CONTROLS OUT');
const inputBytes = await readFile(inputFile),
  inputs = JSON.parse(inputBytes),
  templateBytes = await readFile(templateFile),
  template = JSON.parse(templateBytes);
const controlBytes = await readFile(path.join(controlsDirectory, 'controls.json')),
  controls = JSON.parse(controlBytes);
assert.equal(controls.definition.inputHash, hash(inputBytes));
assert.deepEqual(controls.definition.limits, { cornerRms: 0.35, cornerMax: 0.6 });
const graph = await metricSourceGraph(
  new URL('./eighth-scan-registration.mjs', import.meta.url).pathname,
);
const byId = new Map(inputs.entries.map((e) => [e.id, e])),
  baseline = new Map(),
  rows = [];
const material = (e) => (e.face.land ? 'L' : e.face.artifact ? 'A' : e.card.colors[0]);
const multiply = (a, b) => [
  a[0] * b[0] + a[2] * b[1],
  a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3],
  a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4],
  a[1] * b[4] + a[3] * b[5] + a[5],
];
for (const c of controls.controls) {
  const e = byId.get(c.id);
  assert(e);
  assert.equal(e.reference.sha256, c.referenceHash);
  const target = template.materials[material(e)].target;
  if (!baseline.has(c.id)) {
    const raw = await readFile(objectFile(e.reference));
    assert.equal(hash(raw), e.reference.sha256);
    const source = PNG.sync.read(raw);
    const base = eighthScanRegistration(source, target);
    // Replace the complete central printed area, including art, rules, headings,
    // artist and legal text. Only physical frame strips may affect registration.
    const changed = eighthPrintedContentControl(source);
    const isolated = eighthScanRegistration(changed, target);
    assert.deepEqual(isolated, base, 'Printed-content isolation: ' + c.id);
    assert.deepEqual(isolated.validation, base.validation, 'Printed-content support: ' + c.id);
    baseline.set(c.id, base);
  }
  const base = baseline.get(c.id),
    raw = await readFile(path.join(controlsDirectory, c.file));
  assert.equal(hash(raw), c.sha256);
  const fit = eighthScanRegistration(PNG.sync.read(raw), target);
  let rms = null,
    max = null;
  if (base.accepted && fit.accepted) {
    const expected = {
      matrix: multiply(base.transform.matrix, inverseScanMatrix({ matrix: c.matrix })),
    };
    const errors = [
      [22, 22],
      [466, 22],
      [22, 658],
      [466, 658],
    ].map(([x, y]) => {
      const a = projectScanPoint(x, y, expected),
        b = projectScanPoint(x, y, fit.transform);
      return Math.hypot(a[0] - b[0], a[1] - b[1]);
    });
    rms = Math.sqrt(errors.reduce((s, x) => s + x * x, 0) / errors.length);
    max = Math.max(...errors);
  }
  const passed = base.accepted && fit.accepted && rms <= 0.35 && max <= 0.6;
  rows.push({
    id: c.id,
    name: c.name,
    label: c.label,
    referenceHash: c.referenceHash,
    controlHash: c.sha256,
    baseAccepted: base.accepted,
    accepted: fit.accepted,
    reason: fit.reason,
    rms,
    max,
    passed,
    model: fit.model,
    baselineTransform: base.transform,
    transform: fit.transform,
  });
  if (rows.length % 20 === 0) console.log(rows.length, '/', controls.controls.length);
}
assert.deepEqual(
  await metricSourceGraph(new URL('./eighth-scan-registration.mjs', import.meta.url).pathname),
  graph,
  'Changed recovery method during controls',
);
const summary = {
  sources: baseline.size,
  total: rows.length,
  passed: rows.filter((r) => r.passed).length,
  rejected: rows.filter((r) => !r.accepted).length,
  recoveryFailed: rows.filter((r) => r.accepted && !r.passed).length,
  maximumError: Math.max(...rows.map((r) => r.max ?? 0)),
};
await writeJson(output, {
  schema: 1,
  status:
    summary.passed === rows.length ? 'known-raster-controls-passed' : 'recovery-not-certified',
  definition: {
    inputHash: hash(inputBytes),
    templateHash: hash(templateBytes),
    controlsHash: hash(controlBytes),
    methodGraph: graph,
    toolHash: hash(await readFile(new URL(import.meta.url))),
    limits: controls.definition.limits,
    scope:
      'Full-resolution raster perturbations of the frozen source scans. Numerical recovery controls, not independent printing or renderer calibration approval.',
  },
  summary,
  rows,
});
console.log(JSON.stringify(summary));
assert.equal(summary.passed, summary.total, 'Inspect failed controls before adopting recovery');
