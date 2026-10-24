// Revalidate five scoped geometry approvals without relabelling historical pixels.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import prettier from 'prettier';
import { validateUnlimitedRasterGeometry } from './unlimited-raster-geometry-policy.mjs';
import { hash, sourceHash } from './common.mjs';
import { abuPaperDelta } from './abu-paper-ancestry.mjs';
import { abuRasterDelta } from './abu-raster-ancestry.mjs';
const FILE =
  'games/magic/fixtures/accuracy/early-through-fourth/2ed-raster-geometry-review.json.gz';
const z = await readFile(FILE),
  raw = gunzipSync(z),
  review = JSON.parse(raw);
const current = await abuPaperDelta(),
  prior = await abuRasterDelta();
assert.equal(await sourceHash('games/magic/src'), current.afterRenderer);
assert.equal(review.source.rendererHash, current.afterRenderer);
assert.equal(review.source.nativeHash, current.native.contentSha256);
assert.equal(review.source.priorNativeHash, prior.native.contentSha256);
assert.equal(
  review.source.toolHash,
  hash(await readFile(new URL('./unlimited-raster-geometry-review.mjs', import.meta.url))),
);
assert.equal(
  review.source.samplerHash,
  hash(await readFile(new URL('./pixels-pure.mjs', import.meta.url))),
);
const policy = validateUnlimitedRasterGeometry(review, current, prior);
const file = 'games/magic/fixtures/accuracy/calibration-progress.json',
  ledger = JSON.parse(await readFile(file));
const set = ledger.sets.find((s) => s.set === '2ed');
let closed = 0;
for (const group of set.groups) {
  const rows = review.rows.filter((r) => group.printingIds.includes(r.id));
  if (!rows.length) continue;
  assert.equal(rows.length, group.printings);
  const old = group.tasks.frameGeometry,
    names = [...new Set(rows.map((r) => r.name))];
  assert(['partial', 'validated'].includes(old.status));
  group.tasks.frameGeometry = {
    ...old,
    reviewedAt: '2026-10-24',
    status: 'validated',
    reason:
      'The raster-outline correction preserves the physical stock/frame/art/paper edges. Four text-free frame rails and eight unchanged interior strips retain their positions within 0.1 canonical pixel and reference overlap within 0.25/100; two-pixel displacement controls remain distinguishable. Current 899-printing replay confirms exact current Unlimited pixels. Text/full-card/release reviews remain separate.',
    evidence: [...new Set([...(old.evidence ?? []), FILE, current.native.file, prior.native.file])],
    guards: {
      ...old.guards,
      [FILE]: hash(z),
      [current.native.file]: current.native.sha256,
      [prior.native.file]: prior.native.sha256,
      'games/magic/tools/accuracy/unlimited-raster-geometry-review.mjs': review.source.toolHash,
      'games/magic/tools/accuracy/pixels-pure.mjs': review.source.samplerHash,
      'games/magic/tools/accuracy/unlimited-raster-geometry-policy.mjs': hash(
        await readFile(new URL('./unlimited-raster-geometry-policy.mjs', import.meta.url)),
      ),
    },
    runtimeGuards: { 'games/magic/src': prior.afterRenderer },
    proof: {
      ...old.proof,
      rendererHash: prior.afterRenderer,
      abuRasterSource: prior.afterRenderer,
      exactCurrentRenderer: current.afterRenderer,
      nativeReplayHash: prior.native.contentSha256,
      metricsHash: hash(raw),
      methodHash: review.source.toolHash,
      sourceHash: group.sourceHashes?.frameGeometry ?? group.sourceHash,
      scopeHash: group.scopeHash,
      coveredPrintings: rows.length,
      calibrationNames: names.length,
      validationNames: names.length,
      validationKind: 'source-census',
      gatesPassed: true,
      sourceCensus: {
        heldOut: false,
        scope: 'all-ordinary-printings-in-variant',
        names,
        parametersHash: hash(
          JSON.stringify({
            policy,
            geometry: 'existing-reviewed-Unlimited-layout',
            rasterRevision: 'outline-raster-v4',
          }),
        ),
        parameterScope:
          'Existing geometry, zero new placement/size parameters. Raster-selection antialiasing is reviewed independently. Historical native identity is retained and joined by exact bytes to the latest 899-printing census.',
        members: rows.map((r) => ({
          id: r.id,
          name: r.name,
          referenceHash: r.referenceHash,
          poseHash: r.poseHash,
          inputHash: r.inputHash,
          nativeFaceHash: r.currentFaceHash,
        })),
      },
    },
  };
  closed += rows.length;
}
assert.equal(closed, 5);
set.textAudit.rasterGeometryReview = {
  evidence: FILE,
  currentRenderer: current.afterRenderer,
  recordedNativeRenderer: prior.afterRenderer,
  printings: closed,
  policy,
  scope:
    'Five previously partial geometry tasks revalidated. No text/full-card/release completion or scan refit.',
};
const config = await prettier.resolveConfig(file);
await writeFile(file, await prettier.format(JSON.stringify(ledger), { ...config, parser: 'json' }));
console.log(
  'Five Unlimited frame-geometry variants revalidated; remaining text/full-card/release unchanged.',
);
