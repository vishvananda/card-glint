/** Package observed-population certification; external pixels remain in the local cache. */
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, readJson, sourceHash, writeJson } from './common.mjs';
const directory = 'games/magic/fixtures/accuracy/early-through-fourth/';
const stage = await readJson(directory + '2ed-stage.json');
const finalFile = directory + '2ed-final-release-replay.json.gz';
const finalBytes = await readFile(finalFile);
assert.equal(hash(finalBytes), stage.evidence['2ed-final-release-replay'].sha256);
const archive = JSON.parse(gunzipSync(finalBytes));
for (const [key, text] of Object.entries(archive.documents))
  assert.equal(hash(text), archive.documentHashes[key]);
const { capture, summary, inputs, scores } = Object.fromEntries(
  Object.entries(archive.documents).map(([k, text]) => [k, JSON.parse(text)]),
);
assert.equal(capture.completed, 302);
assert.equal(capture.source.rendererHash, await sourceHash('games/magic/src'));
assert.equal(summary.nativeFaces, 906);
assert.equal(summary.controlFaces, 302);
assert.equal(summary.historicalOriginalPixelMatches, 302);
assert.equal(summary.artistOnlyOriginalChanges, 13);
assert.equal(summary.unchangedOriginalFaces, 289);
assert.deepEqual(summary.overflow, []);
assert.equal(scores.source.finalCaptureHash, hash(archive.documents.capture));
assert.equal(scores.source.finalInputsHash, hash(archive.documents.inputs));
const visualFile = directory + '2ed-visual-normalization-review.json';
const visualBytes = await readFile(visualFile);
const visual = JSON.parse(visualBytes);
assert.equal(stage.normalization.visualCertificationPending, false);
assert(visual.result && visual.limitations.length >= 3);
assert.deepEqual(visual.pages.flatMap((p) => p.ids).sort(), scores.rows.map((r) => r.id).sort());
assert.equal(new Set(scores.rows.map((r) => r.id)).size, 302);
assert(scores.rows.every((r) => r.numericallyAccepted && r.wordingMode === 'original'));
const artifacts = Object.fromEntries(
  await Promise.all(
    Object.values(stage.evidence).map(async ({ file, sha256 }) => {
      assert.equal(hash(await readFile(file)), sha256, 'Changed historical evidence ' + file);
      return [file, sha256];
    }),
  ),
);
artifacts[visualFile] = hash(visualBytes);
// Conservative shared early-painter guards; unrelated set profile/data modules
// are excluded. A future shared painter edit needs a scoped parity receipt.
const shared =
  /^(?:retro-|early-|historical-|historic-|mana-|symbol-|rules-|text-|printing-|calibration-|canvas-|face-|illustration-|alpha-|legacy-calibrated|short-centered|flavor-|profile\.)/;
const sourceFiles = (await readdir('games/magic/src/presentation'))
  .filter((f) => f.endsWith('.ts') && shared.test(f))
  .map((f) => 'games/magic/src/presentation/' + f);
