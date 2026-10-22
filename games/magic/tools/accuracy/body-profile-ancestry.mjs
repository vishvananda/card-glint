import { preM21StyleSource } from './m21-style-ancestry.mjs';
// Exact default/candidate pixel equivalence for scoped rules reflow metadata.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
const RECEIPT = 'e4a3d79cd626974ea8cc3ab3cc875c286e732f6d37cd9d834adc3880360bf611';
let checked;
async function proof() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      'games/magic/fixtures/accuracy/early-through-fourth/body-profile-source-proof.json',
    );
    assert.equal(hash(bytes), RECEIPT);
    const p = JSON.parse(bytes),
      compressed = await readFile(p.evidence.file);
    assert.equal(hash(compressed), p.evidence.sha256);
    const raw = gunzipSync(compressed);
    assert.equal(hash(raw), p.evidence.contentSha256);
    const d = JSON.parse(raw);
    assert.equal(d.base, p.base);
    assert.equal(d.rows.length, 302);
    assert.equal(new Set(d.rows.map((r) => r.id)).size, 302);
    for (const r of d.rows) {
      assert.equal(r.identical, true);
      assert.deepEqual(r.beforeCurrent, r.afterCurrent);
      assert.deepEqual(r.beforeCandidate, r.afterCandidate);
      for (const hash of Object.values({ ...r.beforeCurrent, ...r.beforeCandidate }))
        assert.match(hash, /^[a-f0-9]{64}$/);
    }
    assert.deepEqual(d.dependencies, p.profileDependencies);
    assert.deepEqual(d.newModules, p.newModules);
    assert.deepEqual(d.positiveControl, p.positiveControl);
    assert.equal(p.positiveControl.cases, 4);
    assert.equal(p.positiveControl.scaledCases, 3);
    assert.equal(p.positiveControl.verticalDelta, 0.5);
    assert(p.positiveControl.exceptionCleanup && p.positiveControl.nestingCleanup);
    for (const [file, h] of Object.entries(p.newModules))
      assert.equal(hash(await readFile(file)), h, 'Unreviewed early source (body module): ' + file);
    for (const [file, h] of Object.entries(p.historicalReceipts))
      assert.equal(hash(await readFile(file)), h, 'Changed historical body receipt: ' + file);
    for (const [file, e] of Object.entries(p.files))
      assert.deepEqual({ before: e.before, after: e.after }, d.files[file]);
    return p;
  })());
}
function restore(file, bytes, p) {
  const e = p.files[file];
  if (!e) return { bytes, changed: false };
  const digest = hash(bytes);
  if (digest === e.before || e.historicalHashes?.includes(digest)) return { bytes, changed: false };
  assert.equal(digest, e.after, 'Unreviewed early source (body profile): ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of e.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), e.before);
  return { bytes: before, changed: true };
}
/** Immutable proof dependency reconstruction only; never approves score reuse. */
export async function profileBodyProofDependency(file, bytes) {
  return restore(file, await preM21StyleSource(file, bytes), await proof()).bytes;
}
export async function profileBodySource(file, bytes, canRestore) {
  const p = await proof(),
    r = restore(file, await preM21StyleSource(file, bytes), p);
  if (!r.changed) return { bytes, changedProfile: false };
  return (await canRestore(p))
    ? { bytes: r.bytes, changedProfile: false }
    : { bytes, changedProfile: true };
}
export async function profileBodyAncestry() {
  return await proof();
}
