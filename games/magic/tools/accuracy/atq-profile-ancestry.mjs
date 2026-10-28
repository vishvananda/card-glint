import { oldFrameHistoricalSourceFiles } from './old-frame-source-ancestry.mjs';
import {
  preRevisedWordingSource,
  revisedWordingRuntimeCompatible,
} from './revised-wording-ancestry.mjs';
// Exact ATQ source history authenticates older measurements, never changed fits.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
const RECEIPT = '0acf3cdd9f7521684a50f2e639540de4287efd769fece4bc21d7d52dda44c0b2';
let checked, tree;
export function atqProfileDelta() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      path.join(root, 'games/magic/fixtures/accuracy/atq-recheck/source-delta.json.gz'),
    );
    assert.equal(hash(bytes), RECEIPT, 'Changed ATQ source-history receipt');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.schema, 1);
    assert.deepEqual(p.affectedSets, ['atq']);
    for (const e of Object.values(p.files)) {
      assert.match(e.after, /^[a-f0-9]{64}$/);
      if (e.beforeSource !== null) assert.equal(hash(e.beforeSource), e.before);
    }
    return p;
  })());
}
export async function preAtqProfileSource(file, bytes) {
  bytes = await preRevisedWordingSource(file, bytes);
  const e = (await atqProfileDelta()).files[file];
  return e && e.beforeSource !== null && hash(bytes) === e.after
    ? Buffer.from(e.beforeSource)
    : bytes;
}
/** Omit only the exact added profile. Unknown additions remain in the tree. */
export async function atqHistoricalSourceFiles(files) {
  const p = await atqProfileDelta(),
    kept = [];
  for (const file of await oldFrameHistoricalSourceFiles(files)) {
    const key = file.startsWith('games/') ? file : path.relative(root, file);
    const e = p.files[key];
    if (e?.beforeSource === null && hash(await readFile(path.join(root, key))) === e.after)
      continue;
    kept.push(file);
  }
  return kept;
}
export async function atqProfileHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        (await atqHistoricalSourceFiles(files)).map(async (file) => [
          path.relative(directory, file),
          hash(await preAtqProfileSource(path.relative(root, file), await readFile(file))),
        ]),
      ),
    ),
  );
}
/** A measured unchanged tree may reuse older identities for unaffected sets only. */
export async function atqProfileRuntimeCompatible(directory, expected, set) {
  if (directory !== 'games/magic/src' || !set || ['atq', '3ed'].includes(set.toLowerCase()))
    return false;
  const p = await atqProfileDelta();
  if (expected !== p.beforeRenderer) return false;
  tree ??= (async () => {
    if (
      (await sourceHash(path.join(root, directory))) !== p.afterRenderer &&
      !(await revisedWordingRuntimeCompatible(directory, p.afterRenderer, set))
    )
      return false;
    const z = await readFile(path.join(root, p.controls.file));
    assert.equal(hash(z), p.controls.sha256);
    const c = JSON.parse(gunzipSync(z));
    assert.equal(hash(JSON.stringify(c)), p.controls.contentHash);
    assert.equal(c.status, 'complete');
    assert.equal(c.rendererHash, p.afterRenderer);
    assert.equal(c.rows.length, 991);
    assert.equal(new Set(c.rows.map((r) => r.id)).size, 991);
    assert.deepEqual([...new Set(c.rows.map((r) => r.set))].sort(), ['2ed', 'arn', 'lea', 'leb']);
    assert.deepEqual(c.faults, []);
    for (const r of c.rows) assert.equal(r.before, r.after, 'Changed unaffected printing ' + r.id);
    return true;
  })();
  return tree;
}
export function atqProfileAffected(set, task, original = false) {
  return (
    set?.toLowerCase() === 'atq' && !original && !['normalization', 'references'].includes(task)
  );
}
