import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from './common.mjs';

const proofFile = 'games/magic/fixtures/accuracy/host-worker/source-proof.json';
// Frozen after the independent browser replay. Changes require renewed evidence.
export const HOST_WORKER_PROOF_HASH =
  '6afd6b7101c29be8bd3b2d59402155170b93cbc390c170b8158f1580aeaab209';
let checked;
export function hostWorkerCompatibilityProof() {
  return (checked ??= (async () => {
    const bytes = await readFile(proofFile);
    assert.equal(hash(bytes), HOST_WORKER_PROOF_HASH, 'Unreviewed worker compatibility proof');
    const proof = JSON.parse(bytes);
    assert.equal(proof.schema, 1);
    for (const [file, digest] of Object.entries(proof.dependencies))
      assert.equal(hash(await readFile(file)), digest, 'Changed worker helper: ' + file);
    const evidence = await readFile(proof.evidence);
    assert.equal(hash(evidence), proof.evidenceHash);
    const report = JSON.parse(evidence);
    assert.equal(report.baselineCommit, proof.baselineCommit);
    assert.equal(report.battleCommit, proof.battleCommit);
    assert.equal(report.rows.length, 56);
    for (const row of report.rows) {
      assert.equal(row.changedBytes, 0);
      assert.equal(row.assetsIdentical, true);
      assert.equal(row.before, row.after);
    }
    return proof;
  })());
}

/** Only this exact, reviewed portable implementation can reuse its old identity.
 * Any later edit keeps its own hash and becomes stale through the normal checks. */
export async function compatibleHostWorkerSource(file, bytes) {
  const proof = await hostWorkerCompatibilityProof(),
    change = proof.files[file];
  if (!change || hash(bytes) !== change.after) return bytes;
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-worker reconstruction failed: ' + file);
  return before;
}