sourceFiles.push(
  ...(await readdir('games/magic/src/calibration'))
    .filter((f) => f.endsWith('.ts'))
    .map((f) => 'games/magic/src/calibration/' + f),
  'games/magic/src/calibration/sets/2ed.ts',
  'games/magic/src/data/sets/2ed.ts',
  'games/magic/tools/accuracy/adapter.mjs',
  'games/magic/tools/accuracy/printed-artist.mjs',
  'games/magic/tools/accuracy/early-printing-inputs.mjs',
  'games/magic/tools/accuracy/printing-text.mjs',
  'games/magic/tools/accuracy/early-profile-certification.mjs',
  'games/magic/tools/accuracy/calibration-unlimited-evidence.mjs',
  'games/magic/tools/accuracy/calibration-census.mjs',
);
const guards = Object.fromEntries(
  await Promise.all(sourceFiles.sort().map(async (f) => [f, hash(await readFile(f))])),
);
const taskEvidence = {
  references: [
    '2ed-reviewed-inputs',
    '2ed-type-review',
    '2ed-body-current-input-audit',
    '2ed-original-cost-verification',
  ],
  normalization: ['2ed-reviewed-normalization', '2ed-outer-boundaries', '2ed-joint-measure'],
  frameGeometry: [
    '2ed-stock-mask-verification',
    '2ed-joint-measure',
    '2ed-basic-land-native-verification',
    '2ed-dual-land-verification',
  ],
  frameColor: [
    '2ed-native-color-verification',
    '2ed-land-color-native-verification',
    '2ed-land-material-replay',
  ],
  paperColor: [
    '2ed-native-color-verification',
    '2ed-dual-paper-compromise',
    '2ed-land-material-replay',
  ],
  blackLevels: ['2ed-keyline-selection', '2ed-land-color-native-verification'],
  manaGeometry: [
    '2ed-mana-disc-fit',
    '2ed-mana-component-verification',
    '2ed-mana-number-verification',
    '2ed-mana-all-verification',
  ],
  manaColor: [
    '2ed-mana-ink-verification',
    '2ed-mana-all-verification',
    '2ed-mana-pigment-verification',
  ],
  headings: ['2ed-heading-local-selection', '2ed-profile-integration-replay'],
  rules: ['2ed-body-current-native-verification', '2ed-body-current-input-audit'],
  flavor: ['2ed-body-current-native-verification', '2ed-body-current-input-audit'],
  artist: ['2ed-heading-local-selection', '2ed-profile-integration-replay'],
  footer: ['2ed-profile-integration-replay'],
  stats: ['2ed-profile-integration-replay'],
  specialComponents: [
    '2ed-basic-land-native-verification',
    '2ed-land-accent-native-verification',
    '2ed-dual-pinline-palette-replay',
  ],
  fullCard: ['2ed-final-release-replay'],
};
for (const keys of Object.values(taskEvidence))
  for (const key of keys) assert(stage.evidence[key], key);
const byId = new Map(inputs.entries.map((e) => [e.id, e]));
const rows = scores.rows.map((row) => {
  const e = byId.get(row.id),
    native = capture.rows.find((n) => n.id === row.id);
  assert(e && native);
  assert.equal(native.variants.original.inputHash, row.afterInputHash);
  assert.equal(native.variants.original.rasters.face, row.renderHashes.candidate.face);
  return {
    id: row.id,
    name: row.name,
    referenceHash: row.referenceHash,
    poseHash: row.poseHash,
    inputHash: row.afterInputHash,
    nativeFaceHash: row.renderHashes.candidate.face,
  };
});
const ledger = await readJson('games/magic/fixtures/accuracy/calibration-progress.json');
const set = ledger.sets.find((s) => s.set === '2ed');
assert.equal(set.inventory.ordinaryPrintings, 302);
assert.deepEqual(set.groups.flatMap((g) => g.printingIds).sort(), rows.map((r) => r.id).sort());
const receipt = {
  schema: 1,
  set: '2ed',
  reviewedAt: visual.reviewedAt,
  scope:
    'Complete observed ordinary nonfoil population. Shared per-set/material options, no per-card renderer offsets. This is a reused source census, not unseen-printing validation or pixel perfection. Release remains pending until checked publication.',
  guards,
  artifacts,
  taskEvidence: Object.fromEntries(
    Object.entries(taskEvidence).map(([k, keys]) => [
      k,
      keys.map((key) => stage.evidence[key].file),
    ]),
  ),
  rendererHash: capture.source.rendererHash,
  methodHash: hash(await readFile(new URL(import.meta.url))),
  nativeReplayHash: hash(archive.documents.capture),
  metricsHash: hash(archive.documents.scores),
  parametersHash: guards['games/magic/src/calibration/sets/2ed.ts'],
  scanTemplateHash: stage.normalization.templateHash,
  native: {
    original: 302,
    oracle: 604,
    historicalControls: 302,
    overflow: 0,
    artistOnlyOriginalChanges: 13,
  },
  summary: scores.summary.all,
  metricCoverage:
    'Credits/legal are diagnostic-only and excluded from the structural aggregate. Physical artist strings, placement/ink and the absence of a separate legal line have separate regional/native evidence.',
  visualReview: visualFile,
  groups: set.groups.map((g) => ({
    key: g.key,
    scopeHash: g.scopeHash,
    sourceHash: g.sourceHash,
    sourceHashes: g.sourceHashes,
    printingIds: g.printingIds,
  })),
  rows,
};
await writeJson(directory + '2ed-calibration-adoption.json', receipt);
console.log(
  'Unlimited certification packaged:302 members,27 variants,16 applicable task evidence families; release pending.',
);
