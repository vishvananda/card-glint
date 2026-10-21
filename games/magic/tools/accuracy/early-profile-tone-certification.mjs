// A tone-only extension to the immutable Unlimited crop certification.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import ts from 'typescript';
import { PNG } from 'pngjs';
import { restoreUnlimitedProfilePayload } from './unlimited-tone-payload.mjs';
import { hash, readJson, writeJson, sourceHash, root } from './common.mjs';
const [previousDirectory, nativeDirectory, candidateDirectory] = process.argv.slice(2);
assert(
  candidateDirectory,
  'Usage: early-profile-tone-certification.mjs PRIOR_NATIVE NATIVE CANDIDATE',
);
const dir = 'games/magic/fixtures/accuracy/early-through-fourth/';
const parentFile = dir + '2ed-crop-adoption.json';
const parentBytes = await readFile(parentFile),
  parent = JSON.parse(parentBytes);
const profileFile = 'games/magic/src/calibration/sets/2ed.ts';
const loaderFile = 'games/magic/tools/accuracy/calibration-unlimited-evidence.mjs';
const paths = {
  before: path.join(nativeDirectory, 'before-source.json'),
  previous: path.join(previousDirectory, 'capture.json'),
  capture: path.join(nativeDirectory, 'capture.json'),
  summary: path.join(nativeDirectory, 'summary.json'),
  inputs: path.join(nativeDirectory, 'inputs.json'),
  scores: path.join(nativeDirectory, 'scores.json'),
  candidates: path.join(candidateDirectory, 'capture.json'),
  color: path.join(candidateDirectory, 'color-metrics.json'),
  toneReview: dir + '2ed-dual-tone-review.json',
};
const documents = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([k, p]) => [k, await readFile(p, 'utf8')])),
);
const data = Object.fromEntries(Object.entries(documents).map(([k, v]) => [k, JSON.parse(v)]));
assert.equal(hash(JSON.stringify(data.before.map)), data.before.rendererHash);
assert.equal(data.before.rendererHash, parent.rendererHash);
const currentSource = await readFile(profileFile, 'utf8');
const profileFrom = async (source) => {
  const text = ts.transpile(source, {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
  });
  return (await import('data:text/javascript;base64,' + Buffer.from(text).toString('base64')))
    .profile;
};
const previousProfile = await profileFrom(data.before.beforeSource),
  profile = await profileFrom(currentSource);
const expected = structuredClone(previousProfile);
expected.revision = 3;
assert.equal(previousProfile.revision, 2);
const gain = data.toneReview.candidate.frameRGBScale;
assert.equal(data.toneReview.reviewerDirection.fitDenominator, 9);
assert.equal(data.toneReview.reviewerDirection.reportDenominator, 10);
assert.equal(data.toneReview.reviewerDirection.perCardToneOverrides, false);
for (const source of Object.values(expected.dualLand.sources))
  source.adjustment.frame.rgbScale = gain;
const accents = expected.dualLand.sources.B.adjustment.accents,
  outer = structuredClone(accents[0]);
