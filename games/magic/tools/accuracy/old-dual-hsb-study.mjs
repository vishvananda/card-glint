import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { readJson, writeJson, fixtureRoot, cacheRoot, hash, root } from './common.mjs';
import { fitHsb, evaluateHsb, median } from './hsb-color.mjs';
import { textureMetrics } from './hsb-texture.mjs';
import { oldDualMask } from './old-dual-hsb-specs.mjs';
const action = process.argv[2];
assert.ok(['fit', 'validate'].includes(action));
const samples = await readJson(cacheRoot + '/rollout/old-dual-hsb-samples.json'),
  plan = await readJson(fixtureRoot + '/early-hsb-plan.json'),
  planAll = await readJson(fixtureRoot + '/old-frame-family-plan.json');
const provenance = {
  samplesHash: hash(JSON.stringify(samples)),
  sampleMethodHash: samples.methodHash,
  planHash: samples.planHash,
  targetHash: samples.targetHash,
};
const methodHash = hash(
  Buffer.concat(
    await Promise.all(
      [
        'old-dual-hsb-study.mjs',
        'old-dual-hsb-specs.mjs',
        'hsb-color.mjs',
        'hsb-texture.mjs',
        '../../src/presentation/hsb.ts',
      ].map((p) => readFile(new URL(p, import.meta.url))),
    ),
  ),
);
const candidateFile = fixtureRoot + '/old-dual-hsb-candidate.json';
let frozen;
if (action === 'fit') {
  try {
    await readFile(candidateFile);
    throw Error('Candidate already frozen');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
} else {
  frozen = await readJson(candidateFile);
  assert.deepEqual(frozen.provenance, provenance);
  assert.equal(frozen.methodHash, methodHash);
}
const policy = {
  minimumCalibration: 3,
  minimumValidation: 2,
  medianError: 5,
  medianRegression: 0.25,
  cardRegression: 2,
  clipping: 0.02,
  frameChroma: 3,
  shadowChroma: 3,
  shadowLightness: 5,
  contrastError: 2,
  manaSensitivity: 1.5,
  description:
    'Separate set/stock/material frame and paper HSB. Metadata-frozen cohorts; per-scan frame-only pose. Absolute frame chroma, dark-bin chroma/lightness and texture-contrast gates are evaluated separately. These conservative operational cutoffs do not certify perceptual equivalence. No scan-specific color or contrast correction. Specialized dual/composite lands and existing CSS filters remain review-only.',
};
const cohort = action === 'fit' ? 'calibration' : 'validation',
  required = action === 'fit' ? policy.minimumCalibration : policy.minimumValidation;
const summary = (rows) =>
  rows.length
    ? {
        before: median(rows.map((r) => r.before)),
        after: median(rows.map((r) => r.after)),
        worstRegression: Math.max(0, ...rows.map((r) => r.after - r.before)),
        clipping: Math.max(...rows.map((r) => r.clipping)),
      }
    : null;
const server = await createServer({
    configFile: false,
    root,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false },
  }),
  groups = [],
  mana = [];
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const { BITMAP_MANA_COLORS } = await server.ssrLoadModule(
    '/games/magic/src/presentation/mana-colors.ts',
  );
  const keys = [...new Set(samples.rows.map((r) => `${r.set}/${r.group}`))];
  for (const key of keys) {
    const all = samples.rows.filter((r) => `${r.set}/${r.group}` === key),
      base = all[0],
      rows = all.filter((r) => r.cohort === cohort && r.components),
      plates = [...new Set(all.map((r) => r.plate).filter(Boolean))],
      source = plates.length === 1 ? samples.sources[plates[0]] : undefined,
      cal = frozen?.groups.find((g) => g.key === key),
      mask = source?.components ? oldDualMask(plates[0], source) : undefined,
      flags = [];
    if (rows.length < required) flags.push('sparse-normalized-cohort');
    if (!source?.components) flags.push('missing-or-mixed-source');
    if (!mask) flags.push('missing-paper-mask');
    if (all.some((r) => r.layout !== 'normal' || r.material.startsWith('dual-')))
      flags.push('specialized-material');
    if (all.some((r) => r.filter !== 'none')) flags.push('existing-frame-filter');
    let adjustment = cal?.adjustment,
      components = null,
      texture = null,
      measurements = [];
    if (source?.components && rows.length && mask) {
      adjustment ??= {
        ...Object.fromEntries(
          ['frame', 'paper'].map((c) => [
            c,
            fitHsb(
              source.components[c],
              rows.map((r) => r.components[c]),
              plan.model,
              math,
            ).adjustment,
          ]),
        ),
        mask,
      };
      measurements = rows.map((r) => ({
        id: r.id,
        name: r.name,
        referenceHash: r.referenceHash,
        components: Object.fromEntries(
          ['frame', 'paper'].map((c) => [
            c,
            evaluateHsb(source.components[c], r.components[c], adjustment[c], math),
          ]),
        ),
        texture: textureMetrics(
          source.components.frame.texture.map((t) => math.adjustHsb(t, adjustment.frame)),
          r.components.frame.texture,
        ),
      }));
      components = Object.fromEntries(
        ['frame', 'paper'].map((c) => [c, summary(measurements.map((r) => r.components[c]))]),
      );
      texture = Object.fromEntries(
        Object.keys(measurements[0].texture).map((k) => [
          k,
          median(measurements.map((r) => r.texture[k])),
        ]),
      );
      for (const [c, s] of Object.entries(components)) {
        if (s.after > policy.medianError) flags.push(c + '-color-error');
        if (s.after > s.before + policy.medianRegression) flags.push(c + '-median-regression');
        if (s.worstRegression > policy.cardRegression) flags.push(c + '-card-regression');
        if (s.clipping > policy.clipping) flags.push(c + '-clipping');
      }
      for (const [metric, limit] of [
        ['chroma', policy.frameChroma],
        ['shadowChroma', policy.shadowChroma],
        ['shadowLightness', policy.shadowLightness],
        ['contrastError', policy.contrastError],
      ])
        if (texture[metric] > limit) flags.push('texture-' + metric);
    }
    if (action === 'validate' && cal?.status !== 'trial') flags.push('calibration-not-admitted');
    groups.push({
      key,
      set: base.set,
      group: base.group,
      material: base.material,
      border: base.border,
      source: source
        ? { plate: plates[0], asset: source.url, rect: source.rect, sha256: source.asset.sha256 }
        : null,
      count: rows.length,
      normalizationRejected: all.filter((r) => !r.components).length,
      adjustment,
      components,
      texture,
      flags,
      status: flags.length ? 'review-only' : 'trial',
      rows: measurements,
    });
  }
  const manaKeys = [
    ...new Set(
      samples.rows.flatMap((r) => (r.mana ?? []).map((m) => `${r.set}/${r.border}/${m.symbol}`)),
    ),
  ];
  for (const key of manaKeys) {
    const [set, border, symbol] = key.split('/'),
      refs = samples.rows
        .filter((r) => r.set === set && r.border === border && r.cohort === cohort)
        .flatMap((r) =>
          (r.mana ?? []).filter((m) => m.symbol === symbol).map((m) => ({ id: r.id, ...m })),
        ),
      hex = BITMAP_MANA_COLORS[symbol];
    assert.ok(hex);
    const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255),
      source = { rgb, tiles: [rgb], spread: 0 },
      cal = frozen?.mana.find((g) => g.key === key),
      adjustment =
        cal?.adjustment ??
        (refs.length ? fitHsb(source, refs, plan.model, math).adjustment : math.IDENTITY_HSB),
      rows = refs.map((r) => ({
        id: r.id,
        ...evaluateHsb(source, r, adjustment, math),
        sensitivity: r.sensitivity,
      })),
      s = summary(rows),
      flags = [];
    if (rows.length < required) flags.push('sparse-normalized-cohort');
    if (s) {
      if (s.after > policy.medianError) flags.push('color-error');
      if (s.after > s.before + policy.medianRegression) flags.push('median-regression');
      if (s.worstRegression > policy.cardRegression) flags.push('card-regression');
      if (s.clipping > policy.clipping) flags.push('clipping');
      if (Math.max(...rows.map((r) => r.sensitivity)) > policy.manaSensitivity)
        flags.push('position-sensitive');
    }
    if (action === 'validate' && cal?.status !== 'trial') flags.push('calibration-not-admitted');
    mana.push({
      key,
      set,
      border,
      symbol,
      count: rows.length,
      sourceHex: hex,
      adjustment,
      targetRgb: cal?.targetRgb ?? math.adjustHsb(rgb, adjustment),
      summary: s,
      flags,
      status: flags.length ? 'review-only' : 'trial',
      rows,
    });
  }
} finally {
  await server.close();
}
const count = (rows) => rows.reduce((a, r) => ((a[r.status] = (a[r.status] ?? 0) + 1), a), {});
const result = {
  schemaVersion: 1,
  provenance,
  methodHash,
  cohort,
  policy,
  summary: {
    plannedSets: planAll.sets.length,
    sampledSets: new Set(groups.map((g) => g.set)).size,
    groups: groups.length,
    groupStatus: count(groups),
    mana: mana.length,
    manaStatus: count(mana),
  },
  groups,
  mana,
};
if (action === 'validate') result.candidateHash = hash(JSON.stringify(frozen));
await writeJson(
  action === 'fit' ? candidateFile : fixtureRoot + '/old-dual-hsb-results.json',
  result,
);
console.log(result.summary);
for (const g of groups.filter(
  (g) => ['usg', 'ulg', 'uds', '3ed'].includes(g.set) && ['W', 'G', 'B'].includes(g.material),
))
  console.log(g.key, g.status, g.components, g.texture, g.flags);
