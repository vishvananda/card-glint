import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

let verified;
export function darkTypographyProof() {
  verified ??= (async () => {
    const extension = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-expansion-dark-type-compatibility.json'),
    );
    const bytes = await readFile(
      'games/magic/fixtures/accuracy/early-expansion-dark-typography.json',
    );
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
    assert.equal(evidence.rows.length, 7);
    for (const row of evidence.native.rows) {
      const transfer = evidence.rows.find((r) => r.id === row.id);
      assert.equal(row.changed, Boolean(transfer));
      if (transfer) {
        assert.equal(row.proposalParity, true);
        assert.equal(row.before, transfer.variants.baseline.nativeHash);
        assert.equal(row.after, transfer.variants.all.nativeHash);
        for (const variant of Object.values(transfer.variants))
          assert.equal(variant.outsideChanged, 0);
      } else assert.equal(row.before, row.after);
    }
    assert.equal(evidence.controls.cards, 84);
    assert.equal(evidence.controls.changed, 0);
    assert.equal(evidence.controls.rows.length, 84);
    for (const row of evidence.controls.rows) assert.equal(row.before, row.sha256);
    for (const [file, expected] of Object.entries(extension.dependencies))
      assert.equal(
        hash(await readFile(file)),
        expected,
        'Unreviewed Dark typography dependency: ' + file,
      );
    return extension;
  })();
  return verified;
}

/** Retain the measured 0.4.17 sources for prior frame and type receipts. */
export async function preDarkTypographySource(file) {
  const bytes = await readFile(file),
    extension = await darkTypographyProof(),
    change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed Dark typography integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-Dark typography reconstruction failed: ' + file);
  return before;
}
