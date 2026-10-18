import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

let verified;
export function darkManaProof() {
  verified ??= (async () => {
    const extension = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-expansion-dark-mana-compatibility.json'),
    );
    const bytes = await readFile('games/magic/fixtures/accuracy/early-expansion-dark-mana.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.equal(evidence.native.rows.length, 316);
    assert.equal(evidence.native.summary.drk, 122);
    assert.equal(evidence.native.summary.exactPrototypes, 122);
    assert.equal(evidence.native.summary.unrelatedChanged, 0);
    assert.equal(evidence.native.summary.outsideChanged, 0);
    for (const row of evidence.native.rows) {
      assert.equal(row.proposalParity, true);
      assert.equal(row.outsidePixels, 0);
      assert.equal(row.changed, row.before !== row.after);
      if (row.set !== 'drk') assert.equal(row.before, row.after);
      if (row.changed) assert.ok(row.costPixels || row.rulesPixels);
    }
    assert.equal(
      evidence.native.summary.changed,
      evidence.native.rows.filter((r) => r.changed).length,
    );
    assert.equal(evidence.controls.cards, 84);
    assert.equal(evidence.controls.changed, 0);
    assert.equal(evidence.controls.rows.length, 84);
    for (const row of evidence.controls.rows) assert.equal(row.before, row.sha256);
    for (const [file, expected] of Object.entries(extension.dependencies))
      assert.equal(
        hash(await readFile(file)),
        expected,
        'Unreviewed Dark mana dependency: ' + file,
      );
    return extension;
  })();
  return verified;
}

/** Keep earlier measurements attached to the exact source that produced them. */
export async function preDarkManaSource(file) {
  const bytes = await readFile(file),
    extension = await darkManaProof(),
    change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed Dark mana integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-Dark mana reconstruction failed: ' + file);
  return before;
}
