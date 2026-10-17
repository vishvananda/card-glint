import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

let verified;
export function darkCalibrationProof() {
  verified ??= (async () => {
    const extension = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-expansion-dark-compatibility.json'),
    );
    const bytes = await readFile('games/magic/fixtures/accuracy/early-expansion-dark-frames.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.deepEqual(evidence.native.summary, {
      cards: 316,
      changed: 7,
      unchanged: 309,
      exactPrototypes: 7,
    });
    assert.equal(evidence.native.rows.length, 316);
    for (const row of evidence.native.rows) {
      const expected = row.set === 'drk' && ['L', 'M'].includes(row.material);
      assert.equal(row.changed, expected);
      if (expected) assert.equal(row.proposalParity, true);
      else assert.equal(row.before, row.after);
    }
    assert.equal(evidence.controls.cards, 84);
    assert.equal(evidence.controls.changed, 0);
    assert.equal(evidence.controls.rows.length, 84);
    for (const row of evidence.controls.rows) assert.equal(row.before, row.sha256);
    for (const [file, expected] of Object.entries(extension.dependencies))
      assert.equal(hash(await readFile(file)), expected, 'Unreviewed Dark dependency: ' + file);
    return extension;
  })();
  return verified;
}

/** Keep historical evidence pinned to its measured revision. Native parity
 * proves the new profiles affect only seven DRK land/gold printings. */
export async function preDarkCalibrationSource(file) {
  const bytes = await readFile(file),
    extension = await darkCalibrationProof(),
    change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed Dark frame integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-Dark source reconstruction failed: ' + file);
  return before;
}
