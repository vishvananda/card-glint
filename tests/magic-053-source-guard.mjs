import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { preAbuTypographySource } from './magic-abu-typography-source-guard.mjs';
const proof = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/release-0-5-3-compatibility.json'),
);
let verified;
/** Keep prior calibration receipts bound to the exact pre-0.5.3 layout source. */
export async function pre053Source(file) {
  verified ??= (async () => {
    assert.equal(
      hash(await readFile('games/magic/fixtures/accuracy/lea/shared-text-promotion.json')),
      proof.evidenceHash,
    );
    for (const [name, sha] of Object.entries(proof.dependencies))
      assert.equal(
        hash(await preAbuTypographySource(name)),
        sha,
        'Unreviewed 0.5.3 rendering source: ' + name,
      );
  })();
  await verified;
  const bytes = await preAbuTypographySource(file),
    change = proof.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed 0.5.3 rendering integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-0.5.3 rendering reconstruction: ' + file);
  return before;
}
