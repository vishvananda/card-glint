// Whole-card regional scores use a supplied, hash-bound host metric.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [directory, installedDirectory, scorerFile, cacheFile, output] = process.argv.slice(2);
assert(
  output,
  'Usage: early-profile-final-score.mjs BASE_NATIVE INSTALLED_NATIVE SCORER CACHE OUTPUT',
);
const raw = await Promise.all(
  ['capture.json', 'inputs.json'].map((f) => readFile(path.join(directory, f))),
);
const [capture, inputs] = raw.map((b) => JSON.parse(b));
assert.equal(capture.completed, 302);
assert.equal(capture.rows.length, 302);
assert.equal(inputs.entries.length, 302);
const graph = await metricSourceGraph(scorerFile),
  { scoreRegions } = await import(pathToFileURL(path.resolve(scorerFile))),
  rows = [];
const finalRaw = await Promise.all(
  ['capture.json', 'inputs.json'].map((f) => readFile(path.join(installedDirectory, f))),
);
const [installed, finalInputs] = finalRaw.map((b) => JSON.parse(b));
assert.equal(installed.completed, 302);
assert.equal(finalInputs.entries.length, 302);
const cachedRaw = await readFile(cacheFile),
  cache = JSON.parse(cachedRaw);
assert.equal(cache.source.nativeCaptureHash, hash(raw[0]));
assert.equal(cache.source.nativeInputsHash, hash(raw[1]));
const preprocessGraph = await metricSourceGraph(
  new URL('./pixels-pure.mjs', import.meta.url).pathname,
);
// The host metric imports byte-identical pixel/matrix helpers. This proves the
// older cache already binds our preprocessing, rather than assuming it did.
const embedded = preprocessGraph.sources.every(([file, digest]) =>
  graph.sources.some(([name, h]) => name.endsWith('/accuracy/' + file) && h === digest),
);
const reusable = embedded && JSON.stringify(cache.source.metricGraph) === JSON.stringify(graph);

