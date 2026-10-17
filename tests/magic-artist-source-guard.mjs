import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

let verified;
async function proof() {
  return (verified ??= (async () => {
    const extension = JSON.parse(
      await readFile(
        'games/magic/fixtures/accuracy/early-expansion-artist-solid-compatibility.json',
      ),
    );
    const bytes = await readFile('games/magic/fixtures/accuracy/early-expansion-artist-solid.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.deepEqual(evidence.native.summary, {
      cards: 316,
      eligible: 309,
      exactNative: 306,
      changed: 309,
      outsideChanged: 0,
    });
    assert.equal(evidence.native.rows.length, 316);
    for (const row of evidence.native.rows) {
      assert.equal(row.outsideChanged, 0);
      if (row.scored) assert.equal(row.proposalParity, true);
      if (!row.eligible) assert.equal(row.before, row.after);
    }
    assert.equal(evidence.controls.cards, 84);
    assert.equal(evidence.controls.changed, 0);
    assert.equal(evidence.controls.rows.length, 84);
    for (const row of evidence.controls.rows) assert.equal(row.before, row.sha256);
    for (const [file, expected] of Object.entries(extension.dependencies))
      assert.equal(hash(await readFile(file)), expected, 'Unreviewed artist dependency: ' + file);
    return extension;
  })());
}

/** The native artist-only replay preserves all other pixels. Reconstruct exact
 * 0.4.13 sources for historical receipts; never rewrite their measured hashes. */
export async function preArtistCalibrationSource(file) {
  const bytes = await readFile(file),
    extension = await proof(),
    change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed artist integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-artist source reconstruction failed: ' + file);
  return before;
}
