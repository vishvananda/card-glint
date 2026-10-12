import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fixtureRoot, outputRoot, readJson, writeJson, hash } from './common.mjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';
import {
  measureScanFrame,
  scanTranslationTemplate,
  scanTranslation,
  SCAN_TRANSLATION_VERSION,
} from './scan-translation.mjs';

const set = process.argv[2];
assert.ok(['war', 'm15'].includes(set));
const directory = `${outputRoot}/${set}/symbol-topology-all-after`,
  captureBytes = await readFile(`${directory}/capture.json`),
  capture = JSON.parse(captureBytes),
  plan = await readJson(`${fixtureRoot}/set-symbol-topology-plan.json`),
  sourceHash = hash(await readFile(new URL('./scan-translation.mjs', import.meta.url))),
  cacheDirectory = `${outputRoot}/${set}/scan-normalization`;
const eligible = (r) => !r.issue && r.frame === 'normal' && !/Legendary/.test(r.face.typeLine);
const development = capture.results.filter(
  (r) => eligible(r) && plan.sets[set].development.some((d) => d.id === r.id),
);
async function raster(asset) {
  const bytes = await readFile(`${directory}/${asset.file}`);
  assert.equal(hash(bytes), asset.sha256);
  return PNG.sync.read(bytes, { checkCRC: true });
}
const samples = [];
for (const card of development)
  samples.push(measureScanFrame(normalize(await raster(card.images.inspect))));
const template = scanTranslationTemplate(samples);
const profile = {
  version: SCAN_TRANSLATION_VERSION,
  detectorHash: sourceHash,
  scope:
    'Normal modern frames without legendary crowns. Frame-only baseline template frozen before title/body candidates. Translation only; no component, scale or rotation fitting. Raw metrics remain alongside normalized metrics. Art edges determine y; opposing outer rails determine x. Lower rules edge is diagnostic only because holo-stamp treatments change it.',
  set,
  rendererHash: capture.rendererHash,
  captureHash: hash(captureBytes),
  development: development.map((r) => ({
    id: r.id,
    number: r.collectorNumber,
    renderedHash: r.images.inspect.sha256,
  })),
  template,
};
await writeJson(`${fixtureRoot}/scan-normalization-${set}-profile.json`, profile);
const rows = [],
  started = performance.now();
const regions = {
  title: [38, 34, 309, 29],
  rules: [41, 430, 403, 190],
  symbol: set === 'war' ? [417, 385, 36, 36] : [393, 386, 60, 34],
};
for (const card of capture.results) {
  if (!eligible(card)) {
    rows.push({
      id: card.id,
      number: card.collectorNumber,
      name: card.name,
      status: 'unsupported-frame',
    });
    continue;
  }
  const source = await raster(card.images.reference),
    raw = normalize(source),
    landmarks = measureScanFrame(raw),
    registration = scanTranslation(landmarks, template),
    aligned = normalize(source, registration.transform),
    rendered = normalize(await raster(card.images.inspect)),
    scores = {};
  for (const [name, rect] of Object.entries(regions)) {
    const b = cropGray(rendered, rect);
    scores[name] = {};
    for (const [mode, image] of [
      ['raw', raw],
      ['normalized', aligned],
    ]) {
      const a = cropGray(image, rect),
        m = compareRegion(a.gray, b.gray, a.width, a.height);
      scores[name][mode] = {
        status: m.status,
        edgeF1: m.edgeF1?.[1] ?? null,
        meanDistance: m.meanDistance,
        censusSimilarity: m.censusSimilarity,
      };
    }
  }
  rows.push({
    id: card.id,
    number: card.collectorNumber,
    name: card.name,
    status: 'measured',
    cohort: development.some((r) => r.id === card.id) ? 'template' : 'validation',
    referenceHash: card.images.reference.sha256,
    renderedHash: card.images.inspect.sha256,
    registration,
    landmarks,
    scores,
  });
  if (rows.length % 25 === 0)
    console.log(`${set}: normalized ${rows.length}/${capture.results.length}`);
}
const measured = rows.filter((r) => r.status === 'measured');
const summary = {
  measured: measured.length,
  unsupported: rows.length - measured.length,
  accepted: Object.fromEntries(
    ['x', 'y'].map((axis) => [
      axis,
      measured.filter((r) => r.registration.axes[axis].status === 'accepted').length,
    ]),
  ),
  scores: Object.fromEntries(
    Object.keys(regions).map((region) => [
      region,
      Object.fromEntries(
        ['raw', 'normalized'].map((mode) => [
          mode,
          median(measured.map((r) => r.scores[region][mode].edgeF1).filter(Number.isFinite)),
        ]),
      ),
    ]),
  ),
};
await writeJson(`${fixtureRoot}/scan-normalization-${set}-measurement.json`, {
  schemaVersion: 1,
  profileHash: hash(JSON.stringify(profile)),
  captureHash: hash(captureBytes),
  studyHash: hash(await readFile(new URL(import.meta.url))),
  methods: Object.fromEntries(
    await Promise.all(
      ['scan-translation', 'pixels', 'edges', 'metrics'].map(async (name) => [
        name,
        hash(await readFile(new URL(`./${name}.mjs`, import.meta.url))),
      ]),
    ),
  ),
  scope: profile.scope,
  regions,
  summary,
  rows,
  timing: {
    milliseconds: performance.now() - started,
    scope:
      'CPU PNG decoding, frame landmarks and raw/normalized structural metrics. No Chromium or GPU work.',
  },
});
await writeJson(`${cacheDirectory}/latest.json`, { profile, summary });
console.log(JSON.stringify({ set, summary }));
