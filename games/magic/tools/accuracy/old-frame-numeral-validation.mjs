// Validate a numeral proposal with real native pixels, independently of disc ink.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { manaGlyphMask, compareManaGlyph } from './mana-glyph-metrics.mjs';
import { median } from './hsb-color.mjs';
import { outerManaCircle } from './abu-mana-ring.mjs';
const [inputFile, posesFile, ringsFile, beforeDirectory, afterDirectory, out] =
  process.argv.slice(2);
assert(out, 'Use INPUTS POSES RINGS BEFORE_NATIVE AFTER_NATIVE NEW_OUTPUT');
const files = [
  inputFile,
  posesFile,
  ringsFile,
  path.join(beforeDirectory, 'capture.json'),
  path.join(afterDirectory, 'capture.json'),
];
const bytes = await Promise.all(files.map((f) => fs.readFile(f)));
const [inputs, poses, rings, before, after] = bytes.map((b) => JSON.parse(b));
assert.equal(rings.source.inputHash, hash(bytes[0]));
assert.equal(rings.source.poseHash, hash(bytes[1]));
assert.equal(rings.source.nativeHash, hash(bytes[3]));
for (const c of [before, after]) {
  assert(c.complete && !c.faults.length);
  assert.equal(c.source.inputHash, hash(bytes[0]));
}
const thresholds = [0.4, 0.48, 0.56],
  rows = [];
for (const ring of rings.rows.filter((r) => r.accepted && r.symbol === 'N')) {
  const e = inputs.entries.find((e) => e.id === ring.id),
    pose = poses.rows.find((p) => p.id === ring.id);
  assert(pose.accepted);
  assert.equal(hash(JSON.stringify(pose.transform)), ring.poseHash);
  const a = before.rows.find((r) => r.id === e.id),
    b = after.rows.find((r) => r.id === e.id);
  assert.equal(a.sha256, ring.nativeHash);
  assert.equal(a.inputHash, b.inputHash);
  assert.equal(a.referenceHash, b.referenceHash);
  const [ab, bb, rb] = await Promise.all([
    fs.readFile(path.join(beforeDirectory, a.file)),
    fs.readFile(path.join(afterDirectory, b.file)),
    fs.readFile(objectFile(e.reference)),
  ]);
  assert.equal(hash(ab), a.sha256);
  assert.equal(hash(bb), b.sha256);
  assert.equal(hash(rb), e.reference.sha256);
  const images = {
    before: normalize(PNG.sync.read(ab)),
    after: normalize(PNG.sync.read(bb)),
    scan: normalize(PNG.sync.read(rb), pose.transform),
  };
  const circle = ring.render.circle;
  let changedAnnulus = 0;
  for (let y = Math.ceil(circle.y - circle.radius); y <= circle.y + circle.radius; y++)
    for (let x = Math.ceil(circle.x - circle.radius); x <= circle.x + circle.radius; x++) {
      const radius = Math.hypot(x - circle.x, y - circle.y) / circle.radius;
      if (radius < 0.9 || radius > 1.1) continue;
      const at = (y * 488 + x) * 4;
      if ([0, 1, 2, 3].some((k) => images.before.data[at + k] !== images.after.data[at + k]))
        changedAnnulus++;
    }
  // Numeral serifs can reach the radial annulus, so raw changed-pixel counts
  // there are diagnostic, not a background mask. Measure the physical circle
  // independently and sample paper while excluding glyph ink.
  const afterCircle = outerManaCircle(images.after, {
    x: circle.x,
    y: circle.y,
    range: 2,
    radiusRange: [circle.radius - 0.5, circle.radius + 0.5],
  });
  assert.equal(afterCircle.status, 'measured');
  const geometryDelta = Math.max(
    ...['x', 'y', 'radius'].map((k) => Math.abs(afterCircle[k] - circle[k])),
  );
  assert(geometryDelta <= 0.125, 'Numeral changed measured circle geometry ' + e.name);
  const paper = (image) => {
    const samples = [];
    for (
      let y = Math.ceil(circle.y - circle.radius * 0.8);
      y <= circle.y + circle.radius * 0.8;
      y++
    )
      for (
        let x = Math.ceil(circle.x - circle.radius * 0.8);
        x <= circle.x + circle.radius * 0.8;
        x++
      ) {
        if (Math.hypot(x - circle.x, y - circle.y) > circle.radius * 0.8) continue;
        const at = (y * 488 + x) * 4;
        samples.push([0, 1, 2].map((k) => image.data[at + k]));
      }
    samples.sort((a, b) => Math.max(...b) - Math.max(...a));
    return [0, 1, 2].map((k) =>
      median(samples.slice(0, Math.ceil(samples.length * 0.2)).map((p) => p[k])),
    );
  };
  const beforePaper = paper(images.before),
    afterPaper = paper(images.after);
  const paperDelta = Math.max(...beforePaper.map((v, k) => Math.abs(v - afterPaper[k])));
  assert(paperDelta <= 1, 'Numeral changed disc paper pigment ' + e.name);
  const scores = Object.fromEntries(['before', 'after'].map((version) => [version, []]));
  for (const thresholdFraction of thresholds) {
    const masks = Object.fromEntries(
      Object.entries(images).map(([key, image]) => [
        key,
        manaGlyphMask(image, key === 'scan' ? ring.scan.circle : circle, false, {
          normalizeBounds: false,
          thresholdFraction,
        }),
      ]),
    );
    assert(
      Object.values(masks).every((m) => m.status === 'measured'),
      'Unmeasured native numeral ' + e.name,
    );
    for (const version of ['before', 'after'])
      scores[version].push(compareManaGlyph(masks.scan.ink, masks[version].ink).score * 100);
  }
  rows.push({
    id: e.id,
    name: e.name,
    cohort: ring.cohort,
    symbol: e.face.manaSymbols.at(-1),
    referenceHash: e.reference.sha256,
    poseHash: ring.poseHash,
    beforeNative: a.sha256,
    afterNative: b.sha256,
    before: median(scores.before),
    after: median(scores.after),
    changedAnnulus,
    geometryDelta,
    beforePaper,
    afterPaper,
    paperDelta,
  });
}
const mean = (rs) => rs.reduce((s, n) => s + n, 0) / rs.length;
const cohorts = Object.fromEntries(
  ['calibration', 'validation'].map((co) => {
    const rr = rows.filter((r) => r.cohort === co);
    assert(rr.length >= 3);
    return [
      co,
      {
        names: new Set(rr.map((r) => r.name)).size,
        before: mean(rr.map((r) => r.before)),
        after: mean(rr.map((r) => r.after)),
        worstRegression: Math.max(0, ...rr.map((r) => r.before - r.after)),
      },
    ];
  }),
);
await writeJson(out, {
  schema: 1,
  status: 'native-numeral-comparison-not-set-approval',
  source: {
    inputs: hash(bytes[0]),
    poses: hash(bytes[1]),
    rings: hash(bytes[2]),
    before: hash(bytes[3]),
    after: hash(bytes[4]),
    tool: hash(await fs.readFile(new URL(import.meta.url))),
  },
  scope:
    'Real native numeral pixels in unchanged independently measured discs, at three ink thresholds. Independent circle geometry stays within 0.125px and brightest inner paper channels within one byte. Raw annular changed pixels remain diagnostic because numeral serifs can enter that annulus. Frozen scan transforms and actual physical credits are unchanged. Candidates were selected on calibration names; validation names remain explicit.',
  cohorts,
  rows,
});
console.log(JSON.stringify(cohorts));
