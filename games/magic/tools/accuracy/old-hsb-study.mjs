import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { readJson, writeJson, fixtureRoot, cacheRoot, hash, root } from './common.mjs';
import { evaluateHsb, median, center } from './hsb-color.mjs';
import { fitSharedHsb } from './hsb-shared-color.mjs';
const action = process.argv[2];
assert.ok(['fit', 'validate'].includes(action));
const plan = await readJson(`${fixtureRoot}/old-frame-family-plan.json`),
  families = await readJson(`${fixtureRoot}/old-frame-family-results.json`),
  samples = await readJson(`${cacheRoot}/rollout/old-hsb-samples.json`),
  early = await readJson(`${fixtureRoot}/early-hsb-plan.json`);
assert.equal(samples.planHash, hash(JSON.stringify(plan)));
assert.equal(families.planHash, samples.planHash);
const provenance = {
  planHash: samples.planHash,
  familyHash: hash(JSON.stringify(families)),
  samplesHash: hash(JSON.stringify(samples)),
  sampleMethodHash: samples.methodHash,
  templateHash: samples.templateHash,
};
const methodHash = hash(
  Buffer.concat(
    await Promise.all(
      [
        'old-hsb-study.mjs',
        'hsb-shared-color.mjs',
        'hsb-color.mjs',
        '../../src/presentation/hsb.ts',
        '../../src/presentation/mana-colors.ts',
      ].map((p) => readFile(new URL(p, import.meta.url))),
    ),
  ),
);
const candidateFile = `${fixtureRoot}/old-hsb-candidate.json`;
let frozen;
if (action === 'fit') {
  try {
    await readFile(candidateFile);
    throw Error('Candidate already frozen');
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
} else {
  frozen = await readJson(candidateFile);
  assert.equal(frozen.methodHash, methodHash);
  assert.deepEqual(frozen.provenance, provenance);
}
const cohort = action === 'fit' ? 'calibration' : 'validation',
  required = action === 'fit' ? 3 : 2;
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});
const groups = [],
  mana = [];
