import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, hash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { normalizedReference } from './abu-reference-cache.mjs';
import { outerManaCircle } from './abu-mana-ring.mjs';
import { median } from './hsb-color.mjs';

const [inputFile, posesDirectory, nativeRoot, circlesFile, output] = process.argv.slice(2);
if (!output) throw Error('Usage: mana-spacing-audit.mjs INPUTS POSES NATIVE CIRCLES OUT');
const input = await readJson(inputFile),
  poses = await readJson(path.join(posesDirectory, 'normalization.json')),
  circles = await readJson(circlesFile),
  capture = await readJson(path.join(nativeRoot, 'capture.json'));
assert.equal(hash(await readFile(inputFile)), poses.inputHash);
assert.equal(circles.inputHash, poses.inputHash);
assert.equal(capture.inputHash, poses.inputHash);
assert.equal(capture.complete, true);
assert.equal(circles.normalizationHash, hash(JSON.stringify(poses)));
const manifests = new Map(),
  rows = [];
for (const e of input.entries) {
  if ((e.face.manaSymbols ?? []).length < 2) continue;
  const right = circles.rows.find((r) => r.id === e.id);
  if (!right?.accepted) continue;
  const pose = poses.rows.find((p) => p.id === e.id);
  assert.equal(right.referenceHash, e.reference.sha256);
  assert.equal(right.poseHash, hash(JSON.stringify(pose)));
  if (!manifests.has(e.material))
    manifests.set(
      e.material,
      await readJson(path.join(nativeRoot, e.material, 'observations.json')),
    );
  const record = manifests.get(e.material).records.find((r) => r.id === e.id);
  const bytes = await readFile(path.join(nativeRoot, e.material, record.baseline.file));
  assert.equal(hash(bytes), record.baseline.sha256);
  assert.equal(hash(bytes), right.renderHash);
  const native = normalize(PNG.sync.read(bytes)),
    reference = (await normalizedReference(e, pose, path.join(posesDirectory, 'rasters'))).image;
  const measurements = {};
  for (const [key, image] of [
    ['render', native],
    ['scan', reference],
  ]) {
    const last = right[key].circle;
    const previous = outerManaCircle(image, {
      x: last.x - 27,
      y: last.y,
      range: 5,
      radiusRange: [9.5, 14],
    });
    measurements[key] = { last, previous, pitch: last.x - previous.x };
  }
  rows.push({
    id: e.id,
    name: e.card.name,
    cohort: pose.cohort,
    referenceHash: e.reference.sha256,
    nativeHash: hash(bytes),
    poseHash: right.poseHash,
    ...measurements,
    accepted:
      pose.accepted && Object.values(measurements).every((m) => m.previous.status === 'measured'),
    delta: measurements.scan.pitch - measurements.render.pitch,
  });
}
const cohorts = Object.fromEntries(
  ['calibration', 'validation'].map((c) => {
    const a = rows.filter((r) => r.cohort === c && r.accepted);
    return [
      c,
      {
        cards: a.length,
        nativePitch: median(a.map((r) => r.render.pitch)),
        referencePitch: median(a.map((r) => r.scan.pitch)),
        delta: median(a.map((r) => r.delta)),
      },
    ];
  }),
);
await writeJson(output, {
  schema: 1,
  set: input.set,
  inputHash: poses.inputHash,
  normalizationHash: hash(JSON.stringify(poses)),
  rendererHash: capture.rendererHash,
  circlesHash: hash(await readFile(circlesFile)),
  scope:
    'Independent perimeter locations of the rightmost two discs; one pair per multi-symbol printing, fixed scan-only pose, no glyph-edge objective and no per-card renderer offsets. Rejected circle measurements remain visible.',
  cohorts,
  rows,
});
console.log(cohorts);
