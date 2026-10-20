import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from './common.mjs';
const PROOF_HASH = '991257a7887ae9c935d1b480a5210d0f0bdd7ef8f9e9187f9a8798b9b8830148';
let checked;
export async function preHeadingSpacingSource(file, bytes) {
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
