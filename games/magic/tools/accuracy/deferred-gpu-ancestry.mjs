// Exact browser preparation ancestry for historical flat Canvas2D receipts.
// Live renderer and scoring identities always retain their current source.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
import { preSoftwareFinishSource } from './software-finish-ancestry.mjs';
const file = 'games/magic/fixtures/accuracy/deferred-gpu/review.json.gz';
const digest = '5664fe13aec241181a9323ce0c2a15d390cd5c3cac6d74cb19fd3a4f5fd3b8f1';
let checked;
export function deferredGpuProof() {
  return (checked ??= (async () => {
    const bytes = await readFile(file);
    assert.equal(hash(bytes), digest, 'Changed deferred GPU review');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'deferred-gpu-preparation');
    assert.equal(p.scope, 'exact-browser-only-parent-for-historical-flat-canvas-evidence');
    assert.equal(Object.keys(p.files).length, 10);
    for (const [file, e] of Object.entries(p.files)) {
      assert(file.startsWith('packages/browser/src/'), 'GPU review cannot approve a game painter');
      assert.equal(hash(e.beforeSource), e.before);
      assert.match(e.after, /^[a-f0-9]{64}$/);
    }
    assert.equal(p.native.rows.length, 40);
    for (const row of p.native.rows) assert.equal(row.max, 0, 'Changed native finish pixels');
    assert.equal(
      new Set(p.native.rows.map((r) => [r.finish, r.hologram, r.print].join(':'))).size,
      40,
    );
    assert.equal(p.native.warmCompiles, 0);
    assert.equal(p.coverage.rowOrder, 'bottom-up');
    assert.equal(p.coverage.pixelPackBuffer, true);
    assert.equal(p.coverage.cancellationAndRetry, true);
    return p;
  })());
}
export async function preDeferredGpuSource(file, bytes) {
  bytes = await preSoftwareFinishSource(file, bytes);
  const e = (await deferredGpuProof()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
