import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [previousDirectory, installedDirectory, scansDirectory, scorerFile, cacheFile, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: early-profile-revision-score.mjs PRIOR_NATIVE INSTALLED_NATIVE SCANS SCORER CACHE OUT',
);
const read = async (f) => {
  const bytes = await readFile(f);
  return { bytes, value: JSON.parse(bytes) };
};
const previous = await read(path.join(previousDirectory, 'capture.json'));
const installed = await read(path.join(installedDirectory, 'capture.json'));
const inputs = await read(path.join(installedDirectory, 'inputs.json'));
const cache = await read(cacheFile);
const graph = await metricSourceGraph(scorerFile),
  { scoreRegions } = await import(pathToFileURL(path.resolve(scorerFile)));
assert.equal(installed.value.completed, 302);
assert.equal(installed.value.source.previousCaptureHash, hash(previous.bytes));
assert.equal(installed.value.source.inputsHash, hash(inputs.bytes));
assert.deepEqual(graph, cache.value.source.metricGraph);
const rows = [],
  reuse = { unchanged: 0, fresh: 0 };
const convert = (value) => ({
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
});
for (const entry of inputs.value.entries) {
  const current = installed.value.rows.find((r) => r.id === entry.id),
    old = previous.value.rows.find((r) => r.id === entry.id),
    cached = cache.value.rows.find((r) => r.id === entry.id);
  assert(current && old && cached);
  assert.equal(current.referenceHash, entry.reference.sha256);
  assert.equal(current.poseHash, hash(JSON.stringify(entry.pose.transform)));
  assert.equal(current.poseHash, cached.poseHash);
  assert.equal(current.referenceHash, cached.referenceHash);
  assert.equal(cached.renderHashes.candidate.face, old.variants.original.rasters.face);
  assert.equal(old.variants.original.inputHash, current.variants.original.inputHash);
  assert.equal(
    hash(JSON.stringify(current.variants.original.input)),
    current.variants.original.inputHash,
  );
  const native = await readFile(path.join(installedDirectory, 'original', entry.id + '.png'));
  assert.equal(hash(native), current.variants.original.rasters.face);
  const scan = await readFile(path.join(scansDirectory, entry.id + '-scan.png'));
  assert.equal(hash(scan), old.scanHash);
  assert.equal(current.scanHash, old.scanHash);
  let after;
  if (current.variants.original.rasters.face === old.variants.original.rasters.face) {
    after = cached.scores.candidate;
    reuse.unchanged++;
  } else {
    after = convert(
      scoreRegions(
        normalize(PNG.sync.read(scan)),
        normalize(PNG.sync.read(native)),
        entry.card,
        current.variants.original.input,
      ),
    );
    reuse.fresh++;
  }
  rows.push({
    id: entry.id,
    name: entry.name,
    referenceHash: current.referenceHash,
    poseHash: current.poseHash,
    scanHash: current.scanHash,
    wordingMode: 'original',
    numericallyAccepted: true,
    inputHash: current.variants.original.inputHash,
    renderHashes: {
      current: old.variants.original.rasters,
      candidate: current.variants.original.rasters,
    },
    scores: { current: cached.scores.candidate, candidate: after },
    reused: current.variants.original.rasters.face === old.variants.original.rasters.face,
  });
}
const q = (v, p) => {
  const a = [...v].sort((a, b) => a - b),
    n = (a.length - 1) * p;
  return a[Math.floor(n)] * (1 - (n % 1)) + a[Math.ceil(n)] * (n % 1);
};
const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
const components = {};
for (const role of ['structural100', ...Object.keys(rows[0].scores.current.components)]) {
  const rs = rows.filter((r) =>
    role === 'structural100'
      ? r.scores.current.structural100 !== null && r.scores.candidate.structural100 !== null
      : r.scores.current.components[role]?.eligible &&
        r.scores.candidate.components[role]?.eligible,
  );
  if (!rs.length) continue;
  const values = rs.map((r) =>
    role === 'structural100'
      ? [r.scores.current.structural100, r.scores.candidate.structural100]
      : [r.scores.current.components[role].score100, r.scores.candidate.components[role].score100],
  );
  const a = values.map((v) => v[0]),
    b = values.map((v) => v[1]);
  components[role] = {
    count: values.length,
    beforeMean: mean(a),
    afterMean: mean(b),
    beforeMedian: q(a, 0.5),
    afterMedian: q(b, 0.5),
    beforeLowerDecile: q(a, 0.1),
    afterLowerDecile: q(b, 0.1),
    improved: values.filter((v) => v[1] > v[0] + 1e-9).length,
    regressed: values.filter((v) => v[1] < v[0] - 1e-9).length,
    worstRegression: Math.max(0, ...values.map((v) => v[0] - v[1])),
  };
}
assert.equal(reuse.unchanged, 292);
assert.equal(reuse.fresh, 10);
assert.deepEqual(await metricSourceGraph(scorerFile), graph);
await writeJson(output, {
  schema: 1,
  status: 'installed-revision-scores-release-pending',
  source: {
    rendererHash: installed.value.source.rendererHash,
    previousCaptureHash: hash(previous.bytes),
    finalCaptureHash: hash(installed.bytes),
    inputsHash: hash(inputs.bytes),
    cacheHash: hash(cache.bytes),
    metricGraph: graph,
    toolHash: hash(await readFile(new URL(import.meta.url))),
    scope:
      'All302 Original printings, same frozen scan/reference/input identities.292 exact native matches reuse the bound unchanged metric; ten revised duals are freshly scored. Credits/legal and outer bevels remain excluded from the aggregate; separate fixed-window edge diagnostics cover the bevel.',
  },
  reuse,
  summary: { all: { count: rows.length, components } },
  rows,
});
console.log({ reuse, summary: components.structural100 });
