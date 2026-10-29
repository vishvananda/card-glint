// Independent source-only controls for a frozen RGB recovery proposal.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson, root } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { projectScanPoint } from './scan-transform.mjs';
import { median, quantile } from './metrics.mjs';
import {
  chromaticProfiles,
  chromaticTemplate,
  fitChromaticProfiles,
} from './old-frame-chromatic-profiles.mjs';
const [inputFile, parentFile, proposalFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS PARENT_POSES RGB_PROPOSAL NEW_AUDIT');
const [ib, pb, rb] = await Promise.all(
  [inputFile, parentFile, proposalFile].map((p) => fs.readFile(p)),
);
const [input, parent, proposal] = [ib, pb, rb].map((b) => JSON.parse(b));
assert.equal(proposal.inputHash, hash(ib));
assert.equal(parent.inputHash, hash(ib));
assert.equal(proposal.parentPoseHash, hash(pb));
for (const [n, expected] of Object.entries(proposal.sources))
  assert.equal(hash(await fs.readFile(new URL(n, import.meta.url))), expected);
const test = 'tests/magic-old-frame-chromatic-profiles.mjs',
  testHash = hash(await fs.readFile(path.join(root, test)));
const tests = spawnSync(process.execPath, [test], { cwd: root, encoding: 'utf8' });
assert.equal(tests.status, 0, tests.stdout + tests.stderr);
const basic = new Set(['Plains', 'Island', 'Swamp', 'Mountain', 'Forest']);
const images = [];
for (const e of input.entries) {
  const bytes = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(bytes), e.reference.sha256);
  images.push({
    id: e.id,
    name: e.name,
    material: e.material === 'L' && basic.has(e.name) ? 'L-' + e.name : e.material,
    profiles: chromaticProfiles(normalize(PNG.sync.read(bytes))),
  });
}
const templates = Object.fromEntries(
  [...new Set(images.map((r) => r.material))].map((m) => [
    m,
    chromaticTemplate(images.filter((r) => r.material === m).map((r) => r.profiles)),
  ]),
);
assert.deepEqual(templates, proposal.templates, 'RGB template population changed');
const landmarks = [
  [24, 26],
  [464, 26],
  [24, 653],
  [464, 653],
  [60, 70],
  [430, 610],
];
const rows = [];
for (const e of images) {
  const before = parent.rows.find((r) => r.id === e.id),
    proposed = proposal.rows.find((r) => r.id === e.id);
  assert.equal(proposed.referenceHash, before.referenceHash);
  const fit = fitChromaticProfiles(e.profiles, templates[e.material]);
  if (!before.accepted) {
    assert.equal(fit.accepted, true, e.name + ': rejected recovery');
    assert.deepEqual(fit.transform, proposed.transform);
    assert(fit.validation.rms <= 0.8);
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      status: 'recovered',
      transform: fit.transform,
      validation: fit.validation,
      support: fit.support,
    });
  } else {
    assert.equal(proposed.accepted, true);
    assert.deepEqual(proposed.transform, before.transform, 'Changed accepted parent pose');
    if (!fit.accepted) {
      rows.push({
        id: e.id,
        name: e.name,
        material: e.material,
        status: 'retained-parent-new-method-rejected',
        reason: fit.reason,
      });
      continue;
    }
    const drift = landmarks.map(([x, y]) => {
      const a = projectScanPoint(x, y, fit.transform),
        b = projectScanPoint(x, y, before.transform);
      return Math.hypot(a[0] - b[0], a[1] - b[1]);
    });
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      status: 'accepted-control',
      maximumDrift: Math.max(...drift),
      drift,
    });
  }
}
const materials = {};
for (const m of new Set(rows.filter((r) => r.status === 'recovered').map((r) => r.material))) {
  const rr = rows.filter((r) => r.material === m && r.status === 'accepted-control');
  const rejected = rows.filter(
    (r) => r.material === m && r.status === 'retained-parent-new-method-rejected',
  );
  assert(rr.length >= 3, 'Insufficient source control population ' + m);
  const values = rr.map((r) => r.maximumDrift);
  materials[m] = {
    controls: rr.length,
    retainedRejected: rejected.length,
    medianDrift: median(values),
    p90Drift: quantile(values, 0.9),
    maximumDrift: Math.max(...values),
  };
  console.log(input.set, m, JSON.stringify(materials[m]));
}
for (const [n, expected] of Object.entries(proposal.sources))
  assert.equal(hash(await fs.readFile(new URL(n, import.meta.url))), expected);
assert.equal(hash(await fs.readFile(path.join(root, test))), testHash);
await writeJson(out, {
  schema: 1,
  status: 'source-only-rgb-recovery-controls-measured',
  set: input.set,
  source: {
    inputs: hash(ib),
    parent: hash(pb),
    proposal: hash(rb),
    tool: hash(await fs.readFile(new URL(import.meta.url))),
    test,
    testHash,
  },
  scope:
    'All source scans recompute the frozen RGB templates. Every recovered transform repeats exactly with original four-side geometry and alternating-strip validation. All accepted parent poses remain fixed. New-method controls compare source-only transforms at six card landmarks. Synthetic translation/rotation/exposure, strip-isolation, flat/noise and missing-validation controls pass. Development references are reused, not independent held-out card names.',
  syntheticControlsPassed: true,
  materials,
  rows,
});
