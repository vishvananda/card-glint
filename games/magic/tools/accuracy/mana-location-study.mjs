import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { PNG } from 'pngjs';
import { readJson, writeJson, cacheRoot, fixtureRoot, hash, sourceHash } from './common.mjs';
import { readObject } from './cache.mjs';
import { normalize, luminance } from './pixels-pure.mjs';
import { manaRowLandmarks } from './mana-landmark.mjs';
import { median } from './metrics.mjs';
const filter = process.argv.slice(2),
  snapshot = await readJson(cacheRoot + '/rollout/old-frame-families.json'),
  samples = await readJson(cacheRoot + '/rollout/old-dual-hsb-samples.json'),
  cards = new Map(),
  rows = [],
  methodHash = await sourceHash(
    new URL('.', import.meta.url),
    /^(mana-location-study|mana-landmark|edges|pixels-pure)\.mjs$/,
  );
for (const set of new Set(snapshot.entries.map((e) => e.set))) {
  if (filter.length && !filter.includes(set)) continue;
  const s = await readJson(cacheRoot + '/rollout/sets/' + set + '.json');
  for (const p of s.pages)
    for (const c of JSON.parse((await readObject(p)).toString()).data) cards.set(c.id, c);
}
for (const e of snapshot.entries) {
  const card = cards.get(e.id);
  if (!card || ['lea', 'leb', '2ed', '3ed', '4ed', 'mir', 'tmp'].includes(e.set)) continue;
  const symbols = [...(card.mana_cost ?? '').matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
  if (!symbols.length || symbols.length > 8 || card.layout !== 'normal') continue;
  const pose = samples.rows.find((r) => r.id === e.id);
  const row = {
    id: e.id,
    name: e.name,
    set: e.set,
    border: e.border,
    material: e.material,
    cohort: e.cohort,
    symbols,
    referenceHash: e.reference.sha256,
    normalization: pose?.normalization,
  };
  rows.push(row);
  if (!pose?.normalization.accepted) {
    row.status = 'frame-rejected';
    continue;
  }
  assert.equal(pose.referenceHash, e.reference.sha256);
  const file = cacheRoot + '/rollout/mana-locations/' + e.id + '.json';
  const identity = hash(JSON.stringify([row, methodHash]));
  try {
    const old = await readJson(file);
    if (old.identity === identity) {
      Object.assign(row, old.row);
      continue;
    }
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  const t = performance.now();
  const image = normalize(
    PNG.sync.read(await readObject(e.reference)),
    pose.normalization.transform,
  );
  const measured = manaRowLandmarks(luminance(image), 488, 680, {
    count: symbols.length,
    rightX: 438,
    y: 44,
    pitch: 26.5,
    range: 8,
  });
  row.status = measured.status;
  row.measurement = measured;
  await writeJson(file, { identity, row });
  console.log(
    e.set,
    e.name,
    row.status,
    measured.circles.map((c) => [c.x, c.y, c.radius]),
    Math.round(performance.now() - t) + 'ms',
  );
}
const groups = [];
for (const key of new Set(rows.map((r) => r.set + '/' + r.border))) {
  const all = rows.filter((r) => r.set + '/' + r.border === key),
    measured = all.filter((r) => r.status === 'measured' && r.measurement.verticalSpread <= 1.5);
  const cal = measured.filter((r) => r.cohort === 'calibration'),
    val = measured.filter((r) => r.cohort === 'validation');
  const candidate = {
    right: median(cal.map((r) => r.measurement.circles[0].x)),
    centerY: median(cal.flatMap((r) => r.measurement.circles.map((c) => c.y))),
    pitch: median(cal.filter((r) => r.symbols.length > 1).map((r) => r.measurement.pitch)),
    size: 23.4,
  };
  for (const k of ['right', 'centerY', 'pitch']) candidate[k] = Math.round(candidate[k] * 2) / 2;
  const error = (r, p) =>
    median(
      r.measurement.circles.map((c, i) =>
        Math.hypot(c.x - (p.right - i * p.pitch), c.y - p.centerY),
      ),
    );
  const baseline = {
    right: 488 * (0.1134 + 0.8) - 1.7 - 23.4 / 2,
    centerY: 680 * (0.0481 + 0.043 / 2),
    pitch: 25.1,
  };
  const validation = val.map((r) => ({
    id: r.id,
    name: r.name,
    before: error(r, baseline),
    after: error(r, candidate),
  }));
  const before = median(validation.map((r) => r.before)),
    after = median(validation.map((r) => r.after));
  const flags = [];
  if (cal.length < 4 || val.length < 3 || cal.filter((r) => r.symbols.length > 1).length < 3)
    flags.push('insufficient-disc-measurements');
  if (!Object.values(candidate).every(Number.isFinite)) flags.push('incomplete-candidate');
  if (after > 1 || before - after < 0.5) flags.push('weak-reserved-gain');
  if (validation.some((r) => r.after > r.before + 0.5)) flags.push('reserved-regression');
  groups.push({
    key,
    total: all.length,
    measured: measured.length,
    calibration: cal.length,
    validation: val.length,
    candidate,
    baseline,
    before,
    after,
    flags,
    status: flags.length ? 'review' : 'candidate',
    rows: validation,
  });
}
await writeJson(
  `${cacheRoot}/rollout/mana-location${filter.length ? '-' + filter.join('-') : ''}.json`,
  {
    schemaVersion: 1,
    methodHash,
    normalizationMethod: samples.methodHash,
    scope:
      'Generic ordinary old-frame cost rows; previously specialized ABU/Revised/Fourth/Mirage/Tempest retain their separate validated policies.',
    groups,
    rows,
  },
);
await writeJson(
  `${fixtureRoot}/mana-location-summary${filter.length ? '-' + filter.join('-') : ''}.json`,
  { schemaVersion: 1, methodHash, normalizationMethod: samples.methodHash, groups },
);
console.log(
  groups.map(({ key, status, candidate, before, after, calibration, validation, flags }) => ({
    key,
    status,
    candidate,
    before,
    after,
    calibration,
    validation,
    flags,
  })),
);
