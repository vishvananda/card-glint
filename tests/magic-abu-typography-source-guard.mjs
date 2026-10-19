import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const proof = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/abu-typography-compatibility.json'),
);
let verified;
async function verify() {
  verified ??= (async () => {
    const bytes = await readFile('games/magic/fixtures/accuracy/' + proof.evidence);
    assert.equal(hash(bytes), proof.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, proof.baselineCommit);
    assert.equal(evidence.native.cards, 295);
    assert.equal(evidence.native.rows.length, 295);
    assert.equal(new Set(evidence.native.rows.map((r) => r.id)).size, 295);
    for (const row of evidence.native.rows) {
      assert.equal(row.outside, 0);
      assert.equal(row.silhouette, 0);
      assert.equal(row.bodyChanged, 0);
      assert.match(row.bodyExpectedHash, /^[a-f0-9]{64}$/);
    }
    const controls = await readFile(
      'games/magic/fixtures/accuracy/lea/typography-control-replay.json',
    );
    assert.equal(hash(controls), evidence.controlsHash);
    const parsed = JSON.parse(controls);
    assert.equal(parsed.rendererHash, evidence.rendererHash);
    assert.equal(parsed.cards, 70);
    assert.equal(parsed.changed, 0);
    assert.equal(parsed.rows.length, 70);
    for (const row of parsed.rows) assert.equal(row.before, row.after);
    for (const [file, digest] of Object.entries(proof.dependencies))
      assert.equal(
        hash(await readFile(file)),
        digest,
        'Unreviewed Alpha typography dependency: ' + file,
      );
  })();
  return verified;
}
/** Preserve the exact released source behind older calibration evidence. */
export async function preAbuTypographySource(file) {
  const bytes = await readFile(file),
    change = proof.files[file];
  if (!change) return bytes;
  await verify();
  assert.equal(hash(bytes), change.after, 'Unreviewed Alpha typography integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-Alpha typography reconstruction failed: ' + file);
  return before;
}
