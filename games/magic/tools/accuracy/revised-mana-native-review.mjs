// Verify public glyph controls with actual full production native faces.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { manaGlyphMask, compareManaGlyph } from './mana-glyph-metrics.mjs';
import { median } from './hsb-color.mjs';
const [
  inputFile,
  poseFile,
  beforeDirectory,
  afterDirectory,
  ringFile,
  auditFile,
  fitFile,
  candidateInputFile,
  output,
] = process.argv.slice(2);
assert(
  output,
  'Usage: revised-mana-native-review.mjs INPUTS POSES BEFORE AFTER RINGS AUDIT FIT CANDIDATE_INPUTS NEW_OUTPUT',
);
const files = [
    inputFile,
    poseFile,
    path.join(beforeDirectory, 'capture.json'),
    path.join(afterDirectory, 'capture.json'),
    ringFile,
    auditFile,
    fitFile,
    candidateInputFile,
  ],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, poses, before, after, ring, audit, fit, candidateInputs] = bytes.map((b) =>
    JSON.parse(b),
  ),
  rows = [],
  comparisons = [];
assert.equal(after.rendererHash, before.rendererHash);
assert.equal(ring.rendererHash, before.rendererHash);
assert.equal(fit.rendererHash, before.rendererHash);
assert.equal(before.inputHash, hash(bytes[0]));
assert.equal(after.inputHash, hash(bytes[7]));
const proposal = Object.fromEntries(
  Object.entries(fit.groups).map(([color, g]) => [
    color,
    { scale: g.selected.scale, dx: g.selected.dx, dy: g.selected.dy },
  ]),
);
assert.deepEqual(candidateInputs.experiment.proposal, proposal);
assert.equal(candidateInputs.entries.length, ring.rows.length);
assert.deepEqual(
  candidateInputs.entries.map((e) => e.id).sort(),
  ring.rows.map((r) => r.id).sort(),
);

assert.equal(ring.sources.poses, hash(bytes[1]));
assert.equal(audit.sources.rings, hash(bytes[4]));
assert.equal(fit.sources.audit, hash(bytes[5]));
assert.equal(after.rows.length, ring.rows.length);
assert.deepEqual(after.faults, []);
const toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  modules = Object.fromEntries(
    await Promise.all(
      [
        'mana-glyph-metrics.mjs',
        'pixels-pure.mjs',
        'scan-transform.mjs',
        'edges.mjs',
        'metrics.mjs',
        'hsb-color.mjs',
      ].map(async (f) => [f, hash(await fs.readFile(new URL(f, import.meta.url)))]),
    ),
  );
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
const start = performance.now();
for (const r of ring.rows) {
  const b = before.rows.find((x) => x.id === r.id),
    a = after.rows.find((x) => x.id === r.id),
    e = inputs.entries.find((e) => e.id === r.id),
    p = Object.values(poses.groups)
      .flatMap((g) => g.rows)
      .find((p) => p.id === r.id);
  assert(p.accepted);
  const candidate = candidateInputs.entries.find((e) => e.id === r.id),
    expected = structuredClone(e.face);
  if (e.face.manaSymbols.some((s) => /^[WUBRG]$/.test(s)))
    expected.symbolAdjustment = { mana: { glyphs: proposal } };
  assert.deepEqual(
    candidate.face,
    expected,
    'Prototype recipe changed beyond the proposed glyph controls',
  );

  assert.equal(r.poseHash, hash(JSON.stringify(p.transform)));
  assert.equal(a.referenceHash, b.referenceHash);
  assert.equal(a.artHash, b.artHash);
  const bb = await fs.readFile(path.join(beforeDirectory, b.modes.original.file)),
    ab = await fs.readFile(path.join(afterDirectory, a.modes.original.file));
  assert.equal(hash(bb), r.nativeHash);
  assert.equal(hash(ab), a.modes.original.sha256);
  const bimage = PNG.sync.read(bb),
    aimage = PNG.sync.read(ab);
  assert.equal(aimage.width, bimage.width);
  assert.equal(aimage.height, bimage.height);
  assert.equal(aimage.width, 732);
  assert.equal(aimage.height, 1020);
  const count = e.face.manaSymbols.length,
    first = 435 - (count - 1) * 27,
    rect = [
      Math.floor((first - 13) * 1.5),
      Math.floor(31.5 * 1.5),
      Math.ceil((448 - first + 13) * 1.5),
      Math.ceil(26 * 1.5),
    ];
  let changed = 0,
    outside = 0,
    alpha = 0;
  const symbols = {};
  for (let i = 0; i < aimage.width * aimage.height; i++) {
    const at = i * 4;
    if (aimage.data[at + 3] !== bimage.data[at + 3]) alpha++;
    if ([0, 1, 2].every((c) => aimage.data[at + c] === bimage.data[at + c])) continue;
    changed++;
    const px = i % aimage.width,
      py = Math.floor(i / aimage.width);
    if (px < rect[0] || py < rect[1] || px >= rect[0] + rect[2] || py >= rect[1] + rect[3])
      outside++;
    for (let j = 0; j < count; j++) {
      const cx = first + j * 27,
        cy = 44.5,
        radius = Math.hypot((px + 0.5) / 1.5 - cx, (py + 0.5) / 1.5 - cy);
      if (radius > 12.7) continue;
      const key = e.face.manaSymbols[j],
        s = (symbols[key] ??= { changed: 0, rim: 0 });
      s.changed++;
      if (radius >= 10.7) s.rim++;
    }
  }
  rows.push({
    id: r.id,
    name: r.name,
    material: r.material,
    cohort: r.cohort,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    before: hash(bb),
    after: hash(ab),
    changed,
    outside,
    alpha,
    symbols,
    rect,
  });
  const sb = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(sb), r.referenceHash);
  const image = normalize(aimage),
    source = normalize(bimage),
    reference = normalize(PNG.sync.read(sb), p.transform);
  for (const d of r.discs.filter((d) => d.accepted)) {
    const parent = audit.rows.find((a) => a.id === r.id && a.index === d.index);
    assert(parent.accepted);
    const measures = audit.thresholds.map((thresholdFraction, index) => {
      const masks = [source, image].map((im) =>
          manaGlyphMask(im, d.circles.render, false, { normalizeBounds: false, thresholdFraction }),
        ),
        accepted = masks.every((m) => m.status === 'measured');
      assert.equal(hash(masks[0].ink), parent.measurements[index].render.maskHash);
      const scan = manaGlyphMask(reference, d.circles.scan, false, {
        normalizeBounds: false,
        thresholdFraction,
      });
      assert.equal(scan.status, 'measured');
      assert.equal(hash(scan.ink), parent.measurements[index].scan.maskHash);
      assert.deepEqual(
        compareManaGlyph(scan.ink, masks[0].ink),
        parent.measurements[index].comparison,
      );

      return {
        thresholdFraction,
        accepted,
        referenceMask: hash(scan.ink),
        comparison: accepted ? compareManaGlyph(scan.ink, masks[1].ink) : null,
        baselineMask: hash(masks[0].ink),
        candidateMask: masks[1].ink ? hash(masks[1].ink) : null,
        status: masks[1].status,
        source: accepted ? { bounds: masks[1].bounds, discRatio: masks[1].discRatio } : null,
      };
    });
    comparisons.push({
      id: r.id,
      name: r.name,
      cohort: r.cohort,
      material: r.material,
      index: d.index,
      symbol: d.symbol,
      accepted: measures.every((m) => m.accepted),
      before: median(parent.measurements.map((m) => m.comparison.score)) * 100,
      after: measures.every((m) => m.accepted)
        ? median(measures.map((m) => m.comparison.score)) * 100
        : null,
      measures,
    });
  }
  if (rows.length % 25 === 0) console.log('Native glyph review', rows.length);
}
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), before.rendererHash);
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  bytes.map(hash),
);
for (const [file, expected] of Object.entries(modules))
  assert.equal(hash(await fs.readFile(new URL(file, import.meta.url))), expected);