if (cache.source.finalInputsHash !== undefined) {
  assert.equal(cache.source.finalInputsHash, hash(finalRaw[1]));
  assert.equal(cache.source.finalCaptureHash, hash(finalRaw[0]));
}
const reuse = { current: 0, candidate: 0, freshCurrent: 0, freshCandidate: 0 };
const source = {
  schema: 1,
  nativeCaptureHash: hash(raw[0]),
  nativeInputsHash: hash(raw[1]),
  rendererHash: installed.source.rendererHash,
  previousNativeRendererHash: capture.source.rendererHash,
  finalCaptureHash: hash(finalRaw[0]),
  finalInputsHash: hash(finalRaw[1]),
  cacheHash: hash(cachedRaw),
  artistInputCorrections: installed.source.artistCorrections,
  reuse,
  profileHash: capture.source.profileHash,
  metricGraph: graph,
  preprocessGraph,
  preprocessEmbeddedInMetricGraph: embedded,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  scope:
    '302 actual old/default and installed corrected Original faces against identical independently aligned scans. Thirteen exact physical artist-input corrections are explicit. Cached regional scores require matching metric graph, input identity, pose, reference and raster hashes; every raster is checked from disk. No candidate scan refit or color normalization. All cards stay in the denominator; scores are indices out of 100.',
};
for (const e of inputs.entries) {
  const native = capture.rows.find((r) => r.id === e.id);
  assert.equal(native.currentFaceInputHash, hash(JSON.stringify(e.face)));
  assert.equal(native.poseHash, hash(JSON.stringify(e.pose.transform)));
  assert(e.pose.accepted);
  const load = async (file, digest) => {
    const b = await readFile(path.join(directory, file));
    assert.equal(hash(b), digest);
    return normalize(PNG.sync.read(b, { checkCRC: true }));
  };
  const finalRow = installed.rows.find((r) => r.id === e.id),
    finalInput = finalInputs.entries.find((r) => r.id === e.id);
  assert(finalRow && finalInput);
  assert.equal(finalRow.poseHash, native.poseHash);
  assert.equal(finalRow.referenceHash, native.referenceHash);
  assert.equal(finalRow.scanHash, native.scanHash);
  assert.deepEqual(finalRow.variants['control-original'].rasters, native.rasters.candidate);
  assert.deepEqual(finalInput.controlFace, e.face);
  assert.deepEqual(
    { ...finalInput.face, artist: e.face.artist },
    e.face,
    'More than artist input changed',
  );
  assert.equal(finalRow.variants.original.inputHash, hash(JSON.stringify(finalInput.face)));
  const cached = cache.rows.find((r) => r.id === e.id);
  const scan = await load(e.id + '-scan.png', native.scanHash),
    scores = {};

  for (const variant of ['current', 'candidate']) {
    const after = variant === 'candidate';
    const digest = after ? finalRow.variants.original.rasters.face : native.rasters.current.face;
    const image = after
      ? await (async () => {
          const b = await readFile(path.join(installedDirectory, 'original', e.id + '.png'));
          assert.equal(hash(b), digest);
          return normalize(PNG.sync.read(b, { checkCRC: true }));
        })()
      : await load('current/' + e.id + '.png', digest);
    const input = after ? finalInput.face : e.face;
    if (
      reusable &&
      cached &&
      cached.poseHash === native.poseHash &&
      cached.referenceHash === native.referenceHash &&
      cached.renderHashes[variant].face === digest &&
      hash(JSON.stringify(input)) ===
        (after
          ? (cached.afterInputHash ?? native.currentFaceInputHash)
          : (cached.beforeInputHash ?? native.currentFaceInputHash))
    ) {
      scores[variant] = cached.scores[variant];
      reuse[variant]++;
      continue;
    }
    reuse[after ? 'freshCandidate' : 'freshCurrent']++;
    const value = scoreRegions(scan, image, e.card, input);
    scores[variant] = {
      structural100: value.structuralScore === null ? null : 100 * value.structuralScore,
      coverage: value.coverage,
      components: Object.fromEntries(
        Object.entries(value.components).map(([key, v]) => [
          key,
          {
            score100: v.score === null ? null : 100 * v.score,
            eligible: v.eligible,
            status: v.status,
            weight: v.weight,
          },
        ]),
      ),
      weakest: value.weakest,
      color: value.color,
    };
  }
  rows.push({
    id: e.id,
    name: e.name,
    material: e.material,
    profileFrame: native.selectedFrame.material,
    cohort: e.pose.cohort,
    referenceHash: e.reference.sha256,
    poseHash: native.poseHash,
    numericallyAccepted: true,
    visualCertification: 'pending',
    wordingMode: e.face.wordingMode,
    renderHashes: {
      current: native.rasters.current,
      candidate: finalRow.variants.original.rasters,
    },
    beforeInputHash: native.currentFaceInputHash,
    afterInputHash: finalRow.variants.original.inputHash,
    scores,
  });
  if (rows.length % 25 === 0) console.log('Whole-card metric ' + rows.length + '/302');
}
assert.deepEqual(await metricSourceGraph(scorerFile), graph, 'Metric changed during scoring');
const q = (v, p) => {
  const a = [...v].sort((a, b) => a - b),
    n = (a.length - 1) * p;
  return a[Math.floor(n)] * (1 - (n % 1)) + a[Math.ceil(n)] * (n % 1);
};
const mean = (v) => v.reduce((s, x) => s + x, 0) / v.length;
const groups = {};
for (const key of [
  'all',
  'calibration',
  'validation',
  ...new Set(rows.map((r) => r.profileFrame)),
]) {
  const rs = rows.filter((r) => key === 'all' || r.cohort === key || r.profileFrame === key);
  const components = {};
  for (const role of ['structural100', ...Object.keys(rs[0].scores.current.components)]) {
    const measurable = rs.filter((r) =>
      role === 'structural100'
        ? r.scores.current.structural100 !== null && r.scores.candidate.structural100 !== null
        : r.scores.current.components[role]?.eligible &&
          r.scores.candidate.components[role]?.eligible,
    );
    if (!measurable.length) continue;
    const values = measurable.map((r) =>
      role === 'structural100'
        ? [r.scores.current.structural100, r.scores.candidate.structural100]
        : [
            r.scores.current.components[role].score100,
            r.scores.candidate.components[role].score100,
          ],
    );
    components[role] = {
      count: values.length,
      beforeMean: mean(values.map((v) => v[0])),
      afterMean: mean(values.map((v) => v[1])),
      beforeMedian: q(
        values.map((v) => v[0]),
        0.5,
      ),
      afterMedian: q(
        values.map((v) => v[1]),
        0.5,
      ),
      beforeLowerDecile: q(
        values.map((v) => v[0]),
        0.1,
      ),
      afterLowerDecile: q(
        values.map((v) => v[1]),
        0.1,
      ),
      improved: values.filter((v) => v[1] > v[0] + 1e-9).length,
      regressed: values.filter((v) => v[1] < v[0] - 1e-9).length,
      worstRegression: Math.max(0, ...values.map((v) => v[0] - v[1])),
    };
  }
  groups[key] = { count: rs.length, components };
}
await writeJson(output, {
  schema: 1,
  status: 'installed-original-profile-complete-scores-release-pending',
  source,
  summary: groups,
  rows,
});
console.log(JSON.stringify(groups.all, null, 2));
