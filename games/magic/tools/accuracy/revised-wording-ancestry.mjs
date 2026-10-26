import { preRevisedSemanticSource } from './revised-semantic-ancestry.mjs';
import { matrixHeadingDelta, preMatrixHeadingSource } from './matrix-heading-ancestry.mjs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';

export const REVISED_WORDING_RECEIPT =
  '8bb343b6990670eb72b0b42014c5e713db5e42441958d9781b02d9c0ac2fdf01';
const FILE = 'games/magic/fixtures/accuracy/3ed-recheck/wording-source-delta.json.gz';
const CATALOG = 'games/magic/fixtures/accuracy/printing-review-catalog.json';
let checked, historical, members, currentTree;
export async function revisedWordingDelta() {
  return (checked ??= (async () => {
    const z = await readFile(path.join(root, FILE));
    assert.equal(hash(z), REVISED_WORDING_RECEIPT);
    const p = JSON.parse(gunzipSync(z));
    assert.equal(p.schema, 1);
    assert.deepEqual(p.affectedSets, ['3ed']);
    for (const e of Object.values(p.files)) {
      assert.equal(hash(e.afterSource), e.after);
      if (e.beforeSource !== null) assert.equal(hash(e.beforeSource), e.before);
    }
    assert.deepEqual(
      Object.keys(p.files)
        .filter((f) => f.startsWith('games/magic/src/'))
        .sort(),
      [
        'data/eager-wording.ts',
        'data/generated-manifest.json',
        'data/review-metadata.ts',
        'data/wording/3ed.ts',
      ]
        .map((f) => 'games/magic/src/' + f)
        .sort(),
      'A wording receipt cannot approve painter changes',
    );
    const before = JSON.parse(p.files[CATALOG].beforeSource),
      after = JSON.parse(p.files[CATALOG].afterSource);
    assert.deepEqual(after.artists, before.artists);
    let count = 0;
    for (const [id, rows] of Object.entries(before.wording))
      if (before.sets[id] !== '3ed') {
        assert.deepEqual(after.wording[id], rows);
        assert.equal(after.sets[id], before.sets[id]);
        count++;
      }
    for (const id of Object.keys(after.wording))
      if (!before.wording[id]) assert.equal(after.sets[id], '3ed');
    assert.equal(count, p.nonRevisedWordingsUnchanged);
    assert.equal(Object.keys(after.artists).length, p.artistCreditsUnchanged);
    assert.deepEqual(
      p.sourceIndex.after.slice(0, p.sourceIndex.before.length),
      p.sourceIndex.before,
    );
    assert.equal(new Set(p.sourceIndex.after).size, p.sourceIndex.after.length);
    const load = async (a) => {
      const b = await readFile(path.join(root, a.file));
      assert.equal(hash(b), a.sha256);
      const raw = gunzipSync(b);
      if (a.contentSha256) assert.equal(hash(raw), a.contentSha256);
      return { raw, data: JSON.parse(raw) };
    };
    const runtime = (await load(p.artifacts['runtime-wording-parity.json.gz'])).data;
    const native = (await load(p.artifacts['runtime-wording-native.json.gz'])).data;
    const input = await load(p.correctedInputs),
      review = (await load(p.review)).data,
      types = (await load(p.typeReview)).data;
    assert.equal(native.status, 'complete');
    assert.equal(native.rendererHash, p.afterRenderer);
    assert.equal(native.beforeRenderer, p.beforeRenderer);
    assert.deepEqual(native.faults, []);
    assert.equal(native.inputHash, hash(input.raw));
    assert.equal(runtime.afterRenderer, p.afterRenderer);
    assert.equal(runtime.beforeRenderer, p.beforeRenderer);
    for (const rows of [native.rows, runtime.rows, input.data.entries, review.rows]) {
      assert.equal(rows.length, 306);
      assert.equal(new Set(rows.map((r) => r.id)).size, 306);
    }
    assert.equal(review.checked, 306);
    assert.equal(types.total, 306);
    assert.equal(types.rows.length, 255);
    assert.equal(types.automaticOcrApprovals, 0);
    members = new Map();
    for (const e of input.data.entries) {
      const n = native.rows.find((r) => r.id === e.id),
        r = runtime.rows.find((r) => r.id === e.id),
        c = review.rows.find((r) => r.id === e.id);
      assert.equal(n.before, n.after);
      assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
      assert.equal(r.inputHash, n.inputHash);
      assert.equal(r.oracleVariants, 6);
      assert.equal(n.referenceHash, e.reference.sha256);
      assert.equal(r.referenceHash, n.referenceHash);
      assert.equal(c.reviewedRulesTextHash, hash(e.face.rulesText));
      assert.equal(c.reviewedParagraphsHash, hash(JSON.stringify(e.face.rulesParagraphs)));
      assert.deepEqual(e.face.rulesAlignment, { mode: 'auto', reference: e.face.rulesParagraphs });
      const t = types.rows.find((r) => r.id === e.id);
      if (t) {
        assert.equal(t.typeLine, e.face.typeLine);
        assert.equal(t.referenceHash, e.reference.sha256);
      } else
        assert(
          before.wording[e.id].some(
            (r) =>
              r.fields.typeLine === e.face.typeLine && r.referenceSha256 === e.reference.sha256,
          ),
        );
      const fields = Object.assign({}, ...after.wording[e.id].map((r) => r.fields));
      assert.equal(fields.typeLine, e.face.typeLine);
      members.set(e.id, {
        id: e.id,
        name: e.name,
        referenceHash: n.referenceHash,
        poseHash: n.poseHash,
        inputHash: n.inputHash,
        nativeFaceHash: n.after,
      });
    }
    return p;
  })());
}
/** Compose two immutable reviews: Revised data plus the independent Matrix fix.
 * Compare the entire generated manifest before reversing its two source digests;
 * unrelated payloads, source edits and formatting retain their actual identity. */
