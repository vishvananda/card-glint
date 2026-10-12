import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fixtureRoot, outputRoot, readJson, writeJson, hash } from './common.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { letteringContrast } from './lettering-contrast.mjs';
import { median } from './metrics.mjs';

const [set, phase = 'reserved', planName = 'set-symbol-topology-plan'] = process.argv.slice(2);
assert.ok(['m15', 'war'].includes(set));
assert.match(planName, /^[a-z0-9-]+$/);
assert.ok(['development', 'reserved', 'walkers'].includes(phase));
const planBytes = await readFile(`${fixtureRoot}/${planName}.json`),
  plan = JSON.parse(planBytes),
  prefix = `symbol-topology${phase === 'development' ? '' : '-' + phase}`,
  captures = {};
for (const stage of ['before', 'after']) {
  const run = plan.runs?.[phase]?.[stage] ?? `${prefix}-${stage}`,
    bytes = await readFile(`${outputRoot}/${set}/${run}/capture.json`),
    data = JSON.parse(bytes);
  assert.equal(
    data.rendererHash,
    stage === 'before' ? plan.baselineRendererHash : plan.rendererHash,
  );
  assert.equal(data.snapshotIdentity, plan.sets[set].snapshotIdentity);
  captures[stage] = { run, hash: hash(bytes), data };
}
const before = captures.before.data,
  after = captures.after.data;
assert.equal(before.fontStylesheetHash, after.fontStylesheetHash);
assert.equal(before.browser, after.browser);
assert.deepEqual(before.results.map((r) => r.id).sort(), after.results.map((r) => r.id).sort());
assert.equal(new Set(after.results.map((r) => r.id)).size, after.results.length);
if (phase !== 'walkers')
  assert.deepEqual(
    after.results.map((r) => r.id).sort(),
    plan.sets[set][phase].map((r) => r.id).sort(),
  );
const rows = [],
  start = performance.now();
async function image(stage, asset) {
  const bytes = await readFile(`${outputRoot}/${set}/${captures[stage].run}/${asset.file}`);
  assert.equal(hash(bytes), asset.sha256);
  return PNG.sync.read(bytes);
}
async function region(stage, asset, rect) {
  return cachedGrayRegion(
    `${outputRoot}/${set}/${captures[stage].run}/${asset.file}`,
    asset.sha256,
    rect,
  );
}
for (const current of after.results) {
  const previous = before.results.find((r) => r.id === current.id);
  assert.ok(!current.issue && !previous.issue);
  assert.equal(current.inputHash, previous.inputHash);
  assert.deepEqual(current.layout, previous.layout);
  assert.deepEqual(current.specialLayout, previous.specialLayout);
  assert.equal(current.images.reference.sha256, previous.images.reference.sha256);
  const rect = plan.regions[current.frame];
  assert.ok(rect);
  const windows = {
      context: rect,
      ...(current.frame === 'normal' ? { symbol: plan.symbolRegions[set] } : {}),
    },
    row = {
      id: current.id,
      number: current.collectorNumber,
      name: current.name,
      frame: current.frame,
      rarity: current.face.rarity,
      inputHash: current.inputHash,
      referenceHash: current.images.reference.sha256,
      tiers: {},
    };
  for (const tier of ['inspect', 'table']) {
    const a = await image('before', previous.images[tier]),
      b = await image('after', current.images[tier]);
    assert.equal(a.width, b.width);
    assert.equal(a.height, b.height);
    let changed = 0;
    for (let p = 0; p < a.data.length; p += 4) {
      if (
        a.data[p] === b.data[p] &&
        a.data[p + 1] === b.data[p + 1] &&
        a.data[p + 2] === b.data[p + 2] &&
        a.data[p + 3] === b.data[p + 3]
      )
        continue;
      const x = (((p / 4) % a.width) * 488) / a.width,
        y = (Math.floor(p / 4 / a.width) * 680) / a.height;
      assert.ok(
        x >= rect[0] && x < rect[0] + rect[2] && y >= rect[1] && y < rect[1] + rect[3],
        `Changed outside symbol window: ${set} ${row.number} ${tier} ${x},${y}`,
      );
      changed++;
    }
    const scores = {};
    for (const [name, window] of Object.entries(windows)) {
      const ref = await region('after', current.images.reference, window);
      scores[name] = {};
      for (const [stage, result] of [
        ['before', previous],
        ['after', current],
      ]) {
        const rendered = await region(stage, result.images[tier], window),
          args = [ref.gray, rendered.gray, window[2], window[3]],
          pair = compareLettering(...args);
        scores[name][stage] = {
          edgeF1: pair.edgeF1,
          contrast: letteringContrast(...args),
          census: pair.censusSimilarity,
        };
      }
    }
    row.tiers[tier] = { changedPixels: changed, unchangedOutsideSymbol: true, scores };
  }
  rows.push(row);
}
const summary = {};
for (const tier of ['inspect', 'table']) {
  summary[tier] = {};
  for (const name of Object.keys(rows[0].tiers[tier].scores)) {
    summary[tier][name] = Object.fromEntries(
      ['edgeF1', 'contrast', 'census'].map((metric) => [
        metric,
        {
          before: median(rows.map((r) => r.tiers[tier].scores[name].before[metric])),
          after: median(rows.map((r) => r.tiers[tier].scores[name].after[metric])),
          gains: rows.filter(
            (r) =>
              r.tiers[tier].scores[name].after[metric] - r.tiers[tier].scores[name].before[metric] >
              0.02,
          ).length,
          regressions: rows
            .filter(
              (r) =>
                r.tiers[tier].scores[name].after[metric] -
                  r.tiers[tier].scores[name].before[metric] <
                -0.02,
            )
            .map((r) => r.number),
        },
      ]),
    );
  }
}
const methods = Object.fromEntries(
  await Promise.all(
    [
      'normalized-gray-region',
      'region-cache',
      'lettering-metrics',
      'lettering-contrast',
      'edges',
      'metrics',
    ].map(async (name) => [name, hash(await readFile(new URL(`./${name}.mjs`, import.meta.url)))]),
  ),
);
await writeJson(
  `${fixtureRoot}/${plan.reportPrefix ?? 'set-symbol-topology'}-${set}-${phase}-validation.json`,
  {
    schemaVersion: 1,
    set,
    phase,
    scope:
      'Paired identical-input captures; fixed scan normalization, no per-card fitting. All pixels outside symbol windows and all text layouts must remain identical. Normal symbol windows reduce surrounding frame ink; planeswalker context windows may contain frame ink. Component metrics are not whole-card accuracy percentages.',
    planHash: hash(planBytes),
    studyHash: hash(await readFile(new URL(import.meta.url))),
    methods,
    captures: Object.fromEntries(
      Object.entries(captures).map(([k, v]) => [
        k,
        { run: v.run, hash: v.hash, rendererHash: v.data.rendererHash },
      ]),
    ),
    summary,
    rows,
    timing: {
      milliseconds: performance.now() - start,
      scope: 'CPU decoding, pixel invariants and structural diagnostics. No Chromium or GPU work.',
    },
  },
);
console.log(JSON.stringify({ set, phase, cards: rows.length, summary }, null, 2));
