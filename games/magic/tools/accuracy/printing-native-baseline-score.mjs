// Offline full-card baseline scores from immutable native captures and scan poses.
// No renderer,Chromium or font loader is started. This does not certify a set.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [inputFile, captureFile, posesFile, metricFile, output] = process.argv.slice(2);
assert(
  output,
  'Usage: printing-native-baseline-score.mjs INPUTS CAPTURE POSES METRICS OUTPUT_DIRECTORY',
);
const files = [inputFile, captureFile, posesFile],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, capture, poses] = bytes.map((b) => JSON.parse(b)),
  metricGraph = await metricSourceGraph(path.resolve(metricFile)),
  preprocessingGraph = await metricSourceGraph(
    new URL('./pixels-pure.mjs', import.meta.url).pathname,
  ),
  { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile))),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  minimumCoverage = 0.65,
  definition = {
    schema: 1,
    set: inputs.set,
    inputHash: hash(bytes[0]),
    captureHash: hash(bytes[1]),
    posesHash: hash(bytes[2]),
    rendererHash: capture.rendererHash,
    metricGraph,
    preprocessingGraph,
    toolHash,
    node: process.version,
    decoderLockHash: hash(
      await fs.readFile(new URL('../../../../package-lock.json', import.meta.url)),
    ),
    minimumCoverage,
    scope:
      'Offline Original native baseline. Numerical pose acceptance is provisional pending visual frame review. Alignment/content failures remain in the census and cannot enter accepted-pose means. Coverage0.65 matches Lab ranking;no Lab eligibility or set certification is granted.',
  },
  definitionHash = hash(JSON.stringify(definition));
assert.equal(capture.status, 'complete');
assert.deepEqual(capture.faults, []);
assert.equal(capture.inputHash, definition.inputHash);
assert.equal(poses.inputHash, definition.inputHash);
assert.equal(poses.set, inputs.set);
assert.equal(poses.rows.length, inputs.entries.length);
const ids = inputs.entries.map((e) => e.id).sort();
assert.equal(new Set(ids).size, ids.length);
assert(
  ids.every((id) => /^[a-zA-Z0-9-]+$/.test(id)),
  'Unsafe printing ID',
);
for (const a of [capture.rows, poses.rows]) assert.deepEqual(a.map((r) => r.id).sort(), ids);
assert(inputs.entries.every((e) => e.face.wordingMode === 'original'));
const rowDirectory = path.join(output, 'rows'),
  manifestFile = path.join(output, 'definition.json');
await fs.mkdir(rowDirectory, { recursive: true });
try {
  const old = JSON.parse(await fs.readFile(manifestFile));
  assert.equal(
    old.definitionHash,
    definitionHash,
    'Use a new output after inputs,pixels,poses,metrics or decoder changes',
  );
  assert.deepEqual(old.definition, definition);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  await fs.writeFile(manifestFile, JSON.stringify({ definitionHash, definition }, null, 2) + '\n', {
    flag: 'wx',
  });
}
const start = performance.now(),
  rows = [];
let resumed = 0,
  fresh = 0;
