import { oldFrameHistoricalSourceFiles } from './old-frame-source-ancestry.mjs';
import { preFourthNonlandSource } from './fourth-nonland-ancestry.mjs';
// Known Fourth nonbasic changes project to their exact prior source; unknown edits remain visible.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
import { validateFourthNonbasicData } from './fourth-nonbasic-data-check.mjs';
const FILE = 'games/magic/fixtures/accuracy/4ed/nonbasic-source-delta.json.gz';
const RECEIPT = '05ba2f1e96b05b57581342e5e462ba7514748cbe86819735d90559df1fcd2646';
let checked;
export function fourthNonbasicDelta() {
  return (checked ??= (async () => {
    const z = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(z), RECEIPT);
    const p = JSON.parse(gunzipSync(z));
    assert.deepEqual(validateFourthNonbasicData(p), p.summary);
    const nz = await fs.readFile(path.join(root, p.native.file));
    assert.equal(hash(nz), p.native.sha256);
    const raw = gunzipSync(nz);
    assert.equal(hash(raw), p.native.contentSha256);
    const n = JSON.parse(raw);
    assert.equal(n.status, 'complete-native-fourth-nonbasic-isolation');
    assert.equal(n.beforeRenderer, p.beforeRenderer);
    assert.equal(n.afterRenderer, p.afterRenderer);
    assert.equal(n.originals, 378);
    assert.equal(n.nativeVariants, 1512);
    assert.deepEqual(n.ids, p.ids);
    assert.deepEqual(n.wordingIds, p.wordingIds);
    assert.equal(n.rows.length, 378);
    assert.equal(new Set(n.rows.map((r) => r.id)).size, 378);
    for (const mode of ['original', 'oracle', 'oracle-modern'])
      assert.deepEqual(n.counts[mode], { changed: 3, unchanged: 375, keysChanged: 378 });
    assert.deepEqual(n.counts.etching, { changed: 0, unchanged: 378, keysChanged: 378 });
    for (const r of n.rows)
      for (const [mode, v] of Object.entries(r.modes)) {
        assert.equal(v.outside, 0);
        assert.equal(v.alpha, 0);
        if (v.before !== v.after) assert(r.scoped && mode !== 'etching');
        if (r.scoped && mode === 'original') assert.equal(v.prototypeHash, v.after);
      }
    assert.equal(n.darkControls.printings, 122);
    assert.equal(n.darkControls.nativeVariants, 488);
    assert.equal(n.darkControls.changed, 0);
    return p;
  })());
}
export async function preFourthNonbasicSource(file, bytes) {
  bytes = await preFourthNonlandSource(file, bytes);
  const e = (await fourthNonbasicDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function fourthNonbasicAffected(set, task, original = false, group) {
  if (set?.toLowerCase() !== '4ed') return false;
  const p = await fourthNonbasicDelta();
  const ids = original
    ? task === 'rules'
      ? p.wordingIds
      : []
    : ['rules', 'fullCard', 'release'].includes(task)
      ? p.ids
      : [];
  return (
    ids.length > 0 &&
    (!Array.isArray(group?.printingIds) || ids.some((id) => group.printingIds.includes(id)))
  );
}
export async function fourthNonbasicHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        (await oldFrameHistoricalSourceFiles(files)).map(async (f) => [
          path.relative(directory, f),
          hash(await preFourthNonbasicSource(path.relative(root, f), await fs.readFile(f))),
        ]),
      ),
    ),
  );
}
