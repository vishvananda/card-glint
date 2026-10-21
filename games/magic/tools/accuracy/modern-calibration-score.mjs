// Diagnostic replay only: measured regions never certify a pending scan pose.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [inputFile, nativeDirectory, normalizationDirectory, metricFile, output, diagnostic] =
  process.argv.slice(2);
assert(
  output && diagnostic === '--diagnostic',
  'Usage: modern-calibration-score.mjs INPUTS NATIVE NORMALIZATION METRIC OUT --diagnostic',
);
const read = async (file) => {
  const bytes = await readFile(file);
  return { bytes, data: JSON.parse(bytes) };
};
const inputs = await read(inputFile),
  nativeInputs = await read(path.join(nativeDirectory, 'inputs.json')),
  native = await read(path.join(nativeDirectory, 'capture.json')),
  normalization = await read(path.join(normalizationDirectory, 'normalization.json'));
assert.equal(hash(inputs.bytes), hash(nativeInputs.bytes));
assert.equal(hash(inputs.bytes), native.data.source.inputsHash);
assert.equal(native.data.completed, inputs.data.entries.length);
assert.equal(native.data.rows.length, inputs.data.entries.length);
assert.equal(normalization.data.summary.completed, inputs.data.entries.length);
assert.equal(normalization.data.rows.length, inputs.data.entries.length);
assert.deepEqual(native.data.faults, []);
for (const entries of [inputs.data.entries, native.data.rows, normalization.data.rows])
  assert.equal(
    new Set(entries.map((r) => r.id)).size,
    inputs.data.entries.length,
    'Complete unique census required',
  );
const metricGraph = await metricSourceGraph(metricFile),
  preprocessingGraph = await metricSourceGraph(
    new URL('./pixels-pure.mjs', import.meta.url).pathname,
  ),
  { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile)));
const definition = {
  schema: 1,
  set: inputs.data.set,
  inputsHash: hash(inputs.bytes),
  nativeCaptureHash: hash(native.bytes),
  nativeRendererHash: native.data.source.rendererHash ?? null,
  normalizationHash: hash(normalization.bytes),
  metricGraph,
  preprocessingGraph,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  scope:
    'Complete native Original census, with each reference transformed using its frozen comparison-only scan matrix. Every reference and native face is hash-checked. Unaccepted poses, unsupported scoring maps and foil-only references stay visible in the denominator. Scores are regional structure indices out of100, with explicit coverage, not percentages of visual fidelity. This diagnostic does not approve pending normalization, unverified wording, or set completion.',
};
const definitionHash = hash(JSON.stringify(definition));
await mkdir(output, { recursive: true });
await mkdir(path.join(output, 'references'), { recursive: true });
let rows = [];
try {
  const prior = await read(path.join(output, 'scores.json'));
  assert.equal(
    prior.data.definitionHash,
    definitionHash,
    'Use a new directory after source changes',
  );
  rows = prior.data.rows;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const aggregate = (items) => {
  const measured = items.filter((r) => r.metric?.structuralScore != null);
  return {
    total: items.length,
    measured: measured.length,
    acceptedPoses: items.filter((r) => r.poseAccepted).length,
    nonfoil: items.filter((r) => r.nonfoilEligible).length,
    meanStructure100: measured.length
      ? measured.reduce((n, r) => n + r.metric.structuralScore * 100, 0) / measured.length
      : null,
    meanRegionalCoverage: measured.length
      ? measured.reduce((n, r) => n + r.metric.coverage, 0) / measured.length
      : null,
    missingRegionMaps: items
      .filter(
        (r) =>
          !Object.keys(r.metric?.components ?? {}).some((k) => r.metric.components[k].applicable),
      )
      .map((r) => r.id),
  };
};
const save = () =>
  writeJson(path.join(output, 'scores.json'), {
    definition,
    definitionHash,
    status: 'diagnostic-only-unapproved-normalization',
    eligibleForPublication: false,
    summary: aggregate(rows),
    families: Object.fromEntries(
      [...new Set(rows.map((r) => r.geometry))]
        .sort()
        .map((f) => [f, aggregate(rows.filter((r) => r.geometry === f))]),
    ),
    rows,
  });
for (const e of inputs.data.entries) {
  assert.equal(e.face.wordingMode, 'original');
  const face = native.data.rows.find((r) => r.id === e.id),
    pose = normalization.data.rows.find((r) => r.id === e.id);
  assert(face && pose && !face.issue);
  assert.equal(face.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(face.referenceHash, e.reference.sha256);
  assert.equal(pose.referenceHash, e.reference.sha256);
  const referenceBytes = await readFile(objectFile(e.reference)),
    renderBytes = await readFile(path.join(nativeDirectory, face.layers.face.file));
  assert.equal(hash(referenceBytes), e.reference.sha256);
  assert.equal(hash(renderBytes), face.layers.face.sha256);
  const prior = rows.find((r) => r.id === e.id);
  if (prior) {
    assert.equal(prior.referenceHash, e.reference.sha256);
    assert.equal(prior.renderHash, face.layers.face.sha256);
    assert.equal(prior.inputHash, face.inputHash);
    assert.equal(prior.poseHash, hash(JSON.stringify(pose.transform)));
    const b = await readFile(path.join(output, prior.normalizedReference.file));
    assert.equal(hash(b), prior.normalizedReference.sha256, 'Cached normalized raster changed');
    continue;
  }
  const reference = normalize(PNG.sync.read(referenceBytes, { checkCRC: true }), pose.transform),
    render = normalize(PNG.sync.read(renderBytes, { checkCRC: true })),
    metric = scoreRegions(reference, render, e.card, e.face);
  const png = new PNG({ width: reference.width, height: reference.height });
  png.data = Buffer.from(reference.data);
  const normalizedBytes = PNG.sync.write(png),
    file = 'references/' + e.id + '.png';
  await writeFile(path.join(output, file), normalizedBytes);
  rows.push({
    id: e.id,
    name: e.card.name,
    number: e.card.collector_number,
    geometry: pose.geometry,
    family: pose.family,
    rarity: e.card.rarity,
    referenceHash: e.reference.sha256,
    renderHash: face.layers.face.sha256,
    inputHash: face.inputHash,
    poseHash: hash(JSON.stringify(pose.transform)),
    poseAccepted: pose.accepted,
    nonfoilEligible: e.card.finishes.includes('nonfoil'),
    normalizedReference: { file, sha256: hash(normalizedBytes) },
    metric,
  });
  await save();
  if (rows.length % 25 === 0)
    console.log('diagnostic scores', rows.length, '/', inputs.data.entries.length);
}
assert.equal(rows.length, inputs.data.entries.length);
assert.deepEqual(await metricSourceGraph(metricFile), metricGraph, 'Metric changed during run');
await save();
console.log(JSON.stringify(aggregate(rows)));
