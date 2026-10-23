import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from './common.mjs';
export const NORMALIZATION_CENSUS_REVIEW =
  'games/magic/fixtures/accuracy/m21/normalization-census-compatibility.json';
const RECEIPT = '33aaeeea86972bf44af8ddf6a88190823b7b91847752e69e957fe02079e5610a';
let checked;
export function normalizationCensusReview() {
  return (checked ??= (async () => {
    const bytes = await readFile(NORMALIZATION_CENSUS_REVIEW);
    assert.equal(hash(bytes), RECEIPT, 'Changed normalization census review');
    const proof = JSON.parse(bytes);
    assert.equal(
      hash(await readFile(proof.file)),
      proof.after,
      'Unreviewed normalization census checker',
    );
    return { ...proof, sha256: hash(bytes) };
  })());
}
/** Exact reconstruction only. Actual group/reference finishes are never rewritten. */
export async function preNormalizationCensusSource(file, bytes) {
  const p = await normalizationCensusReview();
  if (file !== p.file || hash(bytes) === p.before) return bytes;
  assert.equal(hash(bytes), p.after, 'Unreviewed normalization census checker');
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const e of p.reverseEdits) lines.splice(e.start, e.count, ...e.lines);
  const prior = Buffer.from(lines.join(''));
  assert.equal(hash(prior), p.before);
  return prior;
}
