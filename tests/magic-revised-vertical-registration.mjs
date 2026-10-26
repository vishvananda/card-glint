import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { median } from '../games/magic/tools/accuracy/metrics.mjs';
import { physicalRevisedMaterial } from '../games/magic/tools/accuracy/revised-pixel-template-fit.mjs';
import {
  composePrintedVertical,
  verifyVerticalFrameProfiles,
} from '../games/magic/tools/accuracy/printed-frame-vertical-fit.mjs';
import { revisedVerticalOptions } from '../games/magic/tools/accuracy/revised-vertical-frame.mjs';
const base = 'games/magic/fixtures/accuracy/3ed-recheck/';
const bytes = async (name) => gunzipSync(await fs.readFile(base + name + '.json.gz'));
const ib = await bytes('corrected-original-inputs'),
  pb = await bytes('vertical-parent-poses'),
  report = JSON.parse(await bytes('vertical-interior-normalization')),
  inputs = JSON.parse(ib),
  parents = JSON.parse(pb),
  colored = JSON.parse(await bytes('colored-horizontal-normalization')),
  artifact = JSON.parse(await bytes('artifact-pixel-normalization'));
assert.equal(report.source.inputHash, hash(ib));
assert.equal(report.source.parentHash, hash(pb));
assert.equal(parents.inputHash, hash(ib));
assert.equal(
  report.source.toolHash,
  hash(await fs.readFile('games/magic/tools/accuracy/revised-vertical-register.mjs')),
);
for (const [file, expected] of Object.entries(report.source.modules))
  assert.equal(hash(await fs.readFile('games/magic/tools/accuracy/' + file)), expected, file);
assert.equal(parents.rows.length, 281);
for (const p of parents.rows) {
  const source =
    p.material === 'A'
      ? artifact.rows.find((r) => r.id === p.id)
      : colored.groups[p.material].rows.find((r) => r.id === p.id);
  assert(source);
  assert.equal(source.referenceHash, p.referenceHash);
  assert.equal(source.cohort, p.cohort);
  assert.equal(source.accepted, p.accepted);
  assert.deepEqual(source.transform, p.transform);
}
const seen = new Set();
let accepted = 0,
  calCount = 0,
  valCount = 0;
for (const [material, g] of Object.entries(report.groups)) {
  assert.deepEqual(g.strips, revisedVerticalOptions.strips);
  assert.deepEqual(g.fitAnchors, revisedVerticalOptions.fitAnchors);
  assert.deepEqual(g.verificationKeys, revisedVerticalOptions.verificationKeys);
  assert(g.passes.every((p) => p.medianTop === 0 && p.medianBottom === 0));
  const calibrators = g.rows.filter((r) => r.templateMember);
  assert(calibrators.every((r) => r.parentAccepted && r.cohort === 'calibration'));
  assert.equal(median(calibrators.map((r) => r.endpoints.top)), 0);
  assert.equal(median(calibrators.map((r) => r.endpoints.bottom)), 0);
  for (const [key, template] of Object.entries(g.templates))
    assert.deepEqual(
      template,
      template.map((_, i) => median(calibrators.map((r) => r.profiles[key][i]))),
    );
  const expected = inputs.entries
    .filter((e) => physicalRevisedMaterial(e) === material)
    .map((e) => e.id)
    .sort();
  assert.deepEqual(g.rows.map((r) => r.id).sort(), expected);
  for (const r of g.rows) {
    assert(!seen.has(r.id));
    seen.add(r.id);
    const e = inputs.entries.find((e) => e.id === r.id),
      p = parents.rows.find((p) => p.id === r.id);
    assert.equal(r.referenceHash, e.reference.sha256);
    assert.equal(r.logicalMaterial, e.material);
    assert.equal(r.parentAccepted, p.accepted);
    assert.deepEqual(r.parentTransform, p.transform);
    assert.equal(r.templateMember, r.cohort === 'calibration' && r.parentAccepted);
    assert.deepEqual(
      r.transform,
      composePrintedVertical(p.transform, r.endpoints.top, r.endpoints.bottom),
    );
    const verification = verifyVerticalFrameProfiles(
      r.profiles,
      g.templates,
      revisedVerticalOptions,
    );
    assert.deepEqual(r.bands, verification.bands);
    assert.equal(r.fitPassed, verification.fitPassed);
    assert.equal(r.independentPassed, verification.independentPassed);
    const bounded =
      Math.abs(r.endpoints.top) <= 4.75 &&
      Math.abs(r.endpoints.bottom) <= 4.75 &&
      Math.abs((r.endpoints.bottom - r.endpoints.top) / 545) <= 0.006;
    assert.equal(r.bounded, bounded);
    assert.equal(
      r.accepted,
      r.parentAccepted &&
        bounded &&
        !r.endpoints.boundary &&
        !r.endpoints.coarseBoundary &&
        verification.fitPassed &&
        verification.independentPassed,
    );
    if (r.accepted) {
      accepted++;
      if (r.cohort === 'calibration') calCount++;
      else valCount++;
    }
  }
}
assert.equal(seen.size, 281);
assert.equal(accepted, 223);
assert.equal(calCount, 152);
assert.equal(valCount, 71);
assert.equal(report.summary.accepted, accepted);
assert.equal(report.summary.parentAccepted, 270);
console.log(
  'Revised281 source-only vertical poses:223 accepted,58 retained exclusions,152 calibration/71 reused validation; exact parent chain, zero gauges, independent frozen checks and reproducible module identities.',
);