const summary = (rows) =>
  rows.length
    ? {
        before: median(rows.map((r) => r.before)),
        after: median(rows.map((r) => r.after)),
        worstRegression: Math.max(0, ...rows.map((r) => r.after - r.before)),
        clipping: Math.max(...rows.map((r) => r.clipping)),
      }
    : null;
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const { BITMAP_MANA_COLORS } = await server.ssrLoadModule(
    '/games/magic/src/presentation/mana-colors.ts',
  );
  for (const set of plan.sets.filter((s) => !['lea', 'leb', '2ed', '3ed'].includes(s.set)))
    for (const g of set.groups) {
      const key = `${set.set}/${g.key}`,
        all = samples.rows.filter((r) => r.set === set.set && r.group === g.key),
        rows = all.filter((r) => r.cohort === cohort && r.components),
        plates = [...new Set(all.map((r) => r.plate).filter(Boolean))],
        source = plates.length === 1 ? samples.sources[plates[0]] : null,
        cal = frozen?.groups.find((r) => r.key === key);
      const flags = [];
      if (rows.length < required) flags.push('sparse-cohort');
      if (!source) flags.push('missing-or-mixed-source');
      if (g.layout !== 'normal' || g.material.startsWith('dual-'))
        flags.push('specialized-material');
      if (all.some((r) => r.filter !== 'none')) flags.push('existing-frame-filter');
      if (Object.keys(g.issues).length) flags.push('partial-adapter-coverage');
      let adjustment = cal?.adjustment ?? math.IDENTITY_HSB,
        components = null,
        measurements = [];
      if (source && rows.length) {
        if (!cal)
          adjustment = fitSharedHsb(
            ['frame', 'paper'].map((c) => ({
              source: source.components[c],
              references: rows.map((r) => r.components[c]),
            })),
            early.model,
            math,
          ).adjustment;
        measurements = rows.map((r) => ({
          id: r.id,
          name: r.name,
          components: Object.fromEntries(
            ['frame', 'paper'].map((c) => [
              c,
              evaluateHsb(source.components[c], r.components[c], adjustment, math),
            ]),
          ),
        }));
        components = Object.fromEntries(
          ['frame', 'paper'].map((c) => [c, summary(measurements.map((r) => r.components[c]))]),
        );
        for (const [c, s] of Object.entries(components)) {
          if (s.after > s.before + 0.25) flags.push(`${c}-median-regression`);
          if (s.worstRegression > 1) flags.push(`${c}-card-regression`);
          if (s.clipping > 0.02) flags.push(`${c}-clipping`);
        }
        const before = median(Object.values(components).map((s) => s.before)),
          after = median(Object.values(components).map((s) => s.after));
        if (after > before - 0.25) flags.push('no-material-gain');
      }
      if (cal?.status !== 'trial' && action === 'validate') flags.push('calibration-not-admitted');
      const result = {
        key,
        set: set.set,
        group: g.key,
        material: g.material,
        border: g.border,
        printings: g.printings,
        source: source
          ? { plate: plates[0], asset: source.url, rect: source.rect, sha256: source.sha256 }
          : null,
        count: rows.length,
        adjustment,
        components,
        flags,
        status: flags.length ? 'review-only' : 'trial',
        rows: measurements.map((r) => ({
          id: r.id,
          components: Object.fromEntries(
            Object.entries(r.components).map(([c, v]) => [c, { before: v.before, after: v.after }]),
          ),
        })),
      };
      groups.push(result);
      console.log(
        key,
        result.status,
        components
          ? Object.entries(components)
              .map(([c, v]) => `${c} ${v.before.toFixed(2)}→${v.after.toFixed(2)}`)
              .join(' ')
          : 'unmeasurable',
        flags.join(','),
      );
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
      cal = frozen?.mana.find((r) => r.key === key);
    const adjustment =
        cal?.adjustment ??
        (refs.length
          ? fitSharedHsb([{ source, references: refs }], early.model, math).adjustment
          : math.IDENTITY_HSB),
      rows = refs.map((r) => ({
        id: r.id,
        ...evaluateHsb(source, r, adjustment, math),
        sensitivity: r.sensitivity,
      })),
      s = summary(rows),
      flags = [];
    if (refs.length < required) flags.push('sparse-cohort');
    if (s) {
      if (s.after > s.before - 0.25) flags.push('no-material-gain');
      if (s.worstRegression > 1) flags.push('reserved-regression');
      if (s.clipping > 0.02) flags.push('clipping');
      if (median(rows.map((r) => r.sensitivity)) > 1.5) flags.push('position-sensitive');
    }
    if (cal?.status !== 'trial' && action === 'validate') flags.push('calibration-not-admitted');
    mana.push({
      key,
      set,
      border,
      symbol,
      count: refs.length,
      sourceHex: hex,
      adjustment,
      targetRgb: cal?.targetRgb ?? math.adjustHsb(rgb, adjustment),
      summary: s,
      flags,
      status: flags.length ? 'review-only' : 'trial',
      rows: rows.map((r) => ({
        id: r.id,
        before: r.before,
        after: r.after,
        sensitivity: r.sensitivity,
      })),
    });
  }
} finally {
  await server.close();
}
const count = (rows) => rows.reduce((a, g) => ((a[g.status] = (a[g.status] ?? 0) + 1), a), {});
const result = {
  schemaVersion: 1,
  provenance,
  methodHash,
  cohort,
  policy:
    'One whole-frame HSB per set/stock/material using retained source assets. Equal frame/paper weight; median transformed source tiles; original metadata-only cohorts. Per-component regression, clipping and sparse gates. No per-scan color or alignment fit. Remaining old-frame sets include modern retro reprints. Fixed interior RGB samples; not 13,603 full renders or physical ink measurements. Mana separately by set/stock/symbol with fixed eroded discs and offset sensitivity.',
  summary: {
    sets: new Set(groups.map((g) => g.set)).size,
    groups: groups.length,
    measured: groups.filter((g) => g.components).length,
    groupStatus: count(groups),
    mana: mana.length,
    manaStatus: count(mana),
  },
  groups,
  mana,
};
if (action === 'fit') await writeJson(candidateFile, result);
else {
  result.candidateHash = hash(JSON.stringify(frozen));
  await writeJson(`${fixtureRoot}/old-hsb-results.json`, result);
}
console.log(result.summary);
