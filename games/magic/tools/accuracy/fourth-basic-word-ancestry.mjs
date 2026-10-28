import { oldFrameHistoricalSourceFiles } from './old-frame-source-ancestry.mjs';
import { preFourthBasicSymbolSource } from './fourth-basic-symbol-ancestry.mjs';
// Exact data projection preserves historical receipts, never complete-set approval.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { hash, root } from './common.mjs';
import { validateFourthBasicWordData } from './fourth-basic-word-data-check.mjs';
const FILE = 'games/magic/fixtures/accuracy/4ed/basic-word-source-delta.json.gz';
const RECEIPT = '91da85e9457aff7e1da9d6a977dce5162b6e238dfd1bf7ddcf1b791ac6e83991';
const artifact = async (ref) => {
  const z = await fs.readFile(path.join(root, ref.file));
  assert.equal(hash(z), ref.sha256);
  const bytes = gunzipSync(z);
  assert.equal(hash(bytes), ref.contentSha256);
  return bytes;
};
let checked;
export function fourthBasicWordDelta() {
  return (checked ??= (async () => {
    const bytes = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(bytes), RECEIPT);
    const p = JSON.parse(gunzipSync(bytes));
    assert.deepEqual(validateFourthBasicWordData(p), p.summary);
    assert.equal(
      hash(await fs.readFile(new URL('./fourth-basic-word-data-check.mjs', import.meta.url))),
      p.validatorHash,
    );
    const n = JSON.parse(await artifact(p.native)),
      proto = JSON.parse(await artifact(p.prototype)),
      scores = JSON.parse(await artifact(p.scores)),
      fit = JSON.parse(await artifact(p.fit));
    assert.equal(n.status, 'complete-native-basic-word-profile-isolation');
    assert.equal(n.beforeRenderer, p.beforeRenderer);
    assert.equal(n.afterRenderer, p.afterRenderer);
    assert.equal(n.nativeVariants, 1968);
    assert.equal(n.originals, 492);
    assert.equal(n.exactPngPairs, 1948);
    assert.equal(n.nativeImagesDecoded, 40);
    assert.deepEqual(n.ids, p.ids);
    assert.equal(n.rows.length, 492);
    assert.equal(new Set(n.rows.map((r) => r.id)).size, 492);
    const keyRevisionIds = n.rows
      .filter((r) => r.modes.original.beforeKey !== r.modes.original.afterKey)
      .map((r) => r.id);
    assert.equal(keyRevisionIds.length, 408);
    assert.equal(new Set(keyRevisionIds).size, 408);
    assert.deepEqual(n.counts.original, { changed: 20, unchanged: 472, keysChanged: 408 });
    for (const mode of ['oracle', 'oracle-modern', 'etching'])
      assert.deepEqual(n.counts[mode], { changed: 0, unchanged: 492, keysChanged: 408 });
    assert.equal(proto.rows.length, 20);
    assert.equal(proto.rendererHash, p.beforeRenderer);
    assert.deepEqual(proto.policy, p.policy);
    assert.deepEqual(proto.rows.map((r) => r.id).sort(), p.ids);
    assert.equal(hash(await artifact(p.prototype)), n.prototypeHash);
    assert.equal(fit.rendererHash, p.beforeRenderer);
    assert.deepEqual(fit.shared[0].params, p.policy);
    assert.equal(scores.rendererHash, p.afterRenderer);
    assert.equal(scores.prototypeRendererHash, p.beforeRenderer);
    assert.equal(scores.inputHash, p.inputHash);
    assert.equal(scores.rows.length, 378);
    assert.equal(scores.sources.nativeIsolation, p.native.contentSha256);
    const nativeIds = [];
    for (const r of n.rows)
      for (const [mode, v] of Object.entries(r.modes)) {
        assert.equal(v.outside, 0);
        assert.equal(v.alpha, 0);
        assert.equal(v.beforeKey !== v.afterKey, keyRevisionIds.includes(r.id));
        const changed = v.before !== v.after;
        assert.equal(changed, mode === 'original' && p.ids.includes(r.id));
        if (changed) {
          const row = proto.rows.find((p) => p.id === r.id);
          assert(row);
          assert.equal(v.before, row.modes.current.sha256);
          assert.equal(v.after, row.modes.shared.sha256);
          assert.equal(v.afterKey, row.modes.shared.keyHash);
          nativeIds.push(r.id);
        }
      }
    assert.deepEqual(nativeIds.sort(), p.ids);
    for (const r of scores.rows) {
      const row = n.rows.find((n) => n.id === r.id);
      assert.equal(row.set, '4ed');
      assert.equal(r.nativeHash, row.modes.original.after);
      assert.equal(r.keyHash, row.modes.original.afterKey);
      assert.equal(r.inputHash, row.modes.original.inputHash);
      assert.equal(r.referenceHash, row.referenceHash);
      assert.equal(r.scoreSource, 'exact-actual-native-prototype-png');
    }
    for (const [artifactName, producer] of [
      ['basic-word-fine-fit.json.gz', 'basic-word-fit-tool.mjs.gz'],
      ['basic-word-shared-prototype.json.gz', 'basic-word-prototype-tool.mjs.gz'],
      ['basic-word-native-review.json.gz', 'basic-word-native-review-tool.mjs.gz'],
      ['basic-word-prototype-whole-scores.json.gz', 'basic-word-whole-score-tool.mjs.gz'],
      ['basic-word-current-native-scores.json.gz', 'basic-word-native-score-tool.mjs.gz'],
    ]) {
      const report = JSON.parse(await artifact(p.artifacts[artifactName]));
      assert.equal(report.toolHash, hash(await artifact(p.artifacts[producer])));
    }
    return p;
  })());
}
export async function preFourthBasicWordSource(file, bytes) {
  bytes = await preFourthBasicSymbolSource(file, bytes);
  const r = (await fourthBasicWordDelta()).files[file];
  return r && hash(bytes) === r.after ? Buffer.from(r.beforeSource) : bytes;
}

export async function fourthBasicWordHistoricalHash(
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
          hash(await preFourthBasicWordSource(path.relative(root, f), await fs.readFile(f))),
        ]),
      ),
    ),
  );
}
