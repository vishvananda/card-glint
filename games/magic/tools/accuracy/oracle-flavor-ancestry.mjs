import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from './common.mjs';

const receipt = 'f266e8a70aac18a8bfd3b047f3d0b77e10f5001854add21b804fb9960cdf460a';
let checked;
export function oracleFlavorAncestryProof() {
  return (checked ??= (async () => {
    const bytes = await readFile('games/magic/fixtures/accuracy/oracle-flavor-ancestry.json');
    assert.equal(hash(bytes), receipt, 'Changed Oracle flavor compatibility receipt');
    const proof = JSON.parse(bytes);
    assert.equal(hash(await readFile(proof.addition.file)), proof.addition.sha256);
    return proof;
  })());
}
/** Exact prior source for default-selection tests; no current render approval. */
export async function preOracleFlavorSource(file, bytes) {
  const change = (await oracleFlavorAncestryProof()).files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed Oracle flavor API source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const prior = Buffer.from(lines.join(''));
  assert.equal(hash(prior), change.before, 'Oracle flavor source reconstruction: ' + file);
  return prior;
}