outer.mask.rings = outer.mask.rings.slice(0, 1);
accents[0].mask.rings = accents[0].mask.rings.slice(1);
outer.adjustment.brightnessScale = 1.2;
accents.push(outer);
assert.deepEqual(profile, expected, 'Unreviewed profile or geometry change');
const sourceDirectory = path.join(root, 'games/magic/src');
const afterMap = await Promise.all(
  (await readdir(sourceDirectory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort()
    .map(async (f) => [path.relative(sourceDirectory, f), hash(await readFile(f))]),
);
const afterTreeHash = hash(JSON.stringify(afterMap));
assert.equal(afterTreeHash, await sourceHash(sourceDirectory));
assert.equal(afterTreeHash, data.capture.source.rendererHash);
const bm = new Map(data.before.map),
  am = new Map(afterMap);
assert.deepEqual([...bm.keys()], [...am.keys()]);
assert.deepEqual(
  [...bm.keys()].filter((k) => bm.get(k) !== am.get(k)),
  ['calibration/sets/2ed.ts', 'data/eager.ts', 'data/generated-manifest.json', 'data/sets/2ed.ts'],
);
const generatedRestoration = {};
for (const file of ['data/eager.ts', 'data/sets/2ed.ts']) {
  const actual = await readFile(path.join(sourceDirectory, file), 'utf8');
  const restored = await restoreUnlimitedProfilePayload(actual, previousProfile);
  assert.equal(hash(restored), bm.get(file), 'Unreviewed generated payload changes ' + file);
  generatedRestoration[file] = { beforeHash: hash(restored), afterHash: hash(actual) };
}
const manifestAfter = await readFile(
  path.join(sourceDirectory, 'data/generated-manifest.json'),
  'utf8',
);
const manifestBeforeData = JSON.parse(data.before.manifest),
  manifestAfterData = JSON.parse(manifestAfter);
assert.deepEqual(Object.keys(manifestBeforeData.files), Object.keys(manifestAfterData.files));
assert.deepEqual(
  Object.keys(manifestBeforeData.files)
    .filter((k) => manifestBeforeData.files[k] !== manifestAfterData.files[k])
    .sort(),
  ['games/magic/src/data/eager.ts', 'games/magic/src/data/sets/2ed.ts'],
);
assert.deepEqual(
  Object.keys(manifestBeforeData.sources).filter(
    (k) => manifestBeforeData.sources[k] !== manifestAfterData.sources[k],
  ),
  [profileFile],
);
const metadata = {
  generatedRestoration,
  manifestBefore: data.before.manifest,
  manifestAfter,
  beforeTreeHash: data.before.rendererHash,
  afterTreeHash,
  beforeMap: data.before.map,
  afterMap,
  beforeSource: data.before.beforeSource,
  afterSource: currentSource,
};
documents.metadata = JSON.stringify(metadata);
assert.equal(data.capture.completed, 302);
assert.equal(data.summary.nativeFaces, 906);
assert.equal(data.summary.unchangedFaces, 876);
assert.equal(data.summary.bodyLayoutsUnchanged, 906);
assert.deepEqual(data.summary.overflow, []);
assert.deepEqual(data.summary.faults, []);
assert.equal(hash(documents.previous), data.capture.source.previousCaptureHash);
assert.equal(hash(documents.inputs), data.capture.source.inputsHash);
assert.equal(hash(documents.candidates), data.capture.source.candidateCaptureHash);
assert.equal(hash(documents.capture), data.scores.source.finalCaptureHash);
assert.equal(data.scores.source.rendererHash, afterTreeHash);
const candidateIds = data.candidates.rows.map((r) => r.id).sort();
assert.equal(candidateIds.length, 10);
assert.equal(new Set(candidateIds).size, 10);
const changed = data.capture.rows
  .filter((r) => !r.variants.original.pixelsUnchanged)
  .map((r) => r.id)
  .sort();
assert.deepEqual(changed, candidateIds);
const rows = data.capture.rows.map((r) => {
  const prior = parent.rows.find((p) => p.id === r.id),
    old = data.previous.rows.find((p) => p.id === r.id),
    score = data.scores.rows.find((p) => p.id === r.id);
  assert(prior && old && score);
  assert.equal(r.referenceHash, prior.referenceHash);
  assert.equal(r.poseHash, prior.poseHash);
  assert.equal(r.variants.original.inputHash, prior.inputHash);
  assert.equal(old.variants.original.rasters.face, prior.nativeFaceHash);
  assert.equal(r.variants.original.rasters.face, score.renderHashes.candidate.face);
  for (const [mode, v] of Object.entries(r.variants)) {
    assert.equal(hash(JSON.stringify(v.input)), v.inputHash);
    assert.deepEqual(v.body, old.variants[mode].body);
    assert.equal(v.etchingUnchanged, true);
    assert.equal(v.body?.overflow ?? false, false);
  }
  const candidate = data.candidates.rows.find((p) => p.id === r.id);
  if (candidate) assert.equal(candidate.hash, r.variants.original.rasters.face);
  return { ...prior, nativeFaceHash: r.variants.original.rasters.face };
});
assert.equal(data.scores.reuse.unchanged, 292);
assert.equal(data.scores.reuse.fresh, 10);
const isolation = [];
for (const id of candidateIds) {
  const raws = await Promise.all(
    [
      path.join(previousDirectory, 'original', id + '.png'),
      path.join(nativeDirectory, 'original', id + '.png'),
    ].map((f) => readFile(f)),
  );
  const images = raws.map((b) => PNG.sync.read(b, { checkCRC: true }));
  let changes = 0,
    artChanges = 0;
  for (let y = 0; y < 1020; y++)
    for (let x = 0; x < 732; x++) {
      const p = (y * 732 + x) * 4;
      assert.equal(images[0].data[p + 3], images[1].data[p + 3]);
      if ([0, 1, 2].some((c) => images[0].data[p + c] !== images[1].data[p + c])) {
        changes++;
        if (x >= 100 && x < 630 && y >= 120 && y < 540) artChanges++;
      }
    }
  assert(changes > 0);
  assert.equal(artChanges, 0);
  isolation.push({
    id,
    changedPixels: changes,
    alphaUnchanged: true,
    interiorArtChanges: artChanges,
  });
}
const colors = data.color.rows.filter((r) => !r.excludedFromBackgroundFit);
assert.equal(colors.length, 9);
const colorMean = (parts, role) =>
  colors.reduce((n, r) => n + parts.reduce((s, p) => s + r.parts[p][role], 0) / parts.length, 0) /
  colors.length;
assert(
  colorMean(['left-paper', 'right-paper'], 'candidate') <
    colorMean(['left-paper', 'right-paper'], 'current'),
);
const blackIds = new Set([
  '5804dcd3-d41d-4cbd-9f8f-9736f2d37a64',
  'd66e43f0-1558-409f-8248-cc1d76c6bd8e',
  'bc98d888-4af3-43a3-b035-40c651057b6e',
]);
for (const r of colors.filter((r) => blackIds.has(r.id)))
  assert(r.parts['left-outer-line'].candidate < r.parts['left-outer-line'].current);
const tools = {};
for (const name of [
  'early-profile-tone-native.mjs',
  'early-profile-revision-score.mjs',
  'early-profile-tone-certification.mjs',
  'unlimited-dual-tone-study.mjs',
  'unlimited-tone-payload.mjs',
])
  tools[name] = await readFile('games/magic/tools/accuracy/' + name, 'utf8');
assert.equal(hash(tools['early-profile-tone-native.mjs']), data.capture.source.toolHash);
assert.equal(hash(tools['early-profile-revision-score.mjs']), data.scores.source.toolHash);
assert.equal(hash(tools['unlimited-dual-tone-study.mjs']), data.candidates.source.toolHash);
const archiveFile = dir + '2ed-tone-replay.json.gz';
const archive = gzipSync(
  JSON.stringify({
    schema: 1,
    set: '2ed',
    scope:
      '906 installed faces; fixed Original inputs/scan poses. Nine-scan shared background fit excludes one dark scan, which remains in every score denominator. Pigment improvement with disclosed contrast-sensitive structural regression. No external pixel assets.',
    parent: { file: parentFile, sha256: hash(parentBytes) },
    documents,
    documentHashes: Object.fromEntries(Object.entries(documents).map(([k, v]) => [k, hash(v)])),
    tools,
    isolation,
    profileProof: { before: previousProfile, after: profile },
  }),
  { level: 9 },
);
await writeFile(archiveFile, archive);
const guards = {};
const permitted = new Set([profileFile, loaderFile, 'games/magic/src/data/sets/2ed.ts']);
for (const [f, h] of Object.entries(parent.guards)) {
  const actual = hash(await readFile(f));
  if (!permitted.has(f)) assert.equal(actual, h, 'Changed shared dependency ' + f);
  guards[f] = actual;
}
for (const [n, v] of Object.entries(tools)) guards['games/magic/tools/accuracy/' + n] = hash(v);
const artifacts = {
  ...parent.artifacts,
  [parentFile]: hash(parentBytes),
  [archiveFile]: hash(archive),
  [paths.toneReview]: hash(documents.toneReview),
  [data.toneReview.evidence.archive]: hash(await readFile(data.toneReview.evidence.archive)),
};
const taskEvidence = structuredClone(parent.taskEvidence);
for (const t of Object.keys(taskEvidence)) taskEvidence[t] = [...taskEvidence[t], archiveFile];
const ledger = await readJson('games/magic/fixtures/accuracy/calibration-progress.json'),
  set = ledger.sets.find((s) => s.set === '2ed');
const receipt = {
  ...parent,
  reviewedAt: '2026-10-21',
  scope:
    'Unlimited revision3: nine-scan shared neutral dual background calibration, plus isolated charcoal outer ink on three duals. All302 Originals and604 Oracle faces replayed.292 printings, all body layouts, art interiors, silhouettes and etchings unchanged. Ten duals freshly scored, dark Volcanic scan retained in denominator. Structural-score tradeoff disclosed; no independent holdout claim.',
  parent: { file: parentFile, sha256: hash(parentBytes) },
  guards,
  artifacts,
  taskEvidence,
  rendererHash: afterTreeHash,
  nativeRendererHash: afterTreeHash,
  methodHash: hash(tools['early-profile-tone-certification.mjs']),
  nativeReplayHash: hash(documents.capture),
  metricsHash: hash(documents.scores),
  parametersHash: hash(JSON.stringify(profile)),
  summary: data.scores.summary.all,
  visualReview: paths.toneReview,
  metadataProof: archiveFile,
  groups: set.groups.map((g) => ({
    key: g.key,
    scopeHash: g.scopeHash,
    sourceHash: g.sourceHash,
    sourceHashes: g.sourceHashes,
    printingIds: g.printingIds,
  })),
  rows,
  pigmentDecision: {
    fitPrintings: 9,
    reportPrintings: 10,
    excludedFitId: '9dc7ab05-a5f5-4a02-87e7-3c47be35b5cb',
    backgroundMAE: {
      before: colorMean(['left-paper', 'right-paper'], 'current'),
      after: colorMean(['left-paper', 'right-paper'], 'candidate'),
    },
    blackOutlineScope: [...blackIds],
    structuralTradeoff: data.scores.summary.all.components.structural100,
    reason:
      'Accept independently measured pigment improvement without optimizing scan contrast thresholds or introducing printing-specific tones. No geometry or text-size changes.',
  },
};
await writeJson(dir + '2ed-tone-adoption.json', receipt);
console.log({
  nativeFaces: 906,
  unchanged: 292,
  changed: 10,
  pigment: receipt.pigmentDecision,
  release: 'pending',
});
