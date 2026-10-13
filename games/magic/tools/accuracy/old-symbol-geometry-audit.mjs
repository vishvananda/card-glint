import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fixtureRoot, outputRoot, objectFile, readJson, writeJson, hash } from './common.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { median } from './metrics.mjs';
import { oldSymbolRegions } from './old-symbol-regions.mjs';
const base = `${outputRoot}/old-symbol-material`,
  before = await readJson(`${base}/before/capture.json`),
  material = await readJson(`${base}/after/capture.json`),
  after = await readJson(`${base}/geometry/capture.json`),
  registration = await readJson(`${fixtureRoot}/old-symbol-material-registration.json`),
  clearance = await readJson(`${fixtureRoot}/old-symbol-type-clearance.json`),
  rows = [];
assert.equal(clearance.rendererHash, after.rendererHash);
assert.equal(before.planHash, after.planHash);
assert.equal(material.planHash, after.planHash);
for (const a of after.rows) {
  const b = before.rows.find((r) => r.id === a.id),
    m = material.rows.find((r) => r.id === a.id),
    geometry = ['arn', 'leg', 'all', 'wth'].includes(a.set) && a.cohort !== 'control';
  assert.deepEqual(a.face, b.face);
  assert.deepEqual(a.face, m.face);
  const rect = oldSymbolRegions[a.set] ?? [350, 367, 104, 47],
    transform = registration.groups[a.set]?.transform ?? {},
    ref = await cachedGrayRegion(
      objectFile({ sha256: a.referenceHash }),
      a.referenceHash,
      rect,
      transform,
    ),
    raw = await cachedGrayRegion(objectFile({ sha256: a.referenceHash }), a.referenceHash, rect),
    scores = {};
  for (const tier of ['inspect', 'table']) {
    const images = {},
      metrics = {};
    for (const [stage, row] of [
      ['before', b],
      ['after', m],
      ['geometry', a],
    ]) {
      const asset = row.images[tier],
        file = `${base}/${stage}/${asset.file}`,
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
      geometryChanged = 0,
      outside = 0,
      typeChanged = 0;
    const type = clearance.rows.find((r) => r.id === a.id);
    const old = images.before,
      mat = images.after,
      current = images.geometry;
    for (let i = 0; i < old.data.length; i += 4) {
      if (!mat.data.subarray(i, i + 4).equals(current.data.subarray(i, i + 4))) geometryChanged++;
      if (old.data.subarray(i, i + 4).equals(current.data.subarray(i, i + 4))) continue;
      changed++;
      const x = (((i / 4) % old.width) * 488) / old.width,
        y = (Math.floor(i / 4 / old.width) * 680) / old.height;
      if (x < 350 || x >= 454 || y < 367 || y >= 414) {
        const [tx, ty, tw, th] = type.typeRegion;
        if (geometry && type.needsCompression && x >= tx && x < tx + tw && y >= ty && y < ty + th)
          typeChanged++;
        else outside++;
      }
    }
    assert.equal(outside, 0, `${a.name}: non-symbol pixels changed`);
    if (!geometry) assert.equal(geometryChanged, 0, `${a.name}: geometry control changed`);
    if (a.cohort === 'control') assert.equal(changed, 0, `${a.name}: source control changed`);
    scores[tier] = { changed, geometryChanged, typeChanged, outside, ...metrics };
  }
  const review = [];
  if (clearance.rows.find((r) => r.id === a.id)?.needsCompression)
    review.push('oracle-type-compressed-for-symbol-clearance');
  if (geometry && !registration.groups[a.set].accepted)
    review.push('frame-registration-unvalidated');
  if (a.set === 'exo')
    review.push('outer-rim-and-rarity-material-pending', 'geometry-search-hit-boundary');
  if (a.set === 'chr') review.push('chronicles-shared-geometry-pending');
  for (const tier of ['inspect', 'table']) {
    const s = scores[tier];
    if (s.geometry.registered.edgeF1 < s.before.registered.edgeF1 - 0.02)
      review.push(`${tier}:edge-regression`);
    if (s.geometry.registered.censusSimilarity < s.before.registered.censusSimilarity - 0.02)
      review.push(`${tier}:census-regression`);
  }
  rows.push({
    id: a.id,
    set: a.set,
    name: a.name,
    cohort: a.cohort,
    geometry,
    referenceHash: a.referenceHash,
    scores,
    review,
  });
}
const summary = {};
for (const set of ['arn', 'leg', 'all', 'wth', 'exo', 'chr', 'atq', 'drk'])
  summary[set] = Object.fromEntries(
    ['calibration', 'held-out', 'transfer', 'control'].flatMap((cohort) => {
      const g = rows.filter((r) => r.set === set && r.cohort === cohort);
      if (!g.length) return [];
      return [
        [
          cohort,
          {
            cards: g.length,
            inspect: Object.fromEntries(
              ['before', 'after', 'geometry'].map((stage) => [
                stage,
                median(g.map((r) => r.scores.inspect[stage].registered.edgeF1)),
              ]),
            ),
            table: Object.fromEntries(
              ['before', 'after', 'geometry'].map((stage) => [
                stage,
                median(g.map((r) => r.scores.table[stage].registered.edgeF1)),
              ]),
            ),
            inspectGains: g.filter(
              (r) =>
                r.scores.inspect.geometry.registered.edgeF1 >
                r.scores.inspect.before.registered.edgeF1 + 0.02,
            ).length,
            regressions: g
              .filter((r) => r.review.some((s) => s.includes('regression')))
              .map((r) => r.id),
          },
        ],
      ];
    }),
  );
await writeJson(`${fixtureRoot}/old-symbol-geometry-measurement.json`, {
  schemaVersion: 1,
  scope:
    'Sixty production captures at both tiers. Original -> white interiors -> four shared geometry profiles. Shape metrics use fixed symbol windows and independently frozen frame-only set transforms; raw scores retained. ARN/WTH registration failures remain flagged. ATQ, DRK and explicit custom symbols are controls; EXO/Chronicles keep existing geometry. Cached PNG comparison without Chromium. Source wording unverified; All non-symbol pixels stay identical except font-measured long type lines that require narrower compression to clear the wider symbol. Those changes are separately counted and flagged; everything outside that type-line envelope remains protected.',
  baselineRendererHash: before.rendererHash,
  materialRendererHash: material.rendererHash,
  rendererHash: after.rendererHash,
  planHash: after.planHash,
  clearanceHash: hash(JSON.stringify(clearance)),
  registrationHash: hash(JSON.stringify(registration)),
  methodHash: hash(await readFile(new URL(import.meta.url))),
  regions: oldSymbolRegions,
  summary,
  rows,
});
console.log(summary);
