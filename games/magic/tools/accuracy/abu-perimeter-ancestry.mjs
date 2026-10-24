import {
  preAbuRasterSource,
  abuRasterHistoricalHash,
  abuRasterAffected,
  abuRasterApprovalCurrent,
  abuRasterDelta,
} from './abu-raster-ancestry.mjs';
// Reconstruct only the reviewed AB perimeter edit; never approve changed fits.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
const RECEIPT = '9d8facef5076ebe751862eb7a2c36ab1ca1410f6d0fa9742f82e2dc432611127';
const FILE =
  'games/magic/fixtures/accuracy/early-through-fourth/abu-perimeter-source-delta.json.gz';
let checked;
let native;
export async function abuPerimeterDelta() {
  return (checked ??= (async () => {
    const z = await readFile(path.join(root, FILE));
    assert.equal(hash(z), RECEIPT, 'Changed AB perimeter receipt');
    const p = JSON.parse(gunzipSync(z));
    assert.deepEqual(Object.keys(p.files), [
      'games/magic/src/data/generated-manifest.json',
      'games/magic/src/presentation/retro-dual-frame.ts',
      'games/magic/src/presentation/retro-paint.ts',
    ]);
    for (const [f, e] of Object.entries(p.files)) {
      assert.equal(
        hash(await preAbuRasterSource(f, await readFile(path.join(root, f)))),
        e.after,
        'Unreviewed AB perimeter source: ' + f,
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
    assert.equal(n.status, 'complete-native-perimeter-adoption-census');
    assert.equal(n.source.beforeRenderer, p.beforeRenderer);
    assert.equal(n.source.afterRenderer, p.afterRenderer);
    assert.equal(n.source.toolHash, p.native.toolSha256);
    assert.equal(n.completed, 899);
    assert.equal(n.rows.length, 899);
    assert.equal(new Set(n.rows.map((r) => r.id)).size, 899);
    assert.deepEqual(n.faults, []);
    assert.equal(n.faces.length, 114);
    assert.equal(p.members.length, 19);
    assert.equal(new Set(p.members.map((r) => r.id)).size, 19);
    assert.deepEqual(p.members.map((r) => r.id).sort(), n.affectedIds);
    for (const r of n.rows) {
      const keys = r.original.keys;
      assert.equal(keys.before.face !== keys.after.face, r.affected);
      assert.equal(keys.before.etching, keys.after.etching);
    }
    for (const r of n.faces) {
      assert.equal(r.interior, 0);
      assert.equal(r.alpha, 0);
      assert.equal(r.changed > 0, r.layer === 'face');
      assert(p.members.some((m) => m.id === r.id && m.set === r.set));
    }
    for (const m of p.members) {
      assert(['lea', 'leb'].includes(m.set));
      assert.equal(m.face.frameColors.length, 2);
      const pairs = n.faces.filter((r) => r.id === m.id);
      assert.equal(pairs.length, 6);
      assert.equal(new Set(pairs.map((r) => r.mode + '/' + r.symbolStyle + '/' + r.layer)).size, 6);
    }
    return p;
  })());
}
export async function preAbuPerimeterSource(file, bytes) {
  bytes = await preAbuRasterSource(file, bytes);
  const p = await abuPerimeterDelta(),
    e = p.files[file];
  if (!e) return bytes;
  const digest = hash(bytes);
  if (digest === e.before || e.historicalHashes.includes(digest)) return bytes;
  assert.equal(digest, e.after, 'Unreviewed AB perimeter source: ' + file);
  return Buffer.from(e.beforeSource);
}
export async function abuPerimeterAffected(set, task, original = false, group) {
  if (
    original ||
    !['lea', 'leb'].includes(set?.toLowerCase()) ||
    !['frameGeometry', 'fullCard', 'release'].includes(task)
  )
    return false;
  if (!group || !Array.isArray(group.printingIds)) return true;
  const p = await abuPerimeterDelta();
  return (
    group.printingIds?.some((id) =>
      p.members.some((m) => m.id === id && m.set === set.toLowerCase()),
    ) === true
  );
}
export async function abuPerimeterRuntimeCompatible(
  directory,
  expected,
  set,
  task,
  original = false,
  group,
) {
  if (directory !== 'games/magic/src') return false;
  const p = await abuPerimeterDelta();
  return (
    expected === p.beforeRenderer &&
    !(await abuPerimeterAffected(set, task, original, group)) &&
    !(await abuRasterAffected(set, task, original, group)) &&
    (await sourceHash(path.join(root, directory))) === (await abuRasterDelta()).afterRenderer &&
    (await abuRasterHistoricalHash(path.join(root, directory))) === p.afterRenderer
  );
}

/** A revision marker alone cannot approve changed geometry or whole-card data. */
export async function abuPerimeterApprovalCurrent(item, group) {
  const p = await abuPerimeterDelta(),
    proof = item.proof;
  if (group.printingIds?.some((id) => p.members.some((m) => m.id === id)))
    return abuRasterApprovalCurrent(item, group);
  if (
    proof?.abuPerimeterSource !== p.afterRenderer ||
    proof.nativeReplayHash !== p.native.contentSha256 ||
    proof.rendererHash !== p.afterRenderer ||
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
    group.printingIds.length !== group.printings
  )
    return false;
  return group.printingIds.every((id) => {
    const r = native.rows.find((r) => r.id === id && r.affected),
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
