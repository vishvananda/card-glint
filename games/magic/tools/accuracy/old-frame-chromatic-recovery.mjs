import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import {
  chromaticProfiles,
  chromaticTemplate,
  fitChromaticProfiles,
  CHROMATIC_PROFILE_VERSION,
} from './old-frame-chromatic-profiles.mjs';
const [inputFile, parentFile, out] = process.argv.slice(2);
assert(out, 'Use REVIEWED_INPUTS FROZEN_PARENT_POSES NEW_OUTPUT');
await fs.access(out).then(
  () => {
    throw Error('Output exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const ib = await fs.readFile(inputFile),
  pb = await fs.readFile(parentFile);
const input = JSON.parse(ib),
  parent = JSON.parse(pb);
assert.equal(parent.inputHash, hash(ib));
assert.equal(input.entries.length, parent.rows.length);
const basics = new Set(['Plains', 'Island', 'Swamp', 'Mountain', 'Forest']);
const sourceHashes = async () => {
  const sources = {};
  for (const name of [
    'old-frame-chromatic-recovery.mjs',
    'old-frame-chromatic-profiles.mjs',
    'old-frame-peer-profiles.mjs',
    'old-frame-default-registration.mjs',
    'scan-frame-fit.mjs',
    'scan-affine-fit.mjs',
    'pixels-pure.mjs',
    'scan-transform.mjs',
    'metrics.mjs',
    'common.mjs',
  ])
    sources[name] = hash(await fs.readFile(new URL(name, import.meta.url)));
  return sources;
};
const sources = await sourceHashes();
const references = [];
for (const e of input.entries) {
  const bytes = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(bytes), e.reference.sha256);
  references.push({
    id: e.id,
    name: e.name,
    material: e.material === 'L' && basics.has(e.name) ? 'L-' + e.name : e.material,
    referenceHash: e.reference.sha256,
    profiles: chromaticProfiles(normalize(PNG.sync.read(bytes))),
  });
}
const templates = Object.fromEntries(
  [...new Set(references.map((r) => r.material))].map((material) => [
    material,
    chromaticTemplate(references.filter((r) => r.material === material).map((r) => r.profiles)),
  ]),
);
const rows = references.map((r) => {
  const previous = parent.rows.find((p) => p.id === r.id);
  assert.equal(previous.referenceHash, r.referenceHash);
  if (previous.accepted)
    return { ...previous, acceptanceSource: 'frozen-parent', parentPoseHash: hash(pb) };
  const fit = fitChromaticProfiles(r.profiles, templates[r.material]);
  console.log(input.set, r.name, fit.accepted, fit.reason, JSON.stringify(fit.support));
  return {
    id: r.id,
    name: r.name,
    material: r.material,
    referenceHash: r.referenceHash,
    ...fit,
    previousReason: previous.reason,
    acceptanceSource: 'rgb-recovery-proposal',
    ...(!fit.accepted
      ? { rejectedCandidate: fit.transform, transform: { matrix: [1, 0, 0, 1, 0, 0] } }
      : {}),
  };
});
assert.deepEqual(await sourceHashes(), sources, 'Recovery source changed during measurement');
await writeJson(out, {
  schema: 1,
  status: 'scan-only-rgb-recovery-proposal-not-adopted',
  set: input.set,
  inputHash: hash(ib),
  parentPoseHash: hash(pb),
  method: CHROMATIC_PROFILE_VERSION,
  sources,
  templates,
  scope:
    'Same frame-only support and alternating nonoverlapping19px side/13px top-bottom strips, RGB vector-gradient correlation after two fixed binomial low-pass steps. Existing .65 correlation and all geometry/validation limits unchanged. Median source peers; no renderer, text or artwork. Accepted parent poses remain byte-equivalent. New poses require independent recovery controls before scoring.',
  summary: {
    total: rows.length,
    previous: parent.rows.filter((r) => r.accepted).length,
    accepted: rows.filter((r) => r.accepted).length,
    rejected: rows.filter((r) => !r.accepted).length,
  },
  rows,
});
