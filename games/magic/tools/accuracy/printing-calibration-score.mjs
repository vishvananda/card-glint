import { decoderLockMatches } from './decoder-lock.mjs';
import { reusablePrintingScore } from './printing-score-reuse.mjs';
// Diagnostic replay only: measured regions never certify a pending scan pose.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [
  inputFile,
  nativeDirectory,
  normalizationDirectory,
  metricFile,
  output,
  diagnostic,
  reuseFlag,
  reuseFile,
] = process.argv.slice(2);
assert(
  output && diagnostic === '--diagnostic' && (reuseFlag === undefined || reuseFlag === '--reuse'),
  'Usage: printing-calibration-score.mjs INPUTS NATIVE NORMALIZATION METRIC OUT --diagnostic [--reuse DESCRIPTOR]',
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
let reuse;
if (reuseFlag) {
  assert(reuseFile, 'Missing reuse descriptor');
  const descriptor = await read(reuseFile);
  assert.equal(descriptor.data.schema, 1);
  const d = descriptor.data;
  const prior = await read(path.join(d.scoreDirectory, 'scores.json'));
  const oldInput = await read(d.inputFile),
    oldNative = await read(path.join(d.nativeDirectory, 'capture.json'));
  assert.equal(prior.data.definition.inputsHash, hash(oldInput.bytes));
  assert.equal(prior.data.definition.nativeCaptureHash, hash(oldNative.bytes));
  assert.deepEqual(
    prior.data.definition.metricGraph,
    metricGraph,
    'Metric changed: rescore without reuse',
  );
  assert.deepEqual(
    prior.data.definition.preprocessingGraph,
    preprocessingGraph,
    'Preprocessing changed: rescore without reuse',
  );
  assert.equal(
    prior.data.definition.normalizationHash,
    hash(normalization.bytes),
    'Poses changed: rescore without reuse',
  );
  const lock = oldNative.data.source.helpers.find(([f]) => f === 'package-lock.json')?.[1];
  assert(lock, 'Missing decoder lock binding');
  assert(
    decoderLockMatches(
      await readFile(new URL('../../../../package-lock.json', import.meta.url)),
      lock,
      d.rootVersion,
    ),
    'Decoder dependencies changed: rescore without reuse',
  );
  assert.equal(
    oldNative.data.source.node,
    process.version,
    'Node runtime changed: rescore without reuse',
  );
  reuse = {
    directory: d.scoreDirectory,
    proof: {
      descriptorHash: hash(descriptor.bytes),
      scoresHash: hash(prior.bytes),
      definitionHash: prior.data.definitionHash,
      oldDecoderLock: lock,
    },
    rows: new Map(prior.data.rows.map((r) => [r.id, r])),
    entries: new Map(oldInput.data.entries.map((e) => [e.id, e])),
  };
}
const definition = {
  schema: 1,
  ...(reuse ? { reuse: reuse.proof } : {}),
  set: inputs.data.set,
  inputsHash: hash(inputs.bytes),
  nativeCaptureHash: hash(native.bytes),
  nativeRendererHash: native.data.source.rendererHash ?? null,
  normalizationHash: hash(normalization.bytes),
  metricGraph,
  preprocessingGraph,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  toolDependencies: await Promise.all(
    ['printing-score-reuse.mjs', 'decoder-lock.mjs'].map(async (file) => [
      file,
      hash(await readFile(new URL(file, import.meta.url))),
    ]),
  ),
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
    reusedMetrics: items.filter((r) => r.reusedFrom).length,
    measured: measured.length,
    acceptedPoses: items.filter((r) => r.poseAccepted).length,
    nonfoil: items.filter((r) => r.nonfoilEligible).length,
    meanStructure100: measured.length
      ? measured.reduce((n, r) => n + r.metric.structuralScore * 100, 0) / measured.length
      : null,
    meanRegionalCoverage: measured.length
      ? measured.reduce((n, r) => n + r.metric.coverage, 0) / measured.length
      : null,
    rejectedPoses: items.filter((r) => !r.poseAccepted).map((r) => r.id),
    missingRegionMaps: items
      .filter((r) => r.poseAccepted)
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
  const reusable = reuse?.rows.get(e.id);
  if (reuse && reusablePrintingScore(reusable, reuse.entries.get(e.id), e, face, pose, hash)) {
    const bytes = await readFile(path.join(reuse.directory, reusable.normalizedReference.file));
    assert.equal(
      hash(bytes),
      reusable.normalizedReference.sha256,
      'Changed reused normalized reference',
    );
    const file = 'references/' + e.id + '.png';
    await writeFile(path.join(output, file), bytes);
    rows.push({
      ...reusable,
      normalizedReference: { file, sha256: hash(bytes) },
      reusedFrom: {
        definitionHash: reuse.proof.definitionHash,
        scoresHash: reuse.proof.scoresHash,
      },
    });
    await save();
    continue;
  }
  const reference = normalize(
      PNG.sync.read(referenceBytes, { checkCRC: true }),
      pose.accepted ? pose.transform : {},
    ),
    render = normalize(PNG.sync.read(renderBytes, { checkCRC: true })),
    metric = pose.accepted
      ? scoreRegions(reference, render, e.card, e.face)
      : {
          structuralScore: null,
          coverage: 0,
          components: {},
          reason: 'Rejected scan normalization',
        };
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
