// Freeze per-material source-scan profile references before renderer calibration.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import {
  PEER_PROFILE_VERSION,
  PEER_WINDOWS,
  PEER_SAMPLE_BOUNDS,
  peerProfiles,
  peerTemplate,
  fitPeerProfiles,
} from './old-frame-peer-profiles.mjs';

const [inputFile, output] = process.argv.slice(2);
assert(output, 'Use INPUTS NEW_POSES_OUTPUT');
await fs.access(output).then(
  () => {
    throw Error('Output already exists');
  },
  (error) => {
    if (error.code !== 'ENOENT') throw error;
  },
);
const raw = await fs.readFile(inputFile),
  input = JSON.parse(raw);
assert.equal(input.status, 'full-original-input-census');
const basics = new Set(['Plains', 'Island', 'Swamp', 'Mountain', 'Forest']);
const sourceHashes = async () =>
  Object.fromEntries(
    await Promise.all(
      [
        'old-frame-peer-registration.mjs',
        'old-frame-peer-profiles.mjs',
        'old-frame-default-registration.mjs',
        'scan-frame-fit.mjs',
        'scan-affine-fit.mjs',
        'pixels-pure.mjs',
        'scan-transform.mjs',
        'metrics.mjs',
        'common.mjs',
      ].map(async (n) => [n, hash(await fs.readFile(new URL(n, import.meta.url)))]),
    ),
  );
const sources = await sourceHashes();
const references = [];
for (const e of input.entries) {
  const bytes = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(bytes), e.reference.sha256);
  references.push({
    id: e.id,
    material: e.material === 'L' && basics.has(e.name) ? 'L-' + e.name : e.material,
    referenceHash: e.reference.sha256,
    profiles: peerProfiles(normalize(PNG.sync.read(bytes))),
  });
}
const templates = Object.fromEntries(
  [...new Set(references.map((r) => r.material))].map((m) => [
    m,
    peerTemplate(references.filter((r) => r.material === m).map((r) => r.profiles)),
  ]),
);
const rows = references.map((r) => {
  const fit = fitPeerProfiles(r.profiles, templates[r.material]);
  return {
    id: r.id,
    material: r.material,
    referenceHash: r.referenceHash,
    ...fit,
    ...(!fit.accepted
      ? { rejectedCandidate: fit.transform, transform: { matrix: [1, 0, 0, 1, 0, 0] } }
      : {}),
  };
});
assert.deepEqual(await sourceHashes(), sources, 'Normalization source changed during measurement');

const summary = {
  total: rows.length,
  accepted: rows.filter((r) => r.accepted).length,
  rejected: rows.filter((r) => !r.accepted).length,
};
await writeJson(output, {
  schema: 1,
  set: input.set,
  status: 'frozen-scan-only-comparison-poses',
  inputHash: hash(raw),
  method: PEER_PROFILE_VERSION,
  windows: PEER_WINDOWS,
  sampleBounds: PEER_SAMPLE_BOUNDS,
  sources,
  node: process.version,
  lockHash: hash(await fs.readFile(new URL('../../../../package-lock.json', import.meta.url))),
  templates,
  scope:
    "Source-only per-material median gradient templates; basic land treatments have separate scan peers (minimum three), with their small cohorts explicitly retained. All scans are development references, not held-out validation cards. Alternating disjoint strips independently validate per-scan translation, scale, rotation and shear using unchanged geometric limits. Templates preserve each material's median frame placement rather than forcing different frame colors onto one luminance edge. No renderer, artwork, rules or title enters the objective. Rejected fits are explicit and never accepted scores. Provisional geometry normalization does not certify asset shape or texture.",
  summary,
  rows,
});
console.log(
  JSON.stringify({
    set: input.set,
    ...summary,
    materials: Object.fromEntries(
      Object.keys(templates).map((m) => [
        m,
        {
          total: rows.filter((r) => r.material === m).length,
          accepted: rows.filter((r) => r.material === m && r.accepted).length,
        },
      ]),
    ),
  }),
);
