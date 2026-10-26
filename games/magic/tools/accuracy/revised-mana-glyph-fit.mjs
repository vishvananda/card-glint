// Relative colored-glyph proposals; disc geometry and scan poses stay frozen.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { manaGlyphMask, compareManaGlyph, GLYPH_SIZE } from './mana-glyph-metrics.mjs';
import { median } from './hsb-color.mjs';

const [inputFile, poseFile, nativeDirectory, ringFile, auditFile, outputFile] =
  process.argv.slice(2);
assert(
  outputFile,
  'Usage: revised-mana-glyph-fit.mjs INPUTS POSES NATIVE_DIRECTORY RINGS GLYPH_AUDIT NEW_OUTPUT',
);
const files = [
    inputFile,
    poseFile,
    path.join(nativeDirectory, 'capture.json'),
    ringFile,
    auditFile,
  ],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, poses, capture, ring, audit] = bytes.map((b) => JSON.parse(b)),
  rendererHash = await sourceHash(path.join(root, 'games/magic/src')),
  moduleNames = [
    'mana-glyph-metrics.mjs',
    'pixels-pure.mjs',
    'scan-transform.mjs',
    'edges.mjs',
    'metrics.mjs',
    'hsb-color.mjs',
  ],
  identities = async () =>
    Object.fromEntries(
      await Promise.all(
        moduleNames.map(async (f) => [f, hash(await fs.readFile(new URL(f, import.meta.url)))]),
      ),
    ),
  modules = await identities(),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  candidates = [{ id: 'current', scale: 1, dx: 0, dy: 0 }],
  rows = [],
  n = GLYPH_SIZE;
assert.equal(audit.status, 'glyph-shape-diagnostic-not-adopted');
assert.equal(audit.rendererHash, rendererHash);
assert.equal(ring.rendererHash, rendererHash);
assert.equal(capture.rendererHash, rendererHash);
assert.deepEqual(
  [audit.sources.inputs, audit.sources.poses, audit.sources.capture, audit.sources.rings],
  bytes.slice(0, 4).map(hash),
);
for (const scale of [0.96, 1, 1.02, 1.04, 1.06, 1.08, 1.1, 1.12, 1.14, 1.16, 1.18])
  for (const dx of [-0.5, 0, 0.5])
    for (const dy of [-0.5, 0, 0.5]) {
      if (scale === 1 && dx === 0 && dy === 0) continue;
      candidates.push({ id: [scale, dx, dy].join('/'), scale, dx, dy });
    }
