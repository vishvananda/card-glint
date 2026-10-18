import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { preEarlyReprintTitleSource } from './magic-early-reprint-title-source-guard.mjs';

let verified;
export function earlyReprintManaProof() {
  verified ??= (async () => {
    const extension = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-reprint-mana-compatibility.json'),
    );
    const bytes = await readFile('games/magic/fixtures/accuracy/early-reprint-mana.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.deepEqual(evidence.scope, {
      sets: ['fem', '4ed', 'chr'],
      cards: 690,
      geometryProfiles: 3,
      paperProfiles: 18,
      inkProfiles: 3,
    });
    assert.deepEqual(evidence.native.summary, { cards: 690, exact: 690, outside: 0 });
    const previous = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-reprint-frame-color.json'),
    );
    assert.equal(evidence.native.rows.length, 690);
    assert.equal(new Set(evidence.native.rows.map((r) => r.id)).size, 690);
    const baseline = new Map(previous.native.rows.map((r) => [r.id, r.integrated]));
    for (const row of evidence.native.rows) {
      assert.equal(row.before, baseline.get(row.id));
      assert.equal(row.prototype, row.candidate);
      assert.equal(row.changedBytes, 0);
      assert.equal(row.maxDelta, 0);
      assert.equal(row.outside, 0);
    }
    assert.equal(evidence.controls.cards, 98);
    assert.equal(evidence.controls.changed, 0);
    assert.equal(evidence.controls.rows.length, 98);
    const controls = new Map(previous.controls.rows.map((r) => [r.id, r.sha256]));
    assert.equal(new Set(evidence.controls.rows.map((r) => r.id)).size, 98);
    for (const row of evidence.controls.rows) {
      assert.equal(row.before, controls.get(row.id));
      assert.equal(row.before, row.sha256);
    }
    assert.equal(evidence.rendererHash, evidence.controls.sourceHashes[1]);
    assert.equal(evidence.rendererHash, evidence.native.guards.sourceHash);
    assert.deepEqual(extension.dependencies, evidence.sourceGuards);
    for (const [file, expected] of Object.entries(extension.dependencies))
      assert.equal(
        hash(await preEarlyReprintTitleSource(file)),
        expected,
        'Unreviewed mana dependency: ' + file,
      );
    return extension;
  })();
  return verified;
}

/** Keep historical measurements attached to their exact frame-only source.
 * The scoped native replay must pass before this ancestry is reconstructed. */
export async function preEarlyReprintManaSource(file) {
  const bytes = await preEarlyReprintTitleSource(file),
    extension = await earlyReprintManaProof(),
    change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed mana integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-mana source reconstruction failed: ' + file);
  return before;
}
