// Record current scoped measurements without closing unrelated frame/text work.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import prettier from 'prettier';
import { hash, sourceHash } from './common.mjs';
import { abuPerimeterDelta } from './abu-perimeter-ancestry.mjs';
const p = await abuPerimeterDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
const base = 'games/magic/fixtures/accuracy/early-through-fourth/';
const scoreFile = base + 'abu-perimeter-score-update.json.gz',
  zip = await readFile(scoreFile),
  raw = gunzipSync(zip),
  score = JSON.parse(raw);
assert.equal(score.source.nativeHash, p.native.contentSha256);
assert.equal(score.recomputedPrintings, 19);
assert.equal(score.reusedPrintings, 880);
const ledgerFile = 'games/magic/fixtures/accuracy/calibration-progress.json';
const ledger = JSON.parse(await readFile(ledgerFile)),
  sourceFile = base + 'abu-perimeter-source-delta.json.gz';
const guards = {
  [sourceFile]: hash(await readFile(sourceFile)),
  [p.native.file]: p.native.sha256,
  [scoreFile]: hash(zip),
  ...Object.fromEntries(Object.entries(p.files).map(([f, e]) => [f, e.after])),
};
for (const set of ledger.sets.filter((s) => ['lea', 'leb'].includes(s.set))) {
  for (const group of set.groups) {
    const members = p.members.filter((m) => group.printingIds.includes(m.id));
    if (!members.length) continue;
    assert.equal(members.length, group.printings);
    const census = {
      heldOut: false,
      scope: 'all-ordinary-printings-in-variant',
      names: [...new Set(members.map((m) => m.name))],
      parametersHash: hash(
        JSON.stringify({ offsetY: -2, inner: [45, 45, 398, 587], source: p.afterRenderer }),
      ),
      parameterScope:
        'One shared two-pixel perimeter shift across all nineteen observed Alpha/Beta dual references. No card-specific offset, no independent holdout, no art/paper or pigment change.',
      members: members.map((m) => ({
        id: m.id,
        name: m.name,
        referenceHash: m.referenceHash,
        poseHash: m.poseHash,
        inputHash: m.inputHash,
        nativeFaceHash: m.original.hashes['after-face'],
      })),
    };
    for (const task of ['frameGeometry', 'fullCard']) {
      const old = group.tasks[task];
      group.tasks[task] = {
        ...old,
        status: 'partial',
        reason:
          task === 'frameGeometry'
            ? 'The outside perimeter is corrected by a shared two-pixel upward redraw; native interior/silhouette are exact and all nineteen whole-card means improve. Independent lower art/paper boundaries and source texture/bevel differences remain open; Alpha Savannah bottom-edge loss is retained.'
            : 'Current scoped perimeter scores improve all nineteen duals; other880 score identities are retained, including the previous physical artist correction. Existing text-wrap, internal frame geometry and asset-texture residuals remain open.',
        evidence: [...new Set([...(old.evidence ?? []), sourceFile, p.native.file, scoreFile])],
        guards: { ...old.guards, ...guards },
        runtimeGuards: { 'games/magic/src': p.afterRenderer },
        proof: {
          ...old.proof,
          rendererHash: p.afterRenderer,
          abuPerimeterSource: p.afterRenderer,
          sourceHash: group.sourceHashes?.[task] ?? group.sourceHash,
          scopeHash: group.scopeHash,
          methodHash: p.native.toolSha256,
          nativeReplayHash: p.native.contentSha256,
          metricsHash: hash(raw),
          coveredPrintings: members.length,
          calibrationNames: census.names.length,
          validationNames: census.names.length,
          validationKind: 'source-census',
          sourceCensus: census,
          gatesPassed: false,
        },
      };
    }
  }
  set.textAudit.perimeterUpdate = {
    rendererHash: p.afterRenderer,
    evidence: scoreFile,
    nativeEvidence: p.native.file,
    changedPrintings: p.members.filter((m) => m.set === set.set).length,
    measured: score.sets[set.set],
    scope:
      'Nineteen dual printing scores update across Alpha/Beta; all other880 current native identities are exact. These are fixed-pose historical-eligibility means, not new normalization claims. Existing text and texture residuals remain explicit.',
  };
}
const config = await prettier.resolveConfig(ledgerFile);
await writeFile(
  ledgerFile,
  await prettier.format(JSON.stringify(ledger), { ...config, parser: 'json' }),
);
console.log(
  'Recorded nineteen current perimeter improvements; geometry/full-card residuals remain partial.',
);
