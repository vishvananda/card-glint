import { profileBodySource } from './body-profile-ancestry.mjs';
import {
  profileAdapterProofDependency,
  profileAdapterSource,
} from './profile-adapter-ancestry.mjs';
// Preserve unrelated historical receipts when optional preparation fields are inactive.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
const receipt = 'dd610d767afc6b185aa3ece79177f9a75267a0500ed628341c1d298a8e26cdba';
let verified;
async function proof() {
  return (verified ??= (async () => {
    const bytes = await readFile(
      'games/magic/fixtures/accuracy/early-through-fourth/profile-preparation-source-proof.json',
    );
    assert.equal(hash(bytes), receipt, 'Changed profile-preparation source receipt');
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
        (r) => r.identical && r.beforeHash === r.afterHash && r.afterHash === r.expectedHash,
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
    for (const [file, entry] of Object.entries(p.files))
      assert.deepEqual({ before: entry.before, after: entry.after }, d.files[file]);
    return p;
  })());
}
async function readOptional(file) {
  try {
    return await readFile(file);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return undefined;
  }
}
async function inactive(p, set, readProfile) {
  const directory = 'games/magic/src/calibration/sets/';
  // Generated scope membership distinguishes full profiles from partial title
  // overrides, and catches profiles registered under a different filename.
  const scopes = await readProfile('games/magic/src/data/scopes.ts');
  const literal = scopes
    ?.toString()
    .match(/export const profileSets: readonly string\[\] = (\[[^;]*\]);/)?.[1];
  if (!literal || !/^\[\s*(?:'[a-z0-9]{2,8}'(?:\s*,\s*'[a-z0-9]{2,8}')*\s*,?\s*)?\]$/.test(literal))
    return false;
  const active = [...literal.matchAll(/'([a-z0-9]{2,8})'/g)].map((m) => m[1]);
  if (new Set(active).size !== active.length) return false;
  if (set !== undefined) {
    const code = String(set).toLowerCase();
    if (!/^[a-z0-9]{2,8}$/.test(code)) return false;
    const file = directory + code + '.ts',
      actual = await readProfile(file),
      expected = p.profileDependencies[file];
    return expected
      ? active.includes(code) && !!actual && hash(actual) === expected
      : !active.includes(code) && actual === undefined;
  }
  // Without a set, every full profile must remain on its proven data. Partial
  // profiles such as lea-title do not activate these optional capabilities.
  const files = Object.keys(p.profileDependencies).sort();
  const expectedCodes = files.map((file) => file.slice(directory.length, -3)).sort();
  if (JSON.stringify([...active].sort()) !== JSON.stringify(expectedCodes)) return false;
  for (const file of files) {
    const actual = await readProfile(file);
    if (!actual || hash(actual) !== p.profileDependencies[file]) return false;
  }
  return true;
}
/** No fit is approved here. This only reconstructs known helper bytes for an
 * unchanged default profile. A changed/new profile retains current guards;
 * unknown helper edits reject even if a receipt marker is supplied. */
export async function profilePreparationSource(file, bytes, set, readProfile = readOptional) {
  const body = await profileBodySource(file, bytes, (p) => inactive(p, set, readProfile));
  if (body.changedProfile) return body;
  bytes = body.bytes;
  const adapted = await profileAdapterSource(file, bytes, (p) => inactive(p, set, readProfile));
  if (adapted.changedProfile) return adapted;
  bytes = adapted.bytes;
  const p = await proof(),
    entry = p.files[file];
  if (!entry || hash(bytes) === entry.before) return { bytes, changedProfile: false };
  assert.equal(hash(bytes), entry.after, 'Unreviewed profile-preparation source: ' + file);
  if (!(await inactive(p, set, readProfile))) return { bytes, changedProfile: true };
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of entry.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), entry.before);
  return { bytes: before, changedProfile: false };
}

export async function preProfilePreparationSource(file, bytes, set, readProfile = readOptional) {
  return (await profilePreparationSource(file, bytes, set, readProfile)).bytes;
}

/** Reconstruct an immutable historical painter in differential tests only.
 * This deliberately has no set-data approval semantics. Fresh/profile scores
 * must use profilePreparationSource and retain changed-profile fingerprints. */
export async function profilePreparationProofDependency(file, bytes) {
  bytes = await profileAdapterProofDependency(file, bytes);
  const p = await proof(),
    entry = p.files[file];
  if (!entry || hash(bytes) === entry.before) return bytes;
  assert.equal(hash(bytes), entry.after, 'Unreviewed historical profile helper: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of entry.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), entry.before);
  return before;
}
