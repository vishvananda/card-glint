import { preRevisedBodyArtistSource } from './revised-body-artist-ancestry.mjs';
// Exact metadata-helper reconstruction, separate from current score approval.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from './common.mjs';
const receipt = '60e8e12adb0a7c193ea4049572e7f0834ad26c1c92714676ab1785c3bfbdf4f9';
let verified;
async function proof() {
  return await (verified ??= (async () => {
    const raw = await readFile(
      'games/magic/fixtures/accuracy/early-through-fourth/2ed-artist-helper-source-proof.json',
    );
    assert.equal(hash(raw), receipt);
    const p = JSON.parse(raw);
    assert.equal(hash(p.beforeSource), p.before);
    const data = JSON.parse(await readFile(p.newData.file));
    assert.equal(hash(await readFile(p.newData.file)), p.newData.sha256);
    assert.equal(p.rows.length, 195);
    assert.equal(p.summary.existingUnchanged, 182);
    assert.equal(p.summary.newExactCredits, 13);
    assert.equal(p.summary.staleScanGuards, 13);
    assert.equal(p.summary.wrongSetGuards, 13);
    const changed = p.rows.filter((r) => r.changed);
    assert.equal(changed.length, 13);
    assert.deepEqual(changed.map((r) => r.id).sort(), Object.keys(data.cards).sort());
    for (const row of p.rows) {
      if (row.changed) {
        assert.equal(row.set, '2ed');
        assert.deepEqual(row.before, {});
        assert.equal(row.after.artist, data.cards[row.id].artist);
        assert.deepEqual(row.after.reviewedFields, ['artist']);
      } else assert.deepEqual(row.before, row.after);
    }
    return p;
  })());
}
function restore(file, bytes, p) {
  if (file !== p.file) return { bytes, changed: false };
  const digest = hash(bytes);
  if (digest === p.before) return { bytes, changed: false };
  assert.equal(digest, p.after, 'Unreviewed artist-review helper source');
  return { bytes: Buffer.from(p.beforeSource), changed: true };
}
/** Pure immutable dependency reconstruction for historical differential tests.
 * This never approves changed printing inputs, profile data or score reuse. */
export async function artistReviewProofDependency(file, bytes) {
  const p = await proof();
  return restore(file, file === p.file ? await preRevisedBodyArtistSource(file, bytes) : bytes, p)
    .bytes;
}
/** Unknown/unscoped and Unlimited score paths retain the new helper identity. */
export async function artistReviewSource(file, bytes, set) {
  const p = await proof();
  const projected = file === p.file ? await preRevisedBodyArtistSource(file, bytes) : bytes;
  const code = typeof set === 'string' ? set.toLowerCase() : '';
  if (hash(projected) !== hash(bytes) && (code === 'arn' || !/^[a-z0-9]{2,8}$/.test(code)))
    return { bytes, changed: true };
  const restored = restore(file, projected, p);
  if (!restored.changed) return { bytes, changed: false };
  const unaffected = /^[a-z0-9]{2,8}$/.test(code) && code !== '2ed';
  return unaffected ? { bytes: restored.bytes, changed: false } : { bytes, changed: true };
}
