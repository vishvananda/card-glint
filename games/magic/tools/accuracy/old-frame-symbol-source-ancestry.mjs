// Scoped source-data compatibility; this never approves the changed ONS fit.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { root, hash } from './common.mjs';
const FILE = 'games/magic/fixtures/accuracy/mirage-onslaught/ons-symbol-source-review.json';
const SHA = '2a99c2dd124f5c78bac1962082347d1ac0afc2c3ee8bf6cd50bd3ffe7f5f5dbf';
let checked;
export function onslaughtSymbolSourceReview() {
  return (checked ??= (async () => {
    const bytes = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(bytes), SHA, 'Changed ONS symbol source receipt');
    const p = JSON.parse(bytes);
    assert.equal(p.kind, 'ons-symbol-contour-only');
    assert.equal(hash(p.beforeSource), p.beforeSha256);
    assert.deepEqual(p.changedSets, ['ons']);
    assert.equal(p.nativeSourceAssetConfiguration['symbol-svg-patches.json'], p.afterSha256);
    assert.deepEqual(p.changedKeys, ['ons-u', 'ons-r']);
    const after = await fs.readFile(path.join(root, p.file));
    if (hash(after) === p.afterSha256) {
      const previous = JSON.parse(p.beforeSource),
        projected = JSON.parse(after);
      projected.revision = previous.revision;
      for (const key of p.changedKeys) {
        assert(!Object.hasOwn(previous.sources, key));
        assert.equal(projected.sources[key].recipe, 'printed-paths');
        assert.equal(projected.sources[key].pathCount, 3);
        assert.deepEqual(projected.sources[key].fills, { 1: '#161612' });
        delete projected.sources[key];
      }
      assert.deepEqual(projected, previous, 'Unrelated symbol source changed');
    }
    return p;
  })());
}
export async function preOnslaughtSymbolSource(file, bytes, set) {
  if (set === 'ons' || file !== 'games/magic/symbol-svg-patches.json') return bytes;
  const p = await onslaughtSymbolSourceReview();
  return hash(bytes) === p.afterSha256 ? Buffer.from(p.beforeSource) : bytes;
}
