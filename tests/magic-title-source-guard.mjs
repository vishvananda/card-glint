import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

let verified;
async function proof() {
  return (verified ??= (async () => {
    const extension = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-expansion-title-compatibility.json'),
    );
    const bytes = await readFile('games/magic/fixtures/accuracy/early-expansion-titles.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.deepEqual(evidence.native.summary, {
      cards: 316,
      changed: 309,
      unchanged: 7,
      scored: 306,
      exactNative: 316,
      outsideChanged: 0,
    });
    assert.equal(evidence.rows.length, 316);
    for (const row of evidence.rows) {
      assert.equal(row.outsideChanged, 0);
      assert.equal(row.proposalParity, true);
      if (!row.eligible) assert.equal(row.before, row.after);
    }
    assert.equal(evidence.controls.cards, 84);
    assert.equal(evidence.controls.changed, 0);
    assert.equal(evidence.controls.rows.length, 84);
    for (const row of evidence.controls.rows) assert.equal(row.before, row.sha256);
    for (const [file, expected] of Object.entries(extension.dependencies))
      assert.equal(hash(await readFile(file)), expected, 'Unreviewed title dependency: ' + file);
    return extension;
  })());
}

/** Reconstruct complete 0.4.10 sources for historical, non-title evidence only.
 * The current title implementation is independently checked by native replay,
 * score gates and scope tests. Historical measurements keep their original hashes. */
export async function preTitleCalibrationSource(file) {
  const bytes = await readFile(file),
    extension = await proof(),
    change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed title integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-title source reconstruction failed: ' + file);
  return before;
}
