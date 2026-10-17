import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { preArtistCalibrationSource } from './magic-artist-source-guard.mjs';
const verified = new WeakMap();
async function proof(readSource) {
  let verification = verified.get(readSource);
  if (!verification) {
    verification = (async () => {
      const extension = JSON.parse(
        await readFile('games/magic/fixtures/accuracy/early-expansion-mana-compatibility.json'),
      );
      const bytes = await readFile('games/magic/fixtures/accuracy/early-expansion-mana.json');
      assert.equal(hash(bytes), extension.evidenceHash);
      const evidence = JSON.parse(bytes);
      assert.equal(evidence.baselineCommit, extension.baselineCommit);
      assert.equal(evidence.native.summary.cards, 316);
      assert.equal(evidence.native.summary.exactNative, 276);
      assert.equal(evidence.native.summary.outsideChanged, 0);
      assert.equal(evidence.native.rows.length, 316);
      for (const row of evidence.native.rows) assert.equal(row.outsideChanged, 0);
      assert.equal(evidence.controls.cards, 84);
      assert.equal(evidence.controls.changed, 0);
      for (const row of evidence.controls.rows) assert.equal(row.before, row.sha256);
      for (const [file, expected] of Object.entries(extension.dependencies))
        assert.equal(hash(await readSource(file)), expected, 'Unreviewed mana dependency: ' + file);
      return extension;
    })();
    verified.set(readSource, verification);
  }
  return verification;
}
/** Historical non-mana receipts retain their original source and pixel hashes.
 * Current behavior is separately certified by native replay and scope tests. */
export async function preManaCalibrationSource(file, readSource = preArtistCalibrationSource) {
  const bytes = await readSource(file),
    extension = await proof(readSource),
    change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed mana integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-mana source reconstruction failed: ' + file);
  return before;
}
