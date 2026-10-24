// Record the clip fix without claiming completion of remaining frame calibration.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import prettier from 'prettier';
import { hash, sourceHash } from './common.mjs';
import { abuPaperDelta } from './abu-paper-ancestry.mjs';
const p = await abuPaperDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
const base = 'games/magic/fixtures/accuracy/early-through-fourth/';
const scoreFile = base + 'abu-paper-current-scores.json.gz',
  sb = await readFile(scoreFile),
  score = JSON.parse(gunzipSync(sb));
assert.equal(score.source.nativeHash, p.native.contentSha256);
for (const [file, digest] of Object.entries(score.source.colorMethod))
  assert.equal(hash(await readFile(file)), digest, 'Changed paper-color sampling method');
const native = JSON.parse(gunzipSync(await readFile(p.native.file)));
const file = 'games/magic/fixtures/accuracy/calibration-progress.json',
  ledger = JSON.parse(await readFile(file));
const sourceFile = base + 'abu-paper-source-delta.json.gz';
const guards = {
  [sourceFile]: hash(await readFile(sourceFile)),
  [p.native.file]: p.native.sha256,
  [scoreFile]: hash(sb),
  'games/magic/tools/accuracy/abu-paper-score.mjs': score.source.toolHash,
  ...score.source.colorMethod,
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
    for (const task of ['frameGeometry', 'paperColor', 'fullCard']) {
      const old = group.tasks[task];
      group.tasks[task] = {
        ...old,
        status:
          task === 'paperColor' && score.paperColorReview.currentPigmentsSupported
            ? 'validated'
            : 'partial',
        reason:
          task === 'paperColor' && score.paperColorReview.currentPigmentsSupported
            ? 'Existing source pigments retained after fresh eroded paper sampling: median Oklab error improves and every printing stays within the established regression allowance. Geometry is reviewed separately.'
            : 'The shared six-pixel paper-panel reflow preserves border widths, art, typography and source poses. All19 measured candidates reproduce exactly;18 improve and Alpha Savannah remains a disclosed source-pattern regression. Remaining art-bottom, asset texture and text-wrap residuals stay explicit.',
        evidence: [...new Set([...(old.evidence ?? []), sourceFile, p.native.file, scoreFile])],
        guards: { ...old.guards, ...guards },
        runtimeGuards: { 'games/magic/src': p.afterRenderer },
        proof: {
          ...old.proof,
          rendererHash: p.afterRenderer,
          abuPaperSource: p.afterRenderer,
          nativeReplayHash: p.native.contentSha256,
          metricsHash: hash(gunzipSync(sb)),
          methodHash: p.native.toolSha256,
          coveredPrintings: members.length,
          calibrationNames: new Set(members.map((m) => m.name)).size,
          validationNames: new Set(members.map((m) => m.name)).size,
          validationKind: 'source-census',
          sourceCensus: {
            heldOut: false,
            scope: 'all-ordinary-printings-in-variant',
            names: [...new Set(members.map((m) => m.name))],
            parametersHash: hash(
              JSON.stringify({
                bottomUp: 6,
                pad: 2,
                physicalBandWidth: 6.375,
                palette: 'current-source-pigments',
              }),
            ),
            parameterScope:
              'One shared panel reflow across all19 Alpha/Beta duals. Pigment parameters, fonts, wording and scan poses stay fixed. Every local variant is a finite source census; no independent holdout is claimed.',
            members,
          },
          gatesPassed: task === 'paperColor' && score.paperColorReview.currentPigmentsSupported,
        },
      };
    }
  }
  set.textAudit.paperPanelUpdate = {
    rendererHash: p.afterRenderer,
    evidence: scoreFile,
    nativeEvidence: p.native.file,
    changedCachePrintings: p.members.filter((m) => m.set === set.set).length,
    measured: score.summary[set.set],
    paperColorReview: {
      medianBefore: score.paperColorReview.medianBefore,
      medianAfter: score.paperColorReview.medianAfter,
      worstRegression: score.paperColorReview.worstRegression,
      supported: score.paperColorReview.currentPigmentsSupported,
    },
    retainedRegressions: score.changes
      .filter((r) => r.set === set.set && r.delta < -0.5)
      .map((r) => ({
        id: r.id,
        name: r.name,
        delta: r.delta,
        reason:
          'Shared geometry; source pattern and corner/frame disagreement retained for explicit review. No per-printing warp or score exclusion.',
      })),
    scope:
      'Native census of899 unchanged scan poses.19 panels rescored,880 exact identities reused. Fresh pigment checks retain the existing color choice without refitting. Geometry/text/source-pattern residuals remain explicit.',
  };
}
const config = await prettier.resolveConfig(file);
await writeFile(file, await prettier.format(JSON.stringify(ledger), { ...config, parser: 'json' }));
console.log(
  JSON.stringify({ changedGroups, affectedPrintings: p.members.length, summary: score.summary }),
);
