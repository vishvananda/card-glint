// Frozen scan-only comparison poses; never changes displayed renderer defaults.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { scanFrameAnchors } from './scan-frame-anchors.mjs';
import { oldDefaultTarget, oldDefaultPose } from './old-frame-default-registration.mjs';
const [inputFile, output] = process.argv.slice(2);
assert(output, 'Use INPUTS NEW_POSES_OUTPUT');
const raw = await fs.readFile(inputFile),
  input = JSON.parse(raw);
assert.equal(input.status, 'full-original-input-census');
const references = [];
for (const e of input.entries) {
  const bytes = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(bytes), e.reference.sha256);
  const image = normalize(PNG.sync.read(bytes));
  references.push({
    id: e.id,
    referenceHash: e.reference.sha256,
    anchors: scanFrameAnchors(image, e.card.border_color),
  });
}
const target = oldDefaultTarget(references);
assert(target.reliable);
const rows = references.map((r) => {
  const fit = oldDefaultPose(r.anchors, target);
  return {
    id: r.id,
    referenceHash: r.referenceHash,
    ...fit,
    // Rejected proposals never get applied for display or scoring.
    ...(!fit.accepted
      ? { rejectedCandidate: fit.transform, transform: { matrix: [1, 0, 0, 1, 0, 0] } }
      : {}),
  };
});
const sources = Object.fromEntries(
  await Promise.all(
    [
      'old-frame-set-registration.mjs',
      'old-frame-default-registration.mjs',
      'scan-frame-anchors.mjs',
      'scan-frame-fit.mjs',
      'scan-affine-fit.mjs',
      'pixels-pure.mjs',
      'scan-transform.mjs',
      'metrics.mjs',
      'common.mjs',
    ].map(async (name) => [name, hash(await fs.readFile(new URL(name, import.meta.url)))]),
  ),
);
await writeJson(output, {
  schema: 1,
  set: input.set,
  status: 'frozen-scan-only-comparison-poses',
  inputHash: hash(raw),
  scope:
    'All source scans. Median outer-frame targets use only paired disjoint scan strips;per-card axis/affine models have independent strip validation. Frozen before any renderer fit and reused across candidates. This is provisional geometry normalization,not an independent asset/texture or typography approval. Rejected fits remain explicit;identity display placeholders are never accepted scores.',
  target,
  sources,
  node: process.version,
  lockHash: hash(await fs.readFile(new URL('../../../../package-lock.json', import.meta.url))),
  summary: {
    total: rows.length,
    accepted: rows.filter((r) => r.accepted).length,
    rejected: rows.filter((r) => !r.accepted).length,
  },
  rows,
});
console.log(
  input.set,
  rows.length,
  'scan-only poses;',
  rows.filter((r) => r.accepted).length,
  'accepted.',
);
