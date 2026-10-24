import flowTools from '../../fixtures/accuracy/early-through-fourth/abu-flow-tool-delta.json' with { type: 'json' };
// Exact Original ABU body-policy history; source projection never grants fit approval.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
import { validateAbuFlowData } from './abu-flow-data-check.mjs';
const FILE = 'games/magic/fixtures/accuracy/early-through-fourth/abu-flow-source-delta.json.gz';
const RECEIPT = '3f71859065b7455370505c99192e694199a3b9beadf0675c98185e3da5737abf';
let checked, tree, historical;
export async function abuFlowDelta() {
  return (checked ??= (async () => {
    const zipped = await readFile(path.join(root, FILE));
    assert.equal(hash(zipped), RECEIPT, 'Changed Original ABU flow receipt');
    const p = JSON.parse(gunzipSync(zipped));
    const read = async (r) => {
      const bytes = await readFile(path.join(root, r.file));
      assert.equal(hash(bytes), r.sha256);
      return bytes;
    };
    const review = JSON.parse(await read(p.review));
    await read(p.validationSource);
    const after = {};
    for (const file of Object.keys(p.files))
      after[file] = await readFile(path.join(root, file), 'utf8');
    assert.deepEqual(validateAbuFlowData(p, after, review), p.summary);
    const capture = async (r) => {
      const raw = gunzipSync(await read(r));
      assert.equal(hash(raw), r.contentSha256);
      assert.equal(hash(await readFile(path.join(root, r.tool))), r.toolSha256);
      return JSON.parse(raw);
    };
    const native = await capture(p.native),
      inputs = await capture(p.inputs);
    assert.equal(native.status, 'complete-native-abu-flow-and-wording-census');
    assert.equal(inputs.status, 'complete-public-original-flow-input-refresh');
    assert.equal(native.source.closed, true);
    assert.equal(inputs.source.closed, true);
    assert.equal(native.source.beforeRenderer, p.beforeRenderer);
    assert.equal(native.source.afterRenderer, p.afterRenderer);
    assert.equal(inputs.source.rendererHash, p.afterRenderer);
    assert.equal(native.source.toolHash, p.native.toolSha256);
    assert.equal(inputs.source.toolHash, p.inputs.toolSha256);
    assert.equal(native.source.beforeInputHash, inputs.source.beforeInputHash);
    assert.equal(native.source.afterInputHash, inputs.source.afterInputHash);
    assert.equal(native.source.inputProofHash, p.inputs.contentSha256);
    assert.equal(inputs.source.reviewHash, p.review.sha256);
    assert.equal(native.completed, 899);
    assert.deepEqual(native.faults, []);
    for (const rows of [native.rows, inputs.rows]) {
      assert.equal(rows.length, 899);
      assert.equal(new Set(rows.map((r) => r.id)).size, 899);
    }
    const parentRaw = gunzipSync(await readFile(path.join(root, p.parent.file)));
    assert.equal(hash(parentRaw), p.parent.contentSha256);
    assert.equal(native.source.parentNativeHash, p.parent.contentSha256);
    const parent = JSON.parse(parentRaw),
      study = JSON.parse(gunzipSync(await read(p.study)));
    assert.equal(parent.source.afterRenderer, p.beforeRenderer);
    assert.equal(parent.source.inputHash, native.source.beforeInputHash);
    assert.equal(study.source.rendererHash, p.beforeRenderer);
    assert.equal(study.source.inputHash, native.source.beforeInputHash);
    assert(study.captures.some((c) => c.hash === native.source.prototypeCaptureHash));
    assert.deepEqual(native.eligible, p.members);
    assert.equal(p.members.length, 47);
    assert.equal(new Set(p.members.map((r) => r.id)).size, 47);
    assert.equal(p.members.filter((r) => r.flow).length, 44);
    assert.deepEqual(native.sourceChangedIds, p.sourceChangedIds);
    assert.deepEqual(
      inputs.rows
        .filter((r) => r.changed)
        .map((r) => r.id)
        .sort(),
      p.sourceChangedIds,
    );
    assert.deepEqual(review.cards.map((r) => r.id).sort(), p.sourceChangedIds);
    assert.equal(native.rows.filter((r) => r.pixelsChanged).length, 33);
    for (const r of native.rows) {
      const old = parent.rows.find((v) => v.id === r.id),
        input = inputs.rows.find((v) => v.id === r.id);
      assert(old && input);
      for (const field of ['referenceHash', 'poseHash']) {
        assert.equal(r[field], old[field]);
        assert.equal(r[field], input[field]);
      }
      assert.equal(r.beforeInputHash, old.inputHash);
      assert.equal(r.beforeInputHash, input.beforeInputHash);
      assert.equal(r.inputHash, input.inputHash);
      assert.equal(r.wording, input.changed);
      assert.equal(r.inputHash !== r.beforeInputHash, r.wording);
      const member = p.members.find((v) => v.id === r.id);
      assert.equal(r.affected, Boolean(member));
      assert.equal(r.flow, member?.flow ?? false);
      assert.equal(r.wording, member?.wording ?? false);
      assert.equal(r.original.keys.before.face, old.original.keys.after.face);
      assert.equal(r.original.keys.before.face !== r.original.keys.after.face, r.affected);
      assert.equal(r.original.keys.before.etching, r.original.keys.after.etching);
      const beforeHash = old.original.hashes['after-face'];
      assert.equal(r.pixelsChanged, beforeHash !== r.original.hashes['after-face']);
      if (!r.affected) {
        assert.equal(r.original.hashes['after-face'], beforeHash);
        continue;
      }
      assert.equal(r.original.hashes['before-face'], beforeHash);
      assert.equal(r.original.keys.before.artwork !== r.original.keys.after.artwork, r.wording);
      if (!r.wording) {
        const candidate = study.rows.find((v) => v.id === r.id && v.trial === 'combined');
        assert(candidate);
        assert.equal(candidate.referenceHash, r.referenceHash);
        assert.equal(candidate.poseHash, r.poseHash);
        assert.equal(candidate.inputHash, r.inputHash);
        assert.equal(candidate.nativeFaceHash, r.original.hashes['after-face']);
        assert.equal(candidate.addedUnsafe, false);
      }
      const pairs = native.faces.filter((v) => v.id === r.id);
      assert.equal(pairs.length, 8);
      assert.equal(new Set(pairs.map((v) => [v.mode, v.symbolStyle, v.layer].join('/'))).size, 8);
      for (const v of pairs) {
        assert.equal(v.alpha, 0);
        assert.equal(v.outside, 0);
        assert.equal(v.beforeHash === v.afterHash, v.changed === 0);
        if (v.mode === 'oracle' || ['etching', 'artwork'].includes(v.layer))
          assert.equal(v.changed, 0);
      }
    }
    assert.equal(native.faces.length, 376);
    assert.equal(p.wordingMembers.length, 3);
    for (const m of p.wordingMembers) {
      const r = native.rows.find((r) => r.id === m.id);
      assert(r?.wording);
      assert.equal(hash(JSON.stringify(m.beforeFace)), r.beforeInputHash);
      assert.equal(hash(JSON.stringify(m.afterFace)), r.inputHash);
      const rest = (face) =>
        Object.fromEntries(
          Object.entries(face).filter(
            ([k]) => !['rulesText', 'rulesParagraphs', 'rulesAlignment'].includes(k),
          ),
        );
      assert.deepEqual(rest(m.afterFace), rest(m.beforeFace));
      const reviewed = review.cards.find((v) => v.id === m.id);
      assert.equal(m.beforeFace.rulesText, reviewed.before);
      assert.equal(m.afterFace.rulesText, reviewed.proposed);
    }
    return p;
  })());
}
export async function preAbuFlowSource(file, bytes) {
  const p = await abuFlowDelta(),
    e = p.files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function abuFlowHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (f) => [
          path.relative(directory, f),
          hash(await preAbuFlowSource(path.relative(root, f), await readFile(f))),
        ]),
      ),
    ),
  );
}
export async function abuFlowAffected(set, task, original = false, group) {
  if (!['lea', 'leb', '2ed'].includes(set?.toLowerCase())) return false;
  const p = await abuFlowDelta();
  const members =
    original || task === 'references' ? p.members.filter((m) => m.wording) : p.members;
  const applicable = original
    ? task === 'rules'
    : ['references', 'rules', 'flavor', 'fullCard', 'release'].includes(task);
  return (
    applicable &&
    (!group ||
      !Array.isArray(group.printingIds) ||
      group.printingIds.some((id) => members.some((m) => m.id === id)))
  );
}
export async function abuFlowRuntimeCompatible(
  directory,
  expected,
  set,
  task,
  original = false,
  group,
) {
  if (directory !== 'games/magic/src') return false;
  const p = await abuFlowDelta();
  return (
    expected === p.beforeRenderer &&
    !(await abuFlowAffected(set, task, original, group)) &&
    (await (tree ??= sourceHash(path.join(root, directory)))) === p.afterRenderer &&
    (await (historical ??= abuFlowHistoricalHash())) === p.beforeRenderer
  );
}

/** Exact validation-tool source history, never a new calibration approval. */
export function preAbuFlowToolSource(file, bytes) {
  assert.equal(
    hash(JSON.stringify(flowTools)),
    '5898658cc9598b6cfb85ef15efb028c49dd6dcb46279ef973d95f47675a56475',
  );
  const entry = flowTools.files[file];
  if (!entry || hash(bytes) !== entry.after) return bytes;
  assert.equal(hash(entry.beforeSource), entry.before);
  return Buffer.from(entry.beforeSource);
}
