import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import {
  root,
  outputRoot,
  fixtureRoot,
  cacheRoot,
  readJson,
  writeJson,
  sourceHash,
  hash,
  atomicWrite,
} from './common.mjs';
import { openBrowser } from './browser.mjs';
import { readPng, normalize, cropGray } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';
import { measureWindows, windowDifference } from './window-geometry.mjs';
import { measureScanFrame, scanTranslation } from './scan-translation.mjs';
const [set, action = 'compare', sourceRoot = root] = process.argv.slice(2),
  plan = await readJson(`${fixtureRoot}/normal-window-plan.json`);
assert.ok(plan.sets[set]);
assert.ok(['compare', 'capture', 'baseline'].includes(action));
const spec = plan.sets[set],
  inputRoot = `${outputRoot}/${set}/${spec.sourceStudy}`,
  input = await readJson(`${inputRoot}/capture.json`),
  cards = spec.cards.map((c) => {
    const row = input.results.find((r) => r.id === c.id);
    assert.equal(row.images.reference.sha256, c.referenceHash);
    return row;
  });
const beforeRoot = `${outputRoot}/${set}/window-before`,
  afterRoot = `${outputRoot}/${set}/window-after`;
if (action !== 'compare') {
  const directory = action === 'baseline' ? beforeRoot : afterRoot,
    rendererHash = await sourceHash(`${sourceRoot}/games/magic/src`),
    rows = [];
  if (action === 'baseline')
    assert.equal(rendererHash, plan.baselineRendererHash, 'Use the frozen baseline checkout');
  await mkdir(directory, { recursive: true });
  const session = await openBrowser(await readJson(`${cacheRoot}/sets/${set}.json`), {
    sourceRoot,
  });
  try {
    for (const card of cards) {
      const variants = await session.page.evaluate(async (face) => {
        const api = await import('/games/magic/src/presentation/canvas-face.ts'),
          out = [];
        for (const tier of ['inspect', 'table']) {
          const canvas = await api.composeCardTexture(
            { face, printingId: null, printedImage: null },
            tier,
            new AbortController().signal,
          );
          out.push({ tier, data: canvas.toDataURL() });
          canvas.width = canvas.height = 0;
        }
        return out;
      }, card.face);
      for (const v of variants) {
        const bytes = Buffer.from(v.data.split(',')[1], 'base64'),
          file = `${card.id}.${v.tier}.png`;
        await atomicWrite(`${directory}/${file}`, bytes);
        rows.push({ id: card.id, tier: v.tier, file, sha256: hash(bytes) });
      }
      console.log(`${set} windows: ${card.collectorNumber} ${card.name}`);
    }
    assert.deepEqual(session.faults, []);
    assert.equal(await sourceHash(`${sourceRoot}/games/magic/src`), rendererHash);
    await writeJson(`${directory}/capture.json`, { rendererHash, rows });
  } finally {
    await session.close();
  }
  if (action === 'baseline') process.exit(0);
}
const before = await readJson(`${beforeRoot}/capture.json`),
  after = await readJson(`${afterRoot}/capture.json`),
  profileSet = set === 'm15' ? 'm15' : 'war',
  profile = await readJson(`${fixtureRoot}/scan-normalization-${profileSet}-profile.json`);
assert.equal(before.rendererHash, plan.baselineRendererHash);
const regions = {
    type: [[40, 388, 348, 27]],
    art: [
      [28, 90, 16, 280],
      [441, 90, 20, 280],
    ],
    rules: [
      [27, 440, 14, 150],
      [445, 440, 17, 150],
    ],
  },
  rows = [];
for (const card of cards) {
  const rawSource = await readPng(`${inputRoot}/${card.images.reference.file}`),
    raw = normalize(rawSource),
    registration = /Legendary/.test(card.face.typeLine)
      ? null
      : scanTranslation(measureScanFrame(raw), profile.template),
    normalized = normalize(rawSource, registration?.transform),
    scores = {};
  for (const tier of ['inspect', 'table']) {
    scores[tier] = {};
    for (const [revision, capture, directory] of [
      ['before', before, beforeRoot],
      ['after', after, afterRoot],
    ]) {
      const asset = capture.rows.find((r) => r.id === card.id && r.tier === tier),
        bytes = await readFile(`${directory}/${asset.file}`);
      assert.equal(hash(bytes), asset.sha256);
      const rendered = normalize(await readPng(`${directory}/${asset.file}`)),
        windows = measureWindows(rendered);
      const modes = {};
      for (const [mode, reference] of [
        ['raw', raw],
        ['normalized', normalized],
      ]) {
        const metrics = {};
        for (const [component, rects] of Object.entries(regions)) {
          const m = rects.map((rect) => {
            const a = cropGray(reference, rect),
              b = cropGray(rendered, rect);
            return compareRegion(a.gray, b.gray, a.width, a.height);
          });
          metrics[component] = {
            f1: median(m.map((v) => v.edgeF1?.[1] ?? 0)),
            distance: median(m.map((v) => v.meanDistance)),
          };
        }
        modes[mode] = {
          metrics,
          windowDifference: windowDifference(measureWindows(reference), windows),
        };
      }
      // Alpha shape is evaluated separately from color, print grain and frame ink.
      let error = 0,
        count = 0;
      for (let y = 0; y < 680; y++)
        for (let x = 0; x < 488; x++) {
          if (Math.min(x, 487 - x) >= 35 || Math.min(y, 679 - y) >= 35) continue;
          const i = (y * 488 + x) * 4 + 3;
          error += Math.abs(raw.data[i] - rendered.data[i]);
          count++;
        }
      scores[tier][revision] = { sha256: asset.sha256, cornerAlphaMAE: error / count, ...modes };
    }
  }
  rows.push({
    id: card.id,
    number: card.collectorNumber,
    name: card.name,
    referenceHash: card.images.reference.sha256,
    registration,
    scores,
  });
}
const summary = {};
for (const tier of ['inspect', 'table'])
  for (const mode of ['raw', 'normalized'])
    for (const component of Object.keys(regions)) {
      const b = rows.map((r) => r.scores[tier].before[mode].metrics[component].f1),
        a = rows.map((r) => r.scores[tier].after[mode].metrics[component].f1);
      summary[`${tier}-${mode}-${component}`] = {
        before: median(b),
        after: median(a),
        gains: a.filter((v, i) => v - b[i] > 0.02).length,
        regressions: rows.flatMap((r, i) =>
          a[i] - b[i] < -0.02 ? [{ number: r.number, name: r.name, delta: a[i] - b[i] }] : [],
        ),
      };
    }
await writeJson(`${fixtureRoot}/normal-window-${set}-measurement.json`, {
  schemaVersion: 1,
  scope:
    'Two tiers, fixed component strips, raw and frozen-frame translation diagnostics. Translation profile transfers unchanged from WAR to M19/M20/M21 and is not re-fit. Unreliable axes remain zero; legendary scans remain raw. Corner alpha scores use raw scans. Width and center diagnostics are separate from overlap; textured/color-split frame mismatches remain flagged.',
  planHash: hash(JSON.stringify(plan)),
  baselineRendererHash: before.rendererHash,
  rendererHash: after.rendererHash,
  profileSet,
  profileHash: hash(JSON.stringify(profile)),
  methods: Object.fromEntries(
    await Promise.all(
      ['window-geometry', 'scan-translation', 'pixels', 'edges', 'metrics'].map(async (name) => [
        name,
        hash(await readFile(new URL(`./${name}.mjs`, import.meta.url))),
      ]),
    ),
  ),
  regions,
  summary,
  rows,
});
console.log(set, rows.length, JSON.stringify(summary));