export async function preRevisedMatrixSource(file, bytes) {
  bytes = await preRevisedSemanticSource(file, bytes);
  if (file === 'games/magic/src/data/generated-manifest.json') {
    const wording = await revisedWordingDelta(),
      matrix = await matrixHeadingDelta(),
      before = wording.files[file].afterSource;
    let combined = before;
    for (const name of [
      'games/magic/src/presentation/canvas-face.ts',
      'games/magic/src/presentation/canvas-text.ts',
    ]) {
      const change = matrix.files[name],
        oldEntry = JSON.stringify(name) + ': ' + JSON.stringify(change.before),
        newEntry = JSON.stringify(name) + ': ' + JSON.stringify(change.after);
      assert.equal(combined.split(oldEntry).length, 2, 'Reviewed Matrix source must occur once');
      combined = combined.replace(oldEntry, newEntry);
    }
    if (hash(bytes) === hash(combined)) return Buffer.from(before);
  }
  return preMatrixHeadingSource(file, bytes);
}
async function projectedWordingHash(directory, project) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (f) => [
          path.relative(directory, f),
          hash(await project(path.relative(root, f), await readFile(f))),
        ]),
      ),
    ),
  );
}
/** Retains the exact merged branch identity while removing only the Matrix fix. */
export function revisedWordingMatrixHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  return projectedWordingHash(directory, preRevisedMatrixSource);
}
/** Exact data history. Unknown bytes remain visible to historical hash guards. */
export async function preRevisedWordingSource(file, bytes) {
  bytes = await preRevisedMatrixSource(file, bytes);
  const e = (await revisedWordingDelta()).files[file];
  return e && e.beforeSource !== null && hash(bytes) === e.after
    ? Buffer.from(e.beforeSource)
    : bytes;
}
export function revisedWordingHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  return projectedWordingHash(directory, preRevisedWordingSource);
}
/** New data never carries an old Revised fit forward. */
export async function revisedWordingRuntimeCompatible(directory, expected, set) {
  if (directory !== 'games/magic/src' || !set || set.toLowerCase() === '3ed') return false;
  const p = await revisedWordingDelta();
  if (expected !== p.beforeRenderer) return false;
  currentTree ??= revisedWordingMatrixHistoricalHash(path.join(root, directory));
  if ((await currentTree) !== p.afterRenderer) return false;
  historical ??= revisedWordingHistoricalHash(path.join(root, directory));
  return (await historical) === p.beforeRenderer;
}
export function revisedWordingAffected(set, task, original = false) {
  if (set?.toLowerCase() !== '3ed' || task === 'normalization') return false;
  return !original || ['rules', 'headings'].includes(task);
}
/** Only the source wording census is certified here, never typography or geometry. */
export async function revisedOriginalSourceCurrent(item, group, task) {
  const p = await revisedWordingDelta(),
    proof = item.proof;
  if (
    proof?.revisedWordingSource !== p.afterRenderer ||
    proof.rendererHash !== p.afterRenderer ||
    proof.originalSourceTask !== task ||
    proof.validationKind !== 'source-census' ||
    proof.coveredPrintings !== group.printings ||
    proof.nativeReplayHash !== p.artifacts['runtime-wording-native.json.gz'].contentSha256 ||
    item.guards?.[FILE] !== REVISED_WORDING_RECEIPT
  )
    return false;
  for (const [file, expected] of Object.entries(p.wordingDependencies)) {
    if (
      item.guards?.[file] !== expected ||
      hash(await readFile(path.join(root, file))) !== expected
    )
      return false;
  }
  const table = 'games/magic/src/data/wording/3ed.ts';
  if (hash(await readFile(path.join(root, table))) !== p.files[table].after) return false;
  const census = proof.sourceCensus;
  if (
    census?.heldOut !== false ||
    census.scope !== 'all-ordinary-printings-in-variant' ||
    !Array.isArray(census.members) ||
    census.members.length !== group.printings ||
    new Set(census.members.map((m) => m.id)).size !== group.printings
  )
    return false;
  return group.printingIds.every((id) => {
    const a = members.get(id),
      b = census.members.find((m) => m.id === id);
    return (
      a &&
      b &&
      ['referenceHash', 'poseHash', 'inputHash', 'nativeFaceHash'].every((k) => a[k] === b[k])
    );
  });
}
