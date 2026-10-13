import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import {
  fixtureRoot,
  outputRoot,
  root,
  objectFile,
  readJson,
  writeJson,
  hash,
  sourceHash,
} from './common.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { median } from './metrics.mjs';
import { oldSymbolRegions } from './old-symbol-regions.mjs';
const phase = process.argv[2] ?? 'after';
assert.ok(['candidate', 'after'].includes(phase));
const base = `${outputRoot}/exo-symbol`,
  before = await readJson(`${base}/before/capture.json`),
  after = await readJson(`${base}/${phase}/capture.json`),
  material = await readJson(`${base}/material/capture.json`),
  controlReview = await readJson(`${outputRoot}/old-symbol-material/review/capture.json`),
  registration = await readJson(`${fixtureRoot}/old-symbol-material-registration.json`),
  candidate = await readJson(`${fixtureRoot}/exo-symbol-candidate.json`),
  plan = await readJson(`${fixtureRoot}/exo-symbol-plan.json`),
  rows = [];
assert.equal(before.rendererHash, plan.baselineRendererHash);
assert.equal(after.rendererHash, await sourceHash(`${root}/games/magic/src`));
assert.equal(after.planHash, before.planHash);
assert.equal(material.planHash, before.planHash);
assert.equal(after.rows.length, phase === 'after' ? before.rows.length : 12);
const server = await createServer({ configFile: false, root, server: { middlewareMode: true } });
try {
  const { retroSymbolGeometry } = await server.ssrLoadModule(
      '/games/magic/src/presentation/retro-symbol-geometry.ts',
    ),
    g = retroSymbolGeometry({ setCode: 'exo' });
  for (const key of ['right', 'centerY', 'width', 'height'])
    assert.equal(g[key], candidate.selected[key]);
  assert.deepEqual(g.crop, candidate.crop);
} finally {
  await server.close();
}
for (const a of after.rows) {
  const interveningControl = a.cohort === 'control' && ['arn', 'leg'].includes(a.set),
    b = interveningControl
      ? controlReview.rows.find((r) => r.id === a.id)
      : before.rows.find((r) => r.id === a.id),
    beforeDirectory = interveningControl
      ? `${outputRoot}/old-symbol-material/review`
      : `${base}/before`,
    m = material.rows.find((r) => r.id === a.id),
    rect = oldSymbolRegions[a.set] ?? [350, 367, 104, 47],
    transform = registration.groups[a.set]?.transform ?? {},
    ref = await cachedGrayRegion(
      objectFile({ sha256: a.referenceHash }),
      a.referenceHash,
      rect,
      transform,
    ),
    raw = await cachedGrayRegion(objectFile({ sha256: a.referenceHash }), a.referenceHash, rect),
    scores = {};
  assert.deepEqual(a.face, b.face);
  if (m) assert.deepEqual(a.face, m.face);
  for (const tier of ['inspect', 'table']) {
    const images = {},
      metrics = {};
    for (const [stage, row, directory] of [
      ['before', b, beforeDirectory],
      ['material', m, `${base}/material`],
      ['after', a, `${base}/${phase}`],
    ]) {
      if (!row) continue;
      const asset = row.images[tier],
        file = `${directory}/${asset.file}`,
        bytes = await readFile(file);
      assert.equal(hash(bytes), asset.sha256);
      images[stage] = PNG.sync.read(bytes);
      const crop = await cachedGrayRegion(file, asset.sha256, rect);
      metrics[stage] = {
        raw: compareLettering(raw.gray, crop.gray, rect[2], rect[3]),
        registered: compareLettering(ref.gray, crop.gray, rect[2], rect[3]),
      };
    }
    let changed = 0,
      outside = 0,
      typeChanged = 0;
    const old = images.before,
      current = images.after;
    assert.equal(old.width, current.width);
    assert.equal(old.height, current.height);
    for (let i = 0; i < old.data.length; i += 4) {
      if (old.data.subarray(i, i + 4).equals(current.data.subarray(i, i + 4))) continue;
      changed++;
      const x = (((i / 4) % old.width) * 488) / old.width,
        y = (Math.floor(i / 4 / old.width) * 680) / old.height;
      if (x < 350 || x >= 454 || y < 367 || y >= 414) {
        const [tx, ty, tw, th] = a.clearance.typeRegion;
        if (
          a.cohort !== 'control' &&
          a.clearance.needsCompression &&
          x >= tx &&
          x < tx + tw &&
          y >= ty &&
          y < ty + th
        )
          typeChanged++;
        else outside++;
      }
    }
    assert.equal(outside, 0, `${a.name} ${tier}: pixels outside symbol/type changed`);
    if (a.cohort === 'control') assert.equal(changed, 0, `${a.name} ${tier}: control changed`);
    else assert.ok(changed > 0, `${a.name}: missing Exodus treatment`);
    scores[tier] = { changed, typeChanged, outside, ...metrics };
  }
  const review = a.cohort === 'control' ? [] : ['internal-frame-registration-provisional'];
  if (a.clearance.needsCompression)
    review.push('oracle-type-compressed-for-symbol-clearance', 'type-change-overlaps-score-region');
  for (const tier of ['inspect', 'table']) {
    if (scores[tier].after.registered.edgeF1 < scores[tier].before.registered.edgeF1 - 0.02)
      review.push(`${tier}:edge-regression`);
    if (
      scores[tier].after.registered.censusSimilarity <
      scores[tier].before.registered.censusSimilarity - 0.02
    )
      review.push(`${tier}:census-regression`);
  }
  rows.push({
    id: a.id,
    name: a.name,
    set: a.set,
    number: a.number,
    rarity: a.face.rarity,
    cohort: a.cohort,
    referenceHash: a.referenceHash,
    interveningControl,
    clearance: a.clearance,
    scores,
    review,
  });
  console.log('audited', a.set, a.name);
}
function summarize(group) {
  const score = (r, tier, stage, registration, metric) =>
    r.scores[tier][stage][registration][metric];
  return {
    cards: group.length,
    typeCompression: group.filter((r) => r.clearance.needsCompression).length,
    tiers: Object.fromEntries(
      ['inspect', 'table'].map((tier) => [
        tier,
        {
          beforeEdgeF1: median(group.map((r) => score(r, tier, 'before', 'registered', 'edgeF1'))),
          afterEdgeF1: median(group.map((r) => score(r, tier, 'after', 'registered', 'edgeF1'))),
          rawBeforeEdgeF1: median(group.map((r) => score(r, tier, 'before', 'raw', 'edgeF1'))),
          rawAfterEdgeF1: median(group.map((r) => score(r, tier, 'after', 'raw', 'edgeF1'))),
          beforeCensus: median(
            group.map((r) => score(r, tier, 'before', 'registered', 'censusSimilarity')),
          ),
          afterCensus: median(
            group.map((r) => score(r, tier, 'after', 'registered', 'censusSimilarity')),
          ),
          improved: group.filter(
            (r) =>
              score(r, tier, 'after', 'registered', 'edgeF1') >
              score(r, tier, 'before', 'registered', 'edgeF1') + 0.02,
          ).length,
          regressed: group
            .filter(
              (r) =>
                score(r, tier, 'after', 'registered', 'edgeF1') <
                score(r, tier, 'before', 'registered', 'edgeF1') - 0.02,
            )
            .map((r) => r.id),
          unchangedTypeImproved: group.filter(
            (r) =>
              !r.clearance.needsCompression &&
              score(r, tier, 'after', 'registered', 'edgeF1') >
                score(r, tier, 'before', 'registered', 'edgeF1') + 0.02,
          ).length,
        },
      ]),
    ),
  };
}
const ordinary = rows.filter((r) => r.cohort !== 'control'),
  summary = {
    all: summarize(ordinary),
    calibration: summarize(ordinary.filter((r) => r.cohort === 'calibration')),
    validation: summarize(ordinary.filter((r) => r.cohort === 'validation')),
    rarities: Object.fromEntries(
      ['common', 'uncommon', 'rare'].map((rarity) => [
        rarity,
        summarize(ordinary.filter((r) => r.rarity === rarity)),
      ]),
    ),
    controls: rows.filter((r) => r.cohort === 'control').length,
  };
await writeJson(`${fixtureRoot}/exo-symbol-${phase}-measurement.json`, {
  schemaVersion: 1,
  phase,
  scope:
    'Frozen Exodus symbol study. Same full-set inputs, no per-card geometry or transform. Separate v68 material captures exist for calibration/controls only. Original v66 baseline predates the independently committed ARN/LEG corrections: those two controls compare against v67 captures; all other baselines remain v66. CPU cached-PNG shape metrics at both tiers, raw and frozen shared internal-frame fit. This fit is provisional pending frame geometry review. Full-card bytes protect non-symbol pixels; font-measured Oracle type compression is allowed only inside the type region and explicitly flagged because it can affect the symbol score window. No original-text layout certification or set-wide HSB claim.',
  baselineRendererHash: before.rendererHash,
  interveningControlRendererHash: controlReview.rendererHash,
  materialRendererHash: material.rendererHash,
  rendererHash: after.rendererHash,
  planHash: after.planHash,
  methodHash: hash(await readFile(new URL(import.meta.url))),
  candidateHash: hash(JSON.stringify(candidate)),
  registrationHash: hash(JSON.stringify(registration)),
  summary,
  rows,
});
console.log(JSON.stringify(summary, null, 2));
