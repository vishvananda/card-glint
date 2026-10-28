import { oldFrameHistoricalSourceFiles } from './old-frame-source-ancestry.mjs';
import { preWallWordingSource } from './wall-wording-data.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
import { validateFourthParagraphData } from './fourth-paragraph-data-check.mjs';
const FILE = 'games/magic/fixtures/accuracy/4ed/paragraph-source-delta.json.gz';
const RECEIPT = 'b71f31caba084e590ee6bbc1b556a54b3c5215fac600cd74add377ab32e1c570';
let checked;
export function fourthParagraphDelta() {
  return (checked ??= (async () => {
    const z = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(z), RECEIPT);
    const p = JSON.parse(gunzipSync(z));
    assert.deepEqual(validateFourthParagraphData(p), p.summary);
    const nz = await fs.readFile(path.join(root, p.native.file));
    assert.equal(hash(nz), p.native.sha256);
    const raw = gunzipSync(nz);
    assert.equal(hash(raw), p.native.contentSha256);
    const n = JSON.parse(raw);
    assert.equal(n.status, 'complete-native-fourth-paragraph-isolation');
    assert.equal(n.beforeRenderer, p.beforeRenderer);
    assert.equal(n.afterRenderer, p.afterRenderer);
    assert.equal(n.originals, 378);
    assert.equal(n.nativeVariants, 1512);
    assert.deepEqual(n.ids, p.ids);
    assert.equal(n.rows.length, 378);
    assert.equal(new Set(n.rows.map((r) => r.id)).size, 378);
    for (const mode of ['original', 'oracle', 'oracle-modern', 'etching']) {
      const changed = mode === 'original' ? 1 : 0;
      assert.deepEqual(n.counts[mode], { changed, unchanged: 378 - changed, keysChanged: changed });
    }
    for (const r of n.rows) {
      assert.equal(r.scoped, p.ids.includes(r.id));
      for (const [mode, v] of Object.entries(r.modes)) {
        assert.equal(v.outside, 0);
        assert.equal(v.alpha, 0);
        assert.equal(v.before !== v.after, r.scoped && mode === 'original');
        if (r.scoped && mode === 'original') assert.equal(v.prototypeHash, v.after);
      }
    }
    return p;
  })());
}
export async function preFourthParagraphSource(file, bytes) {
  bytes = await preWallWordingSource(file, bytes);
  const e = (await fourthParagraphDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function fourthParagraphAffected(set, task, original = false, group) {
  if (set?.toLowerCase() !== '4ed') return false;
  if (original ? task !== 'rules' : !['rules', 'fullCard', 'release'].includes(task)) return false;
  const p = await fourthParagraphDelta();
  return !Array.isArray(group?.printingIds) || p.ids.some((id) => group.printingIds.includes(id));
}
export async function fourthParagraphHistoricalHash(
  directory = path.join(root, 'games/magic/src'),
) {
  const files = (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        (await oldFrameHistoricalSourceFiles(files)).map(async (f) => [
          path.relative(directory, f),
          hash(await preFourthParagraphSource(path.relative(root, f), await fs.readFile(f))),
        ]),
      ),
    ),
  );
}