function resized(ink, c, radius) {
  const out = new Uint8Array(n * n),
    units = (n - 4) / (2 * radius);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const sx = Math.round((x - n / 2 - c.dx * units) / c.scale + n / 2),
        sy = Math.round((y - n / 2 - c.dy * units) / c.scale + n / 2);
      if (sx >= 0 && sy >= 0 && sx < n && sy < n) out[y * n + x] = ink[sy * n + sx];
    }
  return out;
}
await fs.writeFile(outputFile, JSON.stringify({ status: 'running' }), { flag: 'wx' });
const start = performance.now();
for (const r of ring.rows) {
  const eligible = r.discs.filter((d) => d.accepted && /^[WUBRG]$/.test(d.symbol));
  if (!eligible.length) continue;
  const e = inputs.entries.find((e) => e.id === r.id),
    p = Object.values(poses.groups)
      .flatMap((g) => g.rows)
      .find((p) => p.id === r.id),
    native = capture.rows.find((x) => x.id === r.id),
    sb = await fs.readFile(objectFile(e.reference)),
    nb = await fs.readFile(path.join(nativeDirectory, native.modes.original.file));
  assert.equal(hash(sb), r.referenceHash);
  assert.equal(hash(nb), r.nativeHash);
  assert.equal(hash(JSON.stringify(p.transform)), r.poseHash);
  const images = {
    scan: normalize(PNG.sync.read(sb), p.transform),
    render: normalize(PNG.sync.read(nb)),
  };
  for (const d of eligible) {
    const parent = audit.rows.find((a) => a.id === r.id && a.index === d.index),
      masks = audit.thresholds.map((thresholdFraction) =>
        Object.fromEntries(
          Object.entries(images).map(([k, im]) => [
            k,
            manaGlyphMask(im, d.circles[k], false, { normalizeBounds: false, thresholdFraction }),
          ]),
        ),
      );
    assert(parent.accepted);
    for (let i = 0; i < masks.length; i++)
      for (const k of ['scan', 'render'])
        assert.equal(hash(masks[i][k].ink), parent.measurements[i][k].maskHash);
    const scores = candidates.map(
      (c) =>
        median(
          masks.map(
            (m) =>
              compareManaGlyph(m.scan.ink, resized(m.render.ink, c, d.circles.render.radius)).score,
          ),
        ) * 100,
    );
    assert(
      Math.abs(scores[0] - median(parent.measurements.map((m) => m.comparison.score)) * 100) <
        1e-10,
    );
    rows.push({
      id: r.id,
      name: r.name,
      cohort: r.cohort,
      material: r.material,
      symbol: d.symbol,
      index: d.index,
      referenceHash: r.referenceHash,
      nativeHash: r.nativeHash,
      poseHash: r.poseHash,
      scores,
    });
  }
  if (rows.length % 10 === 0) console.log('Glyph trials', rows.length);
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length,
  groups = {};
for (const symbol of ['W', 'U', 'B', 'R', 'G']) {
  const a = rows.filter((r) => r.symbol === symbol),
    cal = a.filter((r) => r.cohort === 'calibration'),
    val = a.filter((r) => r.cohort === 'validation');
  assert(cal.length >= 10 && val.length >= 5);
  const ranking = candidates
      .map((c, index) => ({
        ...c,
        index,
        objective:
          mean(cal.map((r) => r.scores[index])) -
          0.25 * Math.max(0, ...cal.map((r) => r.scores[0] - r.scores[index])),
      }))
      .sort((a, b) => b.objective - a.objective || a.index - b.index),
    best = ranking[0];
  groups[symbol] = {
    selected: best,
    ranking: ranking.slice(0, 8),
    cohorts: Object.fromEntries(
      [
        ['all', a],
        ['calibration', cal],
        ['validation', val],
      ].map(([k, rs]) => [
        k,
        {
          count: rs.length,
          before: mean(rs.map((r) => r.scores[0])),
          after: mean(rs.map((r) => r.scores[best.index])),
          gains: rs.filter((r) => r.scores[best.index] > r.scores[0] + 1e-10).length,
          losses: rs.filter((r) => r.scores[best.index] < r.scores[0] - 1e-10).length,
          worstRegression: Math.max(0, ...rs.map((r) => r.scores[0] - r.scores[best.index])),
        },
      ]),
    ),
  };
}
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
assert.deepEqual(await identities(), modules);
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  bytes.map(hash),
);
await writeJson(outputFile, {
  schema: 1,
  set: '3ed',
  status: 'glyph-mask-proposals-need-native-validation',
  scope:
    'Colored glyphs only in frozen measured-disc coordinates. Calibration rows choose one relative transform per color using mean filled-plus-edge objective minus a worst-regression penalty; reused development validation is reported separately. Three ink thresholds and exact baseline mask/score identity checks. Discs, pigment, numbers, frame poses and renderer defaults do not change. Binary-mask resizing approximates a real glyph rasterization: full native candidates and regional/whole-card regressions are required before adoption.',
  rendererHash,
  sources: {
    inputs: hash(bytes[0]),
    poses: hash(bytes[1]),
    capture: hash(bytes[2]),
    rings: hash(bytes[3]),
    audit: hash(bytes[4]),
    toolHash,
    modules,
  },
  candidates,
  groups,
  rows,
  elapsedSeconds: (performance.now() - start) / 1000,
});
console.log(
  'Saved glyph proposals',
  rows.length,
  JSON.stringify(Object.fromEntries(Object.entries(groups).map(([k, g]) => [k, g.selected]))),
);
