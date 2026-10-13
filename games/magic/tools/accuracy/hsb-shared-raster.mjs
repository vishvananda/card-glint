import assert from 'node:assert/strict';
import {
  readJson,
  writeJson,
  fixtureRoot,
  outputRoot,
  cacheRoot,
  objectFile,
  hash,
  sourceHash,
  root,
} from './common.mjs';
import { readPng, normalize } from './pixels.mjs';
import { sampleColor, delta, median } from './hsb-color.mjs';
import { perCardMana } from './hsb-shared-color.mjs';
const base = `${outputRoot}/early-hsb`,
  plan = await readJson(`${fixtureRoot}/early-hsb-plan.json`),
  results = await readJson(`${fixtureRoot}/early-hsb-family-results.json`),
  candidate = await readJson(`${fixtureRoot}/early-hsb-family-candidate.json`),
  snapshot = await readJson(`${cacheRoot}/rollout/early-hsb.json`),
  before = await readJson(`${base}/before/capture.json`),
  after = await readJson(`${base}/after/capture.json`);
assert.equal(after.rendererHash, await sourceHash(`${root}/games/magic/src`));
const rows = [],
  mana = [];
for (const row of after.rows) {
  const entry = snapshot.entries.find((e) => e.id === row.id),
    scan = normalize(await readPng(objectFile(entry.reference)));
  const original = before.rows.find((r) => r.id === row.id);
  for (const tier of ['inspect', 'table']) {
    const old = normalize(await readPng(`${base}/before/${original.images[tier].file}`)),
      current = normalize(await readPng(`${base}/after/${row.images[tier].file}`));
    // Inside the art window, safely away from antialiased frame boundaries.
    let artChanges = 0;
    for (let y = 100; y < 350; y++)
      for (let x = 80; x < 410; x++) {
        const i = (y * old.width + x) * 4;
        if ([0, 1, 2, 3].some((c) => old.data[i + c] !== current.data[i + c])) artChanges++;
      }
    assert.equal(artChanges, 0, `Art changed ${row.id}/${tier}`);
    const components = {};
    for (const component of ['frame', 'paper']) {
      const opts = { paper: component === 'paper', tileSize: plan.sampling.tileSize },
        patches = plan.sampling[component + 'Patches'];
      const ref = sampleColor(scan, patches, opts),
        a = sampleColor(old, patches, opts),
        b = sampleColor(current, patches, opts),
        group = results.groups.find((g) => g.key === `${row.set}-${row.material}`);
      components[component] = {
        status:
          group.status === 'trial' &&
          candidate.groups.find((g) => g.key === group.key)?.status === 'trial' &&
          /-(W|U|B|R|G|A)$/.test(group.key)
            ? 'trial'
            : 'review-only',
        flags: group.flags,
        before: delta(a.rgb, ref.rgb),
        after: delta(b.rgb, ref.rgb),
        referenceRgb: ref.rgb,
        beforeRgb: a.rgb,
        afterRgb: b.rgb,
        modelPrediction:
          group.rows.find((r) => r.id === row.id)?.components[component].after ?? null,
      };
    }
    rows.push({
      id: row.id,
      set: row.set,
      material: row.material,
      name: row.name,
      cohort: row.cohort,
      tier,
      artChanges,
      components,
    });
    if (tier === 'inspect') {
      const symbols = row.face.manaSymbols ?? [],
        refs = perCardMana(scan, row.set, symbols),
        oldMana = perCardMana(old, row.set, symbols),
        newMana = perCardMana(current, row.set, symbols);
      for (const ref of refs) {
        const a = oldMana.find((m) => m.symbol === ref.symbol),
          b = newMana.find((m) => m.symbol === ref.symbol),
          group = results.mana.find((g) => g.key === `${row.set}-${ref.symbol}`);
        mana.push({
          id: row.id,
          set: row.set,
          symbol: ref.symbol,
          cohort: row.cohort,
          status:
            group?.status === 'trial' &&
            candidate.mana.find((g) => g.key === group.key)?.status === 'trial'
              ? 'trial'
              : 'review-only',
          flags: group?.flags ?? [],
          before: delta(a.rgb, ref.rgb),
          after: delta(b.rgb, ref.rgb),
          referenceRgb: ref.rgb,
          beforeRgb: a.rgb,
          afterRgb: b.rgb,
          offsetSensitivity: ref.sensitivity,
        });
      }
    }
  }
}
const enabled = rows
  .filter((r) => r.cohort === 'validation' && r.tier === 'inspect')
  .flatMap((r) => Object.values(r.components).filter((c) => c.status === 'trial'));
const report = {
  schemaVersion: 2,
  rendererHash: after.rendererHash,
  planHash: after.planHash,
  resultsHash: hash(JSON.stringify(results)),
  beforeCaptureHash: hash(JSON.stringify(before)),
  afterCaptureHash: hash(JSON.stringify(after)),
  defaultPixelsIdentical: after.defaultPixelsIdentical,
  summary: {
    reservedEnabledComponents: enabled.length,
    before: median(enabled.map((c) => c.before)),
    after: median(enabled.map((c) => c.after)),
    worstRegression: Math.max(0, ...enabled.map((c) => c.after - c.before)),
    artChanges: 0,
    mana: summarize(mana.filter((m) => m.cohort === 'validation' && m.status === 'trial')),
  },
  rows,
  mana,
};
await writeJson(`${fixtureRoot}/early-hsb-family-raster-results.json`, report);
console.log(JSON.stringify(report.summary));

function summarize(rows) {
  return {
    count: rows.length,
    before: median(rows.map((r) => r.before)),
    after: median(rows.map((r) => r.after)),
    worstRegression: Math.max(0, ...rows.map((r) => r.after - r.before)),
  };
}
