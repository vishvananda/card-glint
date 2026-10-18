import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { preEarlyReprintTypeSource } from './magic-early-reprint-type-source-guard.mjs';

let verified;
export function earlyReprintWordingProof() {
  verified ??= (async () => {
    const extension = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-reprint-wording-compatibility.json'),
    );
    const bytes = await readFile('games/magic/fixtures/accuracy/early-reprint-wording.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.deepEqual(evidence.scope, {
      sets: ['fem', '4ed', 'chr'],
      cards: 690,
      types: 690,
      newBodies: 27,
      newArtists: 3,
      newCosts: 1,
    });
    assert.equal(evidence.rows.length, 690);
    assert.equal(new Set(evidence.rows.map((r) => r.id)).size, 690);
    for (const [file, expected] of Object.entries({
      ...evidence.annotations,
      ...extension.dependencies,
    }))
      assert.equal(hash(await readFile(file)), expected, 'Unreviewed wording dependency: ' + file);
    for (const [file, change] of Object.entries(extension.files))
      assert.equal(
        hash(await preEarlyReprintTypeSource(file)),
        change.after,
        'Unreviewed wording catalog: ' + file,
      );
    return extension;
  })();
  return verified;
}

/** Catalog changes are checked separately from typography. Preserve the exact
 * catalog bytes used by every earlier calibration/native compatibility receipt. */
export async function preEarlyReprintWordingSource(file) {
  const bytes = await preEarlyReprintTypeSource(file),
    extension = await earlyReprintWordingProof();
  const change = extension.files[file];
  if (!change) return bytes;
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-wording catalog reconstruction failed: ' + file);
  return before;
}
