import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../common.mjs';
let checked;
/** Historical bytes only. Changed planeswalkers and M15 symbols never reuse scores. */
export async function preWalkerGeometry(file, bytes) {
  const proof = await (checked ??= readFile(
    'games/magic/fixtures/accuracy/planeswalker-materials/geometry-proof.json',
  ).then(async (b) => {
    assert.equal(hash(b), '198411929369236eebb6a0a473ef2f71c1adb46f5d8347fc11b1fff42160a8f4');
    const p = JSON.parse(b);
    for (const [name, digest] of Object.entries(p.dependencies))
      assert.equal(hash(await readFile(name)), digest, 'Changed reviewed walker geometry: ' + name);
    return p;
  }));
  const entry = proof.files[file];
  if (!entry) return bytes;
  assert.equal(hash(bytes), entry.after);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of entry.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const result = Buffer.from(lines.join(''));
  assert.equal(hash(result), entry.before);
  return result;
}
