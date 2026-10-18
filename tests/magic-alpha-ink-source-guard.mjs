import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

const extension = JSON.parse(
  await readFile(
    new URL('../games/magic/fixtures/accuracy/alpha-ink-compatibility.json', import.meta.url),
  ),
);
let verified;
export function alphaInkProof() {
  verified ??= (async () => {
    const bytes = await readFile('games/magic/fixtures/accuracy/alpha-text-ink.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.equal(evidence.native.rows.length, 38);
    for (const row of evidence.native.rows) {
      assert.equal(row.outsideChanged, 0);
      assert.equal(row.alphaChanged, 0);
      assert.equal(row.layoutUnchanged, true);
      assert.notEqual(row.before, row.after);
    }
    assert.equal(evidence.native.controls.length, 54);
    for (const row of evidence.native.controls) assert.equal(row.before, row.after);
    for (const [file, expected] of Object.entries(extension.dependencies))
      assert.equal(
        hash(await readFile(file)),
        expected,
        'Unreviewed Alpha ink dependency: ' + file,
      );
    return evidence;
  })();
  return verified;
}

/** Keep older measurements tied to their original Alpha ink, with exact
 * reversible source edits and a separate native isolation receipt. */
export async function preAlphaInkSource(file) {
  const bytes = await readFile(file),
    change = extension.files[file];
  if (!change) return bytes;
  await alphaInkProof();
  assert.equal(hash(bytes), change.after, 'Unreviewed Alpha ink integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-Alpha ink reconstruction failed: ' + file);
  return before;
}
