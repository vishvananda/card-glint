// Extend the immutable Unlimited receipt only after a complete installed replay.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import ts from 'typescript';
import { PNG } from 'pngjs';
import { hash, readJson, writeJson, sourceHash } from './common.mjs';
const [nativeDirectory, materialDirectory, candidateFile] = process.argv.slice(2);
assert(
  candidateFile,
  'Usage: early-profile-revision-certification.mjs NATIVE MATERIAL CANDIDATE_PROFILES',
);
const dir = 'games/magic/fixtures/accuracy/early-through-fourth/';
const parentFile = dir + '2ed-calibration-adoption.json',
  parentBytes = await readFile(parentFile),
  parent = JSON.parse(parentBytes);
const profileFile = 'games/magic/src/calibration/sets/2ed.ts',
  loaderFile = 'games/magic/tools/accuracy/calibration-unlimited-evidence.mjs';
const git = (...args) => execFileSync('git', args, { maxBuffer: 32e6 }).toString();
const previousProfileSource = git('show', 'v0.6.7:' + profileFile),
  currentProfileSource = await readFile(profileFile, 'utf8');
const literal = (node) => {
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) return literal(node.expression);
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (
    ts.isPrefixUnaryExpression(node) &&
    [ts.SyntaxKind.MinusToken, ts.SyntaxKind.PlusToken].includes(node.operator)
  )
    return (node.operator === ts.SyntaxKind.MinusToken ? -1 : 1) * literal(node.operand);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node))
    return Object.fromEntries(
      node.properties.map((p) => {
        assert(ts.isPropertyAssignment(p));
        assert(
          ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) || ts.isNumericLiteral(p.name),
        );
        return [p.name.text, literal(p.initializer)];
      }),
    );
  throw Error('Nonliteral profile data');
};
const profileFrom = (source) => {
  const ast = ts.createSourceFile(profileFile, source, ts.ScriptTarget.Latest, true);
  assert.equal(ast.parseDiagnostics.length, 0);
  for (const statement of ast.statements)
    if (ts.isVariableStatement(statement))
      for (const d of statement.declarationList.declarations)
        if (d.name.getText(ast) === 'profile') return literal(d.initializer);
  throw Error('Missing profile');
};
const previousProfile = profileFrom(previousProfileSource),
  profile = profileFrom(currentProfileSource);
const profiles = await readJson(candidateFile),
  selected = profiles.find((p) => p.name === 'bottom-0.65');
assert(selected);
const expected = structuredClone(selected.profile);
expected.revision = 2;
assert.deepEqual(profile, expected);
const reverted = structuredClone(profile);
reverted.revision = previousProfile.revision;
reverted.frames['L-dual'] = previousProfile.frames['L-dual'];
for (const color of ['W', 'U', 'B', 'R', 'G']) {
  const before = previousProfile.dualLand.sources[color],
    after = reverted.dualLand.sources[color];
  assert.deepEqual(JSON.parse(after.source)[1], profile.frames['L-dual'].frame);
  after.source = before.source;
  assert.equal(after.adjustment.accents.length, before.adjustment.accents.length + 1);
  const accent = after.adjustment.accents.pop();
  assert.equal(accent.adjustment.brightnessScale, before.adjustment.frame.brightnessScale * 0.65);
}
assert.deepEqual(reverted, previousProfile, 'Unreviewed runtime-profile changes');
assert.equal(
  await readFile(loaderFile, 'utf8'),
  git('show', 'v0.6.7:' + loaderFile).replace(
    '2ed-calibration-adoption.json',
    '2ed-crop-adoption.json',
  ),
);
const paths = {
  capture: path.join(nativeDirectory, 'capture.json'),
  summary: path.join(nativeDirectory, 'summary.json'),
  inputs: path.join(nativeDirectory, 'inputs.json'),
  scores: path.join(nativeDirectory, 'scores.json'),
  materials: path.join(materialDirectory, 'capture.json'),
  materialScores: path.join(materialDirectory, 'scores.json'),
  metadata: dir + '2ed-crop-review-metadata-proof.json',
  visual: dir + '2ed-crop-visual-review.json',
};
const documents = Object.fromEntries(
  await Promise.all(
    Object.entries(paths).map(async ([key, file]) => [key, await readFile(file, 'utf8')]),
  ),
);
const data = Object.fromEntries(
  Object.entries(documents).map(([key, text]) => [key, JSON.parse(text)]),
);
assert.equal(data.capture.completed, 302);
assert.equal(data.summary.nativeFaces, 906);
assert.equal(data.summary.bodyLayoutsUnchanged, 906);
assert.deepEqual(data.summary.overflow, []);
assert.equal(data.summary.unchangedFaces, 876);
assert.equal(hash(documents.capture), data.scores.source.finalCaptureHash);
assert.equal(hash(documents.inputs), data.scores.source.inputsHash);
assert.equal(hash(documents.capture), data.metadata.nativeCaptureHash);
assert.equal(data.metadata.beforeTreeHash, data.capture.source.rendererHash);
assert.equal(data.metadata.afterTreeHash, await sourceHash('games/magic/src'));
const stripReview = (text) => {
  const ast = ts.createSourceFile(profileFile, text, ts.ScriptTarget.Latest, true);
  for (const statement of ast.statements)
    if (ts.isVariableStatement(statement))
      for (const d of statement.declarationList.declarations)
        if (d.name.getText(ast) === 'review') {
          let n = d.initializer;
          while (ts.isAsExpression(n) || ts.isSatisfiesExpression(n)) n = n.expression;
          return text.slice(0, n.getStart(ast)) + '{}' + text.slice(n.end);
        }
  throw Error('Missing review metadata');
};
assert.equal(stripReview(data.metadata.beforeSource), stripReview(data.metadata.afterSource));
assert.equal(currentProfileSource, data.metadata.afterSource);
assert.equal(hash(JSON.stringify(data.metadata.beforeMap)), data.metadata.beforeTreeHash);
assert.equal(hash(JSON.stringify(data.metadata.afterMap)), data.metadata.afterTreeHash);
const beforeMap = new Map(data.metadata.beforeMap),
  afterMap = new Map(data.metadata.afterMap);
