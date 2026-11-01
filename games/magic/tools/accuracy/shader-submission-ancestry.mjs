// Exact scheduling-only parent for historical flat Canvas2D receipts.
// Current renderer/scoring identities still contain the actual current source.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
let checked;
export function shaderSubmissionProof() {
  return (checked ??= (async () => {
    const bytes = await readFile('games/magic/fixtures/accuracy/shader-submission/review.json.gz');
    assert.equal(hash(bytes), '1468bb0d404937ea64e31e9b50fa907359d06f30bd1247cc293caa5af51d149d');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'bounded-angle-metal-link-completion');
    assert.equal(p.scope, 'exact-browser-only-parent-for-historical-flat-canvas-evidence');
    assert.deepEqual(Object.keys(p.files), ['packages/browser/src/gpu/etcher.js']);
    for (const e of Object.values(p.files)) {
      assert.equal(hash(e.beforeSource), e.before);
      assert.match(e.after, /^[a-f0-9]{64}$/);
    }
    assert.equal(p.native.rows.length, 40);
    for (const row of p.native.rows) assert.equal(row.max, 0, 'Changed native finish pixels');
    assert.equal(p.native.warmCompiles, 0);
    return p;
  })());
}
export async function preShaderSubmissionSource(file, bytes) {
  const e = (await shaderSubmissionProof()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
