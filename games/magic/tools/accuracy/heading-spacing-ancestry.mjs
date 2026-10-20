import { profilePreparationSource } from './profile-preparation-ancestry.mjs';
import { preWalkerSource } from './planeswalker-reconstruction/ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from './common.mjs';
const PROOF_HASH = '3b618060de80e27cc22e7b3e55244da5a80054dcef8e992a009579af8bfdf149';
let checked;
export async function preHeadingSpacingSource(file, bytes, set) {
  const prepared = await profilePreparationSource(file, bytes, set);
  if (prepared.changedProfile) return prepared.bytes;
  bytes = prepared.bytes;
  bytes = await preWalkerSource(file, bytes);
  const proof = await (checked ??= readFile(
    'games/magic/fixtures/accuracy/heading-spacing/source-proof.json',
  ).then((bytes) => {
    assert.equal(hash(bytes), PROOF_HASH);
    return JSON.parse(bytes);
  }));
  const change = proof.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed heading spacing source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before);
  return before;
}
