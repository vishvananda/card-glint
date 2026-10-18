import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

let verified;
export function earlyReprintProof() {
  verified ??= (async () => {
    const extension = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-reprint-compatibility.json'),
    );
    const bytes = await readFile('games/magic/fixtures/accuracy/early-reprint-frame-color.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.deepEqual(evidence.scope, {
      sets: ['fem', '4ed', 'chr'],
      cards: 690,
      geometryProfiles: 27,
      materialProfiles: 30,
    });
    assert.deepEqual(evidence.native.summary, { cards: 690, exact: 690 });
    assert.equal(evidence.native.rows.length, 690);
    assert.equal(new Set(evidence.native.rows.map((r) => r.id)).size, 690);
    for (const row of evidence.native.rows) {
      assert.equal(row.prototype, row.integrated);
      assert.equal(row.changedBytes, 0);
      assert.equal(row.maxDelta, 0);
    }
    assert.equal(evidence.controls.cards, 98);
    assert.equal(evidence.controls.changed, 0);
    assert.equal(evidence.controls.rows.length, 98);
    for (const row of evidence.controls.rows) assert.equal(row.before, row.sha256);
    assert.equal(evidence.rendererHash, evidence.controls.sourceHashes[1]);
    for (const [file, expected] of Object.entries(extension.dependencies))
      assert.equal(
        hash(await readFile(file)),
        expected,
        'Unreviewed early-reprint dependency: ' + file,
      );
    return extension;
  })();
  return verified;
}

/** Historical receipts keep their measured bytes. Verify the new scoped native
 * replay before reconstructing the three pre-integration modules. */
export async function preEarlyReprintSource(file) {
  const bytes = await readFile(file),
    extension = await earlyReprintProof(),
    change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed early-reprint integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-reprint source reconstruction failed: ' + file);
  return before;
}
