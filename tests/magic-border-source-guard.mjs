import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

const extension = JSON.parse(
  await readFile(new URL('./magic-border-sources.json', import.meta.url)),
);

/** Historical receipts retain their measured sources. Actual omitted-border
 * defaults are compared to the baseline renderer by magic-border-thickness.mjs. */
export async function preBorderSource(file) {
  const bytes = await readFile(file);
  const change = extension.files[file];
  if (!change) return bytes;
  for (const [dependency, expected] of Object.entries(extension.dependencies))
    assert.equal(
      hash(await readFile(dependency)),
      expected,
      'Unreviewed border dependency: ' + dependency,
    );
  assert.equal(hash(bytes), change.after, 'Unreviewed border integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-border source reconstruction failed: ' + file);
  return before;
}
