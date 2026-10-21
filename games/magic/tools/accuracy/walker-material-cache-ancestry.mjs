// Reconstruct historical receipts only. Never alias changed host pixels or fits.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
let verified;
export async function walkerMaterialCacheProof() {
  return (verified ??= (async () => {
    const bytes = await readFile(
      'games/magic/fixtures/accuracy/planeswalker-materials/cache-source-proof.json',
    );
    assert.equal(
      hash(bytes),
      '1953243258d0933a555f57a2c50c6b92f0defa7f49c01b021378c97aaca3a1c7',
      'Changed walker cache-source receipt',
    );
    const proof = JSON.parse(bytes);
    for (const [file, entry] of Object.entries(proof.files))
      assert.equal(
        hash(await readFile(file)),
        entry.after,
        'Unreviewed walker cache dependency: ' + file,
      );
    const compressed = await readFile(proof.native.file);
    assert.equal(hash(compressed), proof.native.sha256);
    const raw = gunzipSync(compressed);
    assert.equal(hash(raw), proof.native.contentSha256);
    const data = JSON.parse(raw);
    assert.equal(data.summary.printings, 297);
    assert.equal(data.summary.identicalLayers, 594);
    assert.equal(data.summary.faults, 0);
    assert.equal(data.rows.length, 297);
    assert.equal(new Set(data.rows.map((r) => r.id)).size, 297);
    assert(
      data.rows.every((r) =>
        ['face', 'etching'].every(
          (k) => r.layers[k].identical && r.layers[k].before === r.layers[k].after,
        ),
      ),
    );
    assert.equal(data.synthetic.browserRows.length, 6);
    assert.deepEqual(data.synthetic.browserRows, data.synthetic.workerRows);
    assert(data.synthetic.browserRows.every((r) => r.before !== r.after));
    return proof;
  })());
}
export async function preWalkerMaterialCacheSource(file, bytes) {
  const proof = await walkerMaterialCacheProof(),
    entry = proof.files[file];
  if (!entry || hash(bytes) === entry.before) return bytes;
  assert.equal(hash(bytes), entry.after, 'Unreviewed walker cache source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of entry.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const result = Buffer.from(lines.join(''));
  assert.equal(hash(result), entry.before);
  return result;
}