function summary(a) {
  const accepted = a.filter((r) => r.accepted);
  if (!accepted.length) return { count: a.length, accepted: 0 };
  const mean = (values) => values.reduce((a, b) => a + b, 0) / values.length;
  return {
    count: a.length,
    accepted: accepted.length,
    before: mean(accepted.map((r) => r.before)),
    after: mean(accepted.map((r) => r.after)),
    gains: accepted.filter((r) => r.after > r.before + 1e-10).length,
    losses: accepted.filter((r) => r.after < r.before - 1e-10).length,
    worstRegression: Math.max(0, ...accepted.map((r) => r.before - r.after)),
  };
}

await writeJson(output, {
  schema: 1,
  set: '3ed',
  status: 'native-glyph-prototype-reviewed',
  scope:
    'Actual production full native faces rendered through public relative glyph controls. Same renderer,reference/art and frozen scan poses. Full pixel differences,alpha,per-symbol rim changes,and exact baseline glyph masks. Actual three-threshold glyph objectives are recomputed against source scans,with exact baseline mask/score parity. This does not choose new renderer defaults or certify pigment,number shape,whole-card accuracy or the set.',
  rendererHash: before.rendererHash,
  sources: Object.fromEntries(
    ['inputs', 'poses', 'before', 'after', 'rings', 'audit', 'fit', 'candidateInputs'].map(
      (k, i) => [k, hash(bytes[i])],
    ),
  ),
  toolHash,
  modules,
  summary: {
    cards: rows.length,
    changed: rows.filter((r) => r.changed).length,
    unchanged: rows.filter((r) => !r.changed).length,
    outside: rows.reduce((s, r) => s + r.outside, 0),
    alpha: rows.reduce((s, r) => s + r.alpha, 0),
  },
  groups: Object.fromEntries(
    ['W', 'U', 'B', 'R', 'G', 'N'].flatMap((symbol) =>
      ['all', 'calibration', 'validation'].map((cohort) => [
        symbol + '/' + cohort,
        summary(
          comparisons.filter(
            (r) =>
              (cohort === 'all' || r.cohort === cohort) &&
              (symbol === 'N' ? !/^[WUBRG]$/.test(r.symbol) : r.symbol === symbol),
          ),
        ),
      ]),
    ),
  ),
  rows,
  comparisons,
  elapsedSeconds: (performance.now() - start) / 1000,
});
console.log('Saved native glyph isolation', rows.length);
