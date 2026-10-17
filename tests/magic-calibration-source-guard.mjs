import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
let verified;
async function proof() {
  return (verified ??= (async () => {
    const evidence = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/printing-calibration-legacy-replay.json'),
    );
    const extension = JSON.parse(
      await readFile(
        'games/magic/fixtures/accuracy/printing-calibration-source-compatibility.json',
      ),
    );
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.ok(evidence.cards >= 80);
    assert.equal(evidence.changed, 0);
    assert.equal(evidence.rows.length, evidence.cards);
    for (const row of evidence.rows) {
      assert.equal(row.identical, true);
      assert.equal(row.sha256, row.after);
    }
    for (const [file, expected] of Object.entries(extension.dependencies))
      assert.equal(
        hash(await readFile(file)),
        expected,
        'Unreviewed calibration-policy dependency: ' + file,
      );
    return extension;
  })());
}
/** Historical receipts keep their original hashes. Reconstruct the entire prior
 * module using a bounded, hash-checked opt-in extension, backed by native replay.
 * New policy tests always run the current code; this applies only to old evidence. */
export async function calibrationLegacySource(file) {
  const bytes = await readFile(file),
    extension = await proof(),
    change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed calibration source change: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Legacy source reconstruction failed: ' + file);
  return before;
}
