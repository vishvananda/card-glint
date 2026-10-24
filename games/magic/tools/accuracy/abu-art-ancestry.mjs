// Exact scoped art-height history. Projection proves source ancestry, never fit approval.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
const FILE = 'games/magic/fixtures/accuracy/early-through-fourth/abu-art-source-delta.json.gz';
const RECEIPT = '84a6aecea787d4346a091b482b6b9968745d6e8271fb8f72431b179d6d8411e1';
let checked, tree, historical;
export async function abuArtDelta() {
  return (checked ??= (async () => {
    const zipped = await readFile(path.join(root, FILE));
    assert.equal(hash(zipped), RECEIPT, 'Changed AB art-height receipt');
    const p = JSON.parse(gunzipSync(zipped));
    assert.equal(p.schema, 1);
    assert.deepEqual(Object.keys(p.files), [
      'games/magic/src/data/generated-manifest.json',
      'games/magic/src/presentation/canvas-face.ts',
      'games/magic/src/presentation/retro-dual-frame.ts',
      'games/magic/src/presentation/retro-dual-material.ts',
      'games/magic/src/presentation/retro-frame.ts',
    ]);
    for (const [file, e] of Object.entries(p.files)) {
      assert.equal(hash(e.beforeSource), e.before);
      assert.equal(
        hash(await readFile(path.join(root, file))),
        e.after,
        'Unreviewed AB art-height source: ' + file,
      );
    }
    const load = async (r) => {
      const z = await readFile(path.join(root, r.file));
      assert.equal(hash(z), r.sha256);
      const raw = gunzipSync(z);
      assert.equal(hash(raw), r.contentSha256);
      assert.equal(hash(await readFile(path.join(root, r.tool))), r.toolSha256);
      return JSON.parse(raw);
    };
    const n = await load(p.native),
      layers = await load(p.layers);
    assert.equal(n.status, 'complete-native-art-height-adoption-census');
    assert.equal(layers.status, 'complete-native-art-height-layer-pairs');
    assert.equal(n.completed, 899);
    assert.equal(n.rows.length, 899);
    assert.equal(new Set(n.rows.map((r) => r.id)).size, 899);
    assert.equal(n.source.beforeRenderer, p.beforeRenderer);
    assert.equal(n.source.afterRenderer, p.afterRenderer);
    assert.equal(n.source.toolHash, p.native.toolSha256);
    assert.deepEqual(layers.source.beforeRenderer, p.beforeRenderer);
    assert.equal(layers.source.afterRenderer, p.afterRenderer);
    assert.equal(layers.source.inputHash, n.source.inputHash);
    assert.equal(layers.source.toolHash, p.layers.toolSha256);
    assert.equal(layers.source.closed, true);
    assert.deepEqual(n.faults, []);
    assert.deepEqual(layers.faults, []);
    assert.equal(p.members.length, 19);
    assert.equal(new Set(p.members.map((r) => r.id)).size, 19);
    assert.deepEqual(n.affectedIds, p.members.map((r) => r.id).sort());
    const oldRaw = gunzipSync(await readFile(path.join(root, p.parent.file)));
    assert.equal(hash(oldRaw), p.parent.contentSha256);
    assert.equal(n.source.priorNativeHash, p.parent.contentSha256);
    const prior = JSON.parse(oldRaw);
    assert.equal(prior.source.afterRenderer, p.beforeRenderer);
    assert.equal(prior.source.afterInputHash, n.source.inputHash);
    const sz = await readFile(path.join(root, p.study.file));
    assert.equal(hash(sz), p.study.sha256);
    const study = JSON.parse(gunzipSync(sz));
    assert.equal(study.capture.source.rendererHash, p.beforeRenderer);
    assert.equal(
      n.source.prototypeCaptureHash,
      hash(JSON.stringify(study.capture, null, 2) + '\n'),
    );
    for (const r of n.rows) {
      const old = prior.rows.find((v) => v.id === r.id);
      assert(old);
      assert.equal(r.referenceHash, old.referenceHash);
      assert.equal(r.poseHash, old.poseHash);
      assert.equal(r.inputHash, old.inputHash);
      const affected = n.affectedIds.includes(r.id);
      assert.equal(r.affected, affected);
      for (const layer of ['face', 'etching']) {
        assert.equal(r.original.keys.before[layer], old.original.keys.after[layer]);
        assert.equal(r.original.keys.before[layer] !== r.original.keys.after[layer], affected);
      }
      if (!affected)
        assert.equal(r.original.hashes['after-face'], old.original.hashes['after-face']);
      else {
        assert.equal(r.original.hashes['before-face'], old.original.hashes['after-face']);
        const trial = study.rows.find((v) => v.id === r.id && v.trial === 'up-2');
        assert(trial);
        assert.equal(r.original.hashes['after-face'], trial.renderHash);
      }
    }
    assert.equal(n.faces.length, 114);
    assert.equal(layers.rows.length, 57);
    for (const m of p.members) {
      assert(['lea', 'leb'].includes(m.set));
      const pairs = n.faces.filter((r) => r.id === m.id);
      assert.equal(pairs.length, 6);
      assert.equal(new Set(pairs.map((r) => r.mode + '/' + r.symbolStyle + '/' + r.layer)).size, 6);
      for (const r of pairs) {
        assert.equal(r.alpha, 0);
        assert.equal(r.outsideArt, 0);
        if (r.layer === 'etching') assert.equal(r.changed, 0);
      }
      const extra = layers.rows.filter((r) => r.id === m.id);
      assert.deepEqual(extra.map((r) => r.layer).sort(), ['artwork', 'custom-etching', 'printing']);
      for (const r of extra) {
        assert.equal(r.outside, 0);
        assert(r.changed > 0);
        assert.notEqual(r.beforeKey, r.afterKey);
        assert.deepEqual(r.beforeArt.slice(0, 3), r.afterArt.slice(0, 3));
        assert.equal(r.afterArt[3], r.beforeArt[3] - 2 / 680);
        const [x, y, w, h] = r.afterArt;
        assert.deepEqual(r.afterBounds, [
          [x, 1 - y - h, x + w, 1 - y],
          [0, 0, 0, 0],
        ]);
      }
    }
    return p;
  })());
}
export async function preAbuArtSource(file, bytes) {
  const p = await abuArtDelta(),
    e = p.files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function abuArtHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (f) => [
          path.relative(directory, f),
          hash(await preAbuArtSource(path.relative(root, f), await readFile(f))),
        ]),
      ),
    ),
  );
}
export async function abuArtAffected(set, task, original = false, group) {
  if (
    original ||
    !['lea', 'leb'].includes(set?.toLowerCase()) ||
    !['frameGeometry', 'fullCard', 'release'].includes(task)
  )
    return false;
  const p = await abuArtDelta();
  return (
    !group ||
    !Array.isArray(group.printingIds) ||
    group.printingIds.some((id) => p.members.some((m) => m.id === id))
  );
}
export async function abuArtRuntimeCompatible(
  directory,
  expected,
  set,
  task,
  original = false,
  group,
) {
  if (directory !== 'games/magic/src') return false;
  const p = await abuArtDelta();
  return (
    expected === p.beforeRenderer &&
    !(await abuArtAffected(set, task, original, group)) &&
    (await (tree ??= sourceHash(path.join(root, directory)))) === p.afterRenderer &&
    (await (historical ??= abuArtHistoricalHash(path.join(root, directory)))) === p.beforeRenderer
  );
}
