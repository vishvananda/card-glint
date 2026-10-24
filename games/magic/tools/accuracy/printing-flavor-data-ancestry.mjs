// Exact three-printing data history; independent of calibration approval.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, root, sourceHash } from './common.mjs';
import { validatePrintingFlavorDelta } from './printing-flavor-data-check.mjs';
const FILE =
  'games/magic/fixtures/accuracy/early-through-fourth/printing-flavor-data-delta.json.gz';
const RECEIPT = 'dd33400cba67c875f09826d7aad23a64a7e73f04229a8183ca6d3820bfdde80c';
let checked, native, tree, historical;
export async function printingFlavorDelta() {
  return (checked ??= (async () => {
    const zipped = await readFile(path.join(root, FILE));
    assert.equal(hash(zipped), RECEIPT, 'Changed printing flavor receipt');
    const p = JSON.parse(gunzipSync(zipped)),
      after = {};
    const reviewBytes = await readFile(path.join(root, p.review.file));
    assert.equal(hash(reviewBytes), p.review.sha256);
    const review = JSON.parse(reviewBytes);
    assert.equal(
      hash(await readFile(path.join(root, p.validationSource.file))),
      p.validationSource.sha256,
    );

    for (const f of Object.keys(p.files)) after[f] = await readFile(path.join(root, f), 'utf8');
    assert.deepEqual(validatePrintingFlavorDelta(p, after, review), p.summary);
    const nz = await readFile(path.join(root, p.native.file));
    assert.equal(hash(nz), p.native.sha256);
    const raw = gunzipSync(nz);
    assert.equal(hash(raw), p.native.contentSha256);
    assert.equal(hash(await readFile(path.join(root, p.native.tool))), p.native.toolSha256);
    const n = JSON.parse(raw);
    native = n;
    assert.equal(n.status, 'complete-native-flavor-data-census');
    assert.equal(n.source.closed, true);
    assert.equal(n.source.beforeRenderer, p.beforeRenderer);
    assert.equal(n.source.afterRenderer, p.afterRenderer);
    assert.equal(n.source.toolHash, p.native.toolSha256);
    assert.equal(n.completed, 899);
    assert.equal(n.rows.length, 899);
    assert.equal(new Set(n.rows.map((r) => r.id)).size, 899);
    assert.deepEqual(n.faults, []);
    assert.deepEqual(n.affectedIds, review.cards.map((r) => r.id).sort());
    assert.equal(n.faces.length, 30);
    const priorRaw = gunzipSync(await readFile(path.join(root, p.parentNative.file)));
    assert.equal(hash(priorRaw), p.parentNative.contentSha256);
    assert.equal(n.source.priorNativeHash, p.parentNative.contentSha256);
    const prior = JSON.parse(priorRaw);
    assert.equal(prior.source.afterRenderer, p.beforeRenderer);
    assert.equal(prior.source.inputHash, n.source.beforeInputHash);
    for (const r of n.rows) {
      const old = prior.rows.find((v) => v.id === r.id);
      assert(old);
      assert.equal(r.referenceHash, old.referenceHash);
      assert.equal(r.poseHash, old.poseHash);
      assert.equal(r.beforeInputHash, old.inputHash);
      assert.equal(r.original.keys.before.face, old.original.keys.after.face);
      assert.equal(r.original.keys.before.etching, r.original.keys.after.etching);
      assert.equal(r.affected, n.affectedIds.includes(r.id));
      assert.equal(r.original.keys.before.face !== r.original.keys.after.face, r.affected);
      if (r.affected)
        assert.equal(r.original.hashes['before-face'], old.original.hashes['after-face']);
      else {
        assert.equal(r.inputHash, old.inputHash);
        assert.equal(r.original.hashes['after-face'], old.original.hashes['after-face']);
      }
    }
    for (const row of review.cards) {
      const paired = n.faces.filter((r) => r.id === row.id);
      assert.equal(paired.length, 10);
      assert.equal(
        new Set(paired.map((r) => [r.mode, r.symbols, r.includeFlavor, r.layer].join('/'))).size,
        10,
      );
      const binding = p.members.find((m) => m.id === row.id),
        r = n.rows.find((m) => m.id === row.id);
      assert(binding);
      assert.equal(hash(JSON.stringify(binding.beforeFace)), r.beforeInputHash);
      assert.equal(hash(JSON.stringify(binding.afterFace)), r.inputHash);
      const flavor = (face) =>
        face.rulesParagraphs
          .filter((p) => p.role === 'flavor')
          .map((p) => p.runs.map((r) => r.text).join(''))
          .join('\n');
      assert.equal(flavor(binding.beforeFace), row.before);
      assert.equal(flavor(binding.afterFace), row.proposed);
      const rest = (face) =>
        Object.fromEntries(
          Object.entries(face).filter(
            ([k]) => !['rulesText', 'rulesParagraphs', 'rulesAlignment'].includes(k),
          ),
        );
      assert.deepEqual(rest(binding.afterFace), rest(binding.beforeFace));
      assert.deepEqual(
        binding.afterFace.rulesParagraphs.filter((p) => p.role !== 'flavor'),
        binding.beforeFace.rulesParagraphs.filter((p) => p.role !== 'flavor'),
      );
      for (const face of paired) {
        assert.equal(face.outside, 0);
        assert.equal(face.alpha, 0);
        if (face.layer === 'etching' || (face.mode === 'oracle' && !face.includeFlavor))
          assert.equal(face.changed, 0);
      }
    }
    assert.equal(p.members.length, 3);
    return p;
  })());
}
export async function prePrintingFlavorData(file, bytes) {
  const p = await printingFlavorDelta(),
    e = p.files[file];
  // Older/foreign inputs are left to their owning historical validator. The
  // physical current files above must still match this exact finite data edit.
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function printingFlavorHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (f) => [
          path.relative(directory, f),
          hash(await prePrintingFlavorData(path.relative(root, f), await readFile(f))),
        ]),
      ),
    ),
  );
}
export async function printingFlavorAffected(set, task, original = false, group) {
  if (
    original ||
    !['lea', 'leb', '2ed'].includes(set?.toLowerCase()) ||
    !['references', 'rules', 'flavor', 'fullCard', 'release'].includes(task)
  )
    return false;
  const p = await printingFlavorDelta();
  return !group || group.printingIds?.some((id) => p.members.some((m) => m.id === id)) === true;
}
export async function printingFlavorRuntimeCompatible(
  directory,
  expected,
  set,
  task,
  original = false,
  group,
) {
  if (directory !== 'games/magic/src') return false;
  const p = await printingFlavorDelta();
  return (
    expected === p.beforeRenderer &&
    !(await printingFlavorAffected(set, task, original, group)) &&
    (await (tree ??= sourceHash(path.join(root, directory)))) === p.afterRenderer &&
    (await (historical ??= printingFlavorHistoricalHash(path.join(root, directory)))) ===
      p.beforeRenderer
  );
}
export async function printingFlavorApprovalCurrent(item, group) {
  const p = await printingFlavorDelta(),
    proof = item.proof;
  if (
    proof?.printingFlavorSource !== p.afterRenderer ||
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
    group.printingIds.length !== group.printings
  )
    return false;
  return group.printingIds.every((id) => {
    const r = native.rows.find((r) => r.id === id),
      m = members.find((m) => m.id === id);
    return (
      r &&
      m &&
      r.referenceHash === m.referenceHash &&
      r.poseHash === m.poseHash &&
      r.inputHash === m.inputHash &&
      r.original.hashes['after-face'] === m.nativeFaceHash
    );
  });
}
