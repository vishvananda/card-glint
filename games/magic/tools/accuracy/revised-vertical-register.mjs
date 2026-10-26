// CPU-only scan registration. No painter, card text, art crop or network fetch.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, objectFile } from './common.mjs';
import { fitVerticalFrameConsensus } from './printed-frame-vertical-fit.mjs';
import { physicalRevisedMaterial } from './revised-pixel-template-fit.mjs';
import { revisedVerticalOptions } from './revised-vertical-frame.mjs';
const [inputFile, parentFile, outputFile] = process.argv.slice(2);
assert(
  inputFile && parentFile && outputFile,
  'Usage: revised-vertical-register.mjs INPUTS PARENT_POSES NEW_OUTPUT',
);
const tools = [
  'printed-frame-vertical-fit.mjs',
  'directed-frame-gradient.mjs',
  'revised-vertical-frame.mjs',
  'normalized-rgba-region.mjs',
  'scan-transform.mjs',
  'frame-edge-measure.mjs',
  'metrics.mjs',
  'revised-pixel-template-fit.mjs',
];
const identities = async () =>
  Object.fromEntries(
    await Promise.all(
      tools.map(async (name) => [name, hash(await fs.readFile(new URL(name, import.meta.url)))]),
    ),
  );
const start = performance.now(),
  beforeTools = await identities(),
  ib = await fs.readFile(inputFile),
  pb = await fs.readFile(parentFile),
  inputs = JSON.parse(ib),
  parents = JSON.parse(pb),
  groups = {};
assert.equal(inputs.set, '3ed');
assert.equal(parents.set, '3ed');
assert.equal(parents.inputHash, hash(ib));
assert(Array.isArray(parents.rows));
const entries = inputs.entries.filter((e) => !e.face.land);
assert.equal(entries.length, 281, 'This fixed recipe covers the 281 nonland Revised printings');
assert.equal(new Set(parents.rows.map((r) => r.id)).size, parents.rows.length);
assert.equal(new Set(entries.map((e) => e.id)).size, entries.length);
await fs.writeFile(outputFile, JSON.stringify({ status: 'starting' }), { flag: 'wx' });
for (const material of ['W', 'U', 'B', 'R', 'G', 'A']) {
  const rows = [];
  for (const e of entries.filter((e) => physicalRevisedMaterial(e) === material)) {
    const p = parents.rows.find((r) => r.id === e.id);
    assert(p && p.material === material && p.referenceHash === e.reference.sha256);
    assert(['calibration', 'validation'].includes(p.cohort));
    assert.equal(typeof p.accepted, 'boolean');
    const bytes = await fs.readFile(objectFile(e.reference));
    assert.equal(hash(bytes), e.reference.sha256);
    rows.push({
      id: e.id,
      name: e.name,
      logicalMaterial: e.material,
      cohort: p.cohort,
      referenceHash: e.reference.sha256,
      parentAccepted: p.accepted,
      parentTransform: p.transform,
      image: PNG.sync.read(bytes),
    });
  }
  groups[material] = fitVerticalFrameConsensus(rows, revisedVerticalOptions);
  console.log(material, groups[material].rows.filter((r) => r.accepted).length, '/', rows.length);
}
assert.deepEqual(await identities(), beforeTools, 'Registration modules changed during the run');
const rows = Object.values(groups).flatMap((g) => g.rows);
assert.equal(rows.length, entries.length);
const output = {
  schema: 1,
  set: '3ed',
  status: 'regional-comparison-registration',
  scope:
    'Reference-only printed-interior vertical translation/scale after independent horizontal poses. Calibration-only templates and zero-median endpoint gauges; validation is reused development data, not an independent holdout. Two fitting bands and four frozen-pose checks. Parent rejection, limits and missing/contradictory edges remain exclusions. Art-bottom and outer-rim mismatch remain explicit diagnostics. No renderer offsets or stock whole-card scores are changed; this does not certify full-frame shape.',
  source: {
    inputHash: hash(ib),
    parentHash: hash(pb),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    modules: beforeTools,
  },
  summary: {
    cards: rows.length,
    parentAccepted: rows.filter((r) => r.parentAccepted).length,
    accepted: rows.filter((r) => r.accepted).length,
    byMaterial: Object.fromEntries(
      Object.entries(groups).map(([k, g]) => [
        k,
        {
          cards: g.rows.length,
          parentAccepted: g.rows.filter((r) => r.parentAccepted).length,
          accepted: g.rows.filter((r) => r.accepted).length,
          calibration: g.rows.filter((r) => r.accepted && r.cohort === 'calibration').length,
          validation: g.rows.filter((r) => r.accepted && r.cohort === 'validation').length,
        },
      ]),
    ),
  },
  time: {
    cpuWallSeconds: (performance.now() - start) / 1000,
    scope:
      'PNG decoding and CPU scan registration only; no card composition, Chromium or GPU completion measured.',
  },
  groups,
};
await fs.writeFile(outputFile, JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify(output.summary));
