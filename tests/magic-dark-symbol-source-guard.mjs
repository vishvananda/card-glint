import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

let verified;
export function darkSymbolProof() {
  verified ??= (async () => {
    const extension = JSON.parse(
      await readFile(
        'games/magic/fixtures/accuracy/early-expansion-dark-symbol-compatibility.json',
      ),
    );
    const bytes = await readFile('games/magic/fixtures/accuracy/early-expansion-dark-symbols.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.deepEqual(evidence.native.summary, {
      cards: 316,
      changed: 122,
      unchanged: 194,
      exactPrototypes: 122,
      outsideChanged: 0,
    });
    assert.equal(evidence.native.rows.length, 316);
    assert.equal(evidence.rows.length, 122);
    for (const row of evidence.native.rows) {
      assert.equal(row.changed, row.set === 'drk');
      if (row.changed) {
        const proposal = evidence.rows.find((r) => r.id === row.id);
        assert.equal(row.proposalParity, true);
        assert.equal(row.after, proposal.nativeHash);
        assert.equal(row.isolation.before, row.isolation.after);
        assert.equal(row.isolation.outsideChanged, 0);
        assert.ok(row.isolation.changedPixels > 0);
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
        'Unreviewed Dark symbol dependency: ' + file,
      );
    return extension;
  })();
  return verified;
}

/** Reconstruct the measured 0.4.18 source, including pinned SVG preparation
 * metadata. Historical typography/frame evidence never inherits new pixels. */
export async function preDarkSymbolSource(file) {
  const bytes = await readFile(file),
    extension = await darkSymbolProof(),
    change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed Dark symbol integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-Dark symbol reconstruction failed: ' + file);
  return before;
}
