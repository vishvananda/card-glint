// Freeze the exact reviewed flow/code/data delta without relabeling older native captures.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { gzipSync, gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
import { validateAbuFlowData, flowDataFiles, flowRuntimeFiles } from './abu-flow-data-check.mjs';
const [referenceRoot, nativeDir, beforeFile, afterFile, inputProofFile] = process.argv.slice(2);
assert(
  inputProofFile,
  'Usage: record-abu-flow-delta.mjs REFERENCE NATIVE BEFORE AFTER INPUT_PROOF',
);
const nb = await readFile(path.join(nativeDir, 'proof.json')),
  native = JSON.parse(nb);
const ib = await readFile(inputProofFile),
  input = JSON.parse(ib),
  bb = await readFile(beforeFile),
  ab = await readFile(afterFile);
assert.equal(native.status, 'complete-native-abu-flow-and-wording-census');
assert.equal(native.completed, 899);
assert.equal(native.source.closed, true);
assert.equal(hash(bb), native.source.beforeInputHash);
assert.equal(hash(ab), native.source.afterInputHash);
assert.equal(hash(ib), native.source.inputProofHash);
assert.equal(
  native.source.beforeRenderer,
  await sourceHash(path.join(referenceRoot, 'games/magic/src')),
);
assert.equal(native.source.afterRenderer, await sourceHash('games/magic/src'));
const listed = async (dir) =>
  (await readdir(path.join(dir, 'games/magic/src'), { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.relative(dir, path.join(e.parentPath, e.name)))
    .sort();
const names = await listed(root);
assert.deepEqual(names, await listed(referenceRoot));
const files = {},
  after = {};
for (const file of [...new Set([...names, ...flowDataFiles])].sort()) {
  const b = await readFile(path.join(referenceRoot, file), 'utf8'),
    a = await readFile(path.join(root, file), 'utf8');
  if (hash(b) !== hash(a)) {
    files[file] = { before: hash(b), after: hash(a), beforeSource: b };
    after[file] = a;
  }
}
assert.deepEqual(Object.keys(files).sort(), [...flowDataFiles, ...flowRuntimeFiles].sort());
const base = 'games/magic/fixtures/accuracy/early-through-fourth/',
  reviewFile = base + 'abu-stasis-source-review.json',
  rb = await readFile(reviewFile),
  review = JSON.parse(rb);
const p = {
  schema: 1,
  beforeRenderer: native.source.beforeRenderer,
  afterRenderer: native.source.afterRenderer,
  scope:
    'Scoped Original ABU flow policy plus three independently read Stasis wording corrections. Full native899 census, exact refined candidates, unchanged Oracle/art/mask planes, and finite pure-data restoration preserve historical identities. Projection is source history, not calibration approval.',
  files,
  members: native.eligible,
  sourceChangedIds: native.sourceChangedIds,
  review: { file: reviewFile, sha256: hash(rb) },
  validationSource: {
    file: 'games/magic/tools/accuracy/abu-flow-data-check.mjs',
    sha256: hash(await readFile(new URL('./abu-flow-data-check.mjs', import.meta.url))),
  },
  parent: {
    file: base + 'abu-art-native.json.gz',
    contentSha256: hash(gunzipSync(await readFile(base + 'abu-art-native.json.gz'))),
  },
  study: {
    file: base + 'abu-refined-flow-trials.json.gz',
    sha256: hash(await readFile(base + 'abu-refined-flow-trials.json.gz')),
  },
  toolHash: hash(await readFile(new URL(import.meta.url))),
};
p.summary = validateAbuFlowData(p, after, review);
assert.deepEqual(p.summary, {
  wordingPrintings: 2962,
  changedRulesPrintings: 3,
  unchangedArtists: 222,
  changedSets: ['lea', 'leb', '2ed'],
});
const save = async (file, raw, tool) => {
  const zipped = gzipSync(raw, { mtime: 0 });
  await writeFile(file, zipped);
  return {
    file,
    sha256: hash(zipped),
    contentSha256: hash(raw),
    tool,
    toolSha256: hash(await readFile(tool)),
  };
};
p.native = await save(
  base + 'abu-flow-native.json.gz',
  nb,
  'games/magic/tools/accuracy/abu-flow-native.mjs',
);
p.inputs = await save(
  base + 'abu-flow-inputs.json.gz',
  ib,
  'games/magic/tools/accuracy/abu-flow-inputs.mjs',
);
assert.equal(input.source.rendererHash, p.afterRenderer);
assert.equal(input.source.closed, true);
assert.equal(input.rows.length, 899);
p.wordingMembers = JSON.parse(ab)
  .entries.filter((e) => p.sourceChangedIds.includes(e.id))
  .map((e) => ({
    id: e.id,
    beforeFace: JSON.parse(bb).entries.find((v) => v.id === e.id).face,
    afterFace: e.face,
  }));
const file = base + 'abu-flow-source-delta.json.gz',
  bytes = gzipSync(Buffer.from(JSON.stringify(p) + '\n'), { mtime: 0 });
await writeFile(file, bytes);
console.log(
  JSON.stringify({
    file,
    sha256: hash(bytes),
    before: p.beforeRenderer,
    after: p.afterRenderer,
    members: p.members.length,
    summary: p.summary,
  }),
);
