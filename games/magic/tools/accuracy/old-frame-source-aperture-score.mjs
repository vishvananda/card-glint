// Compare native source-family apertures on identical frozen faces and scan poses.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [inputFile, poseFile, nativeDirectory, metricFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS POSES NATIVE_DIRECTORY METRICS NEW_OUTPUT');
const raw = await Promise.all(
  [inputFile, poseFile, path.join(nativeDirectory, 'capture.json')].map((f) => fs.readFile(f)),
);
const [inputs, poses, capture] = raw.map((b) => JSON.parse(b));
assert(capture.complete && !capture.faults.length);
assert.equal(capture.source.inputHash, hash(raw[0]));
assert.equal(poses.inputHash, hash(raw[0]));
const graph = await metricSourceGraph(path.resolve(metricFile));
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile)));
const toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  rows = [],
  references = new Map();
for (const n of capture.rows) {
  const e = inputs.entries.find((e) => e.id === n.id),
    pose = poses.rows.find((r) => r.id === n.id);
  assert(e && pose?.accepted);
  assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(n.referenceHash, e.reference.sha256);
  assert.match(n.file, /^[a-z0-9-]+\.png$/i);
  const b = await fs.readFile(path.join(nativeDirectory, n.file));
  assert.equal(hash(b), n.sha256);
  if (!references.has(e.id)) {
    const r = await fs.readFile(objectFile(e.reference));
    assert.equal(hash(r), e.reference.sha256);
    references.set(e.id, normalize(PNG.sync.read(r), pose.transform));
  }
  const score = scoreRegions(references.get(e.id), normalize(PNG.sync.read(b)), e.card, {
    ...e.face,
    typeSource: 'Scan-reviewed original type',
    rulesSource: 'MTGJSON original printing text',
  });
  rows.push({
    id: e.id,
    name: e.name,
    material: n.key,
    family: n.family,
    cohort: n.cohort,
    nativeHash: n.sha256,
    referenceHash: e.reference.sha256,
    poseHash: hash(JSON.stringify(pose.transform)),
    components: Object.fromEntries(['art', 'frame'].map((k) => [k, score.components[k]])),
  });
  if (rows.length % 20 === 0) console.log(inputs.set, rows.length, '/', capture.rows.length);
}
const groups = [];
for (const material of new Set(rows.map((r) => r.material)))
  for (const family of new Set(rows.filter((r) => r.material === material).map((r) => r.family))) {
    const rr = rows.filter((r) => r.material === material && r.family === family),
      cohorts = {};
    for (const co of new Set(rr.map((r) => r.cohort))) {
      const peers = rr.filter((r) => r.cohort === co);
      cohorts[co] = {
        count: peers.length,
        ...Object.fromEntries(
          ['art', 'frame'].map((k) => {
            const v = peers
              .map((r) => r.components[k])
              .filter((c) => c?.eligible && Number.isFinite(c.score))
              .map((c) => c.score);
            return [k, v.length ? (100 * v.reduce((a, b) => a + b, 0)) / v.length : null];
          }),
        ),
      };
    }
    groups.push({ material, family, cohorts });
  }
assert.deepEqual(await metricSourceGraph(path.resolve(metricFile)), graph);
assert.equal(toolHash, hash(await fs.readFile(new URL(import.meta.url))));
await writeJson(out, {
  schema: 1,
  status: 'native-source-aperture-diagnostic-not-adopted',
  set: inputs.set,
  source: {
    inputHash: hash(raw[0]),
    poseHash: hash(raw[1]),
    captureHash: hash(raw[2]),
    toolHash,
    metrics: graph,
  },
  scope:
    'Exact native source-family pilot bytes, identical Original faces and fixed frame-only reference poses. Only illustration and frame components are compared; source pigment and typography remain unfitted controls. This catches aperture regressions that a rim-only source objective can miss. No per-card transforms, source selection, set approval or score reuse is implied.',
  groups,
  rows,
});
console.log(JSON.stringify(groups));
