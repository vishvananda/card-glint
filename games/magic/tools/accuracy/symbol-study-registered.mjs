import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { readJson, writeJson, hash, root, fixtureRoot, outputRoot, objectFile } from './common.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { fittedSymbolBounds } from './symbol-bounds.mjs';
import { symbolRegionCoverage } from './symbol-region-coverage.mjs';
import {
  cachedReferenceSymbolBounds,
  REFERENCE_BOUNDS_METHOD_HASH,
} from './symbol-reference-cache.mjs';
import { median, quantile } from './metrics.mjs';

// Supplemental comparison only: one independently frozen frame transform for
// every admitted material, never a transform estimated from symbol or text ink.
// The raw structural audit remains mandatory and preserves complete coverage.
const [set, stage = 'candidate'] = process.argv.slice(2);
assert.match(set ?? '', /^[a-z0-9]{2,6}$/);
assert.ok(stage === 'after' || /^candidate(?:-[a-z0-9]+)*$/.test(stage));
const base = `${outputRoot}/${set}-symbol`,
  plan = await readJson(`${fixtureRoot}/${set}-symbol-registration-plan.json`),
  profile = await readJson(`${fixtureRoot}/old-frame-registration-${set}.json`),
  raw = await readJson(`${fixtureRoot}/${set}-symbol-${stage}-measurement.json`),
  bounds = await readJson(`${fixtureRoot}/${set}-symbol-bounds-${stage}.json`),
  before = await readJson(`${base}/before/capture.json`),
  after = await readJson(`${base}/${stage}/capture.json`),
  rows = [];
