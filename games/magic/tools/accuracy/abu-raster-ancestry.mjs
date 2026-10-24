import {
  preAbuPaperSource,
  abuPaperHistoricalHash,
  abuPaperDelta,
  abuPaperAffected,
  abuPaperApprovalCurrent,
} from './abu-paper-ancestry.mjs';
// Reconstruct the exact reviewed raster-selection edit; this is not fit approval.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
const FILE = 'games/magic/fixtures/accuracy/early-through-fourth/abu-raster-source-delta.json.gz';
const RECEIPT = '46cb570b41114f857261ca863f241e9dd5ef0f9ed4ff4165daa2a8d136542b5f';
let checked;
let native;
export async function abuRasterDelta() {
  return (checked ??= (async () => {
    const z = await readFile(path.join(root, FILE));
    assert.equal(hash(z), RECEIPT, 'Changed AB raster-selection receipt');
    const p = JSON.parse(gunzipSync(z));
    assert.deepEqual(Object.keys(p.files), [
      'games/magic/src/data/generated-manifest.json',
      'games/magic/src/presentation/retro-dual-frame.ts',
      'games/magic/src/presentation/retro-dual-material.ts',
    ]);
    for (const [f, e] of Object.entries(p.files)) {
      assert.equal(
        hash(await preAbuPaperSource(f, await readFile(path.join(root, f)))),
        e.after,
        'Unreviewed AB raster source: ' + f,
      );
      assert.equal(hash(e.beforeSource), e.before);
    }
    const nz = await readFile(path.join(root, p.native.file));
    assert.equal(hash(nz), p.native.sha256);
    const raw = gunzipSync(nz);
    assert.equal(hash(raw), p.native.contentSha256);
    assert.equal(hash(await readFile(path.join(root, p.native.tool))), p.native.toolSha256);
    const n = JSON.parse(raw);
    native = n;
    assert.equal(n.status, 'complete-native-raster-selection-census');
    assert.equal(n.source.beforeRenderer, p.beforeRenderer);
    assert.equal(n.source.afterRenderer, p.afterRenderer);
    assert.equal(n.source.toolHash, p.native.toolSha256);
    assert.equal(n.completed, 899);
    assert.equal(n.rows.length, 899);
    assert.equal(new Set(n.rows.map((r) => r.id)).size, 899);
    assert.deepEqual(n.faults, []);
    assert.deepEqual(p.members.map((r) => r.id).sort(), n.affectedIds);
    assert.equal(n.faces.length, p.members.length * 6);
    for (const r of n.rows) {
      assert.equal(r.original.keys.before.face !== r.original.keys.after.face, r.affected);
      assert.equal(r.original.keys.before.etching, r.original.keys.after.etching);
    }
    for (const m of p.members) {
      assert(['lea', 'leb', '2ed'].includes(m.set));
      assert.equal(m.face.frameColors.length, 2);
      const pairs = n.faces.filter((r) => r.id === m.id);
      assert.equal(pairs.length, 6);
      assert.equal(new Set(pairs.map((r) => r.mode + '/' + r.symbolStyle + '/' + r.layer)).size, 6);
      for (const r of pairs) {
        assert.equal(r.alpha, 0);
        if (r.layer === 'etching') assert.equal(r.changed, 0);
      }
    }
    return p;
  })());
}
export async function preAbuRasterSource(file, bytes) {
  bytes = await preAbuPaperSource(file, bytes);
  const p = await abuRasterDelta(),
    e = p.files[file];
  if (!e) return bytes;
  const digest = hash(bytes);
  if (digest === e.before || e.historicalHashes.includes(digest)) return bytes;
  assert.equal(digest, e.after, 'Unreviewed AB raster source: ' + file);
  return Buffer.from(e.beforeSource);
}
export async function abuRasterHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (file) => [
          path.relative(directory, file),
          hash(await preAbuRasterSource(path.relative(root, file), await readFile(file))),
        ]),
      ),
    ),
  );
}
export async function abuRasterAffected(set, task, original = false, group) {
  if (
    original ||
    !['lea', 'leb', '2ed'].includes(set?.toLowerCase()) ||
    !['frameGeometry', 'fullCard', 'release'].includes(task)
  )
    return false;
  if (!group || !Array.isArray(group.printingIds)) return true;
  const p = await abuRasterDelta();
  return group.printingIds.some((id) =>
    p.members.some((m) => m.id === id && m.set === set.toLowerCase()),
  );
}
export async function abuRasterRuntimeCompatible(
  directory,
  expected,
  set,
  task,
  original = false,
  group,
) {
  if (directory !== 'games/magic/src') return false;
  const p = await abuRasterDelta();
  return (
    expected === p.beforeRenderer &&
    !(await abuRasterAffected(set, task, original, group)) &&
    !(await abuPaperAffected(set, task, original, group)) &&
    (await sourceHash(path.join(root, directory))) === (await abuPaperDelta()).afterRenderer &&
    (await abuPaperHistoricalHash(path.join(root, directory))) === p.afterRenderer
  );
}

/** Exact native lineage is necessary for a new approval; a revision marker is not. */
export async function abuRasterApprovalCurrent(item, group) {
  const p = await abuRasterDelta(),
    proof = item.proof;
  const paper = await abuPaperDelta();
  if (group.printingIds?.some((id) => paper.members.some((m) => m.id === id)))
    return abuPaperApprovalCurrent(item, group);
  if (
    proof?.abuRasterSource !== p.afterRenderer ||
    proof.rendererHash !== p.afterRenderer ||
    proof.nativeReplayHash !== p.native.contentSha256 ||
    item.runtimeGuards?.['games/magic/src'] !== p.afterRenderer ||
    item.guards?.[p.native.file] !== p.native.sha256 ||
    proof.coveredPrintings !== group.printings ||
    proof.validationKind !== 'source-census' ||
    proof.sourceCensus?.heldOut !== false
  )
    return false;
  const members = proof.sourceCensus.members;
  if (
    !Array.isArray(members) ||
    members.length !== group.printings ||
    new Set(members.map((m) => m.id)).size !== group.printings ||
    !Array.isArray(group.printingIds) ||
    group.printingIds.length !== group.printings ||
    !group.printingIds.some((id) => p.members.some((m) => m.id === id))
  )
    return false;
  return group.printingIds.every((id) => {
    const r = native.rows.find((r) => r.id === id),
      m = members.find((m) => m.id === id);
    return (
      r &&
      m &&
      m.referenceHash === r.referenceHash &&
      m.poseHash === r.poseHash &&
      m.inputHash === r.inputHash &&
      m.nativeFaceHash === r.original.hashes['after-face']
    );
  });
}