for (const e of inputs.entries) {
  const n = capture.rows.find((r) => r.id === e.id),
    p = poses.rows.find((r) => r.id === e.id),
    native = n.modes.original,
    png = await fs.readFile(path.join(path.dirname(captureFile), native.file)),
    scan = await fs.readFile(objectFile(e.reference)),
    inputHash = hash(JSON.stringify(e.face)),
    poseHash = hash(JSON.stringify(p.transform));
  assert.equal(typeof p.accepted, 'boolean');
  assert.equal(n.referenceHash, e.reference.sha256);
  assert.equal(p.referenceHash, e.reference.sha256);
  assert.equal(hash(scan), e.reference.sha256);
  assert.equal(hash(png), native.sha256);
  assert.equal(native.inputHash, inputHash);
  const rowFile = path.join(rowDirectory, e.id + '.json');
  let cached;
  try {
    cached = JSON.parse(await fs.readFile(rowFile));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  let row;
  if (cached) {
    assert.equal(cached.definitionHash, definitionHash);
    assert.equal(hash(JSON.stringify(cached.row)), cached.rowHash, 'Corrupt baseline score row');
    row = cached.row;
    for (const [key, value] of Object.entries({
      id: e.id,
      referenceHash: e.reference.sha256,
      nativeHash: native.sha256,
      inputHash,
      poseHash,
    }))
      assert.equal(row[key], value);
    resumed++;
  } else {
    const score = scoreRegions(
      normalize(PNG.sync.read(scan), p.transform),
      normalize(PNG.sync.read(png)),
      e.card,
      { ...e.face, typeSource: 'Scan-reviewed type', rulesSource: 'Original printing source' },
    );
    const finite = Number.isFinite(score.structuralScore);
    if (finite) assert(score.structuralScore >= 0 && score.structuralScore <= 1);
    assert(Number.isFinite(score.coverage) && score.coverage >= 0 && score.coverage <= 1);
    const aggregateEligible = p.accepted && finite && score.coverage >= minimumCoverage,
      status = !p.accepted
        ? 'alignment-review'
        : aggregateEligible
          ? 'scored-diagnostic'
          : 'content-review';
    row = {
      id: e.id,
      name: e.name ?? e.card.name,
      material: e.material ?? 'unknown',
      cohort: p.cohort ?? null,
      referenceHash: e.reference.sha256,
      inputHash,
      poseHash,
      nativeHash: native.sha256,
      poseAccepted: p.accepted,
      aggregateEligible,
      status,
      score,
    };
    await fs.writeFile(
      rowFile,
      JSON.stringify({ definitionHash, rowHash: hash(JSON.stringify(row)), row }) + '\n',
      { flag: 'wx' },
    );
    fresh++;
  }
  rows.push(row);
  if (rows.length % 30 === 0)
    console.log('Native baseline scores', rows.length, '/', ids.length, 'resumed', resumed);
}
const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : null),
  summary = Object.fromEntries(
    ['all', ...new Set(rows.map((r) => r.material))].map((m) => {
      const rs = rows.filter((r) => m === 'all' || r.material === m),
        eligible = rs.filter((r) => r.aggregateEligible),
        diagnostic = rs.filter((r) => Number.isFinite(r.score.structuralScore));
      return [
        m,
        {
          cards: rs.length,
          acceptedPoses: rs.filter((r) => r.poseAccepted).length,
          rankedDiagnostics: eligible.length,
          alignmentReview: rs.filter((r) => r.status === 'alignment-review').length,
          contentReview: rs.filter((r) => r.status === 'content-review').length,
          acceptedPoseMean100: mean(eligible.map((r) => 100 * r.score.structuralScore)),
          allPoseDiagnosticMean100: mean(diagnostic.map((r) => 100 * r.score.structuralScore)),
          meanCoverage: mean(rs.map((r) => r.score.coverage)),
        },
      ];
    }),
  );
assert.deepEqual(await metricSourceGraph(path.resolve(metricFile)), metricGraph);
assert.deepEqual(
  await metricSourceGraph(new URL('./pixels-pure.mjs', import.meta.url).pathname),
  preprocessingGraph,
);
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  bytes.map(hash),
);
await writeJson(path.join(output, 'scores.json'), {
  schema: 1,
  set: inputs.set,
  status: 'complete-native-original-baseline-diagnostic',
  scope: definition.scope,
  definitionHash,
  definition,
  rendererHash: capture.rendererHash,
  inputHash: definition.inputHash,
  captureHash: definition.captureHash,
  posesHash: definition.posesHash,
  metricGraph,
  reuse: { resumed, fresh },
  summary,
  rows,
  elapsedSeconds: (performance.now() - start) / 1000,
  timingScope:
    'PNG decoding,CPU normalization and CPU metrics wall time;not GPU completion or card composition.',
});
console.log(JSON.stringify(summary));
