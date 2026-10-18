import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

const extension = JSON.parse(
  await readFile(
    new URL('../games/magic/fixtures/accuracy/dark-body-compatibility.json', import.meta.url),
  ),
);
let verified;
export function darkBodyProof() {
  verified ??= (async () => {
    const bytes = await readFile('games/magic/fixtures/accuracy/dark-body.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.deepEqual(evidence.native.summary, {
      cards: 316,
      changed: 99,
      unchanged: 217,
      exactPrototypes: 121,
      correctedWordingPairs: 2,
    });
    assert.equal(evidence.native.rows.length, 316);
    assert.equal(evidence.prototypes.length, 121);
    for (const row of evidence.native.rows) {
      assert.equal(row.outside, 0);
      if (row.set !== 'drk') assert.equal(row.before, row.after);
      if (row.prototypeParity) {
        const p = evidence.prototypes.find((p) => p.id === row.id);
        assert.equal(row.after, p.nativeHash);
        assert.equal(p.overflow, false);
        const sizeClass = (size) => (size > 25 ? 'centered' : size < 20 ? 'compact' : 'regular');
        assert.equal(sizeClass(p.before.size), sizeClass(p.size), p.name);
      }
    }
    assert.equal(evidence.controls.cards, 84);
    assert.equal(evidence.controls.changed, 0);
    assert.equal(evidence.controls.rows.length, 84);
    for (const row of evidence.controls.rows) assert.equal(row.before, row.sha256);
    assert.equal(evidence.fullScores.rows.length, 121);
    for (const row of evidence.fullScores.rows) {
      assert.ok(row.changedComponents.every((k) => k === 'rules' || k === 'frame'));
      const native =
        evidence.native.corrected.find((r) => r.id === row.id) ??
        evidence.native.rows.find((r) => r.id === row.id);
      assert.equal(row.rawHashes.before, native.before);
      assert.equal(row.rawHashes.after, native.after);
    }
    for (const [file, expected] of Object.entries(extension.dependencies))
      assert.equal(hash(await readFile(file)), expected, 'Unreviewed body dependency: ' + file);
    const annotations = JSON.parse(await readFile(extension.wordingSource));
    for (const review of evidence.wording) {
      const current = annotations.cards[review.id];
      assert.equal(current.referenceHash, review.referenceHash);
      assert.deepEqual(current.reviewedFields, ['rulesText']);
      assert.equal(current.rulesText, review.rulesText);
    }
    return evidence;
  })();
  return verified;
}

/** Reconstruct the preceding renderer without changing historical receipts. */
export async function preDarkBodySource(file) {
  const bytes = await readFile(file),
    change = extension.files[file];
  if (!change) return bytes;
  await darkBodyProof();
  assert.equal(hash(bytes), change.after, 'Unreviewed Dark body integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-Dark body reconstruction failed: ' + file);
  return before;
}
