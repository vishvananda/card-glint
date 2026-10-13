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
const phase = process.argv[2] ?? 'rim-outer';
assert.ok(
  [
    'rim-candidate',
    'rim',
    'rim-outer-candidate',
    'rim-outer',
    'size-candidate',
    'size',
    'measured-candidate',
    'measured',
  ].includes(phase),
);
const measured = phase.startsWith('measured'),
  resize = measured || phase.startsWith('size'),
  outer = phase.startsWith('rim-outer'),
  sizePlan = resize
    ? await readJson(`${fixtureRoot}/exo-symbol-${measured ? 'measured' : 'size'}-plan.json`)
    : null,
  beforeStage = resize ? 'rim-outer' : outer ? 'rim' : 'after',
  base = `${outputRoot}/exo-symbol`,
  before = await readJson(`${base}/${beforeStage}/capture.json`),
  after = await readJson(`${base}/${phase}/capture.json`),
  baseline = await readJson(`${fixtureRoot}/exo-symbol-${beforeStage}-measurement.json`),
  registration = await readJson(`${fixtureRoot}/old-symbol-material-registration.json`),
  candidate = await readJson(`${fixtureRoot}/exo-symbol-candidate.json`),
  plan = await readJson(`${fixtureRoot}/exo-symbol-plan.json`),
  rows = [];
assert.equal(before.planHash, hash(JSON.stringify(plan)));
assert.equal(before.rendererHash, baseline.rendererHash);
if (resize) assert.equal(before.rendererHash, sizePlan.baselineRendererHash);
assert.equal(after.rendererHash, await sourceHash(`${root}/games/magic/src`));
assert.equal(after.planHash, before.planHash);
assert.equal(after.rows.length, phase.endsWith('-candidate') ? 12 : before.rows.length);
const server = await createServer({ configFile: false, root, server: { middlewareMode: true } });
try {
  const { retroSymbolGeometry } = await server.ssrLoadModule(
      '/games/magic/src/presentation/retro-symbol-geometry.ts',
    ),
    g = retroSymbolGeometry({ setCode: 'exo' });
  for (const key of ['right', 'centerY', 'width', 'height'])
    assert.equal(g[key], resize ? sizePlan.after[key] : candidate.selected[key]);
  assert.deepEqual(g.crop, candidate.crop);
} finally {
  await server.close();
}
for (const a of after.rows) {
  const b = before.rows.find((r) => r.id === a.id),
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
  const typeWidthChanged =
    a.clearance.afterMaximum !== b.clearance.afterMaximum &&
    a.clearance.measuredWidth > a.clearance.afterMaximum;
  if (resize && a.cohort !== 'control') {
    assert.deepEqual(
      {
        ...a.clearance,
        afterMaximum: b.clearance.afterMaximum,
        needsCompression: b.clearance.needsCompression,
      },
      b.clearance,
    );
    const widthDelta =
      sizePlan.after.right - sizePlan.after.width - sizePlan.before.right + sizePlan.before.width;
    assert.ok(Math.abs(a.clearance.afterMaximum - b.clearance.afterMaximum - widthDelta) < 1e-9);
  } else assert.deepEqual(a.clearance, b.clearance);
  for (const tier of ['inspect', 'table']) {
    const images = {},
      metrics = {};
    for (const [stage, row, directory] of [
      ['before', b, `${base}/${beforeStage}`],
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
      // Boundary texels may straddle the envelope at table resolution.
      const [sx, sy, sw, sh] = resize ? sizePlan.changeEnvelope : [371, 376, 64, 27];
      if (x + 488 / old.width <= sx || x >= sx + sw || y + 680 / old.height <= sy || y >= sy + sh) {
        const [tx, ty, tw, th] = a.clearance.typeRegion;
        if (
          resize &&
          typeWidthChanged &&
          a.cohort !== 'control' &&
          x + 488 / old.width > tx &&
          x < tx + tw &&
          y + 680 / old.height > ty &&
          y < ty + th
        )
          typeChanged++;
        else outside++;
      }
    }

    assert.equal(outside, 0, `${a.name} ${tier}: pixels outside rim changed`);
    if (a.cohort === 'control') assert.equal(changed, 0, `${a.name} ${tier}: control changed`);
    else assert.ok(changed > 0, `${a.name}: missing Exodus treatment`);
    scores[tier] = { changed, typeChanged, outside, ...metrics };
  }
  const review = a.cohort === 'control' ? [] : ['internal-frame-registration-provisional'];
  if (typeWidthChanged)
    review.push('oracle-type-clearance-reduced', 'type-change-overlaps-score-region');
  else if (a.clearance.needsCompression) review.push('previous-oracle-type-compression-unchanged');
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
    clearance: a.clearance,
    ...(resize ? { beforeClearance: b.clearance, typeWidthChanged } : {}),
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
    ...(resize ? { unchangedType: summarize(ordinary.filter((r) => !r.typeWidthChanged)) } : {}),
  };
await writeJson(`${fixtureRoot}/exo-symbol-${phase}-measurement.json`, {
  schemaVersion: 1,
  phase,
  ...(resize
    ? {
        sizePlanHash: hash(JSON.stringify(sizePlan)),
        geometry: { before: sizePlan.before, after: sizePlan.after },
      }
    : {}),
  rim: resize
    ? { before: { outset: 2, inset: 0 }, after: { outset: 2, inset: 0 } }
    : outer
      ? { before: { outset: 1.875, inset: 0.625 }, after: { outset: 2, inset: 0 } }
      : { before: { outset: 1.25, inset: 0 }, after: { outset: 1.875, inset: 0.625 } },
  scope: resize
    ? sizePlan.scope
    : outer
      ? 'User-directed Exodus rim revision: use a 2 px outer-only rim. Restore un-eroded colored ink and increase outer white radius to 2 px. Same v69 geometry, palettes, faces and type widths; no per-card fit. Compare against the v70 balanced rim. CPU shape metrics at both tiers with raw scans and the frozen provisional internal-frame fit. Full-card bytes protect the tight rim envelope (boundary texel footprints may intersect it), seven controls and capture identities. No original-text or whole-card accuracy certification.'
      : 'User-directed wider Exodus white rim, split equally inward/outward. Outer radius 1.25 to 1.875 px, inward erosion 0 to 0.625 px, preserving window contours through the existing filled backing. Same v69 geometry, palettes, faces and type widths; no per-card fit. CPU shape metrics at both tiers with raw scans and the frozen provisional internal-frame fit. Verify full-card bytes outside the tight rim envelope, seven controls, and both capture identities. No original-text or whole-card accuracy certification.',
  baselineRendererHash: before.rendererHash,
  rendererHash: after.rendererHash,
  planHash: after.planHash,
  methodHash: hash(await readFile(new URL(import.meta.url))),
  candidateHash: hash(JSON.stringify(candidate)),
  registrationHash: hash(JSON.stringify(registration)),
  summary,
  rows,
});
console.log(JSON.stringify(summary, null, 2));