assert.deepEqual([...beforeMap.keys()], [...afterMap.keys()]);
assert.deepEqual(
  [...beforeMap.keys()].filter((f) => beforeMap.get(f) !== afterMap.get(f)),
  data.metadata.changedFiles,
);
assert.deepEqual(data.metadata.changedFiles, [
  'calibration/sets/2ed.ts',
  'data/generated-manifest.json',
]);
const bm = JSON.parse(data.metadata.manifestBefore),
  am = JSON.parse(data.metadata.manifestAfter);
assert.deepEqual(bm.files, am.files);
const sourceChanges = Object.keys(bm.sources).filter((f) => bm.sources[f] !== am.sources[f]);
assert.deepEqual(sourceChanges, [profileFile]);
assert.equal(data.visual.reviewedFullCards, 10);
assert.equal(data.visual.reviewedCornerPairs, 10);
assert.equal(data.visual.result, 'crop-and-lower-bevel-accepted');
const priorRows = new Map(parent.rows.map((r) => [r.id, r]));
const rows = data.capture.rows.map((r) => {
  const old = priorRows.get(r.id);
  assert(old);
  assert.equal(r.referenceHash, old.referenceHash);
  assert.equal(r.poseHash, old.poseHash);
  const score = data.scores.rows.find((s) => s.id === r.id);
  assert(score);
  assert.equal(score.renderHashes.candidate.face, r.variants.original.rasters.face);
  assert.equal(score.inputHash, r.variants.original.inputHash);
  assert.equal(r.variants.original.inputHash, old.inputHash);
  for (const v of Object.values(r.variants)) {
    assert.equal(v.body?.overflow ?? false, false);
    assert.equal(hash(JSON.stringify(v.input)), v.inputHash);
  }
  return { ...old, nativeFaceHash: r.variants.original.rasters.face };
});
assert.equal(new Set(rows.map((r) => r.id)).size, 302);
const changed = data.capture.rows
  .filter((r) => !r.variants.original.pixelsUnchanged)
  .map((r) => r.id)
  .sort();
