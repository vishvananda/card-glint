import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

let verified;
export function earlyReprintTitleProof() {
  verified ??= (async () => {
    const extension = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-reprint-title-compatibility.json'),
    );
    const bytes = await readFile('games/magic/fixtures/accuracy/early-reprint-title.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.deepEqual(evidence.scope, {
      sets: ['fem', '4ed', 'chr'],
      cards: 690,
      scored: 683,
      excluded: 7,
      profiles: 3,
    });
    assert.deepEqual(evidence.native.summary, { cards: 690, exact: 690, outside: 0 });
    const previous = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-reprint-mana.json'),
    );
    assert.equal(evidence.native.rows.length, 690);
    assert.equal(new Set(evidence.native.rows.map((r) => r.id)).size, 690);
    const baseline = new Map(previous.native.rows.map((r) => [r.id, r.candidate]));
    for (const row of evidence.native.rows) {
      assert.equal(row.before, baseline.get(row.id));
      assert.equal(row.prototype, row.candidate);
      assert.equal(row.changedBytes, 0);
      assert.equal(row.maxDelta, 0);
      assert.equal(row.outside, 0);
      assert.ok(row.titlePixels > 0);
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
    assert.equal(evidence.provenance.captureGuards.bundleHash, previous.native.guards.prototype);
    assert.equal(evidence.provenance.captureGuards.inputHash, previous.native.guards.input);
    assert.equal(evidence.metrics.validationKind, 'reused');
    assert.equal(evidence.metrics.rows.length, 683);
    assert.equal(evidence.metrics.excluded.length, 7);
    const scoredIds = new Set(evidence.metrics.rows.map((r) => r.id));
    assert.equal(scoredIds.size, 683);
    for (const row of evidence.metrics.excluded) {
      assert.ok(baseline.has(row.id));
      assert.ok(!scoredIds.has(row.id));
    }
    for (const group of Object.values(evidence.metrics.summary))
      assert.ok(group.after > group.before);
    for (const group of Object.values(evidence.metrics.materials))
      assert.ok(group.after > group.before);
    assert.deepEqual(
      evidence.outliers.rows.map((r) => r.id).sort(),
      evidence.metrics.rows
        .filter((r) => r.after[0] < r.before[0])
        .map((r) => r.id)
        .sort(),
    );
    for (const row of Object.values(evidence.outliers.fourthDecomposition))
      assert.equal(row.reconstructedIndexDrift, 0);
    assert.deepEqual(extension.dependencies, evidence.sourceGuards);
    for (const [file, expected] of Object.entries(extension.dependencies))
      assert.equal(hash(await readFile(file)), expected, 'Unreviewed title dependency: ' + file);
    return extension;
  })();
  return verified;
}

/** Verify the scoped native title replay before recovering the exact mana-only
 * source used by historical calibration and native-host receipts. */
export async function preEarlyReprintTitleSource(file) {
  const bytes = await readFile(file),
    extension = await earlyReprintTitleProof(),
    change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed title integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-title source reconstruction failed: ' + file);
  return before;
}
