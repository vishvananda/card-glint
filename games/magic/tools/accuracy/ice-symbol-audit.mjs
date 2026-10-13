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
const base = `${outputRoot}/ice-symbol-oracle`,
  plan = await readJson(`${fixtureRoot}/ice-symbol-oracle-plan.json`),
  adoption = await readJson(`${fixtureRoot}/ice-symbol-adoption-plan.json`),
  baseline = await readJson(`${fixtureRoot}/ice-symbol-oracle-baseline.json`),
  before = await readJson(`${base}/before/capture.json`),
  controls = await readJson(`${base}/controls/capture.json`),
  after = await readJson(`${base}/${stage}/capture.json`),
  rect = [404, 376, 44, 35],
  rows = [];
assert.equal(hash(JSON.stringify(baseline)), adoption.baselineHash);
assert.equal(hash(JSON.stringify(before)), baseline.captureHash);
assert.equal(hash(JSON.stringify(controls)), baseline.controlCaptureHash);
assert.equal(after.planHash, hash(JSON.stringify(plan)));
assert.equal(after.rendererHash, await sourceHash(`${root}/games/magic/src`));
assert.equal(after.rows.length, stage === 'candidate' ? 17 : 389);
assert.deepEqual(
  after.rows.map((r) => r.id).sort(),
  plan.cards
    .filter((r) => stage === 'after' || ['calibration', 'control'].includes(r.cohort))
    .map((r) => r.id)
    .sort(),
);
const server = await createServer({ configFile: false, root, server: { middlewareMode: true } });
try {
  const { retroSymbolGeometry } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-symbol-geometry.ts',
  );
  assert.deepEqual(retroSymbolGeometry({ setCode: 'ice' }), adoption.geometry);
} finally {
  await server.close();
}
for (const a of after.rows) {
  const control = a.cohort === 'control',
    b = (control ? controls : before).rows.find((r) => r.id === a.id),
    beforeStage = control ? 'controls' : 'before',
    ref = await cachedGrayRegion(objectFile({ sha256: a.referenceHash }), a.referenceHash, rect),
    scores = {};
  assert.equal(a.failure, undefined);
  assert.deepEqual(a.face, b.face);
  assert.deepEqual(a.clearance, b.clearance);
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
      outside = 0;
    const [sx, sy, sw, sh] = adoption.changeEnvelope;
    for (let p = 0; p < old.data.length; p += 4) {
      if (old.data.subarray(p, p + 4).equals(current.data.subarray(p, p + 4))) continue;
      changed++;
      const x = (((p / 4) % old.width) * 488) / old.width,
        y = (Math.floor(p / 4 / old.width) * 680) / old.height;
      if (x + 488 / old.width <= sx || x >= sx + sw || y + 680 / old.height <= sy || y >= sy + sh)
        outside++;
    }
    assert.equal(outside, 0, `${a.name} ${tier}: outside symbol changed`);
    if (control) assert.equal(changed, 0, `${a.name} ${tier}: control changed`);
    else assert.ok(changed > 0, `${a.name}: symbol unchanged`);
    scores[tier] = { changed, outside, ...metrics };
  }
  rows.push({
    id: a.id,
    name: a.name,
    number: a.number,
    cohort: a.cohort,
    set: a.set,
    referenceHash: a.referenceHash,
    scores,
    review: [
      'scan-registration-unverified',
      ...(adoption.uncertainIds.includes(a.id) ? ['calibration-bounds-uncertain'] : []),
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
    controls: 6,
    failures: 0,
  };
await writeJson(`${fixtureRoot}/ice-symbol-${stage}-measurement.json`, {
  schemaVersion: 1,
  scope:
    'Production Ice Age symbol correction against explicit Oracle/original-symbol inputs. Fine existing vector, derived existing white plate, native-measured shared geometry; no fitted scan transform. Same faces, type clearance and full-card pixels outside the symbol; six controls compare to v73 before Ice Age changes to account for independently corrected Exodus. Retain all ordinary printings and regressions. Metrics are raw symbol-region grayscale edge/Census, not whole-card fidelity or certified alignment.',
  baselineHash: hash(JSON.stringify(baseline)),
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
