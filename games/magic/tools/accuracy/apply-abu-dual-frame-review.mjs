// Record the current dual-frame review without promoting unresolved geometry.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import prettier from 'prettier';
import { hash, sourceHash } from './common.mjs';
import { abuFractionalAncestry } from './abu-fractional-ancestry.mjs';
const base = 'games/magic/fixtures/accuracy/early-through-fourth/';
const reviewFile = base + 'abu-dual-frame-review.json',
  metricFile = base + 'abu-dual-frame-recheck.json.gz';
const reviewBytes = await readFile(reviewFile),
  review = JSON.parse(reviewBytes),
  metricBytes = gunzipSync(await readFile(metricFile)),
  metric = JSON.parse(metricBytes),
  source = await abuFractionalAncestry();
assert.equal(await sourceHash('games/magic/src'), source.afterRenderer);
assert.equal(hash(metricBytes), review.measurementSha256);
assert.equal(review.rendererHash, source.afterRenderer);
assert.equal(metric.rendererHash, source.afterRenderer);
assert.equal(metric.nativeHash, source.evidence.native.contentSha256);
assert.equal(metric.summary.inventory, 19);
assert.equal(metric.summary.frameIdentical, 19);
const file = 'games/magic/fixtures/accuracy/calibration-progress.json',
  ledger = JSON.parse(await readFile(file));
for (const set of ledger.sets.filter((s) => ['lea', 'leb'].includes(s.set))) {
  for (const group of set.groups) {
    const rows = review.rows.filter((r) => group.printingIds.includes(r.id));
    if (!rows.length) continue;
    assert.equal(rows.length, group.printings);
    assert(rows.every((r) => r.nonRulesChanged === 0));
    const guards = {
      ...Object.fromEntries(Object.entries(source.files).map(([f, e]) => [f, e.after])),
      [reviewFile]: hash(reviewBytes),
      [metricFile]: hash(await readFile(metricFile)),
    };
    const evidence = [reviewFile, metricFile, base + 'abu-fractional-source-proof.json'];
    const old = group.tasks.frameGeometry;
    group.tasks.frameGeometry = {
      ...old,
      status: 'partial',
      reason:
        'All printed dual outlines have a current native/scan review. Palette selection is retained and the native frames exactly match the prior corrected candidates. Top/bottom outline transitions and stock/bevel texture still differ from the scans; no per-card shift or shape change was adopted.',
      evidence: [...new Set([...(old.evidence ?? []), ...evidence])],
      guards: { ...old.guards, ...guards },
      runtimeGuards: { ...old.runtimeGuards, 'games/magic/src': source.afterRenderer },
      proof: { ...old.proof, gatesPassed: false, dualFrameReviewHash: hash(reviewBytes) },
    };
    const color = group.tasks.frameColor;
    const semantic = metric.rows.find((r) => r.id === rows[0].id).colors.join('');
    if (set.set === 'leb' && ['UR', 'WU'].includes(semantic)) {
      const currentSourceGuards = {};
      for (const file of Object.keys({ ...group.guards, ...color.guards }))
        if (file.startsWith('games/magic/src/'))
          currentSourceGuards[file] = hash(await readFile(file));
      group.tasks.frameColor = {
        ...color,
        status: 'validated',
        reason:
          'Fresh native frame pixels are exactly unchanged from the reviewed Beta outline candidates, including Tundra and Volcanic Island. Source dependencies are refreshed using this explicit regional parity proof; existing color calibration is reused.',
        evidence: [...new Set([...(color.evidence ?? []), ...evidence])],
        guards: {
          ...color.guards,
          ...guards,
          ...currentSourceGuards,
        },
        runtimeGuards: { ...color.runtimeGuards, 'games/magic/src': source.afterRenderer },
        proof: {
          ...color.proof,
          sourceHash: group.sourceHashes?.frameColor ?? group.sourceHash,
          rendererHash: source.afterRenderer,
          methodHash: metric.toolHash,
          nativeReplayHash: metric.nativeHash,
          metricsHash: hash(JSON.stringify(rows)),
          scopeHash: group.scopeHash,
          coveredPrintings: group.printings,
          gatesPassed: true,
          calibrationNames: 10,
          validationNames: 10,
          validationKind: 'reused-development',
          scanTemplateHash: hash(
            JSON.stringify(
              metric.rows.filter((r) => r.set === set.set).map((r) => [r.id, r.poseHash]),
            ),
          ),
          dualFrameReviewHash: hash(reviewBytes),
        },
      };
    }
    if (rows.some((r) => r.set === 'lea' && r.name === 'Tropical Island')) {
      const artist = group.tasks.artist;
      group.tasks.artist = {
        ...artist,
        status: 'partial',
        reason:
          'The Alpha Tropical Island scan credits Mark Poole; the rebuild currently credits Jesper Myrfors. An exact-printing artist correction is required.',
        evidence: [...new Set([...(artist.evidence ?? []), reviewFile])],
        proof: { ...artist.proof, gatesPassed: false, dualFrameReviewHash: hash(reviewBytes) },
      };
    }
  }
}
const config = await prettier.resolveConfig(file);
await writeFile(file, await prettier.format(JSON.stringify(ledger), { ...config, parser: 'json' }));
console.log(
  'Recorded nineteen dual-frame reviews, preserved native color reuse, and retained geometry/artist residuals.',
);
