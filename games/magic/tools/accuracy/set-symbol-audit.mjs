import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fixtureRoot, outputRoot, readJson, writeJson, hash } from './common.mjs';
import { readPng, normalize, cropGray } from './pixels.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { letteringContrast } from './lettering-contrast.mjs';
import { componentOffset } from './component-offset.mjs';
import { median } from './metrics.mjs';

const [run, cohort = 'development'] = process.argv.slice(2);
if (!/^[a-z0-9-]+$/.test(run ?? '') || !['development', 'reserved'].includes(cohort))
  throw Error('Usage: set-symbol-audit.mjs RUN [development|reserved]');
const planBytes = await readFile(`${fixtureRoot}/set-symbol-plan.json`),
  plan = JSON.parse(planBytes),
  rows = [],
  captures = {};
const started = performance.now();
async function capture(set, name) {
  const key = `${set}/${name}`;
  if (!captures[key]) {
    const bytes = await readFile(`${outputRoot}/${key}/capture.json`);
    captures[key] = { hash: hash(bytes), data: JSON.parse(bytes) };
    if (name === plan.baseline) assert.equal(hash(bytes), plan.baselineCaptures[set]);
    else {
      assert.ok(plan.rendererHashes[name], 'Run was not frozen in the study plan');
      assert.equal(captures[key].data.rendererHash, plan.rendererHashes[name]);
    }
  }
  return captures[key].data;
}
async function raster(set, name, asset) {
  const file = `${outputRoot}/${set}/${name}/${asset.file}`;
  assert.equal(hash(await readFile(file)), asset.sha256);
  return normalize(await readPng(file));
}
function score(a, b, rect) {
  const reference = cropGray(a, rect),
    render = cropGray(b, rect);
  const args = [reference.gray, render.gray, reference.width, reference.height];
  return {
    ...compareLettering(...args),
    contrast: letteringContrast(...args),
    offset: componentOffset(...args, false, 6),
  };
}
for (const card of plan.cards.filter((card) => card.cohort === cohort)) {
  const before = (await capture(card.set, plan.baseline)).results.find((r) => r.id === card.id),
    after = (await capture(card.set, run)).results.find((r) => r.id === card.id);
  assert.ok(before && after && !before.issue && !after.issue);
  assert.equal(before.inputHash, card.inputHash);
  assert.equal(after.inputHash, card.inputHash);
  assert.equal(after.images.reference.sha256, card.referenceHash);
  const reference = await raster(card.set, run, after.images.reference),
    scores = {};
  for (const tier of ['inspect', 'table'])
    scores[tier] = {
      before: score(
        reference,
        await raster(card.set, plan.baseline, before.images[tier]),
        plan.regions.symbol,
      ),
      after: score(reference, await raster(card.set, run, after.images[tier]), plan.regions.symbol),
    };
  rows.push({ ...card, scores });
}
const summary = {};
for (const tier of ['inspect', 'table']) {
  summary[tier] = {};
  for (const rarity of ['all', 'common', 'uncommon', 'rare', 'mythic']) {
    const subset = rows.filter((r) => rarity === 'all' || r.rarity === rarity);
    summary[tier][rarity] = { cards: subset.length };
    for (const metric of ['edgeF1', 'contrast', 'censusSimilarity']) {
      const pairs = subset.filter((r) =>
        ['before', 'after'].every((v) => r.scores[tier][v][metric] != null),
      );
      summary[tier][rarity][metric] = {
        measured: pairs.length,
        before: median(pairs.map((r) => r.scores[tier].before[metric])),
        after: median(pairs.map((r) => r.scores[tier].after[metric])),
        gains: pairs.filter(
          (r) => r.scores[tier].after[metric] - r.scores[tier].before[metric] > 0.02,
        ).length,
        regressions: pairs
          .filter((r) => r.scores[tier].after[metric] - r.scores[tier].before[metric] < -0.02)
          .map((r) => `${r.set}/${r.number}`),
      };
    }
  }
}
const report = {
  schemaVersion: 1,
  run,
  cohort,
  planHash: hash(planBytes),
  studyHash: hash(await readFile(new URL(import.meta.url))),
  methods: Object.fromEntries(
    await Promise.all(
      ['pixels', 'edges', 'lettering-metrics', 'lettering-contrast', 'component-offset'].map(
        async (name) => [name, hash(await readFile(new URL(`./${name}.mjs`, import.meta.url)))],
      ),
    ),
  ),
  captures: Object.fromEntries(
    Object.entries(captures).map(([key, value]) => [
      key,
      { hash: value.hash, rendererHash: value.data.rendererHash },
    ]),
  ),
  scope:
    'Fixed raw normalization and identical printing inputs. Offset peaks are diagnostics only; no scan fitting. These component scores are not percentages of rendering accuracy. Windows can contain nearby type or frame ink; review regressions and uncertain offsets.',
  summary,
  rows,
  timing: {
    milliseconds: performance.now() - started,
    scope: 'CPU cached PNG comparison, no Chromium or GPU work.',
  },
};
await writeJson(`${fixtureRoot}/set-symbol-${run}-${cohort}-measurement.json`, report);
console.log(JSON.stringify(summary, null, 2));
