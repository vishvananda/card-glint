// Attach the scoped native recheck to its component census. Publication stays pending.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { format } from 'prettier';
import { hash, root, sourceHash, atomicWrite } from './common.mjs';
import { onsSymbolStatsDelta, onsSymbolStatsAffected } from './ons-symbol-stats-ancestry.mjs';
const [out] = process.argv.slice(2);
assert(out, 'Use OUTPUT_LEDGER_JSON');
const p = await onsSymbolStatsDelta();
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), p.afterRenderer);
const file = 'games/magic/fixtures/accuracy/ons-recheck/symbols-and-stats-077.json.gz';
const sha = hash(await fs.readFile(path.join(root, file)));
const methodHash = hash(await fs.readFile(new URL(import.meta.url)));
const ledger = JSON.parse(
  await fs.readFile(path.join(root, 'games/magic/fixtures/accuracy/calibration-progress.json')),
);
const set = ledger.sets.find((s) => s.set === 'ons');
const updated = [];
for (const group of set.groups.filter((g) => g.references.nonfoil > 0)) {
  const members = group.printingIds.map((id) => {
    const r = p.scores.rows.find((r) => r.id === id),
      n = p.captures.after.rows.find((r) => r.id === id);
    assert(r && n, 'Missing native census member ' + id);
    return {
      id,
      name: r.name,
      referenceHash: r.referenceHash,
      poseHash: r.poseHash,
      inputHash: r.inputHash,
      nativeFaceHash: n.modes.original.sha256,
    };
  });
  const census = {
    heldOut: false,
    scope: 'all-ordinary-printings-in-variant',
    names: [...new Set(members.map((m) => m.name))].sort(),
    parametersHash: p.files['games/magic/src/calibration/sets/ons.ts'].after,
    parameterScope:
      'Shared physical-material cost paper and filled P/T. Original wording, artwork, poses and every other pixel unchanged; repeated development scans, no independent release holdout.',
    members,
  };
  for (const task of ['manaColor', 'stats', 'fullCard']) {
    if (!(await onsSymbolStatsAffected('ons', task, false, group))) continue;
    const item = group.tasks[task];
    assert(['validated', 'validated-default'].includes(item.status));
    const source = hash(
      JSON.stringify({
        prior: item.proof.sourceHash,
        task,
        renderer: p.afterRenderer,
        receipt: sha,
      }),
    );
    group.sourceHashes[task] = source;
    Object.assign(item, {
      status: 'validated',
      reviewedAt: new Date().toISOString(),
      reason:
        'Source-bound nonfoil native recheck: filled P/T and physical-material generic cost paper; all Original inputs and scan poses frozen. Other components are pixel-identical; outliers remain in the receipt.',
      evidence: [file, ...item.evidence.filter((f) => f !== file)],
      guards: { ...item.guards, [file]: sha },
      runtimeGuards: { ...item.runtimeGuards, 'games/magic/src': p.afterRenderer },
      proof: {
        ...item.proof,
        sourceHash: source,
        rendererHash: p.afterRenderer,
        onsSymbolStats: p.afterRenderer,
        methodHash,
        nativeReplayHash: p.native.source.afterCapture,
        metricsHash: p.scores.afterDefinition,
        sourceCensus: census,
        calibrationNames: census.names.length,
        validationNames: census.names.length,
      },
    });
    updated.push({ group: group.key, task, printings: group.printings });
  }
}
set.inventory.review.onsSymbolStats = {
  file,
  sha256: sha,
  rendererHash: p.afterRenderer,
  printings: 350,
  structure100: p.scores.after.all.acceptedPoseMean100,
  publication: 'pending',
};
await atomicWrite(out, await format(JSON.stringify(ledger), { parser: 'json', printWidth: 100 }));
console.log(JSON.stringify({ updated, release: 'pending; no publication is inferred' }));
