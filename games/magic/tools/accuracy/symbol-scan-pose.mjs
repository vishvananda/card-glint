import assert from 'node:assert/strict';
import {
  cacheRoot,
  fixtureRoot,
  readJson,
  writeJson,
  hash,
  objectFile,
  mapLimit,
} from './common.mjs';
import {
  cachedScanFrame,
  SCAN_ANCHOR_METHOD_HASH,
  SCAN_FIT_METHOD_HASH,
} from './scan-frame-cache.mjs';
import { SCAN_FRAME_POLICY } from './scan-frame-fit.mjs';

const [set] = process.argv.slice(2);
assert.match(set ?? '', /^[a-z0-9]{2,6}$/);
const snapshot = await readJson(`${cacheRoot}/rollout/${set}-symbol.json`),
  profile = await readJson(`${fixtureRoot}/old-frame-registration-${set}.json`),
  profileHash = hash(JSON.stringify(profile));
assert.equal(profile.set, set);
assert.equal(
  profile.anchor,
  'outer-stock',
  'Printed-plate frames need their independently validated anchor model',
);
// A rejected shared set offset is not a rejected source template. Every scan
// must independently pass the denser frame-only model validation below.
assert.ok(profile.guards.sources.length && profile.targets);
const entries = snapshot.entries.filter((e) => e.cohort !== 'control');
const rows = await mapLimit(entries, 2, async (e) => {
  const card = e.card,
    material = /\bLand\b/.test(card.type_line)
      ? 'L'
      : /\bArtifact\b/.test(card.type_line)
        ? 'A'
        : card.colors?.length === 1
          ? card.colors[0]
          : 'M';
  const row = {
    id: e.id,
    name: card.name,
    cohort: e.cohort,
    referenceHash: e.reference?.sha256 ?? null,
    material,
  };
  if (e.issue || !e.reference)
    return { ...row, accepted: false, reason: e.issue ?? 'reference-unavailable', transform: null };
  if (
    !profile.scope.materials.includes(material) ||
    card.frame !== profile.printedFrame ||
    card.border_color !== profile.border ||
    card.layout !== 'normal'
  )
    return { ...row, accepted: false, reason: 'frame-template-unvalidated', transform: null };
  const pose = await cachedScanFrame(
    objectFile(e.reference),
    e.reference.sha256,
    profile.border,
    profile.targets[material],
    profileHash,
  );
  // Cache timing belongs to execution diagnostics, not immutable fit evidence.
  delete pose.anchorCacheHit;
  delete pose.fitCacheHit;
  return { ...row, ...pose };
});
const result = {
  schemaVersion: 2,
  scope:
    'Per-card comparison-only frame normalization; independent disjoint outer-frame fit/validation strips. Translation/uniform scale, then validated rotation and bounded global shear. No symbol/text/art anchors, no independent axis stretch or local warp; no per-card renderer settings.',
  coordinateSystem:
    '488x680, center=(244,340); matrix [a,b,c,d,tx,ty] maps centered source to centered comparison, inverse also stored. Source aspect normalization precedes matrix in one resampling pass.',
  profileHash,
  scanAnchorMethodHash: SCAN_ANCHOR_METHOD_HASH,
  scanFitMethodHash: SCAN_FIT_METHOD_HASH,
  policy: SCAN_FRAME_POLICY,
  summary: Object.fromEntries(
    [...new Set(rows.map((r) => (r.accepted ? r.model : r.reason)))].map((reason) => [
      reason,
      rows.filter((r) => (r.accepted ? r.model : r.reason) === reason).length,
    ]),
  ),
  rows,
};
await writeJson(`${fixtureRoot}/${set}-symbol-scan-pose.json`, result);
console.log(set, result.summary);
