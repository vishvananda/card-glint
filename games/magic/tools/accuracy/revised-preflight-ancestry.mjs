// Revised layout labels are not printing corrections. The input-builder change
// is guarded to set === '3ed'; this exact projection is only used by the
// Unlimited historical certifier, never by a renderer or an unknown set.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
export const REVISED_PREFLIGHT_REVIEW =
  'games/magic/fixtures/accuracy/early-through-fourth/revised-preflight-compatibility.json.gz';
const RECEIPT = '3021097006fc61020d3161e58ce294a1123621b7466544d25fd11df5cec4cee6';
let checked;
export function revisedPreflightReview() {
  return (checked ??= (async () => {
    const bytes = await readFile(REVISED_PREFLIGHT_REVIEW);
    assert.equal(hash(bytes), RECEIPT, 'Changed Revised preflight review');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.schema, 1);
    assert.equal(p.affectedSet, '3ed');
    assert.equal(p.certifierSet, '2ed');
    assert.equal(hash(p.beforeSource), p.before);
    assert.equal(p.beforeSource.split(p.anchor).length, 2);
    assert(p.insertion.includes("set === '3ed' &&"));
    assert.equal(hash(p.beforeSource.replace(p.anchor, p.insertion)), p.after);
    return { ...p, sha256: hash(bytes) };
  })());
}
export async function preRevisedPreflightSource(file, bytes) {
  const p = await revisedPreflightReview();
  if (file !== p.file || hash(bytes) === p.before) return bytes;
  assert.equal(hash(bytes), p.after, 'Unreviewed Revised input-builder change');
  return Buffer.from(p.beforeSource);
}