assert.equal(changed.length, 10);
assert.deepEqual(changed, data.materials.rows.map((r) => r.id).sort());
for (const row of data.materials.rows) {
  assert.equal(row.referenceHash, priorRows.get(row.id).referenceHash);
  assert.equal(row.poseHash, priorRows.get(row.id).poseHash);
  assert.equal(
    row.variants.find((v) => v.name === 'current').hash,
    priorRows.get(row.id).nativeFaceHash,
  );
  assert.equal(
    row.variants.find((v) => v.name === 'bottom-0.65').hash,
    rows.find((r) => r.id === row.id).nativeFaceHash,
  );
}
assert.equal(data.scores.reuse.unchanged, 292);
assert.equal(data.scores.reuse.fresh, 10);
assert.equal(data.scores.summary.all.components.structural100.improved, 10);
assert.equal(data.scores.summary.all.components.structural100.regressed, 0);
const materialIsolation = [];
for (const row of data.materials.rows) {
  const paths = ['crop', 'bottom-0.65'].map((mode) =>
    path.join(materialDirectory, mode, row.id + '.png'),
  );
  const raw = await Promise.all(paths.map((file) => readFile(file)));
  const images = raw.map((bytes) => PNG.sync.read(bytes, { checkCRC: true }));
  const variants = ['crop', 'bottom-0.65'].map((name) => row.variants.find((v) => v.name === name));
  raw.forEach((bytes, i) => assert.equal(hash(bytes), variants[i].hash));
  assert.deepEqual(
    images.map((im) => [im.width, im.height]),
    [
      [732, 1020],
      [732, 1020],
    ],
  );
  let count = 0,
    left = 732,
    right = 0,
    top = 1020,
    bottom = 0;
  for (let y = 0; y < 1020; y++)
    for (let x = 0; x < 732; x++) {
      const at = (y * 732 + x) * 4;
      assert.equal(images[0].data[at + 3], images[1].data[at + 3]);
      if ([0, 1, 2].some((c) => images[0].data[at + c] !== images[1].data[at + c])) {
        assert(y >= 969 && y < 982, 'Bevel correction escaped the lower frame band');
        count++;
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
  assert(count > 0);
  materialIsolation.push({
    id: row.id,
    changedPixels: count,
    bounds: [left, top, right - left + 1, bottom - top + 1],
    alphaUnchanged: true,
    outsideLowerBand: 0,
  });
}
const tools = {};
for (const name of [
  'early-profile-revision-native.mjs',
  'early-profile-revision-score.mjs',
  'early-profile-review-metadata.mjs',
  'early-profile-revision-certification.mjs',
])
  tools[name] = await readFile('games/magic/tools/accuracy/' + name, 'utf8');
assert.equal(hash(tools['early-profile-revision-native.mjs']), data.capture.source.toolHash);
assert.equal(hash(tools['early-profile-revision-score.mjs']), data.scores.source.toolHash);
assert.equal(hash(tools['early-profile-review-metadata.mjs']), data.metadata.toolHash);
const archiveFile = dir + '2ed-crop-replay.json.gz';
const archive = gzipSync(
  JSON.stringify({
    schema: 1,
    set: '2ed',
    scope:
      'All302 frozen Original printings and604 Oracle faces; source/profile-only revision, ten changed duals,292 unchanged printings. Historical receipts are immutable. No image/font assets.',
    parent: { file: parentFile, sha256: hash(parentBytes) },
    documents,
    documentHashes: Object.fromEntries(Object.entries(documents).map(([k, v]) => [k, hash(v)])),
    tools,
    materialIsolation,
    profileProof: {
      beforeRef: git('rev-parse', 'v0.6.7^{commit}').trim(),
      beforeFileHash: hash(previousProfileSource),
      afterFileHash: hash(currentProfileSource),
      before: previousProfile,
      after: profile,
      changedPrintings: changed,
    },
  }),
  { level: 9 },
);
await writeFile(archiveFile, archive);
const guards = {};
for (const [file, expectedHash] of Object.entries(parent.guards)) {
  const actual = hash(await readFile(file));
  if (![profileFile, loaderFile, 'games/magic/src/data/sets/2ed.ts'].includes(file))
    assert.equal(actual, expectedHash, 'Unreviewed shared dependency ' + file);
  guards[file] = actual;
}
for (const name of Object.keys(tools))
  guards['games/magic/tools/accuracy/' + name] = hash(tools[name]);
const artifacts = {
  ...parent.artifacts,
  [parentFile]: hash(parentBytes),
  [archiveFile]: hash(archive),
  [paths.metadata]: hash(documents.metadata),
  [paths.visual]: hash(documents.visual),
};
const taskEvidence = structuredClone(parent.taskEvidence);
for (const task of Object.keys(taskEvidence))
  taskEvidence[task] = [...taskEvidence[task], archiveFile];
const ledger = await readJson('games/magic/fixtures/accuracy/calibration-progress.json'),
  set = ledger.sets.find((s) => s.set === '2ed');
const receipt = {
  ...parent,
  reviewedAt: '2026-10-21',
  scope:
    'All302 ordinary Unlimited printings under revision2. Native replay covers302 Originals and604 Oracle faces with unchanged words, artist, body layout and decoded assets. Ten dual crops/lower bezels change;292 printings remain byte-identical. Separate outer-edge diagnostics and full/corner visual review accompany the structural index. Complete source census; no held-out or unseen-transfer claim.',
  parent: { file: parentFile, sha256: hash(parentBytes) },
  guards,
  artifacts,
  taskEvidence,
  rendererHash: data.metadata.afterTreeHash,
  nativeRendererHash: data.capture.source.rendererHash,
  methodHash: hash(tools['early-profile-revision-certification.mjs']),
  nativeReplayHash: hash(documents.capture),
  metricsHash: hash(documents.scores),
  parametersHash: hash(JSON.stringify(profile)),
  native: {
    original: 302,
    oracle: 604,
    historicalControls: 302,
    overflow: 0,
    artistOnlyOriginalChanges: 0,
    historicalArtistCorrections: parent.native.artistOnlyOriginalChanges,
    unchangedOriginalFaces: 292,
    changedDualPrintings: 10,
    bodyLayoutsUnchanged: 906,
    etchingUnchanged: 906,
  },
  summary: data.scores.summary.all,
  visualReview: paths.visual,
  metadataProof: paths.metadata,
  groups: set.groups.map((g) => ({
    key: g.key,
    scopeHash: g.scopeHash,
    sourceHash: g.sourceHash,
    sourceHashes: g.sourceHashes,
    printingIds: g.printingIds,
  })),
  rows,
};
await writeJson(dir + '2ed-crop-adoption.json', receipt);
console.log({
  members: rows.length,
  changedDuals: 10,
  unchanged: 292,
  score: receipt.summary.components.structural100.afterMean,
  archiveHash: hash(archive),
  release: 'pending',
});