assert.equal(hash(JSON.stringify(profile)), plan.profileHash);
assert.ok(profile.accepted && profile.set === set && profile.transform);
assert.deepEqual(raw.rect, plan.scoreRegion);
assert.equal(hash(JSON.stringify(before)), raw.baselineHash);
assert.equal(hash(JSON.stringify(after)), raw.captureHash);
assert.equal(bounds.captureHash, raw.captureHash);
// CPU rescoring consumes immutable captures, including historical candidates.
// The original structural audit binds the renderer revision; the independent
// frame painter/source guards below must still match the registration profile.
assert.equal(after.rendererHash, raw.rendererHash);
assert.equal(after.planHash, before.planHash);
assert.equal(
  profile.provenance.rendererStockHash,
  hash(
    Buffer.concat(
      await Promise.all(
        ['retro-frame.ts', 'retro-paint.ts'].map((file) =>
          readFile(new URL(`../../src/presentation/${file}`, import.meta.url)),
        ),
      ),
    ),
  ),
);
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});
try {
  const { retroFamily, retroFrameAsset, retroFrameRect, retroBorder, retroBorderMask } =
    await server.ssrLoadModule('/games/magic/src/presentation/retro-frame.ts');
  for (const a of after.rows.filter((r) => r.cohort !== 'control')) {
    const b = before.rows.find((r) => r.id === a.id),
      rawRow = raw.rows.find((r) => r.id === a.id),
      face = a.face,
      guard =
        face &&
        profile.guards.sources.find(
          (g) =>
            face.setCode?.toLowerCase() === profile.set &&
            face.frameStyle === 'retro' &&
            (!face.layout || face.layout === 'normal') &&
            retroFamily(face) === profile.frameFamily &&
            retroBorder(face) === profile.border &&
            retroFrameAsset(face) === g.url &&
            retroBorderMask(face) === g.maskUrl &&
            JSON.stringify(retroFrameRect(face)) === JSON.stringify(g.rect) &&
            profile.scope.materials.includes(g.material),
        );
    assert.equal(a.referenceHash, b.referenceHash);
    assert.deepEqual(a.face, b.face);
    const partial = plan.partialReferenceRegions?.find((r) => r.id === a.id);
    if (partial) assert.equal(partial.referenceHash, a.referenceHash);
    const row = {
      id: a.id,
      name: a.name,
      cohort: a.cohort,
      referenceHash: a.referenceHash,
      material: guard?.material ?? null,
      previouslyObserved: plan.previouslyObservedReservedIds.includes(a.id),
      coverageWarning: partial?.reason ?? null,
      status: a.failure ?? (!guard ? 'frame-material-unvalidated' : 'measured'),
      rawScores: rawRow.scores,
      scores: null,
      nativeBounds: null,
      referenceCoverage: null,
    };
    if (row.status === 'measured') {
      const rect = plan.scoreRegion,
        reference = await cachedGrayRegion(
          objectFile({ sha256: a.referenceHash }),
          a.referenceHash,
          rect,
          profile.transform,
        );
      row.scores = {};
      for (const tier of ['inspect', 'table']) {
        row.scores[tier] = {};
        for (const [label, capture, folder] of [
          ['before', b, 'before'],
          ['after', a, stage],
        ]) {
          const asset = capture.images[tier],
            crop = await cachedGrayRegion(`${base}/${folder}/${asset.file}`, asset.sha256, rect);
          row.scores[tier][label] = compareLettering(reference.gray, crop.gray, rect[2], rect[3]);
        }
      }
      const measured = bounds.rows.find((r) => r.id === a.id);
      const coverageBounds = plan.coverageProfile
        ? await cachedReferenceSymbolBounds(
            objectFile({ sha256: a.referenceHash }),
            a.referenceHash,
            plan.coverageProfile,
          )
        : measured?.reference;
      row.referenceCoverage = symbolRegionCoverage(coverageBounds, rect, profile.transform);
      if (measured?.reference?.stable && measured.before?.stable && measured.renders.after?.stable)
        row.nativeBounds = {
          reference: fittedSymbolBounds(measured.reference.rect, profile.transform),
          before: fittedSymbolBounds(measured.before.rect),
          after: fittedSymbolBounds(measured.renders.after.rect),
        };
      // Preserve the diagnostic scores, but a visibly clipped reference glyph
      // cannot enter the complete-symbol summary as if its full shape was scored.
      if (partial || row.referenceCoverage.status === 'clipped')
        row.status = 'partial-reference-region';
    }
    rows.push(row);
  }
} finally {
  await server.close();
}
function summarize(cohort) {
  const measured = cohort.filter((r) => r.status === 'measured'),
    paired = measured.filter((r) => r.nativeBounds);
  return {
    total: cohort.length,
    measured: measured.length,
    referenceCoverage: Object.fromEntries(
      ['covered', 'near-edge', 'clipped', 'unknown'].map((status) => [
        status,
        cohort.filter((r) => r.referenceCoverage?.status === status).length,
      ]),
    ),
    unvalidated: cohort
      .filter((r) => r.status !== 'measured')
      .map((r) => ({ id: r.id, status: r.status })),
    tiers: Object.fromEntries(
      ['inspect', 'table'].map((tier) => [
        tier,
        {
          before: median(measured.map((r) => r.scores[tier].before.edgeF1)),
          after: median(measured.map((r) => r.scores[tier].after.edgeF1)),
          beforeP10: quantile(
            measured.map((r) => r.scores[tier].before.edgeF1),
            0.1,
          ),
          afterP10: quantile(
            measured.map((r) => r.scores[tier].after.edgeF1),
            0.1,
          ),
          beforeCensus: median(measured.map((r) => r.scores[tier].before.censusSimilarity)),
          afterCensus: median(measured.map((r) => r.scores[tier].after.censusSimilarity)),
          regressed: measured
            .filter((r) => r.scores[tier].after.edgeF1 < r.scores[tier].before.edgeF1 - 0.02)
            .map((r) => r.id),
        },
      ]),
    ),
    stableNativePairs: paired.length,
    absoluteNativeErrors: Object.fromEntries(
      ['before', 'after'].map((label) => [
        label,
        Object.fromEntries(
          ['width', 'height', 'centerX', 'centerY'].map((axis) => [
            axis,
            median(
              paired.map((r) =>
                Math.abs(r.nativeBounds[label][axis] - r.nativeBounds.reference[axis]),
              ),
            ),
          ]),
        ),
      ]),
    ),
  };
}
const result = {
  schemaVersion: 1,
  scope: plan.scope,
  planHash: hash(JSON.stringify(plan)),
  profileHash: plan.profileHash,
  rawMeasurementHash: hash(JSON.stringify(raw)),
  boundsHash: hash(JSON.stringify(bounds)),
  methodHash: hash(await readFile(new URL(import.meta.url))),
  coverageMethodHash: hash(
    await readFile(new URL('./symbol-region-coverage.mjs', import.meta.url)),
  ),
  referenceBoundsMethodHash: plan.coverageProfile ? REFERENCE_BOUNDS_METHOD_HASH : null,
  rendererHash: after.rendererHash,
  transform: profile.transform,
  summary: {
    all: summarize(rows),
    calibration: summarize(rows.filter((r) => r.cohort === 'calibration')),
    reserved: summarize(rows.filter((r) => r.cohort === 'validation')),
    reservedWithoutPriorMeasurement: summarize(
      rows.filter((r) => r.cohort === 'validation' && !r.previouslyObserved),
    ),
  },
  rows,
};
await writeJson(`${fixtureRoot}/${set}-symbol-${stage}-registered.json`, result);
console.log(JSON.stringify(result.summary, null, 2));
