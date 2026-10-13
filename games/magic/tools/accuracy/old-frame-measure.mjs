import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  readJson,
  writeJson,
  cacheRoot,
  fixtureRoot,
  outputRoot,
  objectFile,
  hash,
} from './common.mjs';
import { readPng, normalize } from './pixels.mjs';
import { frameProfiles, stockBounds, sharedRegistration } from './frame-family-metrics.mjs';
import { opaqueSupport, scoreOpaqueFamily, FAMILY_SCORE_VERSION } from './frame-family-score.mjs';
const snapshot = await readJson(`${cacheRoot}/rollout/old-frame-families.json`),
  plan = await readJson(`${fixtureRoot}/old-frame-family-plan.json`),
  templates = await readJson(`${cacheRoot}/rollout/old-frame-templates.json`);
assert.equal(snapshot.planHash, hash(JSON.stringify(plan)));
const extractionHash = hash(await readFile(new URL('./frame-family-metrics.mjs', import.meta.url)));
const methodHash = hash(
  Buffer.concat(
    await Promise.all(
      ['old-frame-measure.mjs', 'frame-family-metrics.mjs', 'frame-family-score.mjs'].map((p) =>
        readFile(new URL(p, import.meta.url)),
      ),
    ),
  ),
);
const plates = await Promise.all(
  templates.rows.map((t) =>
    readPng(`${outputRoot}/old-frame-families/templates/${t.file}`).then(normalize),
  ),
);
const support = opaqueSupport(plates);
const plateProfiles = new Map(templates.rows.map((t, i) => [t.key, frameProfiles(plates[i])]));
let raw;
try {
  const saved = await readJson(`${cacheRoot}/rollout/old-frame-features.json`);
  assert.equal(saved.methodHash, extractionHash);
  assert.equal(saved.snapshotHash, hash(JSON.stringify(snapshot)));
  raw = saved.raw;
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
  raw = [];
  for (const [i, e] of snapshot.entries.entries()) {
    if (e.issue) {
      raw.push({ ...e });
      continue;
    }
    const image = normalize(await readPng(objectFile(e.reference)));
    raw.push({ ...e, bounds: stockBounds(image, e.border), profiles: frameProfiles(image) });
    if (i % 100 === 0) console.log('measured', i);
  }
  await writeJson(`${cacheRoot}/rollout/old-frame-features.json`, {
    schemaVersion: 1,
    methodHash: extractionHash,
    snapshotHash: hash(JSON.stringify(snapshot)),
    raw,
  });
}
const registrationKeys = [...new Set(raw.map((e) => [e.set, e.frame, e.border].join('/')))];
const registrations = Object.fromEntries(
  registrationKeys.map((key) => [
    key,
    sharedRegistration(raw.filter((e) => [e.set, e.frame, e.border].join('/') === key && e.bounds)),
  ]),
);
const rows = [];
for (const [i, e] of raw.entries()) {
  if (e.issue) {
    rows.push(e);
    continue;
  }
  const reg = registrations[[e.set, e.frame, e.border].join('/')],
    normalized =
      reg.status === 'accepted'
        ? frameProfiles(normalize(await readPng(objectFile(e.reference)), reg.transform))
        : e.profiles,
    group = plan.sets.find((s) => s.set === e.set).groups.find((g) => g.key === e.group);
  const base = templates.rows.find((t) => t.url === e.currentAsset),
    material = e.material.startsWith('dual-') ? 'L' : e.material;
  // Keep the actual baseline, including specialized layouts whose proposed
  // candidate list cannot be evaluated by an ordinary plate-only comparison.
  const choices = [
    ...new Set([
      base?.key,
      ...group.candidates.filter((f) => f !== 'abu-dual-overlay').map((f) => `${f}/${material}`),
    ]),
  ].filter((k) => plateProfiles.has(k));
  const candidates = Object.fromEntries(
    choices.map((k) => [
      k,
      {
        raw: scoreOpaqueFamily(e.profiles, plateProfiles.get(k), support),
        normalized: scoreOpaqueFamily(normalized, plateProfiles.get(k), support),
      },
    ]),
  );
  rows.push({
    id: e.id,
    name: e.name,
    set: e.set,
    group: e.group,
    material: e.material,
    cohort: e.cohort,
    referenceHash: e.reference.sha256,
    baseline: base?.key ?? null,
    registration: reg.status,
    candidates,
  });
  if (i % 200 === 0) console.log('compared', i);
}
await writeJson(`${cacheRoot}/rollout/old-frame-family-measurements.json`, {
  schemaVersion: 1,
  planHash: hash(JSON.stringify(plan)),
  snapshotHash: hash(JSON.stringify(snapshot)),
  templateHash: hash(JSON.stringify(templates)),
  methodHash,
  metric: FAMILY_SCORE_VERSION,
  support,
  registrations,
  rows,
});
console.log(
  'Compared',
  rows.length,
  'references. Registrations',
  Object.values(registrations).reduce((a, r) => ((a[r.status] = (a[r.status] ?? 0) + 1), a), {}),
);
