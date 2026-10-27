import { preFourthParagraphSource } from './fourth-paragraph-ancestry.mjs';
// Strict, exact-source ancestry for the reviewed Fourth nonland size classes.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
import { validateFourthNonlandData } from './fourth-nonland-data-check.mjs';
const FILE = 'games/magic/fixtures/accuracy/4ed/nonland-source-delta.json.gz';
const RECEIPT = '23bb824a01b8b7dd83431ad65aab7540c26199cd3972a9c0ae24c0389386f13e';
let checked;
export function fourthNonlandDelta() {
  return (checked ??= (async () => {
    const z = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(z), RECEIPT);
    const p = JSON.parse(gunzipSync(z));
    assert.deepEqual(validateFourthNonlandData(p), p.summary);
    const nz = await fs.readFile(path.join(root, p.native.file));
    assert.equal(hash(nz), p.native.sha256);
    const raw = gunzipSync(nz);
    assert.equal(hash(raw), p.native.contentSha256);
    const n = JSON.parse(raw);
    assert.equal(n.status, 'complete-native-fourth-nonland-isolation');
    assert.equal(n.beforeRenderer, p.beforeRenderer);
    assert.equal(n.afterRenderer, p.afterRenderer);
    assert.equal(n.originals, 378);
    assert.equal(n.nativeVariants, 1512);
    assert.deepEqual(n.ids, p.ids);
    assert.equal(n.rows.length, 378);
    assert.equal(new Set(n.rows.map((r) => r.id)).size, 378);
    for (const [mode, changed] of Object.entries({
      original: 37,
      oracle: 106,
      'oracle-modern': 106,
      etching: 0,
    }))
      assert.deepEqual(n.counts[mode], { changed, unchanged: 378 - changed, keysChanged: 378 });
    assert.equal(n.rows.filter((r) => r.land).length, 18);
    for (const r of n.rows) {
      assert.equal(r.scoped, p.ids.includes(r.id));
      for (const [mode, v] of Object.entries(r.modes)) {
        assert.equal(v.outside, 0);
        assert.equal(v.alpha, 0);
        if (mode === 'original') assert.equal(v.before !== v.after, r.scoped);
        if (mode === 'etching' || r.land) assert.equal(v.before, v.after);
        if (r.scoped && mode === 'original') assert.equal(v.prototypeHash, v.after);
      }
    }
    assert.equal(n.darkControls.printings, 122);
    assert.equal(n.darkControls.nativeVariants, 488);
    assert.equal(n.darkControls.changed, 0);
    assert.equal(n.darkControls.rows.length, 122);
    return p;
  })());
}
export async function preFourthNonlandSource(file, bytes) {
  bytes = await preFourthParagraphSource(file, bytes);
  const e = (await fourthNonlandDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function fourthNonlandAffected(set, task, original = false, group) {
  if (set?.toLowerCase() !== '4ed' || original || !['rules', 'fullCard', 'release'].includes(task))
    return false;
  const p = await fourthNonlandDelta();
  return !Array.isArray(group?.printingIds) || p.ids.some((id) => group.printingIds.includes(id));
}
export async function fourthNonlandHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (f) => [
          path.relative(directory, f),
          hash(await preFourthNonlandSource(path.relative(root, f), await fs.readFile(f))),
        ]),
      ),
    ),
  );
}
