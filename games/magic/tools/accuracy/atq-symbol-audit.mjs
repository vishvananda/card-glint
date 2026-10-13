import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import {
  readJson,
  writeJson,
  hash,
  sourceHash,
  root,
  fixtureRoot,
  outputRoot,
  objectFile,
} from './common.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { median } from './metrics.mjs';
const stage = process.argv[2] ?? 'candidate';
assert.ok(['candidate', 'after'].includes(stage));
const base = `${outputRoot}/atq-symbol`,
  plan = await readJson(`${fixtureRoot}/atq-symbol-plan.json`),
  adoption = await readJson(`${fixtureRoot}/atq-symbol-adoption-plan.json`),
  before = await readJson(`${base}/before/capture.json`),
  after = await readJson(`${base}/${stage}/capture.json`),
  rect = [374, 375, 68, 32],
  rows = [];
assert.equal(hash(JSON.stringify(before)), adoption.baselineHash);
assert.equal(before.rendererHash, plan.baselineRendererHash);
assert.equal(before.planHash, hash(JSON.stringify(plan)));
assert.equal(after.planHash, hash(JSON.stringify(plan)));
assert.equal(after.rendererHash, await sourceHash(`${root}/games/magic/src`));
assert.equal(before.rows.length, plan.cards.length);
assert.deepEqual(
  after.rows.map((r) => r.id).sort(),
  plan.cards
    .filter((r) => stage === 'after' || ['calibration', 'control'].includes(r.cohort))
    .map((r) => r.id)
    .sort(),
);
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});
try {
  const { retroSymbolGeometry } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-symbol-geometry.ts',
  );
  assert.deepEqual(retroSymbolGeometry({ setCode: 'atq' }), adoption.geometry);
} finally {
  await server.close();
}
for (const a of after.rows) {
  const control = a.cohort === 'control',
    b = before.rows.find((r) => r.id === a.id),
    beforeStage = 'before',
    ref = await cachedGrayRegion(objectFile({ sha256: a.referenceHash }), a.referenceHash, rect),
    scores = {};
  assert.equal(a.failure, undefined);
  assert.deepEqual(a.face, b.face);
  assert.equal(a.inputHash, hash(JSON.stringify(a.face)));
  assert.equal(a.inputHash, plan.cards.find((r) => r.id === a.id).inputHash);
  assert.equal(a.referenceHash, b.referenceHash);
  assert.equal(a.clearance.typeLine, b.clearance.typeLine);
  assert.equal(a.clearance.measuredWidth, b.clearance.measuredWidth);
  assert.deepEqual(a.clearance.typeRegion, b.clearance.typeRegion);
  if (control) assert.deepEqual(a.clearance, b.clearance);
  for (const tier of ['inspect', 'table']) {
    const images = {},
      metrics = {};
    for (const [label, row, folder] of [
      ['before', b, beforeStage],
      ['after', a, stage],
    ]) {
      const asset = row.images[tier],
        file = `${base}/${folder}/${asset.file}`,
        bytes = await readFile(file);
      assert.equal(hash(bytes), asset.sha256);
      images[label] = PNG.sync.read(bytes, { checkCRC: true });
      const crop = await cachedGrayRegion(file, asset.sha256, rect);
      metrics[label] = compareLettering(ref.gray, crop.gray, rect[2], rect[3]);
    }
    const old = images.before,
      current = images.after;
    assert.equal(old.width, current.width);
    assert.equal(old.height, current.height);
    let changed = 0,
      outside = 0,
      typeChanged = 0;
    const [sx, sy, sw, sh] = adoption.changeEnvelope;
    for (let p = 0; p < old.data.length; p += 4) {
      if (old.data.subarray(p, p + 4).equals(current.data.subarray(p, p + 4))) continue;
      changed++;
      const x = (((p / 4) % old.width) * 488) / old.width,
        y = (Math.floor(p / 4 / old.width) * 680) / old.height;
      const intersects = ([rx, ry, rw, rh]) =>
        x + 488 / old.width > rx && x < rx + rw && y + 680 / old.height > ry && y < ry + rh;
      if (!intersects([sx, sy, sw, sh])) {
        if (!control && a.clearance.needsCompression && intersects(a.clearance.typeRegion))
          typeChanged++;
        else outside++;
      }
    }
    assert.equal(outside, 0, `${a.name} ${tier}: outside symbol changed`);
    if (control) assert.equal(changed, 0, `${a.name} ${tier}: control changed`);
    else assert.ok(changed > 0, `${a.name}: symbol unchanged`);
    scores[tier] = { changed, outside, typeChanged, ...metrics };
  }
  rows.push({
    id: a.id,
    name: a.name,
    number: a.number,
    cohort: a.cohort,
    set: a.set,
    referenceHash: a.referenceHash,
    clearance: a.clearance,
    scores,
    review: [
      'scan-registration-unverified',
      ...(adoption.uncertainIds.includes(a.id) ? ['calibration-bounds-uncertain'] : []),
      ...(a.clearance.needsCompression ? ['oracle-type-compressed-for-clearance'] : []),
      ...['inspect', 'table'].flatMap((t) => [
        ...(scores[t].after.edgeF1 < scores[t].before.edgeF1 - 0.02
          ? [`${t}:edge-regression`]
          : []),
        ...(scores[t].after.censusSimilarity < scores[t].before.censusSimilarity - 0.02
          ? [`${t}:census-regression`]
          : []),
      ]),
    ],
  });
  console.log('audited', a.name);
}
function summarize(rs) {
  return {
    cards: rs.length,
    tiers: Object.fromEntries(
      ['inspect', 'table'].map((t) => [
        t,
        {
          beforeEdgeF1: median(rs.map((r) => r.scores[t].before.edgeF1)),
          afterEdgeF1: median(rs.map((r) => r.scores[t].after.edgeF1)),
          beforeCensus: median(rs.map((r) => r.scores[t].before.censusSimilarity)),
          afterCensus: median(rs.map((r) => r.scores[t].after.censusSimilarity)),
          improved: rs.filter((r) => r.scores[t].after.edgeF1 > r.scores[t].before.edgeF1 + 0.02)
            .length,
          regressed: rs
            .filter((r) => r.scores[t].after.edgeF1 < r.scores[t].before.edgeF1 - 0.02)
            .map((r) => r.id),
        },
      ]),
    ),
  };
}
const ordinary = rows.filter((r) => r.cohort !== 'control'),
  summary = {
    all: summarize(ordinary),
    calibration: summarize(ordinary.filter((r) => r.cohort === 'calibration')),
    validation:
      stage === 'after' ? summarize(ordinary.filter((r) => r.cohort === 'validation')) : null,
    controls: rows.filter((r) => r.cohort === 'control').length,
    failures: 0,
  };
await writeJson(`${fixtureRoot}/atq-symbol-${stage}-measurement.json`, {
  schemaVersion: 1,
  scope:
    'Production Antiquities anvil correction with explicit Oracle/original-symbol inputs. Same pinned vector, one measured geometry, no fitted scan transform. Every ordinary printing and control retained. Pixels outside symbol plus necessary type-clearance compression must be identical; all eight controls unchanged. Raw grayscale edge/Census scores cover the symbol region, not whole-card accuracy or certified scan alignment.',
  baselineHash: hash(JSON.stringify(before)),
  adoptionHash: hash(JSON.stringify(adoption)),
  planHash: after.planHash,
  rendererHash: after.rendererHash,
  captureHash: hash(JSON.stringify(after)),
  methodHash: hash(await readFile(new URL(import.meta.url))),
  rect,
  summary,
  rows,
});
console.log(JSON.stringify(summary, null, 2));
