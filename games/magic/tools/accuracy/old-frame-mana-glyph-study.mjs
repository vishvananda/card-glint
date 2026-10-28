// Color-independent glyph placement in independently measured physical discs.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { manaGlyphMask, compareManaGlyph, GLYPH_SIZE } from './mana-glyph-metrics.mjs';
import { median } from './hsb-color.mjs';
const [inputFile, poseFile, nativeDirectory, ringFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS POSES NATIVE_DIRECTORY RING_MEASUREMENTS NEW_OUTPUT');
const files = [inputFile, poseFile, path.join(nativeDirectory, 'capture.json'), ringFile],
  raw = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, poses, capture, rings] = raw.map((b) => JSON.parse(b));
assert.equal(rings.status, 'sampled-mana-perimeter-and-pigment-not-adopted');
assert.equal(rings.source.inputHash, hash(raw[0]));
assert.equal(rings.source.poseHash, hash(raw[1]));
assert.equal(rings.source.nativeHash, hash(raw[2]));
const dependencies = async () =>
  Object.fromEntries(
    await Promise.all(
      [
        'mana-glyph-metrics.mjs',
        'edges.mjs',
        'metrics.mjs',
        'hsb-color.mjs',
        'pixels-pure.mjs',
        'scan-transform.mjs',
      ].map(async (f) => [f, hash(await fs.readFile(new URL(f, import.meta.url)))]),
    ),
  );
const graph = await dependencies(),
  toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const candidates = [{ id: 'current', scale: 1, dx: 0, dy: 0 }];
for (const scale of [0.9, 0.94, 0.98, 1, 1.02, 1.06, 1.1])
  for (const dx of [-0.5, 0, 0.5])
    for (const dy of [-0.5, 0, 0.5])
      if (scale !== 1 || dx || dy)
        candidates.push({ id: [scale, dx, dy].join('/'), scale, dx, dy });
const thresholds = [0.4, 0.48, 0.56],
  n = GLYPH_SIZE;
function transformed(ink, c, radius) {
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
const rows = [];
for (const r of rings.rows.filter((r) => r.accepted && /^[WUBRG]$/.test(r.symbol))) {
  const e = inputs.entries.find((e) => e.id === r.id),
    p = poses.rows.find((p) => p.id === r.id),
    native = capture.rows.find((n) => n.id === r.id);
  assert(p.accepted);
  assert.equal(hash(JSON.stringify(p.transform)), r.poseHash);
  assert.equal(native.sha256, r.nativeHash);
  assert.equal(e.reference.sha256, r.referenceHash);
  const sb = await fs.readFile(objectFile(e.reference)),
    nb = await fs.readFile(path.join(nativeDirectory, native.file));
  assert.equal(hash(sb), r.referenceHash);
  assert.equal(hash(nb), r.nativeHash);
  const images = {
    scan: normalize(PNG.sync.read(sb), p.transform),
    render: normalize(PNG.sync.read(nb)),
  };
  const masks = thresholds.map((thresholdFraction) =>
    Object.fromEntries(
      Object.entries(images).map(([k, image]) => [
        k,
        manaGlyphMask(image, r[k === 'scan' ? 'scan' : 'render'].circle, false, {
          normalizeBounds: false,
          thresholdFraction,
        }),
      ]),
    ),
  );
  const valid = masks.every((m) => Object.values(m).every((q) => q.status === 'measured'));
  const scores = valid
    ? candidates.map(
        (c) =>
          median(
            masks.map(
              (m) =>
                compareManaGlyph(m.scan.ink, transformed(m.render.ink, c, r.render.circle.radius))
                  .score,
            ),
          ) * 100,
      )
    : [];
  rows.push({
    id: r.id,
    name: r.name,
    symbol: r.symbol,
    cohort: r.cohort,
    nativeHash: r.nativeHash,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    accepted: valid,
    masks: masks.map((m) =>
      Object.fromEntries(
        Object.entries(m).map(([k, v]) => [
          k,
          {
            status: v.status,
            maskHash: v.ink ? hash(v.ink) : null,
            discRatio: v.discRatio,
            contrast: v.contrast,
          },
        ]),
      ),
    ),
    scores,
  });
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length,
  groups = {};
for (const symbol of ['W', 'U', 'B', 'R', 'G']) {
  const rs = rows.filter((r) => r.accepted && r.symbol === symbol),
    cal = rs.filter((r) => r.cohort === 'calibration');
  assert(cal.length >= 3);
  const ranking = candidates
    .map((c, i) => ({
      ...c,
      index: i,
      objective:
        mean(cal.map((r) => r.scores[i])) -
        0.25 * Math.max(0, ...cal.map((r) => r.scores[0] - r.scores[i])),
    }))
    .sort((a, b) => b.objective - a.objective || a.index - b.index);
  const selected = ranking[0],
    i = selected.index;
  groups[symbol] = {
    selected,
    ranking: ranking.slice(0, 8),
    cohorts: Object.fromEntries(
      ['calibration', 'validation'].map((cohort) => {
        const rr = rs.filter((r) => r.cohort === cohort);
        return [
          cohort,
          {
            count: rr.length,
            before: mean(rr.map((r) => r.scores[0])),
            after: mean(rr.map((r) => r.scores[i])),
            worstRegression: Math.max(0, ...rr.map((r) => r.scores[0] - r.scores[i])),
          },
        ];
      }),
    ),
  };
}
assert.deepEqual(graph, await dependencies());
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  raw.map(hash),
);
await writeJson(out, {
  schema: 1,
  status: 'glyph-mask-proposals-need-native-validation',
  set: inputs.set,
  scope:
    'One shared relative transform per color, selected on calibration names using filled-mask and edge overlap minus a worst-regression penalty. Three relative ink thresholds preserve size and position within independently measured discs. No per-card render adjustment or scan transformation. Binary resizing is a proposal only; native replay is mandatory. Numerals are not fitted here.',
  sources: {
    input: hash(raw[0]),
    poses: hash(raw[1]),
    capture: hash(raw[2]),
    rings: hash(raw[3]),
    toolHash,
    dependencies: graph,
  },
  thresholds,
  candidates,
  groups,
  rows,
});
console.log(JSON.stringify(groups));
