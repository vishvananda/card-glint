import { preFourthSourceReport } from './fourth-source-report-ancestry.mjs';
// Exact source projection for a measured placement change, never whole-set approval.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { hash, root } from './common.mjs';
import { validateFourthBasicSymbolSource } from './fourth-basic-symbol-source-check.mjs';
const FILE = 'games/magic/fixtures/accuracy/4ed/basic-symbol-source-delta.json.gz';
const RECEIPT = '3b36f7efba7aa922c20ac5f46aa3d595bbffa1241aeb155397a508b427a883cb';
const artifact = async (ref) => {
  const raw = await fs.readFile(path.join(root, ref.file));
  assert.equal(hash(raw), ref.sha256);
  const bytes = gunzipSync(raw);
  assert.equal(hash(bytes), ref.contentSha256);
  return bytes;
};
let checked;
export function fourthBasicSymbolDelta() {
  return (checked ??= (async () => {
    const raw = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(raw), RECEIPT);
    const p = JSON.parse(gunzipSync(raw));
    assert.deepEqual(await validateFourthBasicSymbolSource(p), p.summary);
    assert.equal(
      hash(await fs.readFile(new URL('./fourth-basic-symbol-source-check.mjs', import.meta.url))),
      p.validatorHash,
    );
    assert.equal(
      hash(await fs.readFile(new URL('./fourth-basic-symbol-code.mjs', import.meta.url))),
      p.codeEditsHash,
    );
    const n = JSON.parse(await artifact(p.native)),
      proto = JSON.parse(await artifact(p.prototype)),
      scores = JSON.parse(await artifact(p.scores));
    assert.equal(n.status, 'complete-native-basic-symbol-profile-isolation');
    assert.equal(n.beforeRenderer, p.beforeRenderer);
    assert.equal(n.afterRenderer, p.afterRenderer);
    assert.equal(n.nativeVariants, 1968);
    assert.equal(n.originals, 492);
    assert.equal(n.exactPngPairs, 1948);
    assert.equal(n.nativeImagesDecoded, 40);
    assert.deepEqual(n.ids, p.ids);
    assert.equal(n.rows.length, 492);
    assert.equal(new Set(n.rows.map((r) => r.id)).size, 492);
    const keyIds = n.rows
      .filter((r) => r.modes.original.beforeKey !== r.modes.original.afterKey)
      .map((r) => r.id);
    assert.equal(keyIds.length, 408);
    assert.equal(new Set(keyIds).size, 408);
    assert.deepEqual(n.counts.original, { changed: 20, unchanged: 472, keysChanged: 408 });
    for (const mode of ['oracle', 'oracle-modern', 'etching'])
      assert.deepEqual(n.counts[mode], { changed: 0, unchanged: 492, keysChanged: 408 });
    assert.equal(proto.rows.length, 20);
    assert.equal(proto.rendererHash, p.beforeRenderer);
    assert.deepEqual(proto.policy, p.policy);
    assert.deepEqual(proto.rows.map((r) => r.id).sort(), p.ids);
    assert.equal(hash(await artifact(p.prototype)), n.prototypeHash);
    const changedIds = [];
    for (const r of n.rows)
      for (const [mode, v] of Object.entries(r.modes)) {
        assert.equal(v.outside, 0);
        assert.equal(v.alpha, 0);
        assert.equal(v.beforeKey !== v.afterKey, keyIds.includes(r.id));
        const changed = v.before !== v.after;
        assert.equal(changed, mode === 'original' && p.ids.includes(r.id));
        if (changed) {
          const x = proto.rows.find((x) => x.id === r.id);
          assert(x);
          assert.equal(v.before, x.modes.current.sha256);
          assert.equal(v.after, x.modes.shared.sha256);
          assert.equal(v.afterKey, x.modes.shared.keyHash);
          changedIds.push(r.id);
        }
      }
    assert.deepEqual(changedIds.sort(), p.ids);
    assert.equal(scores.status, 'current-native-basic-symbol-scores');
    assert.equal(scores.rendererHash, p.afterRenderer);
    assert.equal(scores.prototypeRendererHash, p.beforeRenderer);
    assert.equal(scores.inputHash, p.inputHash);
    assert.equal(scores.rows.length, 378);
    assert.equal(scores.sources.nativeIsolation, p.native.contentSha256);
    assert.equal(scores.summary.prototypeFresh, 15);
    assert.equal(scores.summary.gains, 15);
    assert.equal(scores.summary.losses, 0);
    for (const r of scores.rows) {
      const row = n.rows.find((x) => x.id === r.id);
      assert.equal(row.set, '4ed');
      assert.equal(r.nativeHash, row.modes.original.after);
      assert.equal(r.keyHash, row.modes.original.afterKey);
      assert.equal(r.inputHash, row.modes.original.inputHash);
      assert.equal(r.referenceHash, row.referenceHash);
      assert.equal(r.scoreSource, 'exact-actual-native-prototype-png');
    }
    for (const [report, producer] of [
      ['basic-symbol-shared-prototype.json.gz', 'basic-symbol-prototype-tool.mjs.gz'],
      ['basic-symbol-native-review.json.gz', 'basic-symbol-native-review-tool.mjs.gz'],
      ['basic-symbol-prototype-whole-scores.json.gz', 'basic-symbol-whole-score-tool.mjs.gz'],
      ['basic-symbol-current-native-scores.json.gz', 'basic-symbol-native-score-tool.mjs.gz'],
    ])
      assert.equal(
        JSON.parse(await artifact(p.artifacts[report])).toolHash,
        hash(await artifact(p.artifacts[producer])),
      );
    return p;
  })());
}
export async function preFourthBasicSymbolSource(file, bytes) {
  bytes = await preFourthSourceReport(file, bytes);
  const r = (await fourthBasicSymbolDelta()).files[file];
  return r && hash(bytes) === r.after ? Buffer.from(r.beforeSource) : bytes;
}
export async function fourthBasicSymbolHistoricalHash(
  directory = path.join(root, 'games/magic/src'),
) {
  const files = (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (f) => [
          path.relative(directory, f),
          hash(await preFourthBasicSymbolSource(path.relative(root, f), await fs.readFile(f))),
        ]),
      ),
    ),
  );
}
