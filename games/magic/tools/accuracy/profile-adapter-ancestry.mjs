import { profileBodyProofDependency } from './body-profile-ancestry.mjs';
// Additive, exact source reconstruction for inactive optional set capabilities.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
const RECEIPT = '16fe931d3f1852b406158105ddb94ffb0bd7edf21b94bc71114a39863e251896';
let checked;
async function proof() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      'games/magic/fixtures/accuracy/early-through-fourth/profile-adapter-source-proof.json',
    );
    assert.equal(hash(bytes), RECEIPT, 'Changed optional profile-adapter receipt');
    const p = JSON.parse(bytes),
      compressed = await readFile(p.evidence.file);
    assert.equal(hash(compressed), p.evidence.sha256);
    const raw = gunzipSync(compressed);
    assert.equal(hash(raw), p.evidence.contentSha256);
    const d = JSON.parse(raw);
    assert.equal(d.base, p.base);
    assert.equal(d.rows.length, 302);
    assert.equal(new Set(d.rows.map((r) => r.id)).size, 302);
    assert(
      d.rows.every(
        (r) =>
          r.identical &&
          r.beforeHash === r.afterHash &&
          r.afterHash === r.expectedHash &&
          /^[a-f0-9]{64}$/.test(r.etchingHash),
      ),
    );
    assert.equal(d.rows.filter((r) => r.currentOriginalCost).length, 1);
    assert.deepEqual(d.metadata.before, d.metadata.after);
    assert.equal(d.metadata.after.rows.length, 15);
    assert.equal(
      d.metadata.after.rows.reduce((n, r) => n + r.count, 0),
      25200,
    );
    assert.deepEqual(d.dependencies, p.profileDependencies);
    assert.deepEqual(d.newModules, p.newModules);
    for (const [file, h] of Object.entries(p.newModules))
      assert.equal(
        hash(await readFile(file)),
        h,
        'Unreviewed early source (profile-adapter module): ' + file,
      );
    for (const [file, h] of Object.entries(p.historicalReceipts))
      assert.equal(
        hash(await readFile(file)),
        h,
        'Changed historical profile-adapter dependency: ' + file,
      );
    for (const [file, e] of Object.entries(p.files))
      assert.deepEqual({ before: e.before, after: e.after }, d.files[file]);
    return p;
  })());
}
function restore(file, bytes, p) {
  const entry = p.files[file];
  if (!entry) return { bytes, entry: undefined, changed: false };
  const digest = hash(bytes);
  if (digest === entry.before || entry.historicalHashes?.includes(digest))
    return { bytes, entry, changed: false };
  assert.equal(digest, entry.after, 'Unreviewed early source (profile-adapter): ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of entry.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), entry.before);
  return { bytes: before, entry, changed: true };
}
/** Used only to verify an immutable earlier receipt's source dependencies.
 * This does not authorize score reuse; that requires the profile scope below. */
export async function profileAdapterProofDependency(file, bytes) {
  return restore(file, await profileBodyProofDependency(file, bytes), await proof()).bytes;
}
/** The caller supplies the existing conservative profile-membership check.
 * A new/changed profile must keep current bytes and bypass older bridges. */
export async function profileAdapterSource(file, bytes, canRestore) {
  const p = await proof(),
    restored = restore(file, bytes, p);
  if (!restored.changed) return { bytes, changedProfile: false };
  return (await canRestore(p))
    ? { bytes: restored.bytes, changedProfile: false }
    : { bytes, changedProfile: true };
}

/** Verified module inventory for the native default differential gate. */
export async function profileAdapterAncestry() {
  return await proof();
}
