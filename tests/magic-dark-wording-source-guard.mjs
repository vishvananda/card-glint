import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

const manifest = JSON.parse(
  await readFile(
    new URL('../games/magic/fixtures/accuracy/dark-wording-compatibility.json', import.meta.url),
  ),
);

/** Preserve the wording catalog used by older native calibration receipts.
 * The current catalog is checked independently by magic-printing-resolver. */
export async function preDarkWordingSource(file) {
  const bytes = await readFile(file),
    change = manifest.files[file];
  if (!change) return bytes;
  const review = JSON.parse(await readFile(manifest.review.source)).cards[manifest.review.id];
  assert.equal(review.referenceHash, manifest.review.referenceHash);
  assert.deepEqual(review.reviewedFields, ['rulesText']);
  assert.equal(review.rulesText, manifest.review.rulesText);
  assert.equal(hash(bytes), change.after, 'Unreviewed wording catalog integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-Dark wording reconstruction failed: ' + file);
  return before;
}
