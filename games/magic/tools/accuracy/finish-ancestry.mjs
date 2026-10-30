import { preDeferredGpuSource } from './deferred-gpu-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from './common.mjs';

// Reconstruct only the exact reviewed finish revision for historical flat-face
// receipts. Current scores retain current identities; future edits fail closed.
const receipt = '667a8693b667d5a3f854a63a33e2c2e5334992ecbb372971656182bf3d03f162';
let checked;
export function finishAncestryProof() {
  return (checked ??= (async () => {
    const bytes = await readFile('games/magic/fixtures/accuracy/finish-0610-ancestry.json');
    assert.equal(hash(bytes), receipt, 'Changed finish ancestry receipt');
    const proof = JSON.parse(bytes);
    assert.equal(proof.scope, 'finish-only-outside-flat-canvas-calibration');
    for (const file of Object.keys(proof.files))
      assert(
        file.startsWith('packages/browser/src/'),
        'Finish receipt cannot approve a game painter',
      );
    return proof;
  })());
}
export async function preFinishSource(file, bytes) {
  bytes = await preDeferredGpuSource(file, bytes);
  const change = (await finishAncestryProof()).files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed finish source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Finish ancestry reconstruction failed: ' + file);
  return before;
}
