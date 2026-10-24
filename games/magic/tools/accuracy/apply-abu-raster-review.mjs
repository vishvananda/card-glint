// Record the clip fix without claiming completion of remaining frame calibration.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import prettier from 'prettier';
import { hash, sourceHash } from './common.mjs';
import { abuRasterDelta } from './abu-raster-ancestry.mjs';
const p = await abuRasterDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
const base = 'games/magic/fixtures/accuracy/early-through-fourth/';
const scoreFile = base + 'abu-raster-current-scores.json.gz',
  sb = await readFile(scoreFile),
  score = JSON.parse(gunzipSync(sb));
assert.equal(score.source.nativeHash, p.native.contentSha256);
const native = JSON.parse(gunzipSync(await readFile(p.native.file)));
const file = 'games/magic/fixtures/accuracy/calibration-progress.json',
  ledger = JSON.parse(await readFile(file));
const sourceFile = base + 'abu-raster-source-delta.json.gz';
const guards = {
  [sourceFile]: hash(await readFile(sourceFile)),
  [p.native.file]: p.native.sha256,
  [scoreFile]: hash(sb),
  ...Object.fromEntries(Object.entries(p.files).map(([f, e]) => [f, e.after])),
};
let changedGroups = 0;
for (const set of ledger.sets.filter((s) => ['lea', 'leb', '2ed'].includes(s.set))) {
  for (const group of set.groups) {
    const changed = p.members.filter((m) => group.printingIds.includes(m.id));
    if (!changed.length) continue;
    changedGroups++;
    const members = group.printingIds.map((id) => {
      const r = native.rows.find((r) => r.id === id);
      assert(r);
      return {
        id: r.id,
        name: r.name,
        referenceHash: r.referenceHash,
        poseHash: r.poseHash,
        inputHash: r.inputHash,
        nativeFaceHash: r.original.hashes['after-face'],
      };
    });
    for (const task of ['frameGeometry', 'fullCard']) {
      const old = group.tasks[task];
      group.tasks[task] = {
        ...old,
        status: 'partial',
        reason:
          'Raster material-selection seams are removed and current Original scores replayed. Physical art/paper geometry, texture and typography residuals remain open; independent corner-position proposals have not been adopted.',
        evidence: [...new Set([...(old.evidence ?? []), sourceFile, p.native.file, scoreFile])],
        guards: { ...old.guards, ...guards },
        runtimeGuards: { 'games/magic/src': p.afterRenderer },
        proof: {
          ...old.proof,
          rendererHash: p.afterRenderer,
          abuRasterSource: p.afterRenderer,
          nativeReplayHash: p.native.contentSha256,
          metricsHash: hash(gunzipSync(sb)),
          methodHash: p.native.toolSha256,
          coveredPrintings: members.length,
          validationKind: 'source-census',
          sourceCensus: {
            heldOut: false,
            scope: 'all-ordinary-printings-in-variant',
            parameterScope:
              'Pixel-aligned material selection only. No scan, physical geometry, palette or typography adjustment.',
            members,
          },
          gatesPassed: false,
        },
      };
    }
  }
  set.textAudit.rasterSelectionUpdate = {
    rendererHash: p.afterRenderer,
    evidence: scoreFile,
    nativeEvidence: p.native.file,
    changedCachePrintings: p.members.filter((m) => m.set === set.set).length,
    measured: score.summary[set.set],
    scope:
      'Native census of899 unchanged scan poses. Exact matching faces reuse scores; changed bytes recomputed. This does not close pending calibration residuals.',
  };
}
const config = await prettier.resolveConfig(file);
await writeFile(file, await prettier.format(JSON.stringify(ledger), { ...config, parser: 'json' }));
console.log(
  JSON.stringify({ changedGroups, affectedPrintings: p.members.length, summary: score.summary }),
);
