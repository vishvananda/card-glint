import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const proof = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/abu-release-compatibility.json'),
);
let verified;
async function verify() {
  verified ??= (async () => {
    const bytes = await readFile('games/magic/fixtures/accuracy/' + proof.evidence);
    assert.equal(hash(bytes), proof.evidenceHash);
    const data = JSON.parse(bytes);
    assert.equal(data.baselineCommit, proof.baselineCommit);
    for (const [set, total] of [
      ['lea', 295],
      ['leb', 302],
    ]) {
      const d = data.sets[set];
      assert.equal(d.cards, total);
      assert.equal(d.rows.length, total);
      assert.equal(new Set(d.rows.map((r) => r.id)).size, total);
      for (const r of d.rows) {
        assert.equal(r.outside, 0);
        assert.equal(r.silhouette, 0);
        assert.equal(r.artworkChanged, 0);
      }
    }
  })();
  return verified;
}
/** Keep historical calibration evidence bound to its original source graph. */
export async function preAbuReleaseSource(file) {
  const bytes = await readFile(file),
    change = proof.files[file];
  if (!change) return bytes;
  await verify();
  assert.equal(hash(bytes), change.after, 'Unreviewed ABU release source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const old = Buffer.from(lines.join(''));
  assert.equal(hash(old), change.before);
  return old;
}
