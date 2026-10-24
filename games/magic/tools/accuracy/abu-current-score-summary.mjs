// Materialize current scores from exact native identities and certified poses.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync, gzipSync } from 'node:zlib';
import { hash, sourceHash } from './common.mjs';
import { abuPerimeterDelta } from './abu-perimeter-ancestry.mjs';
const [oldInputFile, inputFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-current-score-summary.mjs PRIOR_INPUTS CURRENT_INPUTS OUTPUT_GZ');
const p = await abuPerimeterDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
const base = 'games/magic/fixtures/accuracy/early-through-fourth/',
  sources = {};
const read = async (file) => {
  const bytes = await readFile(file);
  sources[file] = hash(bytes);
  return JSON.parse(file.endsWith('.gz') ? gunzipSync(bytes) : bytes);
};
const full = await read(base + 'abu-fractional-full-score.json.gz'),
  artist = await read(base + 'abu-tropical-artist-score.json.gz'),
  patch = await read(base + 'abu-perimeter-score-update.json.gz'),
  native = await read(p.native.file),
  recovery = await read(base + 'alpha-corner-recovery.json.gz'),
  live = await read(base + 'alpha-corner-live.json.gz');
const oldBytes = await readFile(oldInputFile),
  old = JSON.parse(oldBytes),
  inputBytes = await readFile(inputFile),
  inputs = JSON.parse(inputBytes);
assert.equal(hash(oldBytes), full.source.inputsHash);
assert.equal(hash(inputBytes), native.source.inputHash);
assert.equal(native.source.priorNativeHash, full.source.nativeHash);
assert.equal(
  patch.source.censusContentHash,
  hash(gunzipSync(await readFile(base + 'abu-fractional-full-score.json.gz'))),
);
assert.equal(patch.source.afterRenderer, p.afterRenderer);
assert.equal(patch.source.nativeHash, p.native.contentSha256);
assert.deepEqual(patch.source.metricGraph, full.source.metricGraph);
assert.equal(patch.changes.length, 19);
for (const [file, digest] of recovery.tools)
  assert.equal(hash(await readFile('games/magic/tools/accuracy/' + file)), digest);
const recovered = recovery.rows.filter((r) => !r.oldAccepted);
assert.equal(recovered.length, 3);
const changedInputs = [];
const rows = inputs.entries.map((e) => {
  const previous = old.entries.find((r) => r.id === e.id),
    stored = full.rows.find((r) => r.id === e.id),
    n = native.rows.find((r) => r.id === e.id);
  assert(previous && stored && n);
  assert.deepEqual(e.card, previous.card, 'Score semantics changed');
  if (JSON.stringify(e.face) !== JSON.stringify(previous.face)) {
    changedInputs.push(e.id);
    assert.equal(e.id, artist.id);
    assert.deepEqual({ ...e.face, artist: previous.face.artist }, previous.face);
  }
  assert.equal(hash(JSON.stringify(e.face)), n.inputHash);
  assert.equal(e.reference.sha256, stored.referenceHash);
  assert.equal(n.referenceHash, stored.referenceHash);
  assert.equal(n.poseHash, stored.poseHash);
  let score = stored.scores.after,
    faceHash = stored.afterFaceHash;
  if (e.id === artist.id) {
    score = artist.scores.after;
    faceHash = artist.afterFaceHash;
  }
  const update = patch.changes.find((r) => r.id === e.id);
  if (update) {
    assert.deepEqual(update.scores.before, score);
    assert.equal(update.beforeFaceHash, faceHash);
    score = update.scores.after;
    faceHash = update.afterFaceHash;
  }
  assert.equal(
    faceHash,
    n.original.hashes['after-face'],
    'Score raster does not match current native face',
  );
  let certification;
  if (!stored.accepted) {
    const r = recovered.find((r) => r.id === e.id),
      client = live.rows.find((r) => r.id === e.id);
    assert(r && client);
    assert.equal(r.referenceHash, e.reference.sha256);
    assert.equal(r.poseHash, hash(JSON.stringify(e.pose.transform)));
    assert.deepEqual(client.transform, e.pose.transform.matrix);
    assert.equal(client.status, 'scored');
    assert.equal(r.accepted, true);
    assert(Number.isFinite(r.rawNativeParity) && r.rawNativeParity < 1e-8);
    assert.equal(r.certificate.accepted, true);
    assert.equal(r.recovery.accepted, true);
    assert.equal(r.recovery.samePose, true);
    certification = {
      method: r.recovery.method,
      transformHash: r.poseHash,
      corners: r.certificate.corners,
    };
  }
  assert(Number.isFinite(score.structural100));
  return {
    id: e.id,
    set: e.set,
    name: e.name,
    referenceHash: e.reference.sha256,
    poseHash: n.poseHash,
    nativeFaceHash: faceHash,
    inputHash: n.inputHash,
    normalizationAccepted: true,
    historicalAccepted: stored.accepted,
    ...(certification ? { certification } : {}),
    score100: score.structural100,
    coverage: score.coverage,
    components: score.components,
  };
});
assert.equal(rows.length, 899);
assert.equal(new Set(rows.map((r) => r.id)).size, 899);
assert.deepEqual(changedInputs, [artist.id]);
assert.equal(rows.filter((r) => r.certification).length, 3);
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const summary = Object.fromEntries(
  ['lea', 'leb', '2ed'].map((set) => {
    const r = rows.filter((r) => r.set === set),
      historical = r.filter((r) => r.historicalAccepted);
    return [
      set,
      {
        nativeFaces: r.length,
        normalizationAccepted: r.length,
        scored: r.length,
        mean100: mean(r.map((r) => r.score100)),
        historicalPaired: {
          n: historical.length,
          mean100: mean(historical.map((r) => r.score100)),
        },
        recoveredPoses: r.filter((r) => r.certification).map((r) => ({ id: r.id, name: r.name })),
      },
    ];
  }),
);
await writeFile(
  output,
  gzipSync(
    Buffer.from(
      JSON.stringify({
        schema: 1,
        status: 'complete-current-abu-score-summary',
        scope:
          'All899 current Original native identities matched to their measured scores.19 perimeter scores and the earlier physical artist correction are applied in order; other scores are reused only on exact pixels and unchanged semantic inputs. Three historical Alpha pose rejections are certified by the existing printed-corner evidence and exactly matching deployed matrices. No pose changes, new live score claims, Oracle score census or completion of outstanding typography/assets are implied. Indices are out of100.',
        source: {
          rendererHash: p.afterRenderer,
          metricGraph: full.source.metricGraph,
          files: sources,
          priorInputsHash: hash(oldBytes),
          inputsHash: hash(inputBytes),
          toolHash: hash(await readFile(new URL(import.meta.url))),
        },
        summary,
        rows,
      }) + '\n',
    ),
    { mtime: 0 },
  ),
);
console.log(JSON.stringify(summary));
