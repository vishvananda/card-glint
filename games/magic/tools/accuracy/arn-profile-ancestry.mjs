// Exact source history for the ARN-only profile. Historical identity is not fit approval.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
const RECEIPT = 'b12195919bb4f674aa86b388f8c21505a5035363d84d75d4a45cf7721c833bc9';
let checked, tree;
export function arnProfileDelta() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      path.join(root, 'games/magic/fixtures/accuracy/arn-recheck/source-delta.json.gz'),
    );
    assert.equal(hash(bytes), RECEIPT, 'Changed ARN source-history receipt');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.schema, 1);
    assert.deepEqual(p.affectedSets, ['arn']);
    for (const e of Object.values(p.files)) {
      assert.match(e.after, /^[a-f0-9]{64}$/);
      if (e.beforeSource !== null) assert.equal(hash(e.beforeSource), e.before);
    }
    return p;
  })());
}
export async function preArnProfileSource(file, bytes) {
  const p = await arnProfileDelta(),
    e = p.files[file];
  if (!e || e.beforeSource === null || hash(bytes) !== e.after) return bytes;
  return Buffer.from(e.beforeSource);
}
/** Omit only exact new ARN modules from historical trees. Foreign bytes remain visible. */
export async function arnHistoricalSourceFiles(files) {
  const p = await arnProfileDelta(),
    kept = [];
  for (const file of files) {
    const key = file.startsWith('games/') ? file : path.relative(root, file);
    const e = p.files[key];
    if (e?.beforeSource === null && hash(await readFile(path.join(root, key))) === e.after)
      continue;
    kept.push(file);
  }
  return kept;
}
/** Only unaffected sets may carry a measured whole-tree identity forward. */
export async function arnProfileRuntimeCompatible(directory, expected, set) {
  if (directory !== 'games/magic/src' || !set || set.toLowerCase() === 'arn') return false;
  const p = await arnProfileDelta();
  if (expected !== p.beforeRenderer) return false;
  tree ??= (async () => {
    if ((await sourceHash(path.join(root, directory))) !== p.afterRenderer) return false;
    const c = JSON.parse(gunzipSync(await readFile(path.join(root, p.controls.file))));
    assert.equal(hash(JSON.stringify(c)), p.controls.contentHash);
    assert.equal(c.status, 'complete');
    assert.equal(c.rendererHash, p.afterRenderer);
    assert.equal(c.rows.length, 1001);
    assert.deepEqual(c.faults, []);
    assert.equal(new Set(c.rows.map((r) => r.id)).size, 1001);
    for (const r of c.rows) assert.equal(r.before, r.after, 'Changed unaffected printing ' + r.id);
    return true;
  })();
  return tree;
}

/** A historical dependency projection cannot validate the changed ARN profile. */
export function arnProfileAffected(set, task, original = false, group) {
  if (set?.toLowerCase() !== 'arn') return false;
  if (original || task === 'references') {
    if (original && task !== 'rules') return false;
    const corrected = [
      '9598b346-a47d-4c4c-9571-156824e86b9c',
      '4d3dce0f-2168-4f63-b2f9-156a11beeea7',
    ];
    return (
      !Array.isArray(group?.printingIds) || group.printingIds.some((id) => corrected.includes(id))
    );
  }
  return task !== 'normalization';
}
