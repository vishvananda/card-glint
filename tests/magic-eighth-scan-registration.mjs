import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { fitAffineFrameAnchors } from '../games/magic/tools/accuracy/scan-affine-anchor-fit.mjs';
import { SCAN_ANCHOR_WINDOWS } from '../games/magic/tools/accuracy/scan-frame-anchors.mjs';
import {
  inverseScanMatrix,
  projectScanPoint,
} from '../games/magic/tools/accuracy/scan-transform.mjs';
import {
  eighthScanRegistration,
  eighthPrintedContentControl,
} from '../games/magic/tools/accuracy/eighth-scan-registration.mjs';
const positions = { left: 26, right: 464, top: 28, bottom: 652 };
const target = {
  reliable: true,
  sides: Object.fromEntries(
    Object.entries(positions).map(([s, position]) => [s, { reliable: true, position }]),
  ),
};
function anchors(matrix) {
  const points = [];
  for (const [side, w] of Object.entries(SCAN_ANCHOR_WINDOWS))
    for (let i = 0; i < w.count; i++) {
      const along = w.start + w.step * i,
        horizontal = w.axis === 'x';
      const [x, y] = projectScanPoint(
        horizontal ? positions[side] : along,
        horizontal ? along : positions[side],
        { matrix: inverseScanMatrix({ matrix }) },
      );
      points.push({ side, index: i, cohort: i % 2 ? 'validation' : 'fit', along, x, y });
    }
  return { points };
}
const m = [1.001, 0.001, -0.0008, 0.999, 0.6, -0.4];
const good = fitAffineFrameAnchors(anchors(m), target, undefined, { fixedModel: true });
assert(good.accepted);
good.transform.matrix.forEach((v, i) => assert(Math.abs(v - m[i]) < 1e-10));
const bad = anchors(m);
bad.points.forEach((p) => {
  if (p.side === 'left' && p.cohort === 'validation') p.x += 2;
});
assert.equal(
  fitAffineFrameAnchors(bad, target, undefined, { fixedModel: true }).reason,
  'frame-validation-disagreement',
);
const short = anchors(m);
short.points = short.points.filter((p) => p.side !== 'top');
assert.equal(
  fitAffineFrameAnchors(short, target, undefined, { fixedModel: true }).reason,
  'insufficient-frame-support',
);
assert.equal(
  fitAffineFrameAnchors(anchors([1.008, 0, 0, 0.998, 0, 0]), target, undefined, {
    fixedModel: true,
  }).reason,
  'excessive-scan-pose',
);
assert.equal(
  fitAffineFrameAnchors(anchors([1, 0, 0, 1, 7, 0]), target, undefined, { fixedModel: true })
    .reason,
  'excessive-scan-pose',
);
const raster = { width: 732, height: 1020, data: new Uint8Array(732 * 1020 * 4) };
for (let y = 0; y < 1020; y++)
  for (let x = 0; x < 732; x++) {
    const cx = ((x + 0.5) * 488) / 732 - 0.5,
      cy = ((y + 0.5) * 680) / 1020 - 0.5;
    const inside =
      cx >= positions.left &&
      cx <= positions.right &&
      cy >= positions.top &&
      cy <= positions.bottom;
    raster.data.set(inside ? [55, 60, 70, 255] : [240, 240, 240, 255], (y * 732 + x) * 4);
  }
const fit = eighthScanRegistration(raster, target);
assert(fit.accepted);
assert.deepEqual(eighthScanRegistration(eighthPrintedContentControl(raster), target), fit);
const dir = new URL('../games/magic/fixtures/accuracy/8ed/', import.meta.url);
const receipt = JSON.parse(await readFile(new URL('native-normalization-review.json', dir)));
const compressed = await readFile(new URL(receipt.evidence.file, dir)),
  raw = gunzipSync(compressed),
  proof = JSON.parse(raw);
assert.equal(hash(compressed), receipt.evidence.sha256);
assert.equal(hash(raw), receipt.evidence.contentSha256);
assert.deepEqual(proof.definition, receipt.definition);
assert.deepEqual(proof.summary, receipt.summary);
const g = receipt.definition.methodGraph;
assert.equal(hash(JSON.stringify({ node: g.node, sources: g.sources })), g.hash);
for (const [file, digest] of g.sources)
  assert.equal(
    hash(await readFile(new URL('../games/magic/tools/accuracy/' + file, import.meta.url))),
    digest,
  );
for (const [file, key] of [
  ['printing-calibration-normalize.mjs', 'normalizationToolHash'],
  ['eighth-known-pose-score.mjs', 'controlToolHash'],
])
  assert.equal(
    hash(await readFile(new URL('../games/magic/tools/accuracy/' + file, import.meta.url))),
    receipt.definition[key],
  );
const gen = receipt.definition.controlGenerator;
assert.equal(
  hash(
    await readFile(
      new URL('../games/magic/tools/accuracy/printing-known-pose-inputs.py', import.meta.url),
    ),
  ),
  gen.toolHash,
);
assert.equal(
  hash(
    await readFile(
      new URL('../games/magic/tools/accuracy/modern-known-pose-inputs.py', import.meta.url),
    ),
  ),
  gen.nativeWarpHelperHash,
);
assert.equal(
  hash(await readFile(new URL('../package-lock.json', import.meta.url))),
  receipt.definition.decoderLockHash,
);
const corpus = JSON.parse(await readFile(new URL('corpus.json', dir)));
const nonfoil = corpus.entries.filter((e) => !e.collectorNumber.includes('★'));
assert.equal(nonfoil.length, 357);
assert.deepEqual(proof.rows.map((r) => r.id).sort(), nonfoil.map((e) => e.id).sort());
for (const r of proof.rows) {
  assert.equal(r.referenceHash, nonfoil.find((e) => e.id === r.id).referenceHash);
  assert(r.accepted && r.contentIsolationPassed && r.nonfoilEligible);
}
const multiply = (a, b) => [
  a[0] * b[0] + a[2] * b[1],
  a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3],
  a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4],
  a[1] * b[4] + a[3] * b[5] + a[5],
];
assert.equal(proof.controls.length, 144);
assert.equal(new Set(proof.controls.map((c) => c.id)).size, 18);
for (const c of proof.controls) {
  assert(c.accepted && c.baseAccepted && c.passed);
  const expected = {
    matrix: multiply(c.baselineTransform.matrix, inverseScanMatrix({ matrix: c.knownMatrix })),
  };
  const errors = [
    [22, 22],
    [466, 22],
    [22, 658],
    [466, 658],
  ].map(([x, y]) => {
    const a = projectScanPoint(x, y, expected),
      b = projectScanPoint(x, y, c.transform);
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
  });
  const rms = Math.sqrt(errors.reduce((s, v) => s + v * v, 0) / errors.length),
    max = Math.max(...errors);
  assert(Math.abs(rms - c.rms) < 1e-12 && Math.abs(max - c.max) < 1e-12);
  assert(rms <= 0.35 && max <= 0.6);
}
for (const id of [
  '8c78d392-9f2f-4241-9a10-6ac9b1e86154',
  '34b5709c-d6bb-4866-a613-cbe93a918caa',
  '9513c206-b578-4973-93cc-077e5a6658b0',
  '5eedb94c-058e-4c3a-96cf-e6624c03d26e',
  '066b5162-8724-4df3-a3d5-274036d0049d',
])
  assert(proof.controls.some((c) => c.id === id));
console.log(
  'Eighth: 357 isolated scan poses; 144 known-raster controls; affine recovery and rejection controls passed.',
);
