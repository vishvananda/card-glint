import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { preDarkCalibrationSource } from './magic-dark-source-guard.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

let verified;
export function statsCalibrationProof() {
  verified ??= (async () => {
    const extension = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-expansion-stats-compatibility.json'),
    );
    const bytes = await readFile('games/magic/fixtures/accuracy/early-expansion-stats.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.deepEqual(evidence.native.summary, {
      cards: 316,
      eligible: 144,
      exactNative: 141,
      changed: 144,
      outsideChanged: 0,
    });
    assert.equal(evidence.hostBaseline.cards, 316);
    assert.equal(evidence.hostBaseline.changed, 0);
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
      assert.equal(hash(await readFile(file)), expected, 'Unreviewed stats dependency: ' + file);
    return extension;
  })();
  return verified;
}

/** Replay the measured stats-only update before evaluating earlier host/default
 * compatibility. Historical scan receipts keep their original measured hashes. */
export async function preStatsCalibrationSource(file) {
  const bytes = await preDarkCalibrationSource(file),
    extension = await statsCalibrationProof(),
    change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed stats integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-stats source reconstruction failed: ' + file);
  return before;
}
