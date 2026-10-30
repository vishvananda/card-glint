import { preFontGeometrySource } from '../font-geometry-ancestry.mjs';
import { preWalkerGeometry } from './geometry-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../common.mjs';
let checked;
/** Historical receipt reconstruction only. Never reuse changed planeswalker scores. */
export async function walkerAncestry() {
  return await (checked ??= readFile(
    'games/magic/fixtures/accuracy/planeswalker-materials/source-proof.json',
  ).then(async (bytes) => {
    assert.equal(hash(bytes), '0b6370dd58b91c66c3245d476efee3a67aa4466c2001530a875261d2d8f2f41a');
    const proof = JSON.parse(bytes);
    for (const [file, digest] of Object.entries(proof.dependencies))
      assert.equal(
        hash(await preWalkerGeometry(file, await readFile(file))),
        digest,
        'Changed planeswalker source: ' + file,
      );
    const nativeBytes = await readFile(proof.native.file);
    assert.equal(hash(nativeBytes), proof.native.sha256, 'Changed planeswalker native replay');
    const native = JSON.parse(nativeBytes);
    assert(native.records.every((r) => r.outsideScope === 0));
    assert(
      native.summary
        .filter((r) => r.component === 'background')
        .every((r) => r.means.candidate < r.means.released),
    );
    return proof;
  }));
}
export async function preWalkerSource(file, bytes) {
  bytes = await preFontGeometrySource(file, bytes);
  bytes = await preWalkerGeometry(file, bytes);
  const proof = await walkerAncestry();
  const c = proof.files[file];
  if (!c) return bytes;
  assert.equal(hash(bytes), c.after, 'Unreviewed planeswalker material source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const e of c.reverseEdits) lines.splice(e.start, e.count, ...e.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), c.before);
  return before;
}
