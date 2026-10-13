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
const [set, stage = 'candidate', adoptionName = 'adoption-plan'] = process.argv.slice(2);
assert.match(set ?? '', /^[a-z0-9]{2,6}$/);
assert.match(adoptionName, /^[a-z0-9-]+$/);
const full = /^after(?:-[a-z0-9]+)*$/.test(stage);
assert.ok(full || /^candidate(?:-[a-z0-9]+)*$/.test(stage));
const base = `${outputRoot}/${set}-symbol`,
  plan = await readJson(`${fixtureRoot}/${set}-symbol-plan.json`),
  adoption = await readJson(`${fixtureRoot}/${set}-symbol-${adoptionName}.json`),
  before = await readJson(`${base}/before/capture.json`),
  after = await readJson(`${base}/${stage}/capture.json`),
  rect = adoption.scoreRegion,
  rows = [];
assert.equal(hash(JSON.stringify(before)), adoption.baselineHash);
assert.equal(
  hash(JSON.stringify(await readJson(`${fixtureRoot}/${set}-symbol-bounds-before.json`))),
  adoption.boundsHash,
);
assert.equal(
  hash(JSON.stringify(await readJson(`${fixtureRoot}/${set}-symbol-measurement-profile.json`))),
  adoption.measurementProfileHash,
);
assert.equal(before.rendererHash, plan.baselineRendererHash);
assert.equal(before.planHash, hash(JSON.stringify(plan)));
assert.equal(after.planHash, hash(JSON.stringify(plan)));
assert.equal(after.rendererHash, await sourceHash(`${root}/games/magic/src`));
assert.equal(before.rows.length, plan.cards.length);
assert.deepEqual(
  after.rows.map((r) => r.id).sort(),
  plan.cards
    .filter((r) => full || ['calibration', 'control'].includes(r.cohort))
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
  assert.deepEqual(retroSymbolGeometry({ setCode: set }), adoption.geometry);
  for (const row of after.rows.filter((r) => r.cohort !== 'control' && r.face)) {
    const groups = Object.values(adoption.materialGroups ?? {}).filter((g) =>
      g.ids.includes(row.id),
    );
    assert.ok(groups.length <= 1, 'Material cohorts must be disjoint');
    assert.deepEqual(retroSymbolGeometry(row.face), groups[0]?.geometry ?? adoption.geometry);
  }
} finally {
  await server.close();
}
for (const a of after.rows) {
  const control = a.cohort === 'control',
    b = before.rows.find((r) => r.id === a.id),
    beforeStage = 'before',
    scores = {};
  if (a.failure || b.failure) {
    assert.equal(a.failure, b.failure, 'Changed failure coverage requires separate review');
    rows.push({
      id: a.id,
      name: a.name,
      number: a.number,
      cohort: a.cohort,
      set: a.set,
      failure: a.failure,
      referenceHash: a.referenceHash,
      scores: null,
      review: [a.failure],
    });
    continue;
  }
  const ref = await cachedGrayRegion(
    objectFile({ sha256: a.referenceHash }),
    a.referenceHash,
    rect,
  );
  assert.deepEqual(a.face, b.face);
  assert.equal(a.inputHash, hash(JSON.stringify(a.face)));
  assert.equal(a.inputHash, plan.cards.find((r) => r.id === a.id).inputHash);
  assert.equal(a.referenceHash, b.referenceHash);
  assert.equal(a.clearance.typeLine, b.clearance.typeLine);
  assert.equal(a.clearance.measuredWidth, b.clearance.measuredWidth);
  assert.deepEqual(a.clearance.typeRegion, b.clearance.typeRegion);
  if (control || !adoption.allowTypeCompression) assert.deepEqual(a.clearance, b.clearance);
  if (!control && adoption.scoreExcludesType)
    for (const row of [a, b]) {
      const typeRight =
        row.clearance.typeRegion[0] +
        2 +
        Math.min(row.clearance.measuredWidth, row.clearance.afterMaximum);
      // The source type region starts two pixels before the text origin.
      // Leave another two pixels for upright glyph overhang and its shadow.
      assert.ok(rect[0] >= typeRight + 2, `${a.name}: type ink enters the symbol score`);
    }
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
      // The full-set audit visits millions of unchanged pixels per printing.
      // Compare channels directly instead of allocating two Buffer views each.
      if (
        old.data[p] === current.data[p] &&
        old.data[p + 1] === current.data[p + 1] &&
        old.data[p + 2] === current.data[p + 2] &&
        old.data[p + 3] === current.data[p + 3]
      )
        continue;
      changed++;
      const x = (((p / 4) % old.width) * 488) / old.width,
        y = (Math.floor(p / 4 / old.width) * 680) / old.height;
      const intersects = ([rx, ry, rw, rh]) =>
        x + 488 / old.width > rx && x < rx + rw && y + 680 / old.height > ry && y < ry + rh;
      if (!intersects([sx, sy, sw, sh])) {
        if (
          !control &&
          adoption.allowTypeCompression &&
          (a.clearance.needsCompression || b.clearance.needsCompression) &&
          a.clearance.afterMaximum !== b.clearance.afterMaximum &&
          intersects(a.clearance.typeRegion)
        )
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
function summarize(input) {
  const rs = input.filter((r) => r.scores);
  return {
    cards: input.length,
    compared: rs.length,
    unavailable: input.filter((r) => !r.scores).map((r) => r.id),
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
    validation: full ? summarize(ordinary.filter((r) => r.cohort === 'validation')) : null,
    controls: rows.filter((r) => r.cohort === 'control').length,
    failures: rows.filter((r) => !r.scores).length,
  };
await writeJson(`${fixtureRoot}/${set}-symbol-${stage}-measurement.json`, {
  schemaVersion: 1,
  scope: adoption.scope,
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
