import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../common.mjs';
let checked;
/** Historical bytes only. Changed planeswalkers and M15 symbols never reuse scores. */
export async function preWalkerGeometry(file, bytes) {
  const proof = await (checked ??= readFile(
    'games/magic/fixtures/accuracy/planeswalker-materials/geometry-proof.json',
  ).then(async (b) => {
    assert.equal(hash(b), '2a4b8ed0e965015d7d9f04021ef3b6d232d32132efc64565a0e0cd267ec2c490');
    const p = JSON.parse(b);
    for (const [name, digest] of Object.entries(p.dependencies))
      assert.equal(hash(await readFile(name)), digest, 'Changed reviewed walker geometry: ' + name);
    const native = await readFile(p.nativeGeometry.file);
    assert.equal(hash(native), p.nativeGeometry.sha256);
    assert(JSON.parse(native).nativeControls.every((r) => r.outsideHeadingAndSymbolSlots === 0));
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

/** New modules have no pre-geometry ancestor. Verify their complete current
 * bytes through the same frozen proof before excluding them from old inventories. */
export async function walkerGeometryModules() {
  await preWalkerGeometry('', Buffer.alloc(0));
  const proof = await checked;
  return Object.keys(proof.dependencies).filter((file) => !Object.hasOwn(proof.files, file));
}
