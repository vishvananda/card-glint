// Diagnose the outer printed rectangle after independent scan normalization.
// This tool does not fit scan poses or approve art/rules-box geometry.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, readJson, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { measureWhiteFrame, boundaryDifference } from './frame-boundaries.mjs';
import { median } from './metrics.mjs';
const [captureDirectory, inputsFile, output, posesFile] = process.argv.slice(2);
assert(output, 'Usage: early-native-boundaries.mjs CAPTURE INPUTS OUTPUT');
const captureBytes = await readFile(path.join(captureDirectory, 'capture.json')),
  capture = JSON.parse(captureBytes),
  inputsBytes = await readFile(inputsFile),
  inputs = JSON.parse(inputsBytes),
  byId = new Map(inputs.entries.map((e) => [e.id, e])),
  rows = [];
assert.equal(capture.rows.length, inputs.entries.length, 'Complete printing coverage required');
const posesBytes = posesFile ? await readFile(posesFile) : undefined;
const poses = posesBytes ? JSON.parse(posesBytes) : undefined;
if (poses) {
  assert.equal(poses.inputHash, hash(inputsBytes));
  assert(
    capture.source.inputs.some(
      (r) => r.inputHash === hash(inputsBytes) && r.poseHash === hash(posesBytes),
    ),
  );
}

for (const r of capture.rows) {
  const e = byId.get(r.id);
  assert(e);
  assert.equal(r.referenceHash, e.reference.sha256);
  const load = async (suffix, digest) => {
    const bytes = await readFile(path.join(captureDirectory, r.set, r.id + suffix + '.png'));
    assert.equal(hash(bytes), digest);
    return normalize(PNG.sync.read(bytes));
  };
  const [scan, render] = await Promise.all([load('-scan', r.scanHash), load('', r.renderHash)]);
  const difference = boundaryDifference(measureWhiteFrame(scan), measureWhiteFrame(render));
  rows.push({
    id: r.id,
    name: r.name,
    set: r.set,
    material: e.material,
    cohort: poses?.rows.find((p) => p.id === r.id)?.cohort ?? e.cohort,
    acceptedPose: r.accepted,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    ...difference,
  });
}
const summarize = (group) => ({
  total: group.length,
  complete: group.filter((r) => r.complete).length,
  coherent: group.filter((r) => r.coherent).length,
  sides: Object.fromEntries(
    ['left', 'right', 'top', 'bottom'].map((side) => {
      const values = group.filter((r) => r.coherent).map((r) => r.sides[side].delta);
      return [
        side,
        {
          count: values.length,
          medianDelta: values.length ? median(values) : null,
          maxAbsDelta: values.length ? Math.max(...values.map(Math.abs)) : null,
        },
      ];
    }),
  ),
});
const dependencies = Object.fromEntries(
  await Promise.all(
    ['pixels-pure', 'frame-boundaries', 'metrics', 'edges'].map(async (name) => {
      const f = new URL('./' + name + '.mjs', import.meta.url);
      return [name + '.mjs', hash(await readFile(f))];
    }),
  ),
);
const report = {
  schema: 1,
  status: 'diagnostic-not-promoted',
  scope:
    'Outer printed white-stock/frame boundary only. Same frozen independently aligned native captures; canonical downsampling introduces no extra pose fit. Outside-first signed-contrast landmarks retain missing or incoherent observations. This does not certify internal bevels, art apertures, text boxes, color, or whole-set completion.',
  validationKind: 'reused-development',
  captureHash: hash(captureBytes),
  inputHash: hash(inputsBytes),
  ...(posesBytes ? { normalizationHash: hash(posesBytes) } : {}),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies,
  summary: summarize(rows),
  materials: Object.fromEntries(
    [...new Set(rows.map((r) => r.material))].map((m) => [
      m,
      summarize(rows.filter((r) => r.material === m)),
    ]),
  ),
  rows,
};
await writeJson(output, report);
console.log(
  JSON.stringify({ total: rows.length, summary: report.summary, materials: report.materials }),
);
